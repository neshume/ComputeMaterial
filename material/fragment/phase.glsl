
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


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //look up the texture coordinate at that point:
    //THIS RELIES ON THE FACT THAT OUR SHADER TEXTURE AND COMPUTE TEXTURE IS THE SAME SIZE

    vec2 uv=fragCoord/res;

    vec2 wave=texture2D(tex,uv).xy;
    float prob=texture2D(tex,uv).z;
    float obs=texture2D(tex,uv).w;


    //ivec2 ij = ivec2(fragCoord);
//    vec2 wave=texelFetch(tex,ij,0).xy;
//    float prob=texelFetch(tex,ij,0).z;
//    float obs=texelFetch(tex,ij,0).w;

    float phase=atan(wave.y,wave.x)/(6.29);

    if(obs!=0.){
        fragColor=vec4(1,1,1,1);
        return;
    }

    vec3 col=pow(5.*hsb2rgb(vec3(phase,0.5,prob)),vec3(0.8));
    fragColor=vec4(col,1.);

}


void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);
}

