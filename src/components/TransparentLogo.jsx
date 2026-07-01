import React, { useEffect, useState } from 'react';

export default function TransparentLogo({ src = '/logo.png', alt = '', tolerance = 40, className = '', width, height }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const im = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = im.data;
        const tol2 = tolerance * tolerance;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dr = r - 0;
          const dg = g - 0;
          const db = b - 0;
          const dist2 = dr * dr + dg * dg + db * db;
          if (dist2 <= tol2) {
            data[i + 3] = 0; // transparent
          }
        }
        ctx.putImageData(im, 0, 0);
        const out = canvas.toDataURL('image/png');
        setDataUrl(out);
      } catch (err) {
        // CORS or other issues: fallback to original src
        setDataUrl(src);
      }
    };
    img.onerror = () => setDataUrl(src);
    return () => { cancelled = true; };
  }, [src, tolerance]);

  return (
    <img
      src={dataUrl || src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="eager"
    />
  );
}
