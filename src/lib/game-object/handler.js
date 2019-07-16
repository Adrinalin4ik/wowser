import EventEmitter from 'events';
import GameOpcode from './opcodes';

class GameObjectHandler extends EventEmitter {

  // Creates a new character handler
  constructor(session) {
    super();

    // Holds session
    this.session = session;
    // Listen for character list
    this.session.game.on('packet:receive:SMSG_GAMEOBJECT_QUERY_RESPONSE', ::this.handleGOQueryResponse);
  }

  readEntry(gp) {
    let entry = gp.read(32);
    const masked = (entry & 0x80000000);

    const result = masked != 0;
    if (result) {
      entry = masked;
    }

    return { entry: result };
  }
  // Character list refresh handler (SMSG_CHAR_ENUM)
  handleGOQueryResponse(gp) {
    console.error('HERE', gp);


    // for (let i = 0; i < count; ++i) {
    const obj = {};
    obj.entry = this.readEntry(gp);
    obj.type = gp.read(32);
    obj.displayId = gp.read(32);

    var name = "";
    for (var i = 0; i < 4; i++) {
      name[i] = gp.readCString();
    }
    obj[`name_{i}`] = name;
    obj.iconName = gp.readCString();
    obj.castCaption = gp.readCString();
    obj.unkStr = gp.readCString();

    let data = [];
    for (let i = 0; i < 24; i++) {
        data[i] = packet.read(32);
    }
    obj.data = data;
    // character.guid = gp.readGUID();
    // character.name = gp.readUnsignedByte();
    // character.race = gp.readUnsignedByte();
    // character.class = gp.readUnsignedByte();
    // character.gender = gp.readUnsignedByte();
    // character.bytes = gp.readUnsignedInt();
    // character.facial = gp.readUnsignedByte();
    // character.level = gp.readUnsignedByte();
    // character.zone = gp.readUnsignedInt();
    // character.map = gp.readUnsignedInt();
    // character.x = gp.readUnsignedByte();
    // character.y = gp.readUnsignedByte();
    // character.z = gp.readUnsignedByte();
    // character.guild = gp.readUnsignedInt();
    // character.flags = gp.readUnsignedInt();

    // gp.readGUID();
    // gp.readUnsignedInt(); // character customization
    // gp.readUnsignedByte(); // (?)
    // ap.read(32);
    // gp.readCString();
    // gp.readFloat();


    // const pet = {
    //   model: gp.readUnsignedInt(),
    //   level: gp.readUnsignedInt(),
    //   family: gp.readUnsignedInt()
    // };
    // if (pet.model) {
    //   character.pet = pet;
    // }

    // character.equipment = [];
    // for (let j = 0; j < 23; ++j) {
    //   const item = {
    //     model: gp.readUnsignedInt(),
    //     type: gp.readUnsignedByte(),
    //     enchantment: gp.readUnsignedInt()
    //   };
    //   character.equipment.push(item);
    // }

    // console.warn(obj);
    // }
  }

}

export default GameObjectHandler;
