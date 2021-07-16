bool atSource(ivec2 ij){
    return false;
    vec2 uv=toUV(ij);
    return length(uv)<0.1;
}


float source(ivec2 ij, float time){
    float len=length(toUV(ij));
    return 0.5*sin(time);
}

