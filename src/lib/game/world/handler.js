import EventEmitter from 'events';
import THREE from 'three';

import M2Blueprint from '../../pipeline/m2/blueprint';
import WorldMap from './map';
import spots from './spots'
class WorldHandler extends EventEmitter {

  constructor(session) {
    super();
    this.session = session;
  }
  connect() {
    this.player = this.session.player;

    this.scene = new THREE.Scene();
    this.scene.matrixAutoUpdate = false;

    this.map = null;

    this.changeMap = ::this.changeMap;
    this.changeModel = ::this.changeModel;
    this.changePosition = ::this.changePosition;

    this.entities = new Set();
    this.add(this.player);

    this.player.on('map:change', this.changeMap);
    this.player.on('position:change', this.changePosition);
    if (this.player.remote) {
      console.log(this.player.zone, this.player.x, this.player.y, this.player.z)
      this.player.worldport(this.player.map, this.player.x, this.player.y, this.player.z);
    } else {
      this.player.worldport(...spots[0].coords);
    }
    // Darkshire (Eastern Kingdoms)
    // this.player.worldport(1, 16222.59961 , 16222.59961, 13.2085 );
  }
  add(entity) {
    this.entities.add(entity);
    if (entity.view) {
      this.scene.add(entity.view);
      entity.on('model:change', this.changeModel);
    }
  }

  remove(entity) {
    this.entity.delete(entity);
    if (entity.view) {
      this.scene.remove(entity.view);
      entity.removeListener('model:change', this.changeModel);
    }
  }

  renderAtCoords(x, y) {
    if (!this.map) {
      return;
    }
    this.map.render(x, y);
  }

  changeMap(mapID) {
    WorldMap.load(mapID).then((map) => {
      if (this.map) {
        this.scene.remove(this.map);
      }
      this.map = map;
      this.scene.add(this.map);
      this.renderAtCoords(this.player.position.x, this.player.position.y);
      this.player.emit('map:changed', this.map);
    });
  }

  changeModel(_unit, _oldModel, _newModel) {
    console.log("Model change", _unit, _oldModel, _newModel)
  }

  changePosition(player) {
    this.renderAtCoords(player.position.x, player.position.y);
  }

  animate(delta, camera, cameraMoved) {
    this.animateEntities(delta, camera, cameraMoved);

    if (this.map !== null) {
      if (cameraMoved) {
        this.map.locateCamera(camera);
        // this.map.updateVisibility(camera);
      }
      this.map.updateWorldTime(camera, this.map.mapID);
      this.map.animate(delta, camera, cameraMoved);
    }

    // Send delta updates to instanced M2 animation managers.
    M2Blueprint.animate(delta);
  }

  animateEntities(delta, camera, cameraMoved) {
    this.entities.forEach((entity) => {
      const { model } = entity;

      if (model === null || !model.animated) {
        return;
      }

      if (model.receivesAnimationUpdates && model.animations.length > 0) {
        model.animations.update(delta);
      }

      if (cameraMoved && model.billboards.length > 0) {
        model.applyBillboards(camera);
      }

      if (model.skeletonHelper) {
        model.skeletonHelper.update();
      }
    });
  }

}

export default WorldHandler;
