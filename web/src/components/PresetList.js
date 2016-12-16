import React from 'react';
import {connect} from 'react-redux';
import PresetsTable from './PresetsTable';

let PresetList = (props) => {
  if (!props.presets.length) {
    return <div className="spinner">Loading ...</div>;
  } else {
    return <PresetsTable presets={props.presets} />;
  }
  return (
    <div>
      <h2 className="sub-header">System Presets</h2>
      <div className="table-responsive">
        {data}
      </div>
    </div>
  );
}

PresetList = connect(
  // mapStateToProps
  (state) => {
    return {
      presets: state.presets
    }
  },
  // mapDispatchToProps
  // when null just pass dispatch
  null 
)(PresetList);

export default PresetList;
