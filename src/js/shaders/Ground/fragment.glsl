varying vec2 vUv;
uniform float uTime;
uniform sampler2D uMap;
uniform sampler2D uShadowMap;
#include <fog_pars_fragment>
void main(){
    vec2 repeatUv = vUv;
    vec4 mainTex = texture2D(uMap, fract(vUv * 50.));
    vec4 shadowTex = texture2D(uShadowMap, vUv);

    vec4 finalTex = mix(mainTex, shadowTex, 0.2);
    gl_FragColor = vec4(finalTex.rgb, 1.);    
    #include <fog_fragment>

}