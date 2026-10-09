/* ═══════════════════════════════════════════════════
   ProteinDelta — selector de idioma ES / EN
   ───────────────────────────────────────────────────
   La interfaz se escribe en español (index.html). Este archivo la traduce
   al inglés en el navegador sin tocar la lógica de la app:
     · DICT: texto en español (espacios normalizados) → texto en inglés.
     · PATTERNS: mensajes con valores dinámicos (mutaciones, posiciones…).
     · Un MutationObserver traduce también lo que la app pinta después
       (tablas, alertas, métricas), y alert()/confirm() pasan por el mismo
       diccionario. Al volver a ES se restaura el texto original exacto.
   Para traducir un texto nuevo basta con añadir el par [es, en] a DICT.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

const STORE_KEY = 'pd_lang';

const DICT = new Map([
["// Bioinformática Estructural · Oncología de Precisión · Análisis Fractal", "// Structural Bioinformatics · Precision Oncology · Fractal Analysis"],
["AlphaFold2 · Rolling Ball SASA · Dimensión Fractal · Visualización 3D Molecular · Proteínas Oncológicas", "AlphaFold2 · Rolling Ball SASA · Fractal Dimension · 3D Molecular Visualization · Oncology Proteins"],
["Proyecto de Grado — Univalle EISC", "Undergraduate Thesis Project — Univalle EISC"],
["Dir. Pedro A. Moreno Tovar, PhD", "Advisor: Pedro A. Moreno Tovar, PhD"],
["🧬 Proteínas Oncológicas", "🧬 Oncology Proteins"],
["⚗️ Análisis WT vs MUT", "⚗️ WT vs MUT Analysis"],
["🔬 Visor 3D Molecular", "🔬 3D Molecular Viewer"],
["📂 Importar ColabFold", "📂 Import ColabFold"],
["🔢 Dimensión Fractal", "🔢 Fractal Dimension"],
["📓 Notebook Colab", "📓 Colab Notebook"],
["🧪 Validación", "🧪 Validation"],
["🎀 Validación Mama v5.0", "🎀 Breast Validation v5.0"],
["📖 Manual de Usuario", "📖 User Manual"],
["Manual de usuario", "User manual"],
["Guía paso a paso de cada módulo de ProteinDelta. El manual se muestra en el idioma seleccionado (ES / EN); también puedes abrirlo en una pestaña nueva o descargar cualquiera de las dos versiones.", "Step-by-step guide to every ProteinDelta module. The manual is shown in the selected language (ES / EN); you can also open it in a new tab or download either version."],
["↗ Abrir en pestaña nueva", "↗ Open in new tab"],
["⬇ Descargar (Español)", "⬇ Download (Spanish)"],
["⬇ Descargar (English)", "⬇ Download (English)"],
["Panel de proteínas asociadas al cáncer", "Cancer-associated protein panel"],
["Selecciona una proteína oncológica de referencia. Las métricas de", "Select a reference oncology protein. The"],
["dimensión fractal (FD_bc y FD_mr)", "fractal dimension metrics (FD_bc and FD_mr)"],
["calculadas en v4 caracterizan la complejidad geométrica de la superficie molecular, complementando el análisis de SASA y ΔΔG.", "computed in v4 characterize the geometric complexity of the molecular surface, complementing the SASA and ΔΔG analysis."],
["⚗️ Cargar en Análisis", "⚗️ Load into Analysis"],
["🔬 Ver en 3D", "🔬 View in 3D"],
["Mutaciones canónicas", "Canonical mutations"],
["Contexto oncológico", "Oncological context"],
["Referencias clave", "Key references"],
["Secuencia (fragmento representativo)", "Sequence (representative fragment)"],
["Configuración de secuencias", "Sequence setup"],
["Secuencia WT (Wild-Type)", "WT (Wild-Type) sequence"],
["— se autocompleta al subir PDB en \"Importar ColabFold\"", "— auto-filled when uploading PDB in \"Import ColabFold\""],
["Pega la secuencia de aminoácidos...", "Paste the amino acid sequence..."],
["Nombre / Proteína", "Name / Protein"],
["Modo de mutación", "Mutation mode"],
["Lista de mutaciones puntuales", "Point mutation list"],
["Secuencia MUT completa", "Full MUT sequence"],
["Sin mutación (MUT = WT)", "No mutation (MUT = WT)"],
["Agregar mutación (ej: D10L)", "Add mutation (e.g. D10L)"],
["Pega la secuencia mutada...", "Paste the mutated sequence..."],
["El análisis incluye", "The analysis includes"],
["Dimensión Fractal", "Fractal Dimension"],
["Box-Counting (FD_bc) y Mass-Radius (FD_mr) — global, por ventana de 21 residuos en secuencia, y localmente en el microentorno 3D del residuo mutado (r≤10Å). ΔFD se integra en el score de patogenicidad PS.", "Box-Counting (FD_bc) and Mass-Radius (FD_mr) — global, per 21-residue sequence window, and locally in the 3D microenvironment of the mutated residue (r≤10Å). ΔFD is integrated into the PS pathogenicity score."],
["⚡ Analizar WT vs Mutante", "⚡ Analyze WT vs Mutant"],
["Procesando…", "Processing…"],
["Métricas globales", "Global metrics"],
["CLASIFICACIÓN PATOGÉNICA:", "PATHOGENICITY CLASSIFICATION:"],
["ΔΔG Estabilidad", "ΔΔG Stability"],
["Fitness Evolutivo", "Evolutionary Fitness"],
["Mapa de Calor", "Heat Map"],
["Tabla completa", "Full table"],
["pLDDT por residuo — WT (cian) vs Mutante (rojo) · confianza Evoformer", "Per-residue pLDDT — WT (cyan) vs Mutant (red) · Evoformer confidence"],
["ΔΔG por residuo (kcal/mol)", "Per-residue ΔΔG (kcal/mol)"],
["Score de fitness evolutivo por posición [0–1]", "Evolutionary fitness score per position [0–1]"],
["Mapa de calor — ΔΔG estimado (20 AA × N residuos)", "Heat map — estimated ΔΔG (20 AA × N residues)"],
["Rojo = desestabilizante · Cian = estabilizante · Eje Y: 20 aminoácidos posibles", "Red = destabilizing · Cyan = stabilizing · Y axis: 20 possible amino acids"],
["RMSD Cα por residuo (Å)", "Per-residue Cα RMSD (Å)"],
["ΔSASA por residuo (Ų)", "Per-residue ΔSASA (Ų)"],
["🎯 FD Local Espacial — microentorno del residuo mutado (v5)", "🎯 Spatial Local FD — mutated-residue microenvironment (v5)"],
["Radio (Å)", "Radius (Å)"],
["↻ Recalcular", "↻ Recalculate"],
["Selecciona todos los átomos dentro de una esfera de radio r centrada en el Cα del residuo mutado — sin importar su posición en la secuencia. A diferencia del FD_bc/FD_mr \"local\" de abajo (ventana de 21 residuos", "Selects all atoms within a sphere of radius r centered on the Cα of the mutated residue — regardless of their position in the sequence. Unlike the \"local\" FD_bc/FD_mr below (21-residue window"],
["en la cadena", "along the chain"],
["), esto captura contactos terciarios reales del plegamiento. Requiere PDB real de WT y MUT (sección \"Importar ColabFold\").", "), this captures real tertiary contacts of the fold. Requires real WT and MUT PDBs (\"Import ColabFold\" section)."],
["FD Box-Counting local (FD_bc) por ventana de 21 residuos en secuencia — WT (verde) vs MUT (magenta)", "Local Box-Counting FD (FD_bc) per 21-residue sequence window — WT (green) vs MUT (magenta)"],
["FD Mass-Radius local (FD_mr) por ventana de 21 residuos en secuencia", "Local Mass-Radius FD (FD_mr) per 21-residue sequence window"],
["ΔFD (FD_bc_MUT − FD_bc_WT) por residuo · contribución al score PS v4", "ΔFD (FD_bc_MUT − FD_bc_WT) per residue · contribution to the PS v4 score"],
["Interpretación FD:", "FD interpretation:"],
["FD ∈ [1.0, 3.0] para cadenas proteicas. FD_bc ≈ 1.0–1.4: cadena lineal/desordenada. FD_bc ≈ 1.5–1.8: estructura secundaria regular (hélices, láminas). FD_bc ≈ 2.0–2.6: superficies rugosas / bucles expuestos.", "FD ∈ [1.0, 3.0] for protein chains. FD_bc ≈ 1.0–1.4: linear/disordered chain. FD_bc ≈ 1.5–1.8: regular secondary structure (helices, sheets). FD_bc ≈ 2.0–2.6: rough surfaces / exposed loops."],
["podría indicar aumento de rugosidad superficial local → posible exposición de núcleo hidrofóbico → desestabilizante.", "could indicate increased local surface roughness → possible exposure of the hydrophobic core → destabilizing."],
["podría indicar compactación local → potencialmente estabilizante.", "could indicate local compaction → potentially stabilizing."],
["Esta es una hipótesis interpretativa sobre el signo del cambio, no validada aún — el score PS_v4 usa", "This is an interpretive hypothesis about the sign of the change, not yet validated — the PS_v4 score uses"],
["(magnitud, sin signo) y clasifica ambas direcciones igual. La dirección del cambio se muestra por separado (columna ΔFD, con signo) para quien quiera evaluar esta hipótesis, pero hoy no altera la clasificación de patogenicidad.", "(magnitude, unsigned) and classifies both directions the same. The direction of the change is shown separately (signed ΔFD column) for anyone who wants to evaluate this hypothesis, but today it does not affect the pathogenicity classification."],
["Diagnóstico real: sobre 7 casos (6 pares de referencia + TP53 R175H) eliminar este término, o usar su signo en vez del valor absoluto, no cambió ninguna clasificación. Sobre 17 variantes del panel oncológico con ΔFD_bc conservado, eliminarlo cambió la clase de 2 (PTEN R130Q e IDH2 R172K, de VUS a Prob. Benigna), usar el signo cambió 1, y ninguna llamada correcta cambió; su aporte máximo a un score fue 0.118 unidades de PS_v4 — pequeño, pero no nulo. Ver la ecuación completa, el R² real del ajuste y los 22 resultados reales en la pestaña Validación.", "Real diagnostic: on 7 cases (6 reference pairs + TP53 R175H), removing this term, or using its sign instead of the absolute value, did not change any classification. On 17 oncology-panel variants with retained ΔFD_bc, removing it changed the class of 2 (PTEN R130Q and IDH2 R172K, from VUS to Likely Benign), using the sign changed 1, and no correct call changed; its maximum contribution to a score was 0.118 PS_v4 units — small, but not zero. See the full equation, the real R² of the fit and the 22 real results in the Validation tab."],
["Referencia:", "Reference:"],
["Índice (#)", "Index (#)"],
["Posición del residuo en la secuencia proteica analizada.", "Position of the residue in the analyzed protein sequence."],
["Aminoácido (AA)", "Amino acid (AA)"],
["Código de una letra del aminoácido en esa posición (ej. R = Arg, G = Gly, P = Pro).", "One-letter code of the amino acid at that position (e.g. R = Arg, G = Gly, P = Pro)."],
["Confianza de AlphaFold2 en la estructura del tipo salvaje. >70: alta · 50–70: media · <50: región probablemente desordenada.", "AlphaFold2 confidence in the wild-type structure. >70: high · 50–70: medium · <50: likely disordered region."],
["Confianza estructural del mutante en este residuo. Una caída respecto al WT indica inestabilidad o desorden local inducido por la mutación.", "Structural confidence of the mutant at this residue. A drop relative to WT indicates local instability or disorder induced by the mutation."],
["Cambio en confianza estructural. Negativo = pérdida de confianza · Positivo = ganancia. Valores extremos (<−10 o >10) son funcionalmente relevantes.", "Change in structural confidence. Negative = loss of confidence · Positive = gain. Extreme values (<−10 or >10) are functionally relevant."],
["Cambio en energía libre de Gibbs. Positivo = desestabilizante (rojo) · Negativo = estabilizante (verde). |ΔΔG| > 0.5 kcal/mol indica impacto relevante.", "Change in Gibbs free energy. Positive = destabilizing (red) · Negative = stabilizing (green). |ΔΔG| > 0.5 kcal/mol indicates relevant impact."],
["Aptitud evolutiva estimada para este residuo (0–1). Valores bajos indican que la mutación es perjudicial según la conservación en secuencias homólogas.", "Estimated evolutionary fitness for this residue (0–1). Low values indicate the mutation is deleterious according to conservation in homologous sequences."],
["Dimensión fractal local del tipo salvaje en ventana de 21 residuos. Cuantifica la complejidad geométrica de la cadena nativa.", "Local fractal dimension of the wild type in a 21-residue window. Quantifies the geometric complexity of the native chain."],
["Dimensión fractal local del mutante en ventana de 21 residuos. Compárese con FD_bc WT para detectar cambios de complejidad estructural.", "Local fractal dimension of the mutant in a 21-residue window. Compare with FD_bc WT to detect changes in structural complexity."],
["Cambio en dimensión fractal local. |ΔFD| > 0.08: alto impacto · 0.03–0.08: moderado · < 0.03: leve. Contribuye al score PS_v4.", "Change in local fractal dimension. |ΔFD| > 0.08: high impact · 0.03–0.08: moderate · < 0.03: mild. Contributes to the PS_v4 score."],
["Desviación cuadrática media entre WT y MUT en este residuo. > 0.5 Å indica cambio conformacional relevante; > 1.5 Å es significativo.", "Root-mean-square deviation between WT and MUT at this residue. > 0.5 Å indicates a relevant conformational change; > 1.5 Å is significant."],
["Cambio en superficie accesible al solvente. Positivo = mayor exposición (rojo) · Negativo = mayor enterramiento (verde). Indica cambios en la solvatación del residuo.", "Change in solvent-accessible surface area. Positive = greater exposure (red) · Negative = greater burial (green). Indicates changes in residue solvation."],
["Patogenicidad v4", "Pathogenicity v4"],
["Clasificación PS_v4", "PS_v4 classification"],
["Score integrado: PS = 1.5·ΔΔG − 0.5·fitness + 0.02·|ΔpLDDT| + 0.8·|ΔFD|. Clasifica en: Benigno · Prob. Benigno · Incierto · Prob. Patogénico · Patogénico.", "Integrated score: PS = 1.5·ΔΔG − 0.5·fitness + 0.02·|ΔpLDDT| + 0.8·|ΔFD|. Classifies as: Benign · Likely Benign · Uncertain · Likely Pathogenic · Pathogenic."],
["Exportar resultados v4", "Export v4 results"],
["Visor 3D Molecular", "3D Molecular Viewer"],
["Cargar PDB desde RCSB (código PDB)", "Load PDB from RCSB (PDB code)"],
["ej: 2OCJ, 4OBE, 1JM7", "e.g. 2OCJ, 4OBE, 1JM7"],
["Cargar WT", "Load WT"],
["Cargar MUT", "Load MUT"],
["O cargar archivo PDB local", "Or load a local PDB file"],
["📂 PDB Wild-Type — click o arrastra", "📂 Wild-Type PDB — click or drag"],
["📂 PDB Mutante — click o arrastra", "📂 Mutant PDB — click or drag"],
["Carga rápida — proteínas oncológicas", "Quick load — oncology proteins"],
["Estilo de representación", "Representation style"],
["Esquema de color", "Color scheme"],
["Cadena", "Chain"],
["Estructura 2°", "2° Structure"],
["Residuo", "Residue"],
["⊕ Centrar", "⊕ Center"],
["⟳ Rotar", "⟳ Rotate"],
["🎯 Resaltar microentorno (v5)", "🎯 Highlight microenvironment (v5)"],
["Se autocompleta solo al detectar la mutación en \"Importar ColabFold\". Si lo llenas a mano:", "Auto-filled only when the mutation is detected in \"Import ColabFold\". If you fill it in manually:"],
["= número de posición de la mutación (ej. 6 para E6V, no la letra) ·", "= position number of the mutation (e.g. 6 for E6V, not the letter) ·"],
["cadena", "chain"],
["= la letra de cadena del PDB donde está esa mutación (revisa el archivo o el visor; en proteínas de una sola cadena casi siempre es \"A\") ·", "= the PDB chain letter where that mutation is located (check the file or the viewer; in single-chain proteins it is almost always \"A\") ·"],
["radio", "radius"],
["= qué tan grande es la esfera alrededor del residuo, en Ångström.", "= how large the sphere around the residue is, in Ångström."],
["ej: 6", "e.g. 6"],
["ej: B", "e.g. B"],
["radio Å", "radius Å"],
["🎯 Resaltar", "🎯 Highlight"],
["✕ Quitar", "✕ Clear"],
["Mutante", "Mutant"],
["Importar datos reales de ColabFold", "Import real ColabFold data"],
["Ejecuta", "Run"],
["en Google Colab con GPU Tesla T4. Descarga", "in Google Colab with a Tesla T4 GPU. Download"],
["y carga los archivos aquí. Con los PDB opcionales,", "and upload the files here. With the optional PDBs,"],
["calculará FD_bc sobre puntos de superficie SASA reales → rango [2.0–2.6] en lugar de la estimación sintética de v1.", "will compute FD_bc on real SASA surface points → range [2.0–2.6] instead of the synthetic estimate from v1."],
["📄 JSON pLDDT WT — click o arrastra", "📄 JSON pLDDT WT — click or drag"],
["📄 JSON pLDDT MUT — click o arrastra", "📄 JSON pLDDT MUT — click or drag"],
["RMSD por residuo (rmsd_per_residue.csv)", "Per-residue RMSD (rmsd_per_residue.csv)"],
["📊 CSV RMSD — click o arrastra", "📊 CSV RMSD — click or drag"],
["Delta SASA por residuo (delta_sasa.csv)", "Per-residue Delta SASA (delta_sasa.csv)"],
["📊 CSV SASA — click o arrastra", "📊 CSV SASA — click or drag"],
["PDB Wild-Type —", "Wild-Type PDB —"],
["opcional", "optional"],
["PDB Mutante —", "Mutant PDB —"],
["🔬 Analizar con datos reales", "🔬 Analyze with real data"],
["Análisis de Dimensión Fractal", "Fractal Dimension Analysis"],
["La", "The"],
["dimensión fractal (FD)", "fractal dimension (FD)"],
["de una proteína cuantifica la complejidad geométrica de su superficie y cadena principal. Dos proteínas con la misma longitud pueden tener FD muy distintas según su rugosidad superficial, compacidad del plegamiento y densidad de estructura secundaria. ProteinDelta v4 implementa dos métodos complementarios:", "of a protein quantifies the geometric complexity of its surface and backbone. Two proteins of the same length can have very different FDs depending on their surface roughness, fold compactness and secondary-structure density. ProteinDelta v4 implements two complementary methods:"],
["Divide el espacio 3D en cajas de tamaño ε y cuenta N(ε) cajas ocupadas. FD = −lim log N(ε) / log ε. Captura la rugosidad de superficie.", "Divides 3D space into boxes of size ε and counts N(ε) occupied boxes. FD = −lim log N(ε) / log ε. Captures surface roughness."],
["Para cada radio r desde el centroide, cuenta M(r) = átomos dentro de r. FD = d[log M(r)] / d[log r]. Captura la compacidad del plegamiento.", "For each radius r from the centroid, counts M(r) = atoms within r. FD = d[log M(r)] / d[log r]. Captures fold compactness."],
["WT global · rango típico [1.0, 2.6]", "Global WT · typical range [1.0, 2.6]"],
["Ejecuta un análisis para ver la dimensión fractal.", "Run an analysis to see the fractal dimension."],
["WT global · rango típico [1.5, 2.8]", "Global WT · typical range [1.5, 2.8]"],
["Perfil FD_bc local WT vs MUT (ventana 21 residuos en secuencia)", "Local FD_bc profile WT vs MUT (21-residue sequence window)"],
["Ecuación del Score Patogénico v4 — integración ΔFD", "Pathogenicity Score Equation v4 — ΔFD integration"],
["donde ΔFD_bc(i) = FD_bc_MUT(i) − FD_bc_WT(i) por ventana de 21 residuos en secuencia centrada en i.", "where ΔFD_bc(i) = FD_bc_MUT(i) − FD_bc_WT(i) over a 21-residue sequence window centered on i."],
["Coeficiente 0.8: peso heurístico fijado por criterio del equipo,", "Coefficient 0.8: heuristic weight set by team judgment,"],
["no derivado ni calibrado", "not derived or calibrated"],
["a partir de Enright & Leitner (2005) — ese artículo no reporta una constante equivalente para esta ecuación. Pendiente de calibración empírica contra los pares de referencia con PDB real.", "from Enright & Leitner (2005) — that article does not report an equivalent constant for this equation. Empirical calibration against the reference pairs with real PDB is pending."],
["Ablation test real:", "Real ablation test:"],
["en los primeros 7 casos (6 pares de referencia + TP53 R175H), eliminar el término", "in the first 7 cases (6 reference pairs + TP53 R175H), removing the term"],
["del score, o reemplazar", "from the score, or replacing"],
["por su valor con signo, no cambió la clasificación de ninguno. Repetido sobre las 17 variantes del panel oncológico con ΔFD_bc conservado (de 22 ejecutadas), eliminarlo cambió la clase de 2 (PTEN R130Q e IDH2 R172K, ambas de VUS a Prob. Benigna, porque están justo sobre el límite de −0.5), usar el signo cambió 1, y ninguna llamada correcta cambió; el mayor aporte del término a un score fue 0.118 unidades de PS_v4. Es pequeño, pero no estrictamente nulo. Además, el ajuste OLS de FD_bc local (R²) es degenerado (R²=0.000, muy pocas escalas no saturadas sobreviven) en el residuo mutado de 5 de los 6 pares experimentales; solo en TP53 R175H (predicción real de AlphaFold2, no cristal) el ajuste es confiable (R²=0.97 WT / 0.98 MUT).", "with its signed value, did not change the classification of any of them. Repeated on the 17 oncology-panel variants with retained ΔFD_bc (out of 22 run), removing it changed the class of 2 (PTEN R130Q and IDH2 R172K, both from VUS to Likely Benign, because they sit right on the −0.5 boundary), using the sign changed 1, and no correct call changed; the term's largest contribution to a score was 0.118 PS_v4 units. It is small, but not strictly zero. In addition, the OLS fit of local FD_bc (R²) is degenerate (R²=0.000, very few unsaturated scales survive) at the mutated residue in 5 of the 6 experimental pairs; only in TP53 R175H (real AlphaFold2 prediction, not a crystal) is the fit reliable (R²=0.97 WT / 0.98 MUT)."],
["Este notebook genera los modelos tridimensionales WT y Mutante de cualquier proteína del panel oncológico (o de una secuencia personalizada), y calcula RMSD y SASA por residuo. La secuencia canónica se descarga automáticamente de", "This notebook generates the 3D WT and Mutant models of any protein in the oncology panel (or of a custom sequence), and computes per-residue RMSD and SASA. The canonical sequence is downloaded automatically from"],
["; la estructura WT puede tomarse de", "; the WT structure can be taken from"],
["(ahorra ~50 % del tiempo de cómputo). Solo se necesita configurar la", "(saves ~50% of compute time). You only need to configure"],
["CELDA 1", "CELL 1"],
["— el resto corre con \"Ejecutar todo\".", "— the rest runs with \"Run all\"."],
["⏱ Tiempos estimados (GPU Tesla T4)", "⏱ Estimated times (Tesla T4 GPU)"],
["MSA completo · 5 modelos", "Full MSA · 5 models"],
["WT de AlphaFold DB · solo MUT", "WT from AlphaFold DB · MUT only"],
["Sin MSA · 1 modelo · solo flujo", "No MSA · 1 model · pipeline check only"],
["📓 Notebook incluido", "📓 Notebook included"],
["12 celdas · Python 3.11 (micromamba) · GPU Tesla T4", "12 cells · Python 3.11 (micromamba) · Tesla T4 GPU"],
["22 proteínas oncológicas precuradas con hotspots", "22 pre-curated oncology proteins with hotspots"],
["AlphaFold DB opcional para WT · BioPython RMSD/SASA", "Optional AlphaFold DB for WT · BioPython RMSD/SASA"],
["Validación de secuencia y mutación con mensajes claros", "Sequence and mutation validation with clear messages"],
["⬇ Descargar Notebook (.ipynb)", "⬇ Download Notebook (.ipynb)"],
["🔢 Celdas del notebook", "🔢 Notebook cells"],
["CELDA 0", "CELL 0"],
["→ Verificar GPU (nvidia-smi)", "→ Check GPU (nvidia-smi)"],
["Configurar proteína y mutación ← solo editar aquí", "Configure protein and mutation ← only edit here"],
["CELDA 2", "CELL 2"],
["→ Descargar secuencia UniProt · validar mutación", "→ Download UniProt sequence · validate mutation"],
["CELDA 3", "CELL 3"],
["→ Estructura WT desde AlphaFold DB (opcional)", "→ WT structure from AlphaFold DB (optional)"],
["CELDA 4", "CELL 4"],
["→ Instalar micromamba + Python 3.11 + ColabFold", "→ Install micromamba + Python 3.11 + ColabFold"],
["CELDA 5", "CELL 5"],
["→ Fijar JAX 0.4.28 / Haiku 0.0.12 (compatibilidad)", "→ Pin JAX 0.4.28 / Haiku 0.0.12 (compatibility)"],
["CELDA 6", "CELL 6"],
["→ Directorio de pesos del modelo", "→ Model weights directory"],
["CELDA 7", "CELL 7"],
["→ Predicción ColabFold WT y MUT", "→ ColabFold prediction WT and MUT"],
["CELDA 8", "CELL 8"],
["→ Instalar BioPython", "→ Install BioPython"],
["CELDA 9", "CELL 9"],
["→ RMSD (Kabsch) + SASA (Shrake-Rupley) por residuo", "→ Per-residue RMSD (Kabsch) + SASA (Shrake-Rupley)"],
["CELDA 10", "CELL 10"],
["→ Comprimir resultados en all_outputs.zip", "→ Compress results into all_outputs.zip"],
["Instrucciones de uso:", "Instructions:"],
["1. Abre", "1. Open"],
["→ Archivo → Subir notebook → selecciona el .ipynb descargado.", "→ File → Upload notebook → select the downloaded .ipynb."],
["Entorno de ejecución → Cambiar tipo de entorno de ejecución → GPU (T4)", "Runtime → Change runtime type → GPU (T4)"],
["3. En", "3. In"],
[": elige la proteína del menú desplegable, escribe la mutación (ej.", ": choose the protein from the dropdown menu, type the mutation (e.g."],
[") y el perfil (", ") and the profile ("],
["recomendado).", "recommended)."],
["Entorno de ejecución → Ejecutar todo", "Runtime → Run all"],
["— no es necesario tocar ninguna otra celda.", "— there is no need to touch any other cell."],
["5. Al terminar la CELDA 10, descarga", "5. When CELL 10 finishes, download"],
["desde el panel de archivos de Colab (icono de carpeta, a la izquierda).", "from the Colab files panel (folder icon, on the left)."],
["6. Carga el ZIP en la sección", "6. Upload the ZIP in the"],
["de esta plataforma.", "section of this platform."],
["⚠ Sobre el perfil", "⚠ About the profile"],
["prescinde del alineamiento múltiple de secuencias (MSA), que es la principal fuente de información evolutiva de AlphaFold2. Los modelos resultantes tienen pLDDT bajo y no deben usarse para reportar resultados. Úsalo solo para verificar que el flujo funciona antes de lanzar el análisis definitivo con", "skips the multiple sequence alignment (MSA), which is AlphaFold2's main source of evolutionary information. The resulting models have low pLDDT and must not be used to report results. Use it only to check that the pipeline works before launching the definitive analysis with"],
["El score como distribución — 3 a 4 semillas en 8 variantes", "The score as a distribution — 3 to 4 seeds in 8 variants"],
["Las réplicas de arriba comparan solo dos semillas. Para ocho variantes elegidas (los dos aciertos originales; tres que cambiaron de clase con la 2ª semilla; la proteína completa más grande; el caso del artefacto de confianza; y el único control benigno) se corrieron dos semillas más (2 y 3), dando 3–4 corridas independientes por variante en vez de 2. PIK3CA H1047R solo tiene 3: dos reintentos de su 4ª corrida quedaron atascados 40+ minutos en la búsqueda de MSA (una vez tras 4 horas, otra tras 45 minutos) y se abandonaron.", "The replicates above compare only two seeds. For eight chosen variants (the two original correct calls; three that changed class with the 2nd seed; the largest full-length protein; the confidence-artifact case; and the only benign control) two more seeds (2 and 3) were run, giving 3–4 independent runs per variant instead of 2. PIK3CA H1047R has only 3: two retries of its 4th run got stuck for 40+ minutes in the MSA search (once after 4 hours, another after 45 minutes) and were abandoned."],
["Corridas independientes", "Independent runs"],
["Correctas en dirección", "Correct in direction"],
["Variante correcta en las 4 semillas", "Variant correct in all 4 seeds"],
["Variante", "Variant"],
["PS_v4 por semilla (0→1→2→3)", "PS_v4 per seed (0→1→2→3)"],
["Media", "Mean"],
["Rango", "Range"],
["Correctas", "Correct"],
["Qué muestra esto.", "What this shows."],
["Solo", "Only"],
["acierta en las 4 semillas (DE 0.11, la más estable): una señal desestabilizante real y reproducible.", "is correct in all 4 seeds (SD 0.11, the most stable): a real, reproducible destabilizing signal."],
["acierta 1 de 4 — la primera corrida (semilla por defecto) dio Prob. Patogénica, las otras tres VUS o Prob. Benigna, así que una sola corrida de esta variante es casi una moneda al aire. El control benigno", "is correct in 1 of 4 — the first run (default seed) gave Likely Pathogenic, the other three VUS or Likely Benign, so a single run of this variant is almost a coin toss. The benign control"],
["es el más estable después de BRCA1 (DE 0.01) y falla en las 4 — el score está seguro y consistentemente equivocado ahí, no solo ruidoso.", "is the most stable after BRCA1 (SD 0.01) and fails in all 4 — the score is confidently and consistently wrong there, not just noisy."],
["(siempre Benigna) falla del mismo modo estable. PTEN R130Q, IDH2 R172K, PIK3CA H1047R y KRAS G12D oscilan entre VUS y Prob. Benigna entre semillas (las cuatro son patogénicas, así que ninguna clase es correcta), con rangos de 0.13–2.55 unidades de PS_v4: estas variantes están en una región genuinamente inestable del score, no cerca de un valor fijo que solo cruza un umbral por poco. Es una extensión pequeña (n=3–4, 8 de las 33 variantes y controles reales) que no estima la varianza real del score, pero muestra que una clasificación de una sola semilla — el formato de todos los demás resultados de este proyecto — no suele representar lo que daría una segunda o tercera corrida: en 7 de estas 8 variantes, al menos una semilla da una clase distinta a otra.", "(always Benign) fails in the same stable way. PTEN R130Q, IDH2 R172K, PIK3CA H1047R and KRAS G12D oscillate between VUS and Likely Benign across seeds (all four are pathogenic, so neither class is correct), with ranges of 0.13–2.55 PS_v4 units: these variants sit in a genuinely unstable region of the score, not near a fixed value that just barely crosses a threshold. It is a small extension (n=3–4, 8 of the 33 real variants and controls) that does not estimate the real variance of the score, but it shows that a single-seed classification — the format of every other result in this project — usually does not represent what a second or third run would give: in 7 of these 8 variants, at least one seed gives a different class from another."],
["Controles benignos reales — 11 variantes (TP53 Y107H + 10 más)", "Real benign controls — 11 variants (TP53 Y107H + 10 more)"],
["TP53 Y107H (pestaña de resultados reales, arriba) es un solo control benigno: no alcanza para hablar de especificidad. Estas diez variantes más se eligieron", "TP53 Y107H (real results tab, above) is a single benign control: not enough to talk about specificity. These ten additional variants were chosen"],
["antes de correr ninguna", "before running any of them"],
[", con una regla fija: ClinVar «Benigna», variante missense, revisión «reviewed by expert panel» o «criteria provided, multiple submitters, no conflicts», dentro de la ventana o el largo completo ya establecido para ese gen en el panel, tomando el número de acceso ClinVar más bajo entre las candidatas elegibles. Se corrieron con el mismo pipeline real y la semilla por defecto.", ", with a fixed rule: ClinVar «Benign», missense variant, review status «reviewed by expert panel» or «criteria provided, multiple submitters, no conflicts», within the window or full length already established for that gene in the panel, taking the lowest ClinVar accession number among the eligible candidates. They were run with the same real pipeline and the default seed."],
["Controles benignos reales", "Real benign controls"],
["Clasificados Benigna / Prob. Benigna", "Classified Benign / Likely Benign"],
["ΔpLDDT en el residuo", "ΔpLDDT at the residue"],
["Clase", "Class"],
["Llamada", "Call"],
["Prob. Benigna", "Likely Benign"],
["correcta", "correct"],
["Solo TP53 N235S clasifica correctamente (Prob. Benigna); las otras nueve caen en VUS. Junto con TP53 Y107H, el score acierta en", "Only TP53 N235S classifies correctly (Likely Benign); the other nine fall into VUS. Together with TP53 Y107H, the score is correct in"],
["1 de 11", "1 of 11"],
["controles benignos reales — una especificidad del mismo orden que la sensibilidad ya encontrada en el panel patogénico (2 de 21). PS_v4 no falla solo con variantes patogénicas: en esta muestra pequeña y elegida por una regla fija de variantes benignas confirmadas, también devuelve VUS casi siempre. VHL P25L (PS_v4 = +0.0155) cae dentro de la región desordenada N-terminal de VHL (pLDDT real 49–50 en el residuo, frente al ~90 del dominio plegado): un VUS sin señal ahí es lo esperable, no un fallo nuevo. PIK3CA I391M (PS_v4 = +0.060) tiene el mismo tipo de inflación de RMSD por la cola C-terminal que H1047R (5.97 Å en una corrida completa de 1068 residuos), así que su RMSD no debe leerse como efecto de la mutación. Es un conjunto pequeño y elegido por una regla, no por el resultado: no estima la especificidad en general, pero muestra que el 1 de 11 no es un artefacto de que Y107H fuera un solo caso inusual.", "real benign controls — a specificity of the same order as the sensitivity already found in the pathogenic panel (2 of 21). PS_v4 does not fail only with pathogenic variants: in this small sample, chosen by a fixed rule from confirmed benign variants, it also returns VUS almost always. VHL P25L (PS_v4 = +0.0155) falls within the disordered N-terminal region of VHL (real pLDDT 49–50 at the residue, versus ~90 for the folded domain): a VUS with no signal there is expected, not a new failure. PIK3CA I391M (PS_v4 = +0.060) has the same kind of RMSD inflation from the C-terminal tail as H1047R (5.97 Å in a full-length run of 1068 residues), so its RMSD must not be read as an effect of the mutation. It is a small set chosen by a rule, not by the outcome: it does not estimate specificity in general, but it shows that the 1 of 11 is not an artifact of Y107H being a single unusual case."],
["Resultados REALES del pipeline — 22 variantes del panel oncológico", "REAL pipeline results — 22 oncology-panel variants"],
["Estos valores", "These values"],
["no son simulados", "are not simulated"],
[": cada variante se ejecutó de punta a punta con ColabFold/AlphaFold2 real, RMSD (Kabsch) y SASA (Shrake-Rupley) de BioPython, ΔFD_bc local de FractEngine v2 y", ": each variant was run end to end with real ColabFold/AlphaFold2, BioPython RMSD (Kabsch) and SASA (Shrake-Rupley), FractEngine v2 local ΔFD_bc and"],
[". El panel de 40 pares de más abajo", ". The 40-pair panel further below"],
["sigue siendo simulado", "is still simulated"],
["y no debe compararse con esta tabla.", "and must not be compared with this table."],
["Variantes ejecutadas (21 genes)", "Variants run (21 genes)"],
["Con etiqueta y puntuadas", "Labeled and scored"],
["Correctas en dirección (semilla 0; 1/21 con la 2ª, solo 1 en común)", "Correct in direction (seed 0; 1/21 with the 2nd, only 1 in common)"],
["En VUS (incl. el único control benigno)", "In VUS (incl. the only benign control)"],
["Drivers como Benigna / Prob. Benigna", "Drivers as Benign / Likely Benign"],
["Región analizada (UniProt)", "Analyzed region (UniProt)"],
["Significado incierto", "Uncertain significance"],
["sin discriminar", "not discriminated"],
["Benigna", "Benign"],
["dirección errada", "wrong direction"],
["Patogénica", "Pathogenic"],
["completa", "full"],
["Prob. Patogénica", "Likely Pathogenic"],
["sin puntuar", "not scored"],
["† RMSD global dominado por un segmento corto desordenado o flexible: IDH2, 0.886 Å sin el péptido de tránsito mitocondrial de 39 residuos; PIK3CA, 1.724 Å sin 44 residuos desplazados (sobre todo la cola C-terminal); MET, 0.847 Å sin los últimos 8 residuos de la ventana; ERBB2, 0.948 Å en el lóbulo N. ‡ Sin atribuir a ningún segmento. n/r: no registrado en la corrida original. BCR-ABL T315I es una mutación de resistencia adquirida sin etiqueta patogénica ni benigna: se ejecutó pero no se puntúa. Una llamada es «correcta» solo si una variante patogénica queda como Patogénica o Prob. Patogénica (o una benigna como Benigna o Prob. Benigna); VUS nunca cuenta.", "† Global RMSD dominated by a short disordered or flexible segment: IDH2, 0.886 Å without the 39-residue mitochondrial transit peptide; PIK3CA, 1.724 Å without 44 displaced residues (mostly the C-terminal tail); MET, 0.847 Å without the last 8 residues of the window; ERBB2, 0.948 Å in the N-lobe. ‡ Not attributed to any segment. n/r: not recorded in the original run. BCR-ABL T315I is an acquired resistance mutation with no pathogenic or benign label: it was run but is not scored. A call is «correct» only if a pathogenic variant ends up as Pathogenic or Likely Pathogenic (or a benign one as Benign or Likely Benign); VUS never counts."],
["Réplicas con una segunda semilla de AlphaFold2 (las 22 variantes).", "Replicates with a second AlphaFold2 seed (all 22 variants)."],
["Cada resultado de arriba es", "Each result above is"],
["una", "a single"],
["predicción con la semilla por defecto (0). Las 22 variantes se repitieron con", "prediction with the default seed (0). The 22 variants were repeated with"],
[". En las ventanas de dominio se predijeron WT y mutante; en KRAS, VHL y CTNNB1 también (sus corridas originales predijeron ambas estructuras); en NRAS, HRAS, CDKN2A, IDH1, IDH2 y PIK3CA el WT sigue siendo el de AlphaFold DB, así que solo se remuestreó el mutante.", ". In the domain windows both WT and mutant were predicted; in KRAS, VHL and CTNNB1 too (their original runs predicted both structures); in NRAS, HRAS, CDKN2A, IDH1, IDH2 and PIK3CA the WT is still the AlphaFold DB one, so only the mutant was resampled."],
["ΔpLDDT (sem. 0 → sem. 1)", "ΔpLDDT (seed 0 → seed 1)"],
["Benigna → Benigna", "Benign → Benign"],
["Patogénica → Patogénica", "Pathogenic → Pathogenic"],
["Prob. Patogénica → VUS ⚠ cambia de clase", "Likely Pathogenic → VUS ⚠ changes class"],
["Prob. Benigna → VUS ⚠ cambia de clase", "Likely Benign → VUS ⚠ changes class"],
["VUS → Prob. Benigna ⚠ cambia de clase", "VUS → Likely Benign ⚠ changes class"],
["La clase cambió en", "The class changed in"],
["5 de 22", "5 of 22"],
["variantes (BRAF V600E, KRAS G12D, PTEN R130Q, IDH2 R172K, PIK3CA H1047R). La diferencia de PS_v4 entre semillas tuvo mediana 0.11, media 0.41 y máximo 2.52 (PIK3CA H1047R); superó 0.5 en 4 variantes y 1.0 en 3. De las 7 variantes cuyo score de la semilla 0 estaba a menos de 0.12 de un umbral, 5 cambiaron de clase. Los aciertos no son estables: en la semilla 0 fueron BRCA1 M1775R y BRAF V600E; en la semilla 1 solo acierta BRCA1 M1775R. Solo", "variants (BRAF V600E, KRAS G12D, PTEN R130Q, IDH2 R172K, PIK3CA H1047R). The PS_v4 difference between seeds had a median of 0.11, mean of 0.41 and maximum of 2.52 (PIK3CA H1047R); it exceeded 0.5 in 4 variants and 1.0 in 3. Of the 7 variants whose seed-0 score was less than 0.12 from a threshold, 5 changed class. The correct calls are not stable: in seed 0 they were BRCA1 M1775R and BRAF V600E; in seed 1 only BRCA1 M1775R is correct. Only"],
["acierta en ambas. Los fallos sistemáticos sí se reproducen: EGFR L858R y FGFR3 K650E son Benignas en ambas semillas, y el control benigno TP53 Y107H es VUS en ambas. Los RMSD globales cambian más que el score (BRAF 2.338 → 0.701 Å; KRAS G12D 0.2015 → 0.902 Å), así que no deben interpretarse como efectos de la mutación. Son dos muestras por variante: muestran que la variabilidad es grande y dónde se concentra, no estiman su distribución.", "is correct in both. The systematic failures do reproduce: EGFR L858R and FGFR3 K650E are Benign in both seeds, and the benign control TP53 Y107H is VUS in both. Global RMSDs change more than the score (BRAF 2.338 → 0.701 Å; KRAS G12D 0.2015 → 0.902 Å), so they must not be interpreted as effects of the mutation. These are two samples per variant: they show that the variability is large and where it concentrates; they do not estimate its distribution."],
["Qué muestran estos resultados.", "What these results show."],
["Los fallos son sistemáticos, no aleatorios: (1) mutaciones activadoras, catalíticas o neomórficas que no alteran el pliegue (KRAS G12D, IDH1 R132H, PTEN R130Q, FGFR3 K650E, ALK F1174L, ERBB2 V777L, MET M1250T) no dejan firma en pLDDT ni SASA; (2) un artefacto de confianza de AlphaFold2 (EGFR L858R, ΔpLDDT +30.25) se lee como estabilización y da el PS_v4 más negativo de la serie (−6.889); (3) efectos que probablemente actúan por interacciones que un monómero no representa (SMAD4 R361H, VHL L158P, PIK3CA H1047R; consistente con las señales planas, no probado); (4) fragilidad cerca de un límite de clase (IDH1 e IDH2 difieren 0.38 unidades por ~1.3 unidades de pLDDT; NRAS, HRAS y PIK3CA quedan 0.05–0.16 por debajo de Prob. Patogénica); (5) segmentos desordenados que inflan el RMSD global; (6) etiquetas que no son binarias (RB1 R661W, BCR-ABL T315I).", "The failures are systematic, not random: (1) activating, catalytic or neomorphic mutations that do not alter the fold (KRAS G12D, IDH1 R132H, PTEN R130Q, FGFR3 K650E, ALK F1174L, ERBB2 V777L, MET M1250T) leave no signature in pLDDT or SASA; (2) an AlphaFold2 confidence artifact (EGFR L858R, ΔpLDDT +30.25) is read as stabilization and gives the most negative PS_v4 of the series (−6.889); (3) effects that probably act through interactions a monomer does not represent (SMAD4 R361H, VHL L158P, PIK3CA H1047R; consistent with the flat signals, not proven); (4) fragility near a class boundary (IDH1 and IDH2 differ by 0.38 units due to ~1.3 pLDDT units; NRAS, HRAS and PIK3CA fall 0.05–0.16 below Likely Pathogenic); (5) disordered segments that inflate the global RMSD; (6) labels that are not binary (RB1 R661W, BCR-ABL T315I)."],
["Límites.", "Limitations."],
["Conjunto elegido a mano, un único control benigno, una predicción WT/MUT por variante (réplica con una 2ª semilla en las 22) y proteínas tratadas como monómeros aislados. Estos números describen este conjunto; no estiman el desempeño del score en general. Con la formulación actual, PS_v4 no es utilizable como evidencia de patogenicidad. Detalle por variante en el README y en el artículo.", "Hand-picked set, a single benign control, one WT/MUT prediction per variant (replicated with a 2nd seed in all 22) and proteins treated as isolated monomers. These numbers describe this set; they do not estimate the performance of the score in general. With the current formulation, PS_v4 is not usable as evidence of pathogenicity. Per-variant details in the README and in the article."],
["Panel de 40 pares — cobertura real: 39/40", "40-pair panel — real coverage: 39/40"],
["El panel de 40 pares del profesor (ClinVar + COSMIC Tier 1) ya no es solo simulado: 39 de sus 40 pares tienen datos reales de ColabFold/AlphaFold2, RMSD (Kabsch) y SASA (Shrake-Rupley) de BioPython, y", "The professor's 40-pair panel (ClinVar + COSMIC Tier 1) is no longer only simulated: 39 of its 40 pairs have real ColabFold/AlphaFold2 data, BioPython RMSD (Kabsch) and SASA (Shrake-Rupley), and"],
["— 17 provienen del estudio original de 22 variantes, 22 se corrieron en esta sesión para cerrar el panel. Queda 1 par excluido (APC R1450*, mutación de parada: el pipeline solo modela sustituciones puntuales). BRCA1 C61G (proteína completa de 1863 residuos) no terminó en tres intentos con sesión gratuita de Colab, incluso con el WT tomado de AlphaFold DB; se corrió sobre un fragmento curado del dominio RING (residuos 1–300, WT y mutante frescos) — ver nota en la tabla. El panel de 40 simulado más abajo sigue existiendo para la herramienta interactiva de análisis por proteína, pero ya no es la única fuente de estos 39 pares.", "— 17 come from the original 22-variant study, 22 were run in this session to close the panel. 1 pair remains excluded (APC R1450*, a stop mutation: the pipeline only models point substitutions). BRCA1 C61G (full-length protein of 1863 residues) did not finish in three attempts with a free Colab session, even with the WT taken from AlphaFold DB; it was run on a curated fragment of the RING domain (residues 1–300, fresh WT and mutant) — see the note in the table. The simulated 40-pair panel further below still exists for the interactive per-protein analysis tool, but it is no longer the only source for these 39 pairs."],
["Pares con datos reales", "Pairs with real data"],
["Del estudio de 22 originales", "From the original 22-variant study"],
["Corridas en esta sesión", "Run in this session"],
["Par (# panel)", "Pair (# panel)"],
["ΔpLDDT punto", "Point ΔpLDDT"],
["¿Correcta?", "Correct?"],
["Origen", "Source"],
["esta sesión", "this session"],
["Significado incierto (sin puntuar*)", "Uncertain significance (not scored*)"],
["Excluida (mutación de parada, pipeline solo sustituciones)", "Excluded (stop mutation, pipeline only handles substitutions)"],
["excluida", "excluded"],
["Con el panel completo curado por el profesor (no una selección ad hoc), el score sigue fallando sistemáticamente:", "With the full panel curated by the professor (not an ad hoc selection), the score still fails systematically:"],
["solo 4 de 39", "only 4 of 39"],
["pares patogénicos reales quedan como Patogénica o Prob. Patogénica (BRAF V600E, BRCA1 G1738E, BRAF V600K, BRCA1 C61G — 10.3%). FGFR3 S249C tiene un RMSD global inusualmente alto (24.7 Å) que probablemente refleja incertidumbre en el empaquetamiento entre dominios de AlphaFold2 (pTM ≈ 0.45–0.50 en ambas corridas, típico de proteínas multidominio con enlazadores flexibles), no necesariamente el efecto de la mutación puntual — no se le atribuye significado biológico. BRCA1 C61G (‡) se corrió sobre un fragmento curado del dominio RING (residuos 1–300), no la proteína completa: tres intentos de correr los 1863 residuos completos —el último con el WT tomado de AlphaFold DB para predecir solo el mutante— no terminaron dentro de una sesión gratuita de Colab. Su RMSD global (27.7 Å) es probablemente el mismo artefacto de empaquetamiento de dominio aislado que FGFR3 S249C (pLDDT global ~52–56 en ambas corridas, muy por debajo de un dominio bien plegado), pero su caída de pLDDT en el punto mutado (−15.5) es real y grande: C61 es una de las dos cisteínas coordinadoras de zinc del dominio RING, y perderla es el mecanismo patogénico conocido de esta variante — es la única de las cuatro llamadas correctas con una señal local, y no solo global, detrás. BCR-ABL T315I no tiene etiqueta binaria (resistencia adquirida) y no se puntúa. Esta cobertura del panel completo reemplaza a la muestra de 22 variantes como la evidencia principal del proyecto: la conclusión no cambia (PS_v4 no es utilizable como evidencia de patogenicidad con la formulación actual), pero ahora se apoya en el conjunto de referencia que el profesor especificó, no en una selección hecha por el equipo.", "real pathogenic pairs end up as Pathogenic or Likely Pathogenic (BRAF V600E, BRCA1 G1738E, BRAF V600K, BRCA1 C61G — 10.3%). FGFR3 S249C has an unusually high global RMSD (24.7 Å) that probably reflects uncertainty in AlphaFold2's inter-domain packing (pTM ≈ 0.45–0.50 in both runs, typical of multidomain proteins with flexible linkers), not necessarily the effect of the point mutation — no biological meaning is attributed to it. BRCA1 C61G (‡) was run on a curated fragment of the RING domain (residues 1–300), not the full-length protein: three attempts to run all 1863 residues —the last one with the WT taken from AlphaFold DB to predict only the mutant— did not finish within a free Colab session. Its global RMSD (27.7 Å) is probably the same isolated-domain packing artifact as FGFR3 S249C (global pLDDT ~52–56 in both runs, far below a well-folded domain), but its pLDDT drop at the mutated position (−15.5) is real and large: C61 is one of the two zinc-coordinating cysteines of the RING domain, and losing it is the known pathogenic mechanism of this variant — it is the only one of the four correct calls with a local, not only global, signal behind it. BCR-ABL T315I has no binary label (acquired resistance) and is not scored. This full-panel coverage replaces the 22-variant sample as the project's main evidence: the conclusion does not change (PS_v4 is not usable as evidence of pathogenicity with the current formulation), but it now rests on the reference set the professor specified, not on a selection made by the team."],
["Réplica con segunda semilla — 8 pares del panel de 40", "Second-seed replicate — 8 pairs from the 40-pair panel"],
["Ninguno de los 21 pares nuevos del panel de 40 tenía réplica con otra semilla aleatoria. En vez de correr las 39 completas (inviable con GPU gratuita de Colab), se eligieron 8 con una regla fija antes de correrlas: las 3 que clasifican correctas (BRAF V600K, BRCA1 G1738E, BRCA1 C61G), las 3 VUS más cercanas al umbral de Prob. Patogénica por abajo (MET Y1235D, BCR-ABL E255V, KRAS G12R), el caso de RMSD inflado ya documentado (FGFR3 S249C) y la llamada más confiadamente errada (KRAS G12C). Se corrieron con", "None of the 21 new pairs in the 40-pair panel had a replicate with another random seed. Instead of running all 39 (not feasible with Colab's free GPU), 8 were chosen with a fixed rule before running them: the 3 that classify correctly (BRAF V600K, BRCA1 G1738E, BRCA1 C61G), the 3 VUS closest to the Likely Pathogenic threshold from below (MET Y1235D, BCR-ABL E255V, KRAS G12R), the already documented inflated-RMSD case (FGFR3 S249C) and the most confidently wrong call (KRAS G12C). They were run with"],
["en vez del 0 por defecto.", "instead of the default 0."],
["Replicadas (FGFR3 S249C: 3 intentos, perdida por desconexión)", "Replicated (FGFR3 S249C: 3 attempts, lost to disconnection)"],
["Mantienen la misma clase", "Keep the same class"],
["Cambia de clase (BRAF V600K)", "Changes class (BRAF V600K)"],
["PS_v4 semilla 0", "PS_v4 seed 0"],
["Clase semilla 0", "Class seed 0"],
["PS_v4 semilla 1", "PS_v4 seed 1"],
["Clase semilla 1", "Class seed 1"],
["¿Cambió?", "Changed?"],
["Sí", "Yes"],
["no replicada — 3 intentos, cortada por desconexión de Colab cada vez cerca de las 2h", "not replicated — 3 attempts, each cut off by a Colab disconnection near the 2h mark"],
["De las 7 réplicas que sí terminaron,", "Of the 7 replicates that did finish,"],
["1 cambia de clase: BRAF V600K", "1 changes class: BRAF V600K"],
["pasa de Prob. Patogénica (correcta) a Prob. Benigna (dirección equivocada) — el PS_v4 va de +1.329 a −1.201 cruzando dos umbrales, con la misma proteína, la misma mutación y el mismo pipeline, solo cambiando la semilla aleatoria de ColabFold. De las 4 llamadas correctas del panel de 40, esto deja solo 3 confirmadas como estables: BRCA1 G1738E y BRCA1 C61G se reproducen limpio — el ΔpLDDT local de BRCA1 C61G en particular casi no cambia (−15.5 → −14.88), aunque su RMSD global artefactual sí (27.7 Å → 16.9 Å, ambos grandes pero inconsistentes entre sí, como se espera de un artefacto). KRAS G12R (‡) no cambia de clase pero se mueve bastante (−0.099 → +0.810), acercándose al umbral de +1.2 sin cruzarlo. Este patrón de inestabilidad ya estaba documentado en el estudio de 22 variantes (5 de 22 cambian de clase con segunda semilla) y en BRAF V600E en particular (1 de 4 semillas acierta) — ahora se extiende también al panel de 40. No cambia el número principal (4/39 correctas, con la semilla 0 original), pero es razón para leer ese número como un límite superior optimista, no como un resultado firme: al menos una de las cuatro no es un acierto confiable.", "goes from Likely Pathogenic (correct) to Likely Benign (wrong direction) — PS_v4 goes from +1.329 to −1.201, crossing two thresholds, with the same protein, the same mutation and the same pipeline, only changing ColabFold's random seed. Of the 4 correct calls in the 40-pair panel, this leaves only 3 confirmed as stable: BRCA1 G1738E and BRCA1 C61G reproduce cleanly — the local ΔpLDDT of BRCA1 C61G in particular barely changes (−15.5 → −14.88), although its artifactual global RMSD does (27.7 Å → 16.9 Å, both large but inconsistent with each other, as expected from an artifact). KRAS G12R (‡) does not change class but moves considerably (−0.099 → +0.810), approaching the +1.2 threshold without crossing it. This instability pattern was already documented in the 22-variant study (5 of 22 change class with a second seed) and in BRAF V600E in particular (1 of 4 seeds correct) — it now extends to the 40-pair panel as well. It does not change the headline number (4/39 correct, with the original seed 0), but it is a reason to read that number as an optimistic upper bound, not a firm result: at least one of the four is not a reliable correct call."],
["Panel de Validación (datos simulados) — 40 Pares WT/Mutante · ProteinDelta v5.1", "Validation Panel (simulated data) — 40 WT/Mutant Pairs · ProteinDelta v5.1"],
["Panel de 40 pares WT/Mutante de genes oncológicos (ClinVar + COSMIC Tier 1).", "Panel of 40 WT/Mutant pairs of oncology genes (ClinVar + COSMIC Tier 1)."],
["Los resultados mostrados aquí abajo son de simulación determinista, no de una corrida real del pipeline", "The results shown below come from a deterministic simulation, not from a real pipeline run"],
["— ver aviso más abajo.", "— see the notice further below."],
["38 de estos 40 pares ya tienen una corrida real", "38 of these 40 pairs already have a real run"],
["(ColabFold/AlphaFold2 + classifyPath()) en la tarjeta \"Panel de 40 pares — cobertura real\" más arriba; esta sección simulada se conserva para la herramienta interactiva de análisis por proteína.", "(ColabFold/AlphaFold2 + classifyPath()) in the \"40-pair panel — real coverage\" card above; this simulated section is kept for the interactive per-protein analysis tool."],
["Bloque A", "Block A"],
["(pares 1–20): genes del módulo Proteínas Oncológicas ·", "(pairs 1–20): genes from the Oncology Proteins module ·"],
["Bloque B", "Block B"],
["(pares 21–40): genes adicionales COSMIC/ClinVar Tier 1.", "(pairs 21–40): additional COSMIC/ClinVar Tier 1 genes."],
["Total Pares", "Total Pairs"],
["Analizados (simulado)", "Analyzed (simulated)"],
["Clasificados \"Patogénica\"", "Classified \"Pathogenic\""],
["FD_mr válido", "Valid FD_mr"],
["Completado", "Completed"],
["Criterios de Validación del Pipeline", "Pipeline Validation Criteria"],
["⚠️ Los \"✓ CUMPLE\" de esta tabla verifican que la", "⚠️ The \"✓ PASS\" marks in this table verify that the"],
["simulación", "simulation"],
["(VAL_RESULTS) se comporta como se esperaba de ella — no son evidencia de que el método fractal o la clasificación de patogenicidad funcionen sobre datos reales.", "(VAL_RESULTS) behaves as expected of it — they are not evidence that the fractal method or the pathogenicity classification work on real data."],
["Criterio", "Criterion"],
["Descripción", "Description"],
["Umbral", "Threshold"],
["Resultado", "Result"],
["pLDDT WT aceptable", "Acceptable WT pLDDT"],
["pLDDT global WT > 70 en la mayoría de pares", "Global WT pLDDT > 70 in most pairs"],
["pLDDT WT > 70 en ≥ 80% (32/40)", "WT pLDDT > 70 in ≥ 80% (32/40)"],
["✓ CUMPLE — 38/40", "✓ PASS — 38/40"],
["Impacto estructural detectable", "Detectable structural impact"],
["RMSD Cα > 0.01 Å en región de la mutación", "Cα RMSD > 0.01 Å in the mutation region"],
["RMSD > 0.01 Å en ≥ 35/40 pares", "RMSD > 0.01 Å in ≥ 35/40 pairs"],
["✓ CUMPLE — 40/40", "✓ PASS — 40/40"],
["ΔSASA coherente con exposición", "ΔSASA consistent with exposure"],
["Cambio en accesibilidad superficial detectable", "Detectable change in surface accessibility"],
["ΔSASA ≠ 0 en ≥ 35/40 pares", "ΔSASA ≠ 0 in ≥ 35/40 pairs"],
["Rango FD_mr válido [1.0 – 3.0]", "Valid FD_mr range [1.0 – 3.0]"],
["FD_mr dentro del rango teórico para cadenas proteicas", "FD_mr within the theoretical range for protein chains"],
["FD_mr ∈ [1.0, 3.0] en 40/40 pares", "FD_mr ∈ [1.0, 3.0] in 40/40 pairs"],
["Variación inter-proteína en FD_mr", "Inter-protein variation in FD_mr"],
["FD_mr refleja diferencias en complejidad estructural entre genes", "FD_mr reflects differences in structural complexity between genes"],
["Rango FD_mr diferente en ≥ 3 clases proteicas", "Different FD_mr range in ≥ 3 protein classes"],
["✓ CUMPLE — 9 clases", "✓ PASS — 9 classes"],
["Consistencia intra-proteína", "Intra-protein consistency"],
["FD_mr WT idéntico para hotspots del mismo gen (misma secuencia WT)", "Identical WT FD_mr for hotspots of the same gene (same WT sequence)"],
["FD_mr WT idéntico para los 4 hotspots de cada gen Bloque A", "Identical WT FD_mr for the 4 hotspots of each Block A gene"],
["✓ CUMPLE — 5/5 genes", "✓ PASS — 5/5 genes"],
["Clasificación correcta patogénicas", "Correct classification of pathogenic variants"],
["El índice simulado (escala 0–1, no el PS_v4 real) clasifica como Prob. Patogénica o Patogénica las mutaciones del panel", "The simulated index (0–1 scale, not the real PS_v4) classifies the panel mutations as Likely Pathogenic or Pathogenic"],
["≥ 30/40 clasificados correctamente", "≥ 30/40 correctly classified"],
["⚠️ Las etiquetas que cuenta este criterio son las escritas a mano en", "⚠️ The labels counted by this criterion are the hand-written ones in"],
["(ver aviso de la tabla de abajo) —", "(see the notice in the table below) —"],
["ninguna de las 40 quedó etiquetada \"Benigna\" o \"Incierto\"", "none of the 40 was labeled \"Benign\" or \"Uncertain\""],
[", así que este 100% es una propiedad de cómo se construyó la simulación, no evidencia de que el método distinga patogénico de benigno.", ", so this 100% is a property of how the simulation was built, not evidence that the method distinguishes pathogenic from benign."],
["Dianas terapéuticas priorizadas", "Prioritized therapeutic targets"],
["Mutaciones diana de fármacos aprobados obtienen un índice simulado alto (escala 0–1, no el PS_v4 real, cuyos umbrales son 1.2 y 2.5)", "Target mutations of approved drugs get a high simulated index (0–1 scale, not the real PS_v4, whose thresholds are 1.2 and 2.5)"],
["Índice simulado > 0.6 en ≥ 5/6 dianas terapéuticas", "Simulated index > 0.6 in ≥ 5/6 therapeutic targets"],
["✓ CUMPLE — 6/6", "✓ PASS — 6/6"],
["Panel Completo — 40 Pares WT/Mutante", "Full Panel — 40 WT/Mutant Pairs"],
["Todos (40)", "All (40)"],
["Bloque A (20)", "Block A (20)"],
["Bloque B (20)", "Block B (20)"],
["Gen", "Gene"],
["Bloque", "Block"],
["Tipo", "Type"],
["Cáncer principal", "Main cancer"],
["Mutación", "Mutation"],
["Mecanismo molecular", "Molecular mechanism"],
["Patogenicidad", "Pathogenicity"],
["Acciones", "Actions"],
["Resultados del Sistema — Pipeline ProteinDelta v4.0", "System Results — ProteinDelta v4.0 Pipeline"],
["⬇ Exportar CSV", "⬇ Export CSV"],
["Datos de simulacion, no de pipeline.", "Simulation data, not pipeline data."],
["Los valores de esta tabla provienen del motor de simulacion determinista de la aplicacion (constante", "The values in this table come from the application's deterministic simulation engine (constant"],
["), no de una ejecucion de AlphaFold2/ColabFold ni de BioPython. Las clasificaciones de la ultima columna estan escritas a mano y no las produce", "), not from an AlphaFold2/ColabFold or BioPython run. The classifications in the last column are hand-written and are not produced by"],
[". No deben citarse como validacion experimental del pipeline.", ". They must not be cited as experimental validation of the pipeline."],
["La columna \"PS_v4\" de esta tabla NO usa la misma escala que el motor real", "The \"PS_v4\" column in this table does NOT use the same scale as the real engine"],
[", sección Análisis/Fractal): esta es una escala 0–1 con valores de relleno, mientras que", ", Analysis/Fractal section): this is a 0–1 scale with placeholder values, whereas"],
["produce un score sin acotar donde Patogénica exige > 2.5. Los valores 0.68–0.996 mostrados aquí", "produces an unbounded score where Pathogenic requires > 2.5. The values 0.68–0.996 shown here"],
["no serían clasificados como patogénicos", "would not be classified as pathogenic"],
["si se pasaran por", "if they were passed through"],
["— la clasificación de esta columna no es resultado de aplicar ningún umbral verificable, es una etiqueta manual.", "— the classification in this column is not the result of applying any verifiable threshold; it is a manual label."],
["Estructura del panel de 40 pares WT/Mutante y metricas asociadas: pLDDT, RMSD Cα, ΔSASA, dimension fractal FD_bc y FD_mr, y score de patogenicidad PS_v4.", "Structure of the 40 WT/Mutant pair panel and associated metrics: pLDDT, Cα RMSD, ΔSASA, fractal dimension FD_bc and FD_mr, and PS_v4 pathogenicity score."],
["Reproducibilidad:", "Reproducibility:"],
["usa el botón", "use the"],
["⚗️ Analizar", "⚗️ Analyze"],
["en el panel de pares para cargar cada gen en el módulo de análisis y verificar los resultados individualmente.", "button in the pairs panel to load each gene into the analysis module and verify the results individually."],
["Par WT → MUT", "WT → MUT pair"],
["REAL = calculado con classifyPath() sobre datos importados · SIM = constante VAL_RESULTS, simulación", "REAL = computed with classifyPath() on imported data · SIM = VAL_RESULTS constant, simulation"],
["Dirección del ΔFD_bc — informativa, no forma parte del score (ver aviso arriba)", "ΔFD_bc direction — informative, not part of the score (see notice above)"],
["Escala 0–1: sigmoide(classifyPath().sc) en filas REAL, valor de relleno en filas SIM — no confundir con el score sin acotar de classifyPath()", "0–1 scale: sigmoid(classifyPath().sc) in REAL rows, placeholder value in SIM rows — do not confuse with the unbounded score of classifyPath()"],
["Clasificación", "Classification"],
["Validación Cáncer de Mama — v5.0 · Módulo independiente", "Breast Cancer Validation — v5.0 · Standalone module"],
["Panel específico de", "Panel specific to"],
["cáncer de mama humano (GRCh38 / hg38)", "human breast cancer (GRCh38 / hg38)"],
["solicitado por la dirección de tesis. Reproduce la", "requested by the thesis advisors. It reproduces the"],
["Tabla: Panel de 40 Pares WT vs. Mutado en Cáncer de Mama", "Table: Panel of 40 WT vs. Mutant Pairs in Breast Cancer"],
["e incorpora el requisito metodológico de", "and incorporates the methodological requirement of"],
["controles negativos (variantes benignas)", "negative controls (benign variants)"],
["ausente en la Tabla 17 (v4.0).", "absent from Table 17 (v4.0)."],
["Esquema de validación por fases:", "Phased validation scheme:"],
["Fase 1 — Piloto (ACTUAL): N = 40 casos + 12 controles", "Phase 1 — Pilot (CURRENT): N = 40 cases + 12 controls"],
["→ Fase 2 — Publicación: N ≈ 250 casos + 150 controles (ROC vs SIFT / PolyPhen-2 / REVEL) → Fase 3 — Clínica: N ≥ 1000–2000 pares.", "→ Phase 2 — Publication: N ≈ 250 cases + 150 controls (ROC vs SIFT / PolyPhen-2 / REVEL) → Phase 3 — Clinical: N ≥ 1000–2000 pairs."],
["⚠ Los resultados y métricas de esta pantalla son de", "⚠ The results and metrics on this screen come from a"],
["simulación determinista con semilla", "deterministic simulation with seed"],
[", no de una corrida real del pipeline ColabFold + BioPython. Sirven de andamiaje para validar la lógica del módulo. Cada par debe re-ejecutarse en ColabFold (perfil", ", not from a real run of the ColabFold + BioPython pipeline. They serve as scaffolding to validate the module's logic. Each pair must be re-run in ColabFold (profile"],
[") antes de reportarse.", ") before being reported."],
["Panel de cáncer de mama — término esférico de fractalidad", "Breast cancer panel — spherical fractality term"],
["39 de 40 parejas evaluadas con ColabFold/AlphaFold2 (accurate) y BioPython: 27 patogénicas y 12 controles benignos de ClinVar. KMT2C S3662F queda pendiente: la posición 3662 de las tres isoformas RefSeq es glutamato, no serina.", "39 of 40 pairs evaluated with ColabFold/AlphaFold2 (accurate) and BioPython: 27 pathogenic and 12 benign ClinVar controls. KMT2C S3662F is pending: position 3662 in all three RefSeq isoforms is glutamate, not serine."],
["FD esférica:", "Spherical FD:"],
["dimensión fractal local en una esfera de 12 Å alrededor del residuo mutado, en la estructura WT y en la mutante. ΔFD = FD mutante − FD WT.", "local fractal dimension in a 12 Å sphere around the mutated residue, in the WT structure and in the mutant. ΔFD = mutant FD − WT FD."],
["Pares evaluados (27 patog. + 12 benig.)", "Pairs evaluated (27 path. + 12 benign)"],
["ΔFD medio, IC95% -0.123 a +0.064", "Mean ΔFD, 95% CI -0.123 to +0.064"],
["Patogénicas con ΔFD > 0 (p = 0.12)", "Pathogenic with ΔFD > 0 (p = 0.12)"],
["WT vs mutante pareado (t-test)", "Paired WT vs mutant (t-test)"],
["Par", "Pair"],
["ΔFD (escala ±1)", "ΔFD (±1 scale)"],
["PS_v4 orig → esférico", "PS_v4 orig → spherical"],
["Clase (esférico)", "Class (spherical)"],
["Pendiente", "Pending"],
["Estadística descriptiva.", "Descriptive statistics."],
["El ΔFD medio entre WT y mutante es -0.030 (IC95% -0.123 a +0.064; t pareada p = 0.52; Wilcoxon p = 0.46). Las patogénicas muestran una tendencia a ΔFD positivo (18/27), pero la prueba binomial no es significativa (p = 0.12). Patogénicas frente a benignas: Mann–Whitney p = 0.47. El signo de ΔFD no separa las clases predichas (Fisher p = 1.00). El término no entra con signo en PS_v4, que usa |ΔFD|.", "The mean ΔFD between WT and mutant is -0.030 (95% CI -0.123 to +0.064; paired t p = 0.52; Wilcoxon p = 0.46). Pathogenic variants show a trend toward positive ΔFD (18/27), but the binomial test is not significant (p = 0.12). Pathogenic vs benign: Mann–Whitney p = 0.47. The sign of ΔFD does not separate the predicted classes (Fisher p = 1.00). The term does not enter PS_v4 with its sign, since it uses |ΔFD|."],
["Resultados no confiables: numeración con caveat o ventana desordenada (ver informe).", "Unreliable results: numbering with a caveat or disordered window (see report)."],
["Desempeño diagnóstico (simulado) — umbral PS_v5 ≥ 0.50", "Diagnostic performance (simulated) — PS_v5 threshold ≥ 0.50"],
["Casos patogénicos", "Pathogenic cases"],
["Controles benignos", "Benign controls"],
["Sensibilidad", "Sensitivity"],
["Especificidad", "Specificity"],
["VPP", "PPV"],
["VPN", "NPV"],
["Casos — 40 pares patogénicos WT → Mutado (mama)", "Cases — 40 pathogenic WT → Mutant pairs (breast)"],
["Nuevos (28)", "New (28)"],
["Heredados de v4 (12)", "Inherited from v4 (12)"],
["⚑ Revisar con director", "⚑ Review with advisor"],
["Cambio (canónico)", "Change (canonical)"],
["Mecanismo oncológico", "Oncogenic mechanism"],
["Fuente", "Source"],
["Acción", "Action"],
["Heredado de v4", "Inherited from v4"],
[": gen y mutación idénticos a un par ya validado en la Tabla 17 — no se recalcula (regla del director: «saca los genes en común»).", ": gene and mutation identical to a pair already validated in Table 17 — not recomputed (advisor's rule: «remove the genes in common»)."],
["⚑ Revisar", "⚑ Review"],
[": la variante listada es hotspot en otro tumor, no Tier-1 en mama — confirmar con ClinVar/COSMIC filtrado a mama.", ": the listed variant is a hotspot in another tumor, not Tier-1 in breast — confirm with ClinVar/COSMIC filtered to breast."],
["Controles negativos — 12 variantes benignas / neutras", "Negative controls — 12 benign / neutral variants"],
["Resultado esperado en ProteinDelta:", "Expected result in ProteinDelta:"],
[". Fuente: ClinVar (Benign / Likely benign) + gnomAD (frecuentes).", ". Source: ClinVar (Benign / Likely benign) + gnomAD (common)."],
["Cambio", "Change"],
["Resultados simulados — casos + controles", "Simulated results — cases + controls"],
["Grupo", "Group"],
["Gen · cambio", "Gene · change"],
["¿Acierto?", "Correct?"],
["⬇ Exportar CSV (52 filas)", "⬇ Export CSV (52 rows)"],
["▸ Fase 1 — Módulo Proteínas Oncológicas", "▸ Phase 1 — Oncology Proteins Module"],
["(5 proteínas · análisis validados)", "(5 proteins · validated analyses)"],
["Tumor Protein P53 — Guardián del Genoma", "Tumor Protein P53 — Guardian of the Genome"],
["Supresor tumoral", "Tumor suppressor"],
["Ciclo celular", "Cell cycle"],
["~50% de todos los cánceres humanos", "~50% of all human cancers"],
["Kirsten Rat Sarcoma Viral Proto-Oncogene — GTPasa RAS", "Kirsten Rat Sarcoma Viral Proto-Oncogene — RAS GTPase"],
["Proto-oncogén", "Proto-oncogene"],
["Señalización MAPK", "MAPK signaling"],
["GTPasa", "GTPase"],
["~25% de todos los cánceres humanos", "~25% of all human cancers"],
["Breast Cancer Gene 1 — Reparación del ADN", "Breast Cancer Gene 1 — DNA Repair"],
["Reparación ADN", "DNA repair"],
["Mutaciones germinales: 5–10% de cánceres mama/ovario", "Germline mutations: 5–10% of breast/ovarian cancers"],
["Epidermal Growth Factor Receptor — RTK tirosina quinasa", "Epidermal Growth Factor Receptor — tyrosine kinase RTK"],
["Oncogén", "Oncogene"],
["Señalización PI3K", "PI3K signaling"],
["10–30% cáncer pulmón no microcítico", "10–30% of non-small cell lung cancer"],
["BCR-ABL1 Fusion Oncogene — Cromosoma Filadelfia", "BCR-ABL1 Fusion Oncogene — Philadelphia Chromosome"],
["Fusión oncogénica", "Oncogenic fusion"],
["Alteración de los dominios BH — regulación anti-apoptótica", "Alteration of the BH domains — anti-apoptotic regulation"],
["Alteración del núcleo de recombinación homóloga (complejo BCDX2)", "Alteration of the homologous recombination core (BCDX2 complex)"],
["Alteración entre dominios ANK y BRCT — heterodímero con BRCA1", "Alteration between ANK and BRCT domains — heterodimer with BRCA1"],
["Alteración del dominio quinasa — pérdida de activación de AMPK", "Alteration of the kinase domain — loss of AMPK activation"],
["Pérdida de autoinhibición JH2 — JAK/STAT constitutiva", "Loss of JH2 autoinhibition — constitutive JAK/STAT"],
["Estabilización del dímero activo vía dominio SH2", "Stabilization of the active dimer via the SH2 domain"],
["Alteración del dominio de homología a PDGF (unión a receptor)", "Alteration of the PDGF homology domain (receptor binding)"],
["Benigna (polimorfismo P72R)", "Benign (P72R polymorphism)"],
["Benigna / likely benign", "Benign / likely benign"],
["Benigna (polimorfismo I655V)", "Benign (I655V polymorphism)"],
["Benigna (polimorfismo F354L)", "Benign (F354L polymorphism)"],
["caso", "case"],
["Constante VAL_RESULTS — simulación determinista, no pipeline real", "VAL_RESULTS constant — deterministic simulation, not the real pipeline"],
["Dirección del cambio fractal — no incluida en el score, solo informativa", "Direction of the fractal change — not included in the score, informative only"],
["ClinVar lista D2723H como patogénica; D2723A proviene de ensayos funcionales (Guidugli 2013)", "ClinVar lists D2723H as pathogenic; D2723A comes from functional assays (Guidugli 2013)"],
["Hotspot en linfoma de Burkitt; en mama MYC actúa por amplificación, no mutación puntual", "Hotspot in Burkitt lymphoma; in breast, MYC acts through amplification, not point mutation"],
["P287T poco caracterizada; en mama CCND1 es amplificación / mutaciones de splicing en T286", "P287T poorly characterized; in breast, CCND1 shows amplification / splicing mutations at T286"],
["No es hotspot reconocido; en mama MDM2 actúa por amplificación / SNP309 del promotor", "Not a recognized hotspot; in breast, MDM2 acts through amplification / promoter SNP309"],
["En mama MAP3K1 se inactiva típicamente por mutaciones truncantes; T1381I es missense", "In breast, MAP3K1 is typically inactivated by truncating mutations; T1381I is missense"],
["En mama GATA3 muta sobre todo por frameshift (p.ej. R330fs); el missense R330G es atípico", "In breast, GATA3 mutates mostly by frameshift (e.g. R330fs); the R330G missense is atypical"],
["Hotspot por hipermutación somática en linfoma folicular; en mama BCL2 es sobreexpresión (ER+)", "Hotspot from somatic hypermutation in follicular lymphoma; in breast, BCL2 is overexpressed (ER+)"],
["Hotspot en neoplasias mieloproliferativas (PV/TE/MF), no en cáncer de mama", "Hotspot in myeloproliferative neoplasms (PV/ET/MF), not in breast cancer"],
["Activante en leucemia LGL; en mama STAT3 se activa por fosforilación, rara vez mutado", "Activating in LGL leukemia; in breast, STAT3 is activated by phosphorylation, rarely mutated"],
["VEGFA en tumores actúa por sobreexpresión/angiogénesis, no por mutación puntual recurrente", "VEGFA in tumors acts through overexpression/angiogenesis, not through recurrent point mutation"],
["TP53 codifica el factor de transcripción p53, cuya función es responder al daño del ADN deteniendo el ciclo celular o induciendo apoptosis. Las mutaciones en el dominio de unión al ADN son hotspots oncogénicos que confieren ganancia de función oncogénica (GoF). La dimensión fractal de p53 silvestre es ~2.1 (superficie rugosa por su dominio tetramérico). Terapia dirigida: APR-246 (PRIMA-1Met).", "TP53 encodes the transcription factor p53, whose role is to respond to DNA damage by arresting the cell cycle or inducing apoptosis. Mutations in the DNA-binding domain are oncogenic hotspots that confer oncogenic gain of function (GoF). The fractal dimension of wild-type p53 is ~2.1 (rough surface due to its tetrameric domain). Targeted therapy: APR-246 (PRIMA-1Met)."],
["Estructura y función de p53", "Structure and function of p53"],
["Mutaciones gain-of-function", "Gain-of-function mutations"],
["Dimensión fractal de proteínas", "Fractal dimension of proteins"],
["KRAS es una GTPasa que actúa como interruptor molecular en RAS-MAPK/ERK. Las mutaciones G12X bloquean la hidrólisis de GTP. FD_bc WT ≈ 1.8 (estructura compacta globular de 189 aa). La mutación G12D reduce FD_bc ~0.08 por alteración del P-loop. Terapia: Sotorasib (AMG510), aprobado FDA 2021.", "KRAS is a GTPase that acts as a molecular switch in RAS-MAPK/ERK. G12X mutations block GTP hydrolysis. FD_bc WT ≈ 1.8 (compact globular structure of 189 aa). The G12D mutation reduces FD_bc by ~0.08 through alteration of the P-loop. Therapy: Sotorasib (AMG510), FDA-approved 2021."],
["Sotorasib: primer inhibidor KRAS-G12C", "Sotorasib: first KRAS-G12C inhibitor"],
["Análisis fractal de superficies proteicas", "Fractal analysis of protein surfaces"],
["Mecanismo de inhibición covalente", "Mechanism of covalent inhibition"],
["BRCA1 coordina la reparación por recombinación homóloga (HR). El dominio RING (aa 1–109) contiene C61 y tiene FD_bc ≈ 1.6. Para mutaciones en dominio BRCT (R1699, V1736, G1738) usar secuencia aa 1642–1863 de UniProt P38398. Terapia: Inhibidores PARP (Olaparib).", "BRCA1 coordinates homologous recombination (HR) repair. The RING domain (aa 1–109) contains C61 and has FD_bc ≈ 1.6. For mutations in the BRCT domain (R1699, V1736, G1738) use sequence aa 1642–1863 from UniProt P38398. Therapy: PARP inhibitors (Olaparib)."],
["Identificación original de BRCA1", "Original identification of BRCA1"],
["Inhibidores PARP y letalidad sintética", "PARP inhibitors and synthetic lethality"],
["FD en proteínas de reparación de ADN", "FD in DNA repair proteins"],
["EGFR activa vías de proliferación (RAS-ERK, PI3K-AKT). El dominio quinasa tiene FD_bc ≈ 2.2 por la alta rugosidad del sitio activo bilobular. L858R aumenta ΔFD_bc ≈ +0.15 (reestructuración del activation loop). Para análisis con ColabFold usar secuencia del dominio quinasa aa 712–979 de UniProt P00533. TKIs: gefitinib, osimertinib.", "EGFR activates proliferation pathways (RAS-ERK, PI3K-AKT). The kinase domain has FD_bc ≈ 2.2 due to the high roughness of the bilobed active site. L858R increases ΔFD_bc by ≈ +0.15 (restructuring of the activation loop). For ColabFold analysis use the kinase domain sequence aa 712–979 from UniProt P00533. TKIs: gefitinib, osimertinib."],
["Mutaciones EGFR en NSCLC", "EGFR mutations in NSCLC"],
["Análisis fractal de sitios de unión", "Fractal analysis of binding sites"],
["BCR-ABL1 fusión t(9;22): actividad TK constitutiva. FD_bc del dominio quinasa ≈ 2.0 con imatinib unido (reduce rugosidad). T315I (gatekeeper) causa ΔFD_bc ≈ +0.18 por pérdida de contacto hidrofóbico con el inhibidor. Para ColabFold usar dominio kinasa ABL1 aa 220–500 de UniProt P00519. TKIs: imatinib, ponatinib, asciminib.", "BCR-ABL1 fusion t(9;22): constitutive TK activity. FD_bc of the kinase domain ≈ 2.0 with bound imatinib (reduces roughness). T315I (gatekeeper) causes ΔFD_bc ≈ +0.18 through loss of hydrophobic contact with the inhibitor. For ColabFold use the ABL1 kinase domain aa 220–500 from UniProt P00519. TKIs: imatinib, ponatinib, asciminib."],
["Imatinib en CML: ensayo clínico", "Imatinib in CML: clinical trial"],
["Mecanismos de resistencia a TKI", "Mechanisms of TKI resistance"],
["FD y estabilidad de dominios quinasa", "FD and stability of kinase domains"],
["BRAF activa la cascada MAPK/ERK. V600E (~90% mutaciones BRAF) mimetiza la activación por fosforilación. Diana de vemurafenib y dabrafenib.", "BRAF activates the MAPK/ERK cascade. V600E (~90% of BRAF mutations) mimics activation by phosphorylation. Target of vemurafenib and dabrafenib."],
["Descubrimiento mutaciones BRAF en cáncer", "Discovery of BRAF mutations in cancer"],
["Vemurafenib en melanoma V600E", "Vemurafenib in V600E melanoma"],
["PIK3CA codifica la subunidad catalítica p110α de PI3K. Mutaciones en el dominio helical (E545K) y quinasa (H1047R) activan constitutivamente la vía PI3K-AKT-mTOR.", "PIK3CA encodes the p110α catalytic subunit of PI3K. Mutations in the helical (E545K) and kinase (H1047R) domains constitutively activate the PI3K-AKT-mTOR pathway."],
["Mutaciones PIK3CA en cáncer humano", "PIK3CA mutations in human cancer"],
["PI3K en resistencia a EGFR", "PI3K in EGFR resistance"],
["PTEN desfosforila PIP3 antagonizando PI3K. Pérdida de PTEN activa constitutivamente AKT. El sitio catalítico contiene C124 (esencial) y R130.", "PTEN dephosphorylates PIP3, antagonizing PI3K. Loss of PTEN constitutively activates AKT. The catalytic site contains C124 (essential) and R130."],
["Identificación PTEN como supresor tumoral", "Identification of PTEN as a tumor suppressor"],
["Actividad fosfatasa de PTEN", "Phosphatase activity of PTEN"],
["APC regula la degradación de β-catenina. Pérdida de APC activa transcripción de genes proliferativos vía Wnt. La mayoría de mutaciones generan codones de parada en el clúster de mutación principal (MCR, aa 1280–1500).", "APC regulates β-catenin degradation. Loss of APC activates transcription of proliferative genes via Wnt. Most mutations create stop codons in the mutation cluster region (MCR, aa 1280–1500)."],
["Identificación del gen APC", "Identification of the APC gene"],
["APC y β-catenina", "APC and β-catenin"],
["pRB regula la transición G1/S bloqueando E2F. La fosforilación por CDK4/6 libera E2F. R661 contacta directamente E2F en el pocket A/B.", "pRB regulates the G1/S transition by blocking E2F. Phosphorylation by CDK4/6 releases E2F. R661 directly contacts E2F in the A/B pocket."],
["Identificación RB1", "Identification of RB1"],
["pRB y ciclo celular", "pRB and the cell cycle"],
["p16-INK4A inhibe CDK4/6 impidiendo fosforilación de pRB y manteniendo el freno G1. R24 contacta CDK4 directamente. Alteraciones en CDKN2A son entre las más frecuentes en cáncer.", "p16-INK4A inhibits CDK4/6, preventing pRB phosphorylation and maintaining the G1 brake. R24 contacts CDK4 directly. CDKN2A alterations are among the most frequent in cancer."],
["Identificación CDKN2A/p16", "Identification of CDKN2A/p16"],
["p16 inhibe CDK4", "p16 inhibits CDK4"],
["NRAS es una GTPasa RAS que activa MAPK y PI3K. Q61 es crítico para la hidrólisis de GTP mediada por GAP. Mutaciones Q61 son más frecuentes que G12 en NRAS (a diferencia de KRAS).", "NRAS is a RAS GTPase that activates MAPK and PI3K. Q61 is critical for GAP-mediated GTP hydrolysis. Q61 mutations are more frequent than G12 in NRAS (unlike KRAS)."],
["Familia RAS en señalización", "The RAS family in signaling"],
["Biología de mutaciones NRAS", "Biology of NRAS mutations"],
["HRAS prototipo de la familia RAS. G12V es la mutación oncogénica clásica. Activa MAPK, PI3K y RalGDS. Transformación celular estudiada desde los años 80.", "HRAS is the prototype of the RAS family. G12V is the classic oncogenic mutation. It activates MAPK, PI3K and RalGDS. Cell transformation studied since the 1980s."],
["Primera mutación oncogénica de punto identificada", "First oncogenic point mutation identified"],
["HRAS en carcinoma de vejiga", "HRAS in bladder carcinoma"],
["HER2 forma heterodímeros con EGFR/HER3 activando MAPK y PI3K. V777 está en el dominio quinasa. Terapia: trastuzumab, pertuzumab, lapatinib, T-DM1.", "HER2 forms heterodimers with EGFR/HER3, activating MAPK and PI3K. V777 is in the kinase domain. Therapy: trastuzumab, pertuzumab, lapatinib, T-DM1."],
["HER2 en cáncer de mama", "HER2 in breast cancer"],
["Biología de HER2", "Biology of HER2"],
["MET es el receptor de HGF/SF. Activa PI3K, MAPK y STAT3 promoviendo invasión y migración. Y1230/Y1235 son los sitios de autofosforilación del activation loop.", "MET is the receptor for HGF/SF. It activates PI3K, MAPK and STAT3, promoting invasion and migration. Y1230/Y1235 are the autophosphorylation sites of the activation loop."],
["Identificación del oncogén MET", "Identification of the MET oncogene"],
["MET como diana terapéutica", "MET as a therapeutic target"],
["IDH1 WT convierte isocitrato a α-KG. R132H genera 2-hidroxiglutarato (2-HG), oncometabolito que inhibe dioxigenasas. R132 contacta el sustrato isocitrato en el sitio activo.", "WT IDH1 converts isocitrate to α-KG. R132H produces 2-hydroxyglutarate (2-HG), an oncometabolite that inhibits dioxygenases. R132 contacts the isocitrate substrate in the active site."],
["Descubrimiento mutaciones IDH1 en glioma", "Discovery of IDH1 mutations in glioma"],
["2-HG como oncometabolito", "2-HG as an oncometabolite"],
["IDH2 mitocondrial. R172K (análogo a IDH1 R132H) produce 2-HG. Diana de enasidenib (aprobado FDA 2017).", "Mitochondrial IDH2. R172K (analogous to IDH1 R132H) produces 2-HG. Target of enasidenib (FDA-approved 2017)."],
["Mutaciones IDH2 en LMA", "IDH2 mutations in AML"],
["2-HG en IDH2", "2-HG in IDH2"],
["FGFR3 regula proliferación y diferenciación. S249C crea un nuevo puente disulfuro que activa el receptor constitutivamente. Diana de erdafitinib (aprobado FDA 2019).", "FGFR3 regulates proliferation and differentiation. S249C creates a new disulfide bridge that constitutively activates the receptor. Target of erdafitinib (FDA-approved 2019)."],
["Mutaciones activadoras FGFR3 en cáncer", "Activating FGFR3 mutations in cancer"],
["Erdafitinib en urotelial FGFR3+", "Erdafitinib in FGFR3+ urothelial cancer"],
["ALK es un RTK normalmente silenciado en adultos. F1174L activa constitutivamente el receptor en neuroblastoma. Fusión EML4-ALK en NSCLC. Diana de crizotinib, alectinib.", "ALK is an RTK normally silenced in adults. F1174L constitutively activates the receptor in neuroblastoma. EML4-ALK fusion in NSCLC. Target of crizotinib, alectinib."],
["Fusión EML4-ALK en pulmón", "EML4-ALK fusion in lung cancer"],
["Mutaciones ALK en neuroblastoma", "ALK mutations in neuroblastoma"],
["VHL es la subunidad de reconocimiento del complejo E3 ubiquitina ligasa que ubiquitina HIF-1α para degradación. Pérdida de VHL → acumulación HIF → pseudohipoxia → VEGF → angiogénesis.", "VHL is the recognition subunit of the E3 ubiquitin ligase complex that ubiquitinates HIF-1α for degradation. Loss of VHL → HIF accumulation → pseudohypoxia → VEGF → angiogenesis."],
["Identificación VHL", "Identification of VHL"],
["Hidroxilación de HIF por PHD", "HIF hydroxylation by PHD"],
["SMAD4 es el SMAD común (Co-SMAD) requerido para la señalización TGF-β/BMP. R361 en el dominio MH2 participa en la formación de complejos heteroméricos SMAD.", "SMAD4 is the common SMAD (Co-SMAD) required for TGF-β/BMP signaling. R361 in the MH2 domain participates in the formation of heteromeric SMAD complexes."],
["SMAD4/DPC4 como supresor en páncreas", "SMAD4/DPC4 as a suppressor in pancreas"],
["Señalización SMAD", "SMAD signaling"],
["β-catenina es el efector transcripcional de la vía Wnt. S45 es fosforilada por CK1, iniciando la cascada de fosforilación que lleva a la ubiquitinación. S45F bloquea esta fosforilación, acumulando β-catenina nuclear.", "β-catenin is the transcriptional effector of the Wnt pathway. S45 is phosphorylated by CK1, starting the phosphorylation cascade that leads to ubiquitination. S45F blocks this phosphorylation, causing nuclear β-catenin to accumulate."],
["Mutaciones β-catenina en cáncer colorrectal", "β-catenin mutations in colorectal cancer"],
["Señalización Wnt/β-catenina", "Wnt/β-catenin signaling"],
["Calculando estructura y dimensión fractal v4…", "Computing structure and fractal dimension v4…"],
["🟡 simulado", "🟡 simulated"],
["Confianza de AlphaFold2 en la estructura del tipo salvaje. >70: alta confianza · 50–70: media · <50: región probablemente desordenada.", "AlphaFold2 confidence in the wild-type structure. >70: high confidence · 50–70: medium · <50: likely disordered region."],
["Confianza estructural del mutante. Una caída respecto al WT indica que la mutación induce desorden o inestabilidad local en esa región.", "Structural confidence of the mutant. A drop relative to WT indicates that the mutation induces local disorder or instability in that region."],
["ΔΔG medio", "Mean ΔΔG"],
["ΔΔG Medio (kcal/mol)", "Mean ΔΔG (kcal/mol)"],
["Cambio promedio en energía libre de Gibbs. Positivo = desestabilizante (rojo). Negativo = estabilizante (verde). |ΔΔG| > 0.5 kcal/mol indica impacto funcional relevante.", "Average change in Gibbs free energy. Positive = destabilizing (red). Negative = stabilizing (green). |ΔΔG| > 0.5 kcal/mol indicates a relevant functional impact."],
["Fitness medio", "Mean fitness"],
["Fitness Evolutivo Medio", "Mean Evolutionary Fitness"],
["Aptitud evolutiva promedio estimada. Valores negativos indican que la mutación perjudica la función proteica según la conservación en secuencias homólogas.", "Estimated average evolutionary fitness. Negative values indicate the mutation impairs protein function according to conservation in homologous sequences."],
["Dimensión Fractal WT (Box-Counting)", "WT Fractal Dimension (Box-Counting)"],
["Complejidad geométrica del tipo salvaje calculada por Box-Counting. Rango típico: 1.0–2.6. Mayor valor = superficie más rugosa y compleja.", "Geometric complexity of the wild type computed by Box-Counting. Typical range: 1.0–2.6. Higher value = rougher, more complex surface."],
["Dimensión Fractal MUT (Box-Counting)", "MUT Fractal Dimension (Box-Counting)"],
["Complejidad geométrica del mutante. Una reducción respecto al WT indica que la mutación simplifica o compacta la estructura proteica.", "Geometric complexity of the mutant. A reduction relative to WT indicates that the mutation simplifies or compacts the protein structure."],
["ΔFD_bc medio", "Mean ΔFD_bc"],
["ΔFD_bc Medio (MUT − WT)", "Mean ΔFD_bc (MUT − WT)"],
["Cambio promedio en dimensión fractal. |ΔFD| > 0.08: alto impacto estructural · 0.03–0.08: moderado · < 0.03: impacto leve.", "Average change in fractal dimension. |ΔFD| > 0.08: high structural impact · 0.03–0.08: moderate · < 0.03: mild impact."],
["Res. patogénicos", "Pathogenic res."],
["Residuos Patogénicos", "Pathogenic Residues"],
["Residuos clasificados como patogénicos o probablemente patogénicos según el score PS_v4, que integra ΔΔG, fitness evolutivo, ΔpLDDT y ΔFD_bc.", "Residues classified as pathogenic or likely pathogenic according to the PS_v4 score, which integrates ΔΔG, evolutionary fitness, ΔpLDDT and ΔFD_bc."],
["⬡ Patogénica", "⬡ Pathogenic"],
["Fuerte desestabilización, bajo fitness y alta perturbación fractal.", "Strong destabilization, low fitness and high fractal perturbation."],
["Superficie rugosa típica de proteína globular. FD en rango esperado.", "Rough surface typical of a globular protein. FD in the expected range."],
["no calculable", "not computable"],
["El ajuste de Mass-Radius no convergio (R² bajo o pendiente fuera de [1,0 – 3,2]). Un FD_mr saturado en el limite inferior NO es un resultado: es el estimador fallando.", "The Mass-Radius fit did not converge (low R² or slope outside [1.0 – 3.2]). An FD_mr saturated at the lower bound is NOT a result: it is the estimator failing."],
["No disponible: el FD local espacial requiere PDB real de WT y MUT (sección", "Not available: spatial local FD requires real WT and MUT PDBs (section"],
["). En modo simulado no hay geometría terciaria real sobre la cual calcular contactos 3D.", "). In simulated mode there is no real tertiary geometry on which to compute 3D contacts."],
["Estructura secundaria regular (hélices α / láminas β). FD moderada.", "Regular secondary structure (α-helices / β-sheets). Moderate FD."],
["Ajuste no valido — no se reporta valor.", "Invalid fit — no value reported."],
["· neutro", "· neutral"],
["Calculado con classifyPath() sobre datos importados de ColabFold", "Computed with classifyPath() on data imported from ColabFold"],
["Tirosina quinasa", "Tyrosine kinase"],
[">95% de Leucemia Mieloide Crónica", ">95% of Chronic Myeloid Leukemia"],
["▸ Fase 2 — Panel de Validación (Bloque B)", "▸ Phase 2 — Validation Panel (Block B)"],
["(17 proteínas · COSMIC / ClinVar Tier 1)", "(17 proteins · COSMIC / ClinVar Tier 1)"],
["Quinasa", "Kinase"],
["~8% todos los cánceres; 50% melanoma", "~8% of all cancers; 50% of melanoma"],
["Señalización AKT", "AKT signaling"],
["~30% cáncer mama; 20% colorrectal", "~30% of breast cancer; 20% colorectal"],
["Phosphatase and Tensin Homolog — Supresor Tumoral", "Phosphatase and Tensin Homolog — Tumor Suppressor"],
["Fosfatasa", "Phosphatase"],
["~15% todos los cánceres; Síndrome Cowden", "~15% of all cancers; Cowden syndrome"],
["β-catenina", "β-catenin"],
["FAP; 80% cáncer colorrectal esporádico", "FAP; 80% of sporadic colorectal cancer"],
["Retinoblastoma Protein — Regulador del Ciclo Celular", "Retinoblastoma Protein — Cell Cycle Regulator"],
["Retinoblastoma hereditario; 30% osteosarcoma", "Hereditary retinoblastoma; 30% of osteosarcoma"],
["~10% todos los cánceres; melanoma familiar", "~10% of all cancers; familial melanoma"],
["~8% melanoma; ~10% LMA", "~8% of melanoma; ~10% of AML"],
["~3% todos los cánceres; vejiga", "~3% of all cancers; bladder"],
["20–30% cáncer mama; 15% gástrico", "20–30% of breast cancer; 15% gastric"],
["MET Proto-Oncogene — Receptor Tirosina Quinasa", "MET Proto-Oncogene — Receptor Tyrosine Kinase"],
["3–5% NSCLC; amplificación renal", "3–5% of NSCLC; renal amplification"],
["Isocitrate Dehydrogenase 1 — Oncogén Metabólico", "Isocitrate Dehydrogenase 1 — Metabolic Oncogene"],
["Oncogén metabólico", "Metabolic oncogene"],
["~70% glioma bajo grado; ~20% LMA", "~70% of low-grade glioma; ~20% of AML"],
["Isocitrate Dehydrogenase 2 — Mitocondrial", "Isocitrate Dehydrogenase 2 — Mitochondrial"],
["Mitocondria", "Mitochondria"],
["~15% LMA; colangiocarcinoma", "~15% of AML; cholangiocarcinoma"],
["~70% carcinoma urotelial; mieloma múltiple", "~70% of urothelial carcinoma; multiple myeloma"],
["3–7% NSCLC (fusión); neuroblastoma", "3–7% of NSCLC (fusion); neuroblastoma"],
["Ubiquitina", "Ubiquitin"],
["Síndrome VHL; 75% carcinoma renal de células claras", "VHL syndrome; 75% of clear cell renal carcinoma"],
["SMAD Family Member 4 — Supresor Tumoral", "SMAD Family Member 4 — Tumor Suppressor"],
["~50% carcinoma pancreático; 10–15% colorrectal", "~50% of pancreatic carcinoma; 10–15% colorectal"],
["Catenin Beta 1 — β-Catenina", "Catenin Beta 1 — β-Catenin"],
["~5% todos los cánceres; hepatocarcinoma", "~5% of all cancers; hepatocellular carcinoma"],
["Múltiple (~50%)", "Multiple (~50%)"],
["Pérdida de contacto con ADN", "Loss of DNA contact"],
["Patogénica (ClinVar)", "Pathogenic (ClinVar)"],
["Pérdida de contacto estructural", "Loss of structural contact"],
["Páncreas, pulmón, colon", "Pancreas, lung, colon"],
["Bloqueo actividad GTPasa", "Blocked GTPase activity"],
["Patogénica (COSMIC)", "Pathogenic (COSMIC)"],
["Pulmón (NSCLC)", "Lung (NSCLC)"],
["Bloqueo GTPasa — diana sotorasib", "Blocked GTPase — sotorasib target"],
["Páncreas, colon", "Pancreas, colon"],
["Mama, ovario hereditario", "Hereditary breast, ovarian"],
["Disrupción dominio RING", "RING domain disruption"],
["Alteración dominio BRCT", "BRCT domain alteration"],
["Disrupción dominio BRCT", "BRCT domain disruption"],
["Alteración dominio BRCT fosfopeptídico", "Phosphopeptide-binding BRCT domain alteration"],
["Pulmón NSCLC (10–30%)", "NSCLC lung (10–30%)"],
["Activación constitutiva quinasa", "Constitutive kinase activation"],
["Pulmón NSCLC — resistencia", "NSCLC lung — resistance"],
["Resistencia gefitinib/erlotinib", "Gefitinib/erlotinib resistance"],
["Resistencia a osimertinib 3ª gen", "Resistance to 3rd-gen osimertinib"],
["LMC (>95%)", "CML (>95%)"],
["Resistencia imatinib — compuerta hidrofóbica", "Imatinib resistance — hydrophobic gatekeeper"],
["LMC", "CML"],
["Resistencia imatinib — asa P", "Imatinib resistance — P-loop"],
["Pulmón NSCLC", "NSCLC lung"],
["Activación constitutiva — variante exón 19", "Constitutive activation — exon 19 variant"],
["Melanoma (50%), tiroides", "Melanoma (50%), thyroid"],
["Activación constitutiva MAPK — diana vemurafenib", "Constitutive MAPK activation — vemurafenib target"],
["Melanoma — resistencia", "Melanoma — resistance"],
["Activación constitutiva MAPK — variante", "Constitutive MAPK activation — variant"],
["Mama, endometrio, colon", "Breast, endometrium, colon"],
["Activación constitutiva PI3K — AKT/mTOR", "Constitutive PI3K activation — AKT/mTOR"],
["Mama, colon", "Breast, colon"],
["Activación constitutiva PI3K", "Constitutive PI3K activation"],
["Próstata, mama, endometrio", "Prostate, breast, endometrium"],
["Pérdida actividad fosfatasa — hiperactivación PI3K", "Loss of phosphatase activity — PI3K hyperactivation"],
["Síndrome Cowden, múltiple", "Cowden syndrome, multiple"],
["Pérdida actividad catalítica fosfatasa", "Loss of catalytic phosphatase activity"],
["Colon (FAP, esporádico)", "Colon (FAP, sporadic)"],
["Pérdida regulación Wnt/β-catenina", "Loss of Wnt/β-catenin regulation"],
["Pérdida regulación ciclo celular G1/S", "Loss of G1/S cell cycle regulation"],
["Melanoma, páncreas, pulmón", "Melanoma, pancreas, lung"],
["Pérdida inhibición CDK4/6", "Loss of CDK4/6 inhibition"],
["Melanoma, LMA, colon", "Melanoma, AML, colon"],
["Bloqueo actividad GTPasa NRAS", "Blocked NRAS GTPase activity"],
["Vejiga, cabeza y cuello", "Bladder, head and neck"],
["Bloqueo actividad GTPasa HRAS", "Blocked HRAS GTPase activity"],
["Mama HER2+ (20–30%)", "HER2+ breast (20–30%)"],
["Activación constitutiva HER2 — diana trastuzumab", "Constitutive HER2 activation — trastuzumab target"],
["Pulmón, renal, hepático", "Lung, renal, hepatic"],
["Activación constitutiva receptor MET", "Constitutive MET receptor activation"],
["Glioma, LMA", "Glioma, AML"],
["Neomorfismo enzimático — producción 2-HG", "Enzymatic neomorphism — 2-HG production"],
["LMA, colangiocarcinoma", "AML, cholangiocarcinoma"],
["Vejiga, mieloma múltiple", "Bladder, multiple myeloma"],
["Activación constitutiva FGFR3 — puente S–S", "Constitutive FGFR3 activation — S–S bridge"],
["Neuroblastoma, pulmón", "Neuroblastoma, lung"],
["Activación constitutiva ALK — diana crizotinib", "Constitutive ALK activation — crizotinib target"],
["Carcinoma renal, hemangioblastoma", "Renal carcinoma, hemangioblastoma"],
["Pérdida regulación HIF-1α — pseudohipoxia", "Loss of HIF-1α regulation — pseudohypoxia"],
["Pérdida señalización TGF-β/SMAD", "Loss of TGF-β/SMAD signaling"],
["Colon, hepático, endometrio", "Colon, hepatic, endometrium"],
["Activación constitutiva Wnt/β-catenina", "Constitutive Wnt/β-catenin activation"],
["— (sim, sin ΔFD real)", "— (sim, no real ΔFD)"],
["heredado v4", "inherited v4"],
["Pérdida de contacto con el ADN — GoF oncogénica", "Loss of DNA contact — oncogenic GoF"],
["Activación constitutiva PI3K → AKT/mTOR", "Constitutive PI3K activation → AKT/mTOR"],
["Disrupción del dominio RING (E3 ligasa)", "RING domain disruption (E3 ligase)"],
["nuevo", "new"],
["Alteración del dominio de unión a ADN (OB folds)", "Alteration of the DNA-binding domain (OB folds)"],
["Estudios funcionales", "Functional studies"],
["Activación constitutiva del dominio quinasa HER2", "Constitutive activation of the HER2 kinase domain"],
["LBD constitutivamente activo — resistencia a inhibidores de aromatasa", "Constitutively active LBD — resistance to aromatase inhibitors"],
["COSMIC / resistencia", "COSMIC / resistance"],
["Pérdida de actividad fosfatasa — hiperactivación PI3K", "Loss of phosphatase activity — PI3K hyperactivation"],
["Bloqueo del fosfodegrón Thr58 → estabilización de MYC", "Thr58 phosphodegron blocked → MYC stabilization"],
["Alteración de la degradación de ciclina D1 (región C-terminal)", "Altered cyclin D1 degradation (C-terminal region)"],
["Pérdida de unión a p16INK4a — CDK4 resistente a inhibición", "Loss of p16INK4a binding — inhibition-resistant CDK4"],
["ClinVar (melanoma/mama)", "ClinVar (melanoma/breast)"],
["Pérdida de unión a INK4 — progresión G1 desregulada", "Loss of INK4 binding — deregulated G1 progression"],
["Pérdida de contacto con E2F en el pocket A/B", "Loss of contact with E2F in the A/B pocket"],
["Pérdida de inhibición de CDK4/6", "Loss of CDK4/6 inhibition"],
["Activación constitutiva del asa de activación quinasa", "Constitutive activation of the kinase activation loop"],
["Desestabilización de la región FAT/PIKK — pérdida de señalización de daño", "Destabilization of the FAT/PIKK region — loss of damage signaling"],
["Desestabilización del dominio FHA — checkpoint atenuado", "Destabilization of the FHA domain — attenuated checkpoint"],
["Alteración del dominio WD40 — ensamblaje BRCA1-PALB2-BRCA2", "Alteration of the WD40 domain — BRCA1-PALB2-BRCA2 assembly"],
["Reclutamiento constitutivo a membrana vía dominio PH", "Constitutive membrane recruitment via the PH domain"],
["Activación del dominio quinasa (asa molecular)", "Activation of the kinase domain (molecular loop)"],
["Alteración de la región de dedos de zinc / unión a p53", "Alteration of the zinc-finger region / p53 binding"],
["Disrupción de repeticiones cadherina — pérdida de adhesión (carcinoma lobulillar)", "Disruption of cadherin repeats — loss of adhesion (lobular carcinoma)"],
["LBD promiscuo — respuesta a antiandrógenos/estrógenos (AR+ TNBC)", "Promiscuous LBD — response to antiandrogens/estrogens (AR+ TNBC)"],
["Bloqueo de la hidrólisis de GTP — MAPK/ERK constitutiva", "Blocked GTP hydrolysis — constitutive MAPK/ERK"],
["Bloqueo de la hidrólisis de GTP mediada por GAP", "Blocked GAP-mediated GTP hydrolysis"],
["Mimetiza la fosforilación activadora — MAPK constitutiva", "Mimics activating phosphorylation — constitutive MAPK"],
["Autofosforilación constitutiva del asa de activación", "Constitutive autophosphorylation of the activation loop"],
["Desestabilización de la NRR — liberación ligando-independiente de NICD", "NRR destabilization — ligand-independent NICD release"],
["Activación del dominio FAT — señalización de crecimiento constitutiva", "Activation of the FAT domain — constitutive growth signaling"],
["Alteración del dominio quinasa — pérdida de freno p38/JNK", "Alteration of the kinase domain — loss of the p38/JNK brake"],
["Alteración del dedo de zinc C-terminal — unión a ADN", "Alteration of the C-terminal zinc finger — DNA binding"],
["Alteración del dominio forkhead — reordenamiento de cromatina de ESR1", "Alteration of the forkhead domain — ESR1 chromatin reorganization"],
["Alteración de la región PHD/pre-SET — remodelación de cromatina", "Alteration of the PHD/pre-SET region — chromatin remodeling"],
["Splicing alternativo aberrante (3′ splice site críptico)", "Aberrant alternative splicing (cryptic 3′ splice site)"],
["DE", "SD"],
["y", "and"],
["o", "or"],
["Región (UniProt)", "Region (UniProt)"],
["🟢 PDB real", "🟢 real PDB"],
["▲ rugosidad", "▲ roughening"],
["▼ compactación", "▼ compaction"],
["Incierto", "Uncertain"],
["Benigno", "Benign"],
["Patogénico", "Pathogenic"],
["Prob. Benigno", "Likely Benign"],
["Prob. Patogénico", "Likely Pathogenic"],
["⬡ Benigna", "⬡ Benign"],
["⬡ Prob. Benigna", "⬡ Likely Benign"],
["⬡ Significado incierto", "⬡ Uncertain significance"],
["⬡ Prob. Patogénica", "⬡ Likely Pathogenic"],
["Cadena lineal / región desordenada. Solo Cα sin PDB (estimación).", "Linear chain / disordered region. Cα only, no PDB (estimate)."],
["Hélice α extendida o cadena con escasa rugosidad superficial.", "Extended α-helix or chain with little surface roughness."],
["Alta complejidad fractal. Superficie muy rugosa o dominio multifuncional.", "High fractal complexity. Very rough surface or multifunctional domain."],
["Cadena casi lineal — proteína muy pequeña o IDP.", "Almost linear chain — very small protein or IDP."],
["Estructura compacta local — láminas β o dominios pequeños.", "Locally compact structure — β-sheets or small domains."],
["Proteína globular típica — empaquetamiento 3D sólido.", "Typical globular protein — solid 3D packing."],
["Alta compacidad fractal — proteína grande o estructura muy densa.", "High fractal compactness — large protein or very dense structure."],
["El ajuste log-log no convergio dentro del rango teorico. No se reporta un valor: revisa que la estructura cargada tenga suficientes atomos y que la nube de puntos de superficie sea representativa.", "The log-log fit did not converge within the theoretical range. No value is reported: check that the loaded structure has enough atoms and that the surface point cloud is representative."],
["Cambio mínimo, alta tolerabilidad evolutiva y baja complejidad fractal.", "Minimal change, high evolutionary tolerance and low fractal complexity."],
["Cambio estructural leve, FD estable, probablemente tolerable.", "Mild structural change, stable FD, probably tolerable."],
["Evidencia mixta — ΔFD moderado. Se recomienda validación funcional.", "Mixed evidence — moderate ΔFD. Functional validation is recommended."],
["ΔΔG elevado o ΔFD significativo — posiblemente dañina.", "High ΔΔG or significant ΔFD — possibly damaging."],
["Aumento de rugosidad superficial (ΔFD>0) — hipotesis: posible exposicion de nucleo hidrofobico, no validada.", "Increased surface roughness (ΔFD>0) — hypothesis: possible exposure of the hydrophobic core, not validated."],
["Compactación local (ΔFD<0) — hipotesis: posible perdida de flexibilidad funcional, no validada.", "Local compaction (ΔFD<0) — hypothesis: possible loss of functional flexibility, not validated."],
["Esfera con muy pocos átomos (<15) — sube el radio o verifica el PDB.", "Sphere with very few atoms (<15) — increase the radius or check the PDB."],
["FD sube → más rugosidad/exposición en el microentorno → coherente con desestabilización local.", "FD rises → more roughness/exposure in the microenvironment → consistent with local destabilization."],
["FD baja → compactación local del microentorno → posible efecto estabilizante.", "FD drops → local compaction of the microenvironment → possible stabilizing effect."],
["Cambio leve en el microentorno — mutación probablemente no catastrófica a nivel local.", "Mild change in the microenvironment — mutation probably not catastrophic at the local level."],
["Secuencia WT vacía", "Empty WT sequence"],
["Caracteres inválidos en la secuencia", "Invalid characters in the sequence"],
["Corre un análisis primero.", "Run an analysis first."],
["El FD local espacial necesita los PDB reales de WT y MUT cargados en \"Importar ColabFold\".", "Spatial local FD needs the real WT and MUT PDBs loaded in \"Import ColabFold\"."],
["Ingresa un código PDB", "Enter a PDB code"],
["Ingresa el número de residuo (resi) a resaltar en el PDB cargado.", "Enter the residue number (resi) to highlight in the loaded PDB."],
["Formato inválido. Ej: D10L", "Invalid format. E.g. D10L"],
["JSON inválido", "Invalid JSON"],
["PDB inválido o sin átomos ATOM. Verifica el archivo.", "Invalid PDB or no ATOM atoms. Check the file."],
["Extrayendo pLDDT + calculando dimensión fractal v4…", "Extracting pLDDT + computing fractal dimension v4…"],
["ℹ️ Sin JSON de ColabFold: pLDDT/ΔΔG son aproximados. FD_bc, FD_mr (global y local) y RMSD/SASA (si subiste los CSV) sí usan el PDB real cargado.", "ℹ️ No ColabFold JSON: pLDDT/ΔΔG are approximate. FD_bc, FD_mr (global and local) and RMSD/SASA (if you uploaded the CSVs) do use the real loaded PDB."],
["⚠️ No se detectó una mutación puntual clara comparando las cadenas de los dos PDB (son idénticas en todas, o difieren en más de 5 posiciones). Se autocompletó la secuencia WT con la cadena más larga; agrega la mutación manualmente si la conoces.", "⚠️ No clear point mutation was detected when comparing the chains of the two PDBs (they are identical in all chains, or differ in more than 5 positions). The WT sequence was auto-filled with the longest chain; add the mutation manually if you know it."],
["¿Eliminar todos los resultados reales guardados y volver a los estimados?", "Delete all saved real results and return to the estimates?"],
["FD_bc local WT", "Local FD_bc WT"],
["FD_bc local MUT", "Local FD_bc MUT"],
["ΔFD_bc local", "Local ΔFD_bc"],
["FD_mr local WT → MUT", "Local FD_mr WT → MUT"],
["Importa el ZIP de ColabFold en", "Import the ColabFold ZIP in"],
["Importar ColabFold", "Import ColabFold"],
["para visualizar la estructura 3D predicha por AlphaFold2.", "to view the 3D structure predicted by AlphaFold2."],
["RMSD calculado:", "Computed RMSD:"],
["Estructura de referencia sugerida:", "Suggested reference structure:"],
["Modela la ventana en ColabFold e impórtala en", "Model the window in ColabFold and import it in"],
["para visualizar WT vs MUT.", "to view WT vs MUT."],
["Pulmón", "Lung"],
["Colorrectal", "Colorectal"],
["Mama", "Breast"],
["Leucemia", "Leukemia"],
["Páncreas", "Pancreas"],
["Ovario", "Ovary"],
["Próstata", "Prostate"],
["Tiroides", "Thyroid"],
["Endometrio", "Endometrium"],
["Estómago", "Stomach"],
["Pulmón microcítico", "Small cell lung"],
["Cabeza y cuello", "Head and neck"],
["Leucemia mieloide aguda", "Acute myeloid leukemia"],
["Vejiga", "Bladder"],
["Mama HER2+", "HER2+ breast"],
["Gástrico", "Gastric"],
["Hepático", "Hepatic"],
["Colangiocarcinoma", "Cholangiocarcinoma"],
["Mieloma múltiple", "Multiple myeloma"],
["Cuello uterino", "Cervix"],
["Linfoma anaplásico", "Anaplastic lymphoma"],
["Carcinoma renal", "Renal carcinoma"],
["Feocromocitoma", "Pheochromocytoma"],
["Cadherina-1 (E-cadherina)", "Cadherin-1 (E-cadherin)"],
["Ciclina D1", "Cyclin D1"],
["Factor de crecimiento endotelial vascular A", "Vascular endothelial growth factor A"],
["Factor de transcripción Forkhead Box A1", "Forkhead Box A1 transcription factor"],
["Factor de transcripción GATA-3", "GATA-3 transcription factor"],
["Fosfatasa y homólogo de tensina", "Phosphatase and tensin homolog"],
["GTPasa KRAS", "KRAS GTPase"],
["GTPasa NRAS", "NRAS GTPase"],
["Histona metiltransferasa MLL3", "MLL3 histone methyltransferase"],
["Inhibidor de CDK p16INK4a", "CDK inhibitor p16INK4a"],
["Parálogo D de RAD51", "RAD51 paralog D"],
["Proteína 1 con dominio RING asociada a BRCA1", "BRCA1-associated RING domain protein 1"],
["Proteína 1 de susceptibilidad a cáncer de mama", "Breast cancer type 1 susceptibility protein"],
["Proteína 2 de susceptibilidad a cáncer de mama", "Breast cancer type 2 susceptibility protein"],
["Proteína del retinoblastoma (pRB)", "Retinoblastoma protein (pRB)"],
["Proteína supresora tumoral p53", "Tumor suppressor protein p53"],
["Proto-oncogén factor de transcripción MYC", "MYC proto-oncogene transcription factor"],
["Quinasa Janus 2", "Janus kinase 2"],
["Quinasa MAP3K1 (MEKK1)", "MAP3K1 kinase (MEKK1)"],
["Quinasa checkpoint 2", "Checkpoint kinase 2"],
["Quinasa dependiente de ciclina 4", "Cyclin-dependent kinase 4"],
["Quinasa dependiente de ciclina 6", "Cyclin-dependent kinase 6"],
["Receptor de andrógenos", "Androgen receptor"],
["Receptor de estrógeno α (ERα)", "Estrogen receptor α (ERα)"],
["Receptor del factor de crecimiento de fibroblastos 1", "Fibroblast growth factor receptor 1"],
["Receptor del factor de crecimiento epidérmico", "Epidermal growth factor receptor"],
["Receptor del factor de crecimiento hepatocítico", "Hepatocyte growth factor receptor"],
["Receptor neurogénico Notch 1", "Neurogenic locus Notch homolog 1"],
["Receptor tirosina quinasa ErbB-2 (HER2)", "Receptor tyrosine-protein kinase ErbB-2 (HER2)"],
["Regulador de apoptosis BCL-2", "Apoptosis regulator BCL-2"],
["Serina/treonina quinasa 11 (LKB1)", "Serine/threonine kinase 11 (LKB1)"],
["Serina/treonina quinasa AKT1", "Serine/threonine kinase AKT1"],
["Serina/treonina quinasa ATM", "Serine/threonine kinase ATM"],
["Serina/treonina quinasa B-Raf", "Serine/threonine kinase B-Raf"],
["Serina/treonina quinasa mTOR", "Serine/threonine kinase mTOR"],
["Socio y localizador de BRCA2", "Partner and localizer of BRCA2"],
["Subunidad 1 del factor de splicing 3b", "Splicing factor 3b subunit 1"],
["Subunidad catalítica α de PI3K (p110α)", "PI3K catalytic subunit α (p110α)"],
["Transductor de señal y activador de la transcripción 3", "Signal transducer and activator of transcription 3"],
["Ubiquitina-ligasa E3 MDM2", "E3 ubiquitin ligase MDM2"]
]);

const norm = s => s.replace(/\s+/g, ' ').trim();

// Traduce un fragmento si se conoce; si no, lo deja igual.
function trAny(s){ const n = norm(s); const t = tr(n); return t == null ? s : t; }
function trList(s, sep){ return s.split(sep).map(trAny).join(sep); }

const PATTERNS = [
  [/^Analizando: (.+)$/, m => `Analyzing: ${m[1]}`],
  [/^(.+) cargado — presiona ⚡ Analizar para continuar \(modo simulado, sin PDB real\)$/,
    m => `${m[1]} loaded — press ⚡ Analyze to continue (simulated mode, no real PDB)`],
  [/^No se ejecuto el analisis — (\d+) problema\(s\) con las mutaciones:(.*)$/,
    m => `Analysis not run — ${m[1]} problem(s) with the mutations:` + (m[2] ? trList(m[2], ' • ') : '')],
  [/^(• )?"(.+?)": formato no reconocido \(se espera p\.ej\. E6V\)\.$/,
    m => `${m[1]||''}"${m[2]}": unrecognized format (expected e.g. E6V).`],
  [/^(• )?"(.+?)": la posicion (\d+) esta fuera de la secuencia cargada \(1–(\d+)\)\. Carga la secuencia canonica completa de UniProt para esta proteina\.$/,
    m => `${m[1]||''}"${m[2]}": position ${m[3]} is outside the loaded sequence (1–${m[4]}). Load the full canonical UniProt sequence for this protein.`],
  [/^(• )?"(.+?)": en la posicion (\d+) la secuencia cargada tiene (\S+), no (\S+)\. Revisa que la secuencia y la numeracion correspondan a la misma isoforma\.$/,
    m => `${m[1]||''}"${m[2]}": at position ${m[3]} the loaded sequence has ${m[4]}, not ${m[5]}. Check that the sequence and the numbering correspond to the same isoform.`],
  [/^UniProt: (\S+) · PDB: (\S+) · Cánceres: (.+)$/,
    m => `UniProt: ${m[1]} · PDB: ${m[2]} · Cancers: ${trList(m[3], ', ')}`],
  [/^⚠ ajuste no valido — (.*) \(R²=(.*), n=(.*), pendiente cruda=(.*)\)$/,
    m => `⚠ invalid fit — ${m[1].replace(/pocos puntos de escala/g,'too few scale points').replace(/R² bajo/g,'low R²').replace(/pendiente (\S+) fuera de/g,'slope $1 outside')} (R²=${m[2]}, n=${m[3]}, raw slope=${m[4]})`],
  [/^Mutación (.+) — esfera r=(\S+)Å \((\d+) át\. WT \/ (\d+) át\. MUT\)$/,
    m => `Mutation ${m[1]} — sphere r=${m[2]}Å (${m[3]} WT atoms / ${m[4]} MUT atoms)`],
  [/^✅ Mutación detectada automáticamente en cadena (.+?): (.+)\. Secuencia WT autocompletada desde el PDB\. Verifica que sea lo que esperabas antes de analizar\.$/,
    m => `✅ Mutation detected automatically in chain ${m[1]}: ${m[2]}. WT sequence auto-filled from the PDB. Check that it is what you expected before analyzing.`],
  [/^⚠️ No se encontraron atomos de la cadena "(.*)" en el PDB cargado\. El analisis local se hizo sobre TODAS las cadenas, no solo la mutada — los valores por residuo pueden no corresponder a la cadena esperada\.$/,
    m => `⚠️ No atoms were found for chain "${m[1]}" in the loaded PDB. The local analysis was run on ALL chains, not only the mutated one — per-residue values may not correspond to the expected chain.`],
  [/^ℹ️ Estructura grande \((\d+) átomos pesados\)\. El cálculo de superficie puede tardar y la interfaz quedará bloqueada mientras corre; la densidad de sondeo se reduce automáticamente para acotar el tiempo\.$/,
    m => `ℹ️ Large structure (${m[1]} heavy atoms). The surface calculation may take a while and the interface will be blocked while it runs; the probe density is reduced automatically to bound the time.`],
  [/^Bloque B — (.+): ingresa la secuencia WT de UniProt y ejecuta el análisis\.$/,
    m => `Block B — ${m[1]}: enter the WT sequence from UniProt and run the analysis.`],
  [/^(.+) — heredado de la validación v4 \(Tabla 17\)\. Secuencia cargada; ejecuta el análisis para reproducir\.$/,
    m => `${m[1]} — inherited from the v4 validation (Table 17). Sequence loaded; run the analysis to reproduce it.`],
  [/^Descargando (\S+) de UniProt…$/, m => `Downloading ${m[1]} from UniProt…`],
  [/^⚠ (.+): se esperaba (\S+) en la posición (\d+) pero UniProt (\S+) tiene (\S+)\. Revisa la isoforma canónica antes de modelar\.$/,
    m => `⚠ ${m[1]}: expected ${m[2]} at position ${m[3]} but UniProt ${m[4]} has ${m[5]}. Check the canonical isoform before modeling.`],
  [/^(.+) → aplicada como (\S+) sobre (.+)\. Longitud (\d+) aa\. Ejecuta el análisis \(modo simulado, sin PDB real\)\.$/,
    m => `${m[1]} → applied as ${m[2]} on ${m[3].replace(/^secuencia completa$/,'the full sequence').replace(/^ventana /,'window ')}. Length ${m[4]} aa. Run the analysis (simulated mode, no real PDB).`],
  [/^Error al traer la secuencia: (.*)\. Carga la secuencia WT manualmente\.$/,
    m => `Error fetching the sequence: ${m[1]}. Load the WT sequence manually.`],
  [/^Mutación no reconocida: (.*)$/, m => `Unrecognized mutation: ${m[1]}`],
  [/^Sin metadatos para (.*)$/, m => `No metadata for ${m[1]}`],
  [/^Matriz de confusión \(umbral (\S+)\): VP=(\d+) FN=(\d+) FP=(\d+) VN=(\d+) · simulación determinista$/,
    m => `Confusion matrix (threshold ${m[1]}): TP=${m[2]} FN=${m[3]} FP=${m[4]} TN=${m[5]} · deterministic simulation`],
  [/^(.+? )\((\d+) átomos\)$/, m => `${m[1]}(${m[2]} atoms)`],
  [/^(.+?\.) (Aumento de rugosidad superficial.*|Compactación local.*)$/,
    m => `${trAny(m[1])} ${trAny(m[2])}`],
  [/^(\d+(?:–\d+)?)% riesgo$/, m => `${m[1]}% risk`],
  [/^(\d+(?:–\d+)?)% adultos$/, m => `${m[1]}% adults`],
];

// "Etiqueta: valor" y "Texto (paréntesis)" con partes conocidas.
function paren(p){
  const m = p.match(/^(.+?) \(([^()]+)\)$/); if(!m) return null;
  const a = DICT.get(m[1]), b = DICT.get(m[2]) ?? patternOnly(m[2]);
  if(a == null && b == null) return null;
  return `${a ?? m[1]} (${b ?? m[2]})`;
}
function labelValue(p){
  const m = p.match(/^([^:]{2,40}): (.+)$/); if(!m) return paren(p);
  const a = DICT.get(m[1]), b = DICT.get(m[2]) ?? paren(m[2]);
  if(a == null && b == null) return null;
  return `${a ?? m[1]}: ${b ?? m[2]}`;
}
function patternOnly(s){
  for(const [re, fn] of PATTERNS){ const m = s.match(re); if(m) return fn(m); }
  return null;
}
// Último recurso: texto compuesto por piezas conocidas ("Supresor tumoral · Múltiple (~50%)").
function segments(s){
  const parts = s.split(/( · | — | – |, |; | → )/);
  if(parts.length < 2) return labelValue(s);
  let changed = false;
  const out = parts.map((p, i) => {
    if(i % 2) return p;
    const t = DICT.get(p) ?? labelValue(p);
    if(t != null){ changed = true; return t; }
    return p;
  });
  return changed ? out.join('') : null;
}
function tr(s){
  if(!s) return null;
  const v = DICT.get(s); if(v !== undefined) return v;
  return patternOnly(s) ?? segments(s);
}
// Mensajes con saltos de línea (alertas): se traduce línea por línea.
function trText(raw){
  const t = tr(norm(raw));
  if(t != null) return t;
  if(raw.includes('\n')){
    let changed = false;
    const out = raw.split('\n').map(line => {
      const n = norm(line); if(!n) return line;
      const x = tr(n); if(x == null) return line;
      changed = true;
      return line.match(/^\s*/)[0] + x + line.match(/\s*$/)[0];
    }).join('\n');
    return changed ? out : null;
  }
  return null;
}

