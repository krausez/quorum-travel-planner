// takes the locations planned for the trips
// uses Google Routes Library to calculate driving time and distanxe
// between consectuive stops ie a to b, b to c, and so on and so forth
// return in minutes and miles

import { loadGoogleMaps } from "./googleMaps";
import type { ItineraryItem } from "../types";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

type Stop = Pick<ItineraryItem, "placeId" | "latitude" | "longitude">;

export interface Leg { fromId: string; toId: string; minutes: number; miles: number }

const METERS_PER_MILE = 1609.344;

export async function getLegsForDay(stops: Stop[]): Promise<Leg[]> {
  if (!apiKey || stops.length < 2) return [];
  await loadGoogleMaps(apiKey);
  const { Route } = (await google.maps.importLibrary("routes")) as google.maps.RoutesLibrary;

  return Promise.all(
    stops.slice(0, -1).map(async (a, i) => {
      const b = stops[i + 1];
      const { routes } = await Route.computeRoutes({
        origin: { lat: a.latitude, lng: a.longitude },
        destination: { lat: b.latitude, lng: b.longitude },
        travelMode: "DRIVING",
        fields: ["durationMillis", "distanceMeters"],
      });
      const r = routes?.[0];
      return {
        fromId: a.placeId,
        toId: b.placeId,
        minutes: Math.round((r?.durationMillis ?? 0) / 60000),
        miles: Math.round(((r?.distanceMeters ?? 0) / METERS_PER_MILE) * 10) / 10,
      };
    })
  );
}