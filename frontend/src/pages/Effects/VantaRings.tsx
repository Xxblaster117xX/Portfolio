import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Globe from "vanta/dist/vanta.Rings.min";

const VantaBackground: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof Globe> | null>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = Globe({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        waveHeight: 20.0,
        waveSpeed: 1.0,
        color: 0x00ffcc,
        shininess: 50.0,
        waveOffset: 0.0,
        backgroundColor: 0x0a0a0a,
      });

      setVantaEffect(effect);
    }

    return () => {
      vantaEffect?.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default VantaBackground;
