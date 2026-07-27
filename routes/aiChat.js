const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------
// POST /api/ai-chat
// Body:  { message: string, history?: [{role: 'user'|'model', text: string}] }
// Reply: { reply: string, products?: [{id, name, price, icon}] }
//
// This is what the frontend widget (ai-chat-widget.js) calls. It's mounted
// in server.js via:
//   const aiChatRoutes = safeRequire('./routes/aiChat', 'ai-chat');
//   if (aiChatRoutes) app.use('/api/ai-chat', aiChatRoutes);
//
// If this file is missing, server.js logs a warning and skips mounting the
// route — every page's widget then gets a 404/network error, which is why
// "connect from all pages" wasn't working. Dropping this file in
// backend/routes/aiChat.js fixes that.
// ---------------------------------------------------------------------------

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Any current Groq-hosted model works here; swap if this one is retired.
const MODEL = 'llama-3.1-8b-instant';

// ---------------------------------------------------------------------------
// SITE KNOWLEDGE
// ---------------------------------------------------------------------------
// This is a point-in-time snapshot of the product-data.js catalog (all 211
// products across 18 categories), turned into plain text so the assistant
// can be given it directly instead of guessing at what the store sells.
//
// IMPORTANT: this is a SNAPSHOT, not a live read of product-data.js. If you
// add/remove/reprice products, regenerate this block so the assistant stays
// in sync. (Ask Claude to "update the AI catalog in aiChat.js from the
// latest product-data.js" and it can regenerate this whole block for you.)
// ---------------------------------------------------------------------------
const CATALOG_TEXT = `
### Automotive (14 products)
- Car Engine (brand: klaxoneer) — Rs 18,081 [id: aut-101]
- Race Car Tire (brand: Madin Productions) — Rs 37,733 [id: aut-102]
- Car Tire (brand: BannedSteak) — Rs 55,328 [id: aut-103]
- Car Wheels and Tire (brand: MMC Works) — Rs 40,988 [id: aut-104]
- Sport Tire Pack (Free) (brand: SDC PERFORMANCE) — Rs 37,091 [id: aut-105]
- Car Disc Brake (brand: Joko_P) — Rs 28,865 [id: aut-106]
- Car Wheel with Brake Disc (brand: MMC Works) — Rs 11,409 [id: aut-107]
- Car Steering Wheel (brand: peel-3d.com) — Rs 39,470 [id: aut-108]
- Racing Steering Wheel (Free) (brand: Robert Prispilović) — Rs 31,119 [id: aut-109]
- Steering Wheel (High Poly) (brand: ImGreenWolf) — Rs 49,048 [id: aut-110]
- Motorcycle Helmet – Racing Helmet (brand: ramyouny) — Rs 38,472 [id: aut-111]
- Retro Motorcycle Helmet (brand: 13baym) — Rs 48,144 [id: aut-112]
- Motorcycle (Stylized) (brand: animanyarty) — Rs 23,552 [id: aut-113]
- Racing Helmet – SC04 (brand: SDC PERFORMANCE) — Rs 38,022 [id: aut-114]

### Bags & Luggage (8 products)
- Travel Bag (brand: holgcool) — Rs 3,403 [id: bl-101]
- Suitcase (brand: Mehmet Ozturk) — Rs 47,563 [id: bl-102]
- Backpack (brand: MadeByYeshe) — Rs 60,070 [id: bl-103]
- Woman Bag (brand: Alexxa) — Rs 16,691 [id: bl-104]
- Handbag (brand: Matyts) — Rs 20,644 [id: bl-105]
- Wallet (brand: apleesee) — Rs 31,242 [id: bl-106]
- Tote Bag (brand: keithfrost) — Rs 60,265 [id: bl-107]
- Old Wallet (Realistic) (brand: Sergey Filin) — Rs 58,386 [id: bl-108]

### Beauty & Care (9 products)
- Lipstick (brand: neeb17) — Rs 18,501 [id: bc-101]
- Makeup Cosmetics Set (brand: yzy_blog) — Rs 54,816 [id: bc-102]
- Perfume Bottle (brand: alshifan) — Rs 6,797 [id: bc-103]
- Cosmetics Cream Jar (brand: BIKRAM6372) — Rs 59,656 [id: bc-104]
- Cosmetic Bottle (brand: Jozsef Hocza) — Rs 23,299 [id: bc-105]
- Skincare Packaging (Tube, Jar & Cream Bottle Set) (brand: ProductViz) — Rs 59,687 [id: bc-106]
- Shampoo Bottle (brand: packing pro) — Rs 45,839 [id: bc-107]
- Hair Dryer (brand: sweedboy69) — Rs 9,825 [id: bc-108]
- Sunsilk Shampoo Bottle (brand: Samer_Arab_S5) — Rs 14,167 [id: bc-109]

### Books & Stationery (10 products)
- Note Book [2K] (brand: Lyndschoko) — Rs 52,203 [id: bs-101]
- Book and Pencil Set (brand: rikugo.studio) — Rs 43,754 [id: bs-102]
- Cartoon Notebook & Pencil (brand: Vanillain) — Rs 6,138 [id: bs-103]
- Luxury Pen (brand: dylanheyes) — Rs 34,455 [id: bs-104]
- Pencil (brand: farooq.smurf) — Rs 56,623 [id: bs-105]
- Stationery Pack (brand: morrrtu1o) — Rs 40,855 [id: bs-106]
- Stapler (brand: RoyalBlond) — Rs 30,035 [id: bs-107]
- Scissors (brand: Ярослав) — Rs 19,735 [id: bs-108]
- Eraser (brand: Mr.Photon) — Rs 5,710 [id: bs-109]
- School Backpack (brand: MadeByYeshe) — Rs 9,096 [id: bs-110]

### Electronics (14 products)
- Smartwatch (brand: _tegarma) — Rs 41,283 [id: elc-101]
- Smart Watch (brand: Jonathan Comonal) — Rs 47,649 [id: elc-102]
- Headphones (brand: Randomewe) — Rs 32,223 [id: elc-103]
- Wireless Earbuds (brand: MetaCreators) — Rs 4,184 [id: elc-104]
- Headphones (Realistic) (brand: Valerij Dančenko) — Rs 27,277 [id: elc-105]
- Basic PC Monitor (brand: stratt3000) — Rs 45,253 [id: elc-106]
- CRT Monitor (brand: James.Harness) — Rs 33,960 [id: elc-107]
- Bluetooth Speaker (brand: GeniusPilot2016) — Rs 12,288 [id: elc-108]
- JBL Speaker (brand: kathir95) — Rs 49,387 [id: elc-109]
- Marshall Bluetooth Speaker (brand: Windshear_3D) — Rs 5,880 [id: elc-110]
- Mouse and Keyboard (brand: gorzi) — Rs 48,783 [id: elc-111]
- Gaming Mechanical Keyboard & Mouse (brand: RMrando) — Rs 33,471 [id: elc-112]
- Mechanical Keyboard (brand: Flexryhe) — Rs 12,343 [id: elc-113]
- Gaming Keyboard (brand: Venyy) — Rs 52,662 [id: elc-114]

### Footwear (11 products)
- Shoe Model | Realistic 3D Sneaker (brand: Taohid Animation) — Rs 10,406 [id: ftw-101]
- Stylized Shoes (brand: 3dbysam) — Rs 15,421 [id: ftw-102]
- Sneakers (brand: dilium) — Rs 23,969 [id: ftw-103]
- Vans Shoe (brand: James) — Rs 5,427 [id: ftw-104]
- Low-poly Shoe (brand: ThimovanNimwegen) — Rs 52,320 [id: ftw-105]
- Cartoon Shoes (brand: AlexiaCarmona) — Rs 13,433 [id: ftw-106]
- Leather Shoes (brand: nguyenthiutminh0402) — Rs 40,065 [id: ftw-107]
- Men's Formal Shoes – Realistic (brand: rajprajapat847) — Rs 15,568 [id: ftw-108]
- High Heel Boots (brand: Toxic) — Rs 48,138 [id: ftw-109]
- Military Boots (brand: DailyArt) — Rs 44,272 [id: ftw-110]
- Cartoon Shoes/Boots (brand: Safina Irani) — Rs 23,911 [id: ftw-111]

### Furniture (14 products)
- Wooden Table and Chair (brand: Seyed Mohsen) — Rs 22,179 [id: fur-101]
- Couch/Sofa Set (brand: Blaž Mraz) — Rs 59,258 [id: fur-102]
- Sofa (Free Version) (brand: PolyCraftSutdios) — Rs 60,604 [id: fur-103]
- L Shape Sofa (brand: Unknown Space) — Rs 28,209 [id: fur-104]
- Cafe Chair (brand: CuongNguyen_Owen) — Rs 19,696 [id: fur-105]
- Bookshelf (brand: gchandan868) — Rs 17,795 [id: fur-106]
- Dusty Old Bookshelf (Free) (brand: Brandon Westlake) — Rs 26,457 [id: fur-107]
- Coffee Table (brand: Igrium) — Rs 43,738 [id: fur-108]
- Retro Wood Coffee Table (brand: Jacob Smith) — Rs 25,940 [id: fur-109]
- Victorian Bookshelf (brand: Okapiguy) — Rs 36,993 [id: fur-110]
- Luxury Wardrobe Closet (brand: zeroual.elmehdi) — Rs 18,718 [id: fur-111]
- Wardrobe with Sliding Doors (brand: oxxycodone) — Rs 58,633 [id: fur-112]
- Closet – Wardrobe and Vanity Set (brand: Lehmann007) — Rs 6,925 [id: fur-113]
- Sliding Wardrobe (brand: Abideen) — Rs 5,796 [id: fur-114]

### Groceries (12 products)
- Grocery Bag (brand: Antoine Dresen) — Rs 7,692 [id: grc-101]
- Fruit and Veg Box (brand: AndyofShogun) — Rs 31,325 [id: grc-102]
- Cereal Box (brand: Owlish Media) — Rs 55,344 [id: grc-103]
- Fruit and Vegetable Rack (brand: Geksaedr) — Rs 50,704 [id: grc-104]
- Shopping Bag (brand: NoLagHere) — Rs 33,741 [id: grc-105]
- Milk Carton (brand: Tiago Oliveira) — Rs 14,295 [id: grc-106]
- Juice Carton Box (brand: mfyma) — Rs 46,231 [id: grc-107]
- Canned Food (brand: endbored) — Rs 52,848 [id: grc-108]
- New Juice Bottle (brand: Mashood_) — Rs 34,920 [id: grc-109]
- Verstegen Spice Jar (brand: Cygnos) — Rs 45,233 [id: grc-110]
- Egg Box (brand: Antoine Dresen) — Rs 20,022 [id: grc-111]
- Metal 6-Jar Spice Rack (brand: cirax-we) — Rs 34,825 [id: grc-112]

### Home & Kitchen (21 products)
- Kitchen Utensils (brand: Simal Mai) — Rs 52,642 [id: hk-101]
- Low Poly Set of Kitchen Utensils (brand: Studio 23) — Rs 39,373 [id: hk-102]
- Kitchen Design Set V.001 (brand: Kiem Truong) — Rs 14,973 [id: hk-103]
- Modern Kitchen (brand: Visthétique) — Rs 19,899 [id: hk-104]
- Kitchen Appliances (brand: Nicolai Kilstrup) — Rs 57,226 [id: hk-105]
- Toaster (brand: extrin6 3D) — Rs 8,915 [id: hk-106]
- Smeg Toaster (Retro) (brand: The Fresh Lab) — Rs 17,269 [id: hk-107]
- Dinner Plate (brand: Amythyst Willis) — Rs 26,724 [id: hk-108]
- White Ceramic Plate (brand: sterost) — Rs 35,854 [id: hk-109]
- Refrigerator (Old Worn Fridge) (brand: lagesnpiet) — Rs 60,707 [id: hk-110]
- Retro Fridge (brand: dylanheyes) — Rs 43,179 [id: hk-111]
- Microwave Oven (brand: Fantom Matter) — Rs 12,496 [id: hk-112]
- Oven, Microwave and Winecooler Set (brand: lutz_westerfeld) — Rs 48,633 [id: hk-113]
- Basic Fridge (brand: KodaWowo) — Rs 12,390 [id: hk-114]
- Cusimax Sleek 4-Slice Toaster — Stainless Steel (brand: Cusimax) — Rs 15,287 [id: hk-115]
- Comfee 700W 20L White Microwave Oven (brand: Comfee) — Rs 16,677 [id: hk-116]
- Smeg 2-Slice Toaster — Pastel Green (brand: Smeg) — Rs 47,257 [id: hk-117]
- Smeg 2-Slice Toaster — Jade (brand: Smeg) — Rs 47,257 [id: hk-118]
- Smeg 2-Slice Toaster — Sage Green (brand: Smeg) — Rs 50,037 [id: hk-119]
- LG GL-C652HLCM Top Freezer Refrigerator (brand: LG) — Rs 125,097 [id: hk-120]
- Big Chill Retro Top Freezer Refrigerator — White (brand: Big Chill) — Rs 694,722 [id: hk-121]

### Jewelry & Eyewear (9 products)
- Jewelry Ring (brand: YaMoMoYa) — Rs 24,475 [id: je-101]
- Necklace (brand: maximmus) — Rs 48,514 [id: je-102]
- Free Sunglasses Set (Low Poly) (brand: Berk Gedik) — Rs 9,538 [id: je-103]
- Cool Shades (Sunglasses) (brand: jenardo) — Rs 6,119 [id: je-104]
- Eyeglasses (Specs) (brand: Pratham.Bhatnagar) — Rs 19,101 [id: je-105]
- Gold Jewelry Set (Necklace & Earrings) (brand: Jlindbe) — Rs 45,386 [id: je-106]
- Silver Earrings Diamond (brand: relaxnoname) — Rs 7,006 [id: je-107]
- Elven Bracelet (brand: allanoraphael) — Rs 34,500 [id: je-108]
- Diamond (brand: waveus) — Rs 47,063 [id: je-109]

### Kids & Baby (7 products)
- Baby Stroller (brand: fernand_artt) — Rs 57,668 [id: kb-101]
- Baby Crib (brand: amanduca) — Rs 13,494 [id: kb-102]
- Lego Baby Toy (brand: DURVESH S) — Rs 36,874 [id: kb-103]
- Baby Crib (Themed) (brand: 8N Films Official) — Rs 49,089 [id: kb-104]
- Baby High Chair (brand: Balen96) — Rs 55,444 [id: kb-105]
- Building Blocks Toy (brand: pibini modeling) — Rs 10,039 [id: kb-106]
- Kids Chair (brand: MaX3Dd) — Rs 52,770 [id: kb-107]

### Laptops & PCs (6 products)
- MacBook Pro 14-inch M5 (brand: Apple User) — Rs 44,839 [id: lap-101]
- MacBook Air M2 (brand: rtql8d) — Rs 49,631 [id: lap-102]
- MacBook Pro M3 16 inch 2024 (brand: jackbaeten) — Rs 26,616 [id: lap-103]
- Macbook Pro 13 inch 2020 (brand: timblewee) — Rs 21,690 [id: lap-104]
- Apple MacBook Pro (Low Poly) (brand: Andrey3Dev) — Rs 55,361 [id: lap-105]
- Macintosh (Retro PC) (brand: Kesenkai) — Rs 15,407 [id: lap-106]

### Men's Fashion (5 products)
- Traditional Indian Kurta with Vest (brand: abot86) — Rs 52,942 [id: mf-101]
- Male Pants (Jeans) (brand: Alexander Kurmanin) — Rs 20,024 [id: mf-102]
- Hoodie (brand: ShoyoX) — Rs 17,436 [id: mf-103]
- Men's Formal Suit (brand: black2.o) — Rs 46,918 [id: mf-104]
- Basic T-Shirt and Pants (brand: Arsen Ismailov) — Rs 28,676 [id: mf-105]

### Mobiles & Tablets (19 products)
- iPhone 16 (brand: Wes) — Rs 331,198 [id: mob-101]
- iPhone Air (brand: rtql8d) — Rs 190,736 [id: mob-102]
- iPhone 17 Pro (brand: Ranguel) — Rs 220,487 [id: mob-103]
- iPhone 16 Pro Max (brand: MajdyModels) — Rs 134,494 [id: mob-104]
- Apple iPhone 13 Pro Max (brand: DatSketch) — Rs 225,717 [id: mob-105]
- iPhone 13 Pro (brand: DatSketch) — Rs 107,175 [id: mob-106]
- iPhone 14 Pro (brand: mister dude) — Rs 168,243 [id: mob-107]
- Samsung Galaxy S25 (brand: Blue3D) — Rs 130,927 [id: mob-108]
- Samsung Galaxy S23 Ultra (brand: brightd) — Rs 206,896 [id: mob-109]
- Samsung Galaxy S22 Ultra (brand: DatSketch) — Rs 123,860 [id: mob-110]
- Samsung Galaxy S21 Ultra (brand: DatSketch) — Rs 259,788 [id: mob-111]
- Samsung Galaxy Z Flip 3 (brand: DatSketch) — Rs 168,982 [id: mob-112]
- Samsung Phone (simple) (brand: DAKSH_2009) — Rs 87,256 [id: mob-113]
- Apple iPad Pro 2020 (with Apple Pencil) (brand: DatSketch) — Rs 233,070 [id: mob-114]
- iPad Pro 13in Silver M4 (brand: polyman Studio) — Rs 250,564 [id: mob-115]
- iPad Pro 12 inches (brand: dannzjs) — Rs 154,385 [id: mob-116]
- iPad Pro (Pre-2025) (brand: Mikko Maggie More) — Rs 189,485 [id: mob-117]
- iPad Pro 01 (brand: alexijohansen) — Rs 190,085 [id: mob-118]
- Apple iPad Pro 2020 (ArjB version) (brand: ArjB) — Rs 229,264 [id: mob-119]

### Pet Supplies (8 products)
- Pet Bowl (brand: furkandgn) — Rs 23,711 [id: ps-101]
- Basic Cat Bed (brand: dojarico) — Rs 51,196 [id: ps-102]
- Dog Bed (brand: nicknothom) — Rs 9,224 [id: ps-103]
- Dog Bowl (brand: Zambur) — Rs 31,956 [id: ps-104]
- Dog Leash (brand: josephcan232) — Rs 12,371 [id: ps-105]
- Cat Scratching Post (brand: alyblue10) — Rs 49,345 [id: ps-106]
- Cat Carrier (brand: afiey.lab) — Rs 56,056 [id: ps-107]
- Pink Cat Scratching Post (brand: Mickanside) — Rs 18,873 [id: ps-108]

### Sports & Outdoors (12 products)
- ProSwing Carbon-Fiber Tennis Racket (brand: ProSwing) — Rs 16,677 [id: so-101]
- CourtKing Official Size Basketball (brand: CourtKing) — Rs 6,947 [id: so-102]
- TrailPeak 40L Hiking Backpack (brand: TrailPeak) — Rs 20,847 [id: so-103]
- TrailPeak Everyday Daypack (brand: TrailPeak) — Rs 12,507 [id: so-104]
- Camping Tent (brand: muhdhafiynaim) — Rs 37,007 [id: so-201]
- Modern Camping Tent (brand: Guy in a Poncho) — Rs 16,583 [id: so-202]
- Football (brand: brbrgobr) — Rs 16,508 [id: so-203]
- Hex Dumbbell 10kg (brand: Salim Rached) — Rs 12,899 [id: so-204]
- Dumbbells (brand: donnichols) — Rs 51,002 [id: so-205]
- Cricket Bat (brand: omkar.jawake) — Rs 54,555 [id: so-206]
- Badminton Racket (brand: farooq.smurf) — Rs 53,729 [id: so-207]
- Tennis Racket (brand: Yanez Designs) — Rs 4,573 [id: so-208]

### Toys & Games (19 products)
- CuddleCo Classic Plush Teddy Bear (brand: CuddleCo) — Rs 5,001 [id: tg-101]
- BrainSpin Speed Cube 3x3 Puzzle (brand: BrainSpin) — Rs 2,777 [id: tg-102]
- ZoomWorks Die-Cast Toy Car (brand: ZoomWorks) — Rs 3,611 [id: tg-103]
- ZoomWorks Remote Control Racer (brand: ZoomWorks) — Rs 9,727 [id: tg-104]
- Teddy Bear (brand: theacidrose) — Rs 17,094 [id: tg-201]
- Rubik's Cube (brand: FromSi) — Rs 17,517 [id: tg-202]
- Rubik's Cube 3D Model (Detailed) (brand: PragadeshR) — Rs 55,820 [id: tg-203]
- Rubik's Cube (DatSketch) (brand: DatSketch) — Rs 30,447 [id: tg-204]
- Teddy Bears (Set) (brand: hectopod) — Rs 42,823 [id: tg-205]
- LEGO Race Car MOC (brand: The Bobby Brix Channel) — Rs 48,972 [id: tg-206]
- Lego Bricks (Set) (brand: Dixept) — Rs 25,448 [id: tg-207]
- Lego Brick (brand: the giggler blender) — Rs 28,779 [id: tg-208]
- Lego Car (brand: XEN3d) — Rs 58,124 [id: tg-209]
- Lego Minifigures (brand: FaceTheEdge) — Rs 15,329 [id: tg-210]
- RC Controller (brand: gorzi) — Rs 32,240 [id: tg-211]
- Robot Drone  (brand: SDC PERFORMANCE) — Rs 22,145 [id: tg-212]
- Toy Robot (brand: mortaleiros) — Rs 42,095 [id: tg-213]
- Toy Drone (brand: Rohit3DAsset) — Rs 21,826 [id: tg-214]
- Robot No.1 (Rigged/Animated) (brand: ndnguyen3d) — Rs 35,167 [id: tg-215]

### Watches (13 products)
- Aurelia Classic Steel Chronograph (brand: Aurelia) — Rs 25,017 [id: wch-101]
- Nordane Heritage Leather-Strap Watch (brand: Nordane) — Rs 18,067 [id: wch-102]
- Voltrix Pro Sports Chronograph — Green Dial (brand: Voltrix) — Rs 33,357 [id: wch-103]
- Lumen Everyday Slim Wrist Watch (brand: Lumen) — Rs 11,117 [id: wch-104]
- Rolex Watch (brand: sudo-self) — Rs 31,336 [id: wch-201]
- Stainless Steel Analog Watch (brand: render-lab) — Rs 20,336 [id: wch-202]
- Modern Analog Watch (brand: Taohid Animation) — Rs 26,707 [id: wch-203]
- Wrist Watch (brand: Lazaran) — Rs 49,139 [id: wch-204]
- Digital Watch (brand: SpatialNeglect) — Rs 20,400 [id: wch-205]
- Casio Digital Watch (brand: Aficionado) — Rs 50,938 [id: wch-206]
- Casio Watch A158 (brand: RYBY_DLA_DEBILI) — Rs 9,166 [id: wch-207]
- Casio F-91W (brand: zachernuk) — Rs 37,750 [id: wch-208]
- Futuristic Smartwatch (brand: Aditya31641) — Rs 59,058 [id: wch-209]`;

