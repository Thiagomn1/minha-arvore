"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "./ui/Loading";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-xl">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  ),
});

export default MapPicker;
