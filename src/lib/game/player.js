import Unit from './unit';

class Player extends Unit {

  constructor(name, guid) {
    super(guid);
    
    this.name = name;
    this.hp = this.hp;
    this.mp = this.mp;
    this.remote = false;
    this.target = null;

    this.displayID = 24641;
    this.mapID = null;
    this.velocity = 9.8;
  }

  jump() {
    if (this.isOnGround) {
      this.isJump = true;
      this.jumpSpeed = this.jumpSpeedConst;
      this.setAnimation(15, true);
      // this.strafeUp(0.2);
    }
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
