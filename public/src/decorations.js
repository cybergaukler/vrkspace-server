import { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Decorations {

	constructor( theme = 'cybergaukler' ) {
        this.type = 'Decorations';
        this.theme = theme
        this.group = new Group
        
    }
    async initialize() {
        const {getConfig} = await import(`../themes/${ this.theme }/theme.js`);
        const config = getConfig()
        
        const loader = new GLTFLoader().setPath( `./themes/${ this.theme }/decorations/` );
        
        for(const [name, decoration] of Object.entries(config.decorations)){
            const object = await loader.loadAsync( decoration.src ); 
            // to be able to manipulate the decorations apart from the group, also store them individually
            this[name] = object.scene
            if (decoration.position) this[name].position.set(... decoration.position );
            if (decoration.scale) this[name].scale.set(... decoration.scale)
    
            this.group.add(this[name])
    
        }
        
        
    }
}

export { Decorations };