import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';

import './index.styl';

class Portrait extends React.Component {

  static propTypes = {
    self: PropTypes.bool,
    unit: PropTypes.object.isRequired,
    target: PropTypes.bool
  };

  render() {
    const unit = this.props.unit;
    const className = classes('portrait', {
      self: this.props.self,
      target: this.props.target
    });
    return (
      <div className={ className }>
        <div className="icon portrait"></div>

        <header className="name">{ unit.name }</header>
        <aside className="level">{ unit.level }</aside>

        <div className="divider"></div>

        <div className="health">{ unit.hp } / { unit.maxHp }</div>
        <div className="mana">{ unit.mp } / { unit.maxMp }</div>
      </div>
    );
  }

}

export default Portrait;
