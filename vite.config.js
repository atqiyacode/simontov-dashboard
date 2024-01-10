import { fileURLToPath, URL } from 'node:url';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue(), legacy()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            host: true,
            port: 3001,
            proxy: {
                '/backend': {
                    target: process.env.VITE_PROXY_TARGET,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/backend/, '/') // Use a regex to match the start of the path
                },
                '/ws': {
                    target: process.env.VITE_PROXY_TARGET,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/ws/, '/')
                }
            }
        },
        build: {
            chunkSizeWarningLimit: 1600 // set the limit to 1000 KB
        }
    };
});
