varying vec4 vColor;
varying vec4 vEndColor;
varying float lifeLeft;
varying float alpha;
uniform sampler2D tSprite;
#include <fog_pars_fragment>

void main() {
    vec4 tex = texture2D( tSprite, gl_PointCoord );
    vec4 color = mix(vColor, vEndColor, 1.0-lifeLeft);
    gl_FragColor = vec4( color.rgb*tex.rgb, alpha * tex.a);
    #include <fog_fragment>

}