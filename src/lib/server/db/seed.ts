import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
	event,
	like,
	place,
	userLocation,
	type NewEvent,
	type NewPlace,
	type NewUserLocation
} from './schema.js';
import { user } from './auth.schema.js';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

// ─── Places ────────────────────────────────────────────────────────────────

const PLACES: NewPlace[] = [
	// Los Angeles
	{
		name: 'Bestia',
		category: 'restaurant',
		city: 'Los Angeles',
		neighborhood: 'Arts District',
		description: 'Italian small plates with a wood-fired heart and a packed dining room.'
	},
	{
		name: 'Apparatus Coffee',
		category: 'shop',
		city: 'Los Angeles',
		neighborhood: 'Silver Lake',
		description: 'Pour-overs and pastries in a quiet, tile-lined room.'
	},
	{
		name: 'The Varnish',
		category: 'bar',
		city: 'Los Angeles',
		neighborhood: 'Downtown',
		description: "Hidden cocktail bar behind Cole's, classics done with care."
	},
	{
		name: 'Sqirl',
		category: 'restaurant',
		city: 'Los Angeles',
		neighborhood: 'Virgil Village',
		description: 'Jam toast, rice bowls, brunch lines worth the wait.'
	},
	{
		name: 'Heritage Fine Wines',
		category: 'shop',
		city: 'Los Angeles',
		neighborhood: 'Beverly Hills',
		description: "Wine shop for natural and old-world bottles you can't find elsewhere."
	},
	{
		name: 'Gjusta',
		category: 'restaurant',
		city: 'Los Angeles',
		neighborhood: 'Venice',
		description: 'All-day deli + bakery; pastrami, sourdough, smoked fish.'
	},
	{
		name: 'Stories Books & Cafe',
		category: 'shop',
		city: 'Los Angeles',
		neighborhood: 'Echo Park',
		description: 'Used books + an excellent vegan-leaning cafe in the back.'
	},
	{
		name: 'Found Oyster',
		category: 'restaurant',
		city: 'Los Angeles',
		neighborhood: 'East Hollywood',
		description: 'Tight room, raw bar, lobster rolls, list of muscadets.'
	},
	{
		name: 'Bar Bandini',
		category: 'bar',
		city: 'Los Angeles',
		neighborhood: 'Echo Park',
		description: 'Natural wine bar in a converted bungalow with a back patio.'
	},
	{
		name: 'Mohawk General Store',
		category: 'shop',
		city: 'Los Angeles',
		neighborhood: 'Silver Lake',
		description: 'Curated menswear/womenswear from Japanese and European labels.'
	},
	{
		name: 'Tartine',
		category: 'shop',
		city: 'Los Angeles',
		neighborhood: 'Downtown',
		description: 'Bread, pastries, and a long counter people are happy to wait at.'
	},
	{
		name: 'Tabula Rasa Bar',
		category: 'bar',
		city: 'Los Angeles',
		neighborhood: 'Thai Town',
		description: 'Natural wine list, candles, no menu pretension.'
	},
	{
		name: 'Cobi',
		category: 'restaurant',
		city: 'Los Angeles',
		neighborhood: 'Sawtelle',
		description: 'Modern South Pacific tasting menu with a counter view of the kitchen.'
	},
	{
		name: 'Skylight Books',
		category: 'shop',
		city: 'Los Angeles',
		neighborhood: 'Los Feliz',
		description: 'Independent bookstore with a deep fiction and arts section.'
	},
	{
		name: 'Thunderbolt',
		category: 'bar',
		city: 'Los Angeles',
		neighborhood: 'Historic Filipinotown',
		description: 'Frozen martinis and burgers in a moody room.'
	},

	// Tokyo
	{
		name: 'Fuglen Tokyo',
		category: 'shop',
		city: 'Tokyo',
		neighborhood: 'Shibuya',
		description: 'Norwegian-Japanese coffee shop by day, cocktail bar by night.'
	},
	{
		name: 'Bar Trench',
		category: 'bar',
		city: 'Tokyo',
		neighborhood: 'Ebisu',
		description: 'Tiny absinthe-leaning bar with a thoughtful classic cocktail list.'
	},
	{
		name: 'Tsuta',
		category: 'restaurant',
		city: 'Tokyo',
		neighborhood: 'Yoyogi-Uehara',
		description: 'Truffle-shoyu ramen from the first ramen shop ever to get a Michelin star.'
	},
	{
		name: 'Sushi Saito',
		category: 'restaurant',
		city: 'Tokyo',
		neighborhood: 'Roppongi',
		description: 'Counter-only sushi widely regarded as the best in the city.'
	},
	{
		name: 'Cow Books',
		category: 'shop',
		city: 'Tokyo',
		neighborhood: 'Nakameguro',
		description: 'Curated used bookstore on the Meguro river, heavy on art and counterculture.'
	},
	{
		name: 'Beard',
		category: 'restaurant',
		city: 'Tokyo',
		neighborhood: 'Meguro',
		description: 'Ten-seat counter doing seasonal French with a Japanese hand.'
	},
	{
		name: 'Gen Yamamoto',
		category: 'bar',
		city: 'Tokyo',
		neighborhood: 'Azabu-Juban',
		description: 'Tasting-flight cocktails built around seasonal Japanese produce.'
	},
	{
		name: 'Tomboy',
		category: 'shop',
		city: 'Tokyo',
		neighborhood: 'Sangenjaya',
		description: 'Carefully edited menswear with French and Italian deadstock.'
	},
	{
		name: 'Coutume Aoyama',
		category: 'shop',
		city: 'Tokyo',
		neighborhood: 'Aoyama',
		description: 'Paris-born specialty coffee with a tight pastry case.'
	},
	{
		name: 'Den',
		category: 'restaurant',
		city: 'Tokyo',
		neighborhood: 'Jingumae',
		description: 'Playful, intensely seasonal kaiseki run by chef Zaiyu Hasegawa.'
	},
	{
		name: 'Bear Pond Espresso',
		category: 'shop',
		city: 'Tokyo',
		neighborhood: 'Shimokitazawa',
		description: 'The shop that taught Tokyo to take espresso seriously.'
	},
	{
		name: 'SG Club',
		category: 'bar',
		city: 'Tokyo',
		neighborhood: 'Shibuya',
		description: 'Three-floor bar from Shingo Gokan; ground floor is the most fun.'
	},
	{
		name: 'Daikanyama T-Site',
		category: 'shop',
		city: 'Tokyo',
		neighborhood: 'Daikanyama',
		description: 'Tsutaya flagship — books, magazines, and a coffee bar that lingers all day.'
	},
	{
		name: 'Narisawa',
		category: 'restaurant',
		city: 'Tokyo',
		neighborhood: 'Aoyama',
		description: 'Innovative satoyama cuisine; one of the most reviewed restaurants in the world.'
	},
	{
		name: 'Track',
		category: 'shop',
		city: 'Tokyo',
		neighborhood: 'Aoyama',
		description: 'Specialty coffee in a minimal raw-concrete room run by a former barista champ.'
	}
];

