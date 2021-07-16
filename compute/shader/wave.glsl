//---------------------------------------------------------------------
//Compute 2: REAL COMPONENT
//this computes the real part of the wave function
//input: TEXTURE containing R(T-dt), I(T-0.5dt)
//output: TEXTURE containing R(T), I(T-0.5dt)
//-----------------------------------------------------------------------


float newReal(ivec2 ij){

    float cur = Current(ij);
    float prev = Previous(ij);

    //get potential energy
    float n=ior(ij);

    //get laplacian:
    float[9] samples=current_Field(ij);
    float[9] stencil=chooseStencil(ij);
    float Lap=constructLaplacian(stencil,samples);

    //return the updated real part
    return 2.*cur-prev+Lap/n;
}





void compute( out vec4 fragColor, in ivec2 ij)
{
    //set the time steps for the simulation;
    setTimeSteps();

    if(onEdge(ij)){
        fragColor=vec4(0.,0,0,0);
        return;
    }

    if(atSource(ij)){
        fragColor=vec4(source(ij,frameNumber/10.),source(ij,frameNumber/10.),0,1.);
        return;
    }

    float obs=0.;
    if(inObstacle(ij)){
       obs=1.;
    }


    //else: we leave the imaginary part untouched, and update the real part;
    float cur = Current(ij);
    float prev = Previous(ij);

    float updatedReal = newReal(ij);

    //return real, imaginary, probability
    fragColor=vec4(updatedReal,cur, 0,obs);
}

//--calling the main function of the shader
void main() {
    compute(gl_FragColor, ivec2(gl_FragCoord.xy));
}

