import * as THREE from "./lib/three.module.js";




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





function createComputeMaterial(shaderCode,shaderUniforms){

    let material = new THREE.ShaderMaterial({
        fragmentShader: shaderCode,
        uniforms: shaderUniforms,
    });

    return material;
}



//return an object containing all the info required to run a compute scene
//the scene itself, the camera, two render targets
function createComputeEnvironment(res, shaderCode, shaderUniforms){

    //make the scene
    let scene = new THREE.Scene();
    let geometry = new THREE.PlaneBufferGeometry(2,2);
    let material = createComputeMaterial(shaderCode, shaderUniforms);
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    //make the render targets
    let rt0=new THREE.WebGLRenderTarget(res[0],res[1],
        {type: THREE.FloatType,
                format: THREE.RGBAFormat});

    let rt1=new THREE.WebGLRenderTarget(res[0],res[1],
        {type: THREE.FloatType,
            format: THREE.RGBAFormat});


    //return the computation environment
    let compEnv = {
        camera:new THREE.OrthographicCamera(),
        scene:scene,
        RT:[rt0,rt1],
        material: material,
    };

    return compEnv;
}




function updateUniforms(compEnv){

    //update the frame number uniform
    compEnv.material.uniforms.frameNumber.value += 1.;

    //update the ui properties
    for (const key in compEnv.material.uniforms) {
        if(ui[`${key}`]!=undefined) {//if the thing exists in the UI
            compEnv.material.uniforms[`${key}`].value = ui[`${key}`];
        }
    }

    //update the texture:
    compEnv.material.uniforms.tex=compEnv.RT[1].texture;
}




function swapRTs(RT){
    let temp=RT[0];

    RT[0]=RT[1];
    RT[1]=temp;
}

function doComputation(compEnv,renderer){

    renderer.setRenderTarget(compEnv.RT[0]);
    renderer.render(compEnv.scene,compEnv.camera);

    swapRTs(compEnv.RT);

    return compEnv.RT[1].texture;

}






export{
    assembleShaderCode,
    createComputeEnvironment,
    updateUniforms,
    doComputation};