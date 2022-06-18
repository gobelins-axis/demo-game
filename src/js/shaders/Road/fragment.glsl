varying vec2 vUv;
uniform float uTime;
uniform sampler2D uMap;
#include <fog_pars_fragment>

void main(){
    vec2 transformedUv = vUv;
    transformedUv.y *= fract(vUv.y * 100.);
    // transformedUv.y += mod(uTime, 0.3);
    vec4 texture = texture2D(uMap, transformedUv);

    gl_FragColor = vec4(texture.rgb, 1.);
    #include <fog_fragment>

}