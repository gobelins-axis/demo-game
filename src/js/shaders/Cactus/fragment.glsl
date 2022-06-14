varying vec2 vUv;
uniform float uTimeSin;
uniform float uTimeCos;
uniform sampler2D uMap;

void main(){
    vec4 texture = texture2D(uMap, vUv);

    gl_FragColor = vec4(texture.rgb, 1.);    
}