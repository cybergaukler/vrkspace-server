import { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class Desk {

	constructor( theme = 'cybergaukler', width=2, height=2, depth=1 ) {
		this.type = 'Desk';
		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			theme: theme,
		};
        
	}
	async initialize() {

		const loader = new GLTFLoader().setPath( `./themes/${ this.parameters.theme }/desk/` );
		const top = await loader.loadAsync( 'deskTop.glb'); 
		const back = await loader.loadAsync( 'deskBack.glb'); 

		// create individual parts of the desk as well as a group to position them together more easily
		this.top = top.scene;
		this.top.position.set( 0, 0.5, -0.5 );
		this.back = back.scene;
		this.back.position.set( 0, 0, -0.5 );
		this.group = new Group;
		this.group.add(this.top);
		this.group.add(this.back);
        
	}

	align(posLeftHand, posRightHand) {
		console.log(posLeftHand, posRightHand);
		let posDeskTop, posBrowser;
		posLeftHand = (typeof posLeftHand !== 'undefined') ?  posLeftHand : '0 0 0';
		posRightHand = (typeof posRightHand !== 'undefined') ?  posRightHand : '0 0 0';

		//add additional rotation to the desk based on the controller edges
		let rotation = -1 * (90 + (Math.atan((Math.abs(posLeftHand.z) + posRightHand.z)/(Math.abs(posLeftHand.x) + posRightHand.x)) *180 / Math.PI));

		this.desk.setAttribute('position', {x: 0, y: 0, z: posRightHand.z - 0.54});
		this.desk.setAttribute('rotation', {x: 0, y: rotation, z:0});

		posDeskTop = {x: 0, y: ((posRightHand.y + posLeftHand.y) / 2)-0.76, z:0};
		this.deskTop.setAttribute('position', posDeskTop);
		posBrowser = {x: posRightHand.x - 0.3, y: posDeskTop.y + 0.7, z: posRightHand.z - 0.1};
		this.browser.setAttribute('position', posBrowser);


		console.log('desk:' ,this.desk.getAttribute('position'));
		console.log('desktop:' ,this.deskTop.getAttribute('position'));
		console.log('hands l/r:' , posLeftHand, posRightHand);
	}
}

export { Desk };