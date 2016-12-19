import React from 'react';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import './css/bootstrap.min.css';
import './css/dashboard.css';
import store from './store';
import Main from './components/Main';
import PresetsTable from './components/PresetsTable';
import System from './components/System';

const router = (
  <Provider store={ store }>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={PresetsTable}></IndexRoute>
        <Route path="/system" component={System}>
        </Route>
      </Route>
    </Router>
  </Provider>
);

render(router, document.getElementById('app'));
