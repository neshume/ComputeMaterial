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
 import{simulationData} from "./setup/simulationData.js";
import{setInitialCondition} from "./main.js";

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
    is3D:true,
    simulationSpeed:simulationData.simSpeed,
    showPhase:false,
    potentialType:5,
    momentum:0.5,
};





function createUI() {

    let mainMenu = new GUI();

    mainMenu.width = 300;
    mainMenu.domElement.style.userSelect = 'none';

    mainMenu.add(ui, 'AboutThis').name("Help/About");
    let mom= mainMenu.add(ui,'momentum',0,1,0.01);
    mainMenu.add(ui,'simulationSpeed',1,10,1);
    mainMenu.add(ui,'showPhase');
    let pot = mainMenu.add(ui,'potentialType', {
            'ParticleBox':1,
            'DoubleSlit':2,
            'PotentialBarrier':3,
            'EllipticalBilliards':4,
            'Scattering': 5
        }
        ).name('Style');

    pot.onChange(setInitialCondition);
    // mainMenu.add(ui,'is3D',{'3D':true,"2D":false}).name('Style');

    mom.onChange(setInitialCondition);


    mainMenu.close();
}






//=============================================
//Exports from this file
//=============================================


export {
    ui,
    createUI
};
