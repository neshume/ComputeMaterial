

//-------------------------------------------------
//INITIAL CONDITION
//before the third frame, what is happening?
//-------------------------------------------------



//this needs to be updated: its just the wavepacket at TIME ZERO
//NEED HALF DT TIMESTEP
vec2 wavePacket(vec2 uv, float scale, vec2 iniPos,vec2 iniMom){

    vec2 relPos=scale*(uv-iniPos);

    float mag=exp(-dot(relPos,relPos));
    float phase=dot(relPos,iniMom);

    return mag*vec2(cos(phase),sin(phase));
}






//this initial condition gives R(0) as first entry
//and I(0.5dt) as the second entry
vec2 initialCondition(ivec2 ij){

    vec2 uv=toUV(ij);


    //    vec2 psi0=2.*wavePacket(uv,30.,vec2(-0.4,0.1),3.*vec2(1,0));
    //    return psi0;

    vec2 psi1=wavePacket(uv,10.,vec2(-0.3,-0.15),15.*vec2(1,0.3));
    // vec2 psi2=wavePacket(uv,20.,vec2(0.4,0.4),2.*vec2(-1,-0.6));
    // vec2 psi3=wavePacket(uv,30.,vec2(0.0,0),-2.*vec2(1,0.1));

    return psi1;
    //return psi1+psi2+psi3;
}
















void compute( out vec4 fragColor, in ivec2 ij)
{
        fragColor = vec4(initialCondition(ij),0,0);
}

//--calling the main function of the shader
void main() {
    compute(gl_FragColor, ivec2(gl_FragCoord.xy));
}

