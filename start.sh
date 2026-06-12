#!/bin/bash
echo "Starting Expertly Local Development Server..."
if command -v node >/dev/null 2>&1; then
  echo "Node.js detected. Running using http-server on port 8000..."
  npx http-server -p 8000 -c-1
elif command -v python3 >/dev/null 2>&1; then
  echo "Python 3 detected. Running using python3 -m http.server on port 8000..."
  python3 -m http.server 8000
elif command -v python >/dev/null 2>&1; then
  echo "Python detected. Running using python -m SimpleHTTPServer on port 8000..."
  python -m SimpleHTTPServer 8000
else
  echo "Error: Neither Node.js nor Python was found on your system."
  echo "Please install Node.js or Python to run this project locally."
  exit 1
fi
