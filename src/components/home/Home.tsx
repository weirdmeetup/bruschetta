import './Home.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { IAfterRequestContext } from '../interface/IAfterRequestContext';
import logo from './react.svg';

class Home extends Component {
  public static async getInitialProps({
    req,
    res,
    match,
    history,
    location,
    ...ctx
  }: IAfterRequestContext<{}>) {
    return { whatever: 'stuff' };
  }

  public render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to After.js</h2>
        </div>
        <p className="Home-intro">
          To get started, edit <code>src/Home.js</code> or{' '}
          <code>src/About.js</code>and save to reload.
        </p>
        <Link to="/about">About -></Link>
      </div>
    );
  }
}

export default Home;
