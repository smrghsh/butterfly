
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  
  uniform sampler2D map;
  uniform sampler2D alphaMap;
  uniform float useMap;
  uniform float useAlphaMap;
  uniform float useDash;
  uniform float dashArray;
  uniform float dashOffset;
  uniform float dashRatio;
  uniform float visibility;
  uniform float alphaTest;
  uniform vec2 repeat;
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  varying vec3 vP;
  uniform float uTime;
  
  void main() {
    #include <logdepthbuf_fragment>
    vec4 c = vColor;
    c.r = sin(vP.z);
    if (useMap == 1.) c *= texture2D(map, vUV * repeat);
    if (useAlphaMap == 1.) c.a *= texture2D(alphaMap, vUV * repeat).a;
    if (c.a < alphaTest) discard;
    if (useDash == 1.) {
      c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
    }
    gl_FragColor = c;
    gl_FragColor.a *= step(vCounters, visibility);
    #include <fog_fragment>
    #include <tonemapping_fragment>
    #include <encodings_fragment>
  }