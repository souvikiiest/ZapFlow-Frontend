import React from "react";

export default function ZapFlowLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-4">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="text-indigo-600 font-semibold text-lg animate-pulse">
        zapFlow
      </div>
    </div>
  );
}
