
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

    const iniCondShaderPaths = {
        uniforms:  './compute/uniforms.glsl',
        common: './compute/common.glsl',
        main: './compute/initialCondition.glsl',
    };

    const displayShaderPaths = {
        uniforms:  './displayTexture/uniforms.glsl',
        main: './displayTexture/phase.glsl',
    };

    const realPartShaderText = await assembleShaderCode(realPartShaderPaths);
    const imgPartShaderText = await assembleShaderCode(imgPartShaderPaths);
    const iniCondShaderText = await assembleShaderCode(iniCondShaderPaths);
    const displayShaderText = await assembleShaderCode(displayShaderPaths);

    return {
        iniCondShader: iniCondShaderText,
        realPartShader: realPartShaderText,
        imgPartShader: imgPartShaderText,
        displayShader: displayShaderText,
    };
}

export {buildAllShaders};