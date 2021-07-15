import {assembleShaderCode, loadShadersCSM} from "../setup/loadShaders.js";
import {materialShaderData} from "./locateMaterialShaders.js";


/**
 * This function builds all the shaders which are used in our program
 * We run this as the very first thing, and wait for it to complete before doing more
 * This is achieved by buildAllShaders().then((code =>{REST OF PROGRAM}); in main.js
 * @returns {Promise<{}>}
 */

async function buildDisplayShaders(){

    let code={};

    //build the shaders for the material
    code.matFragment = await assembleShaderCode(materialShaderData.fragment);
    code.matVertex = await loadShadersCSM(materialShaderData.vertex,null);

    //include the uniforms
    code.matUniforms=materialShaderData.uniforms;

    return code;
}







export{buildDisplayShaders};