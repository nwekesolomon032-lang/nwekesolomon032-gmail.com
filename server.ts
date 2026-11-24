import express from 'express';
import fs from 'fs';
import path from 'path';
import {createServerApp} from './server/app.ts';

const isProduction = process.env.NODE_ENV === 'production';

function resolveServerPort(): number {
  const portIdx = process.argv.indexOf('--port');
  if (portIdx !== -1) {
    const cliPort = Number(process.argv[portIdx + 1]);
    if (Number.isFinite(cliPort) && cliPort > 0) return cliPort;
  }
  for (const arg of process.argv) {
    if (arg.startsWith('--port=')) {
      const cliPort = Number(arg.slice('--port='.length));
      if (Number.isFinite(cliPort) && cliPort > 0) return cliPort;
    }
  }
  if (!isProduction) {
    return 3000;
  }
  return Number(process.env.PORT) || 3000;
}

const PORT = resolveServerPort();
const rootDir = path.resolve(import.meta.dirname);

async function startServer() {
  const app = createServerApp();

  if (!isProduction) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(rootDir, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SOLMONIX STUDIO platform listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
