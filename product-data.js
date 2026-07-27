// product-data.js
// Central product catalog for Smart Choice 3D.
// Each product includes a real, publicly-embeddable Sketchfab 3D model (uid)
// used on the product detail page, plus a lightweight emoji+gradient thumbnail
// (c1/c2/emoji) used for fast-loading product cards.

var PRODUCTS = [

  // ---------------- Watches ----------------
  {
    id: 'wch-101', cat: 'Watches', sub: 'Analog',
    brand: 'Aurelia', name: 'Aurelia Classic Steel Chronograph',
    desc: 'Polished stainless steel case with a segmented bracelet and a crisp analog dial — an everyday classic.',
    price: 25017, old: 41697, rating: 4.6, reviews: 132,
    uid: '029a0b692d474e55ac29292fc30fb153',
    icon: 'watch', c1: '#6c5ce7', c2: '#a29bfe',
    colors: ['Silver', 'Black', 'Rose Gold'],
    img: 'images/wch-101-aimes-watch-for-men-sport-military-waterproof-chronograph-mens-watches-a.jfif'
  },
  {
    id: 'wch-102', cat: 'Watches', sub: 'Analog',
    brand: 'Nordane', name: 'Nordane Heritage Leather-Strap Watch',
    desc: 'A vintage-inspired timepiece with a genuine leather strap and warm brushed-metal case.',
    price: 18067, old: 27797, rating: 4.4, reviews: 87,
    uid: '6d475a42fe8e48c7866ea1a6ced18781',
    icon: 'watch', c1: '#e17055', c2: '#fab1a0',
    colors: ['Brown', 'Black'],
    img: 'images/wch-102-fossil-men-s-neutra-chronograph-brown-leather-strap-watch-44mm-macy-s.jfif'
  },
  {
    id: 'wch-103', cat: 'Watches', sub: 'Sports',
    brand: 'Voltrix', name: 'Voltrix Pro Sports Chronograph — Green Dial',
    desc: 'Built for movement: a vivid chronograph face, precision pushers, and a rugged sport case.',
    price: 33357, old: 50037, rating: 4.8, reviews: 201,
    uid: '693e3e5fc41b42c5af35bc965ab70014',
    icon: 'watch', c1: '#00b894', c2: '#55efc4',
    colors: ['Green', 'Black'],
    img: 'images/Carlington Men Analogue Watch.jfif'
  },
  {
    id: 'wch-104', cat: 'Watches', sub: 'Minimalist',
    brand: 'Lumen', name: 'Lumen Everyday Slim Wrist Watch',
    desc: 'Slim, clean, and understated — a lightweight minimalist watch for daily wear.',
    price: 11117, old: 16677, rating: 4.2, reviews: 54,
    uid: '223dfc06d8434d878571bbfdf8319a93',
    icon: 'watch', c1: '#0984e3', c2: '#74b9ff',
    colors: ['Black', 'White'],
    img: 'images/104638391332993798.jfif'
  },
  // ---------------- Sports & Outdoors ----------------
  {
    id: 'so-101', cat: 'Sports & Outdoors', sub: 'Racket Sports',
    brand: 'ProSwing', name: 'ProSwing Carbon-Fiber Tennis Racket',
    desc: 'Lightweight carbon-fiber frame tuned for fast swings and control on every shot.',
    price: 16677, old: 25017, rating: 4.6, reviews: 112,
    uid: '0825c82b87644a16a4852a40528b8c01',
    icon: 'tennis', c1: '#00b894', c2: '#55efc4',
    img: 'images/so-101-tennis-racket.jpg'
  },
  {
    id: 'so-102', cat: 'Sports & Outdoors', sub: 'Team Sports',
    brand: 'CourtKing', name: 'CourtKing Official Size Basketball',
    desc: 'Official size and weight with a grippy composite cover for indoor or outdoor courts.',
    price: 6947, old: 9727, rating: 4.7, reviews: 168,
    uid: 'eb172b5f4e544f428c2bcd8d3f067a91',
    icon: 'basketball', c1: '#e17055', c2: '#fdcb6e',
    img: 'images/Spalding Varsity TF-150 Indoor_Outdoor Basketball - 29_5_.jfif'
  },
  {
    id: 'so-103', cat: 'Sports & Outdoors', sub: 'Camping & Hiking',
    brand: 'TrailPeak', name: 'TrailPeak 40L Hiking Backpack',
    desc: 'A rugged 40-liter pack with padded straps and multiple compartments for long trails.',
    price: 20847, old: 30577, rating: 4.5, reviews: 84,
    uid: 'ffd0bd8f61034f17a90e41fe8f2da003',
    icon: 'backpack', c1: '#0984e3', c2: '#74b9ff',
    colors: ['Olive', 'Grey', 'Black'],
    img: 'images/so-103-wisport-zipperfox42-backpack-40l-hiking-walking-travel-tactical-olive-gre.jfif'
  },
  {
    id: 'so-104', cat: 'Sports & Outdoors', sub: 'Camping & Hiking',
    brand: 'TrailPeak', name: 'TrailPeak Everyday Daypack',
    desc: 'A compact everyday daypack built for city commutes and short hikes alike.',
    price: 12507, old: 18067, rating: 4.3, reviews: 47,
    uid: 'dd087558c1a24a9ea82d50d764ad4b78',
    icon: 'backpack', c1: '#6c5ce7', c2: '#a29bfe',
    colors: ['Black', 'Navy'],
    img: 'images/so-104-moyyi-waterproof-faux-leather-laptop-backpack-for-men-fits-15-6-inch-lapt.jfif'
  },

  // ---------------- Toys & Games ----------------
  {
    id: 'tg-101', cat: 'Toys & Games', sub: 'Plush Toys',
    brand: 'CuddleCo', name: 'CuddleCo Classic Plush Teddy Bear',
    desc: 'Ultra-soft plush bear with a friendly face — a cuddly companion for all ages.',
    price: 5001, old: 7781, rating: 4.8, reviews: 143,
    uid: 'dae9249342744328ad6da4182e6010f7',
    icon: 'teddybear', c1: '#e84393', c2: '#fd79a8',
    img: 'images/tg-101-tg-teddy-bear.png'
  },
  {
    id: 'tg-102', cat: 'Toys & Games', sub: 'Puzzles',
    brand: 'BrainSpin', name: 'BrainSpin Speed Cube 3x3 Puzzle',
    desc: 'A smooth, fast-turning speed cube designed for competitive solving and casual fun.',
    price: 2777, old: 4167, rating: 4.6, reviews: 210,
    uid: '9cadb66ed7f54f209e5c32656e7dbdc1',
    icon: 'cube', c1: '#00b894', c2: '#55efc4',
    img: 'images/tg-102-tg-rubiks-cube.png'
  },
  {
    id: 'tg-103', cat: 'Toys & Games', sub: 'Vehicles',
    brand: 'ZoomWorks', name: 'ZoomWorks Die-Cast Toy Car',
    desc: 'A detailed die-cast model car with rolling wheels and durable finish for hours of play.',
    price: 3611, old: 5557, rating: 4.4, reviews: 66,
    uid: 'df7a2cf58a3349969844b0d4f1730437',
    icon: 'car', c1: '#0984e3', c2: '#74b9ff',
    img: 'images/tg-103-ZoomWorks Die-Cast Toy Car..jfif'
  },
  {
    id: 'tg-104', cat: 'Toys & Games', sub: 'Vehicles',
    brand: 'ZoomWorks', name: 'ZoomWorks Remote Control Racer',
    desc: 'A fast RC racer with responsive steering — built for backyard races and tight turns.',
    price: 9727, old: 13897, rating: 4.5, reviews: 92,
    uid: '4bd19f180b654d629ff729809cbb8a7a',
    icon: 'car', c1: '#e17055', c2: '#fab1a0',
    img: 'images/tg-103-ZoomWorks Die-Cast Toy Car.png'
  },
// ==================================================================
// Additional catalog items (auto-added from the Sketchfab 3D model
// library). Prices/ratings are placeholders — real product photos
// (image/c1/c2) to be added later.
// ==================================================================
  
  
  
  
  
  
  
  
  {
    id: 'ftw-101', cat: 'Footwear', sub: 'Sneakers',
    brand: 'Taohid Animation', name: 'Shoe Model | Realistic 3D Sneaker',
    desc: 'A detailed 3D model of the shoe model | realistic 3d sneaker — rotate and inspect it from every angle before you buy.',
    price: 10406, old: 13269, rating: 4.8, reviews: 174,
    uid: '9a0bbbb955384ac68486c6cb3768ccb3',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/ftw-101-realistic-3d-sneaker.png'
  },
  {
    id: 'ftw-102', cat: 'Footwear', sub: 'Casual Shoes',
    brand: '3dbysam', name: 'Stylized Shoes',
    desc: 'A detailed 3D model of the stylized shoes — rotate and inspect it from every angle before you buy.',
    price: 15421, old: 22476, rating: 4.9, reviews: 48,
    uid: '4cdc52c8aace4903b3da59914242d884',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/ftw-102-stylized-shoes.png'
  },
  {
    id: 'ftw-103', cat: 'Footwear', sub: 'Sneakers',
    brand: 'dilium', name: 'Sneakers',
    desc: 'A detailed 3D model of the sneakers — rotate and inspect it from every angle before you buy.',
    price: 23969, old: 29093, rating: 4.5, reviews: 114,
    uid: '056f33b051e74a838edd4e7831d07d00',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/ftw-103-replay-polys-sneakers-laag-black.jfif'
  },
  {
    id: 'ftw-104', cat: 'Footwear', sub: 'Casual Shoes',
    brand: 'James', name: 'Vans Shoe',
    desc: 'A detailed 3D model of the vans shoe — rotate and inspect it from every angle before you buy.',
    price: 5427, old: 6755, rating: 4.5, reviews: 145,
    uid: '1585e5837d034631a748d1a86a846782',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/ftw-104-vans-shoe.png'
  },
  {
    id: 'ftw-105', cat: 'Footwear', sub: 'Casual Shoes',
    brand: 'ThimovanNimwegen', name: 'Low-poly Shoe',
    desc: 'A detailed 3D model of the low-poly shoe — rotate and inspect it from every angle before you buy.',
    price: 52320, old: 64763, rating: 4.3, reviews: 238,
    uid: 'a219ab637f1b4889b376eb96187223f2',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/ftw-105-men-s-non-slip-embossed-letterprint-color-block-lace-up-sport-sneakers-o.jfif'
  },
  {
    id: 'ftw-106', cat: 'Footwear', sub: 'Casual Shoes',
    brand: 'AlexiaCarmona', name: 'Cartoon Shoes',
    desc: 'A detailed 3D model of the cartoon shoes — rotate and inspect it from every angle before you buy.',
    price: 13433, old: 18228, rating: 4.5, reviews: 109,
    uid: '0289dbe9d0f4403ea560f0d1db83aff5',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/ftw-106-cartoon-shoes.png'
  },
  {
    id: 'ftw-107', cat: 'Footwear', sub: 'Casual Shoes',
    brand: 'nguyenthiutminh0402', name: 'Leather Shoes',
    desc: 'A detailed 3D model of the leather shoes — rotate and inspect it from every angle before you buy.',
    price: 40065, old: 56245, rating: 4.8, reviews: 147,
    uid: 'da863f86820e44d0b6813a4a6344ad7c',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/ftw-107-leather-shoes.png'
  },
  {
    id: 'ftw-108', cat: 'Footwear', sub: 'Casual Shoes',
    brand: 'rajprajapat847', name: 'Men\'s Formal Shoes – Realistic',
    desc: 'A detailed 3D model of the men\'s formal shoes – realistic — rotate and inspect it from every angle before you buy.',
    price: 15568, old: 21506, rating: 4.3, reviews: 49,
    uid: '835da46bb8bb418687ceb4cd6531f65f',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/ftw-108-mens-formal-shoes.png'
  },
  {
    id: 'ftw-109', cat: 'Footwear', sub: 'Boots',
    brand: 'Toxic', name: 'High Heel Boots',
    desc: 'A detailed 3D model of the high heel boots — rotate and inspect it from every angle before you buy.',
    price: 48138, old: 71846, rating: 4.4, reviews: 63,
    uid: '99c8cc9c1f3d4b97bbca725d74a02dba',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/ftw-109-high-heel-boots.png'
  },
  {
    id: 'ftw-110', cat: 'Footwear', sub: 'Boots',
    brand: 'DailyArt', name: 'Military Boots',
    desc: 'A detailed 3D model of the military boots — rotate and inspect it from every angle before you buy.',
    price: 44272, old: 54335, rating: 4.5, reviews: 129,
    uid: '3e2dc40ef268419092f6c3044dc6443f',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/ftw-110-military-boots.png'
  },
  {
    id: 'ftw-111', cat: 'Footwear', sub: 'Boots',
    brand: 'Safina Irani', name: 'Cartoon Shoes/Boots',
    desc: 'A detailed 3D model of the cartoon shoes/boots — rotate and inspect it from every angle before you buy.',
    price: 23911, old: 31845, rating: 4.4, reviews: 36,
    uid: '645923d461284000a3d0aac033f962dd',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/ftw-111-cartoon-shoes-boots.png'
  },
  {
    id: 'lap-101', cat: 'Laptops & PCs', sub: 'Laptops',
    brand: 'Apple User', name: 'MacBook Pro 14-inch M5',
    desc: 'A detailed 3D model of the macbook pro 14-inch m5 — rotate and inspect it from every angle before you buy.',
    price: 539999, old: 599999, rating: 4.7, reviews: 90,
    uid: '652a992f4f244122ae251f9cbb81da1e',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/Macbook Pro 13 inch 2020.jpg'
  },
  {
    id: 'lap-102', cat: 'Laptops & PCs', sub: 'Laptops',
    brand: 'rtql8d', name: 'MacBook Air M2',
    desc: 'A detailed 3D model of the macbook air m2 — rotate and inspect it from every angle before you buy.',
    price: 279999, old: 319999, rating: 4.3, reviews: 156,
    uid: '786fa23d402a4f90ae36c4168997f9cc',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/lap-102-macbook-air-m2-midnight-mockup-laptop-screen-mockup.jfif'
  },
  {
    id: 'lap-103', cat: 'Laptops & PCs', sub: 'Laptops',
    brand: 'jackbaeten', name: 'MacBook Pro M3 16 inch 2024',
    desc: 'A detailed 3D model of the macbook pro m3 16 inch 2024 — rotate and inspect it from every angle before you buy.',
    price: 679999, old: 749999, rating: 4.7, reviews: 206,
    uid: '8e34fc2b303144f78490007d91ff57c4',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/lap-103-macbook-pro-16-m3.jpg'
  },
  {
    id: 'lap-104', cat: 'Laptops & PCs', sub: 'Laptops',
    brand: 'timblewee', name: 'Macbook Pro 13 inch 2020',
    desc: 'A detailed 3D model of the macbook pro 13 inch 2020 — rotate and inspect it from every angle before you buy.',
    price: 159999, old: 189999, rating: 4.2, reviews: 95,
    uid: 'efab224280fd4c3993c808107f7c0b38',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/lap-104-macbook-pro-13-2020.jpg'
  },
  {
    id: 'lap-105', cat: 'Laptops & PCs', sub: 'Laptops',
    brand: 'Andrey3Dev', name: 'Apple MacBook Pro (Low Poly)',
    desc: 'A detailed 3D model of the apple macbook pro (low poly) — rotate and inspect it from every angle before you buy.',
    price: 479999, old: 539999, rating: 4.5, reviews: 246,
    uid: 'eddf60ccdaba497c9e256e64bd0946d9',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/lap-105-macbook-pro-case.jpg'
  },
  {
    id: 'lap-106', cat: 'Laptops & PCs', sub: 'Retro PCs',
    brand: 'Kesenkai', name: 'Macintosh (Retro PC)',
    desc: 'A detailed 3D model of the macintosh (retro pc) — rotate and inspect it from every angle before you buy.',
    price: 189999, old: 229999, rating: 4.4, reviews: 139,
    uid: '1e562527b68e4bd88ed3f679b86be208',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/lap-106-macintosh-128k.jpg'
  },
  {
    id: 'elc-101', cat: 'Electronics', sub: 'Wearables',
    brand: '_tegarma', name: 'Smartwatch',
    desc: 'A detailed 3D model of the smartwatch — rotate and inspect it from every angle before you buy.',
    price: 41283, old: 57371, rating: 4.4, reviews: 140,
    uid: '8a0964b8451b40f09b7cb377058f9d3c',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/elc-101-amazfit-bip-3-smart-watch-for-android-iphone.jfif'
  },
  {
    id: 'elc-102', cat: 'Electronics', sub: 'Wearables',
    brand: 'Jonathan Comonal', name: 'Smart Watch',
    desc: 'A detailed 3D model of the smart watch — rotate and inspect it from every angle before you buy.',
    price: 47649, old: 70317, rating: 4.4, reviews: 122,
    uid: '4c7bd5c621924bcab225dc41e71232fe',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/HUAWEI Band 10 Smart Watch – Pink__⌚ HUAWEI Band….jfif'
  },
  {
    id: 'elc-103', cat: 'Electronics', sub: 'Audio',
    brand: 'Randomewe', name: 'Headphones',
    desc: 'A detailed 3D model of the headphones — rotate and inspect it from every angle before you buy.',
    price: 32223, old: 45434, rating: 4.6, reviews: 163,
    uid: '8aa63e51bdbd46d58c5ad8496271bbe7',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/elc-103-beribes-wireless-bluetooth-over-ear-headphones-with-mic.jfif'
  },
  {
    id: 'elc-104', cat: 'Electronics', sub: 'Audio',
    brand: 'MetaCreators', name: 'Wireless Earbuds',
    desc: 'A detailed 3D model of the wireless earbuds — rotate and inspect it from every angle before you buy.',
    price: 4184, old: 5457, rating: 4.5, reviews: 100,
    uid: '91442058258546089c79b2a517a540c6',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/elc-104-wireless-earbuds-2026-bluetooth-5-4-earphones-in-ear-3d-stereo-bluetooth.jfif'
  },
  {
    id: 'elc-105', cat: 'Electronics', sub: 'Audio',
    brand: 'Valerij Dančenko', name: 'Headphones (Realistic)',
    desc: 'A detailed 3D model of the headphones (realistic) — rotate and inspect it from every angle before you buy.',
    price: 27277, old: 34369, rating: 4.5, reviews: 122,
    uid: '890b4a37daf2441b86e5470c73df2af1',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/elc-105-bluetooth-headphones-over-ear-60-hours-playtime-foldable-headphones-wire.jfif'
  },
  {
    id: 'elc-106', cat: 'Electronics', sub: 'Computer Peripherals',
    brand: 'stratt3000', name: 'Basic PC Monitor',
    desc: 'A detailed 3D model of the basic pc monitor — rotate and inspect it from every angle before you buy.',
    price: 45253, old: 57485, rating: 4.6, reviews: 109,
    uid: '6ab2bc870fb140fe898e2da3255e0fcd',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/elc-106-nzxt-launches-canvas-qhd-displays.jfif'
  },
  {
    id: 'elc-107', cat: 'Electronics', sub: 'Computer Peripherals',
    brand: 'James.Harness', name: 'CRT Monitor',
    desc: 'A detailed 3D model of the crt monitor — rotate and inspect it from every angle before you buy.',
    price: 33960, old: 49195, rating: 4.8, reviews: 206,
    uid: 'e2dd2887a8904e4fa3d5a32e2935adb9',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/elc-107-crt-monitor-samtron-56v-15.jfif'
  },
  {
    id: 'elc-108', cat: 'Electronics', sub: 'Audio',
    brand: 'GeniusPilot2016', name: 'Bluetooth Speaker',
    desc: 'A detailed 3D model of the bluetooth speaker — rotate and inspect it from every angle before you buy.',
    price: 12288, old: 16902, rating: 4.7, reviews: 106,
    uid: '99e0812278654bbb8a5af69a61c3594c',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/elc-108-gallickan-bluetooth-speaker-wireless-portable-speaker-with-lights-ip67-w.jpg'
  },
  {
    id: 'elc-109', cat: 'Electronics', sub: 'Audio',
    brand: 'kathir95', name: 'JBL Speaker',
    desc: 'A detailed 3D model of the jbl speaker — rotate and inspect it from every angle before you buy.',
    price: 149999, old: 179999, rating: 4.9, reviews: 213,
    uid: 'b5d3236bf40e49cd8ab8b995bfd36168',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/elc-109-jbl-boombox-3-wi-fi-bluetooth-speaker-dolby-atmos-24h-playtime-waterproo.jfif'
  },
  {
    id: 'elc-110', cat: 'Electronics', sub: 'Audio',
    brand: 'Windshear_3D', name: 'Marshall Bluetooth Speaker',
    desc: 'A detailed 3D model of the marshall bluetooth speaker — rotate and inspect it from every angle before you buy.',
    price: 28999, old: 35999, rating: 4.5, reviews: 220,
    uid: 'c48aa0cc75394a07b5d9a718e23156b8',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/Marshall Willen II Bluetooth speakers - Black.jfif'
  },
  {
    id: 'elc-111', cat: 'Electronics', sub: 'Computer Peripherals',
    brand: 'gorzi', name: 'Mouse and Keyboard',
    desc: 'A detailed 3D model of the mouse and keyboard — rotate and inspect it from every angle before you buy.',
    price: 48783, old: 63073, rating: 4.3, reviews: 79,
    uid: 'c63ee81b71ff45b68a778101b4df3d46',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/elc-111-wired-keyboard-and-mouse-combo-full-sized-ergonomic-computer-keyboard-an.jfif'
  },
  {
    id: 'elc-112', cat: 'Electronics', sub: 'Computer Peripherals',
    brand: 'RMrando', name: 'Gaming Mechanical Keyboard & Mouse',
    desc: 'A detailed 3D model of the gaming mechanical keyboard & mouse — rotate and inspect it from every angle before you buy.',
    price: 33471, old: 49790, rating: 4.4, reviews: 38,
    uid: 'd91b625d38a64ed39c1dfaef28e588d7',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/elc-112-redragon-s117-gaming-keyboard-mouse-combo.jfif'
  },
  {
    id: 'elc-113', cat: 'Electronics', sub: 'Computer Peripherals',
    brand: 'Flexryhe', name: 'Mechanical Keyboard',
    desc: 'A detailed 3D model of the mechanical keyboard — rotate and inspect it from every angle before you buy.',
    price: 12343, old: 17645, rating: 4.2, reviews: 106,
    uid: '95d050e7a5954ff6ac7fbe4ac5301b3c',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/elc-113-fine-tune-your-desk-aesthetic-the-lofree-touch.jfif'
  },
  {
    id: 'elc-114', cat: 'Electronics', sub: 'Computer Peripherals',
    brand: 'Venyy', name: 'Gaming Keyboard',
    desc: 'A detailed 3D model of the gaming keyboard — rotate and inspect it from every angle before you buy.',
    price: 52662, old: 75838, rating: 4.2, reviews: 97,
    uid: '2e9270a8f4684a32a983bbd0b1e9425d',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/elc-114-amazon-fr-clavier-gamer-informatique.jfif'
  },
  {
    id: 'hk-101', cat: 'Home & Kitchen', sub: 'Kitchenware & Utensils',
    brand: 'Simal Mai', name: 'Kitchen Utensils',
    desc: 'A detailed 3D model of the kitchen utensils — rotate and inspect it from every angle before you buy.',
    price: 52642, old: 63523, rating: 4.3, reviews: 197,
    uid: '3ba85ef43cfc48508e43bd1d6c052295',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/hk-101-stylish-cooking-utensils-set-with-spatula.jfif'
  },
  {
    id: 'hk-102', cat: 'Home & Kitchen', sub: 'Kitchenware & Utensils',
    brand: 'Studio 23', name: 'Low Poly Set of Kitchen Utensils',
    desc: 'A detailed 3D model of the low poly set of kitchen utensils — rotate and inspect it from every angle before you buy.',
    price: 39373, old: 52892, rating: 4.5, reviews: 93,
    uid: '502a9dbfaad84ed09b73acd205032293',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/hk-102-say-goodbye-to-scratched-pans-the-ultimate-wooden-utensil-set.jfif'
  },
  {
    id: 'hk-103', cat: 'Home & Kitchen', sub: 'Kitchen Design Sets',
    brand: 'Kiem Truong', name: 'Kitchen Design Set V.001',
    desc: 'A detailed 3D model of the kitchen design set v.001 — rotate and inspect it from every angle before you buy.',
    price: 14973, old: 22423, rating: 4.3, reviews: 121,
    uid: '47e74e0fab8f43a1b88cbfc0d7f9989f',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/hk-103-25-kitchen-design-ideas-for-2026-no-one-shows-yet.jfif'
  },
  {
    id: 'hk-104', cat: 'Home & Kitchen', sub: 'Kitchen Design Sets',
    brand: 'Visthétique', name: 'Modern Kitchen',
    desc: 'A detailed 3D model of the modern kitchen — rotate and inspect it from every angle before you buy.',
    price: 19899, old: 26935, rating: 4.2, reviews: 120,
    uid: '82c35500aec347d2938ff7943900486f',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/hk-104-modern-kitchen-3d-model-buy-download-3dbrute.jfif'
  },
  {
    id: 'hk-105', cat: 'Home & Kitchen', sub: 'Kitchen Design Sets',
    brand: 'Nicolai Kilstrup', name: 'Kitchen Appliances',
    desc: 'A detailed 3D model of the kitchen appliances — rotate and inspect it from every angle before you buy.',
    price: 57226, old: 78460, rating: 4.2, reviews: 114,
    uid: '0b01a398fe1649aaacd6ebdf85bf5d6c',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/hk-105-kori-kate-eliz-s-drew-barrymore-kitchen-product-set-on-ltk.jfif'
  },
  {
    id: 'hk-106', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'extrin6 3D', name: 'Toaster',
    desc: 'A detailed 3D model of the toaster — rotate and inspect it from every angle before you buy.',
    price: 8915, old: 11003, rating: 4.6, reviews: 72,
    uid: '4bdbc9222a854384b2b3df3a6e8c67c8',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/hk-106-toastmaster-2-slice-cool-touch-toaster-walmart-com.jfif'
  },
  {
    id: 'hk-107', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'The Fresh Lab', name: 'Smeg Toaster (Retro)',
    desc: 'A detailed 3D model of the smeg toaster (retro) — rotate and inspect it from every angle before you buy.',
    price: 94999, old: 114999, rating: 4.7, reviews: 87,
    uid: '646838d76f204c83ae952e049f2948b1',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/hk-107-smeg-2-slice-toaster-jade.jfif'
  },
  {
    id: 'hk-108', cat: 'Home & Kitchen', sub: 'Kitchenware & Utensils',
    brand: 'Amythyst Willis', name: 'Dinner Plate',
    desc: 'A detailed 3D model of the dinner plate — rotate and inspect it from every angle before you buy.',
    price: 26724, old: 39265, rating: 4.7, reviews: 228,
    uid: 'af457c01e0994a3bb1c5f7de0876a122',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/hk-108-apilco-tuileries-all-white-dinner-plate-11-3-4-china-dinnerware.jfif'
  },
  {
    id: 'hk-109', cat: 'Home & Kitchen', sub: 'Kitchenware & Utensils',
    brand: 'sterost', name: 'White Ceramic Plate',
    desc: 'A detailed 3D model of the white ceramic plate — rotate and inspect it from every angle before you buy.',
    price: 35854, old: 50118, rating: 4.8, reviews: 36,
    uid: '4036111d2c5c47bab2320202d5e9a2a4',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/hk-109-white-dinner-plates-set-of-6-10-inch-ceramic-plates-white-porcelain-dinne.jfif'
  },
  {
    id: 'hk-110', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'lagesnpiet', name: 'Refrigerator (Old Worn Fridge)',
    desc: 'A detailed 3D model of the refrigerator (old worn fridge) — rotate and inspect it from every angle before you buy.',
    price: 60707, old: 77481, rating: 4.3, reviews: 72,
    uid: 'c383302237e140668e0a52a9df1a10de',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/GM.jfif'
  },
  {
    id: 'hk-111', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'dylanheyes', name: 'Retro Fridge',
    desc: 'A detailed 3D model of the retro fridge — rotate and inspect it from every angle before you buy.',
    price: 43179, old: 57577, rating: 4.6, reviews: 175,
    uid: '3b130f0ba4304966a101c82be2429cc7',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/hk-111-retro-style-fridge-3d-model.jfif'
  },
  {
    id: 'hk-112', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'Fantom Matter', name: 'Microwave Oven',
    desc: 'A detailed 3D model of the microwave oven — rotate and inspect it from every angle before you buy.',
    price: 12496, old: 17306, rating: 4.6, reviews: 89,
    uid: '5af99db17fb645bba7e55ace9e7b6b34',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/kori_kate_elizs Drew Barrymore Kitchen … Product Set on LTK.jfif'
  },
  {
    id: 'hk-113', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'lutz_westerfeld', name: 'Oven, Microwave and Winecooler Set',
    desc: 'A detailed 3D model of the oven, microwave and winecooler set — rotate and inspect it from every angle before you buy.',
    price: 48633, old: 71529, rating: 4.8, reviews: 107,
    uid: '60ffe27b68dd4f9cb9f79b7b61350311',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/MyAppliances MOPK5 Built-in Oven & Combi Microwave Pack.jfif'
  },
  {
    id: 'hk-114', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'KodaWowo', name: 'Basic Fridge',
    desc: 'A detailed 3D model of the basic fridge — rotate and inspect it from every angle before you buy.',
    price: 12390, old: 15599, rating: 4.7, reviews: 233,
    uid: 'fb12b0c08a974b2fb9af7608772d9ea0',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/hk-114-black-decker-16-4-cu-ft.jpg'
  },
  {
    id: 'hk-115', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'Cusimax', name: 'Cusimax Sleek 4-Slice Toaster — Stainless Steel',
    desc: 'A sleek 4-slice toaster in black stainless steel with an ultra-clear LED display, dual control panels, cancel and defrost/bagel settings.',
    price: 17999, old: 22999, rating: 4.6, reviews: 118,
    uid: '4bdbc9222a854384b2b3df3a6e8c67c8',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/hk-115-cusimax-toaster.jfif',
    colors: ['Black/Stainless']
  },
  {
    id: 'hk-116', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'Comfee', name: 'Comfee 700W 20L White Microwave Oven',
    desc: 'A compact 700W, 20-liter microwave with 5 cooking power levels, quick-set buttons, and a clean white finish.',
    price: 21999, old: 26999, rating: 4.5, reviews: 96,
    uid: '5af99db17fb645bba7e55ace9e7b6b34',
    c1: '#dfe6e9', c2: '#ffffff',
    img: 'images/hk-116-comfee-microwave.jfif',
    colors: ['White']
  },
  {
    id: 'hk-117', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'Smeg', name: 'Smeg 2-Slice Toaster — Pastel Green',
    desc: 'Smeg\'s retro-styled 2-slice toaster in a soft pastel green, with chrome accents and a defrost/reheat function.',
    price: 94999, old: 114999, rating: 4.8, reviews: 154,
    uid: '646838d76f204c83ae952e049f2948b1',
    c1: '#a2d9ce', c2: '#dff5ec',
    img: 'images/hk-117-smeg-toaster-pastel-green.jfif',
    colors: ['Pastel Green', 'Jade', 'Sage']
  },
  {
    id: 'hk-118', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'Smeg', name: 'Smeg 2-Slice Toaster — Jade',
    desc: 'A vibrant jade-green take on Smeg\'s classic retro toaster, featuring polished chrome details and smooth-glide levers.',
    price: 94999, old: 114999, rating: 4.7, reviews: 88,
    uid: '646838d76f204c83ae952e049f2948b1',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/hk-118-smeg-toaster-jade.jfif',
    colors: ['Jade', 'Pastel Green', 'Sage']
  },
  {
    id: 'hk-119', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'Smeg', name: 'Smeg 2-Slice Toaster — Sage Green',
    desc: 'A matte sage-green finish on Smeg\'s iconic 2-slice toaster silhouette, blending vintage style with modern finish.',
    price: 97999, old: 117999, rating: 4.8, reviews: 61,
    uid: '646838d76f204c83ae952e049f2948b1',
    c1: '#6c8f7d', c2: '#a9c4b6',
    img: 'images/hk-119-smeg-toaster-sage.jfif',
    colors: ['Sage Green', 'Jade', 'Pastel Green']
  },
  {
    id: 'hk-120', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'LG', name: 'LG GL-C652HLCM Top Freezer Refrigerator',
    desc: 'A spacious top-freezer refrigerator with LG\'s Smart Inverter Compressor for efficient, long-lasting cooling.',
    price: 179999, old: 219999, rating: 4.6, reviews: 142,
    uid: 'c383302237e140668e0a52a9df1a10de',
    c1: '#95a5a6', c2: '#dcdde1',
    img: 'images/hk-120-lg-fridge.jfif',
    colors: ['Stainless Silver']
  },
  {
    id: 'hk-121', cat: 'Home & Kitchen', sub: 'Kitchen Appliances',
    brand: 'Big Chill', name: 'Big Chill Retro Top Freezer Refrigerator — White',
    desc: 'A retro-styled top-freezer refrigerator with rounded corners, chrome handles, and a clean vintage white finish.',
    price: 899999, old: 999999, rating: 4.9, reviews: 34,
    uid: '3b130f0ba4304966a101c82be2429cc7',
    c1: '#f5f6fa', c2: '#dcdde1',
    img: 'images/hk-121-bigchill-fridge.jfif',
    colors: ['White']
  },
  {
    id: 'fur-101', cat: 'Furniture', sub: 'Seating',
    brand: 'Seyed Mohsen', name: 'Wooden Table and Chair',
    desc: 'A detailed 3D model of the wooden table and chair — rotate and inspect it from every angle before you buy.',
    price: 22179, old: 29696, rating: 4.8, reviews: 222,
    uid: '34a2e47e193443d6bfd23ce1123c03ea',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/fur-101-6-person-wooden-table-and-chair-set-plan-pdf.jfif'
  },
  {
    id: 'fur-102', cat: 'Furniture', sub: 'Living Room',
    brand: 'Blaž Mraz', name: 'Couch/Sofa Set',
    desc: 'A detailed 3D model of the couch/sofa set — rotate and inspect it from every angle before you buy.',
    price: 59258, old: 80281, rating: 4.9, reviews: 51,
    uid: 'f3622d9edcc94f1aa4b0bd95f1d5cda2',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/fur-102-voua-venetian-style-83-5-in-w-casual-dark-grey-6-seater-sectional-with-s.jfif'
  },
  {
    id: 'fur-103', cat: 'Furniture', sub: 'Living Room',
    brand: 'PolyCraftSutdios', name: 'Sofa (Free Version)',
    desc: 'A detailed 3D model of the sofa (free version) — rotate and inspect it from every angle before you buy.',
    price: 60604, old: 87078, rating: 4.7, reviews: 47,
    uid: 'a3a2d5a0c5bc416185e913d446afe9aa',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/G Plan Seattle 3 Seater Fixed Sofa in P220 Capri Chalk Cover_ Leather.jfif'
  },
  {
    id: 'fur-104', cat: 'Furniture', sub: 'Living Room',
    brand: 'Unknown Space', name: 'L Shape Sofa',
    desc: 'A detailed 3D model of the l shape sofa — rotate and inspect it from every angle before you buy.',
    price: 28209, old: 36093, rating: 4.6, reviews: 220,
    uid: '5e53c1a3a3be49369222cc67da20c7cb',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/fur-104-voua-venetian-style-83-5-in-w-casual-dark-grey-6-seater-sectional-with-s.jfif'
  },
  {
    id: 'fur-105', cat: 'Furniture', sub: 'Seating',
    brand: 'CuongNguyen_Owen', name: 'Cafe Chair',
    desc: 'A detailed 3D model of the cafe chair — rotate and inspect it from every angle before you buy.',
    price: 19696, old: 26035, rating: 4.8, reviews: 28,
    uid: '95a4433371aa415c86e5c0d61e464747',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/fur-105-dining-chairs.jfif'
  },
  {
    id: 'fur-106', cat: 'Furniture', sub: 'Storage',
    brand: 'gchandan868', name: 'Bookshelf',
    desc: 'A detailed 3D model of the bookshelf — rotate and inspect it from every angle before you buy.',
    price: 17795, old: 22265, rating: 4.2, reviews: 221,
    uid: 'fe7211e546cd46e396a04c010eaa82a1',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/fur-106-modern-white-bookshelf-decor-idea-elegant-living-room-storage.jfif'
  },
  {
    id: 'fur-107', cat: 'Furniture', sub: 'Storage',
    brand: 'Brandon Westlake', name: 'Dusty Old Bookshelf (Free)',
    desc: 'A detailed 3D model of the dusty old bookshelf (free) — rotate and inspect it from every angle before you buy.',
    price: 26457, old: 35398, rating: 4.6, reviews: 67,
    uid: '6c5ac2547db34c3c81b2e4808b000386',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/fur-107-small-space-antique-bookshelf-ideas.jfif'
  },
  {
    id: 'fur-108', cat: 'Furniture', sub: 'Tables',
    brand: 'Igrium', name: 'Coffee Table',
    desc: 'A detailed 3D model of the coffee table — rotate and inspect it from every angle before you buy.',
    price: 43738, old: 54569, rating: 4.7, reviews: 83,
    uid: 'b05e9ed43d7346dc84651b59976fd49f',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/fur-108-east-urban-home-carrole-4-legs-coffee-table-w-storage-brown-18-5-x-40-9-.jpg'
  },
  {
    id: 'fur-109', cat: 'Furniture', sub: 'Tables',
    brand: 'Jacob Smith', name: 'Retro Wood Coffee Table',
    desc: 'A detailed 3D model of the retro wood coffee table — rotate and inspect it from every angle before you buy.',
    price: 25940, old: 31497, rating: 4.8, reviews: 176,
    uid: '9d0efa7907c1455eb49ee956d9634a11',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/fur-109-east-urban-home-carrole-4-legs-coffee-table-w-storage-brown-18-5-x-40-9-.jpg'
  },
  {
    id: 'fur-110', cat: 'Furniture', sub: 'Storage',
    brand: 'Okapiguy', name: 'Victorian Bookshelf',
    desc: 'A detailed 3D model of the victorian bookshelf — rotate and inspect it from every angle before you buy.',
    price: 36993, old: 46276, rating: 4.4, reviews: 184,
    uid: '9f548046646f404782b8838ec14932f8',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/fur-110-traditional-home-decor-ornate-carved-wood-furniture-bookshelf-styling-id.jfif'
  },
  {
    id: 'fur-111', cat: 'Furniture', sub: 'Storage',
    brand: 'zeroual.elmehdi', name: 'Luxury Wardrobe Closet',
    desc: 'A detailed 3D model of the luxury wardrobe closet — rotate and inspect it from every angle before you buy.',
    price: 18718, old: 25804, rating: 4.5, reviews: 32,
    uid: '57f348196dba448ca26fe80148efbb5b',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/fur-111-amazon-closet-decor-must-haves-for-organized-homes-discover-amazon-close.jfif'
  },
  {
    id: 'fur-112', cat: 'Furniture', sub: 'Storage',
    brand: 'oxxycodone', name: 'Wardrobe with Sliding Doors',
    desc: 'A detailed 3D model of the wardrobe with sliding doors — rotate and inspect it from every angle before you buy.',
    price: 58633, old: 79091, rating: 4.7, reviews: 163,
    uid: 'ee9ef45dc15f471f9e8cd542596e60f4',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/fur-112-sliding-door-wardrobe-solutions-22-built-in-wardrobe-ideas-for-clutter-f.jfif'
  },
  {
    id: 'fur-113', cat: 'Furniture', sub: 'Storage',
    brand: 'Lehmann007', name: 'Closet – Wardrobe and Vanity Set',
    desc: 'A detailed 3D model of the closet – wardrobe and vanity set — rotate and inspect it from every angle before you buy.',
    price: 6925, old: 8446, rating: 4.6, reviews: 83,
    uid: 'eb0f252c48814fc2ac0d9c59538f19a6',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/fur-113-30-bedroom-wardrobe-with-sliding-doors-ideas-that.jfif'
  },
  {
    id: 'fur-114', cat: 'Furniture', sub: 'Storage',
    brand: 'Abideen', name: 'Sliding Wardrobe',
    desc: 'A detailed 3D model of the sliding wardrobe — rotate and inspect it from every angle before you buy.',
    price: 5796, old: 8465, rating: 4.3, reviews: 172,
    uid: '68b6be36c2cc41529b1176d346fecf3f',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/fur-114-sliding-door-wardrobe-solutions-22-built-in-wardrobe-ideas-for-clutter-f.jfif'
  },
  {
    id: 'bc-101', cat: 'Beauty & Care', sub: 'Makeup',
    brand: 'neeb17', name: 'Lipstick',
    desc: 'A detailed 3D model of the lipstick — rotate and inspect it from every angle before you buy.',
    price: 18501, old: 27291, rating: 4.8, reviews: 172,
    uid: 'db40146676ce4320968e532517d43f3c',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/Trendy Lipstick Shades.jfif'
  },
  {
    id: 'bc-102', cat: 'Beauty & Care', sub: 'Makeup',
    brand: 'yzy_blog', name: 'Makeup Cosmetics Set',
    desc: 'A detailed 3D model of the makeup cosmetics set — rotate and inspect it from every angle before you buy.',
    price: 54816, old: 71796, rating: 4.3, reviews: 120,
    uid: 'bc5508cd00e04d518e15bb13383679f3',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/bc-102-glam-beauty-collection.jfif'
  },
  {
    id: 'bc-103', cat: 'Beauty & Care', sub: 'Fragrance',
    brand: 'alshifan', name: 'Perfume Bottle',
    desc: 'A detailed 3D model of the perfume bottle — rotate and inspect it from every angle before you buy.',
    price: 6797, old: 9127, rating: 4.3, reviews: 156,
    uid: '650e2810736b46a9bd867e5897edc13b',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/bc-103-los-10-mejores-perfumes-europeos-para-hombres.jfif'
  },
  {
    id: 'bc-104', cat: 'Beauty & Care', sub: 'Skincare',
    brand: 'BIKRAM6372', name: 'Cosmetics Cream Jar',
    desc: 'A detailed 3D model of the cosmetics cream jar — rotate and inspect it from every angle before you buy.',
    price: 59656, old: 75294, rating: 4.6, reviews: 160,
    uid: 'ef2058b3dfd8438ea9597674eebc05c7',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/bc-104-luxury-skincare-cream-in-a-clear-3d-transparent-glass-jar-with-silver-lid.jfif'
  },
  {
    id: 'bc-105', cat: 'Beauty & Care', sub: 'Skincare',
    brand: 'Jozsef Hocza', name: 'Cosmetic Bottle',
    desc: 'A detailed 3D model of the cosmetic bottle — rotate and inspect it from every angle before you buy.',
    price: 23299, old: 33774, rating: 4.6, reviews: 216,
    uid: 'aa47f033fea34d0583a877c4b8beae8b',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/bc-105-frosted-glass-cosmetic-bottle-with-pump-mockup.jfif'
  },
  {
    id: 'bc-106', cat: 'Beauty & Care', sub: 'Skincare',
    brand: 'ProductViz', name: 'Skincare Packaging (Tube, Jar & Cream Bottle Set)',
    desc: 'A detailed 3D model of the skincare packaging (tube, jar & cream bottle set) — rotate and inspect it from every angle before you buy.',
    price: 59687, old: 88501, rating: 4.5, reviews: 185,
    uid: 'ccf4247aaf5949a3835974784075e03f',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/bc-106-nine-piece-set-skincare-gift-pack-water-and-oil-balance-organic-skin-care.jfif'
  },
  {
    id: 'bc-107', cat: 'Beauty & Care', sub: 'Hair Care',
    brand: 'packing pro', name: 'Shampoo Bottle',
    desc: 'A detailed 3D model of the shampoo bottle — rotate and inspect it from every angle before you buy.',
    price: 45839, old: 60295, rating: 4.4, reviews: 151,
    uid: '425fa8fef04844b2a83d5e041ba34b07',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/bc-107-shampoo-bottle-with-pump-mockups-design.jfif'
  },
  {
    id: 'bc-108', cat: 'Beauty & Care', sub: 'Hair Care',
    brand: 'sweedboy69', name: 'Hair Dryer',
    desc: 'A detailed 3D model of the hair dryer — rotate and inspect it from every angle before you buy.',
    price: 9825, old: 13355, rating: 4.8, reviews: 215,
    uid: '4a32ed9cc04441bb83b480d056b6f314',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/bc-108-stylecraft-professional-stay-temp-ionic-hair-dryer.jfif'
  },
  {
    id: 'bc-109', cat: 'Beauty & Care', sub: 'Hair Care',
    brand: 'Samer_Arab_S5', name: 'Sunsilk Shampoo Bottle',
    desc: 'A detailed 3D model of the sunsilk shampoo bottle — rotate and inspect it from every angle before you buy.',
    price: 549, old: 699, rating: 4.8, reviews: 62,
    uid: '405fbff6a52f4958b19702200561901b',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/bc-109-sunsilk-shampoo-full-size-for-lusciously-thick-long-hair-180-ml.jfif'
  },
  {
    id: 'so-201', cat: 'Sports & Outdoors', sub: 'Camping & Hiking',
    brand: 'muhdhafiynaim', name: 'Camping Tent',
    desc: 'A detailed 3D model of the camping tent — rotate and inspect it from every angle before you buy.',
    price: 37007, old: 48080, rating: 4.8, reviews: 175,
    uid: '4ed17d9273ff4268b3e7a107dc5f2420',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/so-201-camping-tent-2-3-4-person-instant-pop-up-tents-for-camping-40s-automatic-.jfif'
  },
  {
    id: 'so-202', cat: 'Sports & Outdoors', sub: 'Camping & Hiking',
    brand: 'Guy in a Poncho', name: 'Modern Camping Tent',
    desc: 'A detailed 3D model of the modern camping tent — rotate and inspect it from every angle before you buy.',
    price: 16583, old: 24369, rating: 4.5, reviews: 116,
    uid: '3f624d58d582430595179bdf9a156be3',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/so-202-camping-tent-dome-2-person-green-waterproof.jfif'
  },
  {
    id: 'so-203', cat: 'Sports & Outdoors', sub: 'Team Sports',
    brand: 'brbrgobr', name: 'Football',
    desc: 'A detailed 3D model of the football — rotate and inspect it from every angle before you buy.',
    price: 16508, old: 22482, rating: 4.6, reviews: 190,
    uid: '01cb274c418a448bb6d5f1203cf85dd7',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/so-203-vektor-isolierter-realistischer-fuball-ber-wei-kostenlose-vektor.jfif'
  },
  {
    id: 'so-204', cat: 'Sports & Outdoors', sub: 'Fitness',
    brand: 'Salim Rached', name: 'Hex Dumbbell 10kg',
    desc: 'A detailed 3D model of the hex dumbbell 10kg — rotate and inspect it from every angle before you buy.',
    price: 12899, old: 17859, rating: 4.5, reviews: 226,
    uid: '750c69ba487a485da85800010687ca51',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/so-204-hex-dumbbell-10kg.jpg'
  },
  {
    id: 'so-205', cat: 'Sports & Outdoors', sub: 'Fitness',
    brand: 'donnichols', name: 'Dumbbells',
    desc: 'A detailed 3D model of the dumbbells — rotate and inspect it from every angle before you buy.',
    price: 51002, old: 74357, rating: 4.3, reviews: 205,
    uid: '5326aeb5db89468681f4c2557052e65a',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/so-205-dumbbells.jpg'
  },
  {
    id: 'so-206', cat: 'Sports & Outdoors', sub: 'Racket Sports',
    brand: 'omkar.jawake', name: 'Cricket Bat',
    desc: 'A detailed 3D model of the cricket bat — rotate and inspect it from every angle before you buy.',
    price: 54555, old: 72686, rating: 4.4, reviews: 185,
    uid: '354bb14074cd4d83985d391f94619e08',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/so-206-a-original-cricket-leather-bat-through-which-we-can-become-a-great-player.jfif'
  },
  {
    id: 'so-207', cat: 'Sports & Outdoors', sub: 'Racket Sports',
    brand: 'farooq.smurf', name: 'Badminton Racket',
    desc: 'A detailed 3D model of the badminton racket — rotate and inspect it from every angle before you buy.',
    price: 53729, old: 72516, rating: 4.6, reviews: 88,
    uid: '6b24681f8f254d499c56186825034b7a',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/so-207-yonex-gr-303-strung-badminton-racquet-half-cover-g3-95-99-9-grams.jfif'
  },
  {
    id: 'so-208', cat: 'Sports & Outdoors', sub: 'Racket Sports',
    brand: 'Yanez Designs', name: 'Tennis Racket',
    desc: 'A detailed 3D model of the tennis racket — rotate and inspect it from every angle before you buy.',
    price: 4573, old: 5741, rating: 4.9, reviews: 185,
    uid: 'c314dcce06ba488ca624957f579b8196',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/so-208-wilson-ultra-26-v5-raquette-de-tennis-blue.jfif'
  },
  {
    id: 'tg-201', cat: 'Toys & Games', sub: 'Plush Toys',
    brand: 'theacidrose', name: 'Teddy Bear',
    desc: 'A detailed 3D model of the teddy bear — rotate and inspect it from every angle before you buy.',
    price: 17094, old: 25003, rating: 4.7, reviews: 205,
    uid: 'dae9249342744328ad6da4182e6010f7',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/tg-101-tg-teddy-bear.png'
  },
  {
    id: 'tg-202', cat: 'Toys & Games', sub: 'Puzzles',
    brand: 'FromSi', name: 'Rubik\'s Cube',
    desc: 'A detailed 3D model of the rubik\'s cube — rotate and inspect it from every angle before you buy.',
    price: 17517, old: 22993, rating: 4.7, reviews: 86,
    uid: '4cc7c1bf585f4b929ddd32f6cab3ba58',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/2392606047161597.jfif'
  },
  {
    id: 'tg-203', cat: 'Toys & Games', sub: 'Puzzles',
    brand: 'PragadeshR', name: 'Rubik\'s Cube 3D Model (Detailed)',
    desc: 'A detailed 3D model of the rubik\'s cube 3d model (detailed) — rotate and inspect it from every angle before you buy.',
    price: 55820, old: 72958, rating: 4.9, reviews: 78,
    uid: '9cadb66ed7f54f209e5c32656e7dbdc1',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/So many hours spent solving this thing.jfif'
  },
  {
    id: 'tg-204', cat: 'Toys & Games', sub: 'Puzzles',
    brand: 'DatSketch', name: 'Rubik\'s Cube (DatSketch)',
    desc: 'A detailed 3D model of the rubik\'s cube (datsketch) — rotate and inspect it from every angle before you buy.',
    price: 30447, old: 45600, rating: 4.5, reviews: 236,
    uid: 'eaba6bf1c7da497f926852006c7bd855',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/Rubiks Cube 3x3 (8+ Yrs).jfif'
  },
  {
    id: 'tg-205', cat: 'Toys & Games', sub: 'Plush Toys',
    brand: 'hectopod', name: 'Teddy Bears (Set)',
    desc: 'A detailed 3D model of the teddy bears (set) — rotate and inspect it from every angle before you buy.',
    price: 42823, old: 55789, rating: 4.8, reviews: 138,
    uid: 'e84b12b4ac20402aaf4d40f2219cd0e2',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/Traditional Teddy Bears Sitting in 33cm.jfif'
  },
  {
    id: 'tg-206', cat: 'Toys & Games', sub: 'Building Toys',
    brand: 'The Bobby Brix Channel', name: 'LEGO Race Car MOC',
    desc: 'A detailed 3D model of the lego race car moc — rotate and inspect it from every angle before you buy.',
    price: 48972, old: 66592, rating: 4.5, reviews: 110,
    uid: '52c74e7d48c44eab86861d0cff8ffa11',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/LEGO Technic Formula E Porsche 99X 42137 – Pull-Back Electric Race Car with AR App.jfif'
  },
  {
    id: 'tg-207', cat: 'Toys & Games', sub: 'Building Toys',
    brand: 'Dixept', name: 'Lego Bricks (Set)',
    desc: 'A detailed 3D model of the lego bricks (set) — rotate and inspect it from every angle before you buy.',
    price: 25448, old: 33655, rating: 4.9, reviews: 238,
    uid: 'e04a66da0b4e4b6a86a7da18d8de4d75',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Lego Classic Building Blocks Box Medium + Blue Plate_ Storage Boxes & Plates Bundle, Stone Box with Building Plate for Children from 4 Years - Starter.jfif'
  },
  {
    id: 'tg-208', cat: 'Toys & Games', sub: 'Building Toys',
    brand: 'the giggler blender', name: 'Lego Brick',
    desc: 'A detailed 3D model of the lego brick — rotate and inspect it from every angle before you buy.',
    price: 28779, old: 35514, rating: 4.2, reviews: 69,
    uid: 'dfbb664b27b842a9a14e7d973effe9ad',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/Lego Classic Building Blocks Box Medium + Blue Plate_ Storage Boxes & Plates Bundle, Stone Box with Building Plate for Children from 4 Years - Starter.jfif'
  },
  {
    id: 'tg-209', cat: 'Toys & Games', sub: 'Building Toys',
    brand: 'XEN3d', name: 'Lego Car',
    desc: 'A detailed 3D model of the lego car (free) — rotate and inspect it from every angle before you buy.',
    price: 58124, old: 82063, rating: 4.6, reviews: 65,
    uid: 'ab6fb464b875404f93cd3646db7f70c6',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/LEGO Technic Formula E Porsche 99X 42137 – Pull-Back Electric Race Car with AR App.jfif'
  },
  {
    id: 'tg-210', cat: 'Toys & Games', sub: 'Building Toys',
    brand: 'FaceTheEdge', name: 'Lego Minifigures',
    desc: 'A detailed 3D model of the lego minifigures — rotate and inspect it from every angle before you buy.',
    price: 15329, old: 19315, rating: 4.5, reviews: 186,
    uid: 'b6457d9fdf4345a19381749169a56f93',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/Lego Figur Nr_ 2600.jfif'
  },
  {
    id: 'tg-211', cat: 'Toys & Games', sub: 'Vehicles',
    brand: 'gorzi', name: 'RC Controller',
    desc: 'A detailed 3D model of the rc controller — rotate and inspect it from every angle before you buy.',
    price: 32240, old: 44908, rating: 4.6, reviews: 249,
    uid: 'b604ff776f9a44ce89e2e2a3c2eae9a5',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/HotRC HT-8A 8CH 2,4 Ghz FHSS transmisor de Control remoto con receptor de F-08A pantalla a Color.jfif'
  },
  {
    id: 'tg-212', cat: 'Toys & Games', sub: 'Vehicles',
    brand: 'SDC PERFORMANCE', name: 'Robot Drone ',
    desc: 'A detailed 3D model of the robot drone  — rotate and inspect it from every angle before you buy.',
    price: 22145, old: 31853, rating: 4.5, reviews: 189,
    uid: '666c2f8810494952863f9cc8bd273133',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/tg-robot-drone.png'
  },
  {
    id: 'tg-213', cat: 'Toys & Games', sub: 'Vehicles',
    brand: 'mortaleiros', name: 'Toy Robot',
    desc: 'A detailed 3D model of the toy robot — rotate and inspect it from every angle before you buy.',
    price: 42095, old: 60090, rating: 4.8, reviews: 66,
    uid: 'fb95e2ebbbfa4bb3aa8b1e50156349f4',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/tg-cyber-femme.png'
  },
  {
    id: 'tg-214', cat: 'Toys & Games', sub: 'Vehicles',
    brand: 'Rohit3DAsset', name: 'Toy Drone',
    desc: 'A detailed 3D model of the toy drone — rotate and inspect it from every angle before you buy.',
    price: 21826, old: 27450, rating: 4.5, reviews: 93,
    uid: '2c180e2a026c4cda8a4b4e019f5037b3',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/tg-robot-drone.png'
  },
  {
    id: 'tg-215', cat: 'Toys & Games', sub: 'Vehicles',
    brand: 'ndnguyen3d', name: 'Robot No.1 (Rigged/Animated)',
    desc: 'A detailed 3D model of the robot no.1 (rigged/animated) — rotate and inspect it from every angle before you buy.',
    price: 35167, old: 47530, rating: 4.8, reviews: 227,
    uid: '9f8f0c6fc1ce4fc08e19ead884ee4b98',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Anime Art _ 🤖 _ I , am Optimus Prime, leader of….jfif'
  },
  {
    id: 'bs-101', cat: 'Books & Stationery', sub: 'Notebooks',
    brand: 'Lyndschoko', name: 'Note Book [2K]',
    desc: 'A detailed 3D model of the note book [2k] — rotate and inspect it from every angle before you buy.',
    price: 52203, old: 75294, rating: 4.9, reviews: 83,
    uid: '66f4d80e201848189d498563b5a72cf7',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/bs-101-nkmbld-a5-notebook-for-working-notebook-journal-for-women-to-do-list-note.jfif'
  },
  {
    id: 'bs-102', cat: 'Books & Stationery', sub: 'Notebooks',
    brand: 'rikugo.studio', name: 'Book and Pencil Set',
    desc: 'A detailed 3D model of the book and pencil set — rotate and inspect it from every angle before you buy.',
    price: 43754, old: 57107, rating: 4.7, reviews: 197,
    uid: 'e09e3d31f6f84b108d1bd34856663abc',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/bs-102-pensel-pencil-hb-12pcs-cartoon-kuromi-cute-student-writing-drawing-sketch.jfif'
  },
  {
    id: 'bs-103', cat: 'Books & Stationery', sub: 'Notebooks',
    brand: 'Vanillain', name: 'Cartoon Notebook & Pencil',
    desc: 'A detailed 3D model of the cartoon notebook & pencil — rotate and inspect it from every angle before you buy.',
    price: 6138, old: 8582, rating: 4.3, reviews: 245,
    uid: 'bd3831c95ab04e719f6ba740289a6ed1',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/bs-103-spongebob-diary-pen-set-with-lock-key-yellow-hardcover-notebook-stationar.jfif'
  },
  {
    id: 'bs-104', cat: 'Books & Stationery', sub: 'Writing',
    brand: 'dylanheyes', name: 'Luxury Pen',
    desc: 'A detailed 3D model of the luxury pen — rotate and inspect it from every angle before you buy.',
    price: 34455, old: 44816, rating: 4.7, reviews: 205,
    uid: '11c3a825d8cd4c16ab2edc3f5613fd84',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/bs-104-black-gold-ballpoint-pen-with-schmidt-ink-refills.jfif'
  },
  {
    id: 'bs-105', cat: 'Books & Stationery', sub: 'Writing',
    brand: 'farooq.smurf', name: 'Pencil',
    desc: 'A detailed 3D model of the pencil — rotate and inspect it from every angle before you buy.',
    price: 56623, old: 80200, rating: 4.3, reviews: 193,
    uid: '9fe73cc296ae407e911d3e511f891b0e',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/bs-105-pencil-mockup-blank-brand-supply-wooden-tool-premium-vector.jfif'
  },
  {
    id: 'bs-106', cat: 'Books & Stationery', sub: 'General',
    brand: 'morrrtu1o', name: 'Stationery Pack',
    desc: 'A detailed 3D model of the stationery pack — rotate and inspect it from every angle before you buy.',
    price: 40855, old: 58291, rating: 4.2, reviews: 232,
    uid: 'ff3f3eb877874199b72cfbd643082675',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/bs-106-amazon-com-66-piece-school-supplies-set-for-kids.jfif'
  },
  {
    id: 'bs-107', cat: 'Books & Stationery', sub: 'Office Supplies',
    brand: 'RoyalBlond', name: 'Stapler',
    desc: 'A detailed 3D model of the stapler — rotate and inspect it from every angle before you buy.',
    price: 30035, old: 38489, rating: 4.7, reviews: 125,
    uid: 'adc71afd55374d8abf24e7c42ec18a31',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/bs-107-heavy-duty-office-stapler-50-sheet-capacity-all-metal-body-includes-1-000.jfif'
  },
  {
    id: 'bs-108', cat: 'Books & Stationery', sub: 'Office Supplies',
    brand: 'Ярослав', name: 'Scissors',
    desc: 'A detailed 3D model of the scissors — rotate and inspect it from every angle before you buy.',
    price: 19735, old: 29243, rating: 4.4, reviews: 87,
    uid: '7e2818454ab0413b83eaa781fc93203a',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/s-phn-quan-kai-k-mu-l-php-bo-trn-long-mch-thinanqunlochianba.jfif'
  },
  {
    id: 'bs-109', cat: 'Books & Stationery', sub: 'Writing',
    brand: 'Mr.Photon', name: 'Eraser',
    desc: 'A detailed 3D model of the eraser — rotate and inspect it from every angle before you buy.',
    price: 5710, old: 8248, rating: 4.7, reviews: 255,
    uid: '8113243c9f3a4ee49cefbd092ea895ee',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/bs-109-staedtler-rasoplast-eraser-20pk-large.jfif'
  },
  {
    id: 'bs-110', cat: 'Books & Stationery', sub: 'Bags',
    brand: 'MadeByYeshe', name: 'School Backpack',
    desc: 'A detailed 3D model of the school backpack — rotate and inspect it from every angle before you buy.',
    price: 9096, old: 11776, rating: 4.4, reviews: 183,
    uid: '524d7fc724094ead9f203ed06bae76e1',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/bs-110-waterproof-laptop-backpack-for-men-women-large-capacity-travel-school-bag.jfif'
  },
  {
    id: 'grc-101', cat: 'Groceries', sub: 'Bags',
    brand: 'Antoine Dresen', name: 'Grocery Bag',
    desc: 'A detailed 3D model of the grocery bag — rotate and inspect it from every angle before you buy.',
    price: 7692, old: 9332, rating: 4.8, reviews: 90,
    uid: '86d735e7933c4486aa60d70c55529b1b',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/grc-101-4-pack-reusable-grocery-bags-heavy-duty-shopping-bags-with-handles-bags-.jfif'
  },
  {
    id: 'grc-102', cat: 'Groceries', sub: 'Packaged Food',
    brand: 'AndyofShogun', name: 'Fruit and Veg Box',
    desc: 'A detailed 3D model of the fruit and veg box — rotate and inspect it from every angle before you buy.',
    price: 31325, old: 39593, rating: 4.2, reviews: 45,
    uid: '440f3cdef37f4b418004a374713645b1',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/grc-102-fruit-and-vegetables-box.jfif'
  },
  {
    id: 'grc-103', cat: 'Groceries', sub: 'Packaged Food',
    brand: 'Owlish Media', name: 'Cereal Box',
    desc: 'A detailed 3D model of the cereal box — rotate and inspect it from every angle before you buy.',
    price: 55344, old: 68127, rating: 4.8, reviews: 115,
    uid: 'd08b83600b7c400bae0264fb79c2d63f',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Custom Chipboard Box_ A Smart Solution for Your Packaging Needs.jfif'
  },
  {
    id: 'grc-104', cat: 'Groceries', sub: 'Pantry',
    brand: 'Geksaedr', name: 'Fruit and Vegetable Rack',
    desc: 'A detailed 3D model of the fruit and vegetable rack — rotate and inspect it from every angle before you buy.',
    price: 50704, old: 72055, rating: 4.6, reviews: 238,
    uid: 'd91caa4e142b43b5a940abfa4d38bb14',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/grc-104-prsentoir-fruits-et-lgumes-2-tages-en-mtal-poigne-bois-pour-la-maison-cu.jfif'
  },
  {
    id: 'grc-105', cat: 'Groceries', sub: 'Bags',
    brand: 'NoLagHere', name: 'Shopping Bag',
    desc: 'A detailed 3D model of the shopping bag — rotate and inspect it from every angle before you buy.',
    price: 33741, old: 44861, rating: 4.4, reviews: 46,
    uid: 'cce3843714f74f85858a325f29ec6991',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/grc-105-reusable-grocery-shopping-bag-heavy-duty-foldable-large-capacity-tote.jfif'
  },
  {
    id: 'grc-106', cat: 'Groceries', sub: 'Packaged Food',
    brand: 'Tiago Oliveira', name: 'Milk Carton',
    desc: 'A detailed 3D model of the milk carton — rotate and inspect it from every angle before you buy.',
    price: 14295, old: 19627, rating: 4.6, reviews: 207,
    uid: 'fb9e00da31c44bd4ad5e9c574df0503a',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/small-juice-carton-mockup-mockups-design.jfif'
  },
  {
    id: 'grc-107', cat: 'Groceries', sub: 'Packaged Food',
    brand: 'mfyma', name: 'Juice Carton Box',
    desc: 'A detailed 3D model of the juice carton box — rotate and inspect it from every angle before you buy.',
    price: 46231, old: 67610, rating: 4.5, reviews: 259,
    uid: 'eadef18102504962b574ab162b65fe12',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/grc-107-juice-box-mockup.jfif'
  },
  {
    id: 'grc-108', cat: 'Groceries', sub: 'General',
    brand: 'endbored', name: 'Canned Food',
    desc: 'A detailed 3D model of the canned food — rotate and inspect it from every angle before you buy.',
    price: 52848, old: 63512, rating: 4.4, reviews: 52,
    uid: 'd27cd3bf24094793a892b4635df1d093',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/grc-108-canned-food.jfif'
  },
  {
    id: 'grc-109', cat: 'Groceries', sub: 'Beverages',
    brand: 'Mashood_', name: 'New Juice Bottle',
    desc: 'A detailed 3D model of the new juice bottle — rotate and inspect it from every angle before you buy.',
    price: 34920, old: 47852, rating: 4.4, reviews: 54,
    uid: '04846daf5e8d4014a8d04a1391e2d3be',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/grc-109-plastic-juice-bottles-wholesale-free-shipping-50.jfif'
  },
  {
    id: 'grc-110', cat: 'Groceries', sub: 'Pantry',
    brand: 'Cygnos', name: 'Verstegen Spice Jar',
    desc: 'A detailed 3D model of the verstegen spice jar — rotate and inspect it from every angle before you buy.',
    price: 45233, old: 65778, rating: 4.4, reviews: 119,
    uid: 'f859283288f944d194cb21c4b3933354',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/grc-110-spice-jars-spice-racks-spice-organizer-spice-shelves.jfif'
  },
  {
    id: 'grc-111', cat: 'Groceries', sub: 'Packaged Food',
    brand: 'Antoine Dresen', name: 'Egg Box',
    desc: 'A detailed 3D model of the egg box — rotate and inspect it from every angle before you buy.',
    price: 20022, old: 24709, rating: 4.9, reviews: 96,
    uid: '39fcb564613c45c1a2689410fb49c6f0',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/grc-111-mshomely-60-egg-container-for-refrigerator-egg.jfif'
  },
  {
    id: 'grc-112', cat: 'Groceries', sub: 'Pantry',
    brand: 'cirax-we', name: 'Metal 6-Jar Spice Rack',
    desc: 'A detailed 3D model of the metal 6-jar spice rack — rotate and inspect it from every angle before you buy.',
    price: 34825, old: 49804, rating: 4.3, reviews: 255,
    uid: 'c9351941ffe84673b7b801e0fe022e83',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/grc-112-kitchen-seasoning-box-masala-box-spice-rack-easy.jfif'
  },
  {
    id: 'aut-101', cat: 'Automotive', sub: 'Parts',
    brand: 'klaxoneer', name: 'Car Engine',
    desc: 'A detailed 3D model of the car engine — rotate and inspect it from every angle before you buy.',
    price: 18081, old: 21709, rating: 4.8, reviews: 178,
    uid: 'd440e8b6ec914b17b144a241ddbfa136',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/MAD058 V8 Engine Model Simulation Electric Internal Combustion Engine Model Assembly Kit for RC Cars.jfif'
  },
  {
    id: 'aut-102', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'Madin Productions', name: 'Race Car Tire',
    desc: 'A detailed 3D model of the race car tire — rotate and inspect it from every angle before you buy.',
    price: 37733, old: 47730, rating: 4.3, reviews: 243,
    uid: '0527e3fbf24f4fac8018201f1cff9213',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/aut-102-neumticos-de-carreras-1-10-de-65-mm-para-carretera-hexgono-de-12-mm-para.jfif'
  },
  {
    id: 'aut-103', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'BannedSteak', name: 'Car Tire',
    desc: 'A detailed 3D model of the car tire — rotate and inspect it from every angle before you buy.',
    price: 55328, old: 73720, rating: 4.4, reviews: 28,
    uid: 'c00a1015f26242ab919c9942d369822e',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/aut-103-tire-industrial-design.jfif'
  },
  {
    id: 'aut-104', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'MMC Works', name: 'Car Wheels and Tire',
    desc: 'A detailed 3D model of the car wheels and tire — rotate and inspect it from every angle before you buy.',
    price: 40988, old: 50557, rating: 4.3, reviews: 238,
    uid: 'ad9408b064944521975c9934cf184408',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/aut-104-4pcs-rc-rally-car-grain-rubber-tires-and-wheel-rims-for-1-10-rc-on-road-.jfif'
  },
  {
    id: 'aut-105', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'SDC PERFORMANCE', name: 'Sport Tire Pack (Free)',
    desc: 'A detailed 3D model of the sport tire pack (free) — rotate and inspect it from every angle before you buy.',
    price: 37091, old: 51677, rating: 4.3, reviews: 116,
    uid: '07ffafa14c0348738edff992999511f9',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/aut-105-ad-ebay-217-70-4-new-225-40zr18-92w-sport-tires-for-cars-sedans-suv-all-.jfif'
  },
  {
    id: 'aut-106', cat: 'Automotive', sub: 'Parts',
    brand: 'Joko_P', name: 'Car Disc Brake',
    desc: 'A detailed 3D model of the car disc brake — rotate and inspect it from every angle before you buy.',
    price: 28865, old: 39151, rating: 4.3, reviews: 164,
    uid: '9e2440a2fa624b31abd0963902217407',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/aut-106-wilwood-140-11071-front-disc-brake-kit-for-ford-mustang.jfif'
  },
  {
    id: 'aut-107', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'MMC Works', name: 'Car Wheel with Brake Disc',
    desc: 'A detailed 3D model of the car wheel with brake disc — rotate and inspect it from every angle before you buy.',
    price: 11409, old: 14356, rating: 4.6, reviews: 104,
    uid: '5b9bb83857674cd5a866f35fbf7fe8d4',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/aut-107-brake-pad-squeaking-dublin-chevrolet-service-techs-can-help.jfif'
  },
  {
    id: 'aut-108', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'peel-3d.com', name: 'Car Steering Wheel',
    desc: 'A detailed 3D model of the car steering wheel — rotate and inspect it from every angle before you buy.',
    price: 39470, old: 54916, rating: 4.5, reviews: 221,
    uid: '9086ab59c4cd4ea1aa023dd16df8ab00',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/aut-108-steering-wheel-rendering-tutorial-renaud-pecheur.jfif'
  },
  {
    id: 'aut-109', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'Robert Prispilović', name: 'Racing Steering Wheel (Free)',
    desc: 'A detailed 3D model of the racing steering wheel (free) — rotate and inspect it from every angle before you buy.',
    price: 31119, old: 38598, rating: 4.5, reviews: 248,
    uid: 'aac10d1d350c455ea234c151837a92c8',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/aut-109-tiypeor-universal-racing-car-racing-steering-wheels-pu-13inch-320mm-drif.jfif'
  },
  {
    id: 'aut-110', cat: 'Automotive', sub: 'Tires & Wheels',
    brand: 'ImGreenWolf', name: 'Steering Wheel (High Poly)',
    desc: 'A detailed 3D model of the steering wheel (high poly) — rotate and inspect it from every angle before you buy.',
    price: 49048, old: 72992, rating: 4.4, reviews: 209,
    uid: 'bf1cf08501b04615aae65677850e7d8e',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/aut-110-qymopay-universal-racing-steering-wheel-13-8-inch-6-bolt-anti-slip-leath.jfif'
  },
  {
    id: 'aut-111', cat: 'Automotive', sub: 'Riding Gear',
    brand: 'ramyouny', name: 'Motorcycle Helmet – Racing Helmet',
    desc: 'A detailed 3D model of the motorcycle helmet – racing helmet — rotate and inspect it from every angle before you buy.',
    price: 38472, old: 52061, rating: 4.2, reviews: 36,
    uid: 'b2ead0381b914a88810a8be9fc13f47a',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/aut-111-supertech-r10-solid-white-motorcycle-helmet-alpinestars.jfif'
  },
  {
    id: 'aut-112', cat: 'Automotive', sub: 'Riding Gear',
    brand: '13baym', name: 'Retro Motorcycle Helmet',
    desc: 'A detailed 3D model of the retro motorcycle helmet — rotate and inspect it from every angle before you buy.',
    price: 48144, old: 68205, rating: 4.3, reviews: 250,
    uid: '8fc9219aecb6498981a905db1fddfcd5',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/Casque intégral HJC V60 - DEEP UNI - Rouge.jfif'
  },
  {
    id: 'aut-113', cat: 'Automotive', sub: 'Motorcycles',
    brand: 'animanyarty', name: 'Motorcycle (Stylized)',
    desc: 'A detailed 3D model of the motorcycle (stylized) — rotate and inspect it from every angle before you buy.',
    price: 23552, old: 31931, rating: 4.5, reviews: 217,
    uid: '38404e2077ca4b209cd2f1db30541b94',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/A green motorcycle army vehicle cartoon illustration.jfif'
  },
  {
    id: 'aut-114', cat: 'Automotive', sub: 'Riding Gear',
    brand: 'SDC PERFORMANCE', name: 'Racing Helmet – SC04',
    desc: 'A detailed 3D model of the racing helmet – sc04 — rotate and inspect it from every angle before you buy.',
    price: 38022, old: 53768, rating: 4.5, reviews: 230,
    uid: 'd6f200597f0f4c748a2f30f07a2793d8',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/aut-114-supertech-r10-solid-white-motorcycle-helmet-alpinestars.jfif'
  },
  {
    id: 'wch-201', cat: 'Watches', sub: 'General',
    brand: 'sudo-self', name: 'Rolex Watch',
    desc: 'A detailed 3D model of the rolex watch — rotate and inspect it from every angle before you buy.',
    price: 1899999, old: 2199999, rating: 4.6, reviews: 194,
    uid: '0fde5c5f56d841cda53ae4a01f66dfaf',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/Gold Watches PNG Images,  Gold, Watch PNG Transparent Background - Pngtree.jfif'
  },
  {
    id: 'wch-202', cat: 'Watches', sub: 'Analog',
    brand: 'render-lab', name: 'Stainless Steel Analog Watch',
    desc: 'A detailed 3D model of the stainless steel analog watch — rotate and inspect it from every angle before you buy.',
    price: 20336, old: 24725, rating: 4.6, reviews: 74,
    uid: '029a0b692d474e55ac29292fc30fb153',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/wch-202-amazon-com-megalith-mens-watches-with-stainless.jfif'
  },
  {
    id: 'wch-203', cat: 'Watches', sub: 'Analog',
    brand: 'Taohid Animation', name: 'Modern Analog Watch',
    desc: 'A detailed 3D model of the modern analog watch — rotate and inspect it from every angle before you buy.',
    price: 26707, old: 33991, rating: 4.5, reviews: 185,
    uid: '92099614037c4fe88284f71bfcb64602',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/Seiko Men’s Black Dial Watch with Yellow Strap _ Stylish Stainless Steel Analog Watch.jfif'
  },
  {
    id: 'wch-204', cat: 'Watches', sub: 'General',
    brand: 'Lazaran', name: 'Wrist Watch',
    desc: 'A detailed 3D model of the wrist watch — rotate and inspect it from every angle before you buy.',
    price: 49139, old: 59848, rating: 4.3, reviews: 50,
    uid: '561805c0b06e4a12a309222f3a08310d',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/wch-204-simple-analog-quartz-wrist-watch.jfif'
  },
  {
    id: 'wch-205', cat: 'Watches', sub: 'Digital',
    brand: 'SpatialNeglect', name: 'Digital Watch',
    desc: 'A detailed 3D model of the digital watch — rotate and inspect it from every angle before you buy.',
    price: 20400, old: 30188, rating: 4.4, reviews: 139,
    uid: 'fbad4cb705104df9b60cab174680707a',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/4362930882047066.jfif'
  },
  {
    id: 'wch-206', cat: 'Watches', sub: 'Digital',
    brand: 'Aficionado', name: 'Casio Digital Watch',
    desc: 'A detailed 3D model of the casio digital watch — rotate and inspect it from every angle before you buy.',
    price: 11999, old: 15999, rating: 4.3, reviews: 208,
    uid: '583a57dce80542f48f3f52dca78b1a61',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/Partner Content – Affiliate Link Included_🕒 Casio….jfif'
  },
  {
    id: 'wch-207', cat: 'Watches', sub: 'Digital',
    brand: 'RYBY_DLA_DEBILI', name: 'Casio Watch A158',
    desc: 'A detailed 3D model of the casio watch a158 — rotate and inspect it from every angle before you buy.',
    price: 8999, old: 11999, rating: 4.4, reviews: 51,
    uid: '37b377d5a67f4e948f387d54043ca0d8',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Casio Vintage A-158WA-1Q Digital Grey Dial Unisex….jfif'
  },
  {
    id: 'wch-208', cat: 'Watches', sub: 'Digital',
    brand: 'zachernuk', name: 'Casio F-91W',
    desc: 'A detailed 3D model of the casio f-91w — rotate and inspect it from every angle before you buy.',
    price: 6999, old: 8999, rating: 4.5, reviews: 63,
    uid: '7026d57540ff4574b413e97dbcb7a216',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/Casio Classic F91W Series Quartz Watch _ Water Resistant _1_100 Second Stopwatch _ Daily Alarm _ Hourly Time Signal _Auto Calendar _SS Caseback _12_24.jfif'
  },
  {
    id: 'wch-209', cat: 'Watches', sub: 'Smartwatches',
    brand: 'Aditya31641', name: 'Futuristic Smartwatch',
    desc: 'A detailed 3D model of the futuristic smartwatch — rotate and inspect it from every angle before you buy.',
    price: 59058, old: 78685, rating: 4.8, reviews: 209,
    uid: '0a730eaa29f44a6a9617874c88628581',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/NeoSync X_ The Ultimate Futuristic Smartwatch.jfif'
  },
  {
    id: 'bl-101', cat: 'Bags & Luggage', sub: 'Luggage',
    brand: 'holgcool', name: 'Travel Bag',
    desc: 'A detailed 3D model of the travel bag — rotate and inspect it from every angle before you buy.',
    price: 3403, old: 4962, rating: 4.9, reviews: 224,
    uid: '7c06741b1d8145a387207190608a6368',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/Fashion Mens Large Dry and Wet Separation Business Travel Bag with Shoe Bin Short-distance Business - Copy.jfif'
  },
  {
    id: 'bl-102', cat: 'Bags & Luggage', sub: 'Luggage',
    brand: 'Mehmet Ozturk', name: 'Suitcase',
    desc: 'A detailed 3D model of the suitcase — rotate and inspect it from every angle before you buy.',
    price: 47563, old: 68919, rating: 4.8, reviews: 179,
    uid: 'cbb557cc54b14872b1115fb146aa7c2c',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/Shopping for Home Decor - Design and Decorating Gift Ideas.jfif'
  },
  {
    id: 'bl-103', cat: 'Bags & Luggage', sub: 'Backpacks',
    brand: 'MadeByYeshe', name: 'Backpack',
    desc: 'A detailed 3D model of the backpack — rotate and inspect it from every angle before you buy.',
    price: 60070, old: 72119, rating: 4.7, reviews: 240,
    uid: 'dd087558c1a24a9ea82d50d764ad4b78',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Laptop Rucksack.jfif'
  },
  {
    id: 'bl-104', cat: 'Bags & Luggage', sub: 'General',
    brand: 'Alexxa', name: 'Woman Bag',
    desc: 'A detailed 3D model of the woman bag — rotate and inspect it from every angle before you buy.',
    price: 16691, old: 23438, rating: 4.3, reviews: 139,
    uid: '6394f90b388a492aac0bbdce276be399',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/Womens Everyday Work Shoulder Handbags Grey.jfif'
  },
  {
    id: 'bl-105', cat: 'Bags & Luggage', sub: 'Handbags',
    brand: 'Matyts', name: 'Handbag',
    desc: 'A detailed 3D model of the handbag — rotate and inspect it from every angle before you buy.',
    price: 20644, old: 26563, rating: 4.4, reviews: 254,
    uid: 'caaa781eb53a415c900a85ab675d53f8',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/GIOIO Bolso Mujer Casual Diario Grande y CÃ³modo _ Falabella Chile.jfif'
  },
  {
    id: 'bl-106', cat: 'Bags & Luggage', sub: 'Wallets',
    brand: 'apleesee', name: 'Wallet',
    desc: 'A detailed 3D model of the wallet — rotate and inspect it from every angle before you buy.',
    price: 31242, old: 42306, rating: 4.6, reviews: 250,
    uid: 'ccfcc4ae6efa44a2ba34c4c479be7daf',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/Mens Wallet Boys Classic Leather Pockets….jfif'
  },
  {
    id: 'bl-107', cat: 'Bags & Luggage', sub: 'Handbags',
    brand: 'keithfrost', name: 'Tote Bag',
    desc: 'A detailed 3D model of the tote bag — rotate and inspect it from every angle before you buy.',
    price: 60265, old: 88134, rating: 4.8, reviews: 197,
    uid: '295d7544c7c048168eb42ab83456e42e',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/brown rexine tote bag for girls.jfif'
  },
  {
    id: 'bl-108', cat: 'Bags & Luggage', sub: 'Wallets',
    brand: 'Sergey Filin', name: 'Old Wallet (Realistic)',
    desc: 'A detailed 3D model of the old wallet (realistic) — rotate and inspect it from every angle before you buy.',
    price: 58386, old: 71577, rating: 4.5, reviews: 30,
    uid: '25a75902f3e5446a893b0de552f42862',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/Bird in Bag – Vintage-Inspired RFID Blocking Leather Wallet with Dragon Design.jfif'
  },
  {
    id: 'je-101', cat: 'Jewelry & Eyewear', sub: 'Jewelry',
    brand: 'YaMoMoYa', name: 'Jewelry Ring',
    desc: 'A detailed 3D model of the jewelry ring — rotate and inspect it from every angle before you buy.',
    price: 24475, old: 32006, rating: 4.5, reviews: 172,
    uid: '61cf022ed0dc46dda49190772f5965b8',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/Certified Original 3ct Moissanite 925 Sterling Silver Ring Set Twist Floral Luxury.jfif'
  },
  {
    id: 'je-102', cat: 'Jewelry & Eyewear', sub: 'Jewelry',
    brand: 'maximmus', name: 'Necklace',
    desc: 'A detailed 3D model of the necklace — rotate and inspect it from every angle before you buy.',
    price: 48514, old: 67629, rating: 4.2, reviews: 41,
    uid: '1a7925d4b8994953862027f861e6e506',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/Classic Gold Crystal Set.jfif'
  },
  {
    id: 'je-103', cat: 'Jewelry & Eyewear', sub: 'Eyewear',
    brand: 'Berk Gedik', name: 'Free Sunglasses Set (Low Poly)',
    desc: 'A detailed 3D model of the free sunglasses set (low poly) — rotate and inspect it from every angle before you buy.',
    price: 9538, old: 13547, rating: 4.8, reviews: 197,
    uid: '2fd738be560d4d07b83bc4a3ab97c0c9',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Trendy Unisex Polarized Classic Retro Sunglasses With Uv Protection _ Color_ Black_Brown _ Size_ Os.jfif'
  },
  {
    id: 'je-104', cat: 'Jewelry & Eyewear', sub: 'Eyewear',
    brand: 'jenardo', name: 'Cool Shades (Sunglasses)',
    desc: 'A detailed 3D model of the cool shades (sunglasses) — rotate and inspect it from every angle before you buy.',
    price: 6119, old: 8243, rating: 4.4, reviews: 61,
    uid: '55a2c690682d403eabe52430055bc157',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/Taya 53mm Polarized Oval Sunglasses (Women) _ Nordstrom.jfif'
  },
  {
    id: 'je-105', cat: 'Jewelry & Eyewear', sub: 'Eyewear',
    brand: 'Pratham.Bhatnagar', name: 'Eyeglasses (Specs)',
    desc: 'A detailed 3D model of the eyeglasses (specs) — rotate and inspect it from every angle before you buy.',
    price: 19101, old: 26682, rating: 4.9, reviews: 105,
    uid: 'a9e23529a9a5417a8db9df961a7d42af',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/download.jfif'
  },
  {
    id: 'je-106', cat: 'Jewelry & Eyewear', sub: 'Jewelry',
    brand: 'Jlindbe', name: 'Gold Jewelry Set (Necklace & Earrings)',
    desc: 'A detailed 3D model of the gold jewelry set (necklace & earrings) — rotate and inspect it from every angle before you buy.',
    price: 45386, old: 56859, rating: 4.7, reviews: 190,
    uid: 'a5d69d611b964962a9c212f4e1133159',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/Luxury Gold Jewelry Set _ Elegant Necklace & Earrings Aesthetic.jfif'
  },
  {
    id: 'je-107', cat: 'Jewelry & Eyewear', sub: 'Jewelry',
    brand: 'relaxnoname', name: 'Silver Earrings Diamond',
    desc: 'A detailed 3D model of the silver earrings diamond — rotate and inspect it from every angle before you buy.',
    price: 7006, old: 9535, rating: 4.8, reviews: 57,
    uid: 'cbf4b73ba0634c90977c0f07aeda6095',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/This item is unavailable - Etsy.jfif'
  },
  {
    id: 'je-108', cat: 'Jewelry & Eyewear', sub: 'Jewelry',
    brand: 'allanoraphael', name: 'Elven Bracelet',
    desc: 'A detailed 3D model of the elven bracelet — rotate and inspect it from every angle before you buy.',
    price: 34500, old: 42934, rating: 4.2, reviews: 126,
    uid: 'cb66dd7fb7ca4154ac5613ff4946353b',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/2885187257800255.jfif'
  },
  {
    id: 'je-109', cat: 'Jewelry & Eyewear', sub: 'Jewelry',
    brand: 'waveus', name: 'Diamond',
    desc: 'A detailed 3D model of the diamond — rotate and inspect it from every angle before you buy.',
    price: 47063, old: 70195, rating: 4.7, reviews: 104,
    uid: '0f1aef897675458185193a47c6cca611',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/3d Isolated Render Of Diamond Icon With High Quality Shine And Detailed Design For Luxury Jewelry Projects, Render, Diamond, Icon PNG Transparent Image and Clipart for Free Download.jfif'
  },
  {
    id: 'ps-101', cat: 'Pet Supplies', sub: 'Feeding',
    brand: 'furkandgn', name: 'Pet Bowl',
    desc: 'A detailed 3D model of the pet bowl — rotate and inspect it from every angle before you buy.',
    price: 23711, old: 32985, rating: 4.5, reviews: 144,
    uid: 'dbf27cb19fba4ba0850cf6076fc17ed5',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/Personalised Ceramic Pet Bowl _ Custom Pet Name Bowl _ Dog or Cat Gift _ Pet Lover Gift _ Puppy Kitten Bowl.jfif'
  },
  {
    id: 'ps-102', cat: 'Pet Supplies', sub: 'Bedding',
    brand: 'dojarico', name: 'Basic Cat Bed',
    desc: 'A detailed 3D model of the basic cat bed — rotate and inspect it from every angle before you buy.',
    price: 51196, old: 72544, rating: 4.4, reviews: 182,
    uid: '91957ec09a4e4fd5911ba1cec863e7b6',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/Rectangle Cat Dog Bed Indoor Machine Washable Sleeping Sofa Non-Slip Bottom-Black - Size L.jfif'
  },
  {
    id: 'ps-103', cat: 'Pet Supplies', sub: 'Bedding',
    brand: 'nicknothom', name: 'Dog Bed',
    desc: 'A detailed 3D model of the dog bed — rotate and inspect it from every angle before you buy.',
    price: 9224, old: 13038, rating: 4.4, reviews: 94,
    uid: '44610807fbc8430a889b82f13bad4f82',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Square Plush Kennel Pet Bed.jfif'
  },
  {
    id: 'ps-104', cat: 'Pet Supplies', sub: 'Feeding',
    brand: 'Zambur', name: 'Dog Bowl',
    desc: 'A detailed 3D model of the dog bowl — rotate and inspect it from every angle before you buy.',
    price: 31956, old: 47074, rating: 4.8, reviews: 252,
    uid: '3fc962f14b994f81a5924f9b100dcb2f',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/Unbelievable offer! Stainless Steel Pet Dog Bowl….jfif'
  },
  {
    id: 'ps-105', cat: 'Pet Supplies', sub: 'Accessories',
    brand: 'josephcan232', name: 'Dog Leash',
    desc: 'A detailed 3D model of the dog leash — rotate and inspect it from every angle before you buy.',
    price: 12371, old: 14929, rating: 4.6, reviews: 61,
    uid: '80ced5a2778b4c9c9991bb78242d9331',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/Chew Proof Metal Dog Leash.jfif'
  },
  {
    id: 'ps-106', cat: 'Pet Supplies', sub: 'Accessories',
    brand: 'alyblue10', name: 'Cat Scratching Post',
    desc: 'A detailed 3D model of the cat scratching post — rotate and inspect it from every angle before you buy.',
    price: 49345, old: 64869, rating: 4.5, reviews: 101,
    uid: 'b4cd22ac2a2f4ad7891a1afc7229419e',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/Cat Scratcher, Sisal Scratcher, Cat Scratcher , Durable Cat Kitten Scratcher for Green 25cm, Size_Multi.jfif'
  },
  {
    id: 'ps-107', cat: 'Pet Supplies', sub: 'Accessories',
    brand: 'afiey.lab', name: 'Cat Carrier',
    desc: 'A detailed 3D model of the cat carrier — rotate and inspect it from every angle before you buy.',
    price: 56056, old: 75130, rating: 4.2, reviews: 147,
    uid: '0ca7a2d3a0634b45b1621de96f818867',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/Buy Rosewood Plastic Pet Carrier with Cushion - Large _ Cat carriers and boxes _ Argos.jfif'
  },
  {
    id: 'ps-108', cat: 'Pet Supplies', sub: 'Accessories',
    brand: 'Mickanside', name: 'Pink Cat Scratching Post',
    desc: 'A detailed 3D model of the pink cat scratching post — rotate and inspect it from every angle before you buy.',
    price: 18873, old: 28159, rating: 4.3, reviews: 139,
    uid: '3179e253e3a74355928d2d10a848c6ca',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/31454897393570612.jfif'
  },
  {
    id: 'kb-101', cat: 'Kids & Baby', sub: 'Baby Gear',
    brand: 'fernand_artt', name: 'Baby Stroller',
    desc: 'A detailed 3D model of the baby stroller — rotate and inspect it from every angle before you buy.',
    price: 57668, old: 73281, rating: 4.3, reviews: 114,
    uid: 'db3f16cf7230449bbf493eb42101793b',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/311944711713727964.jfif'
  },
  {
    id: 'kb-102', cat: 'Kids & Baby', sub: 'Baby Gear',
    brand: 'amanduca', name: 'Baby Crib',
    desc: 'A detailed 3D model of the baby crib — rotate and inspect it from every angle before you buy.',
    price: 13494, old: 18215, rating: 4.4, reviews: 68,
    uid: 'd02ba46d170143e58ec7f9e4c7edb09c',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/Chocolate Brown 5-in-1 Convertible Crib for Baby Nursery and Toddler Bed Transition.jfif'
  },
  {
    id: 'kb-103', cat: 'Kids & Baby', sub: 'Toys',
    brand: 'DURVESH S', name: 'Lego Baby Toy',
    desc: 'A detailed 3D model of the lego baby toy — rotate and inspect it from every angle before you buy.',
    price: 36874, old: 54102, rating: 4.6, reviews: 81,
    uid: 'de0d79eb1cfa44ce895b8284dd336f73',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/kb-103-lego-baby-keychain-light.jfif'
  },
  {
    id: 'kb-104', cat: 'Kids & Baby', sub: 'Baby Gear',
    brand: '8N Films Official', name: 'Baby Crib (Themed)',
    desc: 'A detailed 3D model of the baby crib (themed) — rotate and inspect it from every angle before you buy.',
    price: 49089, old: 63267, rating: 4.4, reviews: 106,
    uid: '2ac2d020f6ee4c9c920b9a62a39110ad',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/5559199538308546.jfif'
  },
  {
    id: 'kb-105', cat: 'Kids & Baby', sub: 'Baby Gear',
    brand: 'Balen96', name: 'Baby High Chair',
    desc: 'A detailed 3D model of the baby high chair — rotate and inspect it from every angle before you buy.',
    price: 55444, old: 74154, rating: 4.3, reviews: 251,
    uid: '92f82f6db6d04e5dae037df20273c506',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/kb-105-kb-high-chair.png'
  },
  {
    id: 'kb-106', cat: 'Kids & Baby', sub: 'Toys',
    brand: 'pibini modeling', name: 'Building Blocks Toy',
    desc: 'A detailed 3D model of the building blocks toy — rotate and inspect it from every angle before you buy.',
    price: 10039, old: 14881, rating: 4.6, reviews: 149,
    uid: 'd3603256bd24432b995329a6db084dbb',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/Cabeeskii Grand Jeu de Construction, 60 pièces de Briques en 6 Couleurs et 2 Dimensions, Compatible avec Duplo et Toutes Les Grandes Marques, Jouet.jfif'
  },
  {
    id: 'kb-107', cat: 'Kids & Baby', sub: 'Furniture',
    brand: 'MaX3Dd', name: 'Kids Chair',
    desc: 'A detailed 3D model of the kids chair — rotate and inspect it from every angle before you buy.',
    price: 52770, old: 78668, rating: 4.5, reviews: 32,
    uid: '3f2f9fcde48d4a8493b118e4aea5aa0d',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/kb-107-kb-high-chair.png'
  },
  {
    id: 'mf-101', cat: 'Men\'s Fashion', sub: 'Ethnic Wear',
    brand: 'abot86', name: 'Traditional Indian Kurta with Vest',
    desc: 'A detailed 3D model of the traditional indian kurta with vest — rotate and inspect it from every angle before you buy.',
    price: 52942, old: 78313, rating: 4.6, reviews: 221,
    uid: '3419c01530734ebab1deb2a69e4be0da',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/mf-101-Traditional-Indian-Kurta-with-Vest.jfif'
  },
  {
    id: 'mf-102', cat: 'Men\'s Fashion', sub: 'Bottoms',
    brand: 'Alexander Kurmanin', name: 'Male Pants (Jeans)',
    desc: 'A detailed 3D model of the male pants (jeans) — rotate and inspect it from every angle before you buy.',
    price: 20024, old: 28031, rating: 4.4, reviews: 183,
    uid: '6bee760f49614feb95baa459f40cf11b',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/mf-102-male-pants-jeans.jfif'
  },
  {
    id: 'mf-103', cat: 'Men\'s Fashion', sub: 'Outerwear',
    brand: 'ShoyoX', name: 'Hoodie',
    desc: 'A detailed 3D model of the hoodie — rotate and inspect it from every angle before you buy.',
    price: 17436, old: 23060, rating: 4.3, reviews: 148,
    uid: '2c674228f1e946b5b8f508f8f818e130',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/Men’s White Graffiti Back-Print Hoodie – Streetwear Pullover with Relaxed Fit & Front Pocket.jfif'
  },
  {
    id: 'mf-104', cat: 'Men\'s Fashion', sub: 'Formal Wear',
    brand: 'black2.o', name: 'Men\'s Formal Suit',
    desc: 'A detailed 3D model of the men\'s formal suit — rotate and inspect it from every angle before you buy.',
    price: 46918, old: 58636, rating: 4.3, reviews: 181,
    uid: 'f0ac03cbbbf2414aaa41ee59362d2e31',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/mf-formal-suit.png'
  },
  {
    id: 'mf-105', cat: 'Men\'s Fashion', sub: 'Bottoms',
    brand: 'Arsen Ismailov', name: 'Basic T-Shirt and Pants',
    desc: 'A detailed 3D model of the basic t-shirt and pants — rotate and inspect it from every angle before you buy.',
    price: 28676, old: 41906, rating: 4.7, reviews: 49,
    uid: '8df8447017de45198e5c8e643d36e699',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/Rate this casual outfit for men.jfif'
  },
// ==================================================================
// Mobiles & Tablets — added from FINAL_all_3d_models_combined.txt
// Prices/ratings are placeholders — real product photos to be added later.
// ==================================================================
  {
    id: 'mob-101', cat: 'Mobiles & Tablets', sub: 'iPhones',
    brand: 'Wes', name: 'iPhone 16',
    desc: 'A detailed 3D model of the iphone 16 — rotate and inspect it from every angle before you buy.',
    price: 349999, old: 399999, rating: 4.7, reviews: 461,
    uid: 'd58591e88a824dfd8cef0af616273b02',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/mob-101-apple-iphone-16-plus-price-specs-colors-size.jfif'
  },
  {
    id: 'mob-102', cat: 'Mobiles & Tablets', sub: 'iPhones',
    brand: 'rtql8d', name: 'iPhone Air',
    desc: 'A detailed 3D model of the iphone air — rotate and inspect it from every angle before you buy.',
    price: 469999, old: 524999, rating: 4.3, reviews: 473,
    uid: '66dd43c1660d430593a31652bd265531',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/mob-102-iphone-air.jfif'
  },
  {
    id: 'mob-103', cat: 'Mobiles & Tablets', sub: 'iPhones',
    brand: 'Ranguel', name: 'iPhone 17 Pro',
    desc: 'A detailed 3D model of the iphone 17 pro — rotate and inspect it from every angle before you buy.',
    price: 519999, old: 579999, rating: 4.4, reviews: 76,
    uid: '4541aa8a28324b33a2baaf81d263aaec',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/mob-103-iphone-17-pro.jpg'
  },
  {
    id: 'mob-104', cat: 'Mobiles & Tablets', sub: 'iPhones',
    brand: 'MajdyModels', name: 'iPhone 16 Pro Max',
    desc: 'A detailed 3D model of the iphone 16 pro max — rotate and inspect it from every angle before you buy.',
    price: 459999, old: 519999, rating: 4.7, reviews: 353,
    uid: '41a071ae12794b668502f58d1e0fd1a3',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/iPhone 16 Pro Max.jfif'
  },
  {
    id: 'mob-105', cat: 'Mobiles & Tablets', sub: 'iPhones',
    brand: 'DatSketch', name: 'Apple iPhone 13 Pro Max',
    desc: 'A detailed 3D model of the apple iphone 13 pro max — rotate and inspect it from every angle before you buy.',
    price: 318999, old: 359999, rating: 4.4, reviews: 158,
    uid: '4328dea00e47497dbeac73c556121bc9',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/mob-105-mob-iphone-13-pro-max.png'
  },
  {
    id: 'mob-106', cat: 'Mobiles & Tablets', sub: 'iPhones',
    brand: 'DatSketch', name: 'iPhone 13 Pro',
    desc: 'A detailed 3D model of the iphone 13 pro — rotate and inspect it from every angle before you buy.',
    price: 289999, old: 329999, rating: 4.6, reviews: 404,
    uid: '0c34a039d50e42f4b46738ec26929c15',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/mob-106-iphone-13-pro-max-azul-sierra.jfif'
  },
  {
    id: 'mob-107', cat: 'Mobiles & Tablets', sub: 'iPhones',
    brand: 'mister dude', name: 'iPhone 14 Pro',
    desc: 'A detailed 3D model of the iphone 14 pro — rotate and inspect it from every angle before you buy.',
    price: 419999, old: 469999, rating: 4.8, reviews: 295,
    uid: '5cb0778041a34f09b409a38c687bb1d4',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/mob-107-iphone-14-pro.jfif'
  },
  {
    id: 'mob-108', cat: 'Mobiles & Tablets', sub: 'Android Phones',
    brand: 'Blue3D', name: 'Samsung Galaxy S25',
    desc: 'A detailed 3D model of the samsung galaxy s25 — rotate and inspect it from every angle before you buy.',
    price: 284999, old: 324999, rating: 4.7, reviews: 259,
    uid: '947f8afe504c4a4ba605819248d3d2cf',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/Samsung Galaxy S25.jfif'
  },
  {
    id: 'mob-109', cat: 'Mobiles & Tablets', sub: 'Android Phones',
    brand: 'brightd', name: 'Samsung Galaxy S23 Ultra',
    desc: 'A detailed 3D model of the samsung galaxy s23 ultra — rotate and inspect it from every angle before you buy.',
    price: 389999, old: 439999, rating: 4.8, reviews: 131,
    uid: '2dac49c43d7349e1b68369627a581386',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/mob-109-samsung-galaxy-s23-ultra-prices-1-colors-sizes-features-specs.jfif'
  },
  {
    id: 'mob-110', cat: 'Mobiles & Tablets', sub: 'Android Phones',
    brand: 'DatSketch', name: 'Samsung Galaxy S22 Ultra',
    desc: 'A detailed 3D model of the samsung galaxy s22 ultra — rotate and inspect it from every angle before you buy.',
    price: 259999, old: 299999, rating: 4.6, reviews: 103,
    uid: 'a95eec5181a24bcd8a8452df50b29f3a',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/mob-110-restored-samsung-galaxy-s22-ultra-5g-sm-s908u1-128gb-black-us-model-fact.jfif'
  },
  {
    id: 'mob-111', cat: 'Mobiles & Tablets', sub: 'Android Phones',
    brand: 'DatSketch', name: 'Samsung Galaxy S21 Ultra',
    desc: 'A detailed 3D model of the samsung galaxy s21 ultra — rotate and inspect it from every angle before you buy.',
    price: 199999, old: 239999, rating: 4.6, reviews: 283,
    uid: 'cd962832be7744efb6b37fe0ee2027e7',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/mob-111-samsung-galaxy-s21-ultra-5g-phantom-black-12gb-256gb-storage.jfif'
  },
  {
    id: 'mob-112', cat: 'Mobiles & Tablets', sub: 'Android Phones',
    brand: 'DatSketch', name: 'Samsung Galaxy Z Flip 3',
    desc: 'A detailed 3D model of the samsung galaxy z flip 3 — rotate and inspect it from every angle before you buy.',
    price: 189999, old: 229999, rating: 4.7, reviews: 107,
    uid: '112947cbab7a4f708d0d01adb7d3fa3d',
    c1: '#e17055', c2: '#fab1a0',
    img: 'images/mob-112-samsung-samsung-galaxy-z-flip-4-512g-1sim-1esim-negro-falabella-chile.jfif'
  },
  {
    id: 'mob-113', cat: 'Mobiles & Tablets', sub: 'Android Phones',
    brand: 'DAKSH_2009', name: 'Samsung Phone (simple)',
    desc: 'A detailed 3D model of the samsung phone (simple) — rotate and inspect it from every angle before you buy.',
    price: 54999, old: 64999, rating: 4.4, reviews: 402,
    uid: '606d87c8f22d4e0ebbd45f2ab4e1cc15',
    c1: '#00b894', c2: '#55efc4',
    img: 'images/Samsung Galaxy A17 5G (2025) Dual SIM Smartphone 4GB+128GB - Blue & CUKTECH 60W 3A 0_5m USB-C to USB-C Fast Charge Cable - White Bundle [SM-A176BZBHXNZ 1QK].jfif'
  },
  {
    id: 'mob-114', cat: 'Mobiles & Tablets', sub: 'Tablets',
    brand: 'DatSketch', name: 'Apple iPad Pro 2020 (with Apple Pencil)',
    desc: 'A detailed 3D model of the apple ipad pro 2020 (with apple pencil) — rotate and inspect it from every angle before you buy.',
    price: 202999, old: 233999, rating: 4.4, reviews: 473,
    uid: 'e5ffb3c80b2d4d6690249f8ee2bdafbe',
    c1: '#0984e3', c2: '#74b9ff',
    img: 'images/mob-114-mob-ipad-pro-2020.png'
  },
  {
    id: 'mob-115', cat: 'Mobiles & Tablets', sub: 'Tablets',
    brand: 'polyman Studio', name: 'iPad Pro 13in Silver M4',
    desc: 'A detailed 3D model of the ipad pro 13in silver m4 — rotate and inspect it from every angle before you buy.',
    price: 376499, old: 418999, rating: 4.9, reviews: 470,
    uid: '8a113340443e49d3b905ab9f0b45efd6',
    c1: '#e84393', c2: '#fd79a8',
    img: 'images/Apple iPad Pro 13-inch M4 3D Max.jfif'
  },
  {
    id: 'mob-116', cat: 'Mobiles & Tablets', sub: 'Tablets',
    brand: 'dannzjs', name: 'iPad Pro 12 inches',
    desc: 'A detailed 3D model of the ipad pro 12 inches — rotate and inspect it from every angle before you buy.',
    price: 174999, old: 199999, rating: 4.6, reviews: 402,
    uid: '292cdc036701443385d0f68c530b7596',
    c1: '#fdcb6e', c2: '#ffeaa7',
    img: 'images/mob-116-ipad-pro-12-9-inches-2020-4th-gen-128-gb-wi-fi-space-gray.jfif'
  },
  {
    id: 'mob-117', cat: 'Mobiles & Tablets', sub: 'Tablets',
    brand: 'Mikko Maggie More', name: 'iPad Pro (Pre-2025)',
    desc: 'A detailed 3D model of the ipad pro (pre-2025) — rotate and inspect it from every angle before you buy.',
    price: 259999, old: 299999, rating: 4.7, reviews: 113,
    uid: 'ce4a50d9942240e1946776a8148b767f',
    c1: '#2d3436', c2: '#636e72',
    img: 'images/mob-117-mob-ipad-pro-m1.png'
  },
  {
    id: 'mob-118', cat: 'Mobiles & Tablets', sub: 'Tablets',
    brand: 'alexijohansen', name: 'iPad Pro 01',
    desc: 'A detailed 3D model of the ipad pro 01 — rotate and inspect it from every angle before you buy.',
    price: 199999, old: 229999, rating: 4.7, reviews: 368,
    uid: '469a8cc5cf1641fea47445e03f569e68',
    c1: '#00cec9', c2: '#81ecec',
    img: 'images/mob-118-mob-ipad-pro-m1.png'
  },
  {
    id: 'mob-119', cat: 'Mobiles & Tablets', sub: 'Tablets',
    brand: 'ArjB', name: 'Apple iPad Pro 2020 (ArjB version)',
    desc: 'A detailed 3D model of the apple ipad pro 2020 (arjb version) — rotate and inspect it from every angle before you buy.',
    price: 174999, old: 199999, rating: 4.7, reviews: 231,
    uid: '6c744f3da64247cfb2a0cbfeaf361c87',
    c1: '#6c5ce7', c2: '#a29bfe',
    img: 'images/mob-119-mob-ipad-pro-2020.png'
  },
];
