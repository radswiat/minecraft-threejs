import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { observer } from 'mobx-react/index';
import { storeAssetsLoader } from 'shared/store';

import './wrapper.scss';

export class Wrapper extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div className={cx([
        'wrapper',
        storeAssetsLoader.isLoading ? 'wrapper--visible' : 'wrapper--hidden',
      ])}>
        <div className="wrapper__foreground" />
        <div className="wrapper__container">
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default observer(Wrapper);
