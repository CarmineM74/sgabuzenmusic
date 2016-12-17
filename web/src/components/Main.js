import React from 'react';
import TopNavBar from './TopNavBar';

class Main extends React.Component {
  render () {
    return (
      <div>
        <TopNavBar />
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

