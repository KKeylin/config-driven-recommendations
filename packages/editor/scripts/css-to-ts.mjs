import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(__dirname, '../dist/styles.css'), 'utf8');

mkdirSync(join(__dirname, '../src/generated'), { recursive: true });
writeFileSync(
  join(__dirname, '../src/generated/styles.ts'),
  `export const editorStyles = ${JSON.stringify(css)};\n`,
);
