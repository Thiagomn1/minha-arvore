import Button from "./ui/Button";

export default function MapPicker({
  onPick,
}: {
  onPick: (lat: string, lng: string) => void;
}) {
  // Mock map: just pick coordinates via inputs for MVP
  return (
    <div className="border p-3 rounded">
      <p className="text-sm text-gray-700">Selecione o ponto (mock)</p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <input
          placeholder="Latitude (-23.xxx)"
          className="border p-2 rounded"
          id="lat"
        />
        <input
          placeholder="Longitude (-46.xxx)"
          className="border p-2 rounded"
          id="lng"
        />
      </div>
      <Button
        onClick={() => {
          const lat =
            (document.getElementById("lat") as HTMLInputElement).value ||
            "-23.5505";
          const lng =
            (document.getElementById("lng") as HTMLInputElement).value ||
            "-46.6333";
          onPick(lat, lng);
        }}
        variant="success"
        className="mt-3  px-3 py-1"
      >
        Confirmar ponto
      </Button>
    </div>
  );
}
