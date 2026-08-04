import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    v: "weekly",
  });
  configured = true;
}

export async function loadMapsLibrary() {
  ensureConfigured();
  return importLibrary("maps");
}

export async function loadMarkerLibrary() {
  ensureConfigured();
  return importLibrary("marker");
}
