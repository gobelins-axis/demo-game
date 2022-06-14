varying vec2 vUv;
attribute vec3 aPosition;
attribute float aRandomSpeed;
uniform float uTime;
// varying float vDistanceCam;

void main() {
    vec4 transformed = vec4(position.xyz, 1.);
    
    transformed.xyz += aPosition.xyz;

    float dx = position.x;
    float dy = position.y;
    float freq = sqrt(dx*dx + dy*dy);
    float amp = 0.2;
    float angle = -uTime*10.0+freq*2.0 * aRandomSpeed;
    transformed.x += sin(angle)*amp * uv.y;

    vec4 mvPosition = vec4(transformed.xyz, 1.0);

    gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed.xyz, 1.0);
    vUv = uv;
    // vInstanceColor = instanceColor;
}