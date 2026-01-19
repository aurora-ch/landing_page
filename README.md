# Aurora Landing Page

Enterprise AI Solutions Landing Page for Aurora.

## Local Development

### Using Node.js Server (Recommended)

The project includes a simple Node.js server that handles clean URLs automatically.

1. **Start the server:**
   ```bash
   npm start
   # or
   node server.js
   ```

2. **Access the site:**
   - Open your browser to: `http://localhost:8005`
   - Clean URLs work automatically:
     - `http://localhost:8005/contact` → serves `contact.html`
     - `http://localhost:8005/legal` → serves `legal.html`
     - `http://localhost:8005/team` → serves `team.html`
     - etc.

### Using Python HTTP Server

If you prefer Python:

```bash
python3 -m http.server 8005
```

**Note:** Python's built-in server doesn't support clean URLs. Use the Node.js server for full functionality.

## Production Deployment

### Apache (.htaccess)

The `.htaccess` file is configured to:
- Serve `.html` files when accessing URLs without the extension
- Redirect `.html` URLs to clean URLs (for SEO)
- Handle all routes properly

### Nginx

Copy `nginx.conf.example` to your Nginx configuration and update the paths:

```bash
cp nginx.conf.example /etc/nginx/sites-available/aurora
# Edit the file and update paths
sudo ln -s /etc/nginx/sites-available/aurora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Clean URL Routing (Folder Structure)

The website uses the "folder trick" method for clean URLs:
- `/contact` → serves `contact/index.html` (URL stays as `/contact`)
- `/legal` → serves `legal/index.html` (URL stays as `/legal`)
- `/team` → serves `team/index.html` (URL stays as `/team`)
- `/coming-soon` → serves `coming-soon/index.html` (URL stays as `/coming-soon`)

This method works universally on all servers (GitHub Pages, Netlify, Apache, Nginx, etc.) without any special configuration needed. When a user accesses `/contact`, the server automatically looks for `contact/index.html` and serves it.

## Project Structure

```
├── index.html          # Home page
├── contact/
│   ├── index.html      # Contact page
│   └── contact.css     # Contact page styles
├── legal/
│   ├── index.html      # Legal pages (Privacy, Terms, Cookies)
│   └── legal.css       # Legal page styles
├── team/
│   ├── index.html      # Team page
│   ├── team.css        # Team page styles
│   ├── team.js         # Team page JavaScript
│   └── *.png           # Team member images
├── coming-soon/
│   ├── index.html      # Coming soon page
│   └── coming-soon.css # Coming soon page styles
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript
├── server.js           # Node.js development server
├── .htaccess          # Apache configuration
└── nginx.conf.example # Nginx configuration template
```

## Features

- Clean URLs (no .html extension in URLs)
- Responsive design
- Modern glass morphism UI
- Cookie consent banner
- SEO optimized
- Fast loading times
