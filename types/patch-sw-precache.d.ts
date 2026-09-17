declare module '*patch-sw-precache.mjs' {
  export function patchServiceWorker(outDir: string): {
    buildHash: string;
    shellCount: number;
  };
}
