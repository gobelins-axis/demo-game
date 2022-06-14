varying vec2 vUv;
attribute vec3 aPosition;

void main() {
    vec4 transformed = vec4(position.xyz, 1.);
    
    transformed.xyz += aPosition.xyz;
    transformed.x *= 3.;

    gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed.xyz, 1.0);
    vUv = uv;
}