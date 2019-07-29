import * as React from "react";
import { timeToString } from "./Util";
import { Time, Penalty } from "./Types";


interface Props {
    times: Time[];
    edit_fn: (arg0: Penalty) => void;
    delete_fn: () => void;
    avg_size: number;
}

class ScoreCard extends React.PureComponent<Props, {}> {
    public render() {
        // TODO shade the selected penalty button
        const edit_ctrls = <span className="">
                               <a className="link dim br1 bt bb bl ph1 dib black pointer"
                                  onClick={() => this.props.edit_fn(Penalty.PlusTwo)}>+2
                               </a>
                               <a className="link dim br1 ba ph1 dib black pointer"
                                  onClick={() => this.props.edit_fn(Penalty.DNF)}>DNF
                               </a>
                               <a className="link dim br1 bt bb br ph1 dib black pointer"
                                  onClick={() => this.props.delete_fn()}>×
                               </a>
                           </span>;

        // build array of scorecard rows
        let rows = [];
        const num_times = this.props.times.length;

        for (let i = 0; i < num_times; i++) {
            let t = this.props.times[i];
            rows[i] = (
                <li key={i} className="flex justify-between ph2 pv2 bb b--light-silver">
                    {timeToString(t)}
                    {i === num_times - 1 ? edit_ctrls : ""}
                </li>
            );
        }

        while (rows.length < this.props.avg_size) {
            rows.push(
                <li key={rows.length} className="ph2 pv2 bb b--light-silver">
                    &nbsp;
                </li>
            );
        }

        return (
            <div className="center mw5">
                <h1 className="f5 small-caps">Current Average</h1>
                <ul className="list pl0 ml0 ba b--light-silver br1">{rows}</ul>
            </div>
        );
    }
}

export default ScoreCard;