let lang = 'es';
try { if(localStorage.getItem(STORE_KEY) === 'en') lang = 'en'; } catch(e) {}

const HAS_LETTERS = /[A-Za-zÁÉÍÓÚáéíóúÑñ]/;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'CODE']);
const ATTRS = ['placeholder', 'title', 'aria-label'];
const textRec = new WeakMap();   // nodo de texto → {es, en}
const attrRec = new WeakMap();   // elemento → {attr: {es, en}}

function skipped(el){
  for(let e = el; e; e = e.parentElement){
    if(SKIP_TAGS.has(e.tagName) || (e.hasAttribute && e.hasAttribute('data-i18n-skip'))) return true;
  }
  return false;
}

function applyText(node){
  const cur = node.data;
  let rec = textRec.get(node);
  if(!rec || (cur !== rec.en && cur !== rec.es)){
    // nodo nuevo o la app cambió su contenido: el texto actual es el original
    if(!HAS_LETTERS.test(cur)){ textRec.delete(node); return; }
    if(lang === 'es'){ textRec.delete(node); return; }
    const t = trText(cur);
    if(t == null){ textRec.delete(node); return; }
    const full = t.includes('\n') ? t : cur.match(/^\s*/)[0] + t + cur.match(/\s*$/)[0];
    if(full === cur){ textRec.delete(node); return; }
    rec = { es: cur, en: full };
    textRec.set(node, rec);
  }
  const want = lang === 'en' ? rec.en : rec.es;
  if(node.data !== want) node.data = want;
}

