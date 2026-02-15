import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Custom plugin for resume filesystem API
function resumeApiPlugin(): Plugin {
  return {
    name: 'resume-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/resumes')) {
          console.log(`[FS API] ${req.method} ${req.url}`);
          const resumesDir = path.resolve(__dirname, './src/data/resumes');
          const fs = await import('fs/promises');

          // Ensure directory exists
          try { await fs.mkdir(resumesDir, { recursive: true }); } catch (e) { }

          if (req.method === 'GET') {
            try {
              const files = await fs.readdir(resumesDir);
              const jsonFiles = files.filter(f => f.endsWith('.json'));
              const resumes = await Promise.all(jsonFiles.map(async f => {
                const content = await fs.readFile(path.join(resumesDir, f), 'utf-8');
                return JSON.parse(content);
              }));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(resumes));
              return;
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to read resumes' }));
              return;
            }
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body);
                if (!data.resumeTitle) throw new Error('No resumeTitle provided');
                // Sanitize the title for use as filename
                const safeFilename = data.resumeTitle.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
                await fs.writeFile(
                  path.join(resumesDir, `${safeFilename}.json`),
                  JSON.stringify(data, null, 2)
                );
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, filename: `${safeFilename}.json` }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to save resume' }));
              }
            });
            return;
          }

          if (req.method === 'DELETE') {
            const filename = req.url.split('/').pop();
            if (filename && filename !== 'resumes') {
              try {
                // Try to delete by the given filename (which could be a sanitized title)
                await fs.unlink(path.join(resumesDir, `${filename}.json`));
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to delete resume' }));
              }
              return;
            }
          }

        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), resumeApiPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
