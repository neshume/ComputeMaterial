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
import{materialShaders} from "./setup/locateShaders.js";
import {CustomShaderMaterial,TYPES} from "./classes/three-csm.module.js";
//=============================================
//Internal Variables Defined in this File
//=============================================

//NONE HERE











//=============================================
//Things to Export
//=============================================

function buildMainScene(vertexShader, uniformList){

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneBufferGeometry(30,30);

    const material = new CustomShaderMaterial({
        baseMaterial:TYPES.PHYSICAL,

        //load the vertex shaders of the material
        vShader: {
            defines: vertexShader.defines,
            header: vertexShader.header,
            main: vertexShader.main,
        },

        //add in the uniforms of the material
        uniforms: uniformList,

        //other
        passthrough: {
            wireframe: false,
        },
    });

    let mesh = new THREE.Mesh(geometry, material);
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