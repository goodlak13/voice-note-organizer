import React from 'react';

export const BoltBadge: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-30">
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-12 h-12 hover:scale-110 transition-transform duration-200 opacity-80 hover:opacity-100"
        title="Powered by Bolt"
      >
        <img
          src="/black_circle_360x360.png"
          alt="Powered by Bolt"
          className="w-full h-full rounded-full shadow-lg"
        />
      </a>
    </div>
  );
};