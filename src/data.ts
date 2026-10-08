export type BrandId = 'sandburgs' | 'canteen' | 'diner';

export const brands = [
  {
    id: 'sandburgs' as const,
    name: 'Sandburgs',
    route: '/sandburgs/',
    logo: '/assets/logo-sandburgs.png',
    image: '/assets/hero-food.webp',
    originalImage: '/assets/sandburgs-food.webp',
    imageAlt: 'A gourmet burger, fries and iced coffee on a diner table',
    category: 'Gourmet burgers, sandwiches & shakes',
    description: 'Home-baked breads. Hand-cut patties. House-special sauces. A gourmet take on your everyday cravings.',
    headline: 'Made for your cravings.',
    story: 'Born as Sandburg Shakes at Baani Square in 2015, Sandburgs brings thoughtfully made burgers, sandwiches and shakes to the quick-service space. The breads, patties and sauces that started in the founders’ kitchen are still at the heart of the brand.',
    orderUrl: 'https://link.zomato.com/xqzv/crux4csk',
    instagram: 'https://www.instagram.com/sandburgs.in/',
    food: [
      { name: 'Burgers & sandwiches', image: '/assets/hero-food.webp', detail: 'Made to order, with home-baked breads and house-special sauces.' },
      { name: 'Fries & sides', image: '/assets/sandburgs-food.webp', detail: 'Classic American sides, made for sharing.' },
    ],
  },
  {
    id: 'canteen' as const,
    name: 'The Canteen Project',
    route: '/the-canteen-project/',
    logo: '/assets/logo-canteen.png',
    image: '/assets/canteen-concept.webp',
    originalImage: '/assets/canteen-food.webp',
    imageAlt: 'Golden bread rolls, chai and green chutney on a wooden table',
    category: 'Old-school comfort, served fresh',
    description: 'Chai breaks, bread pakora and home-style meals. All the comfort of your school and college canteen.',
    headline: 'A taste of the good days.',
    story: 'The Canteen Project began as a delivery kitchen in 2020, bringing back the comforting food of school and college days. From chai and bread pakora to rajma chawal and Maggi, the menu celebrates familiar favourites. Its first physical outlet opened in 2024.',
    orderUrl: 'https://link.zomato.com/xqzv/rshare?id=5161199730563d18',
    instagram: 'https://www.instagram.com/canteenproject.in/',
    food: [
      { name: 'Street-food favourites', image: '/assets/canteen-food.webp', detail: 'Familiar flavours, made for everyday comfort.' },
      { name: 'Chai & canteen classics', image: '/assets/canteen-concept.webp', detail: 'Hot chai and the snacks that take you back.' },
    ],
  },
  {
    id: 'diner' as const,
    name: 'Sandhouse All Day Diner',
    route: '/sandhouse/',
    logo: '/assets/logo-diner.png',
    image: '/assets/diner-venue.webp',
    originalImage: '/assets/diner-venue.webp',
    imageAlt: 'The welcoming indoor and outdoor setting at Sandhouse All Day Diner',
    category: 'An all-day place to come together',
    description: 'American comfort meets European charm. Good food, chilled drinks and a reason to stay a little longer.',
    headline: 'Stay a little longer.',
    story: 'Sandhouse opened at 32nd Avenue in 2018, growing from the love and support of Sandburgs’ regulars. Its indoor and outdoor setting brings together grills, pizzas, drinks and a welcoming neighbourhood atmosphere.',
    orderUrl: 'https://link.zomato.com/xqzv/rshare?id=828179553056312d',
    instagram: 'https://www.instagram.com/sandhouse.in/',
    food: [
      { name: 'Grills, pizzas & more', image: '/assets/diner-pizza-concept.webp', detail: 'American comfort meets European charm, from lunch to dinner.' },
      { name: 'Make yourself at home', image: '/assets/diner-moment-2.webp', detail: 'A welcoming setting, indoors and out.' },
    ],
  },
];

export type Brand = (typeof brands)[number];

