import { loadEnv, defineConfig, Plugin } from 'vite';
import analyze from 'rollup-plugin-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { urbitPlugin } from '@urbit/vite-plugin-urbit';
import { injectManifest } from 'rollup-plugin-workbox';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env.VITE_STORAGE_VERSION = Date.now().toString();

  Object.assign(process.env, loadEnv(mode, process.cwd()));
  const SHIP_URL = process.env.SHIP_URL || process.env.VITE_SHIP_URL || 'http://localhost:8080';
  console.log(SHIP_URL);

  return defineConfig({
    base: mode === 'mock' ? undefined : '/apps/grid/',
    server: mode === 'mock' ? undefined : { https: false },
    build:
      mode !== 'profile'
        ? undefined
        : {
            rollupOptions: {
              plugins: [
                injectManifest({
                  swSrc: 'service-worker.js',
                  swDest: 'dist/service-worker.js',
                  globDirectory: 'dist',
                  mode: 'production' // this inlines the module imports when using yarn build
                }) as Plugin,
                analyze({
                  limit: 20
                }),
                visualizer()
              ]
            }
          },
    plugins:
      mode === 'mock'
        ? []
        : [
            {
              name: 'configure-response-headers',
              configureServer: (server) => {
                server.middlewares.use((_req, res, next) => {
                  res.setHeader('Service-Worker-Allowed', '/');
                  next();
                });
              }
            },
            urbitPlugin({ base: 'grid', target: SHIP_URL, secure: false }),
            reactRefresh()
          ]
  });
};
