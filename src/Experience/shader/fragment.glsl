uniform sampler2D colorTexture;
uniform sampler2D maskTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
    vec4 colorPixel = texture2D(colorTexture, vUv);
    vec4 maskPixel = texture2D(maskTexture, vUv);
    
    // Reveal avec transitions très douces
    float reveal = 1.0 - maskPixel.r;
    
    // Utilise smoothstep avec des valeurs plus douces
    float watercolorReveal = smoothstep(0.0, 0.8, reveal);
    
    // Mix final avec transition très douce
    vec3 finalColor = mix(vec3(1.0, 1.0, 1.0), colorPixel.rgb, watercolorReveal);
    
    gl_FragColor = vec4(finalColor, 1.0);
}