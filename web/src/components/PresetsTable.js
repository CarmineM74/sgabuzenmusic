import React from 'react';
import {Checkbox} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../actionCreators';

const PresetRow = ({preset, onDelete, idx}) => {
    return (
      <tr>
        <td><Checkbox checked={preset.enabled} readOnly></Checkbox></td>
        <td>{preset.name}</td>
        <td>{preset.value}</td>
        <td>
          <button type="button" className="glyphicon glyphicon-remove btn btn-default btn-xs" 
            onClick={onDelete.bind(null,preset.name,idx)} />
          &nbsp;
          <LinkContainer to={`/edit/${preset.name}`}>
            <button type="button" className="glyphicon glyphicon-pencil btn btn-default btn-xs" />
          </LinkContainer>
        </td>
      </tr>
    );
} 

let PresetsTable = (props) => {
  var rows = [];
  console.log("[PresetsTable]", props);
  if (props.isLoadingPresets) {
    return (<div className="sgabuzen-music-loading"></div>);
  } else {
    if (props.presets.length) {
      rows = props.presets.map((preset, idx) => <PresetRow preset={preset} idx={idx} key={preset.name} onDelete={props.deletePreset} />);
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
  console.log("[mapStateToProps]", state);
  return {
    isLoadingPresets: state.isLoadingPresets,
    presets: state.presets,
    preset: state.preset
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
