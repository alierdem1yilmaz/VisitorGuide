import { PrismaClient, Category } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

function photo(slug: string, index: number, caption: string, isCover = false) {
  return {
    url: `https://picsum.photos/seed/${slug}-${index}/800/600`,
    caption,
    isCover,
  };
}

const countries = [
  {
    slug: "turkiye",
    name: "Turkey",
    description:
      "A country spanning Europe and Asia, known for its ancient history, vibrant cities, and Mediterranean coastline.",
    coverImageUrl: "https://picsum.photos/seed/turkiye-cover/1200/600",
    cities: [
      {
        slug: "istanbul",
        name: "Istanbul",
        description:
          "Turkey's largest city, straddling the Bosphorus strait between Europe and Asia, rich in Byzantine and Ottoman history.",
        coverImageUrl: "https://picsum.photos/seed/istanbul-cover/1200/600",
        latitude: 41.0082,
        longitude: 28.9784,
        places: [
          {
            slug: "hagia-sophia",
            name: "Hagia Sophia",
            category: Category.MONUMENT,
            description:
              "A former Byzantine cathedral and Ottoman mosque, now a museum-mosque, famed for its massive dome and mosaics.",
            address: "Sultan Ahmet, Ayasofya Meydanı No:1, Fatih/Istanbul",
            latitude: 41.0086,
            longitude: 28.9802,
            priceLevel: 2,
            website: "https://example.com/hagia-sophia",
            phone: "+90 212 522 1750",
            openingHours: { "mon-sun": "09:00-19:00" },
            photos: [
              photo("hagia-sophia", 1, "Exterior view of the dome", true),
              photo("hagia-sophia", 2, "Interior mosaics"),
            ],
          },
          {
            slug: "blue-mosque",
            name: "Sultan Ahmed Mosque (Blue Mosque)",
            category: Category.MONUMENT,
            description:
              "An active Ottoman-era mosque famous for its six minarets and hand-painted blue tilework.",
            address: "Sultan Ahmet, Atmeydanı Cd. No:7, Fatih/Istanbul",
            latitude: 41.0054,
            longitude: 28.9768,
            priceLevel: 1,
            website: "https://example.com/blue-mosque",
            phone: "+90 212 458 4468",
            openingHours: { "mon-sun": "08:30-18:00" },
            photos: [photo("blue-mosque", 1, "Courtyard and minarets", true)],
          },
          {
            slug: "topkapi-palace",
            name: "Topkapi Palace",
            category: Category.ATTRACTION,
            description:
              "The primary residence of Ottoman sultans for nearly 400 years, now a museum housing imperial treasures.",
            address: "Cankurtaran, 34122 Fatih/Istanbul",
            latitude: 41.0115,
            longitude: 28.9833,
            priceLevel: 2,
            website: "https://example.com/topkapi-palace",
            phone: "+90 212 512 0480",
            openingHours: { "wed-mon": "09:00-18:00" },
            photos: [
              photo("topkapi-palace", 1, "Imperial gate", true),
              photo("topkapi-palace", 2, "Palace gardens"),
            ],
          },
          {
            slug: "belgrad-forest",
            name: "Belgrad Forest",
            category: Category.NATURE,
            description:
              "A large forested area on the European side of Istanbul, popular for walking, cycling, and picnics.",
            address: "Bahçeköy, Sarıyer/Istanbul",
            latitude: 41.1859,
            longitude: 28.9975,
            priceLevel: null,
            website: null,
            phone: null,
            openingHours: { "mon-sun": "06:00-22:30" },
            photos: [photo("belgrad-forest", 1, "Forest trail", true)],
          },
          {
            slug: "karakoy-lokantasi",
            name: "Karaköy Lokantası",
            category: Category.RESTAURANT,
            description:
              "A well-loved meyhane-style restaurant serving traditional Turkish mezes and seafood near the Bosphorus.",
            address: "Kemankeş Karamustafa Paşa, Karaköy, Istanbul",
            latitude: 41.0246,
            longitude: 28.9762,
            priceLevel: 3,
            website: "https://example.com/karakoy-lokantasi",
            phone: "+90 212 292 4455",
            openingHours: { "mon-sat": "12:00-00:00", sun: "closed" },
            photos: [photo("karakoy-lokantasi", 1, "Dining room", true)],
          },
        ],
      },
      {
        slug: "antalya",
        name: "Antalya",
        description:
          "A resort city on Turkey's Mediterranean coast, known for its old town, beaches, and nearby ancient ruins.",
        coverImageUrl: "https://picsum.photos/seed/antalya-cover/1200/600",
        latitude: 36.8969,
        longitude: 30.7133,
        places: [
          {
            slug: "duden-waterfalls",
            name: "Düden Waterfalls",
            category: Category.NATURE,
            description:
              "A set of waterfalls where the Düden River cascades into the Mediterranean Sea, popular for scenic boat tours.",
            address: "Karataş, Antalya",
            latitude: 36.8461,
            longitude: 30.7825,
            priceLevel: 1,
            website: null,
            phone: null,
            openingHours: { "mon-sun": "08:00-20:00" },
            photos: [photo("duden-waterfalls", 1, "Waterfall cliff view", true)],
          },
          {
            slug: "antalya-old-town",
            name: "Antalya Old Town (Kaleiçi)",
            category: Category.ATTRACTION,
            description:
              "A historic quarter of narrow streets, Ottoman houses, and the old harbor within ancient city walls.",
            address: "Kaleiçi, Muratpaşa/Antalya",
            latitude: 36.8858,
            longitude: 30.7056,
            priceLevel: null,
            website: null,
            phone: null,
            openingHours: { "mon-sun": "00:00-23:59" },
            photos: [photo("antalya-old-town", 1, "Old harbor", true)],
          },
          {
            slug: "aspendos-theatre",
            name: "Aspendos Ancient Theatre",
            category: Category.MONUMENT,
            description:
              "A remarkably well-preserved Roman theatre, still used today for concerts and performances.",
            address: "Serik, Antalya",
            latitude: 36.9354,
            longitude: 31.1696,
            priceLevel: 2,
            website: "https://example.com/aspendos-theatre",
            phone: "+90 242 893 5017",
            openingHours: { "mon-sun": "09:00-19:00" },
            photos: [photo("aspendos-theatre", 1, "Theatre seating and stage", true)],
          },
          {
            slug: "vanilla-lounge",
            name: "Vanilla Lounge Restaurant",
            category: Category.RESTAURANT,
            description:
              "A stylish restaurant in Kaleiçi serving Mediterranean cuisine on a candlelit terrace.",
            address: "Kaleiçi, Zeytin Çıkmazı, Antalya",
            latitude: 36.8846,
            longitude: 30.7043,
            priceLevel: 3,
            website: "https://example.com/vanilla-lounge",
            phone: "+90 242 247 6013",
            openingHours: { "mon-sun": "18:00-01:00" },
            photos: [photo("vanilla-lounge", 1, "Terrace seating", true)],
          },
          {
            slug: "rixos-downtown-antalya",
            name: "Rixos Downtown Antalya",
            category: Category.HOTEL,
            description:
              "A modern hotel in central Antalya with rooftop pool views over the old town and the sea.",
            address: "Şirinyalı, Antalya",
            latitude: 36.8783,
            longitude: 30.7208,
            priceLevel: 4,
            website: "https://example.com/rixos-downtown-antalya",
            phone: "+90 242 249 4949",
            openingHours: { "mon-sun": "00:00-23:59" },
            photos: [photo("rixos-downtown-antalya", 1, "Rooftop pool", true)],
          },
        ],
      },
    ],
  },
  {
    slug: "fransa",
    name: "France",
    description:
      "A Western European country known for its art, cuisine, and landmarks ranging from the Eiffel Tower to the French Riviera.",
    coverImageUrl: "https://picsum.photos/seed/fransa-cover/1200/600",
    cities: [
      {
        slug: "paris",
        name: "Paris",
        description:
          "France's capital, celebrated for its museums, architecture, and status as a global center of art and fashion.",
        coverImageUrl: "https://picsum.photos/seed/paris-cover/1200/600",
        latitude: 48.8566,
        longitude: 2.3522,
        places: [
          {
            slug: "eiffel-tower",
            name: "Eiffel Tower",
            category: Category.MONUMENT,
            description:
              "The iconic iron lattice tower on the Champ de Mars, one of the most recognizable structures in the world.",
            address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
            latitude: 48.8584,
            longitude: 2.2945,
            priceLevel: 3,
            website: "https://example.com/eiffel-tower",
            phone: "+33 892 70 12 39",
            openingHours: { "mon-sun": "09:00-23:45" },
            photos: [
              photo("eiffel-tower", 1, "View from the Trocadéro", true),
              photo("eiffel-tower", 2, "Tower at night"),
            ],
          },
          {
            slug: "louvre-museum",
            name: "Louvre Museum",
            category: Category.ATTRACTION,
            description:
              "The world's largest art museum, home to the Mona Lisa and thousands of other works across historic galleries.",
            address: "Rue de Rivoli, 75001 Paris",
            latitude: 48.8606,
            longitude: 2.3376,
            priceLevel: 3,
            website: "https://example.com/louvre-museum",
            phone: "+33 1 40 20 53 17",
            openingHours: { "wed-mon": "09:00-18:00", tue: "closed" },
            photos: [photo("louvre-museum", 1, "Glass pyramid entrance", true)],
          },
          {
            slug: "le-jules-verne",
            name: "Le Jules Verne",
            category: Category.RESTAURANT,
            description:
              "A fine-dining restaurant on the Eiffel Tower's second floor, offering panoramic views of Paris.",
            address: "Eiffel Tower, Avenue Gustave Eiffel, 75007 Paris",
            latitude: 48.8579,
            longitude: 2.2946,
            priceLevel: 4,
            website: "https://example.com/le-jules-verne",
            phone: "+33 1 45 55 61 44",
            openingHours: { "mon-sun": "12:00-13:30, 19:00-21:30" },
            photos: [photo("le-jules-verne", 1, "Dining room with a view", true)],
          },
          {
            slug: "bois-de-boulogne",
            name: "Bois de Boulogne",
            category: Category.NATURE,
            description:
              "A large public park on the western edge of Paris with lakes, gardens, and walking trails.",
            address: "Bois de Boulogne, 75016 Paris",
            latitude: 48.8637,
            longitude: 2.2497,
            priceLevel: null,
            website: null,
            phone: null,
            openingHours: { "mon-sun": "00:00-23:59" },
            photos: [photo("bois-de-boulogne", 1, "Lakeside path", true)],
          },
          {
            slug: "hotel-ritz-paris",
            name: "Hôtel Ritz Paris",
            category: Category.HOTEL,
            description:
              "A legendary luxury hotel on Place Vendôme, known for its opulent rooms and storied history.",
            address: "15 Place Vendôme, 75001 Paris",
            latitude: 48.8683,
            longitude: 2.3286,
            priceLevel: 4,
            website: "https://example.com/hotel-ritz-paris",
            phone: "+33 1 43 16 30 30",
            openingHours: { "mon-sun": "00:00-23:59" },
            photos: [photo("hotel-ritz-paris", 1, "Hotel facade", true)],
          },
        ],
      },
      {
        slug: "nice",
        name: "Nice",
        description:
          "A city on the French Riviera known for its pebble beaches, Mediterranean climate, and historic old town.",
        coverImageUrl: "https://picsum.photos/seed/nice-cover/1200/600",
        latitude: 43.7102,
        longitude: 7.262,
        places: [
          {
            slug: "promenade-des-anglais",
            name: "Promenade des Anglais",
            category: Category.NATURE,
            description:
              "A famous seaside promenade along the Baie des Anges, popular for walking, cycling, and sea views.",
            address: "Promenade des Anglais, 06000 Nice",
            latitude: 43.6959,
            longitude: 7.2652,
            priceLevel: null,
            website: null,
            phone: null,
            openingHours: { "mon-sun": "00:00-23:59" },
            photos: [photo("promenade-des-anglais", 1, "Seafront promenade", true)],
          },
          {
            slug: "castle-hill-nice",
            name: "Castle Hill (Colline du Château)",
            category: Category.ATTRACTION,
            description:
              "A hilltop park overlooking Nice and the Mediterranean, site of a former medieval citadel.",
            address: "Montée Lesage, 06300 Nice",
            latitude: 43.6959,
            longitude: 7.2833,
            priceLevel: null,
            website: null,
            phone: null,
            openingHours: { "mon-sun": "08:30-20:00" },
            photos: [photo("castle-hill-nice", 1, "Viewpoint over the bay", true)],
          },
          {
            slug: "cathedrale-sainte-reparate",
            name: "Cathédrale Sainte-Réparate",
            category: Category.MONUMENT,
            description:
              "A 17th-century baroque cathedral in the heart of Old Nice, dedicated to the city's patron saint.",
            address: "3 Place Rossetti, 06300 Nice",
            latitude: 43.6968,
            longitude: 7.2777,
            priceLevel: 1,
            website: "https://example.com/cathedrale-sainte-reparate",
            phone: "+33 4 93 62 34 40",
            openingHours: { "mon-sun": "09:00-18:00" },
            photos: [photo("cathedrale-sainte-reparate", 1, "Baroque facade", true)],
          },
          {
            slug: "la-petite-maison",
            name: "La Petite Maison",
            category: Category.RESTAURANT,
            description:
              "A celebrated Niçoise restaurant serving regional Provençal dishes in a warm, bistro-style setting.",
            address: "11 Rue Saint-François de Paule, 06300 Nice",
            latitude: 43.6955,
            longitude: 7.2733,
            priceLevel: 4,
            website: "https://example.com/la-petite-maison",
            phone: "+33 4 93 92 59 59",
            openingHours: { "mon-sat": "12:00-14:30, 19:30-22:30", sun: "closed" },
            photos: [photo("la-petite-maison", 1, "Bistro interior", true)],
          },
          {
            slug: "hotel-negresco",
            name: "Hôtel Negresco",
            category: Category.HOTEL,
            description:
              "A landmark Belle Époque hotel on the Promenade des Anglais, recognizable by its distinctive pink dome.",
            address: "37 Promenade des Anglais, 06000 Nice",
            latitude: 43.695,
            longitude: 7.2611,
            priceLevel: 4,
            website: "https://example.com/hotel-negresco",
            phone: "+33 4 93 16 64 00",
            openingHours: { "mon-sun": "00:00-23:59" },
            photos: [photo("hotel-negresco", 1, "Pink dome facade", true)],
          },
        ],
      },
    ],
  },
];

