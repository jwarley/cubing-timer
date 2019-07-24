import * as React from "react";
import { Time, JsonAvg } from "./Types";
import { rawTimeToString } from "./Util";
import * as firebase from "firebase/app";
import "firebase/firestore";

interface Props {
    avg_id: string;
    avg_json: JsonAvg;
    // scrambles_ref?: firebase.firestore.CollectionReference;
    delete_func: (id: string) => void;
    close_func: () => void;
}

class HistoryDetail extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <div>
                <h1 className="f4 bg-near-black white mv0 pv2 ph3">Average detail</h1>
                <div className="pa3 bt">
                  <p className="f6 f5-ns lh-copy measure mv0">
                  {rawTimeToString(this.props.avg_json.avg)}
                  </p>
                  <p className="f6 f5-ns lh-copy measure mv0">
                  {this.props.avg_json.times.map(rawTimeToString).join(" ")}
                  </p>
                </div>
                <div className="pv3 tc">
                    <a className="ba pointer ph1"
                       onClick={() => {
                           this.props.delete_func(this.props.avg_id);
                           this.props.close_func();
                       }}
                    >Delete Average</a>
                </div>
                <div className="pv3 tc">
                    <a className="ba pointer ph1" onClick={this.props.close_func}>Close</a>
                </div>
            </div>
        );
    }
}

export default HistoryDetail;
