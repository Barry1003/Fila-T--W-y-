// Console fixtures transcribed from the view components. Product data is not
// duplicated here — the seed imports src/data/products.ts directly so the
// catalogue has a single source of truth.

export const OWNER = {
  name: 'Adunola Okonkwo',
  email: 'adunola@example.com',
  phone: '+234 806 123 4567',
  location: 'Lagos, Nigeria',
};

export const OWNER_ADDRESSES = [
  {
    isDefault: true, name: 'Adunola Okonkwo',
    line1: '14 Adeola Hopewell Street', line2: null,
    city: 'Victoria Island', state: 'Lagos', postal: '101001', country: 'Nigeria',
    phone: '+234 806 123 4567',
  },
  {
    isDefault: false, name: 'Adunola Okonkwo',
    line1: '3120 Bathurst Street', line2: 'Apt 4B',
    city: 'Toronto', state: 'ON', postal: 'M6A 2A1', country: 'Canada',
    phone: '+1 416 555 0198',
  },
];

export const OWNER_CARDS = [
  { isDefault: true, brand: 'VISA' as const, last4: '4242', expiryMonth: 9, expiryYear: 2027 },
  { isDefault: false, brand: 'MASTERCARD' as const, last4: '8804', expiryMonth: 3, expiryYear: 2026 },
];

export const DISCOUNT_CODES = [
  { code: 'WELCOME10',   type: 'PERCENTAGE' as const,   value: 10, usedCount: 42,  usageLimit: 200,  active: true,  expiresAt: '2026-12-31' },
  { code: 'FREESHIP25',  type: 'FIXED_AMOUNT' as const, value: 25, usedCount: 18,  usageLimit: 100,  active: true,  expiresAt: '2026-10-15' },
  { code: 'GELE15',      type: 'PERCENTAGE' as const,   value: 15, usedCount: 7,   usageLimit: 50,   active: false, expiresAt: '2026-09-30' },
  { code: 'ASOKEVIP',    type: 'PERCENTAGE' as const,   value: 20, usedCount: 89,  usageLimit: 150,  active: true,  expiresAt: '2027-01-01' },
  { code: 'NEWCUSTOMER', type: 'FIXED_AMOUNT' as const, value: 15, usedCount: 203, usageLimit: null, active: false, expiresAt: '2026-07-31' },
];

export const BANNERS = [
  {
    text: 'Free UK shipping on all orders over £150 — use code FREESHIP25',
    ctaLabel: 'Shop Now', status: 'LIVE' as const,
    startsAt: '2026-09-01', endsAt: '2026-09-30',
  },
  {
    text: 'New Aso-Oke collection dropping 15 Oct — early access for newsletter subscribers',
    ctaLabel: 'Sign up', status: 'SCHEDULED' as const,
    startsAt: '2026-10-10', endsAt: '2026-10-30',
  },
  {
    text: 'Summer sale: 15% off everything with SUMMER15',
    ctaLabel: null, status: 'EXPIRED' as const,
    startsAt: '2026-06-01', endsAt: '2026-08-31',
  },
];

