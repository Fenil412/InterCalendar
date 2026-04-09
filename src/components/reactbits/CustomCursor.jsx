import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CustomCursor — Smooth dual-ring animated cursor for all screen sizes.
 * Hides the native cursor and replaces it with:
 *  - A small sharp dot (follows instantly)
 *  - A larger ring (follows with spring lag)
 * Changes style on hover over interactive elements.
 * Only activates on devices with a fine pointer (mouse/trackpad).
 * Automatically hidden on touch-only devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Only enable on pointer (mouse/trackpad) devices — not touch-only
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;
    let rafId;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);

    const handleMouseOver = (e) => {
      const el = e.target;
      const interactive = el.closest('button, a, [role="button"], input, textarea, select, label, [tabindex]');
      setHovering(!!interactive);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    rafId = requestAnimationFrame(animate);

    // Hide native cursor globally
    document.documentElement.style.cursor = 'none';

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Dot */}
          <motion.div
            ref={dotRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: clicking ? 0.4 : 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: hovering
                ? 'rgba(232, 122, 27, 1)'
                : 'rgba(232, 122, 27, 0.9)',
              pointerEvents: 'none',
              zIndex: 99999,
              mixBlendMode: 'normal',
              willChange: 'transform',
            }}
          />
          {/* Ring */}
          <motion.div
            ref={ringRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.7,
              scale: clicking ? 0.7 : hovering ? 1.5 : 1,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: hovering
                ? '2px solid rgba(232, 122, 27, 0.8)'
                : '1.5px solid rgba(232, 122, 27, 0.5)',
              pointerEvents: 'none',
              zIndex: 99998,
              willChange: 'transform',
              backdropFilter: hovering ? 'blur(2px)' : 'none',
              background: hovering ? 'rgba(232,122,27,0.05)' : 'transparent',
              boxShadow: hovering
                ? '0 0 12px rgba(232, 122, 27, 0.3), inset 0 0 8px rgba(232, 122, 27, 0.1)'
                : '0 0 6px rgba(232, 122, 27, 0.15)',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
