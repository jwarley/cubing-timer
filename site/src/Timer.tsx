import * as React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import * as workerPath from "file-loader?name=[name].js!./test.worker";
import { timeSince,
         timeToJson,
         timeToRaw,
         timeFromJson,
         bucketToJsonAvg
       } from "./Util";
import { Time, Penalty, JsonAvg, TimerPhase, WhichScramble, Event } from "./Types";
import ScrambleText from "./ScrambleText";
import ScoreCard from "./ScoreCard";
import StatsCard from "./StatsCard";
import { inspPenalty, TimerDisplay } from "./TimerDisplay";
import HistoryCard from "./HistoryCard";
import EventPicker from "./EventPicker";
import SignInForm from "./SignInForm";
import WCACard from "./WCACard";
import SettingsCard from "./SettingsCard";

interface Model {
    user: firebase.User | null;
    startTime: number;
    elapsed: number;
    phase: TimerPhase;
    penalty?: Penalty;
    bucket: Time[];
    scramble: string;
    next_scramble: string;
    current_event: Event;
    history: JsonAvg[];
    hist_keys: string[];
    cur_event_listeners: Function[];
    auth_listener?: Function;
}

declare global {
    interface Window {
        puzzles: any;
    }
}

window.puzzles = window.puzzles || {};

class Timer extends React.PureComponent<{}, Model> {
    private intervalID: number;
    private scrambleWorker = new Worker(workerPath);
    private db = firebase.firestore();

    constructor(props: {}) {
        super(props);
        this.state = {
            user: null,
            startTime: 0,
            elapsed: 0,
            phase: { name: "waiting" },
            penalty: undefined,
            bucket: [],
            scramble: "Loading scramble...",
            next_scramble: "Error loading scramble.",
            current_event: { name: "3x3x3",
                             avg_size: 5,
                             scramble_str: "333",
                             wca_db_str: "333",
                           },
            history: [],
            hist_keys: [],
            cur_event_listeners: [],
            auth_listener: undefined,
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.changeEvent = this.changeEvent.bind(this);
        this.toggle_last_penalty = this.toggle_last_penalty.bind(this);
        this.delete_last = this.delete_last.bind(this);

        this.intervalID = 0;

        this.scrambleWorker.addEventListener("message", message => {
            const scram = message.data[0];
            const shouldCache: Boolean = message.data[1];
            if (shouldCache) {
                this.setState({ next_scramble: scram });
            } else {
                this.setState({ scramble: scram });
            }
        });
    }

    public componentDidMount() {
        this.intervalID = window.setInterval(() => this.tick(), 1);

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        const unsub_auth = firebase.auth().onAuthStateChanged(
            (user) => {
                this.setState({ user: user });
                this.subscribe_to_event(this.state.current_event);
            }
        );

        this.setState((state, props) => {
            return { ...state,
                     auth_listener: unsub_auth,
                   }
        })

    }

    public componentWillUnmount() {

        window.clearInterval(this.intervalID);

        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);

        this.scrambleWorker.terminate();

        // stop listening to any firestore docs
        for (var unsub_func of this.state.cur_event_listeners) {
            unsub_func();
        }

        if (this.state.user !== null) {
            this.state.auth_listener!();
        }

    }

    private subscribe_to_event(e: Event) {
        // unsub from previous event
        for (var unsub_func of this.state.cur_event_listeners) {
            unsub_func();
        }

        if (this.state.user !== null) {
            const target_event_doc = this.db.collection("Users")
                                             .doc(this.state.user.uid)
                                             .collection("Events")
                                             .doc(e.wca_db_str);

            const unsub_history = target_event_doc.collection("Avgs")
                                                  .orderBy("timestamp", "desc")
                                                  .onSnapshot((snap) => {
                const avgs = snap.docs.map((doc) => doc.data() as JsonAvg);
                const doc_ids = snap.docs.map((doc) => doc.id);
                this.setState({ history: avgs, hist_keys: doc_ids });
            })

            const unsub_bucket = target_event_doc.onSnapshot((snap) => {
                let bucket_times = [];

                if (snap.get("bucket") !== undefined) {
                    bucket_times = snap.get("bucket").map(timeFromJson); 
                }

                this.setState({
                    bucket: bucket_times 
                })
            })

            this.setState((state, props) => {
                return { ...state, cur_event_listeners: [unsub_bucket, unsub_history] };
            })
        } else {
            // no user is signed in
            this.setState({ history: [], bucket: [] });
        }
    }

