import React from 'react';
import {render} from 'react-dom';

// Components

class NavBar extends React.Component {
  render() {
    return 
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
      </nav>;
  }
}

class PresetRow extends React.Component {
  render() {
    return
      <div></div>;
  }
}

class PresetList extends React.Component {
  render() {
    return 
      <h2 className="sub-header">System Presets</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lorem</td>
              <td>sit</td>
              <td>+ / - / ^</td>
            </tr>
            <tr>
              <td>amet</td>
              <td>elit</td>
              <td>+ / - / ^</td>
            </tr>
            <tr>
              <td>Integer</td>
              <td>Praesent</td>
              <td>+ / - / ^</td>
            </tr>
            <tr>
              <td>libero</td>
              <td>ante</td>
              <td>+ / - / ^</td>
            </tr>
            <tr>
              <td>dapibus</td>
              <td>nisi</td>
              <td>+ / - / ^</td>
            </tr>
            <tr>
              <td>Nulla</td>
              <td>at</td>
              <td>+ / - / ^</td>
            </tr>
          </tbody>
        </table>
      </div>;
  }
}

class App extends React.Component {
  render () {
    return 
      <NavBar />
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <h1 class="page-header">Dashboard</h1>
        </div>
      </div>
    </div>;
  }
}

render(<App/>, document.getElementById('app'));
