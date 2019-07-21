import LiquidType from '../../pipeline/liquid/type';

class TerrainManager {

  constructor(map, zeropoint) {
    this.map = map;
    this.view = map.exterior;
    this.zeropoint = zeropoint;
  }

  loadChunk(_index, terrain) {
    this.view.add(terrain);
    this.map.collidableMeshList.push(terrain);
    terrain.updateMatrix();
  }

  unloadChunk(_index, terrain) {
    this.view.remove(terrain);
    terrain.dispose();
    // this.map.collidableMeshList.splice(this.map.collidableMeshList.findIndex(x => x.uuid = terrain.uuid),1);
  }

  animate(delta, camera, cameraMoved) {
    LiquidType.materials.forEach((material) => {
      material.animate(delta, camera, cameraMoved);
    });
  }

}

export default TerrainManager;
