# Writing the script

Audience: anyone. A shop owner shipping abroad, a student, a forwarder's new hire. If your mum
couldn't follow a line, rewrite it.

## Shape (about 250–300 words → 95–110 s in Kokoro `af_heart` at speed 1.0)

| Part | Job | Episode 01 |
|---|---|---|
| Hook (2 lines) | A concrete situation with one object, a weight and a value in $ and ₹, then the problem | "Imagine you're shipping a box of phones abroad. A hundred kilos, worth fifty thousand dollars. That's about forty-four lakh rupees. The flight is delayed…" |
| Question + turn | The viewer's question, then **"Let me explain."** | "So who pays? Let me explain." |
| Steps (5–8 lines) | Each line opens with a **signpost** that leads the viewer on | "Now look at one box on it…", "Here's the catch.", "So what does that mean in money?", "What about the delay?", "And you're on a clock.", "So how do you protect yourself?" |
| Payoff | The number or rule that surprises, made concrete | "Roughly three lakh rupees, for goods worth forty-four lakh." |
| Part-2 teaser | Anything you couldn't explain simply | "Which option costs less? That's part two." |
| Close | One action + the site | "Until then, before your cargo flies, check that box. More at F-sixteens e-freight dot com." |

## Rules

- **Explain every term the first time**, in a few plain words, then a "This is called" card names it:
  air waybill → "your cargo's plane ticket"; NVD → "No Value Declared"; SDR → "Special Drawing Rights:
  a currency made by the IMF from a basket of world currencies".
- **Money in both currencies**: say dollars, then rupees in lakh. Show "≈" and "approximate" on screen.
  Episode 01 rates: 1 USD ≈ ₹88, 1 SDR ≈ $1.35 ≈ ₹120 (re-check on the recording day).
- **One idea per episode.** A side topic becomes "part two".
- Not verbose: lines of 8–25 words. No lists read aloud.
- **Facts**: list every legal/number claim with the source it must be checked against (treaty article,
  IATA rule, policy clause). Ask the person before searching the web. Don't publish unverified.
- Don't name a real airline in a delay story; use "ZZ 525"-style placeholders.

## Writing for Kokoro (it reads exactly what you give it)

- Spell acronyms with full stops so it says letters: `N. V. D.`, `S. D. R.`, `I. M. F.`
- **Never** put `N. V. D.,` (letter-dots followed by a comma) — it hung the Kokoro container. Write `N, V, D,` there.
- **lakh**: write `[lakh](/lˈæk/)` in `vo-script.json`. Plain "lakh" comes out "laakh" (lˈɑk); the person wants the short Indian-English "lakh". The caption word stays "lakh".
- The brand: write **`F-sixteens e-freight dot com`**. It says "F-sixteens" as one word.
  (Check any new spelling with `POST /dev/phonemize`, see `tools.md`.)
- Numbers as words: "twenty-six", "forty-four lakh", "thirty-five hundred dollars".
- Captions are generated from Kokoro's words; `build.py`'s `SAY` table turns them back into
  "NVD", "SDR", "26", "$3,500", "f16sefreight.com". Add new pairs there for new terms.

## What to show the person

`SCRIPT.md`: the full text, a table (line → what the viewer sees), the words explained vs deferred
to part two, the facts to verify, and the rates used. Stop and wait for "approve".
