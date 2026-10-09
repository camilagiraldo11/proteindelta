# ProteinDelta v4 (+ FractEngine Local v5)

**Structural bioinformatics platform for comparative analysis of native and mutated cancer-associated proteins.**

> **v5 update:** adds a client-side spatial local fractal analysis (FD_bc/FD_mr within a configurable-radius sphere around the mutated residue's true 3D microenvironment), proposed by the thesis director as a complementary "Layer 2 — Local" to the existing global FD module. No backend, Colab notebook, or `fract_engine_v2.py` changes required — see [Novelty v5](#novelty-v5--spatial-local-fractal-dimension) below.

🌐 **Live app:** [proteindelta.vercel.app](https://proteindelta.vercel.app)

Undergraduate thesis project — María Camila Giraldo Rodríguez  
School of Systems Engineering (EISC), Universidad del Valle  
Director: PhD Pedro Antonio Moreno Tovar

---

## What it does

ProteinDelta integrates five analytical modules in a single-page web application (SPA) that runs entirely in the browser:

| Module | Description |
|--------|-------------|
| **ColabFold / AlphaFold2** | 3D structure prediction via Google Colab (GPU Tesla T4). Generates WT and MUT `.pdb` files with per-residue pLDDT confidence scores. |
| **SASA / Rolling Ball** | Solvent Accessible Surface Area calculation using the Shrake-Rupley algorithm (BioPython, probe radius 1.4 Å). Outputs ΔSASA per residue. |
| **FractEngine v2** | Fractal Dimension analysis (Box-Counting and Mass-Radius) over all heavy atoms. Global FD_bc ∈ [2.0, 2.6] for globular proteins. Local (sequence window, 21 residues) also computed per residue. |
| **FractEngine Local v5 (NEW)** | Spatial local FD_bc/FD_mr in a configurable-radius 3D sphere (default 10 Å) around each mutated residue's true microenvironment — captures tertiary contacts a sequence window misses. Requires real WT+MUT PDB. Client-side only. |
| **3D Molecular Viewer** | Dual WT/MUT viewer (3Dmol.js WebGL). Styles: cartoon, stick, sphere, surface, line. Color schemes: spectrum, chain, SS, b-factor (pLDDT). NEW v5: "🎯 Resaltar microentorno" highlights the r-Å sphere around the mutated residue. |
| **Oncology Panel** | Reference database of 5 high-priority oncoproteins (TP53, KRAS, BRCA1, EGFR, BCR-ABL) with clinical hotspots and approved therapies. |

The platform also computes a composite **pathogenicity score (PS_v4)** per residue, classified in 5 ACMG/AMP-analogous levels.

---

## Repository structure

```
proteindelta/
├── index.html              # Full SPA — all frontend logic (JS ES2022, Chart.js, 3Dmol.js, JSZip)
├── fract_engine_v2.py      # FractEngine v2 — Python module for Colab / local PDB analysis
└── README.md
```

### `index.html` — Frontend modules

| JS Module | Role |
|-----------|------|
| `InputEngine` | Sequence validation (AA20 regex), HGVS mutation parsing, MUT sequence construction |
| `SimulationEngine` | Fast exploratory mode — generates simulated pLDDT/SASA/RMSD without ColabFold |
| `FractEngine` (JS) | Browser-side fractal dimension via SASA surface points (v2, global) or Cα fallback; local via 21-residue sequence window (`localFDv2`) |
| `FractEngine Local v5` (NEW) | `getResidueCenter`, `atomsInSphere`, `localFDSpatial`, `localFDMRSpatial`, `calcLocalFDSpatial` — spatial (3D-distance) local FD around each mutated residue, reusing the same SASA/Box-Counting/Mass-Radius pipeline. PS_v4 formula unchanged — ΔFD_local shown as parallel metric. |
| `ScoringEngine` | Computes ΔΔG, fitness, heatmap score, PS_v4, 5-level pathogenicity classification |
| `RenderEngine` | 6 Chart.js plots + 3 fractal charts + NEW: "🎯 FD Local Espacial" card (`renderLocalSpatial`) |
| `ViewerEngine` | Dual 3Dmol.js instances — loads from RCSB PDB codes or local ColabFold files. NEW v5: `highlightMicroenv()` using 3Dmol `within` selector |
| `ExportEngine` | Exports `full_analysis.csv` (14 columns) + `results.json` + `all_outputs.zip` |
| `CancerProteinsDB` | Structured JS object with sequences, hotspots, PDB IDs, clinical context for 5 oncoproteins |

### `fract_engine_v2.py` — Python FractEngine (Colab / local)

Corrects the limitation of v1 (Cα-only 9-residue windows → FD_bc = 1.000). Uses **all heavy atoms** for global Box-Counting and **21-residue sliding windows** for local FD_bc.

```bash
# Usage
pip install biopython numpy
python fract_engine_v2.py WT.pdb MUT.pdb [chain_id]
# Outputs: FD_bc WT/MUT, ΔFD_bc, FD_mr WT/MUT, per-residue local FD_bc
```

**Returns:** `fd_bc_wt`, `fd_bc_mut`, `delta_fd_bc`, `fd_mr_wt`, `fd_mr_mut`, `local_fd_bc_wt/mut`, `delta_local_fd_bc`, OLS R².

---

## Analysis workflow

```
1. Preparation   → Get WT sequence from UniProtKB, identify mutations in ClinVar/COSMIC (HGVS: p.Gly12Asp → G12D)
2. ColabFold     → Run notebook on Colab (GPU T4), download all_outputs.zip
3. ProteinDelta  → Upload CSV/JSON files → "Analyze with real data" → review 6 result tabs + Fractal tab
4. Interpretation→ pLDDT >70, ΔpLDDT <-10, ΔΔG >1 kcal/mol, fitness <0.3, RMSD <0.5Å / >1.5Å, |ΔFD_bc| >0.08
```

---

## Oncology validation panel

| Protein | PDB | Key mutation | Cancer frequency | Approved therapy |
|---------|-----|-------------|-----------------|-----------------|
| TP53 | 2OCJ | R175H, R248W, R248Q, R273H | ~50% of all cancers | APR-246 (Phase III) |
| KRAS | 4OBE | G12D, G12V, G12C, G12R | ~25% global; pancreas ~90% | Sotorasib, Adagrasib |
| BRCA1 | 1JM7 | C61G, M1775R, Y1853X | 5–10% hereditary breast/ovarian | PARP inhibitors (Olaparib) |
| EGFR | 1IVO | L858R, T790M, del exon 19 | NSCLC 10–30% | Osimertinib |
| BCR-ABL | 2FO0 | T315I, E255K/V, Y253F | >95% CML | Imatinib, Ponatinib, Asciminib |

A **40 WT/Mutant pair panel** (COSMIC Tier 1 + ClinVar Pathogenic/Likely Pathogenic) is built into the app's Validation tab as a pipeline/interface demo.

> ⚠️ **Not a validation result.** The per-pair metrics shown for these 40 pairs (pLDDT, RMSD, ΔSASA, FD_bc/FD_mr, PS_v4) are produced by a deterministic seeded simulation (`VAL_RESULTS` in `index.html`), not by running AlphaFold2/ColabFold + BioPython on these structures, and the pathogenicity labels are hand-written rather than output by `classifyPath()`. The app now flags this in-place wherever the panel is shown or exported. The only fractal-dimension results computed on real PDB coordinates are the reference pairs analyzed directly with `fract_engine_v2.py`. Re-running the corrected FractEngine v2 on real ColabFold structures for the 40-pair panel is future work — see [Limitations](#limitations).

### Domain-restricted folding for multi-domain proteins

Folding TP53's full-length sequence (393 residues) in ColabFold produces a Cα RMSD of **22.64 Å** between WT and R175H — not a real mutation effect, but an artefact of AlphaFold2's known non-reproducibility on the intrinsically disordered regions flanking the folded DNA-binding domain. Restricting prediction to that domain (UniProt residues 94–312, which contains the documented hotspot) reduces RMSD to **0.617 Å**. This domain-restriction strategy — folding only the structured window that contains every documented hotspot for a protein, while still reporting mutation positions in original full-length numbering — has been applied, after per-protein verification against UniProt domain annotations, to TP53 plus 10 other multi-domain proteins in the curated ColabFold notebook panel (EGFR, BRAF, PTEN, RB1, ERBB2, MET, BCR-ABL, ALK, SMAD4, and now **BRCA1**).

Real UniProt domain annotations (REST API) and real PDB residue coverage resolved two of the three previously-unrestricted cases. **BRCA1** (P38398) has a RING zinc finger (24–65) and tandem BRCT repeats (1642–1736, 1756–1855) that fold as one module, crystallized at 1.85 Å as PDB [1T15](https://www.rcsb.org/structure/1T15) (residues 1646–1859); 6 of 7 documented hotspots (R1699W, V1736A, G1738E, M1775R, A1789T — Y1853X is a nonsense variant, already out of scope) fall inside that window, so BRCA1 is now restricted to **1646–1859**; only C61G (RING domain) is rejected with an explicit error, the same way TP53's P72R already is. **FGFR3** (P22607) has a UniProt-annotated Protein kinase domain at 472–761, matching the residue range of its already-curated reference structure PDB 4K33 (449–759); FGFR3 is now restricted to **472–761**, covering K652E, while R248C, S249C (extracellular Ig-like domain 2/3 linker) and G372C (juxtamembrane, just before the 376–396 transmembrane helix) are rejected the same way.

**CTNNB1 remains unrestricted**, and real data now shows *why* a domain window can't fix it: its 4 hotspots (D32G, S33C, T41A, S45F) sit inside the N-terminal β-TrCP phosphodegron (≈ residues 1–140), and the real AlphaFold DB model for P35222 (v6) has mean per-residue pLDDT of only **32–45** at those exact four positions, versus **96.5** across the folded armadillo-repeat domain (151–666) — direct structural evidence, not just an annotation, that this region has no independent fold as an isolated monomer. Unlike TP53/EGFR/BRCA1/FGFR3, the problem isn't a disordered flank that can be cropped away while keeping the hotspot inside a folded domain — the hotspots themselves are in the region with no fold to restrict to. Fixing this would require modelling the bound destruction complex, outside the current single-chain-monomer scope. Both the BRCA1 and FGFR3 windows are now empirically validated with real data: real RMSD = 0.323 Å for BRCA1 (see [Real result: BRCA1 M1775R](#real-result-brca1-m1775r--domain-window-validated-and-the-first-correct-real-classification)) and 1.537 Å for FGFR3 (see [Real result: FGFR3 K650E](#real-result-fgfr3-k650e--a-real-curated-hotspot-numbering-bug-and-an-activating-mutation-misread-as-stabilizing)) — both far below the ~20 Å-scale inflation seen with disordered full-length folding. CTNNB1 itself was subsequently run full-length end-to-end with real data — see [Real result: CTNNB1 S45F](#real-result-ctnnb1-s45f--full-length-run-confirms-the-disordered-region-problem-on-the-one-case-that-cant-be-domain-restricted). BRAF's kinase-domain window (444–723), curated from the start but never empirically tested until now, is also validated with real data — RMSD = 2.338 Å, the highest of the domain-restricted cases but not reproduced by a second-seed replicate (0.701 Å), so not attributable to the mutation — see [Real result: BRAF V600E](#real-result-braf-v600e--domain-window-validated-and-the-second-correct-real-classification). PTEN's window (1–353) is likewise validated with real data — RMSD = 2.090 Å, see [Real result: PTEN R130Q](#real-result-pten-r130q--a-catalytic-residue-mutation-with-a-large-global-rmsd-but-no-local-signal). SMAD4's MH2 window (323–552) is validated too — RMSD = 0.364 Å, see [Real result: SMAD4 R361H](#real-result-smad4-r361h--a-highly-stable-mh2-window-and-no-signal-at-the-mutated-residue). RB1's pocket-domain window (380–787) is validated as well — RMSD = 1.508 Å, see [Real result: RB1 R661W](#real-result-rb1-r661w--the-case-chosen-to-look-for-a-third-correct-call-and-no-local-signal). ALK's kinase window (1116–1392) is validated too — RMSD = 0.265 Å, see [Real result: ALK F1174L](#real-result-alk-f1174l--a-very-stable-kinase-window-and-near-null-local-signals). ERBB2's kinase window (712–987) is validated in its N-lobe (0.948 Å), although its global RMSD (3.682 Å) is dominated by one flexible C-lobe segment — see [Real result: ERBB2 V777L](#real-result-erbb2-v777l--a-validated-n-lobe-and-a-global-rmsd-driven-by-a-single-flexible-segment). MET's kinase window (1049–1360) is validated over its structured part (0.847 Å excluding its last 8 residues, global 2.561 Å) — see [Real result: MET M1250T](#real-result-met-m1250t--a-second-curated-numbering-bug-and-a-window-tail-that-inflates-the-rmsd). ABL1's kinase window (242–493, the "BCR-ABL" panel entry) is the most stable of all — RMSD = 0.0815 Å — see [Real result: BCR-ABL T315I](#real-result-bcr-abl-t315i--a-resistance-mutation-with-no-pathogenic-label-and-the-most-stable-window-in-the-series). PIK3CA, the largest protein run full-length (1068 residues, no window), shows the cost of not having one: its global RMSD (6.061 Å) falls to 1.724 Å without 44 displaced residues, mainly its C-terminal tail — see [Real result: PIK3CA H1047R](#real-result-pik3ca-h1047r--the-last-panel-variant-just-under-the-probably-pathogenic-threshold).

### Real end-to-end result: TP53 R175H

Using the domain-restricted pipeline above, TP53 R175H (COSMIC Tier 1 hotspot, ClinVar Pathogenic) was run fully end-to-end — real ColabFold prediction, real BioPython SASA/RMSD, real FractEngine v2 local FD_bc, real `classifyPath()` — with no simulated or convention-substituted inputs. Domain-averaged pLDDT was 89.56 (WT) / 89.38 (MUT); at the mutated residue, real pLDDT dropped from 96.06 to 94.44, real ΔSASA (region-averaged, ±12 residues) was −0.53 Å², and real local ΔFD_bc was +0.036 (surface roughening). The resulting real **PS_v4 = −0.003**, classified as **Variant of Uncertain Significance** — not Pathogenic or Likely Pathogenic — despite R175H being one of the best-characterized pathogenic hotspots in the TP53 literature. This is, to date, the only variant from the oncology panel executed fully with real data rather than simulation, and it reinforces the same PS_v4 misclassification pattern already found on the six experimental reference pairs (see [Pathogenicity score PS_v4](#pathogenicity-score-ps_v4)).

### Real negative control: TP53 Y107H

The six reference pairs and R175H above are all pathogenic/destabilizing cases — none tests whether PS_v4 correctly recognizes a **benign** variant. TP53 **Y107H** (ClinVar Benign, reviewed by the ClinGen TP53 expert panel, 17 supporting submissions) sits inside the same DNA-binding domain window (94–312) already used for R175H, so it could be run through the identical domain-restricted pipeline with no new engineering.

This run also caught a second real bug: when the AlphaFold DB shortcut is used for the WT structure, it returns the **full-length** isoform regardless of the configured domain window, while the mutant is predicted domain-restricted — reintroducing the exact disordered-flank RMSD inflation the domain restriction was built to fix (first attempt: RMSD = 23.86 Å). Fixed by having the notebook unconditionally skip the AlphaFold DB shortcut whenever a domain window is configured, so WT and MUT are both predicted fresh on GPU with matching length and numbering (see [`fract_engine_v2.py`](fract_engine_v2.py) note below and the notebook's CELDA 3).

After the fix, a clean run gave domain-averaged pLDDT 89.56 (WT) / 89.54 (MUT), real Kabsch RMSD_Ca = **1.377 Å** (N=219, vs. 23.86 Å with the bug), real ΔSASA (region-averaged) of −0.96 Å², and real local ΔFD_bc of +0.047. `classifyPath()` on these real values returns **PS_v4 = −0.210**, classified as **Variant of Uncertain Significance** — not Benign or Likely Benign, despite Y107H being a well-established benign polymorphism. That puts a confirmed-*benign* variant in the same bucket (VUS) as the confirmed-*pathogenic* R175H case above: on the only two real oncology-panel cases executed to date, PS_v4 fails to discriminate pathogenic from benign in **either** direction.

### Ten additional real benign controls

TP53 Y107H above is a single benign control: not enough to say anything about specificity. To get a second, larger read, ten more ClinVar-Benign missense variants were selected **before running any of them**, by a fixed rule: one per gene (two for the three genes with enough candidates), ClinVar classification exactly "Benign" with review status "reviewed by expert panel" or "criteria provided, multiple submitters, no conflicts", falling inside the window (or full-length span) already established for that gene in this panel, picked by lowest ClinVar accession number among the eligible candidates. All ten were then run through the identical real pipeline (ColabFold/AlphaFold2, BioPython Kabsch RMSD and Shrake-Rupley SASA, `classifyPath()`), at the pipeline's default seed, with no changes to `classifyPath()` or its coefficients.

| Variant | Region (UniProt) | ClinVar | Review | ΔpLDDT at residue | RMSD Cα, Å | PS_v4 | Class |
|---|---|---|---|---|---|---|---|
| TP53 N235S | 94-312 | [VCV000127821](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000127821/) | expert panel | +0.50 | 1.161 | -0.578 | Likely Benign ✓ |
| TP53 R290H | 94-312 | [VCV000127825](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000127825/) | expert panel | -3.19 | 1.542 | +0.496 | VUS |
| BRCA1 M1652T | 1646-1859 | [VCV000037615](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000037615/) | expert panel | +0.19 | 0.121 | -0.418 | VUS |
| BRCA1 L1664P | 1646-1859 | [VCV000037621](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000037621/) | expert panel | -0.75 | 0.319 | -0.193 | VUS |
| PTEN A79T | 1-353 | [VCV000041682](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000041682/) | expert panel | +0.32 | 3.198 | -0.496 | VUS |
| CDKN2A A148T | Full-length | [VCV000041580](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000041580/) | multiple submitters | -0.03 | 7.190 | -0.309 | VUS |
| VHL P81S | Full-length | [VCV000002233](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000002233/) | expert panel | -0.06 | 2.034 | -0.443 | VUS |
| VHL P25L | Full-length | [VCV000093330](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000093330/) | expert panel | -0.85 | 2.593 | +0.015 | VUS |
| IDH1 V71I | Full-length | [VCV000134516](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000134516/) | multiple submitters | +0.00 | 0.537 | -0.359 | VUS |
| PIK3CA I391M | Full-length | [VCV000135038](https://www.ncbi.nlm.nih.gov/clinvar/variation/VCV000135038/) | expert panel | -1.56 | 5.968 | +0.060 | VUS |

Only **TP53 N235S** classifies correctly (Likely Benign); the other nine land in VUS. Combined with TP53 Y107H, that is **1 of 11** real benign controls classified Benign or Likely Benign — a specificity in the same range as the sensitivity already found on the pathogenic panel (2 of 21). PS_v4 does not fail only on pathogenic variants: on this small, pre-registered sample of confirmed-benign missense variants it mostly returns VUS as well, the same failure mode already seen with Y107H, now at n=11 rather than n=1. Two variants deserve a note: VHL P25L (PS_v4 = +0.0155, ClinVar Benign) sits inside VHL's disordered N-terminal acidic-repeat region (real pLDDT 49.31–50.16 at the residue, versus the folded domain's ~90s), so a flat-signal VUS here is the expected outcome for the same reason CTNNB1 S45F cannot be scored, not a new failure mode; PIK3CA I391M (PS_v4 = +0.0597) carries the same kind of C-terminal RMSD inflation seen for H1047R (5.97 Å global for a 1068-residue full-length run), so its RMSD should not be read as an effect of the mutation. As with the pathogenic panel, this is a small, hand-selected (by a fixed rule, not by outcome) set and does not estimate specificity in general; it does show that the one-in-eleven correct rate is not an artefact of TP53 Y107H being a single, unusual case.

### Real result: EGFR L858R — a pathogenic driver misclassified as Benign

EGFR **L858R** is the second most common activating driver mutation in non-small-cell lung cancer (ClinVar Pathogenic, a canonical tyrosine-kinase-inhibitor-sensitizing hotspot), sitting inside the kinase-domain window (712–979, local position 147) already used and validated for this protein. It was run fully end-to-end through the same real, domain-restricted pipeline — real ColabFold prediction (WT pLDDT 91.17, MUT pLDDT 94.05, both domain-averaged), real BioPython Kabsch RMSD and Shrake-Rupley SASA, real FractEngine v2 local ΔFD_bc — with no simulated inputs.

The real numbers: Kabsch RMSD_Ca = **0.887 Å** (N=268); at the mutated residue, real pLDDT jumped from 58.94 (WT) to 89.19 (MUT) — a Δ of +30.25, the largest of any real case run to date; real ΔSASA (region-averaged, ±12 residues) was −2.51 Å²; real local ΔFD_bc was +0.015 (neutral). Because `classifyPath()`'s ΔΔG term weights ΔpLDDT heavily (coefficient −0.16), this large confidence swing at the mutated residue — the WT structure has low local confidence right at the activation loop next to the kinase's DFG motif, the mutant is predicted with much higher local confidence there — drives ΔΔG to −4.89 kcal/mol, and the resulting real **PS_v4 = −6.889** classifies L858R as **Benign**.

This is the sharpest of the three real oncology-panel results to date: R175H (pathogenic → VUS) and Y107H (benign → VUS) both land in the score's uncertain middle; L858R — an oncogenic, clinically actionable driver mutation — lands at the *opposite clinical extreme* from its real classification. Across all three real cases executed so far, PS_v4 has now failed in every direction a pathogenicity score can fail: over-calling uncertainty on a true pathogenic variant, over-calling uncertainty on a true benign variant, and confidently mislabeling a true pathogenic variant as benign.

### Real result: BRCA1 M1775R — domain window validated, and the first correct real classification

BRCA1 **M1775R** is one of the best-characterized pathogenic BRCA1 missense mutations (ClinVar Pathogenic; destabilizes the BRCT fold and abolishes phosphopeptide binding), sitting inside the newly-derived BRCT-domain window (1646–1859, local position 130). It was the first real test of that window, and was run fully end-to-end through the same real pipeline — real ColabFold prediction (WT pLDDT 94.72, MUT pLDDT 94.15, domain-averaged), real BioPython Kabsch RMSD and Shrake-Rupley SASA, real FractEngine v2 local ΔFD_bc.

The real Kabsch RMSD_Ca = **0.323 Å** (N=214) — lower than the equivalent domain-restricted validation for TP53 (0.617 Å) or EGFR (0.887 Å) — confirming with real data, not just UniProt/PDB annotations, that the BRCT window derived earlier this session is structurally valid and reproducible. At the mutated residue, real pLDDT *dropped* from 94.12 (WT) to 74.12 (MUT) — Δ = −20.0 — and real ΔSASA at that residue *rose* by +42.04 Å², both real signals of local destabilization pointing the same direction. `classifyPath()` on these real values returns **PS_v4 = +5.041**, classified as **Pathogenic** — correctly.

This is the first of the four real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R) that PS_v4 classifies correctly. The pattern across all four is informative: PS_v4 got M1775R right where ΔpLDDT (confidence loss) and ΔSASA (exposure gain) both point toward destabilization, consistent real signals of a genuine structural effect — but got L858R wrong where a ΔpLDDT *gain* (an AlphaFold2 confidence artifact at a flexible activation-loop position, not a real stabilizing effect) pointed the ΔΔG term in the opposite direction from the mutation's true, independently known oncogenic effect. One correct call does not offset three real misclassifications, but it narrows the likely failure mode to cases where local pLDDT confidence and true structural effect diverge — a concrete, testable hypothesis for future calibration work rather than a blanket "the score doesn't work."

### Real result: FGFR3 K650E — a real curated-hotspot numbering bug, and an activating mutation misread as stabilizing

Validating the FGFR3 kinase-domain window (472–761) surfaced a third real bug this session, this time in the curated panel data itself, not the pipeline code: the documented hotspot "K652E" does not exist on the real UniProt P22607 canonical sequence — position 652 is a threonine, not a lysine. The real classic FGFR3 thanatophoric-dysplasia driver, confirmed against the live sequence, is **K650E** (a 2-residue offset, likely inherited from literature numbering that excludes the signal peptide). The panel entry has been corrected in both the notebook and this app.

K650E (ClinVar Pathogenic; a constitutively-activating kinase mutation, not a destabilizing one) was then run fully end-to-end at the corrected position (local 179). Real Kabsch RMSD_Ca = **1.537 Å** (N=290) — higher than the other three validated windows (TP53 0.617 Å, EGFR 0.887 Å, BRCA1 0.323 Å) but still consistent with a structurally valid, reproducible domain-restricted prediction, not the ~20 Å-scale inflation seen with disordered full-length folding. At the mutated residue, real pLDDT rose modestly (50.53 → 56.84, Δ = +6.31) and real ΔSASA at that residue *dropped* sharply (−79.02 Å², the residue becomes far more buried) — both signals classifyPath() reads as stabilizing. The real **PS_v4 = −1.998** classifies K650E as **Benign**.

This is a distinct failure mode from the other four real cases: K650E is not pathogenic because it destabilizes the kinase fold — real ΔΔG here is actually negative (−1.26 kcal/mol, "stabilizing") — it is pathogenic because it locks the kinase into a more compact, constitutively active conformation. PS_v4 only scores thermodynamic destabilization, so it has no signal that could catch a gain-of-function activating mutation by design, independent of any coefficient tuning. Across the five real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E), PS_v4 is correct once (M1775R, a genuine destabilizing loss-of-function variant) and wrong four times — including two distinct wrong-for-different-reasons cases (L858R: confidence artifact; K650E: activating-not-destabilizing mechanism).

### Real result: CTNNB1 S45F — full-length run confirms the disordered-region problem, on the one case that can't be domain-restricted

CTNNB1 **S45F** sits inside the GSK3β/CK1 phosphodegron of β-catenin (ClinVar Pathogenic; disrupts the phosphorylation signal that targets β-catenin for destruction, causing constitutive Wnt-pathway activation — found recurrently in hepatocellular carcinoma, hepatoblastoma, colorectal and endometrial cancers). Because the domain-restriction strategy used for every other multi-domain protein in the panel cannot be applied here — the hotspot itself sits in the region with no independent fold (see [Domain-restricted folding for multi-domain proteins](#domain-restricted-folding-for-multi-domain-proteins)) — this is the only real case run **full-length (781 residues), unrestricted**, through the same real pipeline: real ColabFold prediction, real BioPython Kabsch RMSD and Shrake-Rupley SASA, real `classifyPath()`.

The real numbers: Kabsch RMSD_Ca = **3.0817 Å** (N=781) — by far the largest of any real case to date, roughly double FGFR3's 1.537 Å and an order of magnitude above BRCA1's 0.323 Å, but still nowhere near the ~20 Å-scale seen with TP53's original disordered-flank folding artefact. Domain-averaged (here, whole-protein) pLDDT was 79.84 (WT) / 80.36 (MUT); at the mutated residue itself, real pLDDT stayed low on **both** sides — 29.28 (WT) → 26.28 (MUT), Δ = −3.0 — directly confirming, with real ColabFold output rather than only the earlier AlphaFold DB reference, that this position is genuinely disordered before and after the mutation. Real ΔSASA at that residue was +77.65 Å² (the residue becomes much more exposed), but the resulting real ΔΔG (+0.54 kcal/mol) is modest, since the confidence term barely moves. The real **PS_v4 = 0.8184** classifies S45F as a **Variant of Uncertain Significance** — inside the VUS band, not Pathogenic and not Benign.

This is a third distinct pattern layered onto the previous five real cases. R175H and Y107H land in VUS because ΔΔG happens to sit near zero for a genuine folded domain; L858R and K650E are confidently misclassified as Benign because a large, real structural signal (confidence gain or burial) is mechanistically the wrong signal to read as pathogenic. S45F lands in VUS for a different reason again: the large Cα RMSD is driven mostly by prediction noise across a 781-residue structure with no stable fold at the hotspot, not by a clean before/after conformational shift — the per-residue signals at the mutation site itself (ΔpLDDT, ΔSASA) are the only real evidence available, and on their own they're too weak to cross either threshold. PS_v4 doesn't fail loudly here as it does on L858R/K650E, but the "correct-sounding" VUS output hides the fact that the model has no reliable structural signal to work with at all for this class of hotspot — a caveat a numeric score alone doesn't surface. Across the six real oncology-panel cases executed to date, PS_v4 is now correct once (M1775R) out of six.

### Real result: BRAF V600E — domain window validated, and the second correct real classification

BRAF **V600E** is the most common activating BRAF mutation in cancer (ClinVar Pathogenic; a canonical driver in melanoma, colorectal and thyroid carcinoma, target of vemurafenib/dabrafenib), sitting inside the kinase-domain window (444–723, local position 157) already curated for this protein but never before run with real data. It was run fully end-to-end through the same real pipeline — real ColabFold prediction (WT pLDDT 88.37, MUT pLDDT 88.20, domain-averaged), real BioPython Kabsch RMSD and Shrake-Rupley SASA, real `classifyPath()`.

The real Kabsch RMSD_Ca = **2.3338 Å** (N=280) — the highest of any domain-restricted case to date (above FGFR3's 1.537 Å), though still far below the ~20+ Å-scale inflation from disordered full-length folding. This larger RMSD was first read as plausibly reflecting a genuine biological signal (V600E is documented to shift BRAF's activation segment toward an active-like state), but a [second-seed replicate](#replicate-test-a-second-alphafold2-random-seed-on-all-22-variants) gave 0.701 Å and PS_v4 = +0.8136 (VUS), so neither the RMSD nor the correct call can be attributed to the mutation from this single run. At the mutated residue, real pLDDT dropped from 61.25 (WT) to 55.25 (MUT) — Δ = −6.0 — and real ΔSASA at that residue rose modestly (+5.07 Å²). The real **PS_v4 = 1.3119** classifies V600E as **Probably Pathogenic**.

This is the second of seven real oncology-panel cases correctly classified in direction (after BRCA1 M1775R), though at the "Probably Pathogenic" tier rather than "Pathogenic" (PS > 2.5). Both correct calls share a pattern: a real, non-trivial ΔpLDDT drop at the mutated residue combined with a real ΔSASA change in the destabilizing direction — the same signal combination that failed on L858R and K650E is, when the underlying mutation genuinely destabilizes or perturbs the local fold (rather than acting through an activation-loop confidence artifact or a burial-without-unfolding mechanism), enough to push PS_v4 toward the correct side. Across the seven real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E), PS_v4 is now correct in direction twice (M1775R, V600E) out of seven.

### Real result: KRAS G12D — the most common cancer driver mutation in existence, misclassified as Benign

KRAS **G12D** is the single most common oncogenic point mutation in human cancer (ClinVar Pathogenic; present in roughly a quarter of all tumors, dominant in pancreatic, colorectal and lung adenocarcinoma), sitting on a small (189-residue), fully-folded G-protein that needs no domain restriction — the first real case run full-length by design rather than by necessity (unlike CTNNB1). It was run fully end-to-end through the same real pipeline — real ColabFold prediction (WT pLDDT 90.40, MUT pLDDT 90.48, whole-protein), real BioPython Kabsch RMSD and Shrake-Rupley SASA, real `classifyPath()`.

The real Kabsch RMSD_Ca = **0.2015 Å** (N=189) — the lowest of any real case to date, including every domain-restricted structure — which was read as confirming KRAS folds essentially identically with or without G12D (a [second-seed replicate](#replicate-test-a-second-alphafold2-random-seed-on-all-22-variants), with both structures predicted afresh as in this run, gave 0.902 Å and PS_v4 = +0.8698, so this low value is not reproducible), exactly as expected for a small, rigid, well-characterized fold. At the mutated residue, real pLDDT barely moved (92.75 → 93.44, Δ = +0.69) and real ΔSASA at that residue rose moderately (+23.35 Å²). With almost no confidence change and a near-zero real ΔΔG (−0.08 kcal/mol, reading as mildly "stabilizing"), the real **PS_v4 = −0.5417** classifies G12D as **Likely Benign** — the opposite of its true, unambiguous pathogenicity.

This is the third real case sharing the same underlying failure mode as K650E: G12D is not pathogenic because it destabilizes or reshapes the fold — it barely perturbs it — it's pathogenic because it disrupts the intrinsic and GAP-stimulated GTP-hydrolysis chemistry that normally switches KRAS off, trapping it in its active, GTP-bound state. That mechanism leaves essentially no signature in RMSD, pLDDT, or SASA, so PS_v4 has structurally nothing to detect. Arguably this is the cleanest demonstration of the gain-of-function blind spot in the entire real panel to date: the least structurally disruptive mutation of any real case tested is also the most clinically important one, and PS_v4 reads "barely disruptive" as "barely dangerous." Across the eight real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D), PS_v4 is correct in direction twice (M1775R, V600E) out of eight.

### Real result: IDH1 R132H — a metabolic gain-of-function mutation, and a third case where the score simply doesn't discriminate

IDH1 **R132H** is the single most cited neomorphic gain-of-function mutation in cancer genetics (ClinVar Pathogenic; the WHO 2021 CNS tumor classification uses IDH1/2 mutation status to define IDH-mutant glioma as a distinct disease entity), sitting on a small (414-residue), fully-folded metabolic enzyme that needs no domain restriction — like KRAS, run full-length by design rather than by necessity. It was run fully end-to-end through the same real pipeline — real ColabFold prediction (WT structure from AlphaFold DB, pLDDT 95.85 global; MUT predicted fresh on GPU, pLDDT 95.70 global), real BioPython Kabsch RMSD and Shrake-Rupley SASA, real `classifyPath()`.

The real Kabsch RMSD_Ca = **0.5133 Å** (N=414) — the second-lowest of any real case to date, after only KRAS G12D's 0.2015 Å — confirming IDH1 folds essentially identically with or without R132H. At the mutated residue, real pLDDT dropped modestly (96.56 → 95.38, Δ = −1.18) and real ΔSASA at that residue dropped sharply (−19.05 Å², the residue becomes notably more buried). The real **PS_v4 = −0.1084** classifies R132H as **Variant of Uncertain Significance** — not Pathogenic, despite R132H being one of the most clinically consequential single point mutations in all of oncology.

Mechanistically this sits closest to KRAS G12D: R132 sits in IDH1's active site and normally coordinates the isocitrate substrate; the mutation doesn't destabilize the fold, it redirects the enzyme's catalytic chemistry to produce the oncometabolite D-2-hydroxyglutarate instead of α-ketoglutarate — a chemistry-level gain of function invisible to RMSD/pLDDT/SASA, exactly like KRAS's disruption of GTP-hydrolysis chemistry. But unlike G12D, whose near-zero ΔΔG reads as mildly "stabilizing" and pushes PS_v4 confidently to the opposite clinical extreme (Benign), R132H's near-zero ΔΔG lands close enough to zero from the other side that it falls into the VUS band instead — joining TP53 R175H and TP53 Y107H as a third real case where PS_v4 fails not by confidently pointing the wrong direction, but by not discriminating at all. Across the nine real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H), PS_v4 is correct in direction twice (M1775R, V600E) out of nine.

### Real result: PTEN R130Q — a catalytic-residue mutation with a large global RMSD but no local signal

PTEN **R130Q** substitutes the catalytic arginine of the phosphatase P-loop (the HCKAGKGR motif; R130 coordinates the phosphate of the PIP3 substrate), and is a recurrent ClinVar-Pathogenic variant in PTEN hamartoma tumor syndrome, endometrial cancer and glioblastoma, where it abolishes lipid-phosphatase activity. It sits inside the curated PTEN window (1–353, which only trims the disordered C-terminal tail; local position = UniProt position = 130), a window never before run with real data. Because a domain window is active, the notebook skips the AlphaFold DB shortcut, so **both** WT and MUT were predicted fresh on GPU with identical length and numbering, then run through the same real pipeline: real ColabFold prediction (WT pLDDT 87.75, MUT pLDDT 87.80, domain-averaged), real BioPython Kabsch RMSD and Shrake-Rupley SASA, real FractEngine v2 local ΔFD_bc, real `classifyPath()`.

The real Kabsch RMSD_Ca = **2.0902 Å** (N=353) — the third-highest of the ten real oncology-panel cases, after CTNNB1 (3.08 Å) and BRAF (2.338 Å), which also empirically validates the PTEN window as producing a bounded, reproducible prediction rather than the ~20 Å-scale inflation of disordered full-length folding. What this RMSD means is not fully resolved by a single WT/MUT pair: it could reflect a real domain-level rearrangement (PTEN's phosphatase and C2 domains are joined by a flexible interface), or ordinary run-to-run variability of AlphaFold2 — the benign TP53 Y107H control, which has no reason to move the backbone, gave 1.377 Å. At the mutated residue itself the real signals are flat: pLDDT 97.94 → 98.12 (Δ = +0.18), ΔSASA at the residue −2.19 Å² (region-averaged −0.51 Å²), local ΔFD_bc +0.053. ΔΔG is therefore ≈ 0 (−0.039 kcal/mol), and the real **PS_v4 = −0.4689** classifies R130Q as a **Variant of Uncertain Significance**, sitting just above the Benign-side boundary (−0.5) — not Pathogenic, despite the mutation abolishing the enzyme's catalytic activity.

This is the fifth real case landing in VUS, and it belongs with KRAS G12D and IDH1 R132H rather than with BRCA1 M1775R and BRAF V600E: R130Q is pathogenic because it removes the residue that performs the chemistry, not because it destabilizes the fold, and the score's ΔΔG term only reads the pLDDT and SASA of the mutated residue and its ±12-residue neighbourhood. The one thing that distinguishes it is the larger global RMSD — a signal the score does not use at all (RMSD enters PS_v4 only indirectly), so even if that RMSD reflects a genuine backbone shift, there is no term through which it could change the classification. With a single WT/MUT pair per variant this cannot be resolved here; replicate predictions (multiple seeds) would be needed to separate real conformational change from prediction noise. Across the ten real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q), PS_v4 is correct in direction twice (M1775R, V600E) out of ten.

### Real result: CDKN2A R24P — the largest global RMSD yet, and still no usable local signal

CDKN2A **R24P** (p16INK4a) is a well-known familial-melanoma variant (ClinVar Pathogenic) in the first ankyrin repeat of a small (156-residue) CDK4/6 inhibitor; it has been reported to impair CDK4 binding. p16 is a single compact domain, so it was run full-length with no domain window, and — as with KRAS and IDH1 — the WT structure came from AlphaFold DB (version 6, whole-protein pLDDT 76.3) while only the mutant was predicted fresh on GPU (whole-protein pLDDT 78.56), followed by the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

The real Kabsch RMSD_Ca = **6.2441 Å** (N=156) — the largest of the eleven real oncology-panel cases, roughly double CTNNB1's 3.08 Å, on a protein a fifth of its size. This number should not be read as an effect of R24P. The WT and MUT here come from different prediction runs, both with low-to-moderate confidence (mean pLDDT 76–79), and p16 is an elongated all-helical ankyrin-repeat protein in which a small change in the relative orientation of the repeats moves Cα positions far from the superposition; with a single WT/MUT pair there is no way to separate that from a real conformational change. (KRAS and IDH1, also WT-from-AlphaFold-DB and MUT-from-ColabFold, gave 0.20 and 0.51 Å, so mixing the two sources does not by itself inflate RMSD — the large value here more likely reflects how soft this fold is in the models.) At the mutated residue the real signals are small: pLDDT 87.06 → 86.00 (Δ = −1.06), ΔSASA at the residue −53.54 Å² but region-averaged (±12 residues) only −2.43 Å², local ΔFD_bc −0.020. `classifyPath()` feeds the region-averaged ΔSASA into ΔΔG, so the large single-residue burial change barely contributes: ΔΔG = +0.12 kcal/mol, and the real **PS_v4 = −0.2036** classifies R24P as a **Variant of Uncertain Significance** — not Pathogenic.

This is the sixth real case landing in VUS (with R175H, Y107H, S45F, R132H and R130Q), and the third — after S45F and R130Q — where an unusually large global RMSD coexists with flat local signals. The score is not built to use RMSD, so a large RMSD cannot move the call in either direction, and here it is also uninterpretable as evidence of destabilization. Note that AlphaFold2 does not show a local disruption at the Arg→Pro position (pLDDT stays at 86), which is itself informative about what this pipeline can and cannot see for a proline substitution. Across the eleven real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P), PS_v4 is correct in direction twice (M1775R, V600E) out of eleven.

### Real result: SMAD4 R361H — a highly stable MH2 window, and no signal at the mutated residue

SMAD4 **R361H** is a recurrent loss-of-function hotspot in the MH2 domain (ClinVar Pathogenic; pancreatic cancer and juvenile polyposis). MH2 hotspots of this kind are generally attributed to disrupting the domain's protein–protein interface (complex formation with receptor-regulated SMADs) rather than its fold, which is a mechanism a single-chain monomer model cannot represent. It sits inside the curated MH2 window (323–552, local position 39), which had never been run with real data. Because a domain window is active, the AlphaFold DB shortcut is skipped and **both** WT and MUT were predicted fresh on GPU with identical length and numbering (WT pLDDT 86.94, MUT pLDDT 86.33, domain-averaged), then run through the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

The real Kabsch RMSD_Ca = **0.3639 Å** (N=230) — the third-lowest of the twelve real oncology-panel cases, after KRAS (0.2015 Å) and BRCA1 (0.323 Å) — which empirically validates the SMAD4 window as a very stable, reproducible prediction. At the mutated residue the real signals are small: pLDDT 95.88 → 94.50 (Δ = −1.38), ΔSASA at the residue +5.22 Å² (region-averaged +0.89 Å²), local ΔFD_bc −0.047. ΔΔG is +0.24 kcal/mol, and the real **PS_v4 = −0.0148** classifies R361H as a **Variant of Uncertain Significance** — not Pathogenic.

This is the seventh real case landing in VUS. It differs from CDKN2A R24P and PTEN R130Q, where an unusually large global RMSD coexisted with flat local signals: here the prediction is stable, both globally and at the residue, so there is simply nothing in the monomer structure for the score to read. That is consistent with — but does not prove — a mutation whose effect is on a binding interface; testing that would require modelling the SMAD trimer or the SMAD4–R-SMAD complex, which is outside the current single-chain scope. Across the twelve real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H), PS_v4 is correct in direction twice (M1775R, V600E) out of twelve.

### Real result: RB1 R661W — the case chosen to look for a third correct call, and no local signal

RB1 **R661W** sits in the pocket domain of the retinoblastoma protein and is a well-known low-penetrance retinoblastoma allele, generally described as a partial loss of function (reported as pathogenic/likely pathogenic; the exact ClinVar wording and the molecular mechanism were not re-verified here). It was chosen as the best remaining candidate for a real destabilizing effect, i.e. for a third correct call after BRCA1 M1775R and BRAF V600E. It lies inside the curated pocket-domain window (380–787, local position 282), which had never been run with real data. Because a domain window is active, the AlphaFold DB shortcut is skipped and **both** WT and MUT were predicted fresh on GPU with identical length and numbering (WT pLDDT 87.13, MUT pLDDT 86.90, domain-averaged), then run through the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

The real Kabsch RMSD_Ca = **1.5081 Å** (N=408), comparable to FGFR3's 1.537 Å, which empirically validates the RB1 window as a bounded, reproducible prediction. At the mutated residue the real signals are minimal: pLDDT 97.38 → 96.56 (Δ = −0.82), ΔSASA at the residue +1.09 Å² (region-averaged −0.39 Å²). The local ΔFD_bc at the residue itself is −0.120, the largest single-residue value in this series, but `classifyPath()` uses the region-averaged value (−0.009), so it does not contribute. ΔΔG is +0.12 kcal/mol, and the real **PS_v4 = −0.2397** classifies R661W as a **Variant of Uncertain Significance** — not Pathogenic.

This is the eighth real case landing in VUS, and the hypothesis that motivated this run was not supported: a mutation expected to perturb the fold left no local destabilizing signal in the model, unlike M1775R and V600E. One reading is that a partial-function, low-penetrance allele simply has a small structural effect that AlphaFold2 does not resolve from the wild type; another is that the effect lies outside what a single-chain monomer prediction can show. A single WT/MUT pair cannot distinguish between them. The two correct calls therefore remain the only two. Across the thirteen real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W), PS_v4 is correct in direction twice (M1775R, V600E) out of thirteen.

### Real result: VHL L158P — a BC-box mutation with no change in confidence at the residue

VHL **L158P** is associated with von Hippel-Lindau disease and is generally described as a misfolding/destabilizing variant (the exact ClinVar wording was not re-verified here). It was chosen for that reason, as the last remaining candidate for a real destabilizing signal after BRCA1 M1775R and BRAF V600E. On closer inspection its position argues against a simple folding mechanism: the flanking sequence (`…TLKERCL…`) is the BC-box motif through which VHL binds Elongin C, and L158 is the conserved leucine of that motif, so to the best of our knowledge its pathogenic effect is more likely loss of Elongin C binding than destabilization of the monomer — a complex-level mechanism a single-chain model cannot show. VHL has no domain window in the panel (its N-terminal residues 1–53 are an intrinsically disordered acidic-repeat region), so it was run full-length with the AlphaFold DB shortcut disabled, meaning **both** WT and MUT were predicted fresh on GPU with identical length and numbering (WT pLDDT 82.33, MUT pLDDT 82.18, whole-protein), followed by the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

The real Kabsch RMSD_Ca = **2.5177 Å** (N=213) — the third-highest of the fourteen real oncology-panel cases. It did not show the ~20 Å-scale inflation seen with TP53's unrestricted disordered flanks, but it still includes the disordered N-terminus, so it cannot be attributed to the mutation from a single WT/MUT pair. At the mutated residue the real signals are essentially null: pLDDT 96.44 → 96.25 (Δ = −0.19), ΔSASA at the residue −35.2 Å² but region-averaged only −1.19 Å², local ΔFD_bc +0.047. ΔΔG is +0.007 kcal/mol, and the real **PS_v4 = −0.4032** classifies L158P as a **Variant of Uncertain Significance** — not Pathogenic.

This is the ninth real case landing in VUS, and the second consecutive run (after RB1 R661W) chosen to look for a third correct call that did not produce one. AlphaFold2 predicts leucine and proline at this position with the same very high confidence, which is consistent with the general caution that AlphaFold2 was not trained to predict the structural effect of point mutations. Whether the miss here reflects that limitation or, as the BC-box position suggests, a mechanism outside the monomer, cannot be separated with a single WT/MUT pair. The two correct calls remain the only two. Across the fourteen real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P), PS_v4 is correct in direction twice (M1775R, V600E) out of fourteen.

### Real result: IDH2 R172K — the paralog of IDH1 R132H, and a disordered-flank RMSD artefact

IDH2 **R172K** is the most common IDH2 hotspot in AML and glioma and the mitochondrial counterpart of IDH1 R132H: the mutated arginine is the homologous active-site residue (`…PITIG[R→K]HAHGD…` vs. IDH1's `…PIIIG[R→H]HAYGD…`), and the mutation is described as neomorphic (production of 2-hydroxyglutarate; reported as pathogenic/oncogenic — the exact ClinVar wording was not re-verified here). It was chosen as a paired test: same mechanism, different protein. IDH2 has no domain window in the panel, so it was run full-length (452 residues), with the WT from AlphaFold DB (whole-protein pLDDT 91.87) and only the mutant predicted on GPU (whole-protein pLDDT 90.35), followed by the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`. The first attempt was lost to a Colab runtime disconnect and repeated from scratch.

The pipeline's global Kabsch RMSD_Ca is **17.5887 Å** (N=452) — not a mutation effect. IDH2's first 39 residues are a mitochondrial transit peptide, which is disordered in the model, and a separate superposition of the same two structures shows that the RMSD is almost entirely that segment: **0.886 Å** over residues 40–452 (N=413; 1.071 Å over 40–250 and 0.571 Å over 250–452), against 11.65 Å for residues 1–39 superposed on their own. The 0.886 Å figure was computed in a separate step, not by the standard results cell, which stores the global value. This is the same disordered-flank artefact found with unrestricted TP53 (22.64 Å), and it means IDH2 would need a 40–452 window like TP53's before its global RMSD is usable; that window is not yet in the panel. `classifyPath()` does not use RMSD, so the classification is unaffected. At the mutated residue the real signals are minimal: pLDDT 95.88 → 96.00 (Δ = +0.12), ΔSASA at the residue −17.09 Å² (region-averaged −1.64 Å²), local ΔFD_bc −0.047. ΔΔG is −0.05 kcal/mol, and the real **PS_v4 = −0.4897** classifies R172K as a **Variant of Uncertain Significance** — not Pathogenic, and only 0.010 above the −0.5 Probably Benign boundary.

This is the tenth real case landing in VUS, and it allows a direct comparison with IDH1 R132H (PS_v4 = −0.1084, ΔpLDDT = −1.18, ΔΔG = +0.16, also VUS). Both variants share the mechanism and land in the same class, but PS_v4 differs by 0.38 units, and what sets the sign of ΔΔG is a difference of about one pLDDT point at the mutated residue — within the range one would expect from prediction variability, which cannot be measured with a single WT/MUT pair per variant. Near ΔΔG ≈ 0, the class returned by the score is fragile: one more point of pLDDT in the other direction would have moved IDH2 R172K into Probably Benign. Across the fifteen real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K), PS_v4 is correct in direction twice (M1775R, V600E) out of fifteen.

### Real result: NRAS Q61K — the family counterpart of KRAS G12D, with the opposite sign

NRAS **Q61K** is a recurrent oncogenic hotspot in melanoma (reported as pathogenic/oncogenic; the exact ClinVar wording was not re-verified here). Q61 lies in the switch II region (`…LDTAG[Q→K]EEYSA…`) and is generally described as the catalytic glutamine that positions the water for GTP hydrolysis, so, like KRAS G12D, the mutation keeps the GTPase in its active state by impairing hydrolysis. It was chosen as a paired test against KRAS G12D: same family, same kind of mechanism, though not the same residue (G12 is in the P-loop, Q61 in the flexible switch II). NRAS is small (189 residues) and was run full-length, with the WT from AlphaFold DB (whole-protein pLDDT 92.04) and only the mutant predicted on GPU (whole-protein pLDDT 91.10), followed by the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

The real Kabsch RMSD_Ca = **0.8815 Å** (N=189), with no sign of inflation from a disordered tail. At the mutated residue the real signals are larger than in the KRAS case: pLDDT 88.69 → 83.69 (Δ = −5.00), ΔSASA at the residue +59.33 Å² (region-averaged +4.95 Å²), local ΔFD_bc +0.132 (region-averaged +0.006). ΔΔG is +0.90 kcal/mol, and the real **PS_v4 = +1.0788** classifies Q61K as a **Variant of Uncertain Significance** — 0.12 below the 1.2 threshold for Probably Pathogenic, and, at the time it was run, the highest PS_v4 of any VUS case in this series (previously S45F, +0.8184; later surpassed by PIK3CA H1047R, +1.1482). By the criterion used throughout this section (only Pathogenic or Probably Pathogenic count as correct), it is not counted as a correct call.

This is the eleventh real case landing in VUS, and the comparison with KRAS G12D (PS_v4 = −0.5417, Likely Benign; ΔpLDDT = +0.69, ΔΔG = −0.08) is the most striking pair in the series: two members of the same GTPase family, sharing a mechanism, fall on opposite sides of the VUS band, 1.62 PS_v4 units apart, and the sign is set almost entirely by the pLDDT change at the mutated residue. Two readings are possible and a single WT/MUT pair per variant cannot separate them: the −5.0 pLDDT change at a flexible switch-II residue may partly reflect real local mobility, or it may be ordinary prediction variability at a loop; a G12D-type site simply gives less to read. Either way, the class the score returns for RAS hotspots depends on a few points of pLDDT. Across the sixteen real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K), PS_v4 is correct in direction twice (M1775R, V600E) out of sixteen.

### Real result: ALK F1174L — a very stable kinase window, and near-null local signals

ALK **F1174L** is a recurrent activating hotspot of the ALK kinase in neuroblastoma (reported as pathogenic/oncogenic; the exact ClinVar wording was not re-verified here), generally described as lying in the αC-helix region of the kinase domain, a location also not re-verified here. It sits inside the curated kinase window (1116–1392, local position 59), which had never been run with real data. Because a domain window is active, the AlphaFold DB shortcut is skipped and **both** WT and MUT were predicted fresh on GPU with identical length and numbering (WT pLDDT 92.12, MUT pLDDT 91.42, domain-averaged), then run through the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

The real Kabsch RMSD_Ca = **0.2652 Å** (N=277) — the second-lowest of the seventeen real oncology-panel cases, after only KRAS (0.2015 Å) — which empirically validates the ALK window as a very stable, reproducible prediction. At the mutated residue the real signals are minimal: pLDDT 94.88 → 93.56 (Δ = −1.32), ΔSASA at the residue −4.56 Å² (region-averaged +0.20 Å²), local ΔFD_bc −0.034. ΔΔG is +0.22 kcal/mol, and the real **PS_v4 = −0.0609** classifies F1174L as a **Variant of Uncertain Significance** — not Pathogenic, so it is not counted as a correct call under the criterion used throughout this section.

This is the twelfth real case landing in VUS, and the fourth activating kinase mutation in the series. The four return three different classes: EGFR L858R is classified Benign (ΔpLDDT = +30.25), FGFR3 K650E Benign (+6.31), BRAF V600E Probably Pathogenic (−6.0, the only correct one) and ALK F1174L VUS (−1.32). The one that scored correctly is the one with a real ΔpLDDT drop and a burial change at the residue; ALK F1174L moves neither signal appreciably, so it lands in the middle of the band. As before, a single WT/MUT pair per variant cannot separate a real effect from prediction variability. Across the seventeen real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K, F1174L), PS_v4 is correct in direction twice (M1775R, V600E) out of seventeen.

### Real result: HRAS G12V — the same residue as KRAS G12D, with the opposite sign

HRAS **G12V** is an oncogenic hotspot of the third RAS paralog (germline in Costello syndrome, somatic in tumours such as bladder cancer; reported as pathogenic/oncogenic, exact ClinVar wording not re-verified here). It shares residue G12 (`…VVVGA[G→V]GVGKS…`, the P-loop) with KRAS G12D, so it isolates two variables: the substitution (V vs. D) and the paralog. HRAS is small (189 residues) and was run full-length, with the WT from AlphaFold DB (whole-protein pLDDT 91.95) and only the mutant predicted on GPU (whole-protein pLDDT 88.81), followed by the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

At the mutated residue the real signals are larger than for KRAS G12D: pLDDT 94.88 → 90.12 (Δ = −4.76), ΔSASA at the residue +41.95 Å² (region-averaged +2.67 Å²), local ΔFD_bc +0.148 (region-averaged, roughening). ΔΔG is +0.81 kcal/mol, and the real **PS_v4 = +1.0400** classifies G12V as a **Variant of Uncertain Significance** — 0.16 below the 1.2 threshold for Probably Pathogenic — so it is not counted as a correct call under the criterion used throughout this section. This is one of the few cases where the fractal term is not negligible (+0.12 of the total), though removing it would still leave the class unchanged (PS_v4 = +0.92, VUS).

The global Kabsch RMSD_Ca = **1.3333 Å** (N=189), higher than KRAS (0.2015 Å) and NRAS (0.8815 Å). A separate superposition of the same structures (computed in a step outside the standard results cell) shows where it comes from: 0.975 Å over the G-domain (residues 1–166), of which 1.302 Å over the effector lobe (1–86, which contains G12 and the switch regions) and only 0.126 Å over the allosteric lobe (87–166), against 2.251 Å for the C-terminal tail (167–189) superposed on its own. The disordered tail therefore contributes but does not explain the value; the displacement concentrates in the lobe that contains the mutation and the flexible switch regions. Whether that is a real effect of G12V or prediction variability in a flexible region cannot be decided from one WT/MUT pair.

This is the thirteenth real case landing in VUS. HRAS G12V behaves like NRAS Q61K (ΔpLDDT −5.0, PS_v4 +1.0788) and not like KRAS G12D (ΔpLDDT +0.69, PS_v4 −0.5417), even though it shares its residue with the latter: two substitutions at the same site fall on opposite sides of the VUS band. Across the three RAS cases PS_v4 spans −0.54 to +1.08, and the sign is set by the pLDDT change at the mutated residue. Across the eighteen real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K, F1174L, G12V), PS_v4 is correct in direction twice (M1775R, V600E) out of eighteen.

### Real result: ERBB2 V777L — a validated N-lobe, and a global RMSD driven by a single flexible segment

ERBB2 (HER2) **V777L** is an activating kinase-domain mutation reported in breast and other cancers (reported as oncogenic; the exact ClinVar wording was not re-verified here) and belongs to the same ErbB family as EGFR L858R. It sits inside the curated kinase window (712–987, local position 66), which had never been run with real data. Because a domain window is active, the AlphaFold DB shortcut is skipped and **both** WT and MUT were predicted fresh on GPU with identical length and numbering (WT pLDDT 91.52, MUT pLDDT 91.39, domain-averaged), then run through the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

At the mutated residue the real signals are minimal: pLDDT 92.62 → 91.06 (Δ = −1.56), ΔSASA at the residue +2.28 Å² (region-averaged +0.72 Å²), local ΔFD_bc −0.026. ΔΔG is +0.26 kcal/mol, and the real **PS_v4 = +0.0196** classifies V777L as a **Variant of Uncertain Significance** — not Pathogenic, so it is not counted as a correct call under the criterion used throughout this section.

The global Kabsch RMSD_Ca = **3.6818 Å** (N=276) is not an effect of the mutation. A separate superposition of the same structures (computed outside the standard results cell) shows that the N-lobe, where V777 lies, is very stable (0.948 Å over local positions 20–110) while the C-lobe is not (4.311 Å over 111–276). After superposing positions 20–276, the largest Cα displacements are a short segment at local positions 161–168 (about residues 872–879 in UniProt numbering), which moves 14.5–19.9 Å between the two predictions. From its position this is probably the activation loop, a flexible segment that AlphaFold2 does not predict reproducibly; that identification is an inference from position and was not checked against the annotation. The ERBB2 window is therefore validated in its N-lobe and over most of the domain, but its global RMSD cannot be cited as evidence of a mutation effect.

This is the fourteenth real case landing in VUS and the fifth activating kinase mutation in the series. The five return three classes: EGFR L858R and FGFR3 K650E Benign, BRAF V600E Probably Pathogenic (the only correct one), and ALK F1174L and ERBB2 V777L VUS. ERBB2 V777L resembles ALK F1174L, with near-null local signals, and not its ErbB relative EGFR L858R (ΔpLDDT +30.25), which fell at the opposite extreme. As before, a single WT/MUT pair per variant cannot separate a real effect from prediction variability. Across the nineteen real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K, F1174L, G12V, V777L), PS_v4 is correct in direction twice (M1775R, V600E) out of nineteen.

### Real result: MET M1250T — a second curated-numbering bug, and a window tail that inflates the RMSD

Running MET exposed a second numbering bug in the curated panel data. The four documented MET hotspots (Y1253D, M1268T, D1246N, Y1248H) are in literature numbering, which is offset by +18 from the canonical UniProt P08581 sequence (1390 residues) that the notebook uses. Checked against the live sequence: canonical positions 1246, 1248, 1253 and 1268 are P, K, E and S, not D, Y, Y and M, whereas positions 1228, 1230, 1235 and 1250 are D, Y, Y and M, in the expected contexts (`FGLAR[D]MYDKE`, `LARDM[Y]DKEYY`, `YDKEY[Y]SVHNK`, `LPVKW[M]ALESL`). The first attempt with M1268T failed the notebook's residue check for exactly this reason. The entry in the notebook embedded in `index.html` is corrected (now Y1235D, M1250T, D1228N, Y1230H); the app's own `CancerProteinsDB` and validation panel already used canonical numbering.

The variant run is therefore MET **M1250T** (M1268T in the literature), the classic hotspot of type 1 hereditary papillary renal carcinoma and an activating kinase mutation (reported as pathogenic; the exact ClinVar wording was not re-verified here). It sits inside the curated kinase window (1049–1360, local position 202), which had never been run with real data. Because a domain window is active, the AlphaFold DB shortcut is skipped and **both** WT and MUT were predicted fresh on GPU with identical length and numbering (WT pLDDT 87.89, MUT pLDDT 87.82, domain-averaged), then run through the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

At the mutated residue the real signals are minimal: pLDDT 96.94 → 96.38 (Δ = −0.56), ΔSASA at the residue −0.27 Å² (region-averaged −3.48 Å²), local ΔFD_bc 0.000. ΔΔG is +0.02 kcal/mol, and the real **PS_v4 = −0.4128** classifies M1250T as a **Variant of Uncertain Significance** — not Pathogenic, so it is not counted as a correct call under the criterion used throughout this section.

The global Kabsch RMSD_Ca = **2.5612 Å** (N=312) is not an effect of the mutation. A separate superposition of the same structures (computed outside the standard results cell) shows that it comes almost entirely from the end of the window: 0.081 Å over local positions 1–100, 0.477 Å over 101–200, 0.502 Å around the mutated residue (170–235), but 3.956 Å over 201–312. After superposing all residues, the eight last residues of the window (local positions 305–312, i.e. 1353–1360) are displaced 9–20 Å; without them the RMSD is **0.847 Å** over 304 residues, and the mutated residue itself moves 0.85 Å. The window therefore appears to extend a few residues past the end of the kinase domain, and that tail is what moves between predictions; this is an inference from position and was not checked against the annotation. The MET window is validated over its structured part, not at its tail.

This is the fifteenth real case landing in VUS and the sixth activating kinase mutation in the series. The six return three classes: EGFR L858R and FGFR3 K650E Benign, BRAF V600E Probably Pathogenic (the only correct one), and ALK F1174L, ERBB2 V777L and MET M1250T VUS. As before, a single WT/MUT pair per variant cannot separate a real effect from prediction variability. Across the twenty real oncology-panel cases executed to date (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K, F1174L, G12V, V777L, M1250T), PS_v4 is correct in direction twice (M1775R, V600E) out of twenty.

### Real result: BCR-ABL T315I — a resistance mutation with no pathogenic label, and the most stable window in the series

ABL1 **T315I** is the "gatekeeper" mutation that confers acquired resistance to imatinib in chronic myeloid leukaemia: the bulky isoleucine sterically blocks the drug while leaving kinase activity intact, and no destabilization of the fold is expected. It is therefore **not a pathogenic-versus-benign variant in the usual sense**, and there is no such label against which to judge PS_v4. This case was run for completeness of the panel and is **not scored** in the tallies below. Note also that the panel entry called "BCR-ABL" is the ABL1 kinase domain alone (UniProt P00519, window 242–493, local position 74), not the BCR-ABL fusion protein.

Before running it, the panel numbering was checked against the live UniProt sequence, given the two numbering bugs found earlier (FGFR3, MET): for ABL1 the documented hotspots T315, E255, Y253, F317 and M351 all match at offset 0, and the same check on PIK3CA (H1047, E545, E542, E726) also found no offset, so no correction was needed. Because a domain window is active, the AlphaFold DB shortcut is skipped and **both** WT and MUT were predicted fresh on GPU with identical length and numbering (WT pLDDT 92.78, MUT pLDDT 92.67, domain-averaged), then run through the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`.

The real Kabsch RMSD_Ca = **0.0815 Å** (N=252) — the lowest of all real cases (previously KRAS, 0.2015 Å), which leaves no room for a displaced flexible segment of the kind that inflated ERBB2 and MET, and validates the ABL1 window as extremely stable. At the mutated residue the real signals are minimal: pLDDT 95.62 → 95.06 (Δ = −0.56), ΔSASA at the residue +11.02 Å² (region-averaged +0.16 Å²), local ΔFD_bc −0.010. ΔΔG is +0.09 kcal/mol, and the real **PS_v4 = −0.2889** classifies T315I as a **Variant of Uncertain Significance**. That output is what one would expect for a mutation that does not perturb the fold, but since the mutation is neither pathogenic nor benign in the sense the score is built to detect, it cannot be counted as a correct or an incorrect call.

Accounting: twenty of the twenty-one real oncology-panel cases carry a pathogenic or benign label and are scored (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K, F1174L, G12V, V777L, M1250T), and PS_v4 is correct in direction twice (M1775R, V600E) out of those twenty; BCR-ABL T315I is listed as a twenty-first case and left out of the denominator.

### Real result: PIK3CA H1047R — the last panel variant, just under the Probably Pathogenic threshold

PIK3CA **H1047R** is the most common PIK3CA hotspot, an activating mutation in the kinase domain frequent in breast, colorectal and other cancers (reported as pathogenic/oncogenic; the exact ClinVar wording was not re-verified here). It is generally described as enhancing lipid-kinase activity through the kinase C-terminal region and its interaction with the membrane, a mechanism a single-chain monomer model may not capture (also not re-verified here). Numbering was checked against the live UniProt sequence beforehand (H1047, E545, E542, E726 all match at offset 0). PIK3CA is the largest protein of the panel (1068 residues, multi-domain) and has no domain window, so it was run full-length, with the WT from AlphaFold DB (whole-protein pLDDT 92.36) and only the mutant predicted on GPU (whole-protein pLDDT 88.73), followed by the same real BioPython Kabsch RMSD, Shrake-Rupley SASA, FractEngine v2 local ΔFD_bc and `classifyPath()`. The first attempt was lost to a Colab runtime disconnect about 34 minutes into the mutant prediction; the retry took about 112 minutes and completed without incident.

At the mutated residue the real signals are: pLDDT 83.12 → 76.69 (Δ = −6.43), ΔSASA at the residue +29.82 Å² (region-averaged −5.93 Å²), local ΔFD_bc +0.006. ΔΔG is +0.91 kcal/mol, and the real **PS_v4 = +1.1482** classifies H1047R as a **Variant of Uncertain Significance** — only 0.052 below the 1.2 threshold for Probably Pathogenic, the closest any case has come to the upper (Probably Pathogenic) threshold, although IDH2 R172K sat 0.010 from the opposite, Probably Benign boundary. By the criterion used throughout this section it is not counted as a correct call.

The global Kabsch RMSD_Ca = **6.0611 Å** (N=1068) is mostly a disordered-terminus effect. A separate superposition of the same structures (computed outside the standard results cell) finds 44 residues displaced more than 8 Å after superposing all residues, in the ranges 1–3, 507–518, 868–869, 943–950 and **1050–1068**; the last ten residues move 39–55 Å between the two predictions, and the C-terminal tail has low confidence (pLDDT 29–57 in the WT and 51–70 in the mutant at four sampled positions). Without those 44 residues the RMSD is 1.724 Å over 1024 residues; the kinase domain without the tail (797–1050) has 2.328 Å, the segment around the mutation without the tail (1027–1050) 2.567 Å, and the mutated residue itself moves 3.77 Å. Two consequences follow. First, the global RMSD is not usable as evidence of a mutation effect. Second, the ±12-residue window over which `classifyPath()` averages ΔSASA (here −5.93 Å²) extends to residue 1059 and so includes part of that irreproducible tail; its contribution to ΔΔG is small (0.02 × −5.93 = −0.12 kcal/mol out of +0.91) but its direction cannot be known, and with PS_v4 only 0.052 below a class boundary, a perturbation of that size is enough to change the class. A domain window for PIK3CA (for example the kinase region without its tail) would address this, but it was not added, since it would change the panel design for this protein alone. WT comes from AlphaFold DB and the mutant from a fresh ColabFold prediction, so some pipeline variability is also included.

This is the sixteenth scored case landing in VUS and, by PS_v4 value, the highest of them (previously NRAS Q61K, +1.0788). With it the panel is complete: twenty-two real oncology-panel variants have been executed, twenty-one with a pathogenic or benign label and scored (R175H, Y107H, L858R, M1775R, K650E, S45F, V600E, G12D, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K, F1174L, G12V, V777L, M1250T, H1047R), and PS_v4 is correct in direction twice (M1775R, V600E) out of those twenty-one; BCR-ABL T315I was run but is not scored.

### Replicate test: a second AlphaFold2 random seed on all 22 variants

Every result above comes from **one** prediction per structure, at ColabFold's default random seed (0). To see how much of each result is the variant and how much is the sampling, all 22 variants were re-run end-to-end with the identical pipeline and configuration except `--random-seed 1` (the model files in the run say `seed_001`; the notebook's CELDA 7 now reads an optional `SEMILLA` variable, default 0). For the windowed proteins both WT and MUT were predicted afresh, as in the original runs. For the full-length proteins the WT was set up as in each original run: the AlphaFold DB model for NRAS, HRAS, CDKN2A, IDH1, IDH2 and PIK3CA (so only the mutant was re-sampled), and a fresh ColabFold prediction of both structures for KRAS, VHL and CTNNB1, whose original runs had predicted both. (A first version of this test used the AlphaFold DB WT for those three, which is not like-for-like: it gave PS_v4 +1.196, +0.219 and +1.528 with RMSD 2.34, 11.47 and 17.46 Å for KRAS G12D, VHL L158P and CTNNB1 S45F, against +0.870 / 0.90 Å, −0.414 / 0.90 Å and +0.835 / 24.5 Å once both structures were predicted, and it would have shown CTNNB1 S45F changing class when it does not. That version was discarded, and an earlier statement in this README that the WT was the AlphaFold DB model "as in the original runs" for KRAS was wrong.)

| Variant | ΔpLDDT at the residue (seed 0 → seed 1) | RMSD Cα, Å | PS_v4 | Class |
|---|---|---|---|---|
| TP53 R175H | -1.62 → -1.94 | 0.617 → 0.8011 | -0.003 → +0.031 | VUS → VUS |
| TP53 Y107H (benign control) | n/r → -0.75 | 1.377 → 0.8948 | -0.210 → -0.237 | VUS → VUS |
| EGFR L858R | +30.25 → +20.19 | 0.887 → 0.671 | -6.889 → -4.731 | Benign → Benign |
| BRCA1 M1775R | -20.00 → -19.50 | 0.323 → 0.114 | +5.041 → +4.918 | Pathogenic → Pathogenic |
| FGFR3 K650E | +6.31 → +11.72 | 1.537 → 1.456 | -1.998 → -2.800 | Benign → Benign |
| CTNNB1 S45F | -3.00 → -5.61 | 3.082 → 24.51 | +0.818 → +0.835 | VUS → VUS |
| BRAF V600E | -6.00 → -2.94 | 2.338 → 0.701 | +1.312 → +0.814 | Probably Pathogenic → VUS **(class changes)** |
| KRAS G12D | +0.69 → -4.25 | 0.2015 → 0.9022 | -0.542 → +0.870 | Likely Benign → VUS **(class changes)** |
| IDH1 R132H | -1.18 → -1.81 | 0.5133 → 0.592 | -0.108 → +0.109 | VUS → VUS |
| PTEN R130Q | +0.18 → +0.74 | 2.09 → 4.007 | -0.469 → -0.565 | VUS → Likely Benign **(class changes)** |
| CDKN2A R24P | -1.06 → -1.12 | 6.244 → 4.917 | -0.204 → -0.178 | VUS → VUS |
| SMAD4 R361H | -1.38 → -2.44 | 0.364 → 0.5472 | -0.015 → +0.288 | VUS → VUS |
| RB1 R661W | -0.82 → -0.75 | 1.508 → 0.3817 | -0.240 → -0.241 | VUS → VUS |
| VHL L158P | -0.19 → -0.25 | 2.518 → 0.9028 | -0.403 → -0.414 | VUS → VUS |
| IDH2 R172K | +0.12 → +0.68 | 17.59 → 16.16 | -0.490 → -0.584 | VUS → Likely Benign **(class changes)** |
| NRAS Q61K | -5.00 → -4.69 | 0.882 → 0.8598 | +1.079 → +0.960 | VUS → VUS |
| ALK F1174L | -1.32 → +0.19 | 0.265 → 0.2895 | -0.061 → -0.436 | VUS → VUS |
| HRAS G12V | -4.76 → -4.94 | 1.333 → 1.169 | +1.040 → +1.079 | VUS → VUS |
| ERBB2 V777L | -1.56 → -1.19 | 3.682 → 3.556 | +0.020 → -0.110 | VUS → VUS |
| MET M1250T | -0.56 → -0.38 | 2.561 → 3.173 | -0.413 → -0.427 | VUS → VUS |
| BCR-ABL (ABL1) T315I | -0.56 → -0.38 | 0.0815 → 0.1136 | -0.289 → -0.329 | VUS → VUS |
| PIK3CA H1047R | -6.43 → +3.69 | 6.061 → 6.048 | +1.148 → -1.376 | VUS → Likely Benign **(class changes)** |

What this shows, and what it does not:

- **Most scores move a little, a few move a lot.** The paired difference in PS_v4 between the two seeds has a median of 0.11, a mean of 0.41 and a maximum of 2.52 (PIK3CA H1047R); it exceeds 0.5 in 4 of 22 variants and 1.0 in 3. The heavy tail comes almost entirely from ΔpLDDT at the mutated residue, which enters PS_v4 with a weight of −0.24 per unit: it moved by 10.1 units for EGFR L858R (through the WT) and PIK3CA H1047R (through the mutant), by 5.4 for FGFR3 K650E and by 4.9 for KRAS G12D.
- **The class changed in 5 of 22 variants** (BRAF V600E, KRAS G12D, PTEN R130Q, IDH2 R172K, PIK3CA H1047R). The changes are concentrated at the class boundaries: of the 7 variants whose seed-0 score lay within 0.12 of a threshold (BRAF V600E, KRAS G12D, PTEN R130Q, VHL L158P, IDH2 R172K, MET M1250T, PIK3CA H1047R), 5 changed class, and all 5 class changes are among them. A single-seed classification near a boundary is therefore close to a coin flip.
- **The correct calls are not stable, except one.** On seed 0 the two correct calls were BRCA1 M1775R and BRAF V600E. On seed 1 the only correct call is BRCA1 M1775R. BRCA1 M1775R is the only one correct on both seeds (PS_v4 +5.041 and +4.918, ΔpLDDT −20.0 and −19.5, ΔSASA at the residue +42.0 and +41.0 Å²): a large, robust destabilizing signal at the residue does not depend on the seed. BRAF V600E falls to VUS. So the count of correct calls falls from two of twenty-one to one, and only BRCA1 M1775R is reproducible.
- **The failures that are systematic do reproduce.** EGFR L858R (−6.889 and −4.731) and FGFR3 K650E (−1.998 and −2.800) are Benign on both seeds; the benign control TP53 Y107H is VUS on both; TP53 R175H, IDH1 R132H, SMAD4 R361H, RB1 R661W, ALK F1174L, ERBB2 V777L, MET M1250T, NRAS Q61K, HRAS G12V, CDKN2A R24P, VHL L158P and BCR-ABL T315I are VUS on both. The conclusion that PS_v4 does not see these mutations, and is confidently wrong on two activating kinase drivers, does not depend on the seed. What depends on the seed is the borderline calls.
- **RMSD is a noisier quantity than the score.** The global RMSD changed by more than a factor of two in 6 of 22 variants (BRCA1 M1775R, CTNNB1 S45F, BRAF V600E, KRAS G12D, RB1 R661W, VHL L158P); the BRAF value that had been read as a conformational shift (2.338 Å) became 0.701 Å, and the very low KRAS G12D value (0.2015 Å) became 0.902 Å. Individual RMSD readings should not be interpreted as effects of the mutation from a single WT/MUT pair. The IDH2 transit-peptide artefact (16.16 Å) did reproduce, as did the CDKN2A, ERBB2 and MET values in the same range as before.
- **EGFR L858R reproduces as a class, not as a number.** The mutant's pLDDT at the residue is stable (89.19 and 89.38), the WT's is not (58.94 and 69.19), so ΔpLDDT falls from +30.25 to +20.19 and PS_v4 from −6.889 to −4.731.

Limits: two draws per variant show that the variability is large and where it is concentrated, but do not estimate its distribution or say which draw is closer to the truth; the full-length variants with an AlphaFold DB WT did not re-sample the WT, which would add variability; and one extra seed is not a confidence interval. The conclusion that PS_v4 is not usable as evidence of pathogenicity is unchanged: of its two correct calls one did not survive a change of seed, while its systematic failures did.

### Extending the replicate test: three to four seeds on eight variants

The two-seed test above shows that the sampling noise is real but does not say how a score behaves under repeated draws. Two more seeds (2 and 3) were therefore run on the eight variants selected for this purpose: the two correct calls at the time (BRCA1 M1775R, BRAF V600E), three variants whose class had just changed on the second seed (KRAS G12D, PTEN R130Q, IDH2 R172K), the largest full-length protein (PIK3CA H1047R), the confidence-artefact case (EGFR L858R), and the only benign control (TP53 Y107H) — giving three or four independent draws per variant instead of two. PIK3CA H1047R has only three: two independent re-runs of its fourth draw both stalled for 40+ minutes at the MSA-search step with no progress (once after 4 hours, once after 45 minutes) and were abandoned rather than left to run indefinitely; this is disclosed here rather than silently reported as four.

A second bug was found and fixed while running this extension: clearing the output directory before a fresh prediction (to force ColabFold to recompute rather than silently reuse a same-named directory's earlier files, the same issue that produced the identical seed2/seed3 values initially seen for EGFR and BRAF) also deleted the AlphaFold DB structure for the three variants that use it as WT (IDH2, PIK3CA — and would have for others outside this subset), because that structure lives in the same directory ColabFold would otherwise write into. The first IDH2 seed-3 run silently compared the leftover structure from the previous variant (PTEN) against itself, producing a nonsensical `mutation_check` (caught by the pipeline's own residue check, not by inspection) and an RMSD suspiciously identical to PTEN's. It was discarded and re-run with a fix that clears only the mutant's directory when the WT comes from AlphaFold DB.

| Variant | n | PS_v4 per seed (0, 1, 2, 3) | Mean | SD | Range | Correct calls |
|---|---|---|---|---|---|---|
| EGFR L858R | 4 | -6.889, -4.731, -4.397, -3.565 | -4.90 | 1.23 | 3.32 | 0/4 |
| BRAF V600E | 4 | +1.312, +0.814, -0.853, -1.005 | +0.07 | 1.01 | 2.32 | 1/4 |
| BRCA1 M1775R | 4 | +5.041, +4.918, +4.812, +4.742 | +4.88 | 0.11 | 0.30 | 4/4 |
| TP53 Y107H (benign control) | 4 | -0.210, -0.237, -0.226, -0.241 | -0.23 | 0.01 | 0.03 | 0/4 |
| PTEN R130Q | 4 | -0.469, -0.565, -0.048, +0.209 | -0.22 | 0.31 | 0.77 | 0/4 |
| IDH2 R172K | 4 | -0.490, -0.584, -0.481, -0.615 | -0.54 | 0.06 | 0.13 | 0/4 |
| PIK3CA H1047R | 3 | +1.148, -1.376, -1.407 | -0.54 | 1.20 | 2.55 | 0/3 |
| KRAS G12D | 4 | -0.542, +0.870, -0.497, -1.077 | -0.31 | 0.72 | 1.95 | 0/4 |

Across the 31 draws on these eight variants, 5 are correct in direction — BRCA1 M1775R is the only variant correct on every draw (SD 0.11 PS_v4 units, the tightest of the eight): a real, reproducible destabilising signal. BRAF V600E is correct on 1 of 4: the first, default-seed draw happened to be Probably Pathogenic, but the other three are VUS or Likely Benign, so a single run of this variant is close to a coin flip. The benign control, TP53 Y107H, is the most stable of the eight after BRCA1 M1775R (SD 0.01) and is wrong on all four draws — the score is confident and consistently wrong here, not merely noisy. EGFR L858R (stably Benign on every seed) is wrong the same way. PTEN R130Q, IDH2 R172K, PIK3CA H1047R and KRAS G12D oscillate between VUS and Likely Benign across seeds (all four are pathogenic, so neither class is correct), with ranges of 0.13-2.55 PS_v4 units: these sit in a genuinely unstable region of the score's output, not near a fixed value that merely happens to cross a boundary.

This is a small extension (n=3-4, eight of thirty-three real variants and controls tested this way) and does not estimate the score's true variance. What it does show is that a single-seed classification, the format every result elsewhere in this document is reported in, is often not representative of what a second or third run would give: for seven of these eight variants at least one seed gives a different class than another seed of the same variant.

### Completing the professor's 40-pair panel: 39 of 40 pairs now real

Every real result so far came from a set of 22 variants chosen by the project team, not from the 40-pair panel (ClinVar + COSMIC Tier 1) the app's validation module was originally built around and the professor referenced directly. That panel was run 22 new WT/mutant pairs (real ColabFold/AlphaFold2, real RMSD/SASA, real `classifyPath()`) to close the gap: 17 of the panel's 40 pairs were already covered by the original 22-variant study (by exact gene+mutation match), so 22 pairs needed a fresh run. One of those 22, APC R1450*, is a nonsense (stop-gain) mutation and was excluded outright — the pipeline only models single-residue substitutions, not truncations. All of the remaining 21 completed on the first pass. The 22nd, BRCA1 C61G, needed three separate attempts: the full-length protein (1863 residues, RING domain, outside the project's curated BRCT window) did not finish within a free Colab session even after switching the WT to an AlphaFold DB structure and predicting only the mutant — the run was still executing past 12 hours across two attempts before the session was lost to a disconnect or a GPU-quota block. It was ultimately run on a curated 1–300 fragment covering the RING domain (WT and mutant both predicted fresh, no AlphaFold DB), which completed in under 30 minutes.

**Net panel coverage: 39 of 40 pairs have real data, 1 is permanently excluded (APC R1450*).**

Two of the 21 new pairs needed a full-length run outside any curated domain window and are worth flagging on their own. FGFR3 S249C (extracellular Ig-II/Ig-III linker, position 249) falls outside the project's kinase-domain window (472–761), so both WT and mutant were predicted fresh as the complete 806-residue receptor with no multimer or membrane context; both runs had pTM ≈ 0.45–0.50 and produced a global Cα RMSD of 24.7 Å between them — an order of magnitude above every other pair in this project. That is very likely inter-domain packing uncertainty (a known AlphaFold2 failure mode for multi-domain proteins joined by flexible linkers, unrelated to the point mutation) rather than a real conformational signal, and is reported here rather than silently included as if it meant something.

| Panel # | Variant | Region | ΔpLDDT (point) | RMSD Cα (Å) | PS_v4 | Class | Correct | Source |
|---|---|---|---|---|---|---|---|---|
| 2 | TP53 R248W | 94–312 | -0.82 | 0.584 | -0.244 | VUS | ✗ | new |
| 3 | TP53 R248Q | 94–312 | -0.13 | 1.182 | -0.438 | VUS | ✗ | new |
| 4 | TP53 R273H | 94–312 | +0.07 | 0.960 | -0.400 | VUS | ✗ | new |
| 6 | KRAS G12V | full | -0.32 | 0.664 | -0.256 | VUS | ✗ | new |
| 7 | KRAS G12C | full | +3.75 | 0.543 | -1.254 | Likely Benign | ✗ | new |
| 8 | KRAS G12R | full | -0.82 | 0.710 | -0.099 | VUS | ✗ | new |
| 9 | BRCA1 C61G | 1–300 (RING) ‡ | -15.50 | 27.691 ‡ | +3.649 | **Pathogenic** | ✓ | new |
| 10 | BRCA1 R1699W | 1646–1859 | -0.88 | 0.173 | -0.122 | VUS | ✗ | new |
| 11 | BRCA1 V1736A | 1646–1859 | -0.19 | 0.090 | -0.388 | VUS | ✗ | new |
| 12 | BRCA1 G1738E | 1646–1859 | -5.81 | 0.243 | +1.318 | **Probably Pathogenic** | ✓ | new |
| 14 | EGFR T790M | 712–979 | -0.93 | 0.634 | -0.173 | VUS | ✗ | new |
| 15 | EGFR C797S | 712–979 | +0.62 | 0.162 | -0.578 | Likely Benign | ✗ | new |
| 17 | BCR-ABL E255K | 242–493 | -0.06 | 0.070 | -0.354 | VUS | ✗ | new |
| 18 | BCR-ABL E255V | 242–493 | -1.32 | 0.142 | +0.083 | VUS | ✗ | new |
| 19 | BCR-ABL Y253F | 242–493 | -0.43 | 0.087 | -0.235 | VUS | ✗ | new |
| 20 | EGFR L747P | 712–979 | +4.94 | 1.102 | -1.625 | Benign | ✗ | new |
| 22 | BRAF V600K | 444–723 | -6.16 | 0.903 | +1.329 | **Probably Pathogenic** | ✓ | new |
| 24 | PIK3CA E545K | full | -0.37 | 5.993 | -0.161 | VUS | ✗ | new |
| 26 | PTEN C124S | 1–353 | +2.25 | 2.811 | -0.845 | Likely Benign | ✗ | new |
| 33 | MET Y1235D | 1049–1360 | -1.81 | 2.054 | +0.235 | VUS | ✗ | new |
| 36 | FGFR3 S249C | full | +6.90 | 24.733 † | -1.622 | Benign | ✗ | new |
| 38 | VHL Y98H | full | -0.69 | 1.814 | -0.227 | VUS | ✗ | new |

† Global RMSD almost certainly dominated by inter-domain packing uncertainty (pTM ≈ 0.45–0.50 on both runs), not the point mutation — see above.

‡ BRCA1 C61G was run on a curated 1–300 fragment (RING domain), not the full-length 1863-residue protein — see the paragraph above. Its global RMSD (27.7 Å) is very likely the same isolated-domain packing artefact as FGFR3 S249C: both WT and mutant runs had a global pLDDT of only ~52–56, well below a well-folded domain, consistent with a small fragment lacking the rest of the protein for context. Its point pLDDT drop (-15.5), however, is real and unusually large: C61 is one of the two RING zinc-coordinating cysteines, and losing it is BRCA1 C61G's known pathogenic mechanism (loss of E3 ligase activity) — the only one of the four correct calls below with a local, not just global, signal behind it.

Combined with the 17 already-real pairs from the original 22-variant study (Table above / earlier sections), **4 of the 39 real pairs classify correctly** (BRAF V600E, BRCA1 G1738E, BRAF V600K, BRCA1 C61G — 10.3%), three Probably Pathogenic and one Pathogenic. This is the same systematic-failure pattern documented throughout this document, now demonstrated on the panel the professor specified rather than on a team-selected sample of 22: activating, catalytic, or resistance mutations that don't perturb the fold (KRAS G12V/G12C/G12R, EGFR T790M/C797S/L747P, BCR-ABL E255K/E255V/Y253F, PTEN C124S, MET Y1235D) leave no usable pLDDT or SASA signal, and a full-length run outside any curated window (FGFR3 S249C) adds a large but likely-artefactual global RMSD rather than a real one. The conclusion is unchanged: with the current formulation, PS_v4 is not usable as evidence of pathogenicity — this extension replaces the 22-variant sample as the project's primary evidence for that conclusion, because it is grounded in the reference panel the professor asked for rather than one the team chose.

### Second-seed replication of the panel-40: eight variants chosen to cover the extremes

The panel-40 completion closed a reviewer item (real end-to-end data on the professor's own reference panel) but left another open: none of its 21 new pairs had been replicated with a second random seed, unlike the original 22-variant study. Rather than re-running all 39 real pairs (infeasible on free-tier Colab GPU), eight were selected by a fixed rule stated before running: the 3 pairs from the new batch that classify correctly (BRAF V600K, BRCA1 G1738E, BRCA1 C61G), the 3 VUS calls closest to the Probably Pathogenic threshold from below (MET Y1235D, BCR-ABL E255V, KRAS G12R), the documented RMSD-inflation case (FGFR3 S249C), and the most confidently wrong-direction call (KRAS G12C). All eight were re-run with `--random-seed 1` instead of the default 0.

| Variant | Seed 0 class | Seed 1 PS_v4 | Seed 1 class | Changed? |
|---|---|---|---|---|
| MET Y1235D | VUS (+0.235) | +0.115 | VUS | No |
| BCR-ABL E255V | VUS (+0.083) | -0.201 | VUS | No |
| KRAS G12R | VUS (-0.099) | +0.810 | VUS | No (but moved close to +1.2) |
| KRAS G12C | Likely Benign (-1.254) | -0.533 | Likely Benign | No |
| BRCA1 G1738E | Probably Pathogenic (+1.318) | +1.655 | Probably Pathogenic | No |
| BRCA1 C61G (RING fragment) | Pathogenic (+3.649) | +3.549 | Pathogenic | No |
| BRAF V600K | Probably Pathogenic (+1.329) | **-1.201** | **Likely Benign** | **Yes** |
| FGFR3 S249C | Benign (-1.622) | — | not replicated | — |

FGFR3 S249C (the one full-length, 806-residue run in the set) was attempted three times; each attempt was lost to a Colab runtime disconnect between roughly 1h50m and 2h into the WT prediction, before the mutant could even start — a consistent pattern, not bad luck, most likely the free-tier session limit for a job of this size and profile. It is reported as not replicated rather than guessed at.

Of the 7 pairs that did replicate, 6 kept their class and 1 did not: **BRAF V600K flips from Probably Pathogenic (correct) to Likely Benign (wrong direction)** — PS_v4 goes from +1.329 to -1.201, crossing both the VUS and Likely Benign boundaries on a different random seed alone, same protein, same mutation, same pipeline. Of the panel-40's four "correct" calls, this means only 3 are seed-stable in this check: BRCA1 G1738E and BRCA1 C61G reproduce cleanly (BRCA1 C61G's local ΔpLDDT signal in particular barely moves, -15.5 to -14.88, even though its artefactual global RMSD does not, 27.7 Å to 16.9 Å), while BRAF V600K's correctness in the original run looks, on this evidence, like it depended on which random seed ColabFold happened to use. This is the same instability already documented for the original 22-variant study (5 of 22 changed class on a second seed) and for BRAF V600E specifically (1 of 4 seeds correct) — now shown to extend to the panel-40 completion as well. It does not change the panel's headline number (4/39 correct, scored on seed 0 as originally run), but it is a reason to read that number as upper-bound-ish rather than exact: at least one of the four is not a reliable hit.

### The breast-cancer panel's 40 pairs and 12 controls: from fully simulated to fully real

A separate validation module in the app — the breast-cancer panel (GRCh38/hg38, requested by the thesis director as a Phase-1 pilot, 40 pathogenic pairs plus 12 benign controls) — had remained entirely simulated (deterministic, seeded, not ColabFold output) even after the oncology panel-40 above was closed with real data. All 52 pairs were run for real this session: 28 new WT/mutant ColabFold/AlphaFold2 pairs (the other 12 pathogenic pairs share gene and mutation with the oncology panel-40 and already had real data, so were not re-run) plus all 12 controls, using the same domain-window methodology as the oncology panel — a `BC_GENES` window table covering this panel's own gene list, with a fixed ±150-residue window around the mutated position (clipped to protein bounds) for any control variant falling outside a curated window, to avoid ever attempting a full-length run on a protein known from prior sessions to exceed free-tier Colab limits (BRCA1, BRCA2, ATM). The scope — running all 28 new pairs plus all 12 controls, including 10 pairs flagged in the app itself as "⚑ review with the director" because their variant is a hotspot in another tumor type rather than a confirmed Tier-1 breast-cancer mutation — was an explicit decision to not exclude anything, so that any systematic failure would show up on the full set the director specified, not on a team-filtered subset.

Three literature-to-UniProt numbering mismatches were found and corrected the same way as the earlier FGFR3/MET bugs — scanning the sequence for the expected wild-type residue near the stated position: MYC T58A is UniProt position 73 (classical 439-aa isoform numbering, offset +15 from the 454-aa canonical sequence), NOTCH1 L1575P is UniProt position 1593 (COSMIC's mature-protein numbering excludes the 18-residue signal peptide that UniProt's canonical numbering includes), and MAP3K1 T1381I is UniProt position 1380 (offset -1). A fourth case, KMT2C S3662F, could not be resolved with confidence: position 3662 falls in an intrinsically disordered, low-complexity, serine/threonine/proline-rich stretch with no exact residue match in UniProt's canonical sequence near the stated position — the nearest serine (3660, offset -2) was used and the uncertainty is flagged in the table rather than silently resolved.

**Pathogenic pairs: 6 of 40 classify correctly (15%)** — 4 of the 28 newly-run pairs, 2 of the 12 inherited from the oncology panel (BRCA1 C61G, BRAF V600E). This matches the 10.3% rate on the oncology panel-40 almost exactly, on an independently curated gene list.

| Variant | PS_v4 | Class | Correct |
|---|---|---|---|
| BRCA2 D2723A | -0.106 | VUS | ✗ |
| ESR1 Y537S | -1.954 | Benign | ✗ |
| MYC T58A | -1.945 | Benign | ✗ |
| CCND1 P287T | -2.266 | Benign | ✗ |
| CDK4 R24C | +0.023 | VUS | ✗ |
| CDK6 R31C | +0.136 | VUS | ✗ |
| ATM V2424G | +1.334 | **Probably Pathogenic** | ✓ |
| CHEK2 I157T | -0.029 | VUS | ✗ |
| PALB2 L939W | -0.133 | VUS | ✗ |
| AKT1 E17K | -0.411 | VUS | ✗ |
| FGFR1 N546K | +0.158 | VUS | ✗ |
| MDM2 C305S | -0.110 | VUS | ✗ |
| CDH1 E243K | +2.122 | **Probably Pathogenic** | ✓ |
| AR T878A | -0.515 | Likely Benign | ✗ |
| NOTCH1 L1575P | +0.895 | VUS | ✗ |
| MTOR C1483R | +1.516 | **Probably Pathogenic** | ✓ |
| MAP3K1 T1381I | -0.147 | VUS | ✗ |
| GATA3 R330G | -0.168 | VUS | ✗ |
| FOXA1 F266L | +1.234 | **Probably Pathogenic** | ✓ |
| KMT2C S3662F | +1.012 | VUS | ✗ |
| SF3B1 K700E | -0.433 | VUS | ✗ |
| BCL2 A113G | -0.347 | VUS | ✗ |
| RAD51D C119W | -0.597 | Likely Benign | ✗ |
| BARD1 C557S | -2.023 | Benign | ✗ |
| STK11 T189M | -0.413 | VUS | ✗ |
| JAK2 V617F | +0.637 | VUS | ✗ |
| STAT3 D661Y | +0.535 | VUS | ✗ |
| VEGFA P114L | +1.030 | VUS | ✗ |
| BRAF V600E | +1.312 | **Probably Pathogenic** | ✓ |
| BRCA1 C61G | +3.649 | **Pathogenic** | ✓ |
| CDKN2A R24P | -0.204 | VUS | ✗ |
| EGFR L858R | -6.889 | Benign | ✗ |
| ERBB2 V777L | +0.020 | VUS | ✗ |
| KRAS G12D | -0.542 | Likely Benign | ✗ |
| MET Y1235D | +0.235 | VUS | ✗ |
| NRAS Q61K | +1.079 | VUS | ✗ |
| PIK3CA H1047R | +1.148 | VUS | ✗ |
| PTEN R130Q | -0.469 | VUS | ✗ |
| RB1 R661W | -0.240 | VUS | ✗ |
| TP53 R175H | -0.003 | VUS | ✗ |

**Controls: 4 of 12 classify correctly as benign, but 4 of 12 (33%) are false positives** — classified Pathogenic or Probably Pathogenic despite being known-benign ClinVar variants, as many false positives as correct calls. This is the first panel in the project with enough real benign controls to measure a false-positive rate directly, and it is a materially stronger negative result than anything documented before: PS_v4 does not just miss most real pathogenic variants (false negatives, documented throughout this file) — it also actively mislabels a third of known-benign variants as pathogenic.

| Variant | PS_v4 | Class | Result |
|---|---|---|---|
| TP53 P72R | +2.587 | Pathogenic | **false positive** |
| BRCA1 S1613G | -0.286 | VUS | uncertain |
| BRCA1 P871L | -2.039 | Benign | correct |
| BRCA2 N372H | +1.315 | Probably Pathogenic | **false positive** |
| BRCA2 V2466A | +1.615 | Probably Pathogenic | **false positive** |
| ATM D1853N | +2.972 | Pathogenic | **false positive** |
| PALB2 Q559R | -0.395 | VUS | uncertain |
| ERBB2 I655V | -0.650 | Likely Benign | correct |
| CDH1 A592T | -0.484 | VUS | uncertain |
| BARD1 V507M | -0.418 | VUS | uncertain |
| STK11 F354L | -0.816 | Likely Benign | correct |
| MET N375S | -0.622 | Likely Benign | correct |

Two of the four control false positives (TP53 P72R, BRCA2 N372H) sit in the same intrinsically-disordered-region artefact pattern documented repeatedly above: a huge global RMSD (24–34 Å) driven by a flexible, low-pLDDT region rather than a real conformational effect of the point mutation. A third (BRCA2 V2466A) was not characterized in enough depth to attribute confidently. The fourth, **ATM D1853N, is not explained by that pattern**: its RMSD is normal (1.13 Å), the region is a well-folded HEAT repeat (WT global pLDDT ~82), and the model genuinely registers a local pLDDT drop (-12.6) and an elevated ΔΔG (2.0) at a position ClinVar calls benign. This is a more serious failure mode than the RMSD-inflation artifacts: here the score's own local-signal logic — the same logic that, on pathogenic variants, usually fails to fire at all — fires confidently in the wrong direction on a benign one.

Combined, the breast-cancer panel's 52 real pairs do not just reproduce the oncology panel-40's finding that PS_v4 misses the great majority of real pathogenic variants; they add the first direct, systematic evidence that it also misclassifies benign variants at a comparable rate, on a panel built independently of the oncology one. The conclusion carried through this document is unchanged — PS_v4 is not usable as evidence of pathogenicity with the current formulation — but the breast-cancer panel's control false-positive rate is new evidence for it, not a restatement of the oncology panel's finding.

### Why the coefficients are not recalibrated: an exploratory analysis

Recalibrating the PS_v4 weights on the real results was considered and tested exploratorily; it is **not** applied to the app. Data: 41 pathogenic real variants (the 37 scoreable panel pairs plus BRCA1 M1775R, FGFR3 K650E, VHL L158P, MET M1250T from the 22-variant study) and 11 real ClinVar-Benign controls.

| Predictor | AUC (pathogenic vs benign) | 95% bootstrap CI |
|---|---|---|
| PS_v4 (current score) | 0.549 | 0.370–0.726 |
| −ΔpLDDT | 0.590 | 0.406–0.761 |
| \|ΔpLDDT\| | 0.728 | 0.550–0.882 |
| log RMSD | 0.401 | 0.211–0.607 |

A leave-one-out logistic regression on ΔpLDDT, \|ΔpLDDT\| and log RMSD gives an out-of-sample AUC of 0.60 (CI 0.43–0.77), which does not exceed a permuted-label baseline (95th percentile 0.62). At the PS_v4 > 1.2 threshold the score calls 4 of 41 pathogenic variants (sensitivity 9.8%) and 0 of 11 benign ones (specificity 100%): it is specific only because it almost never calls anything pathogenic.

**Why no recalibration.** (1) There is no usable signal to fit: the current score is indistinguishable from chance (CI includes 0.5) and global RMSD is anti-informative (below 0.5), consistent with the RMSD inflation documented above. (2) The full four-term formula cannot be refit: ΔΔG, fitness and ΔFD_bc were retained only for the 21 new panel pairs, all pathogenic, so no benign class exists for those components; only ΔpLDDT, RMSD and PS_v4 are available for the original 22 variants and the controls. (3) The sample is small and imbalanced (41 vs 11) and the benign controls were chosen by a fixed rule, not as a representative sample. Fitting weights on this would overfit.

The score therefore keeps its current weights and stays declared unvalidated. The only variable with any signal is \|ΔpLDDT\| (AUC 0.73, lower CI bound just above 0.5), which is a lead to test on more data, not a finding.

### Ablation test and local FD_bc reliability

To test whether the fractal term actually contributes to classification, PS_v4 was recomputed on all seven real cases available (the six reference pairs above + TP53 R175H) with the `0.8·|ΔFD_bc|` term removed, and separately using `ΔFD_bc` in signed rather than absolute form. **Neither change altered the classification of any of the 7 cases** — the score is currently driven entirely by ΔΔG/fitness at this sample size and window scale. Separately, the OLS R² of the local FD_bc fit (21-residue window) was checked at the mutated residue for all 7 cases: it is **degenerate (R² = 0.000)** in 5 of the 6 experimental reference pairs — too few unsaturated scales survive the saturation correction for the regression to have meaningful variance to explain. TP53 R175H (the one AlphaFold2-predicted structure in the set) is the exception, with a well-constrained fit (R² = 0.966 WT / 0.976 MUT) — yet even there, the term did not change the outcome. On those first seven cases, this is direct empirical evidence that the fractal term contributed nothing. **The same ablation was later repeated on the oncology panel**: on the 17 of the 22 real panel variants whose local `ΔFD_bc` was retained, removing the term changed the class of **2 of 17** (PTEN R130Q and IDH2 R172K, both VUS → Probably Benign, because both sit just above the −0.5 boundary), using the signed value changed **1 of 17**, and **no correct call changed**; the largest contribution of the term to any score was **0.118** PS_v4 units. So the term is small on real data and unable to rescue or spoil a correct call in this set, but it is not strictly inert: it can move a borderline VUS across a class boundary.

---

## Pathogenicity score PS_v4

```
PS(i) = 1.5·ΔΔG(i) − 0.5·fitness(i) + 0.02·|ΔpLDDT(i)| + 0.8·|ΔFD_bc(i)|

ΔΔG(i) = −0.16·ΔpLDDT(i) + 0.020·ΔSASA(i)  [kcal/mol]
```

| PS range | Classification |
|----------|---------------|
| PS > 2.5 | Pathogenic |
| 1.2 – 2.5 | Probably Pathogenic |
| −0.5 – 1.2 | VUS |
| −1.5 – −0.5 | Probably Benign |
| PS ≤ −1.5 | Benign |

> ⚠️ The `0.8` weight on `|ΔFD_bc|` is a heuristic chosen by the team, **not a value derived or calibrated from Enright & Leitner (2005)** — that paper does not report an equivalent constant for this equation. It has not yet been calibrated against the experimental reference pairs. The `Math.abs()` on `ΔFD_bc` also means the score responds the same way to increased or decreased fractal roughness, discarding the sign of the change — this has not been re-examined against the hypothesis that directionality of ΔFD carries information.
>
> **Real ablation test (7 cases: 6 reference pairs + TP53 R175H):** removing `0.8·|ΔFD_bc|` from the score, or using `ΔFD_bc` with its sign instead of `Math.abs()`, changed the classification in **0 of 7 cases**. The local FD_bc estimate's own OLS fit is also degenerate (R²=0.000) at the mutated residue in 5 of the 6 experimental pairs, and well-constrained (R²>0.96) only for TP53 R175H — see [Ablation test and local FD_bc reliability](#ablation-test-and-local-fd_bc-reliability). Repeated on 17 real oncology-panel variants, removing the term changed the class of 2 (PTEN R130Q, IDH2 R172K; VUS → Probably Benign) and no correct call; its largest contribution was 0.118 PS_v4 units.
>
> This is the same formula implemented in `classifyPath()` in `index.html`, and its output range is **not** the same 0–1 scale used by the simulated 40-pair validation panel — see the in-app disclaimer on that tab.

---

## Tech stack

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend language | JavaScript ES2022 | All analysis, visualization, export logic |
| Data visualization | Chart.js 4.4.1 | Line, bar, heatmap charts |
| 3D viewer | 3Dmol.js r2.x | WebGL molecular rendering |
| ZIP export | JSZip 3.10.1 | CSV + JSON packaging |
| Backend | Google Colab + micromamba + Python 3.11 | ColabFold/AlphaFold2, BioPython SASA/RMSD |
| GPU | NVIDIA Tesla T4 (CUDA 13.0) | Structure prediction (15–30 min fast / 2–4 h accurate) |
| Deployment | Vercel | Zero-cost SPA hosting |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Google Colab (GPU)                                      │
│  ColabFold v1.5.5 + BioPython + fract_engine_v2.py      │
│  → wt_best.pdb, mut_best.pdb                            │
│  → delta_sasa.csv, rmsd_per_residue.csv                 │
│  → *_scores_rank_001*.json  →  all_outputs.zip          │
└───────────────────────┬─────────────────────────────────┘
                        │ download & upload
┌───────────────────────▼─────────────────────────────────┐
│  ProteinDelta SPA (browser)                              │
│  proteindelta.vercel.app                                 │
│  InputEngine → SimulationEngine / RealDataEngine         │
│  FractEngine → ScoringEngine → RenderEngine             │
│  ViewerEngine (3Dmol.js)  →  ExportEngine               │
└─────────────────────────────────────────────────────────┘
```

No sequences are transmitted to external servers. All computation runs in the user's browser or their own Google Colab session.

---

## Novelty v5 — Spatial Local Fractal Dimension

Proposed by the thesis director (Dr. Pedro A. Moreno Tovar): instead of averaging fractal dimension over the whole macromolecule (*Layer 1 — Global*, diluted for point mutations) or over a sequence window (existing 21-residue local FD, which can include residues far apart in 3D), compute FD_bc/FD_mr only over the atoms within a configurable-radius sphere (default **r = 10 Å**, adjustable 5–20 Å in the UI) centered on the mutated residue's Cα — its true 3D microenvironment, including tertiary contacts.

**Architecture impact:** runs entirely client-side in `index.html`, reusing the existing `sasaSurfacePoints` / `boxCountingGlobal` / `massRadius` functions with a different atom-selection step. No new dependencies, no build step, no changes to the Colab notebook or `fract_engine_v2.py`.

**Requirements:** real WT and MUT PDB files (produced by the existing ColabFold notebook) loaded via "Importar ColabFold." Not available in pure-simulation mode.

**UI additions:**
- New card **"🎯 FD Local Espacial"** in the Fractal tab — radius slider (5–20 Å) + recalculate button; shows ΔFD_bc and ΔFD_mr per mutation site.
- **"🎯 Resaltar microentorno"** button in the 3D viewer — highlights the sphere atoms in magenta and the mutated residue in cyan using 3Dmol.js's native `within` selector.

**Not yet done:** folding ΔFD_local into PS_v4 (kept as a separate, parallel metric for now to avoid re-calibrating the uncalibrated coefficient 0.8 — see the caveat under [Pathogenicity score PS_v4](#pathogenicity-score-ps_v4)).

---

## Limitations

- **What is actually validated on real PDB coordinates today: the fractal-dimension calculation over the experimental reference pairs analyzed directly with `fract_engine_v2.py`.** Everything downstream of that (ΔΔG, fitness, RMSD, SASA, PS_v4, and their behavior across the 40-pair oncology panel and the breast-cancer panel) currently runs on simulated inputs in the deployed app, not on ColabFold/BioPython output for those pairs.
- ΔΔG formula is a first-order empirical approximation (r ~ 0.65 with FoldX). Use as prioritization tool, not thermodynamic prediction.
- FractEngine v2 validated on synthetic structures; application to all 40 real PDB pairs is pending (future work).
- The 40-pair oncology panel (Validation tab) and the 40-case/12-control breast-cancer panel (Breast Cancer Validation tab) both run on deterministic seeded simulations, not on real pipeline output — see the in-app disclaimers on each tab. Their sensitivity/specificity/ROC-AUC figures describe the behavior of the simulation generator, not the diagnostic performance of the fractal method.
- The PS_v4 coefficient `0.8` on `|ΔFD_bc|` is a heuristic, uncalibrated weight, and taking the absolute value of ΔFD_bc discards the sign of the fractal change — see the caveat under [Pathogenicity score PS_v4](#pathogenicity-score-ps_v4).
- **Eleven** real negative controls have now been run through the real pipeline: TP53 Y107H (see [Real negative control: TP53 Y107H](#real-negative-control-tp53-y107h)) plus ten more selected by a fixed rule before running them — see [Ten additional real benign controls](#ten-additional-real-benign-controls). 1 of 11 classify Benign or Likely Benign (TP53 N235S); the other 10 land in VUS. The simulated breast-cancer module remains the only source of "benign" labels at panel scale beyond these eleven.
- Twenty-two oncology-panel variants have now been executed fully end-to-end with real data, twenty-one of them with a pathogenic or benign label and scored (TP53 R175H pathogenic, TP53 Y107H benign, EGFR L858R pathogenic/oncogenic, BRCA1 M1775R pathogenic, FGFR3 K650E pathogenic, CTNNB1 S45F pathogenic/oncogenic, BRAF V600E pathogenic/oncogenic, KRAS G12D pathogenic/oncogenic, IDH1 R132H pathogenic/oncogenic, PTEN R130Q pathogenic, CDKN2A R24P pathogenic, SMAD4 R361H pathogenic, RB1 R661W low-penetrance pathogenic, VHL L158P pathogenic, IDH2 R172K pathogenic/oncogenic, NRAS Q61K pathogenic/oncogenic, ALK F1174L pathogenic/oncogenic, HRAS G12V pathogenic/oncogenic, ERBB2 V777L pathogenic/oncogenic, MET M1250T (M1268T in the literature) pathogenic/oncogenic, PIK3CA H1047R pathogenic/oncogenic; BCR-ABL T315I, an acquired imatinib-resistance mutation with no pathogenic or benign label, was also run but is not scored — all domain-restricted except CTNNB1, KRAS, IDH1, CDKN2A, VHL, IDH2, NRAS, HRAS, and PIK3CA, which were run full-length since one cannot be restricted, six gave no sign of large disordered-flank inflation, IDH2 did (a 17.59 Å global RMSD that falls to 0.886 Å once its 39-residue mitochondrial transit peptide is excluded), and so did PIK3CA (6.06 Å, falling to 1.72 Å without 44 displaced residues, mainly its C-terminal tail)), and **PS_v4 gets 2 of 21 right in direction** on the original seed (BRCA1 M1775R, BRAF V600E); on a second seed it also gets one of 21 (BRCA1 M1775R), so only BRCA1 M1775R is correct on both and the class changed in 5 of 22 variants — see [Replicate test](#replicate-test-a-second-alphafold2-random-seed-on-all-22-variants) (M1775R at the Pathogenic tier, V600E at the Probably Pathogenic tier): R175H, Y107H, S45F, R132H, R130Q, R24P, R361H, R661W, L158P, R172K, Q61K, F1174L, G12V, V777L, M1250T, and now H1047R all land in VUS regardless of true direction (for distinct underlying reasons), and L858R and K650E — real oncogenic/activating drivers — are classified **Benign**, and G12D **Likely Benign** (the opposite clinical extreme). The failures cluster into three distinct mechanisms: PS_v4 misreads an AlphaFold2 confidence artifact as stabilizing (L858R), PS_v4 has no signal at all for gain-of-function activating/neomorphic mutations that don't destabilize the fold (K650E; most cleanly KRAS G12D — RMSD 0.2015 Å, the lowest of any real case, yet the single most common cancer driver mutation there is; and IDH1 R132H — RMSD 0.5133 Å, the second-lowest, a neomorphic active-site chemistry change that lands in VUS rather than Benign only because its near-zero ΔΔG sits on the other side of zero; PTEN R130Q, a catalytic-arginine loss with flat local signals, is a fourth case of the same family, with a larger global RMSD of 2.090 Å that the score has no term to read; CDKN2A R24P similarly lands in VUS with flat local signals and an RMSD of 6.244 Å that cannot be attributed to the mutation from one WT/MUT pair; SMAD4 R361H lands in VUS with a very stable 0.364 Å RMSD and no local signal, consistent with a mutation acting on the MH2 protein–protein interface that a single-chain monomer model cannot represent; RB1 R661W, a low-penetrance partial-loss-of-function allele chosen as the best remaining candidate for a real destabilizing signal, also lands in VUS with no local signal at the mutated residue; VHL L158P, in the BC-box motif that binds Elongin C, lands in VUS with unchanged confidence at the residue, again consistent with an effect on a complex rather than on the monomer; IDH2 R172K, the paralog of IDH1 R132H, also lands in VUS but at −0.4897, just 0.010 above the Probably Benign boundary, so two equivalent neomorphic variants differ by 0.38 PS_v4 units on a difference of about one pLDDT point; NRAS Q61K, the family counterpart of KRAS G12D, returns the opposite sign (+1.0788, 0.12 below Probably Pathogenic) on a −5.0 pLDDT change at a flexible switch-II residue; ALK F1174L, a fourth activating kinase mutation, lands in VUS (−0.0609) with near-null local signals in a very stable 0.265 Å window, so the four activating-kinase cases L858R, K650E, V600E, and F1174L return three different classes (two Benign, one Probably Pathogenic, one VUS); HRAS G12V, at the same residue as KRAS G12D, returns the opposite sign (+1.04, 0.16 below Probably Pathogenic) on a −4.76 pLDDT change, so across the three RAS cases PS_v4 spans −0.54 to +1.08; ERBB2 V777L, a fifth activating kinase mutation, also lands in VUS (+0.0196) with near-null local signals, and its 3.68 Å global RMSD comes from a single short segment displaced 15–20 Å, probably the activation loop; MET M1250T (M1268T in the literature), a sixth activating kinase mutation, also lands in VUS (−0.4128), and its 2.56 Å global RMSD comes from the last 8 residues of its window, 0.85 Å without them; BCR-ABL T315I, not scored, gives the most stable window in the series, 0.0815 Å, and PS_v4 = −0.2889, VUS; PIK3CA H1047R, run full-length, lands in VUS at +1.1482, only 0.052 below the Probably Pathogenic threshold and the closest of any case to that threshold, with a 6.06 Å global RMSD driven mainly by its C-terminal tail and a region-averaged ΔSASA window that includes part of that tail) — it only scores thermodynamic destabilization by design — and PS_v4 has no reliable structural signal to work with when the mutated residue is genuinely disordered before and after the mutation, landing in VUS by weak-signal default rather than genuine discrimination (S45F). The two correct calls (M1775R, V600E) share a common pattern: a real ΔpLDDT drop at the mutated residue combined with a real ΔSASA shift in the destabilizing/perturbing direction. See [Real end-to-end result: TP53 R175H](#real-end-to-end-result-tp53-r175h), [Real negative control: TP53 Y107H](#real-negative-control-tp53-y107h), [Real result: EGFR L858R](#real-result-egfr-l858r--a-pathogenic-driver-misclassified-as-benign), [Real result: BRCA1 M1775R](#real-result-brca1-m1775r--domain-window-validated-and-the-first-correct-real-classification), [Real result: FGFR3 K650E](#real-result-fgfr3-k650e--a-real-curated-hotspot-numbering-bug-and-an-activating-mutation-misread-as-stabilizing), [Real result: CTNNB1 S45F](#real-result-ctnnb1-s45f--full-length-run-confirms-the-disordered-region-problem-on-the-one-case-that-cant-be-domain-restricted), [Real result: BRAF V600E](#real-result-braf-v600e--domain-window-validated-and-the-second-correct-real-classification), [Real result: KRAS G12D](#real-result-kras-g12d--the-most-common-cancer-driver-mutation-in-existence-misclassified-as-benign), [Real result: IDH1 R132H](#real-result-idh1-r132h--a-metabolic-gain-of-function-mutation-and-a-third-case-where-the-score-simply-doesnt-discriminate), [Real result: PTEN R130Q](#real-result-pten-r130q--a-catalytic-residue-mutation-with-a-large-global-rmsd-but-no-local-signal), [Real result: CDKN2A R24P](#real-result-cdkn2a-r24p--the-largest-global-rmsd-yet-and-still-no-usable-local-signal), [Real result: SMAD4 R361H](#real-result-smad4-r361h--a-highly-stable-mh2-window-and-no-signal-at-the-mutated-residue), [Real result: RB1 R661W](#real-result-rb1-r661w--the-case-chosen-to-look-for-a-third-correct-call-and-no-local-signal), [Real result: VHL L158P](#real-result-vhl-l158p--a-bc-box-mutation-with-no-change-in-confidence-at-the-residue), [Real result: IDH2 R172K](#real-result-idh2-r172k--the-paralog-of-idh1-r132h-and-a-disordered-flank-rmsd-artefact), [Real result: NRAS Q61K](#real-result-nras-q61k--the-family-counterpart-of-kras-g12d-with-the-opposite-sign), [Real result: ALK F1174L](#real-result-alk-f1174l--a-very-stable-kinase-window-and-near-null-local-signals), [Real result: HRAS G12V](#real-result-hras-g12v--the-same-residue-as-kras-g12d-with-the-opposite-sign), [Real result: ERBB2 V777L](#real-result-erbb2-v777l--a-validated-n-lobe-and-a-global-rmsd-driven-by-a-single-flexible-segment), [Real result: MET M1250T](#real-result-met-m1250t--a-second-curated-numbering-bug-and-a-window-tail-that-inflates-the-rmsd), [Real result: BCR-ABL T315I](#real-result-bcr-abl-t315i--a-resistance-mutation-with-no-pathogenic-label-and-the-most-stable-window-in-the-series), and [Real result: PIK3CA H1047R](#real-result-pik3ca-h1047r--the-last-panel-variant-just-under-the-probably-pathogenic-threshold). Validating the FGFR3 window also caught a real curated-data bug: the documented hotspot "K652E" doesn't exist on the real UniProt sequence (position 652 is a threonine); the real mutation is K650E, now corrected in the panel. Running MET caught a second one: all four documented MET hotspots were in literature numbering, offset +18 from the canonical UniProt sequence, and are now corrected in the embedded notebook (Y1235D, M1250T, D1228N, Y1230H). The BRCA1, FGFR3, BRAF, PTEN, SMAD4, RB1, ALK, and ABL1 domain windows are all empirically validated (real RMSD = 0.323 Å, 1.537 Å, 2.338 Å, 2.090 Å, 0.364 Å, 1.508 Å, 0.265 Å, and 0.0815 Å respectively); CTNNB1 cannot be restricted because its hotspots sit inside an intrinsically disordered region — now confirmed both by real AlphaFold DB pLDDT data and by a real full-length ColabFold run (RMSD = 3.08 Å, pLDDT ~26–29 at the hotspot on both WT and MUT); KRAS, IDH1, and CDKN2A were all run full-length by design, since all three are small single-domain proteins and need no restriction — see [Domain-restricted folding for multi-domain proteins](#domain-restricted-folding-for-multi-domain-proteins).
- A real ablation test on the first 7 real cases shows the `0.8·|ΔFD_bc|` term changes 0/7 classifications when removed or used with its sign instead of `Math.abs()`; repeated on 17 of the 22 real oncology-panel variants (those with a retained local `ΔFD_bc`), it changes 2/17 (PTEN R130Q, IDH2 R172K, both VUS → Probably Benign) and no correct call, with a maximum contribution of 0.118 PS_v4 units; the local FD_bc estimate's own OLS fit is degenerate (R²=0) at the mutated residue in 5/6 experimental pairs — see [Ablation test and local FD_bc reliability](#ablation-test-and-local-fd_bc-reliability). No ablation or reliability check has been run on the simulated 40-pair panel, since it doesn't use real FD_bc to begin with.
- Restricted to single-chain monomers with point mutations. No protein–protein complexes.
- PS_v4 is a computational score — not for clinical diagnosis.
- FractEngine Local v5 requires real PDB structures (WT + MUT). Default radius (10 Å) follows the director's suggestion but has not been empirically calibrated across the reference pairs yet.
- ΔFD_local is currently a standalone metric, not integrated into PS_v4.

---

## References

- Jumper et al. (2021). AlphaFold. *Nature* 596, 583–589.
- Mirdita et al. (2022). ColabFold. *Nature Methods* 19, 679–682.
- Shrake & Rupley (1973). SASA. *J. Mol. Biol.* 79, 351–371.
- Enright & Leitner (2005). Fractal dimension & thermodynamic stability. *Phys. Rev. E* 71, 011912.
- Orozco Bezrukov (2016). Fractal dimension of protein surfaces. Undergraduate thesis, Universidad del Valle.
- Pak et al. (2023). AlphaFold & mutation stability. *PLoS ONE* 18, e0282689.

---

*Undergraduate thesis — Ingeniería de Sistemas, Universidad del Valle, Cali, 2026.*
