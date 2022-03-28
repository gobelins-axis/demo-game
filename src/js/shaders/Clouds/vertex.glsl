varying vec2 vUv;
attribute vec3 aPosition;
uniform float uRotation;
uniform float uTime;
// varying float vDistanceCam;

mat4 customRotation(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
 
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main() {
    vec4 transformed = vec4(position.xyz, 1.);
    
    // transformed.xyz += aPosition.xyz;
    // transformed *= customRotation(vec3(0., 1., 0.), aPosition.x);

    transformed.x += sin(uTime) * 10.;
    transformed.z += cos(uTime) * 10.;


    vec4 mvPosition = instanceMatrix * vec4(transformed.xyz, 1.0);

    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;
    vUv = uv;
    // vInstanceColor = instanceColor;
}