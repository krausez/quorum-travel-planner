// displays the travel legs between stops on a specific day
// recalculates only when list of stops changes to prevent unnecesarry API calls
// flags any leg longer than 45 minutes signaling that the plans may be unfeasable

import { useEffect, useState } from "react";
import { getLegsForDay, type Leg } from "../../services/travel";
import type { ItineraryItem } from "../../types";

const FAR_APART_MINUTES = 45;

export function DayTravel({ stops }: { stops: ItineraryItem[] }) {
  const [legs, setLegs] = useState<Leg[]>([]);
  const key = stops.map((s) => s.placeId).join(",");

  useEffect(() => {
    let active = true;
    getLegsForDay(stops).then((l) => { if (active) setLegs(l); }).catch(console.error);
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <>
      {legs.map((l) => (
        <p key={l.fromId + l.toId} style={{ color: l.minutes > FAR_APART_MINUTES ? "crimson" : "inherit" }}>
          Drive: {l.minutes} min, {l.miles} mi{l.minutes > FAR_APART_MINUTES && " (far apart)"}
        </p>
      ))}
    </>
  );
}