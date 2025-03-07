import React, { useCallback, useEffect, useState, useRef, FC, CSSProperties } from "react";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: (values: { min: number; max: number }) => void;
  trackColor?: string;
  rangeColor?: string;
  valueStyle?: CSSProperties;
  currencyText?: string;
  width?: string;
  defaultMin?: number;
  defaultMax?: number;
}

const valueCss = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  gap: "2px",
  paddingTop: "10px",
};

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
  min,
  max,
  trackColor = "#ddd",
  onChange,
  rangeColor = "#bfb178",
  valueStyle = valueCss,
  width = "250px",
  currencyText = "€",
  defaultMin,
  defaultMax
}) => {
  const [minVal, setMinVal] = useState<number>(defaultMin ?? min);
  const [maxVal, setMaxVal] = useState<number>(defaultMax ?? max);
  const [isDragging, setIsDragging] = useState(false);
  
  const range = useRef<HTMLDivElement>(null);


  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onChange({ min: minVal, max: maxVal });
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minVal, maxVal]);

  return (
    <div style={{ width}} className="multi-slide-input_container m-auto pt-[15px]">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onMouseDown={() => setIsDragging(true)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
        }}
        className="thumb thumb-left"
        style={{
          width,
          zIndex: minVal > max - 100 ? 5 : undefined,
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onMouseDown={() => setIsDragging(true)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
        }}
        className="thumb thumb-right"
        style={{
          width,
          zIndex: minVal > max - 100 ? 4 : undefined,
        }}
      />

      <div className="slider">
        <div className="track-slider" style={{ backgroundColor: trackColor }} />
        <div
          ref={range}
          style={{ backgroundColor: rangeColor }}
          className="range-slider"
        />
        <div className="values" style={valueStyle}>
          <div className="text-xs font-medium">
            <p style={{fontSize: "18px"}}>
              {currencyText}
              {minVal}
            </p>
          </div>
          <span style={{fontSize: "18px"}}>-</span>
          <div className="text-xs font-medium">
            <p style={{fontSize: "18px"}}>
              {currencyText}
              {maxVal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;