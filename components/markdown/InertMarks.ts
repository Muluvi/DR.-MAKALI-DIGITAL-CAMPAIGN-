"use client";

import { createContext } from "react";

/**
 * True inside a control (a visual row's face is a button): a chip or a cross-reference there cannot
 * be a button or a link of its own, so it draws as plain text and keeps the words it stands for.
 */
export const InertMarks = createContext(false);
