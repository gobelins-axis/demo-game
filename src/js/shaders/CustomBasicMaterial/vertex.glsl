uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
#include <common>
#include <morphtarget_pars_vertex>
// #define texture2D texture
#include <skinning_pars_vertex>


void main() {
	#include <skinbase_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>

	vNormal = normal;
    vUv = uv;
}