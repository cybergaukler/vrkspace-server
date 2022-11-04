import * as THREE from 'three';
import { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { Desk } from './desk.js';
import { UIText } from './ui.js';


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
			decorations: new Group
		}; 
		this.debugMode = debugMode;
	}

	/** async function to set up the environment
	 * @memberof Room
	*/
	async initialize() {

		const {Theme} = await import(`../themes/${ this.theme }/theme.js`);
		const room = new Theme();
		this.scene.background = new THREE.Color( room.config.background );
		room.initialize(this.scene);
        
		// set the lights
		for(const [name, light] of Object.entries(room.config.lights)){
			let newLight;
			switch(light.type) {
			case 'HemisphereLight': {
				newLight = new THREE.HemisphereLight( ... light.parameters );
			}
				break;
			case 'DirectionalLight': {
				newLight = new THREE.DirectionalLight( ... light.parameters );
				newLight.position.set( ... light.position ).normalize();
			}
				break;
			}
			this.scene.add(newLight);
		}

		// load the room decorations
		const loader = new GLTFLoader().setPath( `./themes/${ this.theme }/decorations/` );
		for(const [name, decoration] of Object.entries(room.config.decorations)){
			const object = await loader.loadAsync( decoration.src ); 
			// to be able to manipulate the decorations apart from the group, also store them individually
			this[name] = object.scene;
			if (decoration.position) this[name].position.set(... decoration.position );
			if (decoration.scale) this[name].scale.set(... decoration.scale);
			this.groups.decorations.add(this[name]);
		}
		this.scene.add(this.groups.decorations);

		const desk = new Desk(this.theme);
		await desk.initialize();
		this.scene.add( desk.group );

		if (this.debugMode) {
			const systemInfoText = `
				pixel ratio: ${ (window.devicePixelRatio) ? window.devicePixelRatio : 'unknown' }\n
				userAgent: ${ (window.navigator?.userAgent) ? window.navigator.userAgent : 'unknown' }
			`;
			const systemInfo = new UIText(this.theme, systemInfoText, [2.1,2,-2.99]);
			await systemInfo.initialize();
			this.scene.add( systemInfo.container );
		}


	}

	async fadeOut() {

	}

	async fadeIn(theme) {
		
	}

}

export { Room };