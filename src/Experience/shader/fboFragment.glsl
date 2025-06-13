uniform float uProgress;
uniform sampler2D tDiffuse;
uniform sampler2D tPrev;
uniform sampler2D tReveal;
uniform float time;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.1415926535897932384626433832795;

//basé sur : https://github.com/yiwenl/glsl-fbm/blob/master/2d.glsl
float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

float fbm(vec2 x, int numOctaves) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);

    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < numOctaves; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float blendDarken(float base, float blend) {
    return min(base, blend);
}

vec3 blendDarken(vec3 base, vec3 blend) {
    return vec3(blendDarken(base.r, blend.r), blendDarken(base.g, blend.g),
                blendDarken(base.b, blend.b));
}

vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
    return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}

float hueToRgb(float f1, float f2, float hue) {
    if (hue < 0.0) hue += 1.0;
    if (hue > 1.0) hue -= 1.0;
    if ((6.0 * hue) < 1.0) return f1 + (f2 - f1) * hue * 6.0;
    if ((2.0 * hue) < 1.0) return f2;
    if ((3.0 * hue) < 2.0) return f1 + (f2 - f1) * (2.0 / 3.0 - hue) * 6.0;
    return f1;
}

vec3 hslToRgb(vec3 hsl) {
    float r, g, b;
    if (hsl.y == 0.0) {
        r = g = b = hsl.z;
    } else {
        float f2 = (hsl.z < 0.5) ? (hsl.z * (1.0 + hsl.y)) : (hsl.z + hsl.y - hsl.z * hsl.y);
        float f1 = 2.0 * hsl.z - f2;
        r = hueToRgb(f1, f2, hsl.x + 1.0 / 3.0);
        g = hueToRgb(f1, f2, hsl.x);
        b = hueToRgb(f1, f2, hsl.x - 1.0 / 3.0);
    }
    return vec3(r, g, b);
}

vec3 hslToRgb(float h, float s, float l) {
    return hslToRgb(vec3(h, s, l));
}

vec3 rgbToHsl(vec3 rgb) {
    float r = rgb.r, g = rgb.g, b = rgb.b;
    float max = max(r, max(g, b));
    float min = min(r, min(g, b));
    float h, s, l = (max + min) / 2.0;

    if (max == min) {
        h = s = 0.0; // achromatic
    } else {
        float d = max - min;
        s = (l > 0.5) ? d / (2.0 - max - min) : d / (max + min);
        if (max == r) {
            h = (g - b) / d + (g < b ? 6.0 : 0.0);
        } else if (max == g) {
            h = (b - r) / d + 2.0;
        } else {
            h = (r - g) / d + 4.0;
        }
        h /= 6.0;
    }
    return vec3(h, s, l);
}

vec3 bgColor = vec3(1.0, 1.0, 1.0);

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    vec4 prev = texture2D(tPrev, vUv);

    vec4 reveal = texture2D(tReveal, vUv);

    vec3 revealHsl = rgbToHsl(reveal.rgb);
    revealHsl.y = 0.0; // Desaturate
    revealHsl.z += 0.35; // Increase lightness

    float contrastFactor = 2.0;
    revealHsl.z = (revealHsl.z - 0.5) * contrastFactor + 0.5;
    revealHsl.z = clamp(revealHsl.z, 0.0, 1.0);


    vec3 revealDesaturated = hslToRgb(revealHsl);

    vec2 aspect = vec2(resolution.x / resolution.y, 1.0);

    // vec2 aspect = vec2(resolution.x / resolution.y, 1.0);

    float displacement = fbm(vUv * 25.0, 4);
    vec2 disp = vec2(displacement) * aspect * 0.005;

    vec4 mov1 = texture2D(tPrev, vUv);
    vec4 mov2 = texture2D(tPrev, vec2(vUv.x + disp.x, vUv.y));
    vec4 mov3 = texture2D(tPrev, vec2(vUv.x - disp.x, vUv.y));
    vec4 mov4 = texture2D(tPrev, vec2(vUv.x, vUv.y + disp.y));
    vec4 mov5 = texture2D(tPrev, vec2(vUv.x, vUv.y - disp.y));

    vec3 floodColor = mov1.rgb;

    floodColor = blendDarken(floodColor, mov2.rgb);
    floodColor = blendDarken(floodColor, mov3.rgb);
    floodColor = blendDarken(floodColor, mov4.rgb);
    floodColor = blendDarken(floodColor, mov5.rgb);

    vec3 gradient = vec3(reveal.r, reveal.g, reveal.b);
    vec3 lcolor = mix(bgColor, gradient, color.r);

    vec3 waterColor = blendDarken(prev.rgb, floodColor , 0.6);
    vec3 finalColor = blendDarken(waterColor, lcolor, 0.6);


    gl_FragColor = vec4(revealDesaturated.rgb, 1.0);
    gl_FragColor = vec4(min( revealDesaturated,  finalColor*(1.0 + 0.0005) + 0.005), 1.0);
    // gl_FragColor = vec4(finalColorLight, 1.0);
}