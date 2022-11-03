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
        console.log(this.type)
        const loader = new GLTFLoader().setPath( `./themes/${ this.parameters.theme }/desk/` );
        const top = await loader.loadAsync( 'deskTop.glb'); 
        const back = await loader.loadAsync( 'deskBack.glb'); 

        // create individual parts of the desk as well as a group to position them together more easily
        this.top = top.scene
        this.top.position.set( 0, 0.5, -0.5 );
        this.back = back.scene
        this.back.position.set( 0, 0, -0.5 );
        this.group = new Group
        this.group.add(this.top)
        this.group.add(this.back)
        
    }
}

export { Desk };