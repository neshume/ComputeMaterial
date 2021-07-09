



vec3 phaseColor(vec2 wave,float prob){
    float phase=atan(wave.y,wave.x)/(6.29);
    vec3 col=2.*hsb2rgb(vec3(phase,0.5,prob));
    return col;
}


vec3 probColor(vec2 wave, float prob){
    float q = sign(prob) * pow(abs(prob),0.8) * 3.0;
    vec3 col = pal(q, vec3(-1.0,1.0,1.0), vec3(0.2,-0.1,0.15));
    return col;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //look up the texture coordinate at that point:
    //THIS RELIES ON THE FACT THAT OUR SHADER TEXTURE AND COMPUTE TEXTURE IS THE SAME SIZE
    ivec2 ij = ivec2(fragCoord);
    vec2 wave=texelFetch(tex,ij,0).xy;
    float prob=texelFetch(tex,ij,0).z;
    float obs=texelFetch(tex,ij,0).w;

    if(obs!=0.){
        fragColor=vec4(vec3(0.25),1);
        return;
    }

    vec3 col;
    if(showPhase){
        col=phaseColor(wave,prob);
    }
    else{
        col=probColor(wave,prob);
    }

    fragColor=vec4(col,1);
}


void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
