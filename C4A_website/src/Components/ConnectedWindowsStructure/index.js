import React, { Component } from 'react';

import LeftNav from '../NavBars/LeftNav';
import TopNav from '../NavBars/TopNav';
// eslint-disable-next-line
import styles from './style.css';

class ConnectedWindow extends Component {

  render() {
    
    var leftNav = this.props.type === "home" ? "" : (<LeftNav menus={this.props.menus} content={this.props.content} />);

    return (
        <div className="connected-window">
            <TopNav />
            {leftNav}
        </div>
    );
  }
}

export default ConnectedWindow;
