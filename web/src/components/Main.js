import React from 'react';
import NavBar from './NavBar';

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

export default Main;

