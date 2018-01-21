import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { storeAssetsLoader } from 'shared/store';

import './preloader.scss';

export class Preloader extends Component {

  render() {
    const progress = Math.round((100 * storeAssetsLoader.progress) / storeAssetsLoader.max);
    return (
      <div className="preloader">
        <div className="preloader__text">{storeAssetsLoader.title} ( {storeAssetsLoader.progress} / {storeAssetsLoader.max} )</div>
        <div className="bar">
          <div className="bar__foreground" style={{ width: `${progress}%`}}/>
          <div className="bar__background" />
        </div>
      </div>
    );
  }
}

export default observer(Preloader);
