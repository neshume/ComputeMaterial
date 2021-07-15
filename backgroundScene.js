import * as THREE from "./lib/three.module.js";
import {Sky} from "./lib/objects/Sky.js";

import{ui} from "./ui.js";

let sun;




function buildBackground(){
    let bkgScene=new THREE.Scene();

    //add the sky and stuff to this scene
    sun = new THREE.Vector3();

    const sky = new Sky();
    sky.scale.setScalar( 4500000 );
    sky.name='sky';
    bkgScene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const phi = THREE.MathUtils.degToRad( ui.sunHeight );
    const theta = THREE.MathUtils.degToRad(200 );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );

    return bkgScene;
}



function updateBackgroundUniforms(scn){
    const phi = THREE.MathUtils.degToRad( ui.sunHeight );
    const theta = THREE.MathUtils.degToRad(200 );
    sun.setFromSphericalCoords( 1, phi, theta );

    const skyUniforms = scn.getObjectByName( "sky" ).material.uniforms;
    skyUniforms[ 'sunPosition' ].value.copy( sun );

}



function getBackgroundTex(scn,pmremGenerator){

    updateBackgroundUniforms(scn);
    const lightMap=pmremGenerator.fromScene( scn ).texture;
    return lightMap;

}




export{buildBackground, getBackgroundTex}