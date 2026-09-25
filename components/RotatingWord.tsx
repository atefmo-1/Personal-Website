"use client";

import { useEffect, useState } from "react";

type Phase = "typing" | "holding" | "deleting";

// Types out each word, holds it, deletes it, moves to the next. The slot is always as wide as
// the longest word, so the sentence never reflows (or jumps between one and two lines) while
// words change. Server HTML and reduced-motion readers see the first word, static.
export function RotatingWord({ before, words, after }: { before: string; words: string[]; after: string }) {
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(words[0].length);
  const [phase, setPhase] = useState<Phase>("holding");
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    const word = words[index];
    let delay = 0;
    let step: () => void;

    if (phase === "holding") {
      delay = 2200;
      step = () => setPhase("deleting");
    } else if (phase === "deleting") {
      delay = 40;
      step = () => {
        if (length > 0) setLength(length - 1);
        else {
          setIndex((index + 1) % words.length);
          setPhase("typing");
        }
      };
    } else {
      delay = 75;
      step = () => {
        if (length < word.length) setLength(length + 1);
        else setPhase("holding");
      };
    }

    const timer = setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [running, phase, length, index, words]);

  return (
    <>
      <span className="sr-only">
        {before} {words[0]}
        {after && ` ${after}`}
      </span>
      <span aria-hidden>
        {before}{" "}
        {/* Invisible longest word holds the width; the typed word sits on top of it */}
        <span className="relative inline-block whitespace-nowrap font-semibold">
          <span className="invisible">{longest}</span>
          <span className="absolute left-0 top-0 text-fg">
            {words[index].slice(0, length)}
            {running && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-fg" />}
          </span>
        </span>
        {after && ` ${after}`}
      </span>
    </>
  );
}
