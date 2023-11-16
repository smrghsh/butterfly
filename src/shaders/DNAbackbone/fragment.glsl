varying vec3 vP;
varying vec3 vP2;
vec3 pal( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec3 color = pal(vP.x + vP2.y/10.,vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67));
    // gl_FragColor = vec4(sin(vP.x)+0.2,sin(vP.y)+0.2,1.0,1.0);
    gl_FragColor = vec4(color,1.0);
}