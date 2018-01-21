import React from 'react';
import { render } from 'react-dom';

import Logo from './app/components/logo';
import Help from './app/components/help';
import { Wrapper } from './app/components/containers';
import Preloader from './app/components/preloader';

import './styles/main.scss';


/**
 * React App
 */
export default class App {

  /**
   * Bootstrap
   *
   * @return { App }
   */
  static bootstrap() {
    return new App();
  }

  constructor() {
    this.render();
  }

  render() {
    render(
      <Wrapper>
        <Logo />
        <Preloader />
        <Help />
      </Wrapper>,
      document.getElementById('root'),
    );
  }
}
