"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "motion/react";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

interface UseAnimatedNumberOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  triggerOnce?: boolean;
}

/**
 * Animated number hook that uses requestAnimationFrame with an expo-out curve,
 * preserves tabular-nums layout, and respects reduced motion.
 */
export function useAnimatedNumber(
  targetValue: number | string,
  options: UseAnimatedNumberOptions = {}
) {
  const {
    duration = 1.4,
    decimals: customDecimals,
    prefix: customPrefix,
    suffix: customSuffix,
    delay = 0,
    triggerOnce = true,
  } = options;

  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: "-10% 0px" });

  // Parse targetValue if string
  let parsedTarget = 0;
  let parsedPrefix = "";
  let parsedSuffix = "";
  let parsedDecimals = 0;

  if (typeof targetValue === "number") {
    parsedTarget = targetValue;
    parsedDecimals = customDecimals ?? (targetValue.toString().split(".")[1]?.length ?? 0);
  } else {
    const clean = targetValue.replace(/,/g, "");
    const match = clean.match(/^([^0-9.-]*)([0-9.-]+)([^0-9.]*)$/);
    if (match) {
      parsedPrefix = match[1];
      parsedTarget = parseFloat(match[2]);
      parsedSuffix = match[3];
      parsedDecimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    } else {
      parsedTarget = parseFloat(clean) || 0;
    }
  }

  const finalPrefix = customPrefix ?? parsedPrefix;
  const finalSuffix = customSuffix ?? parsedSuffix;
  const finalDecimals = customDecimals ?? parsedDecimals;

  const format = useCallback((num: number) => {
    const formattedNum = num.toLocaleString("en-KE", {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals,
    });
    return `${finalPrefix}${formattedNum}${finalSuffix}`;
  }, [finalDecimals, finalPrefix, finalSuffix]);

  const [animatedValue, setAnimatedValue] = useState<string>(() => format(0));

  useEffect(() => {
    if (reduced || !isInView) return;

    let startTime: number | null = null;
    let animId: number;

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

        // Expo-out easing curve: [0.16, 1, 0.3, 1] approximation
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = parsedTarget * easeProgress;

        setAnimatedValue(format(current));

        if (progress < 1) {
          animId = requestAnimationFrame(animate);
        } else {
          setAnimatedValue(format(parsedTarget));
        }
      };

      animId = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isInView, parsedTarget, duration, delay, reduced, format]);

  const displayValue = reduced ? format(parsedTarget) : animatedValue;

  return { ref, displayValue, value: parsedTarget };
}
