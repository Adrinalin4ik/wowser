import React from 'react';
import THREE from 'three';

import './index.styl';

import Controls from './controls';
import HUD from './hud';
import Stats from './stats';
import session from '../wowser/session';

class GameScreen extends React.Component {

  static id = 'game';
  static title = 'Game';

  constructor() {
    super();
    
    this.animate = ::this.animate;
    this.resize = ::this.resize;

    this.camera = new THREE.PerspectiveCamera(60, this.aspectRatio, 1, 1000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(15, 0, 7);

    this.prevCameraRotation = null;
    this.prevCameraPosition = null;

    this.renderer = null;
    this.requestID = null;

    // For some reason, we can't use the clock from controls here.
    this.clock = new THREE.Clock();
  }

  componentDidMount() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.refs.canvas
    });
    session.world.connect();
    this.forceUpdate();
    this.resize();
    this.animate();

    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    if (this.requestID) {
      this.requestID = null;
      cancelAnimationFrame(this.requestID);
    }

    window.removeEventListener('resize', this.resize);
  }

  get aspectRatio() {
    return window.innerWidth / window.innerHeight;
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    if (!this.renderer) {
      return;
    }

    this.refs.controls.update();
    this.refs.stats.forceUpdate();

    const cameraMoved =
      this.prevCameraRotation === null ||
      this.prevCameraPosition === null ||
      !this.prevCameraRotation.equals(this.camera.quaternion) ||
      !this.prevCameraPosition.equals(this.camera.position);

    session.world.animate(this.clock.getDelta(), this.camera, cameraMoved);

    this.renderer.render(session.world.scene, this.camera);
    this.requestID = requestAnimationFrame(this.animate);

    this.prevCameraRotation = this.camera.quaternion.clone();
    this.prevCameraPosition = this.camera.position.clone();
  }

  render() {
    return (
      <game className="game screen">
        <canvas ref="canvas"></canvas>
        <HUD />
        <Controls ref="controls" for={ session.player } camera={ this.camera } />
        <Stats ref="stats" renderer={ this.renderer } map={ session.world.map } session={session} />
      </game>
    );
  }

}

export default GameScreen;
