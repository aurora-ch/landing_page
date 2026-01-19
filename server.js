// Simple HTTP Server for Aurora Landing Page
// Handles clean URLs (removes .html extension from URLs)
// Usage: node server.js
// Then visit: http://localhost:8005

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8005;
const ROOT_DIR = __dirname;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webmanifest': 'application/manifest+json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Remove query string and hash for file serving
    pathname = pathname.split('?')[0].split('#')[0];

    // Handle root
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Remove trailing slash (except for root)
    if (pathname !== '/' && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }

    // Build file path
    let filePath = path.join(ROOT_DIR, pathname);

    // Check if path exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            // Path doesn't exist, try folder/index.html approach
            if (!pathname.endsWith('.html') && !pathname.endsWith('/')) {
                const folderPath = path.join(ROOT_DIR, pathname, 'index.html');
                fs.stat(folderPath, (err2, stats2) => {
                    if (!err2 && stats2.isFile()) {
                        // Serve the index.html from folder but keep URL clean
                        serveFile(folderPath, res);
                    } else {
                        // Try .html extension as fallback
                        const htmlPath = filePath + '.html';
                        fs.stat(htmlPath, (err3, stats3) => {
                            if (!err3 && stats3.isFile()) {
                                serveFile(htmlPath, res);
                            } else {
                                serve404(res);
                            }
                        });
                    }
                });
            } else {
                serve404(res);
            }
        } else if (stats.isDirectory()) {
            // It's a directory, try to serve index.html from it
            const indexPath = path.join(filePath, 'index.html');
            fs.stat(indexPath, (err2, stats2) => {
                if (!err2 && stats2.isFile()) {
                    serveFile(indexPath, res);
                } else {
                    serve404(res);
                }
            });
        } else if (stats.isFile()) {
            // File exists, serve it
            serveFile(filePath, res);
        } else {
            serve404(res);
        }
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            serve404(res);
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000'
        });
        res.end(data);
    });
}

function serve404(res) {
    const notFoundPath = path.join(ROOT_DIR, 'index.html');
    fs.readFile(notFoundPath, (err, data) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        if (err) {
            res.end('404 - Page Not Found');
        } else {
            res.end(data);
        }
    });
}

server.listen(PORT, () => {
    console.log(`🚀 Aurora Landing Page Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${ROOT_DIR}`);
    console.log(`✨ Clean URLs enabled - /contact serves contact/index.html`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});