/** Customers referenced across orders, reviews, requests and the inbox. */
export const CUSTOMERS = [
  { name: 'Chiamaka Eze',    email: 'chiamaka@email.com', phone: '+44 7700 123456', location: 'London, UK' },
  { name: 'David Mensah',    email: 'david@email.com',    phone: '+44 7700 654321', location: 'Birmingham, UK' },
  { name: 'Bola Adeyemi',    email: 'bola@email.com',     phone: '+44 7711 000111', location: 'Toronto, Canada' },
  { name: 'Ngozi Obi',       email: 'ngozi@email.com',    phone: null,              location: 'Lagos, Nigeria' },
  { name: 'Kwame Asante',    email: 'kwame@email.com',    phone: null,              location: 'Leeds, UK' },
  { name: 'Temi Fadare',     email: 'temi@email.com',     phone: null,              location: 'Bristol, UK' },
  { name: 'Fatima Al-Amin',  email: 'fatima@email.com',   phone: null,              location: 'Manchester, UK' },
  { name: 'Samuel Okonkwo',  email: 'samuel@email.com',   phone: null,              location: 'London, UK' },
  { name: 'Ayo Babatunde',   email: 'ayo@email.com',      phone: null,              location: 'Abuja, Nigeria' },
  { name: 'Zainab Musa',     email: 'zainab@email.com',   phone: null,              location: 'Kano, Nigeria' },
  { name: 'Emmanuel Diop',   email: 'emma@email.com',     phone: null,              location: 'Dakar, Senegal' },
  { name: 'Chioma Ibe',      email: 'chioma@email.com',   phone: null,              location: 'Enugu, Nigeria' },
  { name: 'Ola Balogun',     email: 'ola.balogun@email.com',    phone: null, location: 'Manchester, UK' },
  { name: 'Tunde Bakare',    email: 'tunde.b@email.com',        phone: '+44 7755 882 113', location: 'Bristol, UK' },
  { name: 'Adaeze Obi',      email: 'adaeze.obi@outlook.com',   phone: '+44 7823 119 445', location: 'Birmingham, UK' },
  { name: 'Emeka Okafor',    email: 'emeka.okafor@gmail.com',   phone: '+44 7700 914 022', location: 'London, UK' },
  { name: 'Femi Adeyemi',    email: 'f.adeyemi@business.com',   phone: '+44 7711 203 887', location: 'Manchester, UK' },
  { name: 'Chidi Nwachukwu', email: 'chidi.n@email.com',        phone: '+44 7900 441 556', location: 'Leeds, UK' },
  { name: 'Nnenna Okeke',    email: 'nnenna.okeke@gmail.com',   phone: '+44 7812 334 001', location: 'London, UK' },
];

type SeedOrder = {
  number: string;
  date: string;
  email: string;
  status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING';
  paymentMethod?: string;
  carrier?: string;
  tracking?: string;
  address: { line1: string; city: string; postal: string; country: string; state?: string };
  items: { name: string; variant: string; qty: number; unit: number }[];
  shipping: number;
  discount: number;
  totalNgn: number;
};

const UK = (line1: string, city: string, postal: string) => ({ line1, city, postal, country: 'United Kingdom' });

