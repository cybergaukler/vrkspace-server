import * as THREE from 'three';
import {Group} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

import {Desk} from './desk.js';
import {UIText} from './ui.js';


/** The main workspace
 * @class Room
 */
class Room {
  /** Creates an instance of a vrkSpace Room, the main vr environment a user operates in
  * @param {string} [theme='intro'] - The name of the folder where to find the theme
  * @param {boolean} [debugMode=false] - Set this flag to true to display debug info in the room
  * @memberof Room
  */
  constructor( theme = 'intro', debugMode = false ) {
    this.type = 'Room';
    this.theme = theme;
    this.scene = new THREE.Scene();
    this.groups = {
      all: new Group,
      lights: new Group,
      decorations: new Group,
    };
    this.updateRequests = {
      room: {hasUpdates: false, actions: {}},
      ui: {hasUpdates: false, actions: {}},
      desk: {hasUpdates: false, actions: {}},
    };
    this.debugMode = debugMode;
  }

  /** async function to set up the environment
  * @memberof Room
  */
  async initialize() {
    const {Theme} = await import(`../themes/${ this.theme }/theme.js`);
    const room = new Theme();
    const loader = new GLTFLoader();

    this.scene.background = new THREE.Color( room.config.background );
    room.initialize(this.scene);

    // set the lights
    for (const [name, light] of Object.entries(room.config.lights)) {
      let newLight;
      switch (light.type) {
        case 'HemisphereLight': {
          newLight = new THREE.HemisphereLight( ...light.parameters );
        }
          break;
        case 'DirectionalLight': {
          newLight = new THREE.DirectionalLight( ...light.parameters );
          newLight.position.set( ...light.position ).normalize();
        }
          break;
      }
      this.groups.lights.add(Object.assign(newLight, {name: name}));
    }
    this.scene.add(this.groups.lights);


    // load the room scene
    loader.setPath( `./themes/${ this.theme }/` );
    const environment = await loader.loadAsync( 'environment.glb' );
    this.environment = environment.scene;
    if (room.config.environment.position) this.environment.position.set(...room.config.environment.position );
    if (room.config.environment.scale) this.environment.scale.set(...room.config.environment.scale);
    this.scene.add(this.environment);

    // load the room decorations
    loader.setPath( `./themes/${ this.theme }/decorations/` );
    for (const [name, decoration] of Object.entries(room.config.decorations)) {
      const object = await loader.loadAsync( decoration.src );
      // to be able to manipulate the decorations apart from the group, also store them individually
      this[name] = object.scene;
      if (decoration.position) this[name].position.set(...decoration.position );
      if (decoration.scale) this[name].scale.set(...decoration.scale);
      this.groups.decorations.add(this[name]);
    }
    this.scene.add(this.groups.decorations);

    const desk = new Desk(this.theme);
    await desk.initialize();
    this.scene.add( desk.group );

    if (this.debugMode) {
      // some general information in a panel
      const systemInfoText = `
        pixel ratio: ${ (window.devicePixelRatio) ? window.devicePixelRatio : 'unknown' }\n
        camera: ${ ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) ? true : false }\n

      `;
      navigator.mediaDevices.getUserMedia({video: true});
      const systemInfo = new UIText(this.theme, systemInfoText, 0.12, 1000, [2.1, 2, -2.99], [1.7, 1], [0, 0, 0]);
      await systemInfo.initialize();
      this.scene.add( systemInfo.container );

      // a clock
      const clock = new UIText(this.theme, '00:00:00', 0.14, 1000, [2.1, 2.7, -2.99], [1.7, 0.3], [0, 0, 0]);
      await clock.initialize();
      this.scene.add( clock.container );
      this.addAction(
          'ui',
          {
            name: 'setTime',
            doUpdate: false,
            set: clock.set(),
            update: clock.update(),
          },
      );

      // show the current mouse position
      document.onmousemove = (event) => {
        this.handleEvent('ui', 'setMouseInfo', `x: ${event.clientX}, y: ${event.clientY}`);
      };
      const mouseInfo = new UIText(this.theme, 'mouse', 0.14, 10, [2.1, 1.2, -2.99], [1.7, 0.5], [0, 0, 0]);
      await mouseInfo.initialize();
      this.scene.add( mouseInfo.container );
      this.addAction(
          'ui',
          {
            name: 'setMouseInfo',
            doUpdate: false,
            set: mouseInfo.set(),
            update: mouseInfo.update(),
          },
      );
    }
  }

  /** handles all events on room or below room level (including desk and ui)
   * @memberof Room
   * @param {string} target - The component the event is meant for (i.e. ui)
   * @param {string} action - The desired action (function call)
   * @param {string} parameters - The parameters for the desired action
   * @example handleEvent('ui','setClock','12:32:01')
   * @memberof Room
  */
  handleEvent(target, action, parameters) {
    const requiresUpdate = this.updateRequests[target].actions[action].set(parameters);
    if (requiresUpdate) {
      this.updateRequests[target].actions[action].update();
    }
    // console.log('event ', target, action, parameters);
  }
  /** register an action that can be triggered by the event handler
   * @memberof Room
   * @param {string} target - The component the event is meant for (i.e. ui)
   * @param {Object} action - An action object with name and function to call
  */
  addAction(target, action) {
    this.updateRequests[target].actions[action.name] = action;
  }

  /** update instructions for the renderer based on the rooms components
   * @memberof Room
  */
  update() {
    for (const context of Object.values(this.updateRequests)) {
      if (!context.hasUpdates) continue;
      for (const action of context.actions) {
        if (!action.doUpdate) continue;
        action.do();
      }
    }
  }

  /** instructions on how to fade out the current room (theme), usually to replace it with another theme
   * @memberof Room
   */
  async fadeOut() {

  }

  /** instructions on how to fade in the new room (theme)
   * @param {string} theme - The name of the new theme to be faded in
   * @memberof Room
   */
  async fadeIn(theme) {

  }
}

export {Room};
