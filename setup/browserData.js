//This file sets things depending on the browser you are running
//exports an object containing all the set properties

import * as THREE from "../lib/three.module.js";


/**
 * A check if the program is currently run on Safari, copied from THREEJS gpgpu water example
 * This program won't run on safari on the computer anywway: really only care about IOS
 * @returns {boolean}
 */
function isIOS() {
    return !! navigator.userAgent.match( /Safari/i ) && ! navigator.userAgent.match( /Chrome/i );
}


/**
 * Sets the actual resolution we will run the computation at,
 * as a function of the desired resolution, and whatever data we want
 * @param res
 */
function setComputeRes(res){

    if(isIOS()){
        //return a smaller resolution as we are using half float textures
        let ratio=256/res[0];
        let newResX=Math.floor(ratio*res[0]);
        let newResY=Math.floor(ratio*res[1]);
        return [newResX,newResY];
    }

    //otherwise, return the desired resolution
    return res;
}


function setDataType(){
    let dataType=THREE.FloatType;
    if(isIOS()){
        dataType=THREE.HalfFloatType;
    }
    return dataType;
}


let browserData={
    displayRes:[window.innerWidth,window.innerHeight],
    computeRes:setComputeRes([1024,512]),
    dataType: setDataType(),
};

export{isIOS, browserData}