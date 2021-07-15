//=============================================
//MAIN FILE
//this file sets everything up, and runs the animation loop
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

import{
    buildComputeShaders,
    buildComputeEnvironment,
    setInitialCondition,
    computeNextTimeStep,
    updateComputeUniforms
} from "./compute/setupComputation.js";

import{
    buildDisplayShaders
} from "./material/setupMaterial.js";

import {
    createDisplayInstance,
    renderToScreen,doComputation
} from "./classes/computeInstance.js";

import{
   buildMainScene,
    updateSceneBackground,
    camera
} from "./scene.js";

import{
    updateUIUniforms
} from "./setup/updateShaders.js";

import{
    ui,
    createUI,
    updateSun,
    updateComplete
} from './ui.js';

import {CustomShaderMaterial, TYPES} from "./classes/three-csm.module.js";

import{buildBackground,getBackgroundTex} from "./backgroundScene.js";

import {
    createRenderer,
    createStats,
    createControls,
    createPmremGenerator,
    locateCanvas
} from "./components.js";

//=============================================
//Global Variables Defined in this MAIN
//=============================================

let displayScene;
let renderer,stats;
let scene;
let controls;
let customMat;
let pmremGenerator;
let compute;
let canvas;
let skyScene;
let skyTex;

//=============================================
//Functions used in Main Rendering Loop
//=============================================


//reset the scene:
//uses global variables compute and renderer instead of passing them as arguments
//because I don't know how to do this correctly:
//I want to use this in ui.js when onChange is called
function reset(){
    setInitialCondition(compute,renderer);
}



//MOVE THIS TO ANOTHER FILE LATER!
function createDisplayEnvironment(display){
    displayScene=createDisplayInstance(
        simulationData.computeRes,simulationData.dataType,display.matFragment,display.matUniforms
    );

    //build the custom material
    customMat = new CustomShaderMaterial({
        baseMaterial: TYPES.PHYSICAL,
        vShader: display.matVertex,
        uniforms: display.matUniforms,
        passthrough: {
            side:THREE.DoubleSide,
            envMapIntensity:5.,
            wireframe: false,
            metalness: 0,
            roughness: 0.2,
        },
    });
    //for some reason the constructor is not completing the uniforms correctly.
    //hard to know if its doing the material correctly either?!
    customMat.uniforms=display.matUniforms;
}



let display3D = function(){
    //do another computation to get material texture
    doComputation(displayScene,renderer);

    //update the material's texture map with this:
    customMat.map=displayScene.tex;

    //update the sky if necessary
    if(updateSun){
        skyTex=getBackgroundTex(skyScene,pmremGenerator);
        updateSceneBackground(scene,skyTex);
        updateComplete();
    }

    //now render this to the display
    renderer.setRenderTarget(null);
    renderer.render(scene,camera);
}


let display2D = function(){
    renderToScreen(displayScene,renderer);
}







//=============================================
//The Animation Loop
//=============================================



function animate(){

    stats.begin();

    requestAnimationFrame(animate);

    //do the computation evolving the wave function
    computeNextTimeStep(compute, renderer, ui.simulationSpeed);

    //set the display texture from this:
    displayScene.material.uniforms.tex.value=compute.tex;
    customMat.uniforms.tex.value=compute.tex;

    //now that the computation is done: decide how to draw it
    if(ui.is3D){
        display3D();
    }
    else{
        display2D();
    }

    //update the compute uniforms
    updateComputeUniforms(compute);

    //update material uniforms
    updateUIUniforms(displayScene.material);
    updateUIUniforms(customMat);


    stats.end();
}





//=============================================
//Actually Running Things
//=============================================


buildComputeShaders().then((code)=>{
    buildDisplayShaders().then((display)=>{

        //set up the canvas
        canvas = locateCanvas();

        //create all the components
        createUI();
        stats = createStats();
        renderer=createRenderer(canvas);
        pmremGenerator=createPmremGenerator(renderer);
        controls = createControls(camera,renderer);

        //set up the computation environment
        compute=buildComputeEnvironment(code);

        //set up the display environment
        createDisplayEnvironment(display);


        //build the main scene using this material:
        skyScene=buildBackground();
        skyTex = getBackgroundTex(skyScene,pmremGenerator);
        scene=buildMainScene(customMat);
        updateSceneBackground(scene,skyTex);

        //run the initial condition shader first
        setInitialCondition(compute,renderer);

        //now with the initial condition set, run the animation loop
        animate();
})
});




export{reset};