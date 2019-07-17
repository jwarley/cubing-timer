import * as React from "react";
import { Time, JsonAvg } from "./Types";
import { csToString } from "./Util";

function msToLi(ms: number) {
    return (
        <li className="dib">
            <a href="#" className="f6 db link dim black pr3">
                {csToString(ms)}
            </a>
        </li>
    );
}

function hist_to_list_items(avgs: JsonAvg[], keys: string[]): JSX.Element[] {
    let avg_lis = [];

    for (let i = 0; i < avgs.length; i++) {
        avg_lis.push(
            <li key={keys[i]}>
                <b>{csToString(avgs[i].avg)}</b>
                <div className="pb1">{avgs[i].times.map(csToString).join(" ")}</div>
            </li>
        )
    }

    return avg_lis;
}

interface Props {
    hist: JsonAvg[];
    keys: string[];
}

class HistoryCard extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <ul className="list pl0">
                {
                    hist_to_list_items(this.props.hist, this.props.keys)
                }
            </ul>


        );
    }
}

export default HistoryCard;