export const locations: { id: string; brand: BrandId; name: string; city: string; address: string }[] = [
  { id: 'sb-baani', brand: 'sandburgs', name: 'Baani Square', city: 'Gurugram', address: 'G-28, Baani Square, Sector 50, Gurugram, Haryana 122018' },
  { id: 'sb-joy', brand: 'sandburgs', name: 'AIPL Joy Street', city: 'Gurugram', address: 'G 15-18, AIPL Joy Street, Sector 66, Gurugram, Haryana 122101' },
  { id: 'sb-court', brand: 'sandburgs', name: 'DLF City Court', city: 'Gurugram', address: 'Shop DCT 038, Ground Floor, DLF City Court, Sector 25A, Gurugram, Haryana 122002' },
  { id: 'sb-promenade', brand: 'sandburgs', name: 'DLF Promenade', city: 'New Delhi', address: 'Second Floor, Food Court, DLF Promenade Mall, New Delhi, Delhi 110070' },
  { id: 'sb-aerocity', brand: 'sandburgs', name: 'Aerocity', city: 'New Delhi', address: 'LG Level, Food Capital, Worldmark 1, Aerocity, New Delhi, Delhi 110037' },
  { id: 'sb-gk', brand: 'sandburgs', name: 'Greater Kailash', city: 'New Delhi', address: 'Shop 35, DDA Auto Shopping Complex, Zamrudpur, Greater Kailash I, New Delhi, Delhi 110048' },
  { id: 'sb-rajouri', brand: 'sandburgs', name: 'Rajouri Garden', city: 'New Delhi', address: 'E14, Shop 4, Rajouri Garden, New Delhi, Delhi 110027' },
  { id: 'sb-elante', brand: 'sandburgs', name: 'Nexus Elante', city: 'Chandigarh', address: 'Unit KT10, Third Floor, Nexus Elante Mall, Industrial Area Phase I, Chandigarh 160002' },
  { id: 'sb-jubilee', brand: 'sandburgs', name: 'Jubilee Walk', city: 'Mohali', address: 'Shop 12-13, Jubilee Walk, Himalaya Marg, Sector 70, Mohali, Punjab 160070' },
  { id: 'sb-dehradun', brand: 'sandburgs', name: 'Mall of Dehradun', city: 'Dehradun', address: 'FCC-01, Third Floor, Mall of Dehradun, Haridwar-Dehradun Road, Mohkampur, Dehradun, Uttarakhand 248005' },
  { id: 'tcp-baani', brand: 'canteen', name: 'Baani Square', city: 'Gurugram', address: 'G-28, Baani Square, Sector 50, Gurugram, Haryana 122018' },
  { id: 'tcp-court', brand: 'canteen', name: 'DLF City Court', city: 'Gurugram', address: 'Shop DCT 038, Ground Floor, DLF City Court, Sector 25A, Sikanderpur, Gurugram, Haryana 122002' },
  { id: 'tcp-bay', brand: 'canteen', name: 'Good Earth Business Bay', city: 'Gurugram', address: 'Good Earth Business Bay 1, Sector 58, Gurugram, Haryana 122102' },
  { id: 'tcp-gk', brand: 'canteen', name: 'Greater Kailash', city: 'New Delhi', address: 'Shop 4, 87/1, Auto Market Road, Zamrudpur, Greater Kailash, New Delhi, Delhi 110048' },
  { id: 'sh-avenue', brand: 'diner', name: '32nd Avenue', city: 'Gurugram', address: 'Unit 11, Ground Floor, 32nd Avenue, Galaxy Road, Sector 15, Gurugram, Haryana 122001' },
];

export const milestones = [
  { year: '2015', name: 'The first bite', text: 'Sandburg Shakes opens at Baani Square, Gurugram. Burgers, sandwiches and shakes bring people together.' },
  { year: '2018', name: 'A place to linger', text: 'Sandhouse opens at 32nd Avenue, with a wider menu and a welcoming indoor and outdoor setting.' },
  { year: '2020', name: 'Comfort comes home', text: 'The Canteen Project launches as a delivery kitchen, celebrating familiar food from school and college days.' },
  { year: '2024', name: 'From cloud to ground', text: 'The Canteen Project opens its first physical outlet, bringing the canteen atmosphere to life.' },
];

export const contact = {
  email: 'sandhousehospitality@gmail.com',
  address: 'Baani Square, Sector 50, Gurugram, Haryana 122018',
  hours: 'Monday to Sunday, 10 AM to 6 PM',
  source: 'https://sandhousehospitality.com/contact-us/',
};

export function directionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
