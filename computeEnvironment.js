import * as THREE from "./lib/three.module.js";






function createComputeScene(shaderCode, shaderUniforms){
    //make the scene
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


//return an object containing all the info required to run a compute scene
//the scene itself, the camera, two render targets
function createComputeEnvironment(res, shaderCode, shaderUniforms){

    let scene=createComputeScene(shaderCode,shaderUniforms);

    //make the render targets
    let rt0=new THREE.WebGLRenderTarget(res[0],res[1],
        {type: THREE.FloatType,
                format: THREE.RGBAFormat});

    let rt1=new THREE.WebGLRenderTarget(res[0],res[1],
        {type: THREE.FloatType,
            format: THREE.RGBAFormat});


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




function swapRTs(RT){
    let temp=RT[0];

    RT[0]=RT[1];
    RT[1]=temp;
}

function doComputation(compEnv,renderer){

    //generate the texture
    renderer.setRenderTarget(compEnv.RT[0]);
    renderer.render(compEnv.scene,compEnv.camera);

    //read out the texture that was just generated
    swapRTs(compEnv.RT);
    compEnv.tex=compEnv.RT[1].texture;

}


function renderToScreen(compEnv,renderer){
    renderer.setRenderTarget(null);
    renderer.render(compEnv.scene,compEnv.camera);
}





export{
    renderToScreen,
    createComputeEnvironment,
    updateUniforms,
    doComputation};