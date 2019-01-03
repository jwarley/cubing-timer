import * as React from "react";
import Select from "react-select";
import { EventOption } from "./Types";

class EventPicker extends React.PureComponent<
    {
        onChange: (selected?: EventOption | EventOption[] | null) => void;
        isDisabled: boolean;
    },
    {}
> {
    private eventOptions = [
        { value: "222", label: "2x2x2" },
        { value: "333", label: "3x3x3" },
        { value: "444fast", label: "4x4x4" },
        { value: "555", label: "5x5x5" },
        { value: "666", label: "6x6x6" },
        { value: "777", label: "7x7x7" },
        { value: "pyram", label: "Pyraminx" },
        { value: "minx", label: "Megaminx" },
        { value: "sq1fast", label: "Square-1" },
        { value: "clock", label: "Clock" },
        { value: "skewb", label: "Skewb" },
    ];
    public render() {
        return (
            <React.Fragment>
                <Select
                    onChange={this.props.onChange}
                    isDisabled={this.props.isDisabled}
                    defaultValue={this.eventOptions[1]}
                    options={this.eventOptions}
                    theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: "gray",
                            primary: "black",
                        },
                    })}
                    openMenuOnFocus={true}
                    blurInputOnSelect={true}
                />
            </React.Fragment>
        );
    }
}

export default EventPicker;
