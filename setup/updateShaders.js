//=============================================
//Imports from lib/
//=============================================


//=============================================
//Imports from My Code
//=============================================

import{
    ui
} from "../ui.js";


//=============================================
//Internal Variables Defined in this File
//=============================================












//=============================================
//Things to Export
//=============================================


function updateUIUniforms(material){

    //update the time uniform
    //material.uniforms.time.value=time;

    //update the ui properties
    for (const key in material.uniforms) {
        if(ui[`${key}`]!=undefined) {//if the thing exists in the UI
            material.uniforms[`${key}`].value = ui[`${key}`];
        }
    }
}







//=============================================
//Doing the Exports
//=============================================

export{
    updateUIUniforms
};