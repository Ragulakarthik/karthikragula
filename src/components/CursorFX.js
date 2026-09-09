"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR = "a, button, input, [role='button']";

export default function CursorFX() {
  const ringRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noHover = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduceMotion || noHover) return;

    const ring = ringRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let started = false;
    let frame;

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!started) {
        started = true;
        ringX = mouseX;
        ringY = mouseY;
        ring.style.opacity = "1";
      }
      ring.classList.toggle("gwk-cursor-hover", Boolean(e.target.closest(HOVER_SELECTOR)));
    };

    const handleLeave = () => {
      started = false;
      ring.style.opacity = "0";
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.35;
      ringY += (mouseY - ringY) * 0.35;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ringRef} className="gwk-cursor-ring" aria-hidden="true" />;
}
