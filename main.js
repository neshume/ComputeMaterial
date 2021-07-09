import * as THREE from "./lib/three.module.js";
import {createComputeEnvironment, renderToScreen,doComputation} from "./computeEnvironment.js";
import{buildAllShaders} from "./buildShaders.js";


let computeUniforms={
    res: {
        value: new THREE.Vector2(window.innerWidth,window.innerHeight)
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
        value: new THREE.Vector2(window.innerWidth,window.innerHeight)
    },
    tex: {
        value: null
    },
}


let realPart,imgPart,displayScene;
let renderer;

function updateComputeTexture(tex){
    realPart.material.uniforms.tex.value=tex;
    imgPart.material.uniforms.tex.value=tex;
    displayScene.material.uniforms.tex.value=tex;
}


function animate(){

    requestAnimationFrame(animate);

    doComputation(realPart,renderer);
    updateComputeTexture(realPart.tex);

    doComputation(imgPart,renderer);
    updateComputeTexture(imgPart.tex);

    renderToScreen(displayScene,renderer);

    realPart.material.uniforms.frameNumber.value+=1.;
    realPart.material.uniforms.frameNumber.value+=1.;
}


//actually running everything

buildAllShaders().then((code)=>{

   const canvas =document.querySelector('#c');


    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        depth: false,
        stencil: false
    });
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);



    //make a compute environment
    realPart=createComputeEnvironment([window.innerWidth, window.innerHeight],code.realPartShader,computeUniforms);
    imgPart=createComputeEnvironment([window.innerWidth, window.innerHeight],code.imgPartShader,computeUniforms);

   // don't actually need the render targets for the display scene but oh well!
    displayScene=createComputeEnvironment([window.innerWidth, window.innerHeight],code.displayShader,displayUniforms);

    animate();
});
