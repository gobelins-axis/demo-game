varying vec2 vUv;
uniform float uTime;
uniform sampler2D uMap;

void main(){
    vec2 transformedUv = vUv;
    // transformedUv.y += mod(uTime * 0.2, 2.);
    transformedUv.y *= fract(transformedUv.y * 50.);
    vec4 texture = texture2D(uMap, transformedUv);

    gl_FragColor = vec4(texture.rgb, 1.);    
}