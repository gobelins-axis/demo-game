 uniform float uTime;
uniform float uScale;
uniform bool reverseTime;
uniform float fadeIn;
uniform float fadeOut;

attribute vec3 positionStart;
attribute float startTime;
attribute vec3 velocity;
attribute vec3 acceleration;
attribute vec3 color;
attribute vec3 endColor;
attribute float size;
attribute float lifeTime;

varying vec4 vColor;
varying vec4 vEndColor;
varying float lifeLeft;
varying float alpha;
#ifdef USE_FOG
    varying float vFogDepth;
#endif  
void main() {
    vec3 transformed = vec3( position );

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
    #endif

    mvPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * mvPosition;

    #ifdef USE_FOG
        vFogDepth = - mvPosition.z;
    #endif
    
    float timeElapsed = uTime - startTime;
    
    if(reverseTime) timeElapsed = lifeTime - timeElapsed;
    if(timeElapsed < fadeIn) {
        alpha = timeElapsed/fadeIn;
    }
    if(timeElapsed >= fadeIn && timeElapsed <= (lifeTime - fadeOut)) {
        alpha = 1.0;
    }
    if(timeElapsed > (lifeTime - fadeOut)) {
        alpha = 1.0 - (timeElapsed - (lifeTime-fadeOut))/fadeOut;
    }
    
    lifeLeft = 1.0 - ( timeElapsed / lifeTime );
   gl_PointSize = (size * uScale);// * lifeLeft;
    transformed = positionStart 
        + (velocity * timeElapsed)
        + (acceleration * 0.5 * timeElapsed * timeElapsed)
        ;
    if (lifeLeft < 0.0) { 
        lifeLeft = 0.0; 
        gl_PointSize = 0.;
    }
    //while active use the new position
    if( timeElapsed > 0.0 ) {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
    } else {
        //if dead use the initial position and set point size to 0
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        lifeLeft = 0.0;
        gl_PointSize = 0.;
    }
    
    // varyings
    vColor = vec4( color, 1.0 );
    vEndColor = vec4( endColor, 1.0);
}