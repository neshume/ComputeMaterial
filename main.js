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
    browserData
} from "./setup/browserData.js";

import{
    materialShaders,
    computeShaders
} from "./setup/locateShaders.js";

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

//=============================================
//Global Variables Defined in this MAIN
//=============================================

let realPart,imgPart,iniCond;
let displayScene;
let renderer,stats;
let scene;
let controls;






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


    let numIterates=ui.simulationSpeed;
    for(let i=0;i<numIterates;i++) {

        doComputation(realPart, renderer);
        updateComputeTexture(realPart.tex);

        doComputation(imgPart, renderer);
        updateComputeTexture(imgPart.tex);
    }

    //use the result of the computation to render the texture.
   doComputation(displayScene,renderer);

    //update the materials's texture map with this:
    scene.getObjectByName( "plane" ).material.map=displayScene.tex;

    //noww render this to the display
    renderer.setRenderTarget(null);
    renderer.render(scene,camera);

    //update compute uniforms
    realPart.material.uniforms.frameNumber.value+=1.;
    imgPart.material.uniforms.frameNumber.value+=1.;

    //update material uniforms
    updateUIUniforms(displayScene.material);

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
        browserData.computeRes,browserData.dataType,code.realPartShader,computeShaders.realPart.uniforms
    );

    imgPart=createComputeEnvironment(
        browserData.computeRes,browserData.dataType,code.imgPartShader,computeShaders.imgPart.uniforms
    );

    iniCond=createComputeEnvironment(
        browserData.computeRes,browserData.dataType,code.iniCondShader,computeShaders.iniCond.uniforms
    );

    //make this one display resolution
    displayScene=createComputeEnvironment(
        browserData.displayRes,browserData.dataType,code.matFragShader,materialShaders.frag.uniforms
    );


    //build the main scene
    scene=buildMainScene(code.matVertShader,materialShaders.vert.uniforms);

    //run the initial condition shader first
    doComputation(iniCond,renderer);
    updateComputeTexture(iniCond.tex);



    //now with the initial condition set, run the animation loop
    animate();
});