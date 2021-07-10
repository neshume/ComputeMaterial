//=============================================
//MAIN FILE
//this file sets everything up, and runs the animation loop
//=============================================




//=============================================
//Imports from lib/
//=============================================

import * as THREE from "./lib/three.module.js";

import Stats from './lib/stats.module.js';

import{OrbitControls} from "./lib/OrbitControls.js";


//=============================================
//Imports from My Code
//=============================================


import{
    simulationData
} from "./setup/simulationData.js";

import{
    buildAllShaders
} from "./setup/loadShaders.js";

import {
    createComputeEnvironment,
    renderToScreen,doComputation
} from "./classes/computeEnvironment.js";

import{
   buildMainScene,
    camera
} from "./scene.js";

import{
    updateUIUniforms
} from "./setup/updateShaders.js";

import{
    ui,
    createUI
} from './ui.js';
import {CustomShaderMaterial, TYPES} from "./classes/three-csm.module.js";

//=============================================
//Global Variables Defined in this MAIN
//=============================================

let realPart,imgPart,iniCond;
let displayScene;
let renderer,stats;
let scene;
let controls;
let customMat;
let customGeom;
let standardMat;



//=============================================
//Functions used in Main Rendering Loop
//=============================================


function updateComputeTexture(tex){
    realPart.material.uniforms.tex.value=tex;
    imgPart.material.uniforms.tex.value=tex;
    displayScene.material.uniforms.tex.value=tex;
    customMat.uniforms.tex.value=tex;
}


function computeNextTimeStep(numIterates){
    //do the computation numIterates of time steps
    for(let i=0;i<numIterates;i++) {

        doComputation(realPart, renderer);
        updateComputeTexture(realPart.tex);

        doComputation(imgPart, renderer);
        updateComputeTexture(imgPart.tex);
    }
}



//show the result of the computation
function displayResultToScreen(is3D){
    if(is3D===true){
        //do another computation to get material texture
        doComputation(displayScene,renderer);

        //update the material's texture map with this:
        customMat.map=displayScene.tex;
        //standardMat.map=displayScene.tex;

        //now render this to the display
        renderer.setRenderTarget(null);
        renderer.render(scene,camera);
    }
    else{
        //render material texture directly to the screen
        renderToScreen(displayScene,renderer);
    }
}



function animate(){

    stats.begin();

    requestAnimationFrame(animate);

    //do the computation evolving the wave function
    computeNextTimeStep(ui.simulationSpeed);

    //now that the computation is done: decide how to draw it
    displayResultToScreen(ui.is3D);


    //update compute uniforms
    realPart.material.uniforms.frameNumber.value+=1.;
    imgPart.material.uniforms.frameNumber.value+=1.;

    //update material uniforms
    updateUIUniforms(displayScene.material);
    updateUIUniforms(customMat);

    stats.end();
}




//=============================================
//Actually Running Things
//=============================================


buildAllShaders().then((code)=>{

   const canvas =document.querySelector('#c');

    var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
     stats = new Stats();
    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);


    createUI();

    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        depth: false,
        stencil: false
    });
    //renderer.outputEncoding = THREE.LinearEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);


    controls = new OrbitControls(camera, renderer.domElement);



    //make compute environments for the computation
    realPart=createComputeEnvironment(
        simulationData.computeRes,simulationData.dataType,code.computeRealPart,code.computeUniforms
    );

    imgPart=createComputeEnvironment(
        simulationData.computeRes,simulationData.dataType,code.computeImgPart,code.computeUniforms
    );

    iniCond=createComputeEnvironment(
        simulationData.computeRes,simulationData.dataType,code.computeIniCond,code.computeUniforms
    );

    //make this one display resolution
    displayScene=createComputeEnvironment(
        simulationData.displayRes,simulationData.dataType,code.matFragment,code.matUniforms
    );

    //build the custom material
    customMat = new CustomShaderMaterial({
        baseMaterial: TYPES.PHYSICAL,
        vShader: code.matVertex,
        uniforms: code.matUniforms,
        passthrough: {
            wireframe: false,
            metalness: 0,
            roughness: 0.2,
        },
    });
    //for some reason the constructor is not completing the uniforms correctly.
    //hard to know if its doing the material correctly either?!
    customMat.uniforms=code.matUniforms;




    //make the main scene using this material:
    scene=buildMainScene(customMat);


    //run the initial condition shader first
    doComputation(iniCond,renderer);
    updateComputeTexture(iniCond.tex);


    //now with the initial condition set, run the animation loop
    animate();
});