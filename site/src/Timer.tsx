import * as React from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import {
    timeSince,
    timeToJson,
    timeToRaw,
    timeFromJson,
    bucketToJsonAvg,
    isFaster,
    compareTimes,
} from "./Util";
import { Time, Penalty, JsonAvg, TimerPhase, WhichScramble, Event, StatsRecord } from "./Types";
import ScrambleText from "./ScrambleText";
import ScoreCard from "./ScoreCard";
import StatsCard from "./StatsCard";
import { inspPenalty, TimerDisplay } from "./TimerDisplay";
import HistoryCard from "./HistoryCard";
import HistoryDetail from "./HistoryDetail";
import EventPicker from "./EventPicker";
import SignInForm from "./SignInForm";
import WCACard from "./WCACard";
import SettingsCard from "./SettingsCard";

interface Model {
    user: firebase.User | null;
    wca_id: string;
    startTime: number;
    elapsed: number;
    phase: TimerPhase;
    penalty?: Penalty;
    bucket: Time[];
    scramble: string;
    // scramble_img: React.SVGProps<SVGSVGElement>;
    scramble_img: { __html: string };
    current_event: Event;
    history: { [id: string]: JsonAvg };
    last_hist_doc?: firebase.firestore.QueryDocumentSnapshot;
    inspect_avg?: string;
    cur_event_listeners: Function[];
    auth_listener: firebase.Unsubscribe;
    stats: StatsRecord;
    window_width: number;
}

declare var getScramble: any;

class Timer extends React.PureComponent<{}, Model> {
    private intervalID: number;
    private db = firebase.firestore();

