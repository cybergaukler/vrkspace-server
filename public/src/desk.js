import * as THREE from '../three/build/three.module.js';
import {Group} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';


/** The users desk
 * @class Desk
 */
class Desk {
  /** Creates an instance of Desk.
   * @param {string} [theme='intro'] - The theme (fontFamily and fontTexture is derived from the theme)
   * @param {number} [width=2] - The initial width of the desk
   * @param {number} [height=2] - The initial height of the desk (as in position from floor level)
   * @param {number} [depth=1] . The depth of the desk
   * @memberof Desk
   */
  constructor( theme = 'intro', width=2, height=2, depth=1 ) {
    this.type = 'Desk';
    this.parameters = {
      width: width,
      height: height,
      depth: depth,
      theme: theme,
    };
  }

  /** initializes the desk geometry
   * @memberof Desk
   */
  async initialize() {
    const loader = new GLTFLoader().setPath( `./themes/${ this.parameters.theme }/desk/` );
    const top = await loader.loadAsync( 'deskTop.gltf');
    const back = await loader.loadAsync( 'deskBack.glb');

    // draw the desk
    const importMesh = top.scene.children.find((c) => c.name === 'deskTop');
    console.log('M', importMesh);

    const deskMesh = new THREE.Mesh(importMesh.geometry);
    console.log('DM', deskMesh);

    deskMesh.material = new THREE.MeshToonMaterial( {color: new THREE.Color(0xff0000)} );
    deskMesh.material.flatShading = true;
    deskMesh.material.needsUpdate = true;
    console.log('DM', deskMesh);

    const positions = deskMesh.geometry.getAttribute('position');


    console.log(positions);
    // create groups of vectors that move together in one stretching operation (i.e. if the user widens the desk)
    const stretchingGroups = {
      stretchLeft: {indices: [5, 19, 2, 16, 0, 14, 10, 24, 12, 26], defaultX: {}},
      stretchRight: {indices: [3, 17, 9, 23, 1, 15, 11, 25, 13, 27], defaultX: {}},
    };
    for ( let i=0; i< positions.count; i++ ) {
      const v = new THREE.Vector3();
      v.fromBufferAttribute(positions, i);
      for (const group of Object.values(stretchingGroups)) {
        if (group.indices.includes(i)) group.defaultX[i] = v.x;
      }
    }
    const stretch = 0.2;
    for ( const [index, x] of Object.entries(stretchingGroups.stretchLeft.defaultX) ) deskMesh.geometry.attributes.position.setX(index, x - stretch);
    for ( const [index, x] of Object.entries(stretchingGroups.stretchRight.defaultX) ) deskMesh.geometry.attributes.position.setX(index, x + stretch);

    // console.log(i, ':', `${ Math.round((v.x + Number.EPSILON) * 100) / 100 }|${ Math.round((v.z + Number.EPSILON) * 100) / 100 }`);

    deskMesh.geometry.attributes.position.needsUpdate = !0;
    // create individual parts of the desk as well as a group to position them together more easily
    this.top = deskMesh;
    this.top.position.set( 0, 0.5, -1.32 );
    this.back = back.scene;
    this.back.position.set( 0, 0, -1.5 );
    this.group = new Group;
    this.group.add(this.top);
    this.group.add(this.back);

    // lighting test on simple geometry
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshToonMaterial( {color: 0x00ff00} );
    const cube = new THREE.Mesh( geometry, material );
    this.group.add( cube );
  }

  /** (re)align the desk to fit the users proportions
   * @param {string} posLeftHand - The position of the left hand/controller used to determine the left border and height of the desk
   * @param {*} posRightHand - The position of the right hand/controller used to determine the right border and height of the desk
   * @memberof Desk
   */
  align(posLeftHand, posRightHand) {
    console.log(posLeftHand, posRightHand);
    let posDeskTop=0;
    let posBrowser=0;
    posLeftHand = (typeof posLeftHand !== 'undefined') ? posLeftHand : '0 0 0';
    posRightHand = (typeof posRightHand !== 'undefined') ? posRightHand : '0 0 0';

    // add additional rotation to the desk based on the controller edges
    const rotation = -1 * (90 + (Math.atan((Math.abs(posLeftHand.z) + posRightHand.z)/(Math.abs(posLeftHand.x) + posRightHand.x)) *180 / Math.PI));

    this.desk.setAttribute('position', {x: 0, y: 0, z: posRightHand.z - 0.54});
    this.desk.setAttribute('rotation', {x: 0, y: rotation, z: 0});

    posDeskTop = {x: 0, y: ((posRightHand.y + posLeftHand.y) / 2)-0.76, z: 0};
    this.deskTop.setAttribute('position', posDeskTop);
    posBrowser = {x: posRightHand.x - 0.3, y: posDeskTop.y + 0.7, z: posRightHand.z - 0.1};
    this.browser.setAttribute('position', posBrowser);


    console.log('desk:', this.desk.getAttribute('position'));
    console.log('desktop:', this.deskTop.getAttribute('position'));
    console.log('hands l/r:', posLeftHand, posRightHand, posDeskTop, posBrowser);
  }
}

export {Desk};
