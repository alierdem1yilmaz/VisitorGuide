export default function PlaceMap({
  latitude,
  longitude,
  address,
  name,
}: {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  name: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const query = latitude != null && longitude != null
    ? `${latitude},${longitude}`
    : address;

  if (!apiKey || !query) return null;

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    query,
  )}`;

  return (
    <div className="h-72 w-full overflow-hidden rounded-xl border border-ink-text/15">
      <iframe
        title={`Map — ${name}`}
        src={src}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
