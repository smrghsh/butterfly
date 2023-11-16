
varying vec3 vP;
void main() {
    vec3 color = vec3(1.0);
    gl_FragColor = vec4(sin(vP.x)+0.2,sin(vP.y)+0.2,1.0,1.0);
}