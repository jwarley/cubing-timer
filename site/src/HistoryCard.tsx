import * as React from "react";
import { Time, JsonAvg } from "./Types";
import { rawTimeToString } from "./Util";


interface Props {
    hist: {[id: string]: JsonAvg};
    load_more_func: any;
    inspect_func: (id: string) => void;
}

class HistoryCard extends React.PureComponent<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    private hist_to_list_items(hist: {[id: string]: JsonAvg}): JSX.Element[] {
        let avg_lis = [];

        for (let id in hist) {
            avg_lis.push(
                <li key={id}
                    className="bg-animate bg-white hover-bg-light-silver pointer"
                    onClick={() => this.props.inspect_func(id)}
                >
                    <b className="pt1">{rawTimeToString(hist[id].avg)}</b>
                    <div>{hist[id].times.map(rawTimeToString).join(" ")}</div>
                </li>
            );
        }

        return avg_lis;
    }

    public render() {
        return (
            <div className="overflow-auto">
                <ul className="list pl0 mv0">
                    {
                        this.hist_to_list_items(this.props.hist)
                    }
                </ul>
                <div className="pv3 tc">
                    <a className="ba pointer ph1" onClick={this.props.load_more_func}>Load more</a>
                </div>
            </div>
        );
    }
}

export default HistoryCard;
