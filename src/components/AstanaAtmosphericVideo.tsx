import React from 'react';
import { motion } from 'motion/react';

interface AstanaAtmosphericVideoProps {
  poiId: string;
  photoUrl: string;
  accentColor?: string;
  className?: string;
}

/**
 * Renders a smooth, live panoramic motion stream of real HD Astana photography
 * with continuous camera pan/zoom (Ken Burns effect) and subtle golden-hour light overlay.
 * Never obscures the underlying real photograph with opaque canvas fills.
 */
export const AstanaAtmosphericVideo: React.FC<AstanaAtmosphericVideoProps> = ({
  poiId,
  photoUrl,
  className = 'w-full h-full',
}) => {
  return (
    <div className={`overflow-hidden bg-slate-950 ${className}`}>
      {/* Real HD Photograph of Astana with continuous smooth camera pan & zoom */}
      <motion.img
        key={poiId + photoUrl}
        src={photoUrl}
        alt=""
        referrerPolicy="no-referrer"
        animate={{
          scale: [1.02, 1.12, 1.02],
          x: [0, -12, 0],
          y: [0, -6, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle golden-hour cinematic light gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/35 via-transparent to-orange-500/15 pointer-events-none" />
    </div>
  );
};
