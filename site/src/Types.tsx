import * as firebase from "firebase/app";
import "firebase/firestore";

export interface Time {
    ms: number;
    pen?: Penalty;
}

export enum Penalty {
    DNF,
    PlusTwo,
}

export type PenString = "dnf" | "plus" | "";

export interface JsonTime {
    ms: number,
    pen: PenString,
}

export interface JsonAvg {
    best: number;
    worst: number;
    times: number[];
    avg: number;
    timestamp: firebase.firestore.Timestamp;
}

export type TimerPhase =
    | { name: "waiting" }
    | { name: "inspecting" }
    | { name: "green" }
    | { name: "red"; timeTurnedRed: number }
    | { name: "running" }
    | { name: "stopped" };

export interface Event {
    name: string;
    avg_size: number;
    scramble_str: string;
    wca_db_str: string;
}

export type WhichScramble = 0 | 1;
