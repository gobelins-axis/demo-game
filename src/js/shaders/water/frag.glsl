varying vec2 vUv;
varying float vPos;

uniform float uTimeCos;
uniform float uTimeSin;
uniform float uTime;

uniform sampler2D uTex;


void main() {
    vec4 texture = texture2D(uTex, fract(vUv * 50.));
    gl_FragColor= texture;
}