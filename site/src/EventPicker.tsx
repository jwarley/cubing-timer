import * as React from "react";
import Select from "react-select";
import { Event } from "./Types";

interface Props {
  onChange: (selected?: Event | Event[] | null) => void;
  isDisabled: boolean;
}

class EventPicker extends React.PureComponent<Props, {}> {
  private eventOptions = [
    { name: "2x2x2", avg_size: 5, scramble_str: "222", wca_db_str: "222" },
    { name: "3x3x3", avg_size: 5, scramble_str: "333", wca_db_str: "333" },
    { name: "4x4x4", avg_size: 5, scramble_str: "444fast", wca_db_str: "444" },
    { name: "5x5x5", avg_size: 5, scramble_str: "555", wca_db_str: "555" },
    { name: "6x6x6", avg_size: 3, scramble_str: "666", wca_db_str: "666" },
    { name: "7x7x7", avg_size: 3, scramble_str: "777", wca_db_str: "777" },
    { name: "3x3x3 OH", avg_size: 5, scramble_str: "333", wca_db_str: "333oh" },
    { name: "3x3x3 BLD", avg_size: 3, scramble_str: "333", wca_db_str: "333bf" },
    { name: "Pyraminx", avg_size: 5, scramble_str: "pyram", wca_db_str: "pyram" },
    { name: "Megaminx", avg_size: 5, scramble_str: "minx", wca_db_str: "minx" },
    { name: "Square-1", avg_size: 5, scramble_str: "sq1", wca_db_str: "sq1" },
    { name: "Clock", avg_size: 5, scramble_str: "clock", wca_db_str: "clock" },
    { name: "Skewb", avg_size: 5, scramble_str: "skewb", wca_db_str: "skewb" },
  ];

  public render() {
    const dropdownStyle = (base: any) => ({
      // make the menu tall enough that all events are visible
      maxHeight: 500,
    });

    return (
      <React.Fragment>
        <Select
          id={"event_select"}
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
          getOptionLabel={({ name }) => name}
          openMenuOnFocus={true}
          blurInputOnSelect={true}
          styles={{ menuList: dropdownStyle }}
          // This looks like some wacky bug in react-select.
          // Without the following line, all menu options appear selected.
          // source: https://stackoverflow.com/questions/52000594/every-menu-option-rendered-as-selected-strange-workaround
          isOptionSelected={(selOpt, selOptArr) => false}
        />
      </React.Fragment>
    );
  }
}

export default EventPicker;
