import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../actionCreators';

const PresetRow = ({preset}) => {
    return (
      <tr>
        <td>{preset.enabled}</td>
        <td>{preset.name}</td>
        <td>{preset.value}</td>
        <td>+ / - / ^</td>
      </tr>
    );
} 

let PresetsTable = (props) => {
  var rows = [];
  props.presets.forEach(function(preset) {
    rows.push(<PresetRow preset={preset} key={preset.name} />);
  });
  return ( 
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Enabled</th>
          <th>Name</th>
          <th>Value</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

PresetsTable = connect(
  (state) => {
    return {
      presets: state.presets
    }
  },
  // When the need will arise we should use
  // bindActionCreators(actionCreators,dispatch)
  // in order to allow for injection of actions
  // creators in the components.
  null
)(PresetsTable);

export default PresetsTable;
