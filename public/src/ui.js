import * as ThreeMeshUI from 'three-mesh-ui';

/** A text panel with the option to update it
 * @class UIText
*/
class UIText {
  /** Creates a ThreeMeshUI.Text panel in the room that can be refreshed (usually for debug purposes)
     * @param {string} [theme='intro'] - The theme (fontFamily and fontTexture is derived from the theme)
     * @param {string} [text='DebugPanel'] - The text of the panel
     * @param {number} [fontSize=1] - The fontsize of the text
     * @param {number} [refreshRate=1000] - Time in milliseconds between updates on the panel
     * @param {number[]} [position=[0,0,0]] - The x, y, z coordinates of the panel
     * @param {number[]} [size=[1,1]] - The width and the height of the panel
     * @param {number[]} [rotation=[0,0,0]] - The rotation of the panel
     * @memberof UIText
    */
  constructor( theme= 'intro', text = 'DebugPanel', fontSize= 1, refreshRate=1000, position = [0, 0, 0], size = [1, 1], rotation= [0, 0, 0]) {
    this.type = 'UIText';
    this.theme = theme;
    this.text = text;
    this.refreshRate = refreshRate;
    this.parameters = {
      position: position,
      size: size,
      rotation: rotation,
      fontSize: fontSize,
    };
    this.nextRefresh = -refreshRate;
  }

  /** async function to initialize the component by importing and applying the theme
   * @memberof UIText
  */
  async initialize() {
    const {Theme} = await import(`../themes/${ this.theme }/theme.js`);
    const config = new Theme().config;

    this.container = new ThreeMeshUI.Block({
      width: this.parameters.size[0],
      height: this.parameters.size[1],
      padding: 0.04,
      fontFamily: `./themes/${ this.theme }/ui/${config.ui.fontFamily}`,
      fontTexture: `./themes/${ this.theme }/ui/${config.ui.fontTexture}`,

    });
    this.container.position.set(...this.parameters.position);
    this.container.rotation.set(...this.parameters.rotation);
    this.panel = new ThreeMeshUI.Text({content: this.text, fontSize: this.parameters.fontSize});
    this.container.add(this.panel);
  }

  /** Generate a function to change the components text value
   * @return - A function that changes the value. It returns true if the panel should be updated by the renderer, false otherwise
   * @memberof UIText
   */
  set() {
    return (text) => {
      this.text = text;
      if (!(Date.now() > (this.nextRefresh + this.refreshRate) ) ) return false;
      this.nextRefresh = (Date.now() + this.refreshRate);
      return true;
    };
  }
  /** Generate a function to update the panel
   * @return - A function that sets the panels text to the components text value
   * @memberof UIText
   */
  update() {
    return () => {
      this.panel.set({content: this.text, fontSize: this.parameters.fontSize});
    };
  };
}

export {UIText};
