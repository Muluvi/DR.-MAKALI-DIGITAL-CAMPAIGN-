import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * One MediaQueryList for the whole app, created on first use.
 *
 * This used to answer with `window.innerWidth < MOBILE_BREAKPOINT`. Reading innerWidth flushes
 * pending layout, and useSyncExternalStore calls getSnapshot on every render and again to check
 * for tearing — so every render of every consumer forced a full layout of the document.
 * Measured at 4x CPU on /situation, nineteen of those reads cost 1413 ms between them, 74 ms
 * each, and they were the largest single cost in the two seconds after the page went quiet.
 *
 * A MediaQueryList already holds the answer and does not flush layout to give it. It is also
 * the same query the change subscription listens to, so the snapshot and the subscription can
 * no longer disagree about where the breakpoint is.
 */
let mediaQueryList: MediaQueryList | null = null

function list() {
  return (mediaQueryList ??= window.matchMedia(QUERY))
}

function subscribe(callback: () => void) {
  const mql = list()
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSnapshot() {
  return list().matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

const emptySubscribe = () => () => {}

export function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}
