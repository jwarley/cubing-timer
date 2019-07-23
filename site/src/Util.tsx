import { Time, Penalty, PenString, JsonTime, JsonAvg } from "./Types";
import * as firebase from "firebase/app";
import "firebase/firestore";

// return the elapsed time since t
function timeSince(t: number): number {
    return Date.now() - t;
}

// helper function for rawTimeToString
// pad a centisecond value with zeros until it's two digits
function padCs(n: number): string {
    console.assert(n >= 0 && n < 100, "Invalid argument to padCs() (" + n + ")");

    let result: string = "";

    if (n < 10) {
        result = result + "0" + n;
    } else if (n < 100) {
        result = result + n;
    }

    return result;
}

// pretty-print a centisecond value as a time in h:m:s.dc format
function rawTimeToString(time: number): string {
    if (time === -1) {
        return "DNF";
    }

    // Get the h:m:s.dc components of the time
    let h = Math.floor((time % (100 * 60 ** 3)) / (100 * 60 ** 2));
    let m = Math.floor((time % (100 * 60 ** 2)) / (100 * 60));
    let s = Math.floor((time % (100 * 60)) / 100);
    let dc = Math.floor(time % 100);

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

    timeString = timeString + s + "." + padCs(dc);

    return timeString;
}

// print a Time value, including penalties
function timeToString(t: Time): string {
    let time_string = rawTimeToString(t.raw);
    if (t.pen === Penalty.DNF) {
        return "DNF (" + time_string + ")";
    } else if (t.pen === Penalty.PlusTwo) {
        return time_string + " + 2 = " + rawTimeToString(t.raw + 200);
    } else {
        return time_string;
    }
}

// print a string penalty code (for backend use)
function penToString(pen: Penalty | undefined): PenString {
    if (pen === Penalty.DNF) {
        return "dnf";
    } else if (pen === Penalty.PlusTwo) {
        return "plus";
    } else {
        return "";
    }
}

// convert penalty codes to Penalty values
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
        raw: t.raw,
        pen: penToString(t.pen),
    }
}

function timeFromJson(t_json: JsonTime): Time {
    return {
        raw: t_json.raw,
        pen: penFromString(t_json.pen),
    }
}

// convert a Time object to centiseconds (-1 = DNF)
function timeToRaw(t: Time): number {
    if (t.pen === Penalty.DNF) {
        return -1;
    } else if (t.pen === Penalty.PlusTwo) {
        return t.raw + 200;
    } else {
        return t.raw;
    }
}

// returns true if t1 is faster than t2
// ties return false
function isFaster(t1: number, t2: number) {
    const t1_is_dnf = t1 === -1;
    const t2_is_dnf = t2 === -1;

    if (t1_is_dnf && !t2_is_dnf) {
        return false;
    } else if (!t1_is_dnf && t2_is_dnf) {
        return true;
    } else if (t1_is_dnf && t2_is_dnf) {
        return false;
    } else {
        return t1 < t2;
    }
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
        const t1_raw = timeToRaw(t1);
        const t2_raw = timeToRaw(t2);
        return t1_raw - t2_raw;
    }
}

// map a bucket of times to a Json object for storage
function bucketToJsonAvg(bucket: Time[]): JsonAvg {
    const sorted_raws = bucket.slice(0).sort(compareTimes).map(timeToRaw);

    const num_solves = sorted_raws.length;
    console.assert(num_solves === 5 || num_solves === 3);
    const best = sorted_raws[0];
    const worst = sorted_raws[num_solves - 1];

    let avg = -1;

    if (num_solves === 5 && sorted_raws[3] !== -1) {
        avg = (sorted_raws[1] + sorted_raws[2] + sorted_raws[3]) / 3;
    } else if (num_solves === 3 && sorted_raws[2] !== -1) {
        avg = (sorted_raws[0] + sorted_raws[1] + sorted_raws[2]) / 3;
    }

    return {
        times: bucket.map(timeToRaw),
        best: best,
        worst: worst,
        avg: Math.floor(avg),
        timestamp: firebase.firestore.Timestamp.now(),
    }
}

export {
    rawTimeToString,
    timeToString,
    timeSince,
    penToString,
    timeToJson,
    timeToRaw,
    timeFromJson,
    bucketToJsonAvg,
    isFaster,
    compareTimes,
};
