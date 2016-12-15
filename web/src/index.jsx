import React from 'react';
import {render} from 'react-dom';

// Components

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">SGABUZEN</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">System</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

class PresetRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.preset.enabled}</td>
        <td>{this.props.preset.name}</td>
        <td>{this.props.preset.value}</td>
        <td>+ / - / ^</td>
      </tr>
    );
  }
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

class PresetList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { presets: PRESETS };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    if (!this.state.presets.length) {
      return <div className="spinner">Loading ...</div>;
    } else {
      return <PresetsTable presets={this.state.presets} />;
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
}


class App extends React.Component {
  render () {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 col-md-12 main">
              <PresetList presets={this.props.presets} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var PRESETS = [
  {name: "first", value: "58", enabled: true},
  {name: "second", value: "88", enabled: true},
  {name: "third", value: "33", enabled: false},
  {name: "fourth", value: "12", enabled: true},
]

render(<App presets={PRESETS} />, document.getElementById('app'));
