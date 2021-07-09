// in this file we set up the pieces needed in the computation


import * as THREE from "./lib/three.module.js";









let computeUniforms={
    res: {
        value: new THREE.Vector2(window.innerWidth,window.innerHeight)
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











let matUniforms={
    res: {
        value: new THREE.Vector2(window.innerWidth,window.innerHeight)
    },
    tex: {
        value: null
    },
};



const matFragPaths = {
    uniforms:  './material/common/uniforms.glsl',
    main: './material/fragment/probability.glsl',
};


const matVertPaths = {
    uniforms:  './material/common/uniforms.glsl',
    position: './material/vertex/position.glsl',
    normal: './material/vertex/normal.glsl',
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



export {
    materialShaders,
    computeShaders,
}