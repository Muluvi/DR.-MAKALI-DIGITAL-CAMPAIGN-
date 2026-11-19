"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Download, ImageDown, Link2, Share2, X } from "lucide-react";

import { CARD_FORMATS, cardUrl, DEFAULT_FORMAT, type CardFormat, type CardRef } from "../../lib/card/spec";

/**
 * Save as image (visual upgrade, E4): the formats, a preview, and native share on a phone.
 *
 * The image is made on the server (`app/api/card/[type]`), so it looks the same on every handset
 * and its URL is a stable address for exactly this view. Sharing fetches that image as a file and
 * hands it to the phone's share sheet (WhatsApp included); where the browser cannot share files it
 * downloads instead. Nothing about the reader leaves the browser except the request for the image.
 */
export function SaveImage({ card, title, formats }: { card: CardRef; title?: string; formats?: CardFormat[] }) {
  const options = formats ?? (Object.keys(CARD_FORMATS) as CardFormat[]);
  const [format, setFormat] = useState<CardFormat>(options.includes(DEFAULT_FORMAT) ? DEFAULT_FORMAT : options[0]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [shown, setShown] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const src = cardUrl(card, format);
  const fileName = `kitui-2027-${card.type}${card.params?.ward ? `-${card.params.ward}` : ""}-${format}.png`;

  useEffect(() => setNote(""), [format]);

  const open = () => {
    const d = dialog.current;
    if (d && !d.open) d.showModal();
    setShown(true);
  };
  const close = () => dialog.current?.close();

  const fetchFile = useCallback(async () => {
    const res = await fetch(src);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }, [src, fileName]);

  const download = useCallback(async () => {
    setBusy(true);
    try {
      const file = await fetchFile();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNote("Saved to your downloads.");
    } catch {
      setNote("The image could not be made. Check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }, [fetchFile, fileName]);

  const share = useCallback(async () => {
    setBusy(true);
    try {
      const file = await fetchFile();
      const data: ShareData = { files: [file], title: title ?? "Kitui 2027" };
      if (typeof navigator !== "undefined" && navigator.canShare?.(data)) {
        await navigator.share(data);
        setNote("");
      } else {
        setBusy(false);
        await download();
        return;
      }
    } catch (e) {
      // A reader closing the share sheet is not an error worth reporting.
      if (!(e instanceof DOMException && e.name === "AbortError")) setNote("Sharing is not available here. Use Download instead.");
    } finally {
      setBusy(false);
    }
  }, [fetchFile, title, download]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(new URL(src, window.location.origin).toString());
      setNote("Image link copied.");
    } catch {
      setNote("Copy is blocked in this browser.");
    }
  }, [src]);

  return (
    <>
      <button type="button" className="plat-btn plat-btn-sm xv-save" onClick={open}>
        <ImageDown size={16} strokeWidth={2} aria-hidden="true" />
        Save as image
      </button>
      <dialog ref={dialog} className="xv-sheet" aria-labelledby={headingId} onClose={() => setShown(false)} onClick={(e) => { if (e.target === dialog.current) close(); }}>
        <div className="xv-sheet__inner">
          <header className="xv-sheet__head">
            <h2 id={headingId} className="xv-sheet__title">Save as image</h2>
            <button type="button" className="xv-sheet__x" onClick={close} aria-label="Close">
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <fieldset className="xv-sheet__formats">
            <legend className="sr-only">Format</legend>
            {options.map((f) => (
              <label key={f} className="xv-sheet__fmt" data-on={f === format ? "true" : "false"}>
                <input type="radio" name={`${headingId}-fmt`} value={f} checked={f === format} onChange={() => setFormat(f)} />
                <span className="xv-sheet__fmt-name">{CARD_FORMATS[f].label}</span>
                <span className="xv-sheet__fmt-hint">{CARD_FORMATS[f].hint}</span>
              </label>
            ))}
          </fieldset>
          <div className="xv-sheet__preview" style={{ aspectRatio: `${CARD_FORMATS[format].w} / ${CARD_FORMATS[format].h}` }}>
            {/* Requested only while the sheet is open, so a page of visuals costs no image requests. */}
            {shown ? <img src={src} alt={`Preview of the ${CARD_FORMATS[format].label.toLowerCase()} image`} decoding="async" /> : null}
          </div>
          <div className="xv-sheet__actions">
            <button type="button" className="plat-btn" onClick={share} disabled={busy}>
              <Share2 size={16} aria-hidden="true" /> Share
            </button>
            <button type="button" className="plat-btn" onClick={download} disabled={busy}>
              <Download size={16} aria-hidden="true" /> Download
            </button>
            <button type="button" className="plat-btn" onClick={copyLink}>
              <Link2 size={16} aria-hidden="true" /> Copy link
            </button>
          </div>
          <p className="xv-sheet__note" role="status" aria-live="polite">{busy ? "Making the image…" : note}</p>
        </div>
      </dialog>
    </>
  );
}
