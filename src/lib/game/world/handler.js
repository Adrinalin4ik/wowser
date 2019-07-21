import EventEmitter from 'events';
import THREE from 'three';

import M2Blueprint from '../../pipeline/m2/blueprint';
import WorldMap from './map';
import spots from './spots';
import Ammo from 'ammojs';
class WorldHandler extends EventEmitter {

  constructor(session) {
    super();
    this.session = session;
  }
  connect() {
    this.ammo = Ammo;
    this.player = this.session.player;

    this.scene = new THREE.Scene();
    this.scene.matrixAutoUpdate = true;

    this.map = null;
    // this.map.collidableMeshList = [];
    this.changeMap = ::this.changeMap;
    this.changeModel = ::this.changeModel;
    this.changePosition = ::this.changePosition;

    this.entities = new Set();
    this.add(this.player);
    console.log('Handler', this);
    console.log('SCENE', this.scene);
    this.player.on('map:change', this.changeMap);
    this.player.on('position:change', this.changePosition);


    if (this.player.remote) {
      console.log(this.player.zone, this.player.x, this.player.y, this.player.z);
      this.player.worldport(this.player.map, this.player.x, this.player.y, this.player.z);
    } else {
      this.player.worldport(...spots[0].coords);

      // const wallGeometry = new THREE.CubeGeometry( 100, 100, 20, 1, 1, 1 );
      // const wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
      
      // const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
      // wall2.position.set(...[-9455, -1369, 40]);
      // wall2.rotation.y = 3.14159 / 2;
      // console.log("Wall", wall2)
      // this.scene.add(wall2);

      // var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
      // var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
      // var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
      // this.scene.add(skyBox);
  
  
      // this.player.worldport(37, 0, 0, 0);

      // Alterac = 30
      // Azshara = 37
      // Warsong = 489
      // Arathi = 529
    }
    // Darkshire (Eastern Kingdoms)
  }
  add(entity) {
    this.entities.add(entity);
    if (entity.view) {
      this.scene.add(entity.view);
      // this.scene.add(entity.collider);
      this.scene.add(entity.arrow);
 
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
    console.log('Load map');
    WorldMap.load(mapID).then((map) => {
      if (this.map) {
        this.scene.remove(this.map);
      }
      this.map = map;
      this.scene.add(this.map);
      this.renderAtCoords(this.player.position.x, this.player.position.y);
      this.player.emit('map:changed', this.map);

      // const wallGeometry = new THREE.CubeGeometry( 100, 100, 20, 1, 1, 1 );
      // const wallMaterial = new THREE.MeshBasicMaterial( {color: 0x5888ff} );
      
      // const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
      // wall2.position.set(...[-9455, -1369, 40]);
      // wall2.rotation.y = 3.14159 / 2;
      // console.log("Wall", wall2)
      // this.scene.add(wall2);
      // this.map.collidableMeshList.push(wall2);

      console.log("collidableMeshList", this.map.collidableMeshList)
    });
  }

  changeModel(_unit, _oldModel, _newModel) {
    console.log('Model change', _unit, _oldModel, _newModel);
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
      // this.map.updateWorldTime(camera, this.map.mapID);
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

      // entity.updateCollider(this.map.collidableMeshList);
      // entity.updateGroundDistance(this.map.collidableMeshList);
      entity.update(delta);

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
