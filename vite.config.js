import { fileURLToPath, URL } from 'node:url';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

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
            port: 8200
        },
        build: {
            chunkSizeWarningLimit: 1600 // set the limit to 1000 KB
        }
    };
});
