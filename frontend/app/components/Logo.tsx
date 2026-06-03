import React from 'react';

const Logo = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Main Logo Text */}
      <div className="text-center">
        <div className="text-sm font-bold tracking-tight">
          <span className="gradient-text">BANDWIDTH</span>
          <span className="text-white/50 text-xs mx-0.5">&</span>
          <span className="gradient-text">CLOUD</span>
        </div>
        
        {/* Subtitle */}
        <div className="mt-0.5">
          <p className="text-[7px] font-semibold tracking-[0.15em] text-white/50 uppercase whitespace-nowrap">
            SERVICES GROUP
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logo;
