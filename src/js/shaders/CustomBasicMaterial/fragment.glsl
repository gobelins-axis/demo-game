uniform sampler2D uBaseTexture;
uniform float uBaseSpeed;
uniform float uRepeatS;
uniform float uRepeatT;

uniform sampler2D uNoiseTexture;
uniform float uNoiseScale;

uniform sampler2D uBlendTexture;
uniform float uBlendSpeed;
uniform float uBlendOffset;

uniform float uTime;
uniform float uAlpha;

varying vec2 vUv;

void main()
{
    vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * uTime * uBaseSpeed;
    vec4 noise = texture2D( uNoiseTexture, uvTimeShift );
    vec2 uvNoiseTimeShift = vUv + uNoiseScale * vec2( noise.r, noise.b);
    vec4 baseColor = texture2D( uBaseTexture, uvNoiseTimeShift * vec2(uRepeatS, uRepeatT) );

    vec2 uvTimeShift2 = vUv + vec2( 0.7, -1.7 ) * uTime * uBlendSpeed;
    vec4 noise2 = texture2D( uNoiseTexture, uvTimeShift2 );
    vec2 uvNoiseTimeShift2 = vUv + uNoiseScale * vec2( noise2.g * 20., noise2.b * 20.);
    vec4 blendColor = texture2D( uBlendTexture, uvNoiseTimeShift2 * vec2(uRepeatS, uRepeatT) ) - uBlendOffset * vec4(1.0, 1.0, 1.0, 1.0);

    vec4 theColor = baseColor + blendColor;

    gl_FragColor = vec4(blendColor.rgb, blendColor.r);
}


