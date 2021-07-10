//=============================================
//THREE.JS SCENE
//this file defines the scene we render
//includes background lights, etc
//main object: a custom shader material whose properties are set by the compute shaders
//=============================================



//=============================================
//Imports from lib/
//=============================================

import * as THREE from "./lib/three.module.js";

//=============================================
//Imports from My Code
//=============================================

import{
    simulationData
} from "./setup/simulationData.js";


//=============================================
//Internal Variables Defined in this File
//=============================================

//NONE HERE











//=============================================
//Things to Export
//=============================================


function buildMainScene(customMat){

    let scene = new THREE.Scene();

    // normal light
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1.);
    directionalLight.position.set(10, 10, 10);
    //directionalLight.castShadow = true;
    scene.add(directionalLight);

    const light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    const dlight = new THREE.DirectionalLight(0xffffff);
    dlight.position.set(5, 5, 5);
    scene.add(dlight);


    const resX=simulationData.computeRes[0];
    const resY=simulationData.computeRes[1];
    let geometry = new THREE.PlaneBufferGeometry(1,1,resX,resY);

    let mesh = new THREE.Mesh(geometry, customMat);
    mesh.name='plane';
    scene.add(mesh);

    return scene;
}




let camera=new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 20);






//=============================================
//Doing the Exports
//=============================================

export{
    buildMainScene,camera
};