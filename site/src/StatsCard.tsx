import * as React from "react";
import { Event } from "./Types";

interface Props {
    event: Event;
}

class StatsCard extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <div className="outline">
                <dl className="lh-title ml3">
                    <dt className="f6 b">Best Single</dt>
                    <dd className="ml0">7.08</dd>
                    <dt className="f6 b mt2">Best Avg. of 5</dt>
                    <dd className="ml0">8.92</dd>
                    <dt className="f6 b mt2">Mean Avg. of 5</dt>
                    <dd className="ml0">10.61</dd>
                    <dt className="f6 b mt2">Avg. of 100</dt>
                    <dd className="ml0">9.58</dd>
                </dl>
            </div>
        );
    }
}

export default StatsCard;
