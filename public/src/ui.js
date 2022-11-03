import * as ThreeMeshUI from "three-mesh-ui";

class UIText {

	constructor( text = 'Hello World', position = (0,0,0)) {
        this.type = 'UIText';
        this.parameters = {
			text: text,
            position: position
		};
        
    }
    async initialize() {
        this.container = new ThreeMeshUI.Block({
            width: 1.8,
            height: 1,
            padding: 0.2,
            fontFamily: './src/ui/assets/Roboto-msdf.json',
            fontTexture: './src/ui/assets/Roboto-msdf.png',
        });
        this.container.position.set(this.parameters.position)
        this.container.add(new ThreeMeshUI.Text({ content: this.parameters.text }))
    }
}

export { UIText };