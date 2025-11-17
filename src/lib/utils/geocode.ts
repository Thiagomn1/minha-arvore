export async function getAddressFromCoords(lat: number, lng: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name || "Localização aproximada";
  } catch (err) {
    console.error(err);
    return "Localização aproximada";
  }
}
