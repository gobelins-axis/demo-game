varying vec2 vUv;
attribute vec3 aPosition;
attribute float aRandomSpeed;
uniform float uTime;
// varying float vDistanceCam;
#ifdef USE_FOG
    varying float vFogDepth;
#endif  
void main() {
    vec3 transformed = vec3( position );
    transformed.xyz += aPosition.xyz;

    vec4 mvPosition = vec4( transformed, 1.0 );

    #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
    #endif

    mvPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * mvPosition;

    #ifdef USE_FOG
        vFogDepth = - mvPosition.z;
    #endif
    
    float dx = position.x;
    float dy = position.y;
    float freq = sqrt(dx*dx + dy*dy);
    float amp = 0.2;
    float angle = -uTime*10.0+freq*2.0 * aRandomSpeed;
    transformed.x += sin(angle)*amp * uv.x;


    gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed.xyz, 1.0);
    vUv = uv;
    // vInstanceColor = instanceColor;
}