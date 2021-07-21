

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

//
//
//vec2 gaussianPacket(vec2 uv, vec2 p, vec2 cent, float a, float t){
//    float sigma=1./a;
//    float sigma2=sigma*sigma;
//    vec2 x=uv-cent;
//    vec2 cplx=vec2(1,t/(2.*sigma2));
//
//    vec2 coef=sqrt(2.*PI*sigma2)*cplx;
//    coef=inv(coef);
//    coef=sqrtC(coef);
//
//    vec2 pos=x-p*t;
//    vec2 exp1Arg = inv(cplx);
//    exp1Arg *= -dot(pos,pos)/(4.*sigma2);
//    vec2 exp1=expC(exp1Arg);
//
//    vec2 exp2Arg=vec2(0,dot(p,x));
//    vec2 exp2=expC(exp2Arg);
//
//    vec2 exp3Arg=vec2(0,-dot(p,p)*t/2.);
//    vec2 exp3=expC(exp3Arg);
//
//    vec2 wave;
//    wave=mult(exp1,exp2);
//    wave=mult(wave,exp3);
//    wave=mult(coef,wave);
//    return wave;
//}

////an APPROXIMATION to the time evolution for very short time interval
vec2 gaussianPacket(vec2 uv, vec2 p, vec2 cent, float a, float t){

    //sigma should also be complex and changing in time: but it is real/constant to order 2 at t=0.
    float sigma=1./a;
    float sigma2=sigma*sigma;

//    vec2 cplx=vec2(1,t/(2.*sigma2));
//    vec2 coef=sqrt(2.*PI*sigma2)*cplx;
//    coef=inv(coef);
//    coef=sqrtC(coef);
//
//

    float coef=1./sqrt(sigma);

    //the rest of this is correct
    vec2 x = uv-cent-p*t;
    float mag = exp(-dot(x,x)/(4.*sigma2));
    float arg= dot(x,p)-dot(p,p)*t/2.;

    vec2 phase=vec2(cos(arg),sin(arg));
    return 0.5*coef*mag*phase;
}


//this initial condition gives R(0) as first entry
//and I(0.5dt) as the second entry
vec2 initialCondition(ivec2 ij){

    vec2 uv=toUV(ij);
    float scale=10.;

    vec2 p = 20.*momentum*scale*vec2(1,0);
    vec2 cent=vec2(-0.4,0);
    float a = 10.*(spread+0.1)*scale;

    //compute real and imaginary parts at different time steps
    //seems unnecessary from looking at results,but is "correct"
    vec2 psi0=gaussianPacket(uv,p,cent,a,0.);
    vec2 psi1=gaussianPacket(uv,p,cent,a,dt);
    return vec2(psi0.x,psi1.y);

    //vec2 psi1=wavePacket(uv,30.,vec2(-0.3,0),20.*momentum*vec2(1,0));
    //return psi1;
}
















void compute( out vec4 fragColor, in ivec2 ij)
{
        fragColor = vec4(initialCondition(ij),0,0);
}

//--calling the main function of the shader
void main() {
    compute(gl_FragColor, ivec2(gl_FragCoord.xy));
}

