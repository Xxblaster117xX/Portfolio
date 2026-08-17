// src/types/vanta-net.d.ts

declare module "vanta/dist/vanta.Rings.min" {
  import * as THREE from "three";

  const VANTA: (options: {
    el: HTMLElement;
    THREE: typeof THREE;
    [key: string]: unknown;
  }) => {
    destroy: () => void;
  };

  export default VANTA;
}


