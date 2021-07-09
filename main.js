import * as THREE from "./lib/three.module.js";
import {createComputeEnvironment, renderToScreen,doComputation} from "./computeEnvironment.js";
import{buildAllShaders} from "./buildShaders.js";
import Stats from './lib/stats.module.js';




//set the computing resolution:
let computeRes=[1024,512];





let computeUniforms={
    res: {
        value: new THREE.Vector2(computeRes[0],computeRes[1])
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


let realPart,imgPart,iniCond;
let displayScene;
let renderer,stats;

function updateComputeTexture(tex){
    realPart.material.uniforms.tex.value=tex;
    imgPart.material.uniforms.tex.value=tex;
    displayScene.material.uniforms.tex.value=tex;
}


function animate(){

    stats.begin();

    requestAnimationFrame(animate);

    doComputation(realPart,renderer);
    updateComputeTexture(realPart.tex);

    doComputation(imgPart,renderer);
    updateComputeTexture(imgPart.tex);

    renderToScreen(displayScene,renderer);

    realPart.material.uniforms.frameNumber.value+=1.;
    realPart.material.uniforms.frameNumber.value+=1.;

    stats.end();
}


//actually running everything

buildAllShaders().then((code)=>{

   const canvas =document.querySelector('#c');



    var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
     stats = new Stats();

    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);


    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        depth: false,
        stencil: false
    });
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);



    //make compute environments for the computation
    realPart=createComputeEnvironment(computeRes,code.realPartShader,computeUniforms);
    imgPart=createComputeEnvironment(computeRes,code.imgPartShader,computeUniforms);


    // don't actually need the render targets for the display scene but oh well!
    //but make compute environments for the displays too
    iniCond=createComputeEnvironment(computeRes,code.iniCondShader,computeUniforms)
    displayScene=createComputeEnvironment([window.innerWidth, window.innerHeight],code.displayShader,displayUniforms);



    //run the initial condition shader first
    doComputation(iniCond,renderer);
    updateComputeTexture(iniCond.tex);

    //now with the initial condition set, run the animation loop
    animate();
});