export const ORDERS: SeedOrder[] = [
  {
    number: '#FTW-2891', date: '2026-09-01', email: 'chiamaka@email.com',
    status: 'NEW', paymentStatus: 'PAID', paymentMethod: 'Stripe (Visa ·· 4242)', carrier: 'Royal Mail',
    address: UK('14 Brixton Hill', 'London', 'SW2 1RJ'),
    items: [{ name: 'Aso-Oke Gele Set', variant: 'Size M · Ivory', qty: 2, unit: 340 }],
    shipping: 12, discount: 0, totalNgn: 1006480,
  },
  {
    number: '#FTW-2887', date: '2026-08-31', email: 'david@email.com',
    status: 'PROCESSING', paymentStatus: 'PAID', paymentMethod: 'Stripe (Mastercard ·· 5555)', carrier: 'DHL',
    address: UK('77 Cowley Road', 'Oxford', 'OX4 1HY'),
    items: [{ name: 'Yoruba Filà (Custom)', variant: 'Size L · Burgundy', qty: 1, unit: 285 }],
    shipping: 8, discount: 0, totalNgn: 422085,
  },
  {
    number: '#FTW-2882', date: '2026-08-30', email: 'bola@email.com',
    status: 'SHIPPED', paymentStatus: 'PAID', paymentMethod: 'PayPal',
    carrier: 'Royal Mail', tracking: 'JD000940012345678901',
    address: UK('33 Canal Street', 'Manchester', 'M1 3WB'),
    items: [{ name: 'Adire Wrapper Set', variant: 'Standard · Indigo', qty: 1, unit: 195 }],
    shipping: 10, discount: 20, totalNgn: 288795,
  },
  {
    number: '#FTW-2871', date: '2026-08-29', email: 'ngozi@email.com',
    status: 'DELIVERED', paymentStatus: 'PAID',
    address: UK('8 Park Row', 'Leeds', 'LS1 5HD'),
    items: [{ name: 'Embroidered Cap (Large)', variant: 'Size L', qty: 1, unit: 120 }],
    shipping: 0, discount: 0, totalNgn: 177720,
  },
  {
    number: '#FTW-2869', date: '2026-08-29', email: 'kwame@email.com',
    status: 'NEW', paymentStatus: 'PAID',
    address: UK('2 Wellington Place', 'Leeds', 'LS1 4AP'),
    items: [{ name: 'Aso-Oke Cap', variant: 'Size M · Navy', qty: 3, unit: 140 }],
    shipping: 0, discount: 0, totalNgn: 621620,
  },
  {
    number: '#FTW-2860', date: '2026-08-27', email: 'temi@email.com',
    status: 'CANCELLED', paymentStatus: 'PENDING',
    address: UK('19 Park Street', 'Bristol', 'BS1 5NF'),
    items: [{ name: 'Beaded Pam Slippers', variant: 'Size 41 · Tan', qty: 1, unit: 88 }],
    shipping: 0, discount: 0, totalNgn: 130328,
  },
  {
    number: '#FTW-2856', date: '2026-08-25', email: 'fatima@email.com',
    status: 'PROCESSING', paymentStatus: 'PAID',
    address: UK('5 Deansgate', 'Manchester', 'M3 2FF'),
    items: [
      { name: 'Ankara Roundneck Shirt', variant: 'Size L · Rust', qty: 1, unit: 125 },
      { name: 'Bead Necklace Set', variant: 'One Size', qty: 1, unit: 58 },
    ],
    shipping: 0, discount: 0, totalNgn: 271023,
  },
  {
    number: '#FTW-2848', date: '2026-08-23', email: 'samuel@email.com',
    status: 'SHIPPED', paymentStatus: 'PAID', carrier: 'DHL',
    address: UK('44 Old Kent Road', 'London', 'SE1 5TY'),
    items: [{ name: 'Agbada 3-Piece Set', variant: 'Size XL · Gold', qty: 1, unit: 680 }],
    shipping: 0, discount: 0, totalNgn: 1006480,
  },
  {
    number: '#FTW-2841', date: '2026-08-20', email: 'ayo@email.com',
    status: 'DELIVERED', paymentStatus: 'PAID',
    address: UK('12 Broad Street', 'Birmingham', 'B1 2HF'),
    items: [{ name: 'Ipele Wrap (Silk Blend)', variant: 'One Size · Crimson', qty: 1, unit: 245 }],
    shipping: 0, discount: 0, totalNgn: 362945,
  },
  {
    number: '#FTW-2838', date: '2026-08-18', email: 'zainab@email.com',
    status: 'DELIVERED', paymentStatus: 'PAID',
    address: UK('7 Queen Street', 'Glasgow', 'G1 3DX'),
    items: [
      { name: 'Leather Yoruba Shoes', variant: 'Size 43 · Maroon', qty: 1, unit: 220 },
      { name: 'Adire Wrapper Set', variant: 'Standard · Indigo', qty: 1, unit: 195 },
    ],
    shipping: 0, discount: 0, totalNgn: 614615,
  },
  {
    number: '#FTW-2830', date: '2026-08-15', email: 'emma@email.com',
    status: 'NEW', paymentStatus: 'PENDING',
    address: UK('90 High Street', 'Cardiff', 'CF10 1PU'),
    items: [{ name: 'Aso-Oke Trousers', variant: 'Size 32 · Charcoal', qty: 1, unit: 160 }],
    shipping: 0, discount: 0, totalNgn: 236960,
  },
  {
    number: '#FTW-2822', date: '2026-08-12', email: 'chioma@email.com',
    status: 'DELIVERED', paymentStatus: 'PAID',
    address: UK('21 Fargate', 'Sheffield', 'S1 2HE'),
    items: [{ name: 'Embroidered Kaftan (Men)', variant: 'Size L · Gold', qty: 1, unit: 420 }],
    shipping: 0, discount: 0, totalNgn: 621620,
  },
];

