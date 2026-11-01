/**
 * A count as a word, for titles that state how many things a list holds ("three pillars", "five
 * phases"). Every such title builds the word from the list's length, so the title and the list
 * cannot disagree (consolidation pass, Step 1).
 */
const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];

export const countWord = (n: number): string => WORDS[n] ?? String(n);

/** The same, capitalised for the start of a sentence. */
export const CountWord = (n: number): string => {
  const w = countWord(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
};
