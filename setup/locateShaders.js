
//=============================================
//Imports from lib/
//=============================================

import * as THREE from "../lib/three.module.js";

//=============================================
//Imports from My Code
//=============================================

import {browserData} from "./browserData.js";

import{ui} from "../ui.js";

//=============================================
//Internal Things Related to Compute Shaders
//=============================================

let computeUniforms={
    res: {
        value: new THREE.Vector2(browserData.computeRes[0],browserData.computeRes[1])
    },
    frameNumber: {
        value: 0
    },
    tex: {
        value: null
    },
};



const realPartPaths = {
    uniforms:  './compute/uniforms.glsl',
    common: './compute/common.glsl',
    main: './compute/realPart.glsl',
};

const imgPartPaths = {
    uniforms:  './compute/uniforms.glsl',
    common: './compute/common.glsl',
    main: './compute/imgPart.glsl',
};

const initialConditionPaths = {
    uniforms:  './compute/uniforms.glsl',
    common: './compute/common.glsl',
    main: './compute/initialCondition.glsl',
};





//=============================================
//Internal Things Related to Material Shaders
//=============================================

let matUniforms={
    res: {
        value: new THREE.Vector2(browserData.displayRes[0],browserData.displayRes[1])
    },
    showPhase: {
        value: ui.showPhase
    },
    tex: {
        value: null
    },
};



const matFragPaths = {
    uniforms:  './material/common/uniforms.glsl',
    aux: './material/fragment/aux.glsl',
    main: './material/fragment/main.glsl',
};


const matVertPaths = {
    uniforms:  './material/common/uniforms.glsl',
    position: './material/vertex/position.glsl',
    normal: './material/vertex/normal.glsl',
};









//=============================================
//Things to Export
//=============================================

const computeShaders={
    realPart:{
        paths:realPartPaths,
        uniforms:computeUniforms,

    },
    imgPart: {
        paths:imgPartPaths,
        uniforms:computeUniforms
    },
    iniCond:{
        paths:initialConditionPaths,
        uniforms:computeUniforms,
    },
};





const materialShaders={
    frag:{
        paths:matFragPaths,
        uniforms:matUniforms,
    },
    vert:{
        paths:matVertPaths,
        uniforms:matUniforms,
    }
}






//=============================================
//Doing the Exports
//=============================================
export {
    materialShaders,
    computeShaders,
}