You have the skill `f16s-explainer-video`. It is for one job only: the F16s video pipeline. Use it
only for F16s "Cargo, explained" videos. For any other video, brand or task, don't use it.

WHAT IT DOES
It makes "Cargo, explained" episodes for F16s (f16sefreight.com, freight-forwarding software): short
explainer reels that teach how freight really moves by air, sea and road, and how freight forwarding
works, for ordinary people as well as logistics professionals.

THE VIDEO
- Format: 9:16 Instagram reel, 1080×1920, 30 fps MP4, about 90–120 seconds, Instagram-grid-safe,
  nothing leaving the frame.
- Picture: one 3D world (Three.js) the camera flies through, station by station: an airport, a port
  with containers and ships, a highway with trucks, a warehouse or a customs counter, depending on the
  topic. One hero object carries the story (a box, a container, a truckload). Every spoken idea is shown
  as moving objects (a worker loading phones, a crane lifting a container, a truck waiting at a border,
  a box turning into 100 one-kilo cubes). Tags sit on the objects, "This is called" cards name each
  term, question cards open each turn, and captions are burned in. Warm palette from the f16s website
  (charcoal, slate, greys, peach, coral, a little blue), Inter type. It ends with the F16s logo and the
  f16sefreight.com button.
- Script: plain language. A hook with a real situation (a shipment, its weight or size, its value in $
  and ₹ lakh), then "Let me explain.", then simple signposted steps. Every term is explained the first
  time it's said; anything too complex becomes "That's part two." It closes with "More at F-sixteens
  e-freight dot com." The script is always shown for approval before anything is recorded or built.
- Voice: Kokoro, female voice af_heart, tight pacing, the brand said as "F-sixteens".
- Sound: no music. Soft effects on the on-screen actions, never on top of key words, at most one low
  hit. Final mix at −14 LUFS.

SUGGESTED TOPICS

Air
- Who pays when your cargo is late? (episode 01, done)
- Declared value or insurance: which costs less? (episode 02, promised as "part two")
- Can you fly a loved one's ashes or body home?
- Why does Hong Kong cost so much to ship to?
- When the forwarder, not the airline, is responsible (MAWB vs HAWB)
- Chargeable weight: why a big light box is billed like a heavy one
- Lithium batteries and dangerous goods
- Cold chain for vaccines and pharma
- What an air waybill really is
- What a ULD is

Sea
- What a 20 ft or 40 ft container really holds (TEU, FCL vs LCL)
- The bill of lading: the paper that owns your cargo
- Demurrage and detention: why containers cost money for sitting still
- Why shipping rates jump overnight (Red Sea, port congestion, blank sailings)
- General average: when a ship's emergency becomes your bill
- How a reefer keeps fruit cold across an ocean
- Who pays when goods are damaged at sea

Road
- FTL vs LTL: renting a whole truck or a share of one
- The e-way bill: why your truck needs one in India
- How a truck crosses a border (CMR note, customs, transit)
- The last mile: why the final few kilometres cost the most
- Who pays when goods are damaged on the road

Across modes
- Air, sea or road: how to choose (cost vs speed vs risk)
- Incoterms in one minute: who pays, who carries the risk (FOB, CIF, DDP)
- Why a parcel waits at customs (duties, HS codes, paperwork)
- Courier vs freight forwarder vs carrier: who does what
- Fuel and security surcharges: why the price isn't one number
- Live animals in transit

OPEN SOURCE THIS SKILL USES (all local on this laptop)
- HyperFrames (HeyGen): HTML-to-video preview, check, snapshot and render, via `npx hyperframes`
- Three.js: the 3D world
- GSAP: overlay animation
- Kokoro TTS (kokoro-fastapi, Docker container `kokoro-tts`, port 8880): voiceover with word timestamps
- earshot: sound-design rules
- hypit: analysing reference videos
- OpenAI Whisper: transcribing reference videos
- ffmpeg: loudness and frame checks