export const REVIEWS = [
  {
    email: 'chiamaka@email.com', rating: 5, date: '2026-08-28',
    product: 'Aso-oke Gele — Ivory & Gold Set',
    body: "Absolutely stunning craftsmanship. The Gele drapes perfectly and the colour is exactly what I wanted. Fila Tó Wúyì truly delivers on their promise of quality. I wore this to my cousin's traditional ceremony and received compliments all evening. Will definitely order again for my sister's wedding.",
    reply: "Thank you so much, Chiamaka! We're overjoyed that the Gele was everything you hoped for — and congratulations on the ceremony! We can't wait to create something special for your sister's celebration too.",
    repliedAt: '2026-08-29', flagged: false, photos: [],
  },
  {
    email: 'david@email.com', rating: 4, date: '2026-08-25',
    product: 'Embroidered Agbada Kaftan',
    body: 'Very well made and the embroidery is exquisite. Delivery was a little slower than expected — arrived on day 8 when I was told 5–7 days — but the quality more than makes up for it. The packaging felt like a luxury gift. I photographed the unboxing.',
    reply: null, repliedAt: null, flagged: false, photos: [],
  },
  {
    email: 'bola@email.com', rating: 5, date: '2026-08-20',
    product: 'Adire Roundneck — Indigo',
    body: "The Adire fabric is gorgeous — rich indigo with such intricate patterns. I've received so many compliments every time I wear this. True artistry. You can see the care that went into each hand-drawn detail.",
    reply: "Thank you Bola! Those Adire patterns are hand-drawn by our master artisan in Lagos — we're so glad you love it. We'd love to see you in it. Feel free to tag us on Instagram!",
    repliedAt: '2026-08-21', flagged: false, photos: [],
  },
  {
    email: 'ola.balogun@email.com', rating: 5, date: '2026-08-15',
    product: 'Gobi Filà Cap — Burgundy Velvet',
    body: 'Perfect fit on the first try. The velvet is rich and the cap holds its shape beautifully. I ordered the Large and it fits my head exactly as described in the sizing guide.',
    reply: null, repliedAt: null, flagged: false, photos: [],
  },
  {
    email: 'tunde.b@email.com', rating: 3, date: '2026-08-10',
    product: 'Embroidered Agbada Kaftan',
    body: 'The garment itself is beautiful but the sizing ran larger than the chart suggested. I had to have it taken in locally. Worth noting for anyone between sizes.',
    reply: null, repliedAt: null, flagged: false, photos: [],
  },
  {
    email: 'ngozi@email.com', rating: 2, date: '2026-08-05',
    product: 'Hand-tooled Pam Slippers — Tan',
    body: 'The stitching came loose on one slipper after a week of light wear. Disappointed given the price point. Customer service were responsive though.',
    reply: null, repliedAt: null, flagged: true, photos: [],
  },
  {
    email: 'kwame@email.com', rating: 5, date: '2026-07-30',
    product: 'Fìla Gòbì — Navy Aso-oke',
    body: 'Ordered a custom Filà and the result exceeded what I imagined. The Aso-oke weave is tight and the finish is immaculate. This is heirloom quality.',
    reply: null, repliedAt: null, flagged: false, photos: [],
  },
  {
    email: 'adaeze.obi@outlook.com', rating: 4, date: '2026-07-22',
    product: 'Ọjọ Ipele — Crimson Drape',
    body: 'Beautiful drape and the crimson is vivid without being loud. Took off one star only because the delivery estimate was optimistic.',
    reply: null, repliedAt: null, flagged: false, photos: [],
  },
];

