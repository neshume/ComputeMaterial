import * as THREE from "./lib/three.module.js";

import{computeShaders,materialShaders} from "./locateShaders.js";






async function assembleShaderCode(shaderPaths){

    let newShader='';

    let response,text;

    for (const key in shaderPaths) {
        response = await fetch(shaderPaths[`${key}`]);
        text = await response.text();
        newShader = newShader + text;
    }

    return newShader;
}








async function buildAllShaders(){

    // //build the compute shaders
    // for(const key in computeShaders){
    //     code.key = await assembleShaderCode(computeShaders[`${key}`].paths);
    // }
    // return code;

    let code={};

    //build the shaders for computation
    code.realPartShader = await assembleShaderCode(computeShaders.realPart.paths);
    code.imgPartShader = await assembleShaderCode(computeShaders.imgPart.paths);
    code.iniCondShader = await assembleShaderCode(computeShaders.iniCond.paths);

    //build the shaders for the material
    code.displayShader = await assembleShaderCode(materialShaders.frag.paths);

    return code;
}

export {buildAllShaders};