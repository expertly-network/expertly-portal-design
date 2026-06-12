# Expertly Frontend Design

This project uses React and Babel Standalone dynamically inside the browser to compile JSX files on the fly. 

> [!IMPORTANT]
> Because the browser dynamically fetches and compiles local `.jsx` files, opening `index.html` directly from your file system (e.g. `file://` protocol) will fail due to CORS (Cross-Origin Resource Sharing) restrictions. You **must** run a local web server to view the pages.

---

## Getting Started

To make it easy for all team members, we have included simple startup scripts for all platforms.

### Option 1: Running the Startup Script (Recommended)

Simply run the appropriate script for your operating system. The script will automatically detect if you have Node.js or Python installed and spin up a local server on port `8000`.

- **macOS / Linux**:
  ```bash
  ./start.sh
  ```
- **Windows**:
  Double-click `start.bat` or run it from the command line:
  ```cmd
  start.bat
  ```

### Option 2: Using Node.js / npm

If you have Node.js installed, you can start the server via npm:
1. Start the server:
   ```bash
   npm start
   ```
2. Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 3: Manual Python Server

If you prefer not to use Node.js, you can launch a server using Python:
- **Python 3**:
  ```bash
  python3 -m http.server 8000
  ```
- **Python 2**:
  ```bash
  python -m SimpleHTTPServer 8000
  ```

---

## Available Pages

Once the server is running, the following pages are available:

- **Home Page**: [http://localhost:8000/index.html](http://localhost:8000/index.html)
- **How It Works**: [http://localhost:8000/how-it-works.html](http://localhost:8000/how-it-works.html)
- **Pricing**: [http://localhost:8000/pricing.html](http://localhost:8000/pricing.html)
- **Apply / Onboarding**: [http://localhost:8000/apply.html](http://localhost:8000/apply.html)
- **Login / Signup**: [http://localhost:8000/login.html](http://localhost:8000/login.html)
- **Members Directory**: [http://localhost:8000/members.html](http://localhost:8000/members.html)
- **Articles**: [http://localhost:8000/articles.html](http://localhost:8000/articles.html)
- **Events**: [http://localhost:8000/events.html](http://localhost:8000/events.html)
- **Onboarding Form**: [http://localhost:8000/onboarding_form.html](http://localhost:8000/onboarding_form.html)

---

## Shared Deployment (Alternative to Local Running)

If you want team members to access the design without running anything locally, you can deploy it to any static web hosting provider:
- **Vercel** / **Netlify** / **GitHub Pages**: Upload the folder, and it will serve automatically.
- **Google Cloud Storage (GCS)**: Place the files in a bucket and enable website configuration.