const demoUsers = [
  { email: "ayse.yilmaz@example.com", name: "Ayşe Yılmaz" },
  { email: "john.smith@example.com", name: "John Smith" },
  { email: "marie.dubois@example.com", name: "Marie Dubois" },
];

const sampleReviews: Record<
  string,
  { userEmail: string; rating: number; title: string; body: string }[]
> = {
  "hagia-sophia": [
    {
      userEmail: "john.smith@example.com",
      rating: 5,
      title: "Breathtaking",
      body: "The scale of the dome and the history in every corner make this a must-see.",
    },
    {
      userEmail: "marie.dubois@example.com",
      rating: 4,
      title: "Very crowded but worth it",
      body: "Go early in the morning to avoid the lines.",
    },
  ],
  "blue-mosque": [
    {
      userEmail: "ayse.yilmaz@example.com",
      rating: 5,
      title: "Stunning tilework",
      body: "One of the most beautiful mosques I have visited.",
    },
  ],
  "duden-waterfalls": [
    {
      userEmail: "john.smith@example.com",
      rating: 4,
      title: "Great boat tour",
      body: "Seeing the waterfall drop straight into the sea was unforgettable.",
    },
  ],
  "eiffel-tower": [
    {
      userEmail: "ayse.yilmaz@example.com",
      rating: 5,
      title: "Classic for a reason",
      body: "The view from the top at sunset is unbeatable.",
    },
    {
      userEmail: "marie.dubois@example.com",
      rating: 3,
      title: "Overpriced but iconic",
      body: "Worth doing once, book tickets online to skip the queue.",
    },
  ],
  "louvre-museum": [
    {
      userEmail: "john.smith@example.com",
      rating: 5,
      title: "Could spend days here",
      body: "Way too much to see in one visit, plan accordingly.",
    },
  ],
  "la-petite-maison": [
    {
      userEmail: "marie.dubois@example.com",
      rating: 5,
      title: "Best meal in Nice",
      body: "The vegetable dishes and the service were excellent.",
    },
  ],
  "hotel-negresco": [
    {
      userEmail: "john.smith@example.com",
      rating: 4,
      title: "Beautiful and historic",
      body: "Rooms are a bit dated but the character makes up for it.",
    },
  ],
};

