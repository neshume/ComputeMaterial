//INPUT: a point  vec3 params, having x and y coordinates in 0,1 and z=0
//OUTPUT: a point vec3 giving location in R3 for the parametric surface


vec3 displace(vec3 params){

    //params is in [-1,1]:

    //set up xy plane:
    //this is a plane of half-height 1, and half-width resx/resy
    float aspect = res.x / res.y;
    vec2 pos = aspect * params.xy;

    //get the corresponding pixel coordinates:
    //rescale to be in (0,1)x(0,1):
    vec2 uv=(params.xy+vec2(1))/2.;
    //multiply by the resolution
    ivec2 ij=ivec2(res*uv);

    //access the probability for that pixel
   float h=texelFetch(tex,ij,0).z;
    //float h=texture2D(tex,params.xy).z;

    //offset plane in z direction by this probability
    return vec3(pos,2.*h);

}


