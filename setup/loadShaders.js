//=============================================
//Imports from lib/
//=============================================

import * as THREE from "../lib/three.module.js";

//=============================================
//Imports from My Code
//=============================================

//=============================================
//Internal Things Defined in this File
//=============================================

/**
 * Builds a shader out of a set of input paths
 * @param shaderPaths={shader1:path1, shader2:path2,...}
 * @returns {Promise<string>}, the concatenated code
 */

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










//=============================================
//Things to Export
//=============================================


/**
 * Loads shaders with Shader Chunks for use with [link THREE-CustomShaderMaterial.]{@link https://github.com/FarazzShaikh/THREE-CustomShaderMaterial}
 * If chunks not specified, all chunks will be appended.
 *
 * @async
 * @param {Object} shaders              Paths of shaders.
 * * @param {string} shaders.defines        Path of definitions shader.
 * * @param {string} shaders.header         Path of header shader.
 * * @param {string} shaders.main           Path of main shader.
 * @param {string[]} chunks             Array of chunks to append into the Header Section.
 * @returns {Promise<Object>}                    CSM friendly shader.
 */


async function loadShadersCSM(shaders, chunks) {
    const _fetch = window.fetch;
    let _defines = "", _header = "", _main = "";
    if (shaders.defines)
        _defines = await (await _fetch(shaders.defines)).text();
    if (shaders.header)
        _header = await (await _fetch(shaders.header)).text();
    if (shaders.main)
        _main = await (await _fetch(shaders.main)).text();
    if (!chunks)
        return {
            defines: "precision highp float;\n" + _defines,
            header:  _header,
            main: _main,
        };
    return {
        defines: "precision highp float;\n" + _defines,
        header: chunks.join("\n") + "\n" + _header,
        main: _main,
    };
}














//=============================================
//Doing the Exports
//=============================================

export {assembleShaderCode,loadShadersCSM};