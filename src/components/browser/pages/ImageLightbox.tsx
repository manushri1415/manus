import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export const ImageLightbox = ({ src, alt, onClose }: ImageLightboxProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className="mtube-lightbox-overlay"
    >
      <div className="mtube-lightbox-container">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="mtube-lightbox-close"
          aria-label="Close image viewer"
        >
          <X size={18} />
        </button>
        <img src={src} alt={alt} className="mtube-lightbox-image" />
      </div>
    </div>
  );
};
