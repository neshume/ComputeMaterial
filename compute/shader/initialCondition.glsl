

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

    //a strip
    vec2 uv=toUV(ij);
    float x=uv.x-0.2;
    float y=uv.y;
    float v=1.;
    float dir0= x + 0.2*y;
    float dir2 = x - 0.2*y;
    float wave1 = -10000.*dir0*dir0-100.*dir2*dir2;
    float val1= exp(wave1);
    return vec2(val1,val1);


    //a gaussian
//    vec2 uv=toUV(ij);
//    float len=length(uv);
//    float width=momentum*momentum;
//    float val=3.*exp(-2000.*width*len*len);
//    return vec2(val,val);
}



















void compute( out vec4 fragColor, in ivec2 ij)
{
        fragColor = vec4(initialCondition(ij),0,0);
}

//--calling the main function of the shader
void main() {
    compute(gl_FragColor, ivec2(gl_FragCoord.xy));
}

