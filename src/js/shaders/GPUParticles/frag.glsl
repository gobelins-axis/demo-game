varying vec4 vColor;
varying vec4 vEndColor;
varying float lifeLeft;
varying float alpha;
uniform sampler2D tSprite;
void main() {
    // color based on particle texture and the lifeLeft. 
    // if lifeLeft is 0 then make invisible
    vec4 tex = texture2D( tSprite, gl_PointCoord );
    vec4 color = mix(vColor, vEndColor, 1.0-lifeLeft);
    gl_FragColor = vec4( color.rgb*tex.rgb, alpha * tex.a);
}