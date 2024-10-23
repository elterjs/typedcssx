import { buildIn, isDevelopment } from '../../_internal';

let resolveGlobalStyleSheet: (value: [string, string]) => void;
let globalStyleSheetPromise: Promise<[string, string]>;

function createGlobalStyleSheetPromise() {
  globalStyleSheetPromise = new Promise<[string, string]>(resolve => {
    resolveGlobalStyleSheet = resolve;
  });
}

export async function rootBuildIn(): Promise<void> {
  if (typeof globalStyleSheetPromise === 'undefined') createGlobalStyleSheetPromise();
  const [styleSheet, option] = await globalStyleSheetPromise;
  if (!isDevelopment && styleSheet) buildIn(styleSheet, option);
  createGlobalStyleSheetPromise();
}

export { resolveGlobalStyleSheet, globalStyleSheetPromise, createGlobalStyleSheetPromise };
