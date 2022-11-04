function getConfig() { 
	return  {
		shader: 'MeshToonMaterial',
		decorations: {
			houseplant : { 
				src : 'low_poly_plant_in_a_pot.glb',
				position: [ -1.2, 0, -1 ],
				scale: [ 0.1, 0.1, 0.1 ]
			}
		},
		ui : {
			fontFamily: 'Roboto-msdf.json',
			fontTexture: 'Roboto-msdf.png'
		}
        
	};
}
export {getConfig};