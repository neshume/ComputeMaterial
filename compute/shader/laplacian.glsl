


bool onEdge(ivec2 ij){
    //are you on the edge of the screen?
    if(ij.x==1||ij.y==1||ij.x==int(res.x)||ij.y==int(res.y)){
        return true;
    }
    return false;

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
    //DO NOT DIVIDE BY DX2
    return sum;
}


//to take the real Laplacian
float[9] current_Field( ivec2 ij ) {
    float[9] field;
    for (int i = 0; i < 9; i++) {
        ivec2 r = ij + grid[i];
        field[i] = Current(r);
    }
    return field;
}



//to take the imaginary Laplacian
float[9] previous_Field( ivec2 ij ) {
    float[9] field;
    for (int i = 0; i < 9; i++) {
        ivec2 r = ij + grid[i];
        field[i] = Previous(r);
    }
    return field;
}



