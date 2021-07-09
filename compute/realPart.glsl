//---------------------------------------------------------------------
//Compute 2: REAL COMPONENT
//this computes the real part of the wave function
//input: TEXTURE containing R(T-dt), I(T-0.5dt)
//output: TEXTURE containing R(T), I(T-0.5dt)
//-----------------------------------------------------------------------


float newReal(ivec2 ij){

    float re = Real(ij);
    float img = Imaginary(ij);

    //get potential energy
    float V=PotentialE(ij);

    //get laplacian:
    float[9] samples=I_Field(ij);
    float[9] stencil=chooseStencil(ij);
    float LapI=constructLaplacian(stencil,samples);

    //return the updated real part
    return re  +  dt * V * img  -  0.5 * dt * LapI;
}





void compute( out vec4 fragColor, in ivec2 ij)
{
    //set the time steps for the simulation;
    setTimeSteps();

//    if(frameNumber<4.){
//        fragColor = vec4(initialCondition(ij),0,0);
//        return;
//    }

    if(onEdge(ij)){
        fragColor=vec4(0.,0,0,0);
        return;
    }

    float obs=0.;
    if(inObstacle(ij)){
        obs=1.;
    }


    //else: we leave the imaginary part untouched, and update the real part;
    float re = Real(ij);
    float img = Imaginary(ij);

    float updatedReal = newReal(ij);

    float mag2 = re*updatedReal+img*img;

    //return real, imaginary, probability
    fragColor=vec4(updatedReal,img,mag2,obs);
}

//--calling the main function of the shader
void main() {
    compute(gl_FragColor, ivec2(gl_FragCoord.xy));
}

