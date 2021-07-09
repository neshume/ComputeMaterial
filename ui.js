//=============================================
//Imports from lib/
//=============================================

import {
    GUI
} from './lib/dat.gui.module.js';



//=============================================
//Imports from My Code
//=============================================

//NONE HERE






//=============================================
//Internal Variables Defined in this File
//=============================================

//NONE HERE











//=============================================
//Things to Export
//=============================================

let ui = {

    AboutThis: function(){
        window.open('./about/about.html');
    },
    threeDim:false,
    simulationSpeed:5,
    showPhase:false,

};





function createUI() {

    let mainMenu = new GUI();

    mainMenu.width = 300;
    mainMenu.domElement.style.userSelect = 'none';

    mainMenu.add(ui, 'AboutThis').name("Help/About");
    mainMenu.add(ui,'simulationSpeed',1,10,1);
    mainMenu.add(ui,'showPhase');
    mainMenu.add(ui,'threeDim',{'3D':true,"2D":false}).name('Style');

    mainMenu.close();
}






//=============================================
//Exports from this file
//=============================================


export {
    ui,
    createUI
};
