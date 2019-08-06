import * as React from "react";
import { VictoryChart, VictoryLine, VictoryArea } from "victory";
import { Event } from "./Types";
import { rawTimeToString } from "./Util";

interface Props {
    event: Event;
    wca_id: string;
    home_times: number[];
}

type result_kind = "single" | "average";

interface State {
    single_or_avg: result_kind;
    wca_pb?: number;
}

class WCACard extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { single_or_avg: "single", wca_pb: undefined }
    }

    componentDidMount() {
        const WCA_API_PREFIX = "https://www.worldcubeassociation.org/api/v0/persons/"

        this.maybe_get_wca_pb= this.maybe_get_wca_pb.bind(this);

        fetch(WCA_API_PREFIX + this.props.wca_id)
          .then(function(response: Response) {
            return response.json();
          })
          .then((person_json) => {
            this.maybe_get_wca_pb(person_json, this.state.single_or_avg);
          });
    }

    componentDidUpdate(prevProps: Props) {
        const WCA_API_PREFIX = "https://www.worldcubeassociation.org/api/v0/persons/"

        if (this.props.event !== prevProps.event || this.props.wca_id !== prevProps.wca_id) {
            fetch(WCA_API_PREFIX + this.props.wca_id)
              .then(function(response: Response) {
                return response.json();
              })
              .then((person_json) => {
                this.maybe_get_wca_pb(person_json, this.state.single_or_avg);
              });
        }
    }

    // returns false if there are no official results for the event/kind pair
    // otherwise, returns true and sets the state to reflect the WCA pb
    private maybe_get_wca_pb(person_json: any, which_kind: result_kind): boolean {
        const event_str = this.props.event.wca_db_str;

        if (!person_json.hasOwnProperty("personal_records")) {
            this.setState({
                wca_pb: undefined,
            })

            return false;
        } else if (!person_json["personal_records"].hasOwnProperty(event_str)) {
            this.setState({
                wca_pb: undefined,
            })

            return false;
        } else if (!person_json["personal_records"][event_str].hasOwnProperty(which_kind)) {
            this.setState({
                wca_pb: undefined,
            })

            return false;
        } else {
            this.setState({
                wca_pb: person_json["personal_records"][event_str][which_kind]["best"],
            })

            return true;
        }
    }

    public render() {
        const tachyons_styles = "dn db-ns outline"
        if (this.state.wca_pb === undefined) {
            return (
                <div className={tachyons_styles}>
                    <p className="tc">No WCA data available.</p>
                </div>
            );
        } else {
            const y_vals = this.props.home_times;

            let data = [];

            for (let x = 0; x < y_vals.length; x++) {
                data.push({ x: x, y: y_vals[x] })
            }

            return (
                <div className={tachyons_styles}>
                    <VictoryChart
                    height={200}
                    >
                        <VictoryArea
                            data={data}
                            y0={() => this.state.wca_pb!}
                            style={{
                                data: {
                                    fill: "#cccccc"
                                } 
                            }}
                        />
                        <VictoryLine
                            labels={[rawTimeToString(this.state.wca_pb)]}
                            style={{
                                data: {
                                    stroke: "#ff0000"
                                }
                            }}
                            y={() => this.state.wca_pb!}
                        />
                    </VictoryChart>
                </div>
            );
        }
    }
}

export default WCACard;