// ─── Events ────────────────────────────────────────────────────────────────

const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const at = (d: number, h: number) => new Date(now + d * day + h * 60 * 60 * 1000);

const EVENTS: NewEvent[] = [
	// Los Angeles
	{
		name: 'Smorgasburg LA',
		category: 'food',
		city: 'Los Angeles',
		venue: 'ROW DTLA',
		description: '90+ vendors of LA street food on a sunny Sunday slab.',
		startsAt: at(3, 10),
		endsAt: at(3, 16)
	},
	{
		name: 'Hammer Museum: Late Night',
		category: 'art',
		city: 'Los Angeles',
		venue: 'Hammer Museum',
		description: 'After-hours gallery access with a bar in the courtyard.',
		startsAt: at(5, 19),
		endsAt: at(5, 23)
	},
	{
		name: 'Khruangbin at the Greek',
		category: 'music',
		city: 'Los Angeles',
		venue: 'Greek Theatre',
		description: 'Outdoor amphitheatre under the trees; one of the best rooms in LA.',
		startsAt: at(7, 20)
	},
	{
		name: 'New Beverly: 35mm Double Feature',
		category: 'film',
		city: 'Los Angeles',
		venue: 'New Beverly Cinema',
		description: 'Two Tarantino-curated 35mm prints back to back.',
		startsAt: at(2, 19)
	},
	{
		name: 'Silver Lake Flea',
		category: 'community',
		city: 'Los Angeles',
		venue: 'Sunset Triangle',
		description: 'Vintage furniture, art, and clothes from local dealers.',
		startsAt: at(6, 10),
		endsAt: at(6, 15)
	},
	{
		name: 'Dodgers vs Giants',
		category: 'sports',
		city: 'Los Angeles',
		venue: 'Dodger Stadium',
		description: 'Hill seats, $6 Dodger dogs, the only sports rivalry that matters in California.',
		startsAt: at(9, 19)
	},

	// Tokyo
	{
		name: 'teamLab Planets — final week',
		category: 'art',
		city: 'Tokyo',
		venue: 'teamLab Planets Toyosu',
		description: 'Immersive water-and-light installation; bring rolled-up pants.',
		startsAt: at(1, 10),
		endsAt: at(1, 22)
	},
	{
		name: 'Wandering Records Pop-up',
		category: 'music',
		city: 'Tokyo',
		venue: 'Shimokitazawa',
		description: 'Listening bar takeover with three guest selectors all night.',
		startsAt: at(4, 19),
		endsAt: at(4, 26)
	},
	{
		name: 'Aoyama Farmers Market',
		category: 'food',
		city: 'Tokyo',
		venue: 'United Nations University Plaza',
		description: 'Saturday farmer + craft market in Aoyama — produce, sake, baked goods.',
		startsAt: at(2, 10),
		endsAt: at(2, 16)
	},
	{
		name: 'Cinema Vera: Wong Kar-wai retrospective',
		category: 'film',
		city: 'Tokyo',
		venue: 'Cinema Vera Shibuya',
		description: 'Six WKW films across the weekend, all 35mm.',
		startsAt: at(5, 14),
		endsAt: at(5, 23)
	},
	{
		name: 'Daikanyama Book Festival',
		category: 'community',
		city: 'Tokyo',
		venue: 'Daikanyama T-Site',
		description: 'Indie publishers, zines, and used-book hunters until late.',
		startsAt: at(6, 11),
		endsAt: at(6, 19)
	},
	{
		name: 'Giants vs Swallows',
		category: 'sports',
		city: 'Tokyo',
		venue: 'Tokyo Dome',
		description: 'Yomiuri Giants at home — the most fun-loud crowd in NPB.',
		startsAt: at(8, 18)
	}
];

