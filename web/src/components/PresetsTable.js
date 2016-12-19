import React from 'react';
import {Checkbox} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../actionCreators';

const PresetRow = ({preset}) => {
    return (
      <tr>
        <td><Checkbox checked={preset.enabled} readOnly></Checkbox></td>
        <td>{preset.name}</td>
        <td>{preset.value}</td>
        <td>
          <button type="button" className="glyphicon glyphicon-remove btn btn-default btn-xs" ></button>
          &nbsp;
          <button type="button" className="glyphicon glyphicon-pencil btn btn-default btn-xs" ></button>
        </td>
      </tr>
    );
} 

let PresetsTable = (props) => {
  var rows = [];
  console.log(props);
  if (props.loadingPresets) {
    return (<div className="sgabuzen-music-loading"></div>);
  } else {
    if (props.presets.length) {
      props.presets.forEach(function(preset) {
        rows.push(<PresetRow preset={preset} key={preset.name} />);
      });
    } else {
      props.loadPresets();
    }
  }
  return ( 
    <div>
      <h2 className="sub-header">System Presets</h2>
      <div className="table-responsive">
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
        </div>
    </div>
  );
};


function mapStateToProps(state) {
  return {
    loadingPresets: state.loadingPresets,
    presets: state.presets
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

PresetsTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(PresetsTable);

export default PresetsTable;
