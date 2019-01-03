export interface Time {
    ms: number;
    pen?: Penalty;
}

export enum Penalty {
    DNF,
    PlusTwo,
}

export type TimerPhase =
    | { name: "waiting" }
    | { name: "inspecting" }
    | { name: "green" }
    | { name: "red"; timeTurnedRed: number }
    | { name: "running" }
    | { name: "stopped" };

// export enum WhichScramble {
//     Current,
//     Next,
// }
export type WhichScramble = 0 | 1;

export type EventOption = {
    value: string;
    label: string;
};
