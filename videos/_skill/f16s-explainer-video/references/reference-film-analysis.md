# Reference: Video-23373 — Few Shot Studio, "System Design · 018" (Flipkart Minutes)

160 s, 720×1280, Hinglish voiceover. Analysed with hypit (`media probe`, `boundaries`, `tile`);
transcript by Whisper (`transcript.json`, hypit.transcript@1). Evidence grids in `evidence/`.

## What it is

How a 10-minute grocery delivery actually works, told through **one carton of milk** for one
person's morning: chai on the stove → milk ran out → order on the app → delivered → *"Itni jaldi
kaise?"* (How so fast?) → the system behind it → back to the same pot of chai, which now makes sense.

## Why it holds attention

1. **It opens on a life moment, not the topic.** Frame 0 is a pot of water boiling on a gas stove at
   "Subah 7:00 AM". The empty fridge, the phone order and "Delivered" follow in 7 s, and only then
   comes the question. The viewer is inside the story before the subject is named.
2. **One continuous world, and the camera travels through it.** `boundaries` finds almost no hard cuts
   between 9 s and 107 s. The camera rides behind the delivery rider on the street, tilts up into a
   top-down map where the route draws itself (STORE → HOME, "~2 km"), dives into the city, enters the
   dark store and walks down its aisle. Every new idea is a **place the camera moves to**, not a new slide.
3. **Ideas are drawn on top of the world, in the world's own geometry.** The geofence is a polygon
   that grows outward from the store over the real city blocks (33.5–39 s), then its edge strokes in
   yellow. The spatial index is a grid laid over the same map. Demand data becomes 30 bars standing
   **inside the warehouse aisle**, growing left to right, with a stock line and the over-the-line bars
   turning red. The abstraction always sits on the thing it describes.
4. **"THIS IS CALLED ___" cards name the concept after you've seen it.** The picture explains first;
   then a small card names it: *Dark store*, *Geofence* ("the boundary of a store's area"),
   *Spatial index*, *Point-in-polygon*, *Distributed transaction*, *Planogram*, *Safety stock*. One
   layout every time: tiny caps eyebrow "THIS IS CALLED", the term big, a one-line plain meaning.
5. **Small mono labels tag everything in place:** HOME, STORE, YOU, 6 MIN RIDE, ~2 KM, STOCK · 40,
   GUESS · 22 PACKETS. Numbers live on the objects, not in a list.
6. **Questions in the viewer's voice drive each section:** "Itni jaldi kaise?", "Bike start hone se
   pehle", "Tumhara doodh wahan tha hi kyun?" (Why was your milk even there?). These are big caption
   cards with the keyword highlighted.
7. **One accent colour does the pointing.** Navy world, yellow for whatever is active (the route, the
   polygon edge, the current bar, the term), red only for failure (ONE BY ONE = SLOW, short days).
8. **A small series bar never moves:** "SYSTEM DESIGN · 018" and the handle, top corners. Every episode
   is recognisably the same show.
9. **It ends where it started.** The last shot is the same pot of chai, now with the numbers that got
   the milk there (40 short on 14 of 30 mornings, ~10 packets left a day), then the studio card.

## What we take for "Who pays when your cargo is late?" — and what we leave

Keep our look (the landing page's palette and type); take the **structure and the camera grammar**.

| Reference does | Ours should do |
|---|---|
| Opens on a person's morning (chai, 7 AM) | Open on a person: the exporter in their shop at 7 PM, packing the phones for tomorrow's flight. Time tag "Tuesday · 7:00 PM". |
| One world, camera moves through it | One world: **the shop → the airport cargo terminal → the tarmac → the plane**. The camera follows the box (on the cart, through the terminal) instead of cutting to new white slides. Each explanation is a stop along that journey. |
| Route draws itself on a top-down map | Tilt up to a map: Mumbai → Frankfurt, the flight path draws itself, the plane icon stops halfway with "DELAYED · 48 H". |
| Concept drawn on the real thing (geofence on the city) | Draw on the real thing: the air waybill appears **taped to the box itself**; the camera pushes into its declared-value field. The 26 SDR limit is a line drawn across a stack of **100 one-kilo blocks** that is the box's weight. |
| "THIS IS CALLED ___" card after the picture | Same device for our terms: *Air waybill* ("your cargo's plane ticket"), *Contract of carriage*, *NVD* ("no value declared"), *SDR* ("the IMF's basket currency"), *Declared value*, *Cargo insurance*. |
| Mono tags on objects | Tags on our objects: 100 KG, ₹44 LAKH, DAY 2, 21 DAYS, ~₹3 LAKH. |
| Questions in the viewer's voice | Caption cards for the turns: "Toh paisa kaun dega?"-style questions in English: *"So who pays?"*, *"Wait, per kilo?"*, *"What can you do?"* |
| Bars inside the warehouse aisle | Our ₹3 lakh vs ₹44 lakh as two stacks of notes standing **on the tarmac next to the box**, not on a blank page. |
| Ends on the same pot | End on the same shop: the exporter fills the declared-value box before the next shipment. |
| Series bar top corners | "CARGO, EXPLAINED · 01" and f16sefreight.com, small, kept inside the grid-safe area. |

Leave: the navy/3D render style, the yellow accent and Hinglish (not ours), the server racks.
