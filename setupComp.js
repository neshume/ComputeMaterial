// in this file we set up the pieces needed in the computation


import * as THREE from "./lib/three.module";









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



let displayUniforms={
    res: {
        value: new THREE.Vector2(window.innerWidth,window.innerHeight)
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

const displayPaths = {
    uniforms:  './displayTexture/uniforms.glsl',
    main: './displayTexture/main.glsl',
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
};




const displayShaders={
    initialCondition:{
        paths:initialConditionPaths,
        uniforms:computeUniforms,
    },
    displayTexture:{
        paths:displayPaths,
        uniforms:displayUniforms,
    }
};





export {
    computeShaders,
    displayShaders,
}