// ─── Synthetic users with locations and like patterns ─────────────────────
//
// These are demo personas: they exist in the `user` table so they can be
// matched against, but have no auth rows — they can't sign in. Names are
// fictional. Their like patterns are designed to give a real user some
// non-trivial matches on day 1.

type Persona = {
	name: string;
	email: string;
	city: 'Los Angeles' | 'Tokyo';
	latitude: number;
	longitude: number;
	timezone: string;
	/** Names of the places (across both cities) this persona has liked. */
	likes: string[];
};

const LA = {
	city: 'Los Angeles' as const,
	lat: 34.0522,
	lng: -118.2437,
	tz: 'America/Los_Angeles'
};
const TY = { city: 'Tokyo' as const, lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' };

const PERSONAS: Persona[] = [
	{
		name: 'Maya Tanaka',
		email: 'maya@demo.bond',
		city: TY.city,
		latitude: TY.lat,
		longitude: TY.lng,
		timezone: TY.tz,
		likes: ['Fuglen Tokyo', 'Bar Trench', 'Cow Books', 'Coutume Aoyama', 'Track']
	},
	{
		name: 'Sam Okafor',
		email: 'sam@demo.bond',
		city: TY.city,
		latitude: TY.lat,
		longitude: TY.lng,
		timezone: TY.tz,
		likes: ['Tsuta', 'Sushi Saito', 'Beard', 'Den', 'Bar Trench', 'SG Club']
	},
	{
		name: 'Léo Bernard',
		email: 'leo@demo.bond',
		city: TY.city,
		latitude: TY.lat,
		longitude: TY.lng,
		timezone: TY.tz,
		likes: ['Fuglen Tokyo', 'Coutume Aoyama', 'Tomboy', 'Daikanyama T-Site', 'Bestia']
	},
	{
		name: 'Yuki Nakamura',
		email: 'yuki@demo.bond',
		city: TY.city,
		latitude: TY.lat,
		longitude: TY.lng,
		timezone: TY.tz,
		likes: ['Narisawa', 'Den', 'Gen Yamamoto', 'Beard', 'Bestia', 'Sqirl']
	},
	{
		name: 'Hana Wright',
		email: 'hana@demo.bond',
		city: TY.city,
		latitude: TY.lat,
		longitude: TY.lng,
		timezone: TY.tz,
		likes: ['Bear Pond Espresso', 'Bar Trench', 'Cow Books', 'Apparatus Coffee']
	},
	{
		name: 'Aiden Park',
		email: 'aiden@demo.bond',
		city: LA.city,
		latitude: LA.lat,
		longitude: LA.lng,
		timezone: LA.tz,
		likes: ['Bestia', 'Gjusta', 'Bar Bandini', 'Mohawk General Store', 'Cow Books']
	},
	{
		name: 'Camille Rivera',
		email: 'camille@demo.bond',
		city: LA.city,
		latitude: LA.lat,
		longitude: LA.lng,
		timezone: LA.tz,
		likes: [
			'Sqirl',
			'Tartine',
			'Stories Books & Cafe',
			'Skylight Books',
			'Daikanyama T-Site',
			'Bear Pond Espresso'
		]
	},
	{
		name: 'Marcus Hill',
		email: 'marcus@demo.bond',
		city: LA.city,
		latitude: LA.lat,
		longitude: LA.lng,
		timezone: LA.tz,
		likes: ['Thunderbolt', 'Bar Bandini', 'The Varnish', 'Tabula Rasa Bar', 'SG Club', 'Bar Trench']
	},
	{
		name: 'Priya Shah',
		email: 'priya@demo.bond',
		city: LA.city,
		latitude: LA.lat,
		longitude: LA.lng,
		timezone: LA.tz,
		likes: ['Found Oyster', 'Cobi', 'Apparatus Coffee', 'Heritage Fine Wines', 'Coutume Aoyama']
	},
	{
		name: 'Theo Lambert',
		email: 'theo@demo.bond',
		city: LA.city,
		latitude: LA.lat,
		longitude: LA.lng,
		timezone: LA.tz,
		likes: ['Mohawk General Store', 'Tomboy', 'Track', 'Apparatus Coffee', 'Bear Pond Espresso']
	}
];

// ─── Run ───────────────────────────────────────────────────────────────────

console.log('Clearing dependent rows…');
await db.delete(like);
await db.delete(userLocation);
await db.delete(event);
await db.delete(place);
await sql`DELETE FROM "user" WHERE email LIKE '%@demo.bond'`;

console.log(`Inserting ${PLACES.length} places…`);
const insertedPlaces = await db.insert(place).values(PLACES).returning();
const placeIdByName = new Map(insertedPlaces.map((p) => [p.name, p.id]));

console.log(`Inserting ${EVENTS.length} events…`);
await db.insert(event).values(EVENTS);

console.log(`Inserting ${PERSONAS.length} demo personas…`);
const personaRows = PERSONAS.map((p) => ({
	id: crypto.randomUUID() as string,
	name: p.name,
	email: p.email,
	emailVerified: false
}));
await db.insert(user).values(personaRows);

const userIdByEmail = new Map(personaRows.map((u) => [u.email, u.id]));

const locationRows: NewUserLocation[] = PERSONAS.map((p) => ({
	userId: userIdByEmail.get(p.email)!,
	city: p.city,
	latitude: p.latitude,
	longitude: p.longitude,
	timezone: p.timezone,
	countryCode: p.city === 'Tokyo' ? 'JP' : 'US'
}));
await db.insert(userLocation).values(locationRows);

const likeRows = PERSONAS.flatMap((p) =>
	p.likes
		.map((placeName) => {
			const placeId = placeIdByName.get(placeName);
			if (!placeId) {
				console.warn(`  ⚠ Unknown place "${placeName}" for ${p.name}; skipping.`);
				return null;
			}
			return { userId: userIdByEmail.get(p.email)!, placeId };
		})
		.filter((row): row is { userId: string; placeId: string } => row !== null)
);
await db.insert(like).values(likeRows);

console.log(
	`Done — ${PLACES.length} places, ${EVENTS.length} events, ${PERSONAS.length} personas, ${likeRows.length} likes.`
);
await sql.end();
