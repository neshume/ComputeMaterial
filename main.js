import * as THREE from "./lib/three.module.js";
import {assembleShaderCode, createComputeEnvironment} from "./computeShader.js";



let computeUniforms={
    res: {
        value: new THREE.Vector2(1024,1024)
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
        value: new THREE.Vector2(1024,1024)
    },
    tex: {
        value: null
    },
}


async function buildAllShaders(){

    const realPartShaderPaths = {
        uniforms:  './compute/uniforms.glsl',
        common: './compute/common.glsl',
        main: './compute/realPart.glsl',
    };

    const imgPartShaderPaths = {
        uniforms:  './compute/uniforms.glsl',
        common: './compute/common.glsl',
        main: './compute/imgPart.glsl',
    };

    const displayShaderPaths = {
        uniforms:  './displayTexture/uniforms.glsl',
        main: './displayTexture/main.glsl',
    };

    const realPartShaderText = await assembleShaderCode(realPartShaderPaths);
    const imgPartShaderText = await assembleShaderCode(imgPartShaderPaths);
    const displayShaderText = await assembleShaderCode(displayShaderPaths);

    return {
        realPartShader:realPartShaderText,
        imgPartShader:imgPartShaderText,
        displayShader:displayShaderText,
    };
}





//actually running everything

buildAllShaders().then((code)=>{

    //make a compute environment
    const realPart=createComputeEnvironment([1024,1024],code.realPartShader,computeUniforms);
    const imgPart=createComputeEnvironment([1024,1024],code.imgPartShader,computeUniforms);






    console.log('success');
});
