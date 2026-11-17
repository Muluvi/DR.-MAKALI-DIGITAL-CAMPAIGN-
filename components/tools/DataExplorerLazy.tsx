"use client";

import dynamic from "next/dynamic";

/**
 * The data explorer, loaded in the browser only (it reads the figure registry and the reader's own
 * filters, and has nothing useful to render on the server). `ssr: false` has to live in a client
 * module: the chapters around it render on the server (components/MarkdownViewer.tsx).
 */
export const DataExplorerLazy = dynamic(() => import("./DataExplorer").then((m) => m.DataExplorer), { ssr: false });
