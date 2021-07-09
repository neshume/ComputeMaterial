//INPUT: a point  vec3 params, having x and y coordinates in 0,1 and z=0
//OUTPUT: a point vec3 giving location in R3 for the parametric surface


vec3 displace(vec3 params){

    //set up xy plane:
    vec2 pos=10.*(params.xy);

    //get the corresponding pixel coordinates
    ivec2 ij=ivec2(res.y*(params.xy+vec2(1.,res.y/res.x)));

    //access the probability for that pixel
    float h=texelFetch(tex,ij,0).z;

    //offset plane in z direction by this probability
    return vec3(pos,2.*h);

}


