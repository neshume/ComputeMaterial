//=============================================
//Imports from lib/
//=============================================

import * as THREE from "./lib/three.module.js";

import Stats from './lib/stats.module.js';


//=============================================
//Imports from My Code
//=============================================


import{browserData} from "./setup/browserData.js";

import{materialShaders,computeShaders} from "./setup/locateShaders.js";

import{buildAllShaders} from "./setup/loadShaders.js";

import {
    createComputeEnvironment,
    renderToScreen,doComputation
} from "./classes/computeEnvironment.js";





//=============================================
//Global Variables Defined in this MAIN
//=============================================

let realPart,imgPart,iniCond;
let displayScene;
let renderer,stats;







//=============================================
//Functions used in Main Rendering Loop
//=============================================


function updateComputeTexture(tex){
    realPart.material.uniforms.tex.value=tex;
    imgPart.material.uniforms.tex.value=tex;
    displayScene.material.uniforms.tex.value=tex;
}


function animate(){

    stats.begin();

    requestAnimationFrame(animate);


    let numIterates=5;
    for(let i=0;i<numIterates;i++) {

        doComputation(realPart, renderer);
        updateComputeTexture(realPart.tex);

        doComputation(imgPart, renderer);
        updateComputeTexture(imgPart.tex);
    }

    renderToScreen(displayScene,renderer);

    realPart.material.uniforms.frameNumber.value+=1.;
    realPart.material.uniforms.frameNumber.value+=1.;

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


    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        depth: false,
        stencil: false
    });
    //renderer.outputEncoding = THREE.LinearEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);

    //make compute environments for the computation
    realPart=createComputeEnvironment(browserData.computeRes,browserData.dataType,code.realPartShader,computeShaders.realPart.uniforms);
    imgPart=createComputeEnvironment(browserData.computeRes,browserData.dataType,code.imgPartShader,computeShaders.imgPart.uniforms);
    iniCond=createComputeEnvironment(browserData.computeRes,browserData.dataType,code.iniCondShader,computeShaders.iniCond.uniforms);

    //make this one display resolution
    displayScene=createComputeEnvironment(browserData.displayRes,browserData.dataType,code.matFragShader,materialShaders.frag.uniforms);


    //run the initial condition shader first
    doComputation(iniCond,renderer);
    updateComputeTexture(iniCond.tex);

    //now with the initial condition set, run the animation loop
    animate();
});

