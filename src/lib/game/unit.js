import THREE from 'three';

import DBC from '../pipeline/dbc';
import Entity from './entity';
import M2Blueprint from '../pipeline/m2/blueprint';

class Unit extends Entity {

  constructor(world) {
    super();
    this.world = world;
    this.name = '<unknown>';
    this.level = '?';
    this.target = null;

    this.maxHp = 0;
    this.hp = 0;

    this.maxMp = 0;
    this.mp = 0;

    this.rotateSpeed = 2;
    this.moveSpeed = 10;
    this.fallSpeed = 0.3;
    this._view = new THREE.Group();

    this._displayID = 0;
    this._model = null;

    const playerGeometry = new THREE.CubeGeometry(0, 0, 0);
    // const playerMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff});
    const playerMaterial = new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0 });

    this.collider = new THREE.Mesh(playerGeometry, playerMaterial);
    this.collider.geometry = new THREE.CubeGeometry(1, 1, 1);
    // playerMesh.position.set(this.position.x, this.position.y, this.position.z);
    // this.collider.position.set(...[-9455, -1369, 40]);
    this.collider.name = 'Collider';
    this.isFly = true;
    this.isCollides = false;
    this.groundDistance = 0;
    this.groundZeroConstant = 3; // точка с которой будет считаться что мы на земле
    this._groundFollowConstant = 2;
    // Вертикально
    this.groundDistanceRaycaster = new THREE.Raycaster();

    this.arrow = new THREE.ArrowHelper(this.groundDistanceRaycaster.ray.direction, this.groundDistanceRaycaster.ray.origin, 100, 0x8888ff);
    this.arrow.setDirection(this.groundDistanceRaycaster.ray.direction);

    // Вперед
    this.groundDistanceRaycasterUp = new THREE.Raycaster();
    this.arrowUp = new THREE.ArrowHelper(this.groundDistanceRaycasterUp.ray.direction, this.groundDistanceRaycasterUp.ray.origin, 100, 0x8888ff);
    this.arrowUp.setDirection(this.groundDistanceRaycasterUp.ray.direction);

    console.log(this);
    this.groundDistanceRaycaster.set(this.position, this.view.rotation);

    this.previousGroundDistance = 0;
    this.isMoving = false;

    // Jump
    this.isJump = false;
    this.jumpSpeedConst = 0.3;
    this.jumpSpeed = 0;

    // Animation
    this.currentAnimationIndex = 0;


    this.counter = 0;
    // setInterval(() => {
    //   console.log(this.counter);
    //   this.counter = 0;
    // }, 1000);
  }

  get position() {
    return this._view.position;
  }

  get displayID() {
    return this._displayID;
  }

  set displayID(displayID) {
    if (!displayID) {
      return;
    }

    DBC.load('CreatureDisplayInfo', displayID).then((displayInfo) => {
      this._displayID = displayID;
      this.displayInfo = displayInfo;
      const { modelID } = displayInfo;

      DBC.load('CreatureModelData', modelID).then((modelData) => {
        this.modelData = modelData;
        this.modelData.path = this.modelData.file.match(/^(.+?)(?:[^\\]+)$/)[1];
        this.displayInfo.modelData = this.modelData;

        M2Blueprint.load(this.modelData.file).then((m2) => {
          m2.displayInfo = this.displayInfo;
          this.model = m2;

          const { max, min } = m2.geometry.boundingBox;
          this.collider.geometry = new THREE.CubeGeometry(max.x - min.x, max.y - min.y, max.z - min.z);
        });
      });
    });
  }

  get view() {
    return this._view;
  }

  get model() {
    return this._model;
  }

  get isOnGround() {
    return this.groundDistance <= this.groundZeroConstant;
  }
  updatePlayerColliderBox() {
    const { max, min } = this.model.geometry.boundingBox;
    this.collider.position.set(this.position.x, this.position.y, this.position.z + (max.z - min.z) / 2);
  }

  set model(m2) {
    // TODO: Should this support multiple models? Mounts?
    if (this._model) {
      this.view.remove(this._model);
    }

    // TODO: Figure out whether this 180 degree rotation is correct
    m2.rotation.z = Math.PI;
    m2.updateMatrix();

    this.view.add(m2);

    // Auto-play animation index 0 in unit model, if present
    // TODO: Properly manage unit animations
    if (m2.animated && m2.animations.length > 0) {

      /*
        penguin
        0 - fly 1
        1 - fly 2
        2 - jump
        3 - knockout
        4 - idle 1
        5 - idle 2
        6 - idle 3
        7 - run (slow)
        8 - die 1
        9 - die 2
        10 - dead
        11 - run
        12 - get hit
        13 - fly 3 (pretty)
        14 - fly 4 (pretty)
        15 - attack
        16 - idle 4
      */

       /*
        arthas
        0 - idle
        1 - run slow
        2 - run straight
        15 - jump
        16 - grounding
        31 - fall
       */
      console.log(m2.animations);
      m2.animations.playAnimation(this.currentAnimationIndex, 0);
      m2.animations.playAllSequences();
    }

    this.emit('model:change', this, this._model, m2);
    this._model = m2;
  }
  setAnimation(index, inrerrupt) {
    if (!this.model.animations.currentAnimation.isRunning() || inrerrupt) {
      this.model.animations.stopAnimation(this.currentAnimationIndex);
      this.model.animations.playAnimation(index, 0);
      this.currentAnimationIndex = index;
    }
  }
  stopAnimation(index) {
    this.model.animations.stopAnimation(index || this.currentAnimationIndex);
  }
  ascend(delta) {
    this.translatePosition({ z: this.moveSpeed * delta });
  }

  descend(delta) {
    this.translatePosition({ z: -this.moveSpeed * delta });
  }

  moveForward(delta) {
    this.setAnimation(2);
    this.translatePosition({ x: this.moveSpeed * delta });
    // this.view.translateX(this.moveSpeed * delta);
  }

  moveBackward(delta) {
    this.translatePosition({ x: -this.moveSpeed * delta });
  }

  rotateLeft(delta) {
    this.view.rotateZ(this.rotateSpeed * delta);
    this.emit('position:change', this);
    // this.changePosition();
  }

  rotateRight(delta) {
    this.view.rotateZ(-this.rotateSpeed * delta);
    this.emit('position:change', this);
    // this.changePosition();
  }

  strafeLeft(delta) {
    this.translatePosition({ y: this.moveSpeed * delta });
  }

  strafeRight(delta) {
    this.translatePosition({ y: -this.moveSpeed * delta });
  }

  strafeUp(delta) {
    this.translatePosition({ z: this.fallSpeed * delta });
  }

  strafeDown(delta) {
    this.translatePosition({ z: -this.fallSpeed * delta });
  }

  translatePosition(vector) {
    this.changePosition(vector, true);
  }

  updateIsMovingFlag(newCoords) {
    const coords = this.view.position;
    if (newCoords.x !== coords.x || newCoords.y !== coords.y || newCoords.z !== coords.z) {
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }
  }

  beforePositionChange(newCoords) {
    if (this.world.map.collidableMeshList) {
      this.updateGroundDistance(this.world.map.collidableMeshList, newCoords);
    }

    this.updateIsMovingFlag(newCoords);
    // this.updateGroundFolow();
  }

  afterPositionChange() {
    this.updatePlayerColliderBox();
  }

  changePosition(vector, translate) {
    // Считаем то,как изменится позиция после проведения операции
    let newCoords = {};
    if (translate) {
      // eslint-disable-next-line no-param-reassign
      newCoords = {
        x: vector.x ? vector.x + this.view.position.x : this.view.position.x,
        y: vector.y ? vector.y + this.view.position.y : this.view.position.y,
        z: vector.z ? vector.z + this.view.position.z : this.view.position.z
      };
    } else {
      newCoords = {
        x: vector.x ? vector.x : this.view.position.x,
        y: vector.y ? vector.y : this.view.position.y,
        z: vector.z ? vector.z : this.view.position.z
      };
    }

    this.beforePositionChange(newCoords);

    if (vector) {

      if (translate) {
        if (vector.x && newCoords.x !== this.view.position.x) this.view.translateX(vector.x);
        if (vector.y && newCoords.y !== this.view.position.y) this.view.translateY(vector.y);
        if (vector.z && newCoords.z !== this.view.position.z) this.view.translateZ(vector.z);
      } else {
        const builtVector = {
          x: vector.x ? vector.x : this.view.position.x,
          y: vector.y ? vector.y : this.view.position.y,
          z: vector.z ? vector.z : this.view.position.z
        };
        this.view.position.set(builtVector.x, builtVector.y, builtVector.z);
      }
    }


    this.afterPositionChange();

    this.emit('position:change', this);
  }

  updateGroundDistance(groundMesh, newPosition) {
    this.previousGroundDistance = this.groundDistance;
    newPosition.z += this._groundFollowConstant - 0.1;
    this.groundDistanceRaycaster.set(newPosition, { x: 0, y: 0, z: -1 });
    this.arrow.setDirection(this.groundDistanceRaycaster.ray.direction);
    this.arrow.position.set(newPosition.x, newPosition.y, newPosition.z);

    // intersect with all scene meshes.
    const intersects = this.groundDistanceRaycaster.intersectObjects(groundMesh);
    if (intersects.length > 0) {
      this.groundDistance = intersects[0].distance;
    }
  }

  update(delta) {
    this.isMoving = false;
    // this.setAnimation(0);
    this.updateGravity(delta);
  }

  isCollide(meshList) {
    let isCollide = false;
    this.isCollides = false;
    if (this.model) {
      const originPoint = this.collider.position.clone();
      for (let vertexIndex = 0; vertexIndex < this.collider.geometry.vertices.length; vertexIndex++) {
        const localVertex = this.collider.geometry.vertices[vertexIndex].clone();
        const globalVertex = localVertex.applyMatrix4(this.collider.matrix);
        const directionVector = globalVertex.sub(this.collider.position);

        const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        const collisionResults = ray.intersectObjects(meshList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
          // console.log(' Hit ');
          isCollide = true;
          this.isCollides = true;
        }
      }
    }

    return isCollide;
  }

  updateCollider(meshList) {
    this.isCollide(meshList);
  }

  // Обеспецивает хождение по земле
  updateGroundFolow(vector) {
    this.counter++;
    const diff = Math.abs(this._groundFollowConstant - 0.1 - this.groundDistance);
    if ((this.groundDistance > this._groundFollowConstant - 0.1) && !this.isJump) {
      this.translatePosition({ z: -diff * 0.1 });
    } else {
      if (this.isOnGround) {
        if (this.isJump) {
          this.isJump = false;
          this.stopAnimation();
          // this.setAnimation(16, true);
        }
      }

      if (this.groundDistance < this._groundFollowConstant - 0.2) {
        this.translatePosition({ z: diff * 0.1 });
      }
    }
  }

  delta = 0;
  updateGravity(delta) {
    if (this.isJump && this.jumpSpeed > 0) {
      this.translatePosition({ z: this.jumpSpeed });
      this.jumpSpeed -= 0.01;
    }

    if (this.isJump && !this.isOnGround) {
      this.setAnimation(31, true);
      this.translatePosition({ z: -0.1 });
    }

    this.updateGroundFolow();
  }
}

export default Unit;
