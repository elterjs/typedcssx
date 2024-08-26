'use server';

import { readFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { isServer } from './helper';
import { join, dirname } from 'path';

function findNextJsProjectRoot(startPath: string): string | null {
  let currentPath = startPath;
  for (let i = 1; i <= 6; i++) {
    if (
      existsSync(join(currentPath, 'package.json')) &&
      (existsSync(join(currentPath, 'next.config.js')) || existsSync(join(currentPath, 'next.config.mjs')))
    ) {
      return currentPath;
    }
    currentPath = dirname(currentPath);
  }
  return null;
}

export const buildIn = (styleSheet: string, global?: string) => {
  const currentDir = __dirname;
  const projectRoot = findNextJsProjectRoot(currentDir);

  if (!projectRoot) {
    console.error('Next.js project root not found');
    return;
  }

  const srcDir = join(projectRoot, 'src');
  let stylesDir: string;

  if (existsSync(srcDir)) {
    stylesDir = join(srcDir, 'styles');
  } else {
    stylesDir = join(projectRoot, 'styles');
  }

  const styleFilePath = join(__dirname, '../../core/styles/style.module.css');
  const globalFilePath = join(stylesDir, 'typedcssx-global.css');

  const filePath = global === '--global' ? globalFilePath : styleFilePath;
  const message = global === '--global' ? ' ✅ Generating global static css \n' : ' ✅ Generating module static css \n';

  if (!existsSync(stylesDir)) {
    mkdirSync(stylesDir, { recursive: true });
  }

  if (isServer) {
    try {
      if (existsSync(filePath)) {
        const cssData = readFileSync(filePath, 'utf-8');
        if (!cssData.includes(styleSheet)) {
          appendFileSync(filePath, styleSheet, 'utf-8');
          console.log(message + styleSheet);
        }
      } else {
        appendFileSync(filePath, styleSheet, 'utf-8');
        console.log(message + styleSheet);
      }
    } catch (error) {
      console.error('Error writing to file:', error);
      console.error('Stack trace:', error);
    }
  }
};
