varying vec2 vUv;
uniform sampler2D uMap;
uniform sampler2D uNoise;
uniform float uTimeSin;
uniform float uTimeCos;

void main(){
    vec4 texture = texture2D(uMap, vUv);

    gl_FragColor = vec4(texture.rgb, texture.a);    
}