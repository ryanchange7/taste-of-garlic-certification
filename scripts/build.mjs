import { copyFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputs = [path.join(projectRoot, 'dist'), path.join(projectRoot, 'public')];

for (const output of outputs) {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await copyFile(path.join(projectRoot, 'Index.html'), path.join(output, 'index.html'));
}

console.log('Built dist/index.html and public/index.html');
