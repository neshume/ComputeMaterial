

//=============================================
//Imports from lib/
//=============================================

import * as THREE from "../lib/three.module.js";

//=============================================
//Imports from My Code
//=============================================

import {simulationData} from "../setup/simulationData.js";

import{ui} from "../ui.js";






//=============================================
//Internal Things Related to Display Shaders
//=============================================

let matUniforms={
    res: {
        value: new THREE.Vector2(simulationData.computeRes[0],simulationData.computeRes[1])
    },
    showPhase: {
        value: ui.showPhase
    },
    tex: {
        value: null
    },
};



const matFragPaths = {
    uniforms:  './material/common/uniforms.glsl',
    aux: './material/fragment/aux.glsl',
    main: './material/fragment/main.glsl',
};


const matVertPaths = {
    defines:  './material/common/uniforms.glsl',
    header: './material/vertex/geometry.glsl',
    main: './material/vertex/main.glsl',
};









//=============================================
//Things to Export
//=============================================

const materialShaderData={
    uniforms:matUniforms,
    fragment:matFragPaths,
    vertex:matVertPaths,
}





//=============================================
//Doing the Exports
//=============================================
export {
    materialShaderData,
}
