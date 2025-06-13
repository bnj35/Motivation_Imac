import { defineConfig } from 'vite'
import restart from 'vite-plugin-restart'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
    root: './',  
    publicDir: './public/', 
    base: './',
    server: {
        host: true,
        port: 5173,
        open: true
    },
    build: {
        outDir: './dist', 
        emptyOutDir: true, 
        sourcemap: true 
    },
    plugins: [
        restart({ restart: [ './public/**', ] }), 
        glsl() 
    ]
})