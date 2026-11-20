/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error jsdom types are optional in setup
import { JSDOM } from "jsdom";

if (typeof window === "undefined" || typeof document === "undefined") {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost:3000",
    pretendToBeVisual: true,
  });

  // Expose JSDOM window properties to globalThis
  for (const key of Object.getOwnPropertyNames(dom.window)) {
    if (!(key in globalThis)) {
      try {
        (globalThis as any)[key] = (dom.window as any)[key];
      } catch {}
    }
  }

  (globalThis as any).window = dom.window;
  (globalThis as any).document = dom.window.document;
  (globalThis as any).navigator = dom.window.navigator;
  (globalThis as any).HTMLElement = dom.window.HTMLElement;
  (globalThis as any).HTMLInputElement = dom.window.HTMLInputElement;
  (globalThis as any).HTMLButtonElement = dom.window.HTMLButtonElement;
  (globalThis as any).HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
  (globalThis as any).HTMLSelectElement = dom.window.HTMLSelectElement;
  (globalThis as any).Element = dom.window.Element;
  (globalThis as any).Node = dom.window.Node;
  (globalThis as any).NodeFilter = dom.window.NodeFilter;
  (globalThis as any).Event = dom.window.Event;
  (globalThis as any).CustomEvent = dom.window.CustomEvent;
  (globalThis as any).getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
  (globalThis as any).MutationObserver = dom.window.MutationObserver;
  (globalThis as any).ResizeObserver =
    dom.window.ResizeObserver ||
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  (globalThis as any).localStorage = dom.window.localStorage;
  (globalThis as any).requestAnimationFrame =
    dom.window.requestAnimationFrame || ((cb: any) => setTimeout(cb, 0));
  (globalThis as any).cancelAnimationFrame =
    dom.window.cancelAnimationFrame || ((id: any) => clearTimeout(id));
}

import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined") {
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: () => {},
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}
