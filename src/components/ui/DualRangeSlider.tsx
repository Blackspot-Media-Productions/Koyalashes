import React, { useState, useEffect, useRef, type ChangeEvent } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  initialMin: number;
  initialMax: number;
  minGap?: number;
  onChange?: (values: { min: number; max: number }) => void;
}

export default function DualRangeSlider(props: DualRangeSliderProps) {
  const [minVal, setMinVal] = useState<number>(props.initialMin);
  const [maxVal, setMaxVal] = useState<number>(props.initialMax);

  const trackRef = useRef<HTMLDivElement>(null);

  // 1. Sync internal state if parent props change externally
  useEffect(() => {
    setMinVal(props.initialMin);
  }, [props.initialMin]);

  useEffect(() => {
    setMaxVal(props.initialMax);
  }, [props.initialMax]);

  // 2. Visually sync track background fill width & position safely (No loop risk)
  useEffect(() => {
    if (trackRef.current) {
      const minPercent = ((minVal - props.min) / (props.max - props.min)) * 100;
      const maxPercent = ((maxVal - props.min) / (props.max - props.min)) * 100;

      trackRef.current.style.left = `${minPercent}%`;
      trackRef.current.style.right = `${100 - maxPercent}%`;
    }
  }, [minVal, maxVal, props.min, props.max]);

  // 3. Trigger parent callbacks natively on user interaction events
  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - (props.minGap || 0));
    setMinVal(value);
    if (props.onChange) {
      props.onChange({ min: value, max: maxVal });
    }
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + (props.minGap || 0));
    setMaxVal(value);
    if (props.onChange) {
      props.onChange({ min: minVal, max: value });
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-2 select-none">
      {/* Structural base gray track */}
      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-gray-200 rounded-full z-10" />

      {/* Active colored filling track */}
      <div
        ref={trackRef}
        className="absolute top-1/2 -translate-y-1/2 h-px bg-primary rounded-full z-20"
      />

      {/* Min Value Input */}
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={minVal}
        onChange={handleMinChange}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-transparent appearance-none pointer-events-none z-30 m-0
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110
                    [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md"
      />

      {/* Max Value Input */}
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={maxVal}
        onChange={handleMaxChange}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-transparent appearance-none pointer-events-none z-30 m-0
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110
                    [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-md"
      />
    </div>
  );
}
