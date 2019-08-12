import EventEmitter from 'events';
import SplineType from './spline-type';
import SplineFlag from './spline-flag';
class EnemyHandler extends EventEmitter {

  // Creates a new character handler
  constructor(session) {
    super();

    // Holds session
    this.session = session;
    // Listen for character list
    this.session.game.on('packet:receive:SMSG_MONSTER_MOVE', ::this.handleMonsterMove);
  }


  // Character list refresh handler (SMSG_CHAR_ENUM)
  handleMonsterMove(gp) {
    // console.error('HERE', gp);

    // const obj = {};
    // obj.guid = gp.readGUID();
    // obj.unkByte = gp.readUnsignedByte();
    // obj.pos = gp.readVector3();
    // obj.curTime = gp.readInt(32);
    // obj.type = gp.readUnsignedByte();

    // switch (obj.type) {
    //   case SplineType.FacingSpot:
    //     {
    //       obj.facing_spot = gp.readvector3();
    //       break;
    //     }
    //   case SplineType.FacingTarget:
    //     {
    //       obj.facing_guid = gp.readGUID();
    //       break;
    //     }
    //   case SplineType.FacingAngle:
    //     {
    //       obj.facing_angle = gp.readFloat();
    //       break;
    //     }
    //   case SplineType.Stop:
    //     {
    //       return;
    //     }
    // }

    // obj.splineFlag = gp.readInt(32);

    // if (obj.splineFlag == SplineFlag.Animation) {
    //   obj.unkByte3 = gp.readUnsignedByte();

    //   obj.unkInt1 = gp.readInt(32);
    // }

    // obj.time = gp.readInt(32);

    // if (obj.splineFlag == SplineFlag.Trajectory) {
    //   obj.unkFloat = gp.readFloat();

    //   obj.unkInt2 = gp.readInt(32);
    // }

    // obj.waypoints = gp.readInt(32);
    // obj.newpos = gp.readVector3();

    // if (obj.splineFlag == SplineFlag.Flying || obj.splineFlag == SplineFlag.CatmullRom) {
    //   const waypoints = [];
    //   for (let i = 0; i < waypoints - 1; i++) {
    //     const vec = gp.readVector3();
    //     waypoints.push(vec);
    //   }
    //   obj.waypoints = waypoints;
    // }
    // else {
    //   let mid = { x: 0, y: 0, z: 0 };
    //   mid.X = (obj.pos.X + obj.newpos.X) * 0.5;
    //   mid.Y = (obj.pos.Y + obj.newpos.Y) * 0.5;
    //   mid.Z = (obj.pos.Z + obj.newpos.Z) * 0.5;

    //   const waypoints = [];

    //   for (let i = 0; i < waypoints - 1; i++) {
    //     let vec = gp.readVector3();
    //     vec.X -= mid.X;
    //     vec.Y -= mid.Y;
    //     vec.Z -= mid.Z;
    //     waypoints.push(vec);
    //   }
    //   obj.waypoints = waypoints;
    // }

    // console.log('Here', obj);
  }

}

export default EnemyHandler;
