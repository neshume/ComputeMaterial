
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



const realPartPaths = {
    uniforms:  './compute/shader/uniforms.glsl',
    common: './compute/shader/common.glsl',
    laplacian: './compute/shader/laplacian.glsl',
    potentialEnergy: './compute/shader/potentialEnergy.glsl',
    realPart: './compute/shader/realPart.glsl',
};
//
// const imgPartPaths = {
//     uniforms:  './compute/shader/uniforms.glsl',
//     common: './compute/shader/common.glsl',
//     laplacian: './compute/shader/laplacian.glsl',
//     potentialEnergy: './compute/shader/potentialEnergy.glsl',
//     imgPart: './compute/shader/imgPart.glsl',
// };

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
    realPart:realPartPaths,
   // imgPart:imgPartPaths,
    iniCond:initialConditionPaths,
};









//=============================================
//Doing the Exports
//=============================================
export {
    computeShaderData,
}