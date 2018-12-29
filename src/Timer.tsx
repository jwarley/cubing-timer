import * as React from "react";
import * as Util from "./Util";
import ScrambleText from "./ScrambleText";
import ScoreCard from "./ScoreCard";

type TimerPhase =
  | { name: "waiting" }
  | { name: "inspecting" }
  | { name: "green" }
  | { name: "red"; timeTurnedRed: number }
  | { name: "running" }
  | { name: "stopped" };

enum Penalty {
  DNF,
  PlusTwo,
}

interface Time {
  ms: number;
  pen?: Penalty;
}

interface TimerState {
  startTime: number;
  elapsed: number;
  phase: TimerPhase;
  bucket: Time[];
}

class Timer extends React.Component<{}, TimerState> {
  private intervalID: number;

  constructor(props: {}) {
    super(props);
    this.state = {
      startTime: 0,
      elapsed: 0,
      phase: { name: "waiting" },
      bucket: [],
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.intervalID = 0;
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
      let nextState: TimerState;
      switch (state.phase.name) {
        case "inspecting":
          // only spacebar should ready the timer
          nextState =
            event.code == "Space"
              ? {
                  ...state,
                  phase: { name: "red", timeTurnedRed: Date.now() },
                }
              : {
                  ...state,
                };
          break;
        case "running":
          this.saveTime();
          nextState = {
            ...state,
            phase: { name: "stopped" },
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
      let nextState: TimerState;
      switch (state.phase.name) {
        case "waiting":
          // only spacebar should start inspection
          nextState =
            event.code == "Space"
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
            event.code == "Space"
              ? {
                  ...state,
                  phase: { name: "inspecting" },
                }
              : {
                  ...state,
                };
          break;
        case "green":
          // only spacebar should start the timer
          nextState =
            event.code == "Space"
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
      let nextState: TimerState;

      switch (state.phase.name) {
        case "red":
          if (Util.timeSince(state.phase.timeTurnedRed) >= 550) {
            nextState = {
              ...state,
              elapsed: Util.timeSince(state.startTime),
              phase: { name: "green" },
            };
          } else {
            nextState = {
              ...state,
              elapsed: Util.timeSince(state.startTime),
            };
          }
          break;
        case "inspecting":
          nextState = {
            ...state,
            elapsed: Util.timeSince(state.startTime),
          };
          break;
        case "green":
          nextState = {
            ...state,
            elapsed: Util.timeSince(state.startTime),
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

  private saveTime(): void {
    let newTime = { ms: this.state.elapsed };
    this.state.bucket.push(newTime);
    console.log(this.state.bucket);
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
      <div className="">
        <ScrambleText />
        <div className={"tc f1 code " + colorClass}>{timeString}</div>
        <ScoreCard times={this.state.bucket} />
      </div>
    );
  }
}

export default Timer;
