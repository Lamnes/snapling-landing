"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The casino localization screencast. Autoplays muted-in-a-loop only when the
 * user has no reduced-motion preference; otherwise it sits on the poster with
 * controls, so nothing moves until asked. The server renders the still poster
 * either way — playback is decided after hydration, never during it.
 */
export default function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (!mq.matches) {
      // Muted playback is allowed without a gesture; ignore rejections.
      ref.current?.play().catch(() => {});
    }
  }, []);

  return (
    <video
      ref={ref}
      className="block w-full"
      poster="/video/casino-localization-poster.jpg"
      src="/video/casino-localization.mp4"
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduced === true}
      aria-label="Screen recording: the LuckySpin demo casino being localized by Snapling — the language switches and every UI string updates in place"
    />
  );
}
