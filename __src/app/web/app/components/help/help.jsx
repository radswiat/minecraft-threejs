import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './help.scss';

export default class Help extends Component {

  render() {
    return (
      <div className="help">
        <h3>Controls</h3>
        <ul>
          <li>left mouse button - move forward</li>
          <li>right mouse button - move backward</li>
          <li>middle mouse button - lock controls</li>
          <li>"L" - lock controls</li>
        </ul>
      </div>
    );
  }
}

