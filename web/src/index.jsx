import React from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import store from './store';

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

let PresetList = (props) => {
  if (!props.presets.presets.length) {
    return <div className="spinner">Loading ...</div>;
  } else {
    return <PresetsTable presets={props.presets.presets} />;
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

class Main extends React.Component {
  render () {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 col-md-12 main">
              {React.cloneElement(this.props.children, this.props)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const router = (
  <Provider store={ store }>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={PresetList}></IndexRoute>
      </Route>
    </Router>
  </Provider>
);

render(router, document.getElementById('app'));
