import { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class Decorations {

	constructor( theme = 'cybergaukler' ) {
        this.type = 'Decorations';
        this.parameters = {
			theme: theme,
		};
        
    }
    async initialize() {
        const loader = new GLTFLoader().setPath( './src/decorations/' );
        const plant = await loader.loadAsync( 'low_poly_plant_in_a_pot.glb'); 

        // create individual parts of the desk as well as a group to position them together more easily
        this.plant = plant.scene
        this.plant.position.set( -1.2, 0, -1 );
        this.plant.scale.set(0.1,0.1,0.1)

        this.group = new Group
        this.group.add(this.plant)
        
    }
}

export { Decorations };