export const CUSTOM_REQUESTS = [
  {
    reference: 'CR-2026-001', email: 'emeka.okafor@gmail.com',
    garmentType: '3-Piece Custom Agbada', status: 'NEW' as const,
    submittedAt: '2026-09-01', occasion: 'Traditional wedding ceremony', neededBy: '2026-12-14',
    fabricPreference: 'Aso-oke', colorPreference: 'Royal blue with gold embroidery',
    notes: 'Would like the cap to match the trouser fabric exactly.',
    measurements: [['Chest', '44"'], ['Waist', '38"'], ['Sleeve', '27"'], ['Length', '58"']],
    quotedPrice: null, estimatedCompletion: null, declineReason: null,
  },
  {
    reference: 'CR-2026-002', email: 'adaeze.obi@outlook.com',
    garmentType: "Bride's Aso-Oke Set (Gele, Ipele & Iro)", status: 'QUOTED' as const,
    submittedAt: '2026-08-30', occasion: 'Traditional engagement ceremony', neededBy: '2027-01-05',
    fabricPreference: 'Hand-woven Aso-oke', colorPreference: 'Ivory and gold',
    notes: 'Seven yards for the gele, please — I prefer sculptured folds.',
    measurements: [['Bust', '38"'], ['Waist', '32"'], ['Hip', '42"'], ['Gele yards', '7']],
    quotedPrice: 680, estimatedCompletion: '2026-12-15', declineReason: null,
  },
  {
    reference: 'CR-2026-003', email: 'f.adeyemi@business.com',
    garmentType: 'Tailored Senator Suit (2-piece)', status: 'APPROVED' as const,
    submittedAt: '2026-08-28', occasion: 'Corporate gala dinner', neededBy: '2026-11-28',
    fabricPreference: 'Cashmere blend', colorPreference: 'Charcoal',
    notes: 'Minimal embroidery — keep it understated.',
    measurements: [['Chest', '42"'], ['Waist', '36"'], ['Sleeve', '26"'], ['Trouser', '32"']],
    quotedPrice: 520, estimatedCompletion: '2026-11-10', declineReason: null,
  },
  {
    reference: 'CR-2026-004', email: 'chidi.n@email.com',
    garmentType: 'Hand-embroidered Agbada (Full Set)', status: 'IN_PRODUCTION' as const,
    submittedAt: '2026-08-25', occasion: 'New Year gala celebration', neededBy: '2026-12-26',
    fabricPreference: 'Guinea brocade', colorPreference: 'Emerald green',
    notes: 'Full chest and sleeve embroidery.',
    measurements: [['Chest', '46"'], ['Waist', '40"'], ['Sleeve', '28"'], ['Length', '60"']],
    quotedPrice: 890, estimatedCompletion: '2026-12-05', declineReason: null,
  },
  {
    reference: 'CR-2026-005', email: 'nnenna.okeke@gmail.com',
    garmentType: 'Custom Gele & Wrapper Set', status: 'COMPLETED' as const,
    submittedAt: '2026-08-10', occasion: 'Church thanksgiving & wedding reception', neededBy: '2026-08-24',
    fabricPreference: 'Damask', colorPreference: 'Teal and coral',
    notes: 'Delivered ahead of schedule.',
    measurements: [['Bust', '36"'], ['Waist', '30"'], ['Hip', '40"'], ['Gele yards', '5']],
    quotedPrice: 440, estimatedCompletion: '2026-08-20', declineReason: null,
  },
  {
    reference: 'CR-2026-006', email: 'tunde.b@email.com',
    garmentType: 'Embroidered Kaftan (Bespoke)', status: 'DECLINED' as const,
    submittedAt: '2026-08-05', occasion: 'Valentine dinner', neededBy: '2026-02-10',
    fabricPreference: 'Silk blend', colorPreference: 'Wine',
    notes: null,
    measurements: [['Chest', '40"'], ['Waist', '34"'], ['Sleeve', '25"']],
    quotedPrice: null, estimatedCompletion: null,
    declineReason: 'Requested date had already passed when the request arrived.',
  },
];

