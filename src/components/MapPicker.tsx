"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPicker({
  onPick,
}: {
  onPick: (lat: string, lng: string) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onPick(lat.toString(), lng.toString());
      },
    });
    return position ? <Marker position={position} icon={markerIcon} /> : null;
  }

  return (
    <MapContainer
      center={[-23.55052, -46.633308]}
      zoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />
      <LocationMarker />
    </MapContainer>
  );
}
