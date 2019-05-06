function getSource(){
    return `
    uniform sampler2D tex; 
    
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    vec3 invertPreservingHue(vec3 c){
        vec3 hsv = rgb2hsv(vec3(1.0,1.0,1.0) - c);
        vec3 inverted = vec3(hsv.x + 0.5, hsv.y, hsv.z);
        return hsv2rgb(inverted);
    }
    void main() { 
        vec4 color = texture2D(tex, cogl_tex_coord_in[0].st); 
        if(color.a > 0.0) { 
            color.rgb /= color.a; 
        } 
        color.rgb = invertPreservingHue(color.rgb);
        color.rgb *= color.a; 
        cogl_color_out = color * cogl_color_in; 
    } 
    `;
} 