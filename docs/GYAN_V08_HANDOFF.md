# Gyan Mandal v0.8 — 12 October 2026

Baseline: `c2ad0f8582c3309621311cb9ce7bdd449f1a2f34` (v0.7). Development branch: `feature/gyan-dwar-v08`. Verify PR/Pages before asserting deployment.

## Delivered scope

The user supplied Punjabi spiritual reflections, a family dedication, a personal reason-to-faith journey and a proposed upbringing/service life-course. They authorized creating pages, Dwars, Mandals and Takhts as the material develops.

- `gyan.html`: a Royal Gold/mehrab study courtyard, three thematic Dwar/Takht cards, nine searchable reflection entries and a family dedication link.
- `dwar.html?chapter=...`: twelve addressable reading pages, supported by `assets/gyan-content.js`. IDs: `satnam`, `karta`, `purakh`, `nirbhau`, `nirvair`, `akal`, `ajuni`, `saibhang`, `gurprasad`, `journey`, `parvarish`, `virasat`.
- Punjabi article text; Punjabi/Hindi navigation and titles; Hindi summaries explicitly labelled as summaries, not full translations.
- Adjustable reading size, in-page contents, source links, a revealable reflection question, previous/next chapters, complete TXT download and explicit copy to the established Creator draft store. Questions do not score beliefs or collect responses.
- Edited full-text fallback `docs/GYAN_READER_V08.txt`. Bundled pages/data/styles/text are available in the scope-specific v0.8.0 offline cache.
- Linked from the current root and Sangat Darbar. No external legacy app is newly attached by this change. Older v0.7 handoff links are not changed.
- “Gyan/Samvad/Seva Takht” are thematic reading spaces, not historical Sikh Takhts, government authority or appointments. Existing regional `KDN-S-*` IDs and 101-state proposal are untouched.

## Editorial boundary

The public pages are explicitly edited reading versions, not an exact transcript or a canonical statement of Sikh doctrine. “੯ ਆਰੀਆ ਸੱਚ” is the author's own title and interpretive grouping. Interpretation is distinguished from scripture; verified excerpts link to their complete context.

The complete user-supplied writing is preserved separately in a private handoff ZIP, including the unfinished mixed-script fragment, original attributions and repeated lines. It is not committed to the public repository. The original-family genealogy, child name and unverified third-party family disputes are not expanded into public profile data. Public family dedication keeps the requested Bapu Gurbachan Singh and Bebe Kartar Kaur names and the author's respectful intent.

The journey is a condensed, attributed personal narrative. It does not diagnose people or describe all atheists, believers or political groups as psychologically identical. Long Osho-attributed passages were not converted into verified quotations; the specific book/discourse remains unresolved.

The parenting page is an edited discussion proposal, not a school admission system, psychological assessment or binding social policy. Original age bands remain visible as planning bands. Boarding is optional; marriage/parenthood remain freely chosen; service does not create compulsory labor; 45 is not a forced retirement age. No operational weapon lesson for children is supplied. Original wording is preserved in the separate archive, and these editorial changes are visible on the reading page.

## Verified references and remaining checks

| Item | Reading edition treatment | Source |
| --- | --- | --- |
| Sukhmani attribution | Corrected from Mahla 4 to Mahla 5; quoted line at Ang 283 | SriGranth Ang 262 (heading), 283 (line) |
| “ਇਸੁ ਜਗ ਮਹਿ ਪੁਰਖੁ…” | Ang 591–592; the two selected lines are not consecutive | SriGranth Ang 591, 592 |
| “ਆਪੀਨੑੈ ਆਪੁ ਸਾਜਿਓ…” | Quoted with Ang 463 | SriGranth Ang 463 |
| “ਭੈ ਕਾਹੂ ਕਉ…” | Slok Mahla 9, Ang 1427, slok 16 | SriGranth Ang 1427 |
| “ਮਨ ਤੂੰ ਜੋਤਿ ਸਰੂਪੁ…” | Text and Ang 441 provided | SriGranth Ang 441 |
| “ਗੁਰ ਪਰਸਾਦਿ ਮਿਟਿਆ…” | Ang 129, verse 7 | SriGranth Ang 129 |
| “ਹਰਿ ਜਨੁ ਐਸਾ ਚਾਹੀਐ…” | Kabir slok 149, Ang 1372 | SriGranth Ang 1372 |
| Dhammapada verse 5 | Punjabi paraphrase, not word-for-word Pali | Access to Insight, Yamakavagga, Buddharakkhita translation |
| Seven-year complete body/consciousness reset | Not treated as established science; age bands labelled proposal | Harvard Center on the Developing Child, Brain Architecture |
| Nine planets | Symbolic number language separated from modern astronomy: eight planets | NASA Solar System Planets |
| Neti neti / Jaap Sahib comparison; Hallaj history; “ਆਪੋ ਦੀਪੋ ਭਵ”; other unsourced quotes | Pending precise source checks; no invented citation or claim of equivalent doctrine | User's original remains private |

Primary source text links use `https://www.srigranth.org/servlet/gurbani.gurbani?Action=Page&Param=ANG` with the Ang number substituted. Other URLs are attached to the relevant reader article. The linked editions' English translations are not copied into the app.

## QA and next work

- Existing 22 Node and 13 Python checks pass; a new Node test checks all twelve routes, unique IDs, safe lookup and Creator schema/length compatibility. The offline test covers the new assets.
- jsdom UI simulation covers all twelve routes, Punjabi/Hindi titles/summary, preservation of Punjabi text, section/source links, font size, question reveal, TXT content, Creator deduplication, invalid route and corrupt-storage behavior, and bilingual search. This does not verify visual Android rendering or native download/share.
- No extra account, voting, payment, live-video or admin capability is claimed. v0.7's pending social backend work remains pending.
- Next content work: obtain exact Osho/Jaap/Upanishad/Hallaj references; review the edited reading versions with the author; optionally prepare complete Hindi translations as separate attributed translations. Do not silently replace the preserved original with edits.
- Next device check: open each Dwar on Android; inspect text-size control, source links, download and Creator copy; confirm v0.8 service-worker update without clearing saved drafts.
