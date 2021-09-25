

//-------------------------------------------------
//OBSTACLES
//-------------------------------------------------

bool outerBoundary(ivec2 ij){
    vec2 rel=vec2(ij)/res.x;
    return (rel.x<0.005||rel.x>0.995||rel.y<0.005||rel.y>0.495);
}




bool inObstacle(ivec2 ij){
    //return false;

if(potentialType==1){
    return outerBoundary(ij);
}

 if(potentialType==2){
     //the double slit experiment

    vec2 uv=toUV(ij);

    float thickness=0.01;

    vec2 a1=vec2(0.2, 0.1);
    vec2 b1=vec2(0.2, 0.5);
    float d1=line_segment(uv, a1, b1)-thickness;

    vec2 a2=vec2(0.2, -0.025);
    vec2 b2=vec2(0.2, 0.025);
    float d2=line_segment(uv, a2, b2)-thickness;

    vec2 a3=vec2(0.2, -0.1);
    vec2 b3=vec2(0.2, -0.5);
    float d3=line_segment(uv, a3, b3)-thickness;

    return min(d1, min(d2, d3))<0.||outerBoundary(ij);
}

    else if(potentialType==3){

     vec2 uv=toUV(ij);
     return uv.x>0.2;
//             vec2 uv=toUV(ij);
//             float thickness=0.02;
//             vec2 a1=vec2(0.2,-0.5);
//             vec2 b1=vec2(0.2,0.5);
//             float d1=line_segment(uv,a1,b1)-thickness;
//             return d1<0.||outerBoundary(ij);

}

 else if(potentialType==4){

     vec2 uv=toUV(ij);
     float y=15.*uv.y;
     uv.y=y-floor(y);

     float thickness=0.1;

     vec2 a1=vec2(1., 0.);
     vec2 b1=vec2(0.8, 0.2);
     float d1=line_segment(uv, a1, b1)-thickness;
    y=2.*y;
     uv.y=y-floor(y);
     float d2=line_segment(uv, a1, b1)-thickness;
     return min(d1,d2)<0.||outerBoundary(ij);








     //GIVES A BOUNDING ELLIPSE
//                 vec2 uv=toUV(ij);
//                 vec2 ab=vec2(0.6,0.4);
//                 return sdEllipse( uv,  ab)>0.;
 }

 else if(potentialType==5){

     vec2 p=toUV(ij);
     vec2 q = (p*24.0 - vec2(20.0,0.0));
     vec2 r = opRepLim(q,1.25,vec2(-8,-8),vec2(3,8));

//
//     vec2 q = 2.*(p*24.0 - vec2(5.0,0.0));
//     vec2 r = opRepLim(q,1.25,vec2(-8,-20),vec2(3,20));
     return (length(r) -  0.2)<0.;


 }
    else {

     return false;
 }

}






//-------------------------------------------------
//POTENTIAL ENERGY
//what is the potential energy, as a function of position?
//-------------------------------------------------

float ior(ivec2 ij){
    vec2 uv=toUV(ij);

    if(inObstacle(ij)){
        return 4.;
    }

    //otherwise in free space
    return 1.;

}






