"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import Button from "./ui/Button";

interface MapModalProps {
  opened: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapModal({ opened, onClose, lat, lng }: MapModalProps) {
  const position: LatLngExpression = [lat, lng];

  return (
    <dialog className={`modal ${opened ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-lg mb-2">Localização exata</h3>
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer
            center={position}
            zoom={16}
            style={{ height: "100%", width: "100%", borderRadius: "8px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            <Marker position={position} icon={markerIcon}>
              <Popup>Aqui está a plantação</Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="modal-action">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
