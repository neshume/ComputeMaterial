//=============================================
//Imports from lib/
//=============================================

import {ShaderMaterial} from "../lib/three.module.js";


//=============================================
//Imports from My Code
//=============================================

import {
    CustomShaderMaterial,
    TYPES
} from "./three-csm.module.js";

import{ui} from "../ui.js";




//=============================================
//Internal Variables Defined in this File
//=============================================

//NONE HERE











//=============================================
//Things to Export
//=============================================



function createCSM(vertexShader,uniformList,properties,maps) {

    const material = new CustomShaderMaterial({
        //FIXED CHOICE HERE: Physical Material (for now)
        baseMaterial: properties.type,

        //load the vertex shaders of the material
        vShader: {
            defines: vertexShader.defines,
            header: vertexShader.header,
            main: vertexShader.main,
        },

        //add in the uniforms of the material
        uniforms: uniformList,

        //other
        passthrough: {
            wireframe: false,
        },
    });

    //update the properties of the material
    for (let key in properties) {

        if(`${key}`!='type')//type is only property we dont update like this
       material[`${key}`] =properties[key];

    }

    //update texture and envmap of the material
    for (let key in maps) {
        material[`${key}`] =maps[key];
    }

    return material;
}




function createTexM(shaderCode,uniformList){

    return  new ShaderMaterial({
        fragmentShader: shaderCode,
        uniforms: uniformList,
    });

}





function updateUniforms(material,uniformList,time){

    //update the time uniform
    material.uniforms.time.value=time;

    //update the ui properties
    for (const key in uniformList) {
        if(ui[`${key}`]!=undefined) {//if the thing exists in the UI
            material.uniforms[`${key}`].value = ui[`${key}`];
        }
    }


}


function updateProperties(material,propList){

    //update the ui properties
    for (const key in propList) {
        if(ui[`${key}`]!=undefined) {//if the property exists in the UI
            material[`${key}`] = ui[`${key}`];
        }
    }
}






export{createCSM,createTexM,updateUniforms,updateProperties}