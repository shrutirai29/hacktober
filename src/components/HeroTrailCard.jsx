import React from 'react';
import TrailTopo3D from './TrailTopo3D';

export default function HeroTrailCard({ currentTrail, audioMuted, onOpen3DMap, onSelectTrail }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-sm">
      <TrailTopo3D
        currentTrail={currentTrail}
        audioMuted={audioMuted}
        onSelectTrail={onSelectTrail}
        isDashboard={true}
        onOpen3DMap={onOpen3DMap}
      />
    </div>
  );
}
