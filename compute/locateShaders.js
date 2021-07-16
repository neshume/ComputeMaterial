
//=============================================
//Imports from lib/
//=============================================

import * as THREE from "../lib/three.module.js";

//=============================================
//Imports from My Code
//=============================================

import {simulationData} from "../setup/simulationData.js";

import{ui} from "../ui.js";

//=============================================
//Internal Things Related to Compute Shaders
//=============================================

let computeUniforms={
    res: {
        value: new THREE.Vector2(simulationData.computeRes[0],simulationData.computeRes[1])
    },
    frameNumber: {
        value: 0
    },
    tex: {
        value: null
    },
    potentialType:{
        value: ui.potentialType
    },
    momentum:{
        value:ui.momentum
    }
};



const waveEqnPaths = {
    uniforms:  './compute/shader/uniforms.glsl',
    common: './compute/shader/common.glsl',
    laplacian: './compute/shader/laplacian.glsl',
    ior: './compute/shader/ior.glsl',
    source: './compute/shader/source.glsl',
    wave: './compute/shader/wave.glsl',
};


const initialConditionPaths = {
    uniforms:  './compute/shader/uniforms.glsl',
    common: './compute/shader/common.glsl',
    iniCond: './compute/shader/initialCondition.glsl',
};






//=============================================
//Things to Export
//=============================================

const computeShaderData={
    uniforms:computeUniforms,
    waveEqn:waveEqnPaths,
    iniCond:initialConditionPaths,
};









//=============================================
//Doing the Exports
//=============================================
export {
    computeShaderData,
}