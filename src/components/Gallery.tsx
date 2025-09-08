import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";

interface GalleryProps {
  slides: Array<{ src: string; alt: string }>;
}

export default function Gallery({ slides }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-medium text-hot-pink-500 text-center mb-4">Gallery</h2>
      <div className="grid grid-cols-2 gap-3">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 focus:outline-none focus:ring-2 focus:ring-hot-pink-500"
            onClick={() => {
              setLightboxIndex(i);
              setLightboxOpen(true);
            }}
            aria-label={`${s.alt} 크게 보기`}
          >
            <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
      />
    </section>
  );
}