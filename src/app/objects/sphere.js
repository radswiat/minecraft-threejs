import THREE from '../../lib/three';

export default class Sphere{

    static isGui = false;

    constructor(app, gui, params) {
        this.app = app;
        this.gui = gui;
        this.params = params;
        this.create();
        this.createGui();
    }

    create() {
        this.step = 0;
        var sphereGeometry = new THREE.SphereGeometry(4,20,20);
        var sphereMaterial = new THREE.MeshLambertMaterial(
            {color: this.app.def.sphere.color}
        );
        this.sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
        this.sphere.castShadow = true;
        this.sphere.update = () => {
            this.sphere.rotation.y += 0.01;
            this.step+=0.04;
            this.sphere.position.x = 20+( 10*(Math.cos(this.step)));
            this.sphere.position.y = 5 +( 10*Math.abs(Math.sin(this.step)));
            this.sphere.position.z = 2;
            this.sphere.material.color = new THREE.Color(this.app.def.sphere.color);
        }
        this.app.registerUpdate(this.sphere.update.bind(this));
        this.app.scene.add(this.sphere);
    }

    createGui() {
        if(!Sphere.isGui) {
            Sphere.isGui = true;
            var folder = this.gui.addFolder(`Sphere`);
            folder.addColor(this.app.def.sphere, 'color');
        }
    }
}