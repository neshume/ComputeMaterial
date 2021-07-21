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
import{setInitialCondition} from "./compute/setupComputation.js";
import{reset} from "./main.js";
//=============================================
//Internal Variables Defined in this File
//=============================================

//NONE HERE


let updateSun = false;

function requestUpdate(){
    updateSun=true;
}

function updateComplete(){
    updateSun=false;
}


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
    spread:0.5,
    sunHeight:83,
};





function createUI() {

    let mainMenu = new GUI();

    mainMenu.width = 300;
    mainMenu.domElement.style.userSelect = 'none';

    mainMenu.add(ui, 'AboutThis').name("Help/About");
    let mom= mainMenu.add(ui,'momentum',0,1,0.01);
    let spread= mainMenu.add(ui,'spread',0,1,0.01);
    mainMenu.add(ui,'simulationSpeed',1,10,1);

    mainMenu.add(ui,'showPhase').name('Phase');
    mainMenu.add(ui,'is3D').name('3D');

    let pot = mainMenu.add(ui,'potentialType', {
            'ParticleBox':1,
            'DoubleSlit':2,
            'PotentialBarrier':3,
            'EllipticalBilliards':4,
            'Scattering': 5
        }
        ).name('Potential');

    pot.onChange(reset);
    mom.onChange(reset);
    spread.onChange(reset);

    let sunController = mainMenu.add(ui,'sunHeight',75,90,0.1).name('Sun Height');
    sunController.onChange(requestUpdate);

    mainMenu.close();
}






//=============================================
//Exports from this file
//=============================================


export {
    ui,
    createUI,
    updateSun,
    updateComplete,
};
