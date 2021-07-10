//INPUT: a point  vec3 params, having x and y coordinates in 0,1 and z=0
//OUTPUT: a point vec3 giving location in R3 for the parametric surface

ivec2 getIJ(vec2 planeCoords){
    //i do not know exactly what the bounds of 'plane coords' are!
    //the plane is setup to be plane(1,1)

    //GUESS:coords of plane in (-1/2,1/2)?
    //move to (0,1)
    planeCoords+=vec2(0.5);

    planeCoords*=res;

return ivec2(planeCoords);

}



vec3 displace(vec3 params){

    //params is in [-1,1]:
    //because geometry is plane(2,2):

    //set up xy plane:
    //this is a plane longest side length 10
    float aspect =  res.y / res.x;
    vec2 pos =  10.* vec2(1,aspect) * params.xy;

    //get the corresponding texel location
    ivec2 ij=getIJ(params.xy);

    //access the probability for that pixel
   float h=texelFetch(tex,ij,0).z;
    //float h=texture2D(tex,params.xy).z;

    //offset plane in y direction by this probability
    return vec3(-pos.x,2.*h,-pos.y);

}