async function main() {
  const users = new Map<string, string>();
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: { email: u.email, name: u.name },
    });
    users.set(u.email, user.id);
  }

  const placeIds: string[] = [];

  for (const country of countries) {
    const { cities, ...countryData } = country;
    const dbCountry = await prisma.country.upsert({
      where: { slug: country.slug },
      update: countryData,
      create: countryData,
    });

    for (const city of cities) {
      const { places, ...cityData } = city;
      const dbCity = await prisma.city.upsert({
        where: { slug: city.slug },
        update: { ...cityData, countryId: dbCountry.id },
        create: { ...cityData, countryId: dbCountry.id },
      });

      for (const place of places) {
        const { photos, ...placeData } = place;
        const dbPlace = await prisma.place.upsert({
          where: { slug: place.slug },
          update: { ...placeData, cityId: dbCity.id },
          create: { ...placeData, cityId: dbCity.id },
        });
        placeIds.push(dbPlace.id);

        for (const p of photos) {
          await prisma.photo.upsert({
            where: { id: `${dbPlace.id}-${p.url}` },
            update: p,
            create: { ...p, id: `${dbPlace.id}-${p.url}`, placeId: dbPlace.id },
          });
        }

        const reviews = sampleReviews[place.slug] ?? [];
        for (const r of reviews) {
          const userId = users.get(r.userEmail);
          if (!userId) continue;
          await prisma.review.upsert({
            where: { placeId_userId: { placeId: dbPlace.id, userId } },
            update: { rating: r.rating, title: r.title, body: r.body },
            create: {
              placeId: dbPlace.id,
              userId,
              rating: r.rating,
              title: r.title,
              body: r.body,
            },
          });
        }

        if (reviews.length > 0) {
          const agg = await prisma.review.aggregate({
            where: { placeId: dbPlace.id },
            _avg: { rating: true },
            _count: true,
          });
          await prisma.place.update({
            where: { id: dbPlace.id },
            data: {
              avgRating: agg._avg.rating ?? 0,
              reviewCount: agg._count,
            },
          });
        }
      }
    }
  }

  console.log(
    `Seeded ${countries.length} countries, ${countries.reduce((n, c) => n + c.cities.length, 0)} cities, ${placeIds.length} places, ${demoUsers.length} users.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
