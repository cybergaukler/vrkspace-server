import * as THREE from 'three';
import { BoxLineGeometry } from 'three/addons/geometries/BoxLineGeometry.js';

class Theme {
	/** Creates an instance of vrkSpace Theme that helps to define the environment
     * @memberof Theme
     */
	constructor( ) {
		this.type = 'Theme';
		this.name = 'intro';
		this.config = {
			shader: 'MeshToonMaterial',
			background : 0x505050,
			lights: {
				'Light1' : {
					type: 'HemisphereLight',
					parameters: [0x606060, 0x404040]
				},
				'Light2' : {
					type: 'DirectionalLight',
					parameters: [0xffffff],
					position: [1, 1, 1]
				}
			},
			decorations: {
			},
			ui : {
				fontFamily: 'Roboto-msdf.json',
				fontTexture: 'Roboto-msdf.png'
			}
		};
	}

	/** async function to initialize the environment
	 * @param {Object} scene - The root scene the environment refers to
	 * @memberof Theme
	 */
	async initialize(scene) {
		this.room = new THREE.LineSegments(
			new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
			new THREE.LineBasicMaterial( { color: 0x808080 } )
		);
		this.room.geometry.translate( 0, 3, 0 );
		scene.add(this.room);
	}
	
	async fadeIn() {
		console.log(this);
	}
	
	async fadeOut() {
		console.log(this);
	}

}    




export {Theme};