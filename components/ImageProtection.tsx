"use client";

import { useEffect } from "react";

export default function ImageProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. If directly clicking on an image
      if (target.tagName === "IMG" || target.tagName === "PICTURE" || target.closest("img")) {
        e.preventDefault();
        return;
      }

      // 2. If clicking on an overlay or wrapper that contains an image
      const button = target.closest("button");
      if (button && button.querySelector("img")) {
        e.preventDefault();
        return;
      }

      const link = target.closest("a");
      if (link && link.querySelector("img")) {
        e.preventDefault();
        return;
      }

      const groupWrapper = target.closest(".group");
      if (groupWrapper && groupWrapper.querySelector("img")) {
        e.preventDefault();
        return;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.tagName === "IMG" || target.tagName === "PICTURE" || target.closest("img")) {
        e.preventDefault();
        return;
      }

      const button = target.closest("button");
      if (button && button.querySelector("img")) {
        e.preventDefault();
        return;
      }
    };

    // Use capture phase (true) to intercept the event before other components
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("dragstart", handleDragStart, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("dragstart", handleDragStart, true);
    };
  }, []);

  return null;
}
