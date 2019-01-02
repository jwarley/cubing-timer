import { Time, Penalty } from "./Types";

// return the elapsed time since t
function timeSince(t: number): number {
    return Date.now() - t;
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

// pretty-print a ms value as a time in h:m:s.mil format
function msToString(time: number): string {
    // Get the h:m:s.ms components of the time
    let h = Math.floor((time % (1000 * 60 ** 3)) / (1000 * 60 ** 2));
    let m = Math.floor((time % (1000 * 60 ** 2)) / (1000 * 60));
    let s = Math.floor((time % (1000 * 60)) / 1000);
    let ms = Math.floor(time % 1000);

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

    timeString = timeString + s + "." + padMs(ms);

    return timeString;
}

function timeToString(t: Time): string {
    let time_string = msToString(t.ms);
    if (t.pen === Penalty.DNF) {
        return "DNF (" + time_string + ")";
    } else if (t.pen === Penalty.PlusTwo) {
        return time_string + " + 2 = " + msToString(t.ms + 2000);
    } else {
        return time_string;
    }
}

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
function toInspString(time: number): string {
    if (time >= 17000) {
        return "DNF";
    } else if (time >= 15000) {
        return "+2";
    }

    let s = Math.floor((time % (1000 * 60)) / 1000);
    return (15 - s).toString();
}

export { msToString, timeToString, timeSince, inspPenalty, toInspString };
