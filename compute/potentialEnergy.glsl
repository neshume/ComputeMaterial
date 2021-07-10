

//-------------------------------------------------
//OBSTACLES
//-------------------------------------------------



bool inObstacle(ivec2 ij){
  //  return false;

    //        vec2 uv=toUV(ij);
    //        float thickness=0.02;
    //        vec2 a1=vec2(-0.2,-0.5);
    //        vec2 b1=vec2(-0.2,0.5);
    //        float d1=line_segment(uv,a1,b1)-thickness;
    //        return d1<0.;
    //


            vec2 uv=toUV(ij);

            float thickness=0.01;

            vec2 a1=vec2(0.2,0.1);
            vec2 b1=vec2(0.2,0.5);
            float d1=line_segment(uv,a1,b1)-thickness;

            vec2 a2=vec2(0.2,-0.025);
            vec2 b2=vec2(0.2,0.025);
            float d2=line_segment(uv,a2,b2)-thickness;

            vec2 a3=vec2(0.2,-0.1);
            vec2 b3=vec2(0.2,-0.5);
            float d3=line_segment(uv,a3,b3)-thickness;

            return min(d1,min(d2,d3))<0.;




    //    if(distance(uv,vec2(0.3,0.25))<0.1){
    //        return true;
    //    }
    //    return false;





    //GIVES A BOUNDING ELLIPSE
    //            vec2 uv=toUV(ij);
    //            vec2 ab=vec2(0.6,0.4);
    //            return sdEllipse( uv,  ab)>0.;
}






//-------------------------------------------------
//POTENTIAL ENERGY
//what is the potential energy, as a function of position?
//-------------------------------------------------

float PotentialE(ivec2 ij){
    vec2 uv=toUV(ij);
    //    return 100000.*(uv.x*uv.x+uv.y*uv.y);
    if(inObstacle(ij)){
        return 100000.;
    }
    //we are in free space
    return 0.;
    //return 100.*(uv.x*uv.x+uv.y*uv.y);
}


