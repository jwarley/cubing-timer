import * as React from "react";
import * as Util from "./Util";
import { Time, Penalty } from "./Types";

function timeToString(t: Time): string {
  let time_string = Util.timeToString(t.ms);
  if (t.pen === Penalty.DNF) {
    return "DNF (" + time_string + ")";
  } else if (t.pen === Penalty.PlusTwo) {
    return time_string + " + 2 = " + Util.timeToString(t.ms + 2000);
  } else {
    return time_string;
  }
}

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
