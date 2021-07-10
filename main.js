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

import {Sky} from "./lib/objects/Sky.js"

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
let sun;
let pmremGenerator;

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




function createEnvScene() {

    var envScene = new THREE.Scene();

    var geometry = new THREE.BoxBufferGeometry();
    geometry.deleteAttribute('uv');
    var roomMaterial = new THREE.MeshStandardMaterial({
        metalness: 0,
        side: THREE.BackSide
    });
    var room = new THREE.Mesh(geometry, roomMaterial);
    room.scale.setScalar(10);
    envScene.add(room);

    var mainLight = new THREE.PointLight(0xffffff, 30, 0, 2);
    envScene.add(mainLight);

    var lightMaterial = new THREE.MeshLambertMaterial({
        color: 0x000000,
        emissive: 0xffffff,
        emissiveIntensity: 20
    });

    var light1 = new THREE.Mesh(geometry, lightMaterial);
    light1.material.color.setHex(0xF52A5E);
    light1.position.set(-5, 2, 0);
    light1.scale.set(0.1, 1, 1);
    envScene.add(light1);

    var light2 = new THREE.Mesh(geometry, lightMaterial.clone());
    light2.material.color.setHex(0xF5E836);
    light2.position.set(5, 3, 0);
    light2.scale.set(1, 0.1, 1);
    envScene.add(light2);

    var light3 = new THREE.Mesh(geometry, lightMaterial.clone());
    light3.material.color.setHex(0x35C4F5);
    light3.position.set(2, 1, 5);
    light3.scale.set(1, 1, 0.1);
    envScene.add(light3);





    //===== now have generated the scene:
    //build the cube map fom this:

    var generatedCubeRenderTarget = pmremGenerator.fromScene(envScene, 0.04);


    scene.background = generatedCubeRenderTarget.texture;

    return generatedCubeRenderTarget.texture;

}



function skyBoxTex(){
    let bkgScene=new THREE.Scene();
    //add the sky and stuff to this scene
    sun = new THREE.Vector3();
    const sky = new Sky();
    sky.scale.setScalar( 4500000 );
    bkgScene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    //function updateSun() {

        const phi = THREE.MathUtils.degToRad( 85 );
        const theta = THREE.MathUtils.degToRad(50 );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        //water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        return pmremGenerator.fromScene( sky ).texture;

   // }

   // updateSun();

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    //make the pmrem generator if we need it
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();


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
        simulationData.computeRes,simulationData.dataType,code.matFragment,code.matUniforms
    );




    //build the custom material
    customMat = new CustomShaderMaterial({
        baseMaterial: TYPES.PHYSICAL,
        vShader: code.matVertex,
        uniforms: code.matUniforms,
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
    customMat.uniforms=code.matUniforms;
    customMat.flatShading=false;



    //make the main scene using this material:
    scene=buildMainScene(customMat);

    const skyBox=skyBoxTex();
    scene.background=skyBox;
    scene.environment=skyBox;
    customMat.envMap=skyBox;



    //run the initial condition shader first
    doComputation(iniCond,renderer);
    updateComputeTexture(iniCond.tex);


    //now with the initial condition set, run the animation loop
    animate();
});

