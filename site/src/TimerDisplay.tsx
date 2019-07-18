import * as React from "react";
import { Penalty, TimerPhase } from "./Types";

// The timer display is the only component that operates at millisecond precision,
// so all the millisecond-related helper functions are in here.
// Times are truncated to centiseconds as soon as they are stored in the bucket.
// Any ms value outside this file (or its wiring in Timer.tsx) probably indicates a bug.

// returns the penalty incurred by an inspection time
function inspPenalty(time: number): Penalty | undefined {
    let pen = undefined;
    if (time >= 17000) {
        pen = Penalty.DNF;
    } else if (time >= 15000) {
        pen = Penalty.PlusTwo;
    }
    return pen;
}


// pretty-print an ms value as an inspection time
function msToInspString(ms: number): string {
    if (ms >= 17000) {
        return "DNF";
    } else if (ms >= 15000) {
        return "+2";
    }

    let s = Math.floor((ms % (1000 * 60)) / 1000);
    return (15 - s).toString();
}

// helper function for msToString
// pad a ms value with zeros until it's three digits
function padMs(n: number): string {
    console.assert(n >= 0 && n < 1000, "Invalid argument to padMs() (" + n + ")");

    let result: string = "";

    if (n < 10) {
        result = result + "00" + n;
    } else if (n < 100) {
        result = result + "0" + n;
    } else if (n < 1000) {
        result = result + n;
    }

    return result;
}

// pretty-print a ms value as a time in h:m:s.dcm format
function msToString(time: number): string {
    // Get the h:m:s.dcm components of the time
    let h = Math.floor((time % (1000 * 60 ** 3)) / (1000 * 60 ** 2));
    let m = Math.floor((time % (1000 * 60 ** 2)) / (1000 * 60));
    let s = Math.floor((time % (1000 * 60)) / 1000);
    let dcm = Math.floor(time % 1000);

    let timeString: string = "";

    if (h !== 0) {
        timeString = timeString + h + ":";
    }
    if (h !== 0 && m < 10) {
        timeString = timeString + "0";
    }
    if (m !== 0) {
        timeString = timeString + m + ":";
    }
    if (m !== 0 && s < 10) {
        timeString = timeString + "0";
    }

    timeString = timeString + s + "." + padMs(dcm);

    return timeString;
}

function msPenToString(ms: number, pen: Penalty) {
    let time_string = msToString(ms);
    if (pen === Penalty.DNF) {
        return "DNF (" + time_string + ")";
    } else if (pen === Penalty.PlusTwo) {
        return time_string + " + 2 = " + msToString(ms + 200);
    } else {
        return time_string;
    }
}

interface Props {
    ms: number;
    phase: TimerPhase;
    pen: Penalty | undefined;
}

class TimerDisplay extends React.Component<Props, {}> {

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
            timeString = msToInspString(this.props.ms);
        } else if (
            (this.props.phase.name === "stopped" || this.props.phase.name === "waiting") &&
            this.props.pen !== undefined
        ) {
            timeString = msPenToString(this.props.ms, this.props.pen);
        } else {
            timeString = msToString(this.props.ms);
        }
        return <div className={"tc f1 code outline " + colorClass}>{timeString}</div>;
    }
}

// export default TimerDisplay;
export {
    inspPenalty,
    TimerDisplay,
}
