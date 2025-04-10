import React from 'react';

export default function PhotoModal({ photo, onClose }) {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4">
      <div className="relative bg-gray-900 text-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl hover:text-red-500 focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Image */}
        <img
          src={photo.urls.regular}
          alt={photo.alt_description || 'Unsplash image'}
          className="w-full max-h-[60vh] object-contain bg-black"
        />

        {/* Info */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2">By: {photo.user.name}</h2>

          {photo.description && (
            <p className="italic text-gray-300 mb-4">"{photo.description}"</p>
          )}

          <a
            href={`${photo.links.download}?force=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 text-lg"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
