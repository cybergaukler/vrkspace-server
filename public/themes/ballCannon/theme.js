import * as THREE from '../three/build/three.module.js';
import { BoxLineGeometry } from '../three/jsm/geometries/BoxLineGeometry.js';

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
		this.ballCount = 0;
		
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
		const geometry = new THREE.IcosahedronGeometry( radius, 3 );
		for ( let i = 0; i < 10; i ++ ) {
			const object = new THREE.Mesh( geometry, new THREE.MeshToonMaterial( { color: Math.random() * 0xffffff } ) );
			object.position.x = Math.random() * 4 - 2;
			object.position.y = Math.random() * 4;
			object.position.z = Math.random() * 4 - 2;
			object.userData.velocity = new THREE.Vector3();
			object.userData.velocity.x = Math.random() * 0.01 - 0.005;
			object.userData.velocity.y = Math.random() * 0.01 - 0.005;
			object.userData.velocity.z = Math.random() * 0.01 - 0.005;
			this.room.add( object );
		}
		scene.add(this.room);
	}
	
	async fadeIn() {
		console.log(this);
	}
	
	async fadeOut() {
		console.log(this);
	}
	
	handleController( controller ) {

		if ( controller.userData.isSelecting ) {
	
			const object = this.room.children[ this.ballCount ++ ];
	
			object.position.copy( controller.position );
			object.userData.velocity.x = ( Math.random() - 0.5 ) * 3;
			object.userData.velocity.y = ( Math.random() - 0.5 ) * 3;
			object.userData.velocity.z = ( Math.random() - 9 );
			object.userData.velocity.applyQuaternion( controller.quaternion );
	
			if ( this.ballCount === this.room.children.length ) this.ballCount = 0;
	
		}
	}

	// TODO: how to inject this into the main renderer ?
	render() {
		const radius = 0.08;
		let normal = new THREE.Vector3();
		const relativeVelocity = new THREE.Vector3();

		const clock = new THREE.Clock();

		handleController( controller1 );
		handleController( controller2 );
	
		//
	
		const delta = clock.getDelta() * 0.8; // slow down simulation
	
		const range = 3 - radius;
	
		for ( let i = 0; i < room.children.length; i ++ ) {
	
			const object = room.children[ i ];
	
			object.position.x += object.userData.velocity.x * delta;
			object.position.y += object.userData.velocity.y * delta;
			object.position.z += object.userData.velocity.z * delta;
	
			// keep objects inside room
	
			if ( object.position.x < - range || object.position.x > range ) {
	
				object.position.x = THREE.MathUtils.clamp( object.position.x, - range, range );
				object.userData.velocity.x = - object.userData.velocity.x;
	
			}
	
			if ( object.position.y < radius || object.position.y > 6 ) {
	
				object.position.y = Math.max( object.position.y, radius );
	
				object.userData.velocity.x *= 0.98;
				object.userData.velocity.y = - object.userData.velocity.y * 0.8;
				object.userData.velocity.z *= 0.98;
	
			}
	
			if ( object.position.z < - range || object.position.z > range ) {
	
				object.position.z = THREE.MathUtils.clamp( object.position.z, - range, range );
				object.userData.velocity.z = - object.userData.velocity.z;
	
			}
	
			for ( let j = i + 1; j < room.children.length; j ++ ) {
	
				const object2 = room.children[ j ];
	
				normal.copy( object.position ).sub( object2.position );
	
				const distance = normal.length();
	
				if ( distance < 2 * radius ) {
	
					normal.multiplyScalar( 0.5 * distance - radius );
	
					object.position.sub( normal );
					object2.position.add( normal );
	
					normal.normalize();
	
					relativeVelocity.copy( object.userData.velocity ).sub( object2.userData.velocity );
	
					normal = normal.multiplyScalar( relativeVelocity.dot( normal ) );
	
					object.userData.velocity.sub( normal );
					object2.userData.velocity.add( normal );
	
				}
	
			}
	
			object.userData.velocity.y -= 9.8 * delta;
	
		}
	
	} 

}    




export {Theme};