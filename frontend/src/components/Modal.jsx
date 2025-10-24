import React from "react";

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    // Fixed inset for deep overlay (bg-black/80 for a strong dark fade)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
      onClick={onClose}
    >
      {/* Modal Content Container */}
      <div
        className="bg-slate-900 border border-gray-700 rounded-xl shadow-2xl max-w-5xl w-full mx-4 transform transition-all duration-300 ease-out scale-100 opacity-100 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="sticky top-0 bg-slate-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-xl z-10 shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title || "Details"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 text-3xl font-light transition duration-200 p-1 rounded-full hover:bg-slate-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
