import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IceCream } from '../entities/ice-cream';
import { GUI } from 'dat.gui';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ice-cream-model',
  templateUrl: './three.page.html',
  styleUrls: ['./three.page.scss'],
})
export class ThreePage implements OnDestroy, OnInit{
  @ViewChild('rendererCanvas', { static: true }) public rendererCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: true }) public canvasContainer!: ElementRef<HTMLCanvasElement>;

  @Input() set choice(val:IceCream[]){
    if(val && val != this.iceCreams){
      this.iceCreams = val;
      if(!this.iceCreamBall) setTimeout(() => {this.updateIceCream(); }, 500);
      else this.updateIceCream();
    }
  }
  iceCreams:IceCream[] = [];

  private canvas!: HTMLCanvasElement|null;
  private scene!: THREE.Scene;
  private environment!: RoomEnvironment;
  private pmremGenerator!: THREE.PMREMGenerator;
  private textureLoader!: THREE.TextureLoader;

  private controls!: OrbitControls;
  private renderer!: THREE.WebGLRenderer|null;
  private camera!: THREE.PerspectiveCamera;
  
  private hemiLight!: THREE.HemisphereLight;
  private spotLight!: THREE.SpotLight;
  private shadowFloor!: THREE.Mesh;

  private iceCreamBall!:THREE.Mesh;
  private iceCreamAOTexture!: THREE.Texture;
  private iceCreamHeightTexture!: THREE.Texture;

  private frameId: number|null = null;  

  private gui!: GUI;

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    this.createScene(this.rendererCanvas);
    this.animate();
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight - 150;
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setClearColor( 0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2.3;
    this.renderer.capabilities.getMaxAnisotropy();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(width, height);

    //  create environment and scene
    this.scene = new THREE.Scene();
    this.environment = new RoomEnvironment( this.renderer );
    this.pmremGenerator = new THREE.PMREMGenerator( this.renderer );
    this.textureLoader = new THREE.TextureLoader();
  
    this.scene.environment = this.pmremGenerator.fromScene( this.environment ).texture;
    this.environment.dispose();

    this.addCamera(width, height);
    this.addOrbitControls();
    this.addLights();
    this.addShadowFloor();
    this.addIceCreamModel();
    if(!environment.production) this.createGUIPanel();
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {        
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    if(this.renderer) this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize the canvas element to the container new size
   * @returns void
   */
  public resize() {
    const canvas = this.renderer ? this.renderer.domElement : null;
    if(!canvas)  return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      if(this.renderer) this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  /** 
   * Define orbit controls that follows 3d object 
  */
  public addOrbitControls(){
    this.controls = new OrbitControls( this.camera, this.renderer?.domElement );
    this.controls.addEventListener( 'change', this.render );
    this.controls.target.set( 0, 0, 0);
    this.controls.maxPolarAngle = Math.PI - (Math.PI / 2);
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 3;
    this.controls.minAzimuthAngle = Math.PI * 1.75;
    this.controls.maxAzimuthAngle = Math.PI * 2.25;
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.update();
  }

  /**
   * Add lights to the scene
   */
  public addLights(){    
    this.hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
    this.hemiLight.castShadow = true;
    this.scene.add(this.hemiLight);

    this.spotLight = new THREE.SpotLight(0xffa95c, 4);
    this.spotLight.castShadow = true;
    this.scene.add(this.spotLight);
  }

  /**
   * Creates and adds the camera to the scene.
   * In order to calculate the aspect ratio we need the width and the height of the display container
   * 
   * @param canvasWidth:number    Canvas container width
   * @param canvasHeight:number   Canvas container height
   */
  public addCamera(canvasWidth:number, canvasHeight:number){
    this.camera = new THREE.PerspectiveCamera( 
      45, canvasWidth / canvasHeight, 0.1, 100 
    );
    // this.camera.position.set( -0.5, 0.5, 2 );
    // this.camera.position.z = 5;
    this.scene.add(this.camera);
  }

  /**
   * Function to add a transparent floor but receiving the icecream model shadow
   */
  addShadowFloor(){
    const texture = this.textureLoader.load('assets/textures/txt_floor_shadow.png');
    this.shadowFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(),
      new THREE.MeshBasicMaterial(
        { map: texture, side: THREE.DoubleSide, transparent: true})
    );
    this.shadowFloor.position.y = -0.2;
    this.shadowFloor.scale.setScalar(1.3);
    this.shadowFloor.rotation.x = - Math.PI / 2;
    this.scene.add(this.shadowFloor);
  }

  async addIceCreamModel(){
   //  3D object loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'assets/libs/draco/gltf/' );

    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.setPath( 'assets/models/gltf/' );
    loader.load( 'xixo-cup.glb',  ( gltf ) => {
      this.scene.add( gltf.scene );
      this.render();
    } );

    this.iceCreamAOTexture = this.textureLoader.load('assets/textures/ice_cream/ice_cream_ao.jpg');
    this.iceCreamHeightTexture = this.textureLoader.load('assets/textures/ice_cream/ice_cream_height.png');    
  
    //  Create balls
    this.iceCreamBall = new THREE.Mesh(
      new THREE.SphereGeometry(.3),
      new THREE.MeshStandardMaterial({
        aoMap: this.iceCreamAOTexture,
        bumpMap: this.iceCreamHeightTexture,
        bumpScale: 0.05,
        displacementMap: this.iceCreamHeightTexture,
        displacementScale: 0.05,
        color: new THREE.Color(0xffffff)
      })
    );
    this.iceCreamBall.position.set(0, 0.15, 0);
    this.scene.add(this.iceCreamBall);
  }

  updateIceCream(){
    let colorVarName = this.iceCreams[0]?.baseColorVarName ?? this.iceCreams[0]?.baseColor;
    const color = getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${colorVarName}`);

    this.iceCreamBall.material = new THREE.MeshStandardMaterial({
      aoMap: this.iceCreamAOTexture,
      bumpMap: this.iceCreamHeightTexture,
      bumpScale: 0.05,
      displacementMap: this.iceCreamHeightTexture,
      displacementScale: 0.05,
      color: new THREE.Color(color)
    });
  }

  /**
   * Creates GUI panel for controls only in developement mode
   */
  createGUIPanel(){
    this.gui = new GUI();
    const cubeFolder = this.gui.addFolder('Orbit Limits');
    cubeFolder.add(this.controls, 'minPolarAngle', 0, Math.PI);
    cubeFolder.add(this.controls, 'maxPolarAngle', 0, Math.PI);
    cubeFolder.add(this.controls, 'minDistance', 0, 5);
    cubeFolder.add(this.controls, 'minDistance', 0, 5);
    cubeFolder.add(this.controls, 'minAzimuthAngle', -2 * Math.PI, 2 * Math.PI);
    cubeFolder.add(this.controls, 'maxAzimuthAngle', -2 * Math.PI, 2 * Math.PI);
    cubeFolder.open();
    
    const floorFolder = this.gui.addFolder('Floor Shadow');
    floorFolder.add(this.shadowFloor.position, 'y', -1, 1);
    floorFolder.add(this.shadowFloor.rotation, 'x', 0, Math.PI);
    floorFolder.add({scalar: 1.25}, 'scalar', 0, Math.PI).onChange((val) => {this.shadowFloor.scale.setScalar(val)});

    floorFolder.open();
  }

}