    private saveTimeToDB(t: Time): void {
        // if there's no current user the time is discarded
        if (this.state.user === null) {
            return
        }

        // this function is called right before setState, so we need to
        // manually compute what the bucket will look like on the next render
        const bucket_is_full = this.state.bucket.length === this.state.current_event.avg_size;
        const next_bucket = bucket_is_full ? [t] : this.state.bucket.concat([t]);
        const bucket_json = next_bucket.map(timeToJson);

        // get a path to the db document for the current event
        const current_event_doc = this.db.collection("Users")
                                         .doc(this.state.user.uid)
                                         .collection("Events")
                                         .doc(this.state.current_event.wca_db_str);

        // update the bucket in the db
        current_event_doc.set({ bucket: bucket_json });

        // if we finished an avg, save it to the db
        if (bucket_is_full) {
            const avg_json = bucketToJsonAvg(this.state.bucket);
            current_event_doc.collection("Avgs").add(avg_json)
        }
    }

    private toggle_last_penalty(pen: Penalty) {
        // TODO: change this to behave well with anonymous users
        if (this.state.user === null) {
            return
        }
        
        const old_bucket = this.state.bucket.slice();
        const old_time = old_bucket.pop();

        // undefined behavior if there is no last time
        console.assert(old_time !== undefined);

        const old_pen = old_time!.pen;
        const new_time = pen === old_pen ? { raw: old_time!.raw, pen: undefined }
                                         : { raw: old_time!.raw, pen: pen };

        const new_bucket_json = old_bucket.concat([new_time])
                                          .map(timeToJson);

        // get a path to the db document for the current event
        const current_event_doc = this.db.collection("Users")
                                         .doc(this.state.user.uid)
                                         .collection("Events")
                                         .doc(this.state.current_event.wca_db_str);

        current_event_doc.set({ bucket: new_bucket_json });
    }

    private delete_last() {
        // TODO: change this to behave well with anonymous users
        if (this.state.user === null) {
            return
        }
        
        const old_bucket = this.state.bucket.slice();
        old_bucket.pop();

        const new_bucket_json = old_bucket.map(timeToJson);

        // get a path to the db document for the current event
        const current_event_doc = this.db.collection("Users")
                                         .doc(this.state.user.uid)
                                         .collection("Events")
                                         .doc(this.state.current_event.wca_db_str);

        current_event_doc.set({ bucket: new_bucket_json });
        
    }

    private handleKeyDown(event: any) {
        this.setState((state, props) => {
            let nextState: Model;
            switch (state.phase.name) {
                case "inspecting":
                    nextState =
                        event.code === "Space" // only spacebar should ready the timer
                            ? {
                                  ...state,
                                  phase: { name: "red", timeTurnedRed: Date.now() },
                              }
                            : {
                                  ...state,
                              };
                    break;

                case "running":
                    let timeToSave = {
                        // convert to centiseconds
                        raw: Math.floor(state.elapsed / 10),
                        pen: state.penalty
                    };

                    nextState = {
                        ...state,
                        phase: { name: "stopped" },
                        scramble: state.next_scramble,
                        next_scramble: "Error loading scramble.",
                    };

                    this.saveTimeToDB(timeToSave);
                    break;

                default:
                    nextState = {
                        ...state,
                    };
                    break;
            }

            return nextState;
        });
    }