    constructor(props: {}) {
        super(props);

        const unsub_auth = firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user });
            this.subscribe_to_event(this.state.current_event);
        });

        this.state = {
            user: null,
            wca_id: "",
            startTime: 0,
            elapsed: 0,
            phase: { name: "waiting" },
            penalty: undefined,
            bucket: [],
            scramble: "Loading scramble...",
            scramble_img: { __html: "" },
            current_event: { name: "3x3x3", avg_size: 5, scramble_str: "333", wca_db_str: "333" },
            history: {},
            cur_event_listeners: [],
            auth_listener: unsub_auth,
            stats: {
                pb_single: -2,
                pb_single_loc: "",
                pb_avg: null,
                pb_avg_loc: null,
            },
            window_width: window.innerWidth,
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
        this.changeEvent = this.changeEvent.bind(this);
        this.changeWCAId = this.changeWCAId.bind(this);
        this.loadMoreHistory = this.loadMoreHistory.bind(this);
        this.toggle_last_penalty = this.toggle_last_penalty.bind(this);
        this.delete_last_time = this.delete_last_time.bind(this);
        this.delete_avg = this.delete_avg.bind(this);
        this.inspect_avg = this.inspect_avg.bind(this);
        this.uninspect_avg = this.uninspect_avg.bind(this);

        this.intervalID = 0;
    }

    public componentDidMount() {
        this.intervalID = window.setInterval(() => this.tick(), 1);

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        document.addEventListener("touchstart", this.handleTouchStart);
        document.addEventListener("touchend", this.handleTouchEnd);

        window.addEventListener("resize", this.handleWindowSizeChange);

        document.addEventListener("selectstart", () => {
            return false;
        });
    }

    public componentWillUnmount() {
        window.clearInterval(this.intervalID);

        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);

        window.removeEventListener("resize", this.handleWindowSizeChange);

        document.addEventListener("selectstart", () => {
            return false;
        });

        // stop listening to any firestore docs
        for (var unsub_func of this.state.cur_event_listeners) {
            unsub_func();
        }

        this.state.auth_listener();
    }

    private subscribe_to_event(e: Event) {
        this.setState({
            scramble: getScramble(e.scramble_str),
        });

        // unsub from previous event
        for (var unsub_func of this.state.cur_event_listeners) {
            unsub_func();
        }

        if (this.state.user === null) {
            return;
        } else {
            const target_event_doc = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(e.wca_db_str);

            // Fetch event history
            const unsub_history = target_event_doc
                .collection("Avgs")
                .orderBy("timestamp", "desc")
                .limit(25)
                .onSnapshot(snap => {
                    const avgs = snap.docs.map(doc => doc.data() as JsonAvg);
                    const doc_ids = snap.docs.map(doc => doc.id);

                    let new_hist: { [id: string]: JsonAvg } = {};
                    doc_ids.forEach((id, i) => (new_hist[id] = avgs[i]));

                    this.setState({
                        history: new_hist,
                        last_hist_doc: snap.docs[snap.docs.length - 1],
                    });
                });

            // Fetch current average
            const unsub_bucket = target_event_doc.onSnapshot(snap => {
                let bucket_times = [];

                if (snap.get("bucket") !== undefined) {
                    bucket_times = snap.get("bucket").map(timeFromJson);
                }

                this.setState({
                    bucket: bucket_times,
                });
            });

            this.setState((state, props) => {
                return { ...state, cur_event_listeners: [unsub_bucket, unsub_history] };
            });

            // Fetch event stats
            const unsub_stats = target_event_doc.onSnapshot(snap => {
                const saved = snap.get("stats");
                if (saved === undefined) {
                    this.setState({
                        stats: {
                            pb_single: -2,
                            pb_single_loc: "",
                            pb_avg: null,
                            pb_avg_loc: null,
                        },
                    });
                } else {
                    this.setState({
                        stats: {
                            pb_single: saved.pb_single === undefined ? -2 : saved.pb_single,
                            pb_single_loc:
                                saved.pb_single_loc === undefined ? "" : saved.pb_single_loc,
                            pb_avg: saved.pb_avg === undefined ? null : saved.pb_avg,
                            pb_avg_loc: saved.pb_avg_loc === undefined ? null : saved.pb_avg_loc,
                        },
                    });
                }
            });
        }
    }

    private loadMoreHistory() {
        if (this.state.user === null) {
            alert("Error (loadMoreHistory): User is null");
            return;
        } else {
            const target_event_doc = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(this.state.current_event.wca_db_str);

            target_event_doc
                .collection("Avgs")
                .orderBy("timestamp", "desc")
                .limit(25)
                .startAfter(this.state.last_hist_doc)
                .get()
                .then(snap => {
                    if (snap.docs.length === 0) {
                        return;
                    }

                    const new_avgs = snap.docs.map(doc => doc.data() as JsonAvg);
                    const new_keys = snap.docs.map(doc => doc.id);
                    let new_hist: { [id: string]: JsonAvg } = {};
                    new_keys.forEach((id, i) => (new_hist[id] = new_avgs[i]));

                    this.setState((state, props) => {
                        return {
                            history: Object.assign({}, state.history, new_hist),
                            last_hist_doc: snap.docs[snap.docs.length - 1],
                        };
                    });
                });
        }
    }

    private saveTimeToDB(t: Time): void {
        // if there's no current user the time is discarded
        if (this.state.user === null) {
            alert("Error (saveTimeToDB): User is null");
        } else {
            // this function is called right before setstate, so we need to
            // manually compute what the bucket will look like on the next render
            const bucket_is_full = this.state.bucket.length === this.state.current_event.avg_size;
            const next_bucket = bucket_is_full ? [t] : this.state.bucket.concat([t]);
            const bucket_json = next_bucket.map(timeToJson);

            // get a path to the db document for the current event
            const current_event_doc = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(this.state.current_event.wca_db_str);

            // if we finished an avg, save it to the db
            const new_time = timeToRaw(t);
            const pb_single = this.state.stats.pb_single;
            const pb_single_loc = this.state.stats.pb_single_loc;
            const pb_avg = this.state.stats.pb_avg;
            const pb_avg_loc = this.state.stats.pb_avg_loc;

            if (bucket_is_full) {
                const avg_json = bucketToJsonAvg(this.state.bucket);
                current_event_doc
                    .collection("Avgs")
                    .add(avg_json)
                    .then(avg_doc_ref => {
                        // if the current pb single is in the bucket and not
                        // about to be beaten by the new time, update its location
                        // (checking now saves a query if we did just break the pb)
                        if (pb_single_loc === "bucket" && isFaster(pb_single, new_time)) {
                            current_event_doc.set(
                                {
                                    stats: {
                                        pb_single_loc: avg_doc_ref.id,
                                    },
                                },
                                { merge: true }
                            );
                        }

                        // Check for a new PB avg and update stats if necessary
                        if (pb_avg === null || isFaster(avg_json.avg, pb_avg)) {
                            current_event_doc.set(
                                {
                                    stats: {
                                        pb_avg: avg_json.avg,
                                        pb_avg_loc: avg_doc_ref.id,
                                    },
                                },
                                { merge: true }
                            );
                        }
                    });
            }

            // Check for a new PB single and update stats if necessary
            if (pb_single === -2 || isFaster(new_time, pb_single)) {
                current_event_doc.set(
                    {
                        stats: {
                            pb_single: new_time,
                            pb_single_loc: "bucket",
                        },
                    },
                    { merge: true }
                );
            }

            // add the new time to the db
            current_event_doc.set(
                {
                    bucket: bucket_json,
                },
                { merge: true }
            );
        }
    }

    private toggle_last_penalty(pen: Penalty) {
        if (this.state.user === null) {
            alert("Error (toggle_last_penalty): User is null");
        } else {
            const old_bucket = this.state.bucket.slice();
            const old_time = old_bucket.pop();

            // there must be a previous solve to penalize
            if (old_time === undefined) {
                console.error("Tried to toggle penalty with no previous solve");
                return;
            }

            const old_pen = old_time!.pen;
            const new_time =
                pen === old_pen
                    ? { raw: old_time!.raw, pen: undefined }
                    : { raw: old_time!.raw, pen: pen };

            const new_bucket = old_bucket.concat([new_time]);
            const new_bucket_json = new_bucket.map(timeToJson);

            // get a path to the db document for the current event
            const current_event_doc = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(this.state.current_event.wca_db_str);

            current_event_doc
                .set(
                    {
                        bucket: new_bucket_json,
                    },
                    { merge: true }
                )
                .then(() => {
                    this.recompute_pb_single(new_bucket);
                });
        }
    }

    // compute the pb single over the history of averages and the bucket passed in
    private recompute_pb_single(bucket: Time[]) {
        if (this.state.user === null) {
            alert("Error (recompute_pb_single): User is null");
        } else {
            // find the best single currently in the bucket
            let best_in_bucket = -2; // recall -2 means "no pb single exists"
            if (bucket.length !== 0) {
                best_in_bucket = -1;
                for (let t of bucket.map(timeToRaw)) {
                    if (isFaster(t, best_in_bucket)) {
                        best_in_bucket = t;
                    }
                }
            }

            // find the best single in any stored average
            const current_event_doc = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(this.state.current_event.wca_db_str);
            current_event_doc
                .collection("Avgs")
                .orderBy("best", "asc")
                .limit(1)
                .get()
                .then(snap => {
                    if (snap.docs.length === 0) {
                        // if there are no stored avgs, bucket pb wins
                        current_event_doc.set(
                            {
                                stats: {
                                    pb_single: best_in_bucket,
                                    pb_single_loc: "bucket",
                                },
                            },
                            { merge: true }
                        );
                    } else if (best_in_bucket === -2) {
                        // if there are stored avgs and bucket pb doesn't exist, avg pb wins
                        const containing_avg = snap.docs[0].data() as JsonAvg;
                        const best_in_hist = containing_avg.best;

                        current_event_doc.set(
                            {
                                stats: {
                                    pb_single: best_in_hist,
                                    pb_single_loc: snap.docs[0].id,
                                },
                            },
                            { merge: true }
                        );
                    } else {
                        // else, compare the best pb from an avg with bucket pb
                        const containing_avg = snap.docs[0].data() as JsonAvg;
                        const best_in_hist = containing_avg.best;

                        current_event_doc.set(
                            isFaster(best_in_bucket, best_in_hist)
                                ? {
                                      stats: {
                                          pb_single: best_in_bucket,
                                          pb_single_loc: "bucket",
                                      },
                                  }
                                : {
                                      stats: {
                                          pb_single: best_in_hist,
                                          pb_single_loc: snap.docs[0].id,
                                      },
                                  },
                            { merge: true }
                        );
                    }
                });
        }
    }

    // compute the pb single over the history of averages and the bucket passed in
    private recompute_pb_avg() {
        if (this.state.user === null) {
            alert("Error (recompute_pb_avg): User is null");
        } else {
            // find the best stored average
            const current_event_doc = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(this.state.current_event.wca_db_str);
            current_event_doc
                .collection("Avgs")
                .orderBy("avg", "asc")
                .limit(1)
                .get()
                .then(snap => {
                    if (snap.docs.length === 0) {
                        // if there are no stored avgs, pb avg doesn't exist
                        current_event_doc.set(
                            {
                                stats: {
                                    pb_avg: null,
                                    pb_avg_loc: null,
                                },
                            },
                            { merge: true }
                        );
                    } else {
                        // update the stats with the new best avg
                        const new_pb_avg = snap.docs[0].data() as JsonAvg;
                        current_event_doc.set(
                            {
                                stats: {
                                    pb_avg: new_pb_avg.avg,
                                    pb_avg_loc: snap.docs[0].id,
                                },
                            },
                            { merge: true }
                        );
                    }
                });
        }
    }

    private delete_last_time() {
        if (this.state.user === null) {
            alert("Error (delete_last_time): User is null");
        } else {
            // delete the most recent time
            let new_bucket = this.state.bucket.slice();
            const deleted_time = new_bucket.pop();

            // get a path to the db document for the current event
            const current_event_doc = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(this.state.current_event.wca_db_str);

            // update the bucket
            current_event_doc.set(
                {
                    bucket: new_bucket.map(timeToJson),
                },
                { merge: true }
            );

            // recompute the pb single if we just deleted it
            if (timeToRaw(deleted_time!) === this.state.stats.pb_single) {
                this.recompute_pb_single(new_bucket);
            }
        }
    }

    private delete_avg(id: string) {
        if (this.state.user === null) {
            alert("Error (delete_avg): User is null");
        } else {
            const hist_ref = this.db
                .collection("Users")
                .doc(this.state.user.uid)
                .collection("Events")
                .doc(this.state.current_event.wca_db_str)
                .collection("Avgs");
            hist_ref
                .doc(id)
                .delete()
                .then(() => {
                    // recompute pb single if we just deleted it
                    if (id === this.state.stats.pb_single_loc) {
                        this.recompute_pb_single(this.state.bucket);
                    }
                    // recompute pb avg if we just deleted it
                    if (id === this.state.stats.pb_avg_loc) {
                        this.recompute_pb_avg();
                    }
                });
        }
    }

    private handleTouchStart(event: TouchEvent) {
        this.setState((state, props) => {
            let nextstate: Model;
            switch (state.phase.name) {
                case "inspecting":
                    nextstate = {
                        ...state,
                        phase: { name: "red", timeTurnedRed: Date.now() },
                    };
                    break;

                case "running":
                    let timetosave = {
                        // convert to centiseconds
                        raw: Math.floor(state.elapsed / 10),
                        pen: state.penalty,
                    };

                    nextstate = {
                        ...state,
                        phase: { name: "stopped" },
                        scramble: getScramble(state.current_event.scramble_str),
                    };

                    this.saveTimeToDB(timetosave);
                    break;

                default:
                    nextstate = {
                        ...state,
                    };
                    break;
            }

            return nextstate;
        });
    }

    private handleTouchEnd(event: TouchEvent) {
        this.setState((state, props) => {
            let nextState: Model;
            switch (state.phase.name) {
                case "waiting":
                    if (
                        event.target === document.getElementById("timer_main") ||
                        event.target === document.getElementById("timer_text")
                    ) {
                        nextState = {
                            ...state,
                            startTime: Date.now(),
                            phase: { name: "inspecting" },
                        };
                    } else {
                        nextState = state;
                    }
                    break;
                case "red":
                    nextState = {
                        ...state,
                        phase: { name: "inspecting" },
                    };
                    break;
                case "green":
                    // start the solve phase
                    nextState = {
                        ...state,
                        startTime: Date.now(),
                        elapsed: 0,
                        phase: { name: "running" },
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

    private handleKeyDown(event: KeyboardEvent) {
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
                        pen: state.penalty,
                    };

                    nextState = {
                        ...state,
                        phase: { name: "stopped" },
                        scramble: getScramble(state.current_event.scramble_str),
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

    private handleKeyUp(event: KeyboardEvent) {
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
            this.setState({
                current_event: selected,
            });
            this.subscribe_to_event(selected);
        } else {
            console.log("Invalid input to event select handler.");
        }
    }

    private changeWCAId(e: React.FormEvent<HTMLFormElement>, new_id: string): void {
        this.setState({ wca_id: new_id });
        e.preventDefault();
    }

    // all times from history and bucket, from least to most recent
    private all_times_raw_array(): number[] {
        // TODO: check for sorting bugs
        const bucket_times = this.state.bucket.map(t => timeToRaw(t));
        const compare_by_timestamp = (avg1: JsonAvg, avg2: JsonAvg) => {
            const d1 = avg1.timestamp.toDate();
            const d2 = avg2.timestamp.toDate();
            if (d1 < d2) {
                return 1;
            } else if (d1 > d2) {
                return -1;
            } else {
                return 0;
            }
        };

        const hist_times = Object.values(this.state.history)
            .sort(compare_by_timestamp)
            .flatMap(avg => avg.times);

        return hist_times.concat(bucket_times);
    }

    private inspect_avg(avg_id: string) {
        this.setState({
            inspect_avg: avg_id,
        });
    }

    private uninspect_avg() {
        this.setState({
            inspect_avg: undefined,
        });
    }

    private handleWindowSizeChange() {
        this.setState({
            window_width: window.innerWidth,
        });
    }

    public render() {
        const is_mobile = this.state.window_width <= 500;
        if (!is_mobile) {
            return (
                <section className="flex items-start justify-between w-100 overflow-hidden vh-100">
                    <div className="flex flex-column vh-100 justify-between w-25 outline">
                        <div className="outline">
                            <EventPicker
                                onChange={this.changeEvent}
                                isDisabled={this.state.phase.name !== "waiting"}
                            />
                            <StatsCard
                                event={this.state.current_event}
                                stats={this.state.stats}
                                inspect_func={this.inspect_avg}
                            />
                        </div>
                        <HistoryCard
                            hist={this.state.history}
                            load_more_func={this.loadMoreHistory}
                            inspect_func={this.inspect_avg}
                        />
                    </div>

                    <div className="flex flex-column justify-between vh-100 w-50 outline">
                        {this.state.inspect_avg === undefined ? (
                            <React.Fragment>
                                <ScrambleText
                                    scramble={this.state.scramble}
                                    event={this.state.current_event}
                                />
                                <TimerDisplay
                                    ms={this.state.elapsed}
                                    phase={this.state.phase}
                                    pen={this.state.penalty}
                                />
                                <div>
                                    <ScoreCard
                                        times={this.state.bucket}
                                        edit_fn={this.toggle_last_penalty}
                                        delete_fn={this.delete_last_time}
                                        avg_size={this.state.current_event.avg_size}
                                    />
                                    <WCACard
                                        event={this.state.current_event}
                                        wca_id={this.state.wca_id}
                                        home_times={this.all_times_raw_array()}
                                    />
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <HistoryDetail
                                    avg_id={this.state.inspect_avg}
                                    avg_json={this.state.history[this.state.inspect_avg]}
                                    delete_func={this.delete_avg}
                                    close_func={this.uninspect_avg}
                                />
                            </React.Fragment>
                        )}
                    </div>

                    <div className="flex flex-column-reverse vh-100 justify-between w-25 outline">
                        <div>
                            <SettingsCard
                                wca_id={this.state.wca_id}
                                id_change_handler={this.changeWCAId}
                            />
                            <SignInForm user={this.state.user} />
                        </div>
                    </div>
                </section>
            );
        } else {
            // mobile UI
            return (
                <section className="flex flex-column justify-between w-100 vh-100 noselect">
                    <div className="w-100 outline">
                        <EventPicker
                            onChange={this.changeEvent}
                            isDisabled={this.state.phase.name !== "waiting"}
                        />
                        <ScrambleText
                            scramble={this.state.scramble}
                            event={this.state.current_event}
                        />
                    </div>

                    <div id="timer_main" className="vh-100 noselect">
                        <TimerDisplay
                            ms={this.state.elapsed}
                            phase={this.state.phase}
                            pen={this.state.penalty}
                        />
                    </div>

                    <div className="w-100 outline">
                        <ScoreCard
                            times={this.state.bucket}
                            edit_fn={this.toggle_last_penalty}
                            delete_fn={this.delete_last_time}
                            avg_size={this.state.current_event.avg_size}
                        />
                        {/*                        <HistoryCard
                            hist={{  }}
                            load_more_func={this.loadMoreHistory}
                            inspect_func={this.inspect_avg}
                        />
*/}{" "}
                        <SignInForm user={this.state.user} />
                    </div>
                </section>
            );
        }
    }
}

export default Timer;
