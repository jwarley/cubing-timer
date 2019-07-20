import * as React from "react";
import { Time, JsonAvg } from "./Types";
import { rawTimeToString } from "./Util";

function msToLi(ms: number) {
    return (
        <li className="dib">
            <a href="#" className="f6 db link dim black pr3">
                {rawTimeToString(ms)}
            </a>
        </li>
    );
}

function hist_to_list_items(avgs: JsonAvg[], keys: string[]): JSX.Element[] {
    let avg_lis = [];

    for (let i = 0; i < avgs.length; i++) {
        avg_lis.push(
            <li key={keys[i]}
                className="bg-animate bg-white hover-bg-light-blue"
            >
                <b className="pt1">{rawTimeToString(avgs[i].avg)}</b>
                <div>{avgs[i].times.map(rawTimeToString).join(" ")}</div>
            </li>
        )
    }

    return avg_lis;
}

interface Props {
    hist: JsonAvg[];
    keys: string[];
    load_more_func: any;
}

class HistoryCard extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <div className="overflow-auto">
                <ul className="list pl0 mv0">
                    {
                        hist_to_list_items(this.props.hist, this.props.keys)
                    }
                </ul>
                <div className="pv3 tc" onClick={this.props.load_more_func}>
                    <a className="ba pointer ph1">Load more</a>
                </div>
            </div>
        );
    }
}

export default HistoryCard;