const SITE_POLICIES = `
STORE POLICIES & FEATURES (Smart Choice 3D):
- Currency: all prices are in Pakistani Rupees (PKR / "Rs").
- Shipping: FREE delivery on orders over Rs 20,000. Below that, standard shipping is Rs 500.
- Every single product can be viewed and rotated in interactive 3D on its product page before buying.
- Shoppers can create an account, log in, add items to a Cart, save items to a Wishlist, and check out.
- Checkout collects name, phone number (local "0..." or international "+92..." / WhatsApp format), email, address, city, and zip code.
- Order history and profile info are available under "My Account" once logged in.
- If a shopper asks about something outside this catalog or these policies (e.g. a brand/product we don't carry), say plainly that Smart Choice 3D doesn't carry that rather than guessing.
`;

// Splits CATALOG_TEXT into { header, block } chunks per "### Category" section,
// so we can pick out only the categories/products relevant to what the
// shopper actually asked about, instead of sending the whole 211-product
// catalog (which alone is ~6500 tokens and blows past Groq's free-tier
// 6000 TPM limit) on every single message.
const CATALOG_SECTIONS = CATALOG_TEXT
  .split(/\n(?=### )/)
  .map((block) => block.trim())
  .filter(Boolean);

// Picks a small, relevant slice of the catalog for this message:
// - sections whose category name or product lines match a keyword in the message
// - if nothing matches, falls back to a short generic sample (first few
//   items from a handful of sections) so the assistant still has *something*
//   to talk about, without ever sending the full catalog.
function buildCatalogBlock(message) {
  const words = String(message || '')
    .toLowerCase()
    .match(/[a-z0-9]{3,}/g) || [];

  const MAX_CHARS = 3500; // keeps prompt well under the TPM limit

  let matched = [];
  if (words.length) {
    matched = CATALOG_SECTIONS.filter((section) => {
      const lower = section.toLowerCase();
      return words.some((w) => lower.includes(w));
    });
  }

  let chosen = matched.length ? matched : CATALOG_SECTIONS.slice(0, 4);

  let block = chosen.join('\n\n');
  if (block.length > MAX_CHARS) {
    block = block.slice(0, MAX_CHARS) + '\n... (catalog trimmed, more available on the site)';
  }
  return block;
}

function buildSystemPrompt(message) {
  return `You are the official shopping assistant for Smart Choice 3D — you were built
by the people who founded and run this store, so you know it inside and out.
Smart Choice 3D is an online store where every product can be viewed and
rotated in 3D before buying, with 211 products across 18 categories (only a
relevant slice of the catalog is shown to you below for this message). Be
friendly, concise (2-4 sentences unless the shopper asks for detail), and
focused on helping them find or compare products, answer sizing/material
questions, explain store policies, and guide them toward checkout. Speak with
the confidence of someone who actually knows the catalog and policies below —
don't hedge or say "I'm not sure" about anything that's listed here. If the
shopper's question doesn't match the products shown below, say Smart Choice 3D
may carry it but suggest they browse categories or use site search rather
than guessing at specifics.
${SITE_POLICIES}
RELEVANT PRODUCTS FOR THIS MESSAGE:
${buildCatalogBlock(message)}
`;
}

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        error: 'AI chat is not configured yet. Add GROQ_API_KEY to your .env file.'
      });
    }

    // Turn the widget's short-term history into chat messages Groq expects.
    // Kept short (last 4 turns, 500 chars each) so history can't blow up the
    // token count alongside the catalog block.
    const priorTurns = Array.isArray(history)
      ? history.slice(-4).map((turn) => ({
          role: turn.role === 'user' ? 'user' : 'assistant',
          content: String(turn.text || '').slice(0, 500)
        }))
      : [];

    const messages = [
      { role: 'system', content: buildSystemPrompt(message) },
      ...priorTurns,
      { role: 'user', content: message.slice(0, 500) }
    ];

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 400
      })
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text().catch(() => '');
      console.error('[ai-chat] Groq API error:', groqRes.status, errBody);
      return res.status(502).json({ error: 'The assistant is temporarily unavailable. Please try again.' });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'The assistant returned an empty response. Please try again.' });
    }

    // Hook point: if you want the assistant to surface product cards,
    // look products up here (e.g. from your Product model) based on the
    // conversation and return them as `products`. Left empty until wired up.
    return res.json({ reply, products: [] });
  } catch (err) {
    console.error('[ai-chat] Unexpected error:', err);
    return res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
  }
});

module.exports = router;
