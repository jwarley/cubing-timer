import * as React from "react";

class ScrambleText extends React.Component<{ scramble: string }, {}> {
    public render() {
        return (
            <div id="scramble_area" className="f3 tc">
                {this.props.scramble}
            </div>
        );
    }
}

export default ScrambleText;
