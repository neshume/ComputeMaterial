


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

export {buildAllShaders};