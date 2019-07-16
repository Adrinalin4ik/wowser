import Unit from './unit';

class Player extends Unit {

  constructor() {
    super();

    this.name = 'Player';
    this.hp = this.hp;
    this.mp = this.mp;
    this.remote = false;
    this.target = null;

    this.displayID = 24978;
    this.mapID = null;
  }

  worldport(mapID, x, y, z) {
    this.position.set(x, y, z);
    if (!this.mapID || this.mapID !== mapID) {
      this.mapID = mapID;
      this.emit('map:change', mapID);
    }
    
    this.emit('position:change', this);
  }

}

export default Player;
