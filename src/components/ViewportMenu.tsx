import React, { useLayoutEffect, useRef } from 'react';

/** Keeps dropdowns inside the visible viewport without detaching outside-click handling. */
export function ViewportMenu({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const place = () => {
      const anchor = menu.parentElement?.getBoundingClientRect();
      if (!anchor) return;
      const margin = 8;
      const width = Math.min(menu.offsetWidth, window.innerWidth - margin * 2);
      const left = Math.max(margin, Math.min(anchor.left, window.innerWidth - width - margin));
      const top = Math.min(Math.max(margin, anchor.bottom + 4), window.innerHeight - 80);
      Object.assign(menu.style, { left: `${left}px`, top: `${top}px`, right: 'auto', bottom: 'auto', maxHeight: `${Math.max(64, window.innerHeight - top - margin)}px` });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, []);
  return <div ref={ref} className={`viewport-menu ${className}`} role="region">{children}</div>;
}
