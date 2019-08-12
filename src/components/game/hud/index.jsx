import React from 'react';

import './index.styl';
import Chat from '../chat';
// TODO: import Chat from '../chat';
import Portrait from '../portrait';
// TODO: import Quests from '../quests';
import session from '../../wowser/session';

class HUD extends React.Component {

  render() {
    const player = session.player;
    return (
      <div className="hud">
        <Portrait self unit={ player } />
        { player.target && <Portrait target unit={ player.target } /> }
        <Chat />
      </div>
    );
  }

}

export default HUD;
