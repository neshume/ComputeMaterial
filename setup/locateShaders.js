
//=============================================
//Imports from lib/
//=============================================

import * as THREE from "../lib/three.module.js";

//=============================================
//Imports from My Code
//=============================================

import {simulationData} from "./simulationData.js";

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
};



const realPartPaths = {
    uniforms:  './compute/uniforms.glsl',
    common: './compute/common.glsl',
    laplacian: './compute/laplacian.glsl',
    potentialEnergy: './compute/potentialEnergy.glsl',
    realPart: './compute/realPart.glsl',
};

const imgPartPaths = {
    uniforms:  './compute/uniforms.glsl',
    common: './compute/common.glsl',
    laplacian: './compute/laplacian.glsl',
    potentialEnergy: './compute/potentialEnergy.glsl',
    imgPart: './compute/imgPart.glsl',
};

const initialConditionPaths = {
    uniforms:  './compute/uniforms.glsl',
    common: './compute/common.glsl',
    iniCond: './compute/initialCondition.glsl',
};





//=============================================
//Internal Things Related to Material Shaders
//=============================================

let matUniforms={
    res: {
        value: new THREE.Vector2(simulationData.computeRes[0],simulationData.computeRes[1])
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
    defines:  './material/common/uniforms.glsl',
    header: './material/vertex/geometry.glsl',
    main: './material/vertex/main.glsl',
};









//=============================================
//Things to Export
//=============================================

const computeShaderData={
    uniforms:computeUniforms,
    realPart:realPartPaths,
    imgPart:imgPartPaths,
    iniCond:initialConditionPaths,
};





const materialShaderData={
    uniforms:matUniforms,
    fragment:matFragPaths,
    vertex:matVertPaths,
}






//=============================================
//Doing the Exports
//=============================================
export {
    materialShaderData,
    computeShaderData,
}