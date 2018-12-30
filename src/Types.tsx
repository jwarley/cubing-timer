export interface Time {
    ms: number;
    pen?: Penalty;
}

export enum Penalty {
    DNF = "D",
    PlusTwo = "P",
}
