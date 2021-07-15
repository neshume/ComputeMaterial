//=============================================
//COMPONENTS
//this file sets up basic things like a renderer, controls, stats etc
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





//=============================================
//Functions to Export
//=============================================



function createStats(){
    var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
    let stats = new Stats();
    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
}





function createRenderer(canvas){
    let renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        depth: false,
        stencil: false
    });
    //renderer.outputEncoding = THREE.LinearEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    return renderer;
}


function createPmremGenerator(renderer){
    //make the pmrem generator if we need it
    let  pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();
    return pmremGenerator;
}


function createControls(camera,renderer){
    let  controls = new OrbitControls(camera, renderer.domElement);
    return controls;
}

function locateCanvas(){
    return document.querySelector('#c');
}


//=============================================
//Actually doing the Exporting
//=============================================

export{createStats,createRenderer,createPmremGenerator,createControls,locateCanvas};
