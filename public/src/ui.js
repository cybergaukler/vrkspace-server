import * as ThreeMeshUI from 'three-mesh-ui';

class UIText {

	constructor( theme= 'intro', text = 'DebugPanel', position =  [0,0,0]) {
		this.type = 'UIText';
		this.theme = theme;
		this.parameters = {
			text: text,
			position: position
		};
        
	}
	async initialize() {
		const {Theme} = await import(`../themes/${ this.theme }/theme.js`);
		const config = new Theme().config;
        
		this.container = new ThreeMeshUI.Block({
			width: 1.8,
			height: 1,
			padding: 0.2,
			fontFamily: `./themes/${ this.theme }/ui/${config.ui.fontFamily}`,
			fontTexture: `./themes/${ this.theme }/ui/${config.ui.fontTexture}`,
		});
		this.container.position.set(... this.parameters.position);
		this.container.add(new ThreeMeshUI.Text({ content: this.parameters.text }));
	}
}

export { UIText };