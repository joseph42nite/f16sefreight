# What the person asked for, round by round (episode 01)

Read this before writing anything. Each line is a correction they had to make.

1. Wanted explainer videos for F16s; landing page design as the style. → OK.
2. "It has to have a voice over, use Kokoro" + "first show me the script" + after the hook "a line like *Let me explain*". → script-first rule, Kokoro, hook shape.
3. 16:9 text-and-document cut rejected: "make it 9:16, Insta reel… you have to make **motion graphics**… show the tarmac and the warehouse… take design elements from the landing page, nothing else."
4. Flat reel: "too many sub booms" (study earshot); "animation looks really basic, not guiding me through the process"; "when you say SDR, explain what it is"; "in the end mention f16sefreight.com"; "make the script simple… leading lines to guide the user"; "if explaining in USD, mention INR"; "target normal people… any concept that can't be understood, tell what it means, or say we have a part 2".
5. "No need of music in the background."
6. "It's f16s, not F16 S" (say "F-sixteens"); "remove the pauses"; "add more SFX".
7. "When the customer says I want the money back, show a phone"; "make sure it is Insta grid safe"; the IMF card words touched the edges; "why is there a Ticket / Limit / Clock / Protect on top?" (rejected); "the word PHONES is not clear with the background"; "the screen is too empty… show it moving on a conveyor belt or a stick figure adding the phone… *leading lines* means visual movement so it's not boring".
8. Studied a pro reference with hypit (Few Shot Studio "System Design 018"): one continuous world, the camera travels, ideas drawn on objects, "This is called" cards, it ends where it began.
9. "The whole video looks too blue + you didn't change the perspective, it still looks 2D." → real 3D (Three.js), warmer palette from the site's illustrations.
10. "Show me first, locally run HyperFrames" → preview before building everything; offered the desktop app.
11. "Make sure it is not going out of the frame" (they meant 1:07). → clamp tags, reframe cameras, sweep.

Process notes: they reject web searches done without asking; they like to see a look test before a big
rebuild; they review in the HyperFrames desktop app; renders go to `renders/` and are normalised to −14 LUFS.
- "lakh" must sound short (lˈæk), not "laakh" — use the phoneme override (Ep 02).
- "At exactly 1:27 there is a sticker that comes and hides behind the topic" (Ep 03). A pinned stamp
  ("Cleared") was anchored high above its object, so the clamp pushed it up to y 300, under the
  "This is called: Customs" card that was still on screen. **Important: check every tag/stamp/tick
  against the term and question cards before showing the person.** Fix: pin the tag on the object
  (low), and end the card before the tag pops in.
