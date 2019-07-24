import * as React from "react";
import { Event } from "./Types";

interface Props {
    scramble: string,
    event: Event,
}
class ScrambleText extends React.PureComponent<Props, {}> {
    public render() {
        return (
            this.props.event.scramble_str === "minx" ? 
                <div id="scramble_area" className="f3 tc" style={{whiteSpace: "pre-wrap"}}>
                    {this.props.scramble}
                </div> :
                <div id="scramble_area" className="f3 tc">
                    {this.props.scramble}
                </div>
        );
    }
}

export default ScrambleText;
