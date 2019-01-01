import * as React from "react";
import { Penalty, TimerPhase } from "./Types";
import { toInspString, timeToString, msToString } from "./Util";

class TimerDisplay extends React.Component<
    { ms: number; phase: TimerPhase; pen: Penalty | undefined },
    {}
> {
    public render() {
        // Set the color of the timer
        let colorClass = "black";
        if (this.props.phase.name === "red") {
            colorClass = "red";
        } else if (this.props.phase.name === "green") {
            colorClass = "green";
        }

        // Pretty-print the timer readout
        let timeString: string;
        if (
            this.props.phase.name === "inspecting" ||
            this.props.phase.name === "red" ||
            this.props.phase.name === "green"
        ) {
            timeString = toInspString(this.props.ms);
        } else if (
            (this.props.phase.name === "stopped" || this.props.phase.name === "waiting") &&
            this.props.pen !== undefined
        ) {
            timeString = timeToString({ ms: this.props.ms, pen: this.props.pen });
        } else {
            timeString = msToString(this.props.ms);
        }
        return <div className={"tc f1 code outline " + colorClass}>{timeString}</div>;
    }
}

export default TimerDisplay;
