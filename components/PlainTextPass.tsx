"use client";

import { useEffect } from "react";

import { pageText } from "../lib/reader-text";

/**
 * The last pass over the words on screen.
 *
 * Most of the page already reads in plain words: headings drop their numbers, references in the
 * prose become named links, tier pills say Official / Reported / Unconfirmed, phases have names.
 * What is left is text drawn by hand-built panels and charts straight from their data files, which
 * still carries "§6.2", "(T1)" or "Phase −1". This walks those text nodes once after the page is
 * interactive, and again as lazily mounted sections arrive, and rewrites them with the same rules
 * (lib/reader-text.ts). Links, code, inputs and anything marked data-raw are left alone.
 *
 * It only ever changes a text node's value, never the tree, so React's own updates still land.
 */
const SKIP = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT", "NOSCRIPT"]);
const PROBE = /§|Section|Chapter|Annex|Parts? [IV]|\bT[123]\b|Phase|Stage/;

export function PlainTextPass({ rootId = "pf-root" }: { rootId?: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId) ?? document.body;
    const fix = (node: Node) => {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const p = n.parentElement;
          if (!p || SKIP.has(p.tagName) || p.closest("[data-raw]")) return NodeFilter.FILTER_REJECT;
          return PROBE.test(n.nodeValue ?? "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
      });
      const hits: Text[] = [];
      while (walker.nextNode()) hits.push(walker.currentNode as Text);
      for (const t of hits) {
        const next = pageText(t.nodeValue ?? "");
        if (next !== t.nodeValue) t.nodeValue = next;
      }
    };
    fix(root);
    let queued = new Set<Node>();
    let frame = 0;
    const flush = () => {
      frame = 0;
      const nodes = queued;
      queued = new Set();
      nodes.forEach((n) => n.isConnected && fix(n));
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") queued.add(r.target.parentNode ?? r.target);
        r.addedNodes.forEach((n) => queued.add(n));
      }
      if (queued.size && !frame) frame = requestAnimationFrame(flush);
    });
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    return () => {
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootId]);

  return null;
}