export const CONVERSATIONS = [
  {
    email: 'chiamaka@email.com', subject: 'Shipping update for my Gele set',
    tag: 'ORDER' as const, orderNumber: '#FTW-2891',
    unread: true, resolved: false, daysAgo: 0,
    messages: [
      ['CUSTOMER', "Hi! I placed order #FTW-2891 three days ago for a Gele set. Do you have a shipping update? I haven't received any tracking info yet."],
      ['STORE', "Hi Chiamaka! Your order is packed and ready to go — we're dispatching it today and you'll receive your tracking number by this evening. Thank you for your patience!"],
      ['CUSTOMER', 'Wonderful, thank you so much! Really looking forward to receiving it.'],
    ] as const,
  },
  {
    email: 'david@email.com', subject: 'Measurement correction — Custom Agbada',
    tag: 'CUSTOM_REQUEST' as const, orderNumber: null,
    unread: true, resolved: false, daysAgo: 1,
    messages: [
      ['CUSTOMER', 'Hello, I submitted a custom Agbada request but I think I put the wrong sleeve length. Can it still be corrected?'],
      ['STORE', "Yes of course! Your request is still in New status so no cutting has started. Just confirm the correct measurement and I'll update it straight away."],
      ['CUSTOMER', "That's a relief! The sleeve should be 28.5 inches, not 27. Really appreciate the flexibility."],
      ['STORE', "Updated — I have 28.5 inches noted on your request. We'll be in touch once the quote is ready. Looking forward to creating this for you!"],
    ] as const,
  },
  {
    email: 'ngozi@email.com', subject: 'Return policy question',
    tag: 'GENERAL' as const, orderNumber: null,
    unread: false, resolved: false, daysAgo: 4,
    messages: [
      ['CUSTOMER', "Hello! If I receive an item and the colour doesn't match what I see online, am I able to return it?"],
      ['STORE', "Hello Ngozi! Absolutely — we accept returns within 14 days for any item that doesn't match its listing. We provide a prepaid return label and process refunds within 5–7 business days of receiving the item back."],
    ] as const,
  },
  {
    email: 'kwame@email.com', subject: 'Delivery delay — Order #FTW-2869',
    tag: 'ORDER' as const, orderNumber: '#FTW-2869',
    unread: false, resolved: true, daysAgo: 6,
    messages: [
      ['CUSTOMER', "Hi, my order was supposed to arrive by now and I haven't received anything. Is everything okay?"],
      ['STORE', "Hi Kwame, I sincerely apologise for the delay. Your parcel was held at customs — it's now been cleared and is out for delivery. You should receive it tomorrow."],
      ['CUSTOMER', "Thank you for the quick update and explanation. I'll keep an eye out for it."],
      ['STORE', 'Of course! Please let me know once it arrives and confirm everything is in order.'],
    ] as const,
  },
  {
    email: 'temi@email.com', subject: 'Size guide — Gele headwrap',
    tag: 'GENERAL' as const, orderNumber: null,
    unread: false, resolved: false, daysAgo: 10,
    messages: [
      ['CUSTOMER', "I'm a bit confused by the size guide. What does 'yards' mean in terms of how much fabric comes with the gele?"],
      ['STORE', 'Great question! One yard is roughly 91cm. Our Standard size (5 yards) gives you about 4.5 metres of fabric — plenty for most styles. The Large (7 yards) is ideal if you prefer elaborate sculptured folds.'],
      ['CUSTOMER', "That's really helpful, thank you! I'll go with the Standard."],
    ] as const,
  },
];

/** Titles from src/data/products.ts that Adunola has saved. */
export const WISHLIST_TITLES = [
  'Gobi Filà Cap — Burgundy Velvet',
  'Embroidered Agbada Kaftan',
  'Adire Roundneck — Indigo',
  'Ọjọ Ipele — Crimson Drape',
];

/**
 * The console's order fixtures name products loosely ("Aso-Oke Cap") while the
 * catalogue uses full titles. Map the unambiguous ones so order items link to a
 * real product; anything genuinely bespoke or ambiguous stays unlinked, which
 * OrderItem.productId allows by design.
 */
export const PRODUCT_ALIASES: Record<string, string> = {
  'Aso-Oke Gele Set': 'Aso-oke Gele — Ivory & Gold Set',
  'Aso-Oke Cap': 'Fìla Gòbì — Navy Aso-oke',
  'Beaded Pam Slippers': 'Hand-tooled Pam Slippers — Tan',
  'Agbada 3-Piece Set': 'Embroidered Agbada Kaftan',
  'Embroidered Kaftan (Men)': 'Embroidered Agbada Kaftan',
  'Ipele Wrap (Silk Blend)': 'Ọjọ Ipele — Crimson Drape',
  'Leather Yoruba Shoes': 'Embossed Leather Oxford — Maroon',
  'Aso-Oke Trousers': 'Tailored Yoruba Trouser Set',
  'Adire Wrapper Set': 'Adire Ipele — Indigo Tie-Dye',
  'Ankara Roundneck Shirt': 'Batik Roundneck — Rust & Cream',
};
