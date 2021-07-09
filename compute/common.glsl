

//-------------------------------------------------
//SETTING TIME STEPS
// just functions renaming them in a useful way for this particular program
//-------------------------------------------------

float dt,dx;

void setTimeSteps(){
    dx=1./max(res.x,res.y);
    dt=0.8*dx*dx;
}




//-------------------------------------------------
//ACCESSING THE COMPUTE TEXTURE
//-------------------------------------------------


vec2 psi(ivec2 ij){
    return texelFetch(tex, ij, 0).xy;
}


float Real(ivec2 ij){
    return texelFetch(tex, ij, 0).x;
}


float Imaginary(ivec2 ij){
    return texelFetch(tex, ij, 0).y;
}


float probability(ivec2 ij){
    return texelFetch(tex, ij, 0).z;
}



//-------------------------------------------------
//CONVERTING FROM IJ TO UV
//-------------------------------------------------

//turn uv in space into pixel coordinates ij
vec2 toUV(ivec2 ij){
    //(0,0) is at the center of the screen
    //height of the screen is one unit
    return (vec2(ij)-res/2.)/res.y;
}

//----turn ij pixel coords into uv
ivec2 toIJ(vec2 uv){
    return ivec2(res.y*uv+res/2.);
}




//-------------------------------------------------
//WORKING WITH COMPLEX NUMBERS
//-------------------------------------------------


//addition is normal
//scaling is normal
//multiplication:
vec2 mult(vec2 p, vec2 q){
    float x=p.x;
    float y=p.y;
    float u=q.x;
    float v=q.y;

    float real = x*u-y*v;
    float im = x*v+ y*u;

    return vec2(real, im);
}


//multiplicative inverse of complex number
vec2 inv(vec2 p){
    return vec2(p.x,-p.y)/dot(p,p);
}

//complex exponential
vec2 expC(vec2 z){
    return exp(z.x)*vec2(cos(z.y),sin(z.y));
}



//complex square root
vec2 sqrtC(vec2 z){
    float r=length(z);
    float theta=atan(z.y,z.x);

    return sqrt(r)*vec2(cos(theta/2.),sin(theta/2.));
}


//-------------------------------------------------
//DIFFERENTIATION
//implementing the laplacian operator
//-------------------------------------------------

// nine-point compact stencil of Laplacian operator
const float[9] interiorStencil = float[](
.25, .5, .25,
.5, -3., .5,
.25, .5, .25
);


float[9] chooseStencil(ivec2 ij){
    //get x,y in [0,1]x[0,1]
    float x=float(ij.x)/res.x;
    float y=float(ij.y)/res.y;

    //---THE FOUR CORNERS
    if(ij.x==1 && ij.y==1){
        //bottom left corner
        return float[9](
        0., 1., 1.,
        0., -3., 1.,
        0., 0., 0.
        );

    }
    else if(ij.x==1 && y==1.){
        //top left corner
        return float[9](
        0., 0., 0.,
        0., -3., 1.,
        0., 1., 1.
        );
    }

    else if(x==1. && ij.y==1){
        //bottom right corner
        return float[9](
        1., 1., 0.,
        1., -3., 0.,
        0., 0., 0.
        );
    }

    else if(x==1. && y==1.){
        //top right corner
        return float[9](
        0.,  0., 0.,
        1., -3., 0.,
        1., 1., .0
        );
    }

    //---THE EDGES
    else if(ij.x==1){
        //the left edge
        return float[9](
        0., 0.5, 0.5,
        0., -3., 1.,
        0., 0.5, 0.5
        );
    }

    else if(x==1.){
        //the right edge
        return float[9](
        0.5, 0.5, 0.,
        1., -3., 0.,
        0.5, 0.5, 0.
        );
    }

    else if(ij.y==1){
        //the bottom edge
        return float[9](
        0.5, 1., 0.5,
        0.5, -3., 0.5,
        0., 0., 0.
        );
    }

    else if(y==1.){
        //the top edge
        return float[9](
        0., 0., 0.,
        0.5, -3., 0.5,
        0.5, 1., 0.5
        );
    }

    //if none of these:
    return interiorStencil;
}




