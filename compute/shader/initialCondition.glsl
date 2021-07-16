

//-------------------------------------------------
//INITIAL CONDITION
//before the third frame, what is happening?
//-------------------------------------------------



//this needs to be updated: its just the wavepacket at TIME ZERO
//NEED HALF DT TIMESTEP
//vec2 wavePacket(vec2 uv, float scale, vec2 iniPos,vec2 iniMom){
//
//    vec2 relPos=scale*(uv-iniPos);
//
//    float mag=exp(-dot(relPos,relPos));
//    float phase=dot(relPos,iniMom);
//
//    return mag*vec2(cos(phase),sin(phase));
//}






//this initial condition gives R(0) as first entry
//and I(0.5dt) as the second entry
vec2 initialCondition(ivec2 ij){

    vec2 uv=toUV(ij);
    float len=length(uv);
    //return vec2(0.);
    float val=3.*exp(-100.*len*len);
    return vec2(val,val);
}



















void compute( out vec4 fragColor, in ivec2 ij)
{
        fragColor = vec4(initialCondition(ij),0,0);
}

//--calling the main function of the shader
void main() {
    compute(gl_FragColor, ivec2(gl_FragCoord.xy));
}

