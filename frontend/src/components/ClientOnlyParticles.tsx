"use client";

import { useEffect, useState } from "react";

interface ParticleConfig {
  left: number;
  top: number;
  delay: number;
  duration: number;
}

interface TrailConfig {
  left: number;
  delay: number;
  duration: number;
}

interface HeadingParticleConfig {
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<ParticleConfig[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(12)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-violet-400/40 to-fuchsia-400/40 rounded-full animate-float-enhanced"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ParticleTrails() {
  const [trails, setTrails] = useState<TrailConfig[]>([]);

  useEffect(() => {
    setTrails(
      [...Array(8)].map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 4,
      }))
    );
  }, []);

  if (trails.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {trails.map((t, i) => (
        <div
          key={`trail-${i}`}
          className="absolute w-0.5 h-8 bg-gradient-to-t from-violet-500/30 to-transparent animate-streak"
          style={{
            left: `${t.left}%`,
            animationDelay: `${t.delay}s`,
            animationDuration: `${t.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function HeadingParticles() {
  const [particles, setParticles] = useState<HeadingParticleConfig[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(12)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <span className="absolute inset-0 opacity-20 -z-10">
      {particles.map((p, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-0.5 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full animate-float-enhanced"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </span>
  );
}