// relative coordinates of 9x9 grid points
const ivec2[9] grid = ivec2[9](
ivec2(-1,  1), ivec2(0,  1), ivec2(1,  1),
ivec2(-1,  0), ivec2(0,  0), ivec2(1,  0),
ivec2(-1, -1), ivec2(0, -1), ivec2(1, -1)
);



// Laplacian of a real scalar field
float constructLaplacian(float[9] stencil, float[9] samples) {
    float sum = 0.;
    for (int i=0; i<9; i++) {
        sum += stencil[i] * samples[i];
    }
    return sum/(dx*dx);
}


//to take the real Laplacian
float[9] R_Field( ivec2 ij ) {
    float[9] field;
    for (int i = 0; i < 9; i++) {
        ivec2 r = ij + grid[i];
        field[i] = Real(r);
    }
    return field;
}



//to take the imaginary Laplacian
float[9] I_Field( ivec2 ij ) {
    float[9] field;
    for (int i = 0; i < 9; i++) {
        ivec2 r = ij + grid[i];
        field[i] = Imaginary(r);
    }
    return field;
}






//-------------------------------------------------
//basic SDFs
//-------------------------------------------------

float line_segment(in vec2 p, in vec2 a, in vec2 b) {
    vec2 ba = b - a;
    vec2 pa = p - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    return length(pa - h * ba);
}


float msign(in float x) { return (x<0.0)?-1.0:1.0; }

float sdEllipse( vec2 p, in vec2 ab )
{
    //if( ab.x==ab.y ) return length(p)-ab.x;


    p = abs( p );
    if( p.x>p.y ){ p=p.yx; ab=ab.yx; }

    float l = ab.y*ab.y - ab.x*ab.x;

    float m = ab.x*p.x/l;
    float n = ab.y*p.y/l;
    float m2 = m*m;
    float n2 = n*n;

    float c = (m2+n2-1.0)/3.0;
    float c3 = c*c*c;

    float d = c3 + m2*n2;
    float q = d  + m2*n2;
    float g = m  + m *n2;

    float co;

    if( d<0.0 )
    {
        float h = acos(q/c3)/3.0;
        float s = cos(h) + 2.0;
        float t = sin(h) * sqrt(3.0);
        float rx = sqrt( m2-c*(s+t) );
        float ry = sqrt( m2-c*(s-t) );
        co = ry + sign(l)*rx + abs(g)/(rx*ry);
    }
    else
    {
        float h = 2.0*m*n*sqrt(d);
        float s = msign(q+h)*pow( abs(q+h), 1.0/3.0 );
        float t = msign(q-h)*pow( abs(q-h), 1.0/3.0 );
        float rx = -(s+t) - c*4.0 + 2.0*m2;
        float ry =  (s-t)*sqrt(3.0);
        float rm = sqrt( rx*rx + ry*ry );
        co = ry/sqrt(rm-rx) + 2.0*g/rm;
    }
    co = (co-m)/2.0;

    float si = sqrt( max(1.0-co*co,0.0) );

    vec2 r = ab * vec2(co,si);

    return length(r-p) * msign(p.y-r.y);
}










//-------------------------------------------------
//OBSTACLES
//-------------------------------------------------

bool onEdge(ivec2 ij){
    //are you on the edge of the screen?
    if(ij.x==1||ij.y==1||ij.x==int(res.x)||ij.y==int(res.y)){
        return true;
    }
    return false;

    //GIVES A BOUNDING RECTANGLE
    //    vec2 relPos=vec2(ij)/res;
    //    float x=relPos.x;
    //    float y=relPos.y;
    //    if(x<0.1||y<0.1||x>0.9||y>0.9){
    //        return true;
    //    }
    //    return false;



}


bool inObstacle(ivec2 ij){
   // return false;

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