function applyAttrs(el){
  let recs = attrRec.get(el);
  for(const a of ATTRS){
    if(!el.hasAttribute(a)) continue;
    const cur = el.getAttribute(a);
    let r = recs && recs[a];
    if(!r || (cur !== r.en && cur !== r.es)){
      if(lang === 'es' || !HAS_LETTERS.test(cur)){ if(r) delete recs[a]; continue; }
      const t = tr(norm(cur));
      if(t == null || t === cur){ if(r) delete recs[a]; continue; }
      r = { es: cur, en: t };
      if(!recs){ recs = {}; attrRec.set(el, recs); }
      recs[a] = r;
    }
    const want = lang === 'en' ? r.en : r.es;
    if(cur !== want) el.setAttribute(a, want);
  }
}

function translateTree(root){
  if(!root) return;
  if(root.nodeType === 3){ if(!skipped(root.parentElement)) applyText(root); return; }
  if(root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
  if(root.nodeType === 1 && skipped(root)){ if(root.tagName === 'TEXTAREA' && !root.closest('[data-i18n-skip]')) applyAttrs(root); return; }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(n){
      if(n.nodeType !== 1) return NodeFilter.FILTER_ACCEPT;
      if(n.hasAttribute('data-i18n-skip')) return NodeFilter.FILTER_REJECT;
      // TEXTAREA: su contenido es dato del usuario, pero su placeholder sí se traduce
      if(SKIP_TAGS.has(n.tagName)){ if(n.tagName === 'TEXTAREA') applyAttrs(n); return NodeFilter.FILTER_REJECT; }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  if(root.nodeType === 1) applyAttrs(root);
  let n;
  while((n = walker.nextNode())){
    if(n.nodeType === 3) applyText(n); else applyAttrs(n);
  }
}

let observer = null;
function observe(){
  if(observer) return;
  observer = new MutationObserver(muts => {
    if(lang !== 'en') return;
    for(const m of muts){
      if(m.type === 'characterData'){ if(!skipped(m.target.parentElement)) applyText(m.target); }
      else if(m.type === 'attributes'){ if(!m.target.closest('[data-i18n-skip]')) applyAttrs(m.target); }
      else m.addedNodes.forEach(translateTree);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
}

// alert()/confirm() con el mismo diccionario.
const nativeAlert = window.alert.bind(window);
const nativeConfirm = window.confirm.bind(window);
window.alert = msg => nativeAlert(lang === 'en' && typeof msg === 'string' ? (trText(msg) ?? msg) : msg);
window.confirm = msg => nativeConfirm(lang === 'en' && typeof msg === 'string' ? (trText(msg) ?? msg) : msg);

function renderSwitch(){
  document.querySelectorAll('.pd-lang-switch button').forEach(b => {
    const on = b.dataset.lang === lang;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function setLang(next){
  if(next !== 'es' && next !== 'en') return;
  lang = next;
  try { localStorage.setItem(STORE_KEY, lang); } catch(e) {}
  document.documentElement.lang = lang;
  translateTree(document.body);
  renderSwitch();
  document.dispatchEvent(new CustomEvent('pd:langchange', {detail: {lang}}));
}

function buildSwitch(){
  const style = document.createElement('style');
  style.textContent = `
.pd-lang-switch{position:fixed;top:.75rem;right:.75rem;z-index:100000;display:flex;align-items:center;
  background:rgba(8,13,24,.92);border:1px solid var(--bord2,#162040);border-radius:999px;padding:3px;gap:2px;
  font-family:var(--mono,'JetBrains Mono',monospace);font-size:.62rem;box-shadow:0 4px 16px rgba(0,0,0,.35)}
.pd-lang-switch button{all:unset;cursor:pointer;padding:.28rem .62rem;border-radius:999px;color:var(--muted,#4a6080);
  font-weight:700;letter-spacing:.06em;transition:background .15s,color .15s}
.pd-lang-switch button:hover{color:var(--text,#c8d8f0)}
.pd-lang-switch button.on{background:var(--cyan,#00f5d4);color:#04121a}
.pd-lang-switch button:focus-visible{outline:2px solid var(--cyan,#00f5d4);outline-offset:2px}
@media (max-width:600px){.pd-lang-switch{top:.5rem;right:.5rem}}`;
  document.head.appendChild(style);
  const box = document.createElement('div');
  box.className = 'pd-lang-switch';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', 'Idioma / Language');
  box.setAttribute('data-i18n-skip', '');
  box.innerHTML = '<button type="button" data-lang="es" title="Español">ES</button><button type="button" data-lang="en" title="English">EN</button>';
  box.addEventListener('click', e => { const b = e.target.closest('button'); if(b) setLang(b.dataset.lang); });
  document.body.appendChild(box);
}

function init(){
  buildSwitch();
  observe();
  setLang(lang);
}

window.pdSetLang = setLang;
window.pdTr = s => (lang === 'en' ? (trText(String(s)) ?? s) : s);

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();
