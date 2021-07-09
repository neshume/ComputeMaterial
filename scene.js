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

//NONE HERE






//=============================================
//Internal Variables Defined in this File
//=============================================

//NONE HERE











//=============================================
//Things to Export
//=============================================

let scene=new THREE.Scene();








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
    scene,
    camera,
};