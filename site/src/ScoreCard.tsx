import * as React from "react";
import { timeToString } from "./Util";
import { Time, Penalty } from "./Types";

class ScoreCard extends React.Component<{ times: Time[] }, {}> {
    public render() {
        // build array of scorecard rows
        let rows = [];
        for (let i = 0; i < this.props.times.length; i++) {
            let t = this.props.times[i];
            rows[i] = (
                <li key={i} className="ph3 pv2 bb b--light-silver">
                    {timeToString(t)}
                </li>
            );
        }
        while (rows.length < 5) {
            rows.push(
                <li key={rows.length} className="ph3 pv2 bb b--light-silver">
                    &nbsp;
                </li>
            );
        }

        return (
            <div className="outline">
                <h1 className="f5 center mw5">Current Average</h1>
                <ul className="list pl0 ml0 center mw5 ba b--light-silver br3">{rows}</ul>
            </div>
        );
    }
}

export default ScoreCard;
