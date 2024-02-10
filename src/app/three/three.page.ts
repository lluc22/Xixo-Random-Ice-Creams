import { Component, Input, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IceCream } from '../entities/ice-cream';


@Component({
  selector: 'ice-cream-model',
  templateUrl: './three.page.html',
  styleUrls: ['./three.page.scss'],
})
export class ThreePage implements OnInit {
  @Input() set choice(val:IceCream[]){
    if(val){
      this.iceCreams = val;
      this.init();
    }
  }
  iceCreams:IceCream[] = [];
  container: any;

  constructor() { }

  ngOnInit() {
    this.init();
  }

  init(){
    // if(this.container){
    //   this.container.remove();
    //   this.container = null;
    // }
    function render(){
      renderer.render( scene, camera );
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  
      renderer.setSize( window.innerWidth, window.innerHeight );

      render();
    }

    this.container = document.getElementById('canvas');

    //  create Renderer
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.capabilities.getMaxAnisotropy();
    this.container.appendChild(renderer.domElement);

    //  create environment and scene
    const environment = new RoomEnvironment( renderer );
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    const scene = new THREE.Scene();

    scene.background = new THREE.Color( 0xded6d6 );
    scene.environment = pmremGenerator.fromScene( environment ).texture;
    environment.dispose();

    //  define scene's camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( -0.5, 0.5, 2 );

    //  define orbit controls that follows 3d object
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.target.set( 0, 0, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    //  LIGHTS
    const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
    scene.add(hemiLight);

    const spotLight = new THREE.SpotLight(0xffa95c, 4);
    spotLight.castShadow = true;
    scene.add(spotLight);

    //  3D object loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'assets/libs/draco/gltf/' );

    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.setPath( 'assets/models/gltf/' );
    loader.load( 'xixo-cup.glb',  function ( gltf ) {
      scene.add( gltf.scene );
      
      render();
    } );

    //  Load icecream textures
    const textureLoader = new THREE.TextureLoader();

    const iceCreamAOTexture = textureLoader.load('assets/textures/ice_cream/ice_cream_ao.jpg');
    const iceCreamHeightTexture = textureLoader.load('assets/textures/ice_cream/ice_cream_height.png');

    let colorVarName = this.iceCreams[0]?.baseColorVarName ?? this.iceCreams[0]?.baseColor;
    console.log("Color var name: ", colorVarName);
    
    const color = getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${colorVarName}`);
    console.log("COLOR: ", color);

    //  Create balls
    let ball = new THREE.Mesh(
      new THREE.SphereGeometry(.3),
      new THREE.MeshStandardMaterial({
        aoMap: iceCreamAOTexture,
        bumpMap: iceCreamHeightTexture,
        bumpScale: 0.05,
        displacementMap: iceCreamHeightTexture,
        displacementScale: 0.05,
        color: new THREE.Color(color)
      })
    );
    ball.position.set(0, 0.15, 0);
    scene.add(ball);

    window.addEventListener( 'resize', onWindowResize );
  }

}
