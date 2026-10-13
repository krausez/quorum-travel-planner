// React component to display all the details for the user 

import { useEffect, useState } from "react";
import { fetchPlaceExtras } from "../../services/placeDetails";
import type { PlaceExtras } from "../../types";

export function PlaceExtrasSection({ placeId }: { placeId: string }) {
  const [extras, setExtras] = useState<PlaceExtras | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setExtras(null);
    setError("");
    fetchPlaceExtras(placeId)
      .then((data) => { if (active) setExtras(data); })
      .catch((e) => { if (active) setError(String(e)); });
    return () => { active = false; };
  }, [placeId]);

  if (error) return <p className="muted">Could not load more details: {error}</p>;
  if (!extras) return <p className="muted">Loading details...</p>;

  return (
    <div className="place-extras">
      {extras.rating && <p>Rating: {extras.rating} ({extras.ratingCount ?? 0} reviews)</p>}
      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {extras.photoUrls.map((url) => <img key={url} src={url} alt="" height={110} />)}
      </div>
      {extras.hours.length > 0 && <ul>{extras.hours.map((h) => <li key={h}>{h}</li>)}</ul>}
      {extras.phone && <p>Phone: {extras.phone}</p>}
      {extras.website && <a href={extras.website} target="_blank" rel="noreferrer">Website</a>}
      {extras.reviews.map((r, i) => <blockquote key={i}>{r.text} <em>by {r.author}</em></blockquote>)}
    </div>
  );
}