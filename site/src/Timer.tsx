import * as React from "react";
import * as Util from "./Util";
import { Time, Penalty } from "./Types";
import ScrambleText from "./ScrambleText";
import ScoreCard from "./ScoreCard";
import StatsCard from "./StatsCard";

type TimerPhase =
    | { name: "waiting" }
    | { name: "inspecting" }
    | { name: "green" }
    | { name: "red"; timeTurnedRed: number }
    | { name: "running" }
    | { name: "stopped" };

interface Model {
    startTime: number;
    elapsed: number;
    phase: TimerPhase;
    penalty?: Penalty;
    bucket: Time[];
    scramble: string;
    next_scramble: string;
}

declare var puzzles: any;
// declare var loadScript: any;
declare global {
    interface Window {
        puzzles: any;
    }
}

window.puzzles = window.puzzles || {};

function getNewScramble(): Promise<string> {
    console.log("called getnewscramble");
    let promise: Promise<string> = new Promise(function(resolve, reject) {
        const scram: string = window.puzzles["333"].generateScramble();
        resolve(scram);
    });
    return promise;
}

async function setScramble(){
    //Change this to actually set the scramble
    let promise = getNewScramble();
    let scramble = await promise;
    console.log(scramble);
}

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

    public async componentDidMount() {
        this.setState({ scramble: "Loading..." });
        //setScramble();

        this.intervalID = window.setInterval(() => this.tick(), 1);

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    public componentWillUnmount() {
        window.clearInterval(this.intervalID);

        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    // private writeNewScramble() {
    //     console.log("U CALRED?");
    //     // var scram = puzzles["333"].generateScramble();
    //     var scramble_area: any = document.getElementById("scramble_area");
    //     scramble_area.innerHTML = this.state.next_scramble;
    //     // scramble_area.appendChild(document.createTextNode(scram));
    // }

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
                        scramble: state.next_scramble,
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
                    // cache the next scramble while the timer is running
                    setScramble();
                    nextState.next_scramble = "HUKKKKAKAKAKAKAKA";
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
                    if (Util.timeSince(state.phase.timeTurnedRed) >= 550) {
                        nextState = {
                            ...state,
                            elapsed: Util.timeSince(state.startTime),
                            phase: { name: "green" },
                            penalty: Util.inspPenalty(state.elapsed),
                        };
                    } else {
                        nextState = {
                            ...state,
                            elapsed: Util.timeSince(state.startTime),
                            penalty: Util.inspPenalty(state.elapsed),
                        };
                    }
                    break;
                case "inspecting":
                    nextState = {
                        ...state,
                        elapsed: Util.timeSince(state.startTime),
                        penalty: Util.inspPenalty(state.elapsed),
                    };
                    break;
                case "green":
                    nextState = {
                        ...state,
                        elapsed: Util.timeSince(state.startTime),
                        penalty: Util.inspPenalty(state.elapsed),
                    };
                    break;
                case "running":
                    nextState = {
                        ...state,
                        elapsed: Util.timeSince(state.startTime),
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
        // Set the color of the timer
        let colorClass = "black";
        if (this.state.phase.name === "red") {
            colorClass = "red";
        } else if (this.state.phase.name === "green") {
            colorClass = "green";
        }

        // Pretty-print the timer readout
        let timeString: string;
        if (
            this.state.phase.name === "inspecting" ||
            this.state.phase.name === "red" ||
            this.state.phase.name === "green"
        ) {
            timeString = Util.toInspString(this.state.elapsed);
        } else {
            timeString = Util.timeToString(this.state.elapsed);
        }

        return (
            <div className="flex items-start justify-between">
                <div className="flex flex-column vh-100 justify-between w-25 outline">
                    <StatsCard />
                    <div className="outline tc">History</div>
                </div>

                <div className="flex flex-column justify-between vh-100 outline">
                    <ScrambleText scramble={this.state.scramble} />
                    <div className={"tc f1 code outline " + colorClass}>{timeString}</div>
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
