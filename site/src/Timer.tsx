import * as React from "react";
import { timeSince, inspPenalty } from "./Util";
import { Time, Penalty, TimerPhase } from "./Types";
import ScrambleText from "./ScrambleText";
import ScoreCard from "./ScoreCard";
import StatsCard from "./StatsCard";
import TimerDisplay from "./TimerDisplay";
import HistoryCard from "./HistoryCard";
import * as workerPath from "file-loader?name=[name].js!./test.worker";

interface Model {
    startTime: number;
    elapsed: number;
    phase: TimerPhase;
    penalty?: Penalty;
    bucket: Time[];
    scramble: string;
    next_scramble: string;
    history: Time[][];
}

declare global {
    interface Window {
        puzzles: any;
    }
}

window.puzzles = window.puzzles || {};

class Timer extends React.Component<{}, Model> {
    private intervalID: number;
    private scrambleWorker = new Worker(workerPath);

    constructor(props: {}) {
        super(props);
        this.state = {
            startTime: 0,
            elapsed: 0,
            phase: { name: "waiting" },
            penalty: undefined,
            bucket: [],
            scramble: "Loading scramble...",
            next_scramble: "Error loading scramble.",
            history: [
                [
                    { ms: 100390, pen: undefined },
                    { ms: 80900, pen: undefined },
                    { ms: 130340, pen: undefined },
                    { ms: 110010, pen: undefined },
                    { ms: 116850, pen: undefined },
                ],
            ],
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.intervalID = 0;

        this.scrambleWorker.addEventListener("message", message => {
            this.setState({ next_scramble: message.data });
        });
    }

    public componentDidMount() {
        this.intervalID = window.setInterval(() => this.tick(), 1);

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    public componentWillUnmount() {
        window.clearInterval(this.intervalID);

        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    private handleKeyDown(event: any) {
        this.setState((state, props) => {
            let nextState: Model;
            switch (state.phase.name) {
                case "inspecting":
                    // only spacebar should ready the timer
                    nextState =
                        event.code === "Space"
                            ? {
                                  ...state,
                                  phase: { name: "red", timeTurnedRed: Date.now() },
                              }
                            : {
                                  ...state,
                              };
                    break;
                case "running":
                    let timeToSave = { ms: state.elapsed, pen: state.penalty };

                    nextState = {
                        ...state,
                        phase: { name: "stopped" },
                        bucket:
                            state.bucket.length >= 5
                                ? [timeToSave]
                                : state.bucket.concat([timeToSave]),
                        history:
                            state.bucket.length >= 5
                                ? state.history.concat([state.bucket])
                                : state.history,
                        scramble: state.next_scramble,
                        next_scramble: "Error loading scramble.",
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
                    this.scrambleWorker.postMessage("333");
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

    public render() {
        return (
            <div className="flex items-start justify-between">
                <div className="flex flex-column vh-100 justify-between w-25 outline">
                    <StatsCard />
                    <HistoryCard hist={this.state.history} />
                </div>

                <div className="flex flex-column justify-between vh-100 outline">
                    <ScrambleText scramble={this.state.scramble} />
                    <TimerDisplay
                        ms={this.state.elapsed}
                        phase={this.state.phase}
                        pen={this.state.penalty}
                    />
                    <ScoreCard times={this.state.bucket} />
                </div>

                <div className="flex flex-column vh-100 justify-between w-25 outline">
                    <div id="scramble_image" className="outline tc" />
                    <div className="outline tc"> Settings </div>
                </div>
            </div>
        );
    }
}

export default Timer;
