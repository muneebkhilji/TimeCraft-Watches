// Sample watches used to seed localStorage the first time the app runs.
// Images come from Unsplash. If one ever fails to load, the app shows a built-in fallback picture.
const img = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=80`

export const sampleProducts = [
  {
    id: 'p1',
    name: 'Aurelian Grand Complication',
    brand: 'Aurelian',
    category: 'Luxury',
    price: 4850,
    stock: 5,
    featured: true,
    description:
      'A hand-finished automatic movement with a power reserve of 70 hours, set in a polished steel case with a sapphire crystal front and back.',
    image: img('photo-1523275335684-37898b6baf30'),
  },
  {
    id: 'p2',
    name: 'Valmont Tourbillon Skeleton',
    brand: 'Valmont',
    category: 'Luxury',
    price: 6200,
    stock: 2,
    featured: true,
    description:
      'An open-worked dial reveals the tourbillon cage and gear train. Limited production, numbered on the case back.',
    image: img('photo-1587836374828-4dbafa94cf0e'),
  },
  {
    id: 'p3',
    name: 'Sovereign Gold Automatic',
    brand: 'Aurelian',
    category: 'Luxury',
    price: 3400,
    stock: 6,
    featured: false,
    description:
      'Champagne dial, gold-tone case and a slim profile that slides easily under a shirt cuff. Water resistant to 50 metres.',
    image: img('photo-1524592094714-0f0654e20314'),
  },
  {
    id: 'p4',
    name: 'Meridian Moonphase',
    brand: 'Valmont',
    category: 'Luxury',
    price: 2950,
    stock: 7,
    featured: true,
    description:
      'A deep blue dial with a moonphase window and date sub-dial, paired with a hand-stitched leather strap.',
    image: img('photo-1547996160-81dfa63595aa'),
  },
  {
    id: 'p5',
    name: 'Heritage Dress Watch',
    brand: 'Halden',
    category: 'Classic',
    price: 780,
    stock: 15,
    featured: true,
    description:
      'A 38 mm dress watch with a clean white dial, slim steel hands and a brown calfskin strap. Swiss quartz accuracy.',
    image: img('photo-1522312346375-d1a52e2b99b3'),
  },
  {
    id: 'p6',
    name: 'Oxford Leather Classic',
    brand: 'Halden',
    category: 'Classic',
    price: 420,
    stock: 20,
    featured: false,
    description:
      'Everyday elegance in a brushed steel case with a domed crystal and a soft black leather strap.',
    image: img('photo-1434056886845-dac89ffe9b56'),
  },
  {
    id: 'p7',
    name: 'Marlowe Slim Quartz',
    brand: 'Marlowe',
    category: 'Classic',
    price: 295,
    stock: 25,
    featured: false,
    description:
      'Just 6 mm thick with a minimalist dial and a mesh bracelet. A light, reliable watch for daily wear.',
    image: img('photo-1542496658-e33a6d0d50f6'),
  },
  {
    id: 'p8',
    name: 'Regent Roman Dial',
    brand: 'Marlowe',
    category: 'Classic',
    price: 640,
    stock: 12,
    featured: true,
    description:
      'Roman numerals, a railway minute track and a sunburst silver dial give this watch a timeless look.',
    image: img('photo-1495856458515-0637185db551'),
  },
  {
    id: 'p9',
    name: 'Kestrel Diver 300',
    brand: 'Kestrel',
    category: 'Sports',
    price: 890,
    stock: 14,
    featured: true,
    description:
      'A 300 metre water-resistant dive watch with a unidirectional bezel, luminous markers and a rubber strap.',
    image: img('photo-1508057198894-247b23fe5ade'),
  },
  {
    id: 'p10',
    name: 'Northwind Field Chronograph',
    brand: 'Northwind',
    category: 'Sports',
    price: 560,
    stock: 18,
    featured: false,
    description:
      'A rugged chronograph with a tachymeter scale and an olive canvas strap, built for long days outdoors.',
    image: img('photo-1524592094714-0f0654e20314'),
  },
  {
    id: 'p11',
    name: 'Apex GMT Pilot',
    brand: 'Kestrel',
    category: 'Sports',
    price: 1150,
    stock: 9,
    featured: false,
    description:
      'Track a second time zone with the GMT hand. A large crown and high-contrast dial make it easy to read in flight.',
    image: img('photo-1547996160-81dfa63595aa'),
  },
  {
    id: 'p12',
    name: 'Trailblazer Solar Sport',
    brand: 'Northwind',
    category: 'Sports',
    price: 340,
    stock: 22,
    featured: false,
    description:
      'Solar powered, shock resistant and water resistant to 100 metres. Never needs a battery change.',
    image: img('photo-1434056886845-dac89ffe9b56'),
  },
  {
    id: 'p13',
    name: 'Noir Limited Chronograph',
    brand: 'Valmont',
    category: 'Luxury',
    price: 5500,
    stock: 0,
    featured: false,
    description:
      'A blacked-out limited edition chronograph. Currently sold out, which makes it a good test of the out-of-stock message.',
    image: img('photo-1542496658-e33a6d0d50f6'),
  },
]

export const PRODUCT_CATEGORIES = ['Luxury', 'Classic', 'Sports']
