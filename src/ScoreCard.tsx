import * as React from 'react';
import * as Util from './Util';

enum Penalty {
  DNF,
  PlusTwo,
}

interface Time {
  ms: number;
  pen?: Penalty;
}

class ScoreCard extends React.Component<{ times: Time[] }, {}> {
  public render() {
    return (
      <div className="tc">
          <ul>
              {
                 this.props.times.map(t => <li> { Util.timeToString(t.ms) } </li>) 
              }
          </ul>
      </div>
    );
  }
}

export default ScoreCard;
