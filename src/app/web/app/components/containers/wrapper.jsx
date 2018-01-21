import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './wrapper.scss';

export default class Wrapper extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div className="wrapper">
        <div className="wrapper__foreground" />
        <div className="wrapper__container">
          {this.props.children}
        </div>
      </div>
    );
  }

}

