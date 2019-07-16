import React from 'react';
import spots from '../../../lib/game/world/spots'
import './index.styl';
class Stats extends React.Component {

  static propTypes = {
    renderer: React.PropTypes.object,
    map: React.PropTypes.object,
    session: React.PropTypes.object
  };

  constructor() {
    super();

    this.state = {
      currentLocationId: spots[0].id,
      map: null
    };

    this._onTeleportChange = ::this._onTeleportChange;
  }
  componentDidMount() {
    console.log("Player", this.props.session.player);
    this.props.session.player.on('map:changed', (map) => {
      this.setState({ map });
    });
  }

  _onTeleportChange(event){
    const locationId = event.target.value;
    const location = spots.find(x => x.id == locationId);
    this.props.session.player.worldport(...location.coords);

    this.setState({ currentLocationId: locationId });
  }

  teleport() {
    return (
      <select className="select"
                value={ this.state.currentLocationId }
                onChange={ this._onTeleportChange }>
          { spots.map((spot) => {
            return (
              <option key={ spot.id } value={ spot.id }>
                { spot.title }
              </option>
            );
          }) }
        </select>
    );
  }

  playerStats() {
    const player = this.props.session.player;
    // console.log(player)

    return (
      <div>

        <h2>Location</h2>
        { this.teleport() }

        <div className="divider"></div>

        <h2>Player coordinates</h2>
        <div className="divider"></div>
        <p>
          X: { player ? Math.round(player.position.x) : 0 }
        </p>
        <p>
          Y: { player ? Math.round(player.position.y) : 0 }
        </p>
        <p>
          Z: { player ? Math.round(player.position.z) : 0 }
        </p>
      </div>
    );
  }

  mapStats() {
    const map = this.state.map;

    return (
      <div>
        <h2>Map Chunks</h2>
        <div className="divider"></div>
        <p>
          Loaded: { map ? map.chunks.size : 0 }
        </p>

        <div className="divider"></div>

        <h2>Map Doodads</h2>
        <div className="divider"></div>
        <p>
          Loading: { map ? map.doodadManager.entriesPendingLoad.size : 0 }
        </p>
        <p>
          Loaded: { map ? map.doodadManager.doodads.size : 0 }
        </p>
        <p>
          Animated: { map ? map.doodadManager.animatedDoodads.size : 0 }
        </p>

        <div className="divider"></div>

        <h2>WMOs</h2>
        <div className="divider"></div>
        <p>
          Loading Entries: { map ? map.wmoManager.counters.loadingEntries : 0 }
        </p>
        <p>
          Loaded Entries: { map ? map.wmoManager.counters.loadedEntries : 0 }
        </p>
        <p>
          Loading Groups: { map ? map.wmoManager.counters.loadingGroups : 0 }
        </p>
        <p>
          Loaded Groups: { map ? map.wmoManager.counters.loadedGroups : 0 }
        </p>
        <p>
          Loading Doodads: { map ? map.wmoManager.counters.loadingDoodads : 0 }
        </p>
        <p>
          Loaded Doodads: { map ? map.wmoManager.counters.loadedDoodads : 0 }
        </p>
        <p>
          Animated Doodads: { map ? map.wmoManager.counters.animatedDoodads : 0 }
        </p>
      </div>
    );
  }

  render() {
    const renderer = this.props.renderer;
    if (!renderer) {
      return null;
    }

    const { memory, programs, render } = renderer.info;
    return (
      <stats className="stats frame thin">
      { this.playerStats() }
        <h2>Memory</h2>
        <div className="divider"></div>
        <p>
          Geometries: { memory.geometries }
        </p>
        <p>
          Textures: { memory.textures }
        </p>
        <p>
          Programs: { programs.length }
        </p>

        <div className="divider"></div>

        <h2>Render</h2>
        <div className="divider"></div>
        <p>
          Calls: { render.calls }
        </p>
        <p>
          Faces: { render.faces }
        </p>
        <p>
          Points: { render.points }
        </p>
        <p>
          Vertices: { render.vertices }
        </p>

        { this.mapStats() }
      </stats>
    );
  }

}

export default Stats;
