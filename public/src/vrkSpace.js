import * as THREE from '../three/build/three.module.js';
import * as ThreeMeshUI from 'three-mesh-ui';

import {VRButton} from '../three/jsm/webxr/VRButton.js';
import {XRControllerModelFactory} from '../three/jsm/webxr/XRControllerModelFactory.js';
import {OrbitControls} from '../three/jsm/controls/OrbitControls.js';

import {User} from './user.js';
import {Room} from './room.js';

let camera; let renderer;
let controller1; let controller2;
let controllerGrip1; let controllerGrip2;
let room;

const vrkSpaceDiv = document.getElementById('VRKSpace');

await init();

/** Initialize the vrkSpace
 */
async function init() {
  const user = new User();

  camera = new THREE.PerspectiveCamera( 50, vrkSpaceDiv.clientWidth / vrkSpaceDiv.clientHeight, 0.1, 10 );
  const controls = new OrbitControls( camera, vrkSpaceDiv );

  camera.position.set( 0, 1.6, 3 );

  room = new Room(user.theme, true);
  room.initialize();

  // create a webSocket connection to the server
  const socket = new WebSocket('ws://localhost:8080');
  socket.addEventListener('open', () => {
    socket.send(`${user.name}`);
  });
  socket.addEventListener('message', (event) => {
    const [target, action, actionParameters] = event.data.split('|');
    if (['room', 'desk', 'ui'].includes(target)) {
      room.handleEvent(target, action, actionParameters);
    }
  });


  renderer = new THREE.WebGLRenderer( {antialias: false} );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( vrkSpaceDiv.clientWidth, vrkSpaceDiv.clientHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  renderer.setAnimationLoop(() => {
    controls.update();
    room.update();
    ThreeMeshUI.update();
    renderer.render(room.scene, camera);
  });

  vrkSpaceDiv.appendChild( renderer.domElement );
  vrkSpaceDiv.appendChild( VRButton.createButton( renderer ) );

  //


  // controllers

  /** controller function triggered when the user pushes the select button
  */
  function onSelectStart() {
    this.userData.isSelecting = true;
  }

  /** controller function triggered when the user pushes the select button
  */
  function onSelectEnd() {
    this.userData.isSelecting = false;
  }

  controller1 = renderer.xr.getController( 0 );
  controller1.addEventListener( 'selectstart', onSelectStart );
  controller1.addEventListener( 'selectend', onSelectEnd );
  controller1.addEventListener( 'connected', function( event ) {
    this.add( buildController( event.data ) );
  } );
  controller1.addEventListener( 'disconnected', function() {
    this.remove( this.children[0] );
  } );
  room.scene.add( controller1 );

  controller2 = renderer.xr.getController( 1 );
  controller2.addEventListener( 'selectstart', onSelectStart );
  controller2.addEventListener( 'selectend', onSelectEnd );
  controller2.addEventListener( 'connected', function( event ) {
    this.add( buildController( event.data ) );
  } );
  controller2.addEventListener( 'disconnected', function() {
    this.remove( this.children[0] );
  } );
  room.scene.add( controller2 );

  // The XRControllerModelFactory will automatically fetch controller models
  // that match what the user is holding as closely as possible. The models
  // should be attached to the object returned from getControllerGrip in
  // order to match the orientation of the held device.

  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip1 = renderer.xr.getControllerGrip( 0 );
  controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
  room.scene.add( controllerGrip1 );

  controllerGrip2 = renderer.xr.getControllerGrip( 1 );
  controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
  room.scene.add( controllerGrip2 );

  //

  window.addEventListener( 'resize', onWindowResize );
}


/** fade out the current environment and fade in to another theme
 * @param {string} theme - A named theme the current environment should change into
 */
async function switchTheme(theme) {

}

function buildController( data ) {
  let geometry; let material;

  switch ( data.targetRayMode ) {
    case 'tracked-pointer':

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [0, 0, 0, 0, 0, - 1], 3 ) );
      geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [0.5, 0.5, 0.5, 0, 0, 0], 3 ) );

      material = new THREE.LineBasicMaterial( {vertexColors: true, blending: THREE.AdditiveBlending} );

      return new THREE.Line( geometry, material );

    case 'gaze':

      geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
      material = new THREE.MeshBasicMaterial( {opacity: 0.5, transparent: true} );
      return new THREE.Mesh( geometry, material );
  }
}

function onWindowResize() {
  camera.aspect = vrkSpaceDiv.clientWidth / vrkSpaceDiv.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( vrkSpaceDiv.clientWidth, vrkSpaceDiv.clientHeight );
}


