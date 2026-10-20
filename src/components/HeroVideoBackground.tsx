"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HeroVideoBackground() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const handlePlay = () => setIsVideoPlaying(true);
    video.addEventListener("playing", handlePlay);

    // Attempt playback
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsVideoPlaying(true))
        .catch(() => {
          // Autoplay blocked by browser policy (e.g. low power mode)
          // Silently keep static fallback image
          setIsVideoPlaying(false);
        });
    }

    return () => {
      video.removeEventListener("playing", handlePlay);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 1. Static high-resolution poster image (instant first-paint LCP with zero delay) */}
      <Image
        src="/hero-bg.jpg"
        alt="Luxury Real Estate Colombo Sri Lanka"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center lg:object-right"
      />

      {/* 2. Smoothly cross-fading ambient video layer */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover object-center lg:object-right transition-opacity duration-1000 ${
          isVideoPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* 3. Dark gradient overlays to guarantee pristine contrast for headlines and floating cards */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />
    </div>
  );
}
