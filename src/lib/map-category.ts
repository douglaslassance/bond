/**
 * Map Apple's `pointOfInterestCategory` (from MapKit JS search) to our
 * 3-category enum. Mirrors the server-side mapping in maps-search.ts but
 * runs in the browser so we can filter search results inline.
 */
export function mapAppleCategoryClient(poiCategory?: string): 'restaurant' | 'bar' | 'shop' | null {
	if (!poiCategory) return null;
	const c = poiCategory.toLowerCase();
	if (['restaurant', 'cafe', 'bakery', 'foodmarket', 'fastfood'].some((n) => c.includes(n)))
		return 'restaurant';
	if (['bar', 'pub', 'brewery', 'winery', 'nightlife'].some((n) => c.includes(n))) return 'bar';
	if (['store', 'shop', 'bookstore', 'clothingstore', 'market'].some((n) => c.includes(n)))
		return 'shop';
	return null;
}
