import { buildIn, isDevelopment } from '../../_internal';

let resolveGlobalStyleSheet: (value: [string, string?]) => void;
let globalStyleSheetPromise: Promise<[string, string?]>;
const styleSheetQueue: [string, string?][] = [];
let isProcessing = false;

function createGlobalStyleSheetPromise() {
  globalStyleSheetPromise = new Promise<[string, string?]>(resolve => {
    resolveGlobalStyleSheet = (value: [string, string?]) => {
      styleSheetQueue.push(value);
      resolve(value);
    };
  });
}

async function executeBuildIn(styleSheet: string, option?: string): Promise<void> {
  if (!isDevelopment && styleSheet) buildIn(styleSheet, option);
}

async function processStyleSheets() {
  while (styleSheetQueue.length > 0) {
    const [styleSheet, option] = styleSheetQueue.shift() as [string, string?];
    await executeBuildIn(styleSheet, option);
  }
  isProcessing = false;
}

export function globalBuildIn(): void {
  if (typeof globalStyleSheetPromise === 'undefined') createGlobalStyleSheetPromise();
  if (!isProcessing && styleSheetQueue.length > 0) {
    isProcessing = true;
    processStyleSheets();
  }
}

export { resolveGlobalStyleSheet, globalStyleSheetPromise, createGlobalStyleSheetPromise };
