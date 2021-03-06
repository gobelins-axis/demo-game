varying vec2 vUv;
uniform float uTime;
#include <fog_pars_vertex>

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>
    
    float dx = position.x;
    float dy = position.y;
    float freq = sqrt(dx*dx + dy*dy);
    float amp = 0.1;
    float angle = -uTime*10.0+freq*2.0;
    transformed.x += sin(angle)*amp * (uv.x - 0.5);

    gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed.xyz, 1.0);
    vUv = uv;
}