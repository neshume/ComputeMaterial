//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
    6.0)-3.0)-1.0,
    0.0,
    1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}





float pal(vec3 x, vec3 c, vec3 d){
return abs(c*x+d);
}

//can use the geometry.glsl file here if we want
//can use geometry in here if we would like to!
//its included first
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    //    //rescale so in the unit square
    //    vec2 sq=fragCoord/res;
    //    //look up the texture coordinate at that point:
    //    vec2 wave=texture(tex,sq).xy;
    //    float prob=texture(tex,sq).z;
    //    float obs=texture(tex,sq).w;


    //look up the texture coordinate at that point:
    //THIS RELIES ON THE FACT THAT OUR SHADER TEXTURE AND COMPUTE TEXTURE IS THE SAME SIZE
    ivec2 ij = ivec2(fragCoord);
    vec2 wave=texelFetch(tex,ij,0).xy;
    float prob=texelFetch(tex,ij,0).z;
    float obs=texelFetch(tex,ij,0).w;


    float phase=atan(wave.y,wave.x)/(6.29);

    if(obs!=0.){
        fragColor=vec4(0,0,0,1);
        return;
    }

    // vec3 col=hsb2rgb(vec3(phase,0.5,prob));
    //
    float q = sign(prob) * pow(abs(prob),0.8) * 3.0;
    //make second vector vec3(0.,-0.1,0.15) for purple/green
    vec3 col = pal(q, vec3(-1.0,1.0,1.0), vec3(0.2,-0.1,0.15));

    fragColor=vec4(col,1.);

}












void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}
