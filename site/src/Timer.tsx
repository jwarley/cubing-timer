import * as React from "react";
import { timeSince, inspPenalty } from "./Util";
import { Time, Penalty, TimerPhase } from "./Types";
import ScrambleText from "./ScrambleText";
import ScoreCard from "./ScoreCard";
import StatsCard from "./StatsCard";
import TimerDisplay from "./TimerDisplay";

interface Model {
    startTime: number;
    elapsed: number;
    phase: TimerPhase;
    penalty?: Penalty;
    bucket: Time[];
    scramble: string;
    next_scramble: string;
}

declare global {
    interface Window {
        puzzles: any;
    }
}

window.puzzles = window.puzzles || {};

class Timer extends React.Component<{}, Model> {
    private intervalID: number;

    constructor(props: {}) {
        super(props);
        this.state = {
            startTime: 0,
            elapsed: 0,
            phase: { name: "waiting" },
            penalty: undefined,
            bucket: [],
            scramble: "string from constructor",
            next_scramble: "",
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.intervalID = 0;
    }

    public componentDidMount() {
        this.setState({ scramble: "Loading scramble..." });

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
                        // change this 5 later to the size of an avg for the event
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
                        scramble: window.puzzles["333"].generateScramble(),
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
                    <div className="outline tc">History</div>
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
                    <div className="outline tc"> Scramble image </div>
                    <div className="outline tc"> Settings </div>
                </div>
            </div>
        );
    }
}

export default Timer;
