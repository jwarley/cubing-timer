import * as React from "react";
import { Event, JsonAvg, StatsRecord } from "./Types";
import { rawTimeToString } from "./Util";

interface Props {
    event: Event;
    stats: StatsRecord;
    inspect_func: (id: string) => void;
}

class StatsCard extends React.PureComponent<Props, {}> {
    public render() {
        const avg_size_str = this.props.event.avg_size === 5 ? "Ao5" : "Mo3";
        return (
            <div className="outline">
                <dl className="lh-title ml3">
                    <dt className="f6 b">Best Single</dt>
                    {
                        this.props.stats.pb_single === -2
                            ? <dd className="ml0">N/A</dd>
                            : <dd className="ml0">
                              <span className="pointer bg-animate bg-white hover-bg-light-silver"
                                    onClick={() =>
                                        this.props.inspect_func(this.props.stats.pb_single_loc)
                                    }
                              >
                                {rawTimeToString(this.props.stats.pb_single)}
                              </span>
                              </dd>
                    }
                    <dt className="f6 b">Best Avg.</dt>
                    {
                        (this.props.stats.pb_avg === null || this.props.stats.pb_avg_loc === null)
                            ? <dd className="ml0">N/A</dd>
                            : <dd className="ml0">
                              <span className="pointer bg-animate bg-white hover-bg-light-silver"
                                    onClick={() =>
                                        this.props.inspect_func(this.props.stats.pb_avg_loc!)
                                    }
                              >
                                {rawTimeToString(this.props.stats.pb_avg)}
                              </span>
                              </dd>
                    }
                </dl>
            </div>
        );
    }
}

export default StatsCard;
