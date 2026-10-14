import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Response, SidecarApp } from 'sidecar_sdk';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.ANTIGRAVITY_EXECUTABLE_DATA_DIR || join(HERE, '.data');
const BOOKS_FILE = join(DATA_DIR, 'books.json');

const app = new SidecarApp();

const readLocal = (name) => readFileSync(join(HERE, name), 'utf8');

app.page('/', () => readLocal('index.html'));
app.page('/app.js', () => readLocal('app.js'));
app.api('/styles.css', () => new Response(readLocal('styles.css'), { contentType: 'text/css' }), 'GET');

// GET /api/books
app.api('/api/books', () => {
  if (!existsSync(BOOKS_FILE)) return null;
  try {
    return JSON.parse(readFileSync(BOOKS_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}, 'GET');

// POST /api/books
app.api('/api/books', (data) => {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(BOOKS_FILE, JSON.stringify(data.books || [], null, 2), 'utf8');
  return { success: true };
}, 'POST');
