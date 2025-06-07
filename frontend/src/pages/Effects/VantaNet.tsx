import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Net from "vanta/dist/vanta.net.min";

const VantaBackground: React.FC = () => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof Net> | null>(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            const effect = Net({
                el: vantaRef.current,
                THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x3fbdff
            });

            setVantaEffect(effect);
        }

        return () => {
            vantaEffect?.destroy?.();
        };
    }, [vantaEffect]);

    return (
        <div
            ref={vantaRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: -1,
                overflow: "hidden",
            }}
        />
    );
};

export default VantaBackground;
