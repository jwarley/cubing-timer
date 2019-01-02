import * as React from "react";
import { Time } from "./Types";
import { timeToString } from "./Util";

function timeToLi(t: Time) {
    return (
        <li className="dib">
            <a href="#" className="f6 db link dim black pr3">
                {timeToString(t)}
            </a>
        </li>
    );
}

class HistoryCard extends React.Component<{ hist: Time[][] }, {}> {
    public render() {
        return (
            <dl className="lh-title ml3">
                {this.props.hist.map(timeList => (
                    <React.Fragment>
                        <dt className="f6 b mv1">avg.xyz</dt>
                        <dd className="ml0">{timeList.map(timeToLi)}</dd>
                    </React.Fragment>
                ))}
            </dl>
        );
    }
}

export default HistoryCard;
