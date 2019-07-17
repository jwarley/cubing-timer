import * as React from "react";

class SettingsCard extends React.PureComponent<{}, {}> {
    public render() {
        return (
            <div className="outline">
                <h1 className="">Settings</h1>
                <form>
                  <label>
                    WCA ID:
                    <input type="text" name="WCA ID" />
                  </label>
                  <input type="submit" value="Set" />
                </form>
            </div>
        );
    }
}

export default SettingsCard;
