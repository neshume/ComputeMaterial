

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


float Current(ivec2 ij){
    return texelFetch(tex, ij, 0).x;
}


float Previous(ivec2 ij){
    return texelFetch(tex, ij, 0).y;
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


// Create multiple copies of an object - http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
vec2 opRepLim( in vec2 p, in float s, in vec2 lima, in vec2 limb )
{
    return p-s*clamp(round(p/s),lima,limb);
}


// Create infinite copies of an object -  http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
vec2 opRep( in vec2 p, in float s )
{
    return mod(p+s*0.5,s)-s*0.5;
}

// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float opIntersection( float d1, float d2 )
{
    return max(d1,d2);
}

// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdBox( in vec2 p, in vec2 b )
{
    vec2 q = abs(p) - b;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0));
}










