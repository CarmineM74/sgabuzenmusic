import React from 'react';

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

class PresetsTable extends React.Component {
  render() {
    var rows = [];
    this.props.presets.forEach(function(preset) {
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
  }
}

export default PresetsTable;
