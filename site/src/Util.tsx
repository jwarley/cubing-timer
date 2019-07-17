import { Time, Penalty, PenString, JsonTime, JsonAvg } from "./Types";
import * as firebase from "firebase/app";
import "firebase/firestore";

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

// pretty-print a centisecond value as a time in h:m:s.dc format
function csToString(time: number): string {
    return msToString(time * 10).slice(0, -1);
}

function timeToString(t: Time): string {
    let time_string = csToString(t.ms);
    if (t.pen === Penalty.DNF) {
        return "DNF (" + time_string + ")";
    } else if (t.pen === Penalty.PlusTwo) {
        return time_string + " + 2 = " + msToString(t.ms + 2000);
    } else {
        return time_string;
    }
}

function timeToWCAFormat(t: Time): number {
    if (t.pen === Penalty.DNF) {
        return -1
    } else {
        // convert time to centiseconds
        return t.ms / 10
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

// print a string penalty code
function penToString(pen: Penalty | undefined): PenString {
    if (pen === Penalty.DNF) {
        return "dnf";
    } else if (pen === Penalty.PlusTwo) {
        return "plus";
    } else {
        return "";
    }
}

function penFromString(pen_str: PenString): Penalty | undefined {
    if (pen_str === "dnf") {
        return Penalty.DNF;
    } else if (pen_str === "plus") {
        return Penalty.PlusTwo;
    } else {
        return undefined;
    }
}

function timeToJson(t: Time): JsonTime {
    return {
        ms: t.ms,
        pen: penToString(t.pen),
    }
}

function timeFromJson(t_json: JsonTime): Time {
    return {
        ms: t_json.ms,
        pen: penFromString(t_json.pen),
    }
}

function timeToRawMs(t: Time): number {
    if (t.pen === Penalty.DNF) {
        return -1;
    } else if (t.pen === Penalty.PlusTwo) {
        return t.ms + 2000;
    } else {
        return t.ms;
    }
}

function truncateMs(n: number): number {
    return n === -1 ? -1
                    : Math.floor(n / 10);
}

// returns negative if t1 is faster than t2, positive if slower, 0 if equal
function compareTimes(t1: Time, t2: Time): number {
    const t1_is_dnf = t1.pen === Penalty.DNF;
    const t2_is_dnf = t2.pen === Penalty.DNF;

    if (t1_is_dnf && !t2_is_dnf) {
        return 1;
    } else if (!t1_is_dnf && t2_is_dnf) {
        return -1;
    } else if (t1_is_dnf && t2_is_dnf) {
        return 0;
    } else {
        const t1_ms = timeToRawMs(t1);
        const t2_ms = timeToRawMs(t2);
        return t1_ms - t2_ms;
    }
}

function bucketToJsonAvg(bucket: Time[]): JsonAvg {
    let sorted_times = bucket.slice(0);
    sorted_times.sort(compareTimes);
    const sorted_ms = sorted_times.map(timeToRawMs);

    const num_solves = sorted_ms.length;
    console.assert(num_solves === 5 || num_solves === 3);
    const best = sorted_ms[0];
    const worst = sorted_ms[num_solves - 1];

    let avg = -1;

    if (num_solves === 5 && sorted_ms[4] !== -1) {
        avg = (sorted_ms[1] + sorted_ms[2] + sorted_ms[3]) / 3;
    } else if (num_solves === 3 && sorted_ms[2] !== -1) {
        avg = (sorted_ms[0] + sorted_ms[1] + sorted_ms[2]) / 3;
    }

    return {
        times: bucket.map(timeToRawMs),
        best: best,
        worst: worst,
        avg: Math.floor(avg),
        timestamp: firebase.firestore.Timestamp.now(),
    }
}


export {
    msToString,
    csToString,
    timeToString,
    timeSince,
    timeToWCAFormat,
    inspPenalty,
    toInspString,
    penToString,
    timeToJson,
    timeToRawMs,
    timeFromJson,
    bucketToJsonAvg,
};
