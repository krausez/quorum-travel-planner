//takes Google's placeID and asks the Places API (New) for the rating,
// hours, phone, website, etc fields
// specifically asks for these fields, and returns first 4 images and 3 specific
// reviews that pop up, may need to adjust later

import type { PlaceExtras } from "../types";

export async function fetchPlaceExtras(placeId: string): Promise<PlaceExtras> {
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
  const place = new Place({ id: placeId });

  await place.fetchFields({
    fields: [
      "rating", "userRatingCount", "regularOpeningHours",
      "nationalPhoneNumber", "websiteURI", "photos", "reviews",
    ],
  });

  return {
    rating: place.rating ?? undefined,
    ratingCount: place.userRatingCount ?? undefined,
    phone: place.nationalPhoneNumber ?? undefined,
    website: place.websiteURI ?? undefined,
    hours: place.regularOpeningHours?.weekdayDescriptions ?? [],
    photoUrls: (place.photos ?? []).slice(0, 4).map((p) => p.getURI({ maxWidth: 600 })),
    reviews: (place.reviews ?? []).slice(0, 3).map((r) => ({
      author: r.authorAttribution?.displayName ?? "Anonymous",
      rating: r.rating ?? null,
      text: r.text ?? "",
    })),
  };
}