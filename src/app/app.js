import THREE from '../lib/three';
import dat from 'dat-gui';
import $ from "jquery";

// import object
import Sphere from './objects/sphere';

var gui = new dat.GUI();

export default class App{

    scene;
    camera;
    renderer;
    updateStack = [];

    def = {
        camera : {
            rotation: {
                x: 2.1, y: 10.1, z: 2.3
            },
            position: {
                x : -30, y : 40, z : 30
            }
        },
        sphere: {
            color: 0x7777ff,
            position: {
                x : -30, y : 40, z : 30
            }
        }
    };

    constructor() {
        this.scene = new THREE.Scene();
        this.addControls();
        this.createCamera();
        this.createRenderer();
        this.createAxes();
        this.createPlane();
        this.createCube();
        // this.createSphere();
        this.createLights();
        new Sphere(this, gui);
        requestAnimationFrame(this.update.bind(this));
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xEEEEEE, 1.0);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        $("#WebGL-output").append(this.renderer.domElement);
    }

    createAxes() {
        var axes = new THREE.AxisHelper(20);
        this.scene.add(axes);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.update = () => {
            this.camera.position.x = this.def.camera.position.x;
            this.camera.position.y = this.def.camera.position.y;
            this.camera.position.z = this.def.camera.position.z;
            this.camera.rotation.x = this.def.camera.rotation.x;
            this.camera.rotation.y = this.def.camera.rotation.y;
            this.camera.rotation.z = this.def.camera.rotation.z;
        };
        this.camera.update();
        var folder = gui.addFolder('Camera');
        folder.add(this.def.camera.position, 'x',-100,100);
        folder.add(this.def.camera.position, 'y',-100,100);
        folder.add(this.def.camera.position, 'z',-100,100);
        folder.add(this.def.camera.rotation, 'x',-3,3);
        folder.add(this.def.camera.rotation, 'y',9,12);
        folder.add(this.def.camera.rotation, 'z',-3,3);
        this.camera.lookAt(this.scene.position);
    }

    createPlane() {
        var planeGeometry = new THREE.PlaneBufferGeometry(60, 20, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xcccccc
        });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5*Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    createCube() {
        var cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xFC0000
        })
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.rotation.x = -0.5 * Math.PI;
        cube.position.set(-9, 3, 0);
        cube.castShadow = true;
        this.scene.add(cube);
    }

    createLights() {
        var spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    addControls() {
        var controlsMethods = {
            addCube : () => {
                console.log('add cube');
                new Sphere(this, gui);
            }
        }
        gui.add(controlsMethods, 'addCube');
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    registerUpdate(cb) {
        this.updateStack.push(cb);
    }

    update() {
        this.updateStack.forEach((cb) => {
            cb();
        })
        this.render();
        requestAnimationFrame(this.update.bind(this));
    }
}
