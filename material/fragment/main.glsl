




vec3 heightColor(float wave){
    float q = sign(wave) * pow(abs(wave),0.8) * 3.0;
    vec3 col = pal(q, vec3(-1.0,1.0,1.0), vec3(0.2,-0.1,0.15));
    return col;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //look up the texture coordinate at that point:
    ivec2 ij = ivec2(fragCoord);
    float wave=texelFetch(tex,ij,0).x;
    float obs=texelFetch(tex,ij,0).w;

    if(obs!=0.){
        fragColor=vec4(vec3(0.),1);
        return;
    }

    vec3 col;
    if(showPhase){//phase means height map here
        col=heightColor(0.);
    }
    else{
        col=heightColor(wave/4.);
    }

    fragColor=vec4(col,1);
}


void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