    private handleKeyUp(event: any) {
        this.setState((state, props) => {
            let nextState: Model;
            switch (state.phase.name) {
                case "waiting":
                    // only spacebar should start inspection
                    nextState =
                        event.code === "Space"
                            ? {
                                  ...state,
                                  startTime: Date.now(),
                                  phase: { name: "inspecting" },
                              }
                            : {
                                  ...state,
                              };
                    this.scrambleWorker.postMessage([state.current_event.scramble_str, true]);
                    break;
                case "red":
                    // only lifting spacebar should return to inspection
                    nextState =
                        event.code === "Space"
                            ? {
                                  ...state,
                                  phase: { name: "inspecting" },
                              }
                            : {
                                  ...state,
                              };
                    break;
                case "green":
                    // start the solve phase
                    nextState =
                        event.code === "Space" // only spacebar should start the timer
                            ? {
                                  ...state,
                                  startTime: Date.now(),
                                  elapsed: 0,
                                  phase: { name: "running" },
                              }
                            : {
                                  ...state,
                              };
                    break;
                case "stopped":
                    nextState = {
                        ...state,
                        phase: { name: "waiting" },
                    };
                    break;
                default:
                    nextState = {
                        ...state,
                    };
                    break;
            }

            return nextState;
        });
    }

    private tick() {
        this.setState((state, props) => {
            let nextState: Model;

            switch (state.phase.name) {
                case "red":
                    if (timeSince(state.phase.timeTurnedRed) >= 550) {
                        nextState = {
                            ...state,
                            elapsed: timeSince(state.startTime),
                            phase: { name: "green" },
                            penalty: inspPenalty(state.elapsed),
                        };
                    } else {
                        nextState = {
                            ...state,
                            elapsed: timeSince(state.startTime),
                            penalty: inspPenalty(state.elapsed),
                        };
                    }
                    break;
                case "inspecting":
                    nextState = {
                        ...state,
                        elapsed: timeSince(state.startTime),
                        penalty: inspPenalty(state.elapsed),
                    };
                    break;
                case "green":
                    nextState = {
                        ...state,
                        elapsed: timeSince(state.startTime),
                        penalty: inspPenalty(state.elapsed),
                    };
                    break;
                case "running":
                    nextState = {
                        ...state,
                        elapsed: timeSince(state.startTime),
                    };
                    break;
                default:
                    nextState = state;
                    break;
            }
            return nextState;
        });
    }

    private changeEvent(selected: Event | Event[] | null | undefined) {
        if (selected && !(selected instanceof Array)) {
            this.setState({ current_event: selected });
            this.scrambleWorker.postMessage([selected.scramble_str, false]);
            this.scrambleWorker.postMessage([selected.scramble_str, true]);

            this.subscribe_to_event(selected);
        } else {
            console.log("Invalid input to event select handler.");
        }
    }

    // all times from history and bucket, from least to most recent
    private all_times_raw_array(): number[] {
        const bucket_times = this.state.bucket.map((t) => timeToRaw(t));
        const hist_times = this.state.history
                                     .slice()
                                     .reverse()
                                     .flatMap((avg) => avg.times);
        return hist_times.concat(bucket_times);
    }

    public render() {
        return (
            <div className="flex items-start justify-between">
                <div className="flex flex-column vh-100 justify-between w-25 outline">
                    <div className="outline">
                        <EventPicker
                            onChange={this.changeEvent}
                            isDisabled={this.state.phase.name !== "waiting"}
                        />
                        <StatsCard />
                    </div>
                    <HistoryCard
                        hist={this.state.history}
                        keys={this.state.hist_keys}
                    />
                </div>

                <div className="flex flex-column justify-between vh-100 w-50 outline">
                    <ScrambleText scramble={this.state.scramble} />
                    <TimerDisplay
                        ms={this.state.elapsed}
                        phase={this.state.phase}
                        pen={this.state.penalty}
                    />
                    <ScoreCard times={this.state.bucket}
                               edit_fn={this.toggle_last_penalty}
                               delete_fn={this.delete_last}
                    />
                    <WCACard
                        event={this.state.current_event}
                        wca_id={"2008WARL01"}
                        home_times={this.all_times_raw_array()}
                    />
                </div>

                <div className="flex flex-column vh-100 justify-between w-25 outline">
                    <div id="scramble_image" className="outline tc" />
                    <SettingsCard />
                    <SignInForm user={this.state.user} />
                </div>
            </div>
        );

    }
}

export default Timer;
