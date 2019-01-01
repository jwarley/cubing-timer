export interface Time {
    ms: number;
    pen?: Penalty;
}

export enum Penalty {
    DNF = "D",
    PlusTwo = "P",
}

export type TimerPhase =
    | { name: "waiting" }
    | { name: "inspecting" }
    | { name: "green" }
    | { name: "red"; timeTurnedRed: number }
    | { name: "running" }
    | { name: "stopped" };
