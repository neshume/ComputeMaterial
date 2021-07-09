//=============================================
//Imports from lib/
//=============================================

import * as THREE from "../lib/three.module.js";

//=============================================
//Imports from My Code
//=============================================

//NONE HERE




//=============================================
//Internal Things Defined in this File
//=============================================


function createComputeScene(shaderCode, shaderUniforms){
    //given a shader, build a scene for computing its output
    //a single full screen quad with shader material

    let scene = new THREE.Scene();
    let geometry = new THREE.PlaneBufferGeometry(2,2);

    let material = new THREE.ShaderMaterial({
        fragmentShader: shaderCode,
        uniforms: shaderUniforms,
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.name='plane';
    scene.add(mesh);

    return scene;
}



function swapRTs(RT){
    //annoying step that is required in using framebuffers for computation
    //after writing, need to swap before you can read

    let temp=RT[0];
    RT[0]=RT[1];
    RT[1]=temp;
}







//=============================================
//Things to Export
//=============================================


function createComputeEnvironment(res, dataType, shaderCode, shaderUniforms){
    //return an object containing all the info required to run a compute scene
    //the scene itself, the camera, two render targets

    let scene=createComputeScene(shaderCode,shaderUniforms);

    //make the render targets
    let rt0=new THREE.WebGLRenderTarget(res[0],res[1],{
                type: dataType,
                format: THREE.RGBAFormat,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                depthBuffer: false
                });

    let rt1=new THREE.WebGLRenderTarget(res[0],res[1], {
            type: dataType,
            format: THREE.RGBAFormat,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: false
        });


    //return the computation environment
    let compEnv = {
        camera:new THREE.OrthographicCamera(
            -1, 1, 1, -1, -1, 1,),
        scene:scene,
        RT:[rt0,rt1],
        material: scene.getObjectByName( "plane" ).material,
        tex:null,
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






function doComputation(compEnv,renderer){
    //run the shader in compEnv, and store the result to compEnv.tex;

    //generate the texture
    renderer.setRenderTarget(compEnv.RT[0]);
    renderer.render(compEnv.scene,compEnv.camera);

    //read out the texture that was just generated
    swapRTs(compEnv.RT);
    compEnv.tex=compEnv.RT[1].texture;

}


function renderToScreen(compEnv,renderer){
    //render a computation environment to the screen

    renderer.setRenderTarget(null);
    renderer.render(compEnv.scene,compEnv.camera);
}







//=============================================
//Doing the Exports
//=============================================


export{
    renderToScreen,
    createComputeEnvironment,
    updateUniforms,
    doComputation};