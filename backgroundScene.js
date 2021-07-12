import * as THREE from "./lib/three.module.js";
import {Sky} from "./lib/objects/Sky.js";

let sun;


function skyBoxTex(pmremGenerator){
    let bkgScene=new THREE.Scene();

    //add the sky and stuff to this scene
    sun = new THREE.Vector3();

    const sky = new Sky();
    sky.scale.setScalar( 4500000 );
    bkgScene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const phi = THREE.MathUtils.degToRad( 85 );
    const theta = THREE.MathUtils.degToRad(200 );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );

    const lightMap=pmremGenerator.fromScene( bkgScene ).texture;
    // bkgScene.environment=lightMap;
    return lightMap;

}





export{skyBoxTex,sun}