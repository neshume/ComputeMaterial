//INPUT: a point  vec3 params, having x and y coordinates in 0,1 and z=0
//OUTPUT: a point vec3 giving location in R3 for the parametric surface




vec3 displace(vec3 params){

    //set up xy plane:
    //vec2 pos=10.*vec2(1.,res.y/res.x)*(params.xy);

    //set up xy plane:
    vec2 pos=10.*(params.xy);

    ivec2 ij=ivec2(res.y*(params.xy+vec2(1.,res.y/res.x)));
    float h=texelFetch(tex,ij,0).z;
    float obs=texelFetch(tex,ij,0).w;

    //now sample image for height:
    //third component is the probability
//    float h=texture(tex,params.xy).z;
//    float obs=texture(tex,params.xy).w;
    return vec3(pos,2.*h);
    return vec3(pos,h+0.25*obs);

}




//=============================================
//NEW POSITION OF VERTEX
//=============================================

vec3 newPos = displace(position);
