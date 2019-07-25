import * as React from "react";

interface Props {
    wca_id: string;
    id_change_handler: (event: React.ChangeEvent<HTMLFormElement>, new_id: string) => void;
}

interface State {
    wca_id: string;
}

class SettingsCard extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            wca_id: this.props.wca_id,
        };

        this.updateFormContent = this.updateFormContent.bind(this);
        this.submitWCAId = this.submitWCAId.bind(this);
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.wca_id !== prevProps.wca_id) {
            this.setState({
                wca_id: this.props.wca_id,
            });
        }
    }
    
    private updateFormContent(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ wca_id: e.target.value });
    }

    private submitWCAId(e: React.ChangeEvent<HTMLFormElement>) {
        this.props.id_change_handler(e, this.state.wca_id);
    }

    public render() {
        return (
            <div className="outline">
                <h1 className="">Settings</h1>
                <form className="pa1 black-80" onSubmit={this.submitWCAId}>
                  <div className="measure">
                    <label className="f6 b db mb2">WCA ID</label>
                    <input 
                        id="name"
                        className="input-reset ba b--black-20 pa2 mb2 db w-100"
                        type="text"
                        onChange={this.updateFormContent}
                        value={this.state.wca_id}
                    />
                    <input type="submit" value="Set" />
                  </div>
                </form>
            </div>
        );
    }
}

export default SettingsCard;
