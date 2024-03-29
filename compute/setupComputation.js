



import {computeShaderData} from "./locateShaders.js";
import{assembleShaderCode} from "../setup/loadShaders.js";
import {createComputeInstance, doComputation} from "../classes/computeInstance.js";
import {simulationData} from "../setup/simulationData.js";
import {ui} from "../ui.js";








/**
 * This function builds all the shaders which are used in our program
 * We run this as the very first thing, and wait for it to complete before doing more
 * This is achieved by buildAllShaders().then((code =>{REST OF PROGRAM}); in main.js
 * @returns {Promise<{}>}
 */

async function buildComputeShaders(){

    let code={};

    //build the shaders for computation
    code.computeRealPart = await assembleShaderCode(computeShaderData.realPart);
    code.computeImgPart = await assembleShaderCode(computeShaderData.imgPart);
    code.computeIniCond = await assembleShaderCode(computeShaderData.iniCond);

    //include the uniforms
    code.computeUniforms=computeShaderData.uniforms;

    return code;
}





function buildComputeEnvironment(code){
    //make compute environments for the computation
    const realPart=createComputeInstance(
        simulationData.computeRes,simulationData.dataType,code.computeRealPart,code.computeUniforms
    );

    const imgPart=createComputeInstance(
        simulationData.computeRes,simulationData.dataType,code.computeImgPart,code.computeUniforms
    );


    const iniCond=createComputeInstance(
        simulationData.computeRes,simulationData.dataType,code.computeIniCond,code.computeUniforms
    );


    return {
        tex: undefined,
        realPart:realPart,
        imgPart:imgPart,
        iniCond:iniCond,
    }
}



function updateComputeTexture(compEnv,tex){
    //run over all shaders in compEnv and set texture:
    for (const key in compEnv) {
        //set the texture
        compEnv.tex=tex;

        //update the uniforms of all the shaders
        if(compEnv[`${key}`].material!=undefined){
            compEnv[`${key}`].material.uniforms.tex.value = tex;}
    }
}

function updateComputeUniforms(compEnv){
    //run over all shaders in compEnv and set texture:
    for (const key in compEnv) {
        if(compEnv[`${key}`].material!=undefined) {
            compEnv[`${key}`].material.uniforms.frameNumber.value += 1;
            compEnv[`${key}`].material.uniforms.potentialType.value = ui.potentialType;
        }
    }
}


function setInitialCondition(compEnv,renderer){
    compEnv.iniCond.material.uniforms.momentum.value=ui.momentum;
    compEnv.iniCond.material.uniforms.spread.value=ui.spread;
    //run the initial condition shader first
    doComputation(compEnv.iniCond,renderer);
    updateComputeTexture(compEnv,compEnv.iniCond.tex);
}


function computeNextTimeStep(compEnv,renderer,numIterates){
    //do the computation numIterates of time steps
    for(let i=0;i<numIterates;i++) {

        doComputation(compEnv.realPart, renderer);
        updateComputeTexture(compEnv,compEnv.realPart.tex);

        doComputation(compEnv.imgPart, renderer);
        updateComputeTexture(compEnv,compEnv.imgPart.tex);
    }
}








export{
    buildComputeShaders,
    buildComputeEnvironment,
    setInitialCondition,
    computeNextTimeStep,
    updateComputeUniforms
};