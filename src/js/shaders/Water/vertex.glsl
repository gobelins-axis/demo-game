varying vec2 vUv;
uniform vec2 repeat;
uniform float uTimeCos;
uniform float uTimeSin;
uniform float uTime;

varying float vPos;
#include <fog_pars_vertex>

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>
    

    // vec3 transformed = vec3(position);
    float dx = position.x;
    float dy = position.y;
    float freq = sqrt(dx*dx + dy*dy);
    float amp = 0.1;
    float angle = -uTime*10.0+freq*2.0;
    transformed.z += sin(angle)*amp;

    vPos = transformed.z;
    gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed.xyz, 1.0);
    vUv = uv;
}
