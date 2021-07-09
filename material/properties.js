import * as THREE from "../lib/three.module.js";

import{TYPES} from "../csm/three-csm.module.js";

let computationWidth=1024;
let computationHeight=512;


import{ui} from "../ui.js";

let properties={
    type: TYPES.PHYSICAL,
    clearcoat:1.,
    roughness:1.,
    metalness:0.,
    side:THREE.DoubleSide,
    transparent:true,
    transmission:ui.transmission,
}






var texture = new THREE.TextureLoader().load('./textures/tex.png');

function updateComputeTexture(rendTarget){
    vertexUniforms.tex.value=rendTarget.texture;
    fragmentUniforms.tex.value=rendTarget.texture;
}

let vertexUniforms={
    //three_noise_seed: { value: 2 },
    time: {value: 0},
    res: {value: new THREE.Vector2(computationWidth,computationHeight)},
    rotx: {value: ui.rotx},
    roty: {value: ui.roty},
    rotu  : {value: ui.rotu},
    tumble: {value: ui.tumble},
    amplitude:{value:ui.amplitude},
    n: {value: ui.n},
    proj: {value: ui.proj},
    tex: {value: texture},
};


let fragmentUniforms={
    time: {value: 0},
    res: {value: new THREE.Vector2(computationWidth,computationHeight)},
    grid: {value: ui.grid},
    hue: {value: ui.hue},
    rotx: {value: ui.rotx},
    roty: {value: ui.roty},
    rotu  : {value: ui.rotu},
    tumble: {value: ui.tumble},
    amplitude:{value:ui.amplitude},
    n: {value: ui.n},
    proj: {value: ui.proj},
    tex: {value: texture},
};



//IMPORTANT NOTE:
//these file names need to be relative to the main folder, where they are called in main.js

const vertPaths = {
    defines: './material/vertex/uniforms.glsl',
    header: './material/geometry.glsl',
    main: './material/vertex/main.glsl',
};


const fragPaths={
    uniforms:'./mat1/fragment/uniforms.glsl',
    geometry:'./mat1/geometry.glsl',
    main:'./mat1/fragment/main.glsl'
};








//EXPORT ALL OF THIS BUNDLED UP TOGETHER
let mat1={
    properties:properties,
    vertexUniforms:vertexUniforms,
    fragmentUniforms:fragmentUniforms,
    vertPaths:vertPaths,
    fragPaths:fragPaths,
    maps:undefined,
}








export{mat1,
updateComputeTexture}