
vec3 pal(float x, vec3 c, vec3 d){
    return abs(c*x+d);
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
        fragColor=vec4(0,0,0,1);
        return;
    }

    float q = sign(prob) * pow(abs(prob),0.8) * 3.0;
    //make second vector vec3(0.,-0.1,0.15) for purple/green
    vec3 col = pal(q, vec3(-1.0,1.0,1.0), vec3(0.2,-0.1,0.15));

    fragColor=vec4(col,1.);

}






void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
