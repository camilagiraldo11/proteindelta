"""
FractEngine v2 — Corrected Fractal Dimension Algorithm
ProteinDelta v4.1 | María Camila Giraldo Rodríguez | Univalle EISC 2024

Fixes from v1:
  - v1 used 9-residue Cα-only windows → always FD_bc ≈ 1.000 (linear chain)
  - v2 uses ALL heavy atoms (backbone + side chains) for global FD_bc
  - v2 local FD uses 21-residue windows with all atoms in window
  - Results now fall in theoretical range [2.0, 2.6] for globular proteins
"""

import numpy as np
from Bio.PDB import PDBParser, MMCIFParser
import warnings
warnings.filterwarnings('ignore')

# ─── Utility: extract coordinates ─────────────────────────────────────────────

def get_all_heavy_atoms(structure, chain_id=None):
    """
    Extract XYZ coordinates of ALL heavy atoms (non-hydrogen) from a structure.
    If chain_id is specified, restrict to that chain.
    Returns numpy array of shape (N, 3).
    """
    coords = []
    for model in structure:
        for chain in model:
            if chain_id and chain.id != chain_id:
                continue
            for residue in chain:
                # Skip HETATM (water, ligands) — keep only standard residues
                if residue.id[0] != ' ':
                    continue
                for atom in residue:
                    # Exclude hydrogen atoms (H, D)
                    if atom.element not in ('H', 'D') and atom.element is not None:
                        coords.append(atom.coord)
                    elif atom.element is None and not atom.name.startswith('H'):
                        coords.append(atom.coord)
        break  # Use first model only
    return np.array(coords)

def get_ca_atoms(structure, chain_id=None):
    """Extract only Cα coordinates — used for Mass-Radius (FD_mr)."""
    coords = []
    for model in structure:
        for chain in model:
            if chain_id and chain.id != chain_id:
                continue
            for residue in chain:
                if residue.id[0] != ' ':
                    continue
                if 'CA' in residue:
                    coords.append(residue['CA'].coord)
        break
    return np.array(coords)

def get_atoms_by_residue_window(structure, center_res_idx, window=21, chain_id=None):
    """
    Extract all heavy atoms within a residue window of size `window`
    centered at `center_res_idx`. Used for local FD_bc.
    """
    residues = []
    for model in structure:
        for chain in model:
            if chain_id and chain.id != chain_id:
                continue
            for residue in chain:
                if residue.id[0] == ' ':
                    residues.append(residue)
        break
    
    half = window // 2
    start = max(0, center_res_idx - half)
    end = min(len(residues), center_res_idx + half + 1)
    
    coords = []
    for residue in residues[start:end]:
        for atom in residue:
            if atom.element not in ('H', 'D') and atom.element is not None:
                coords.append(atom.coord)
            elif atom.element is None and not atom.name.startswith('H'):
                coords.append(atom.coord)
    return np.array(coords)

# ─── Box-Counting (FD_bc) ─────────────────────────────────────────────────────

def box_counting_global(coords, n_scales=8):
    """
    Global Box-Counting fractal dimension.
    Divides 3D bounding box into grids of decreasing side ε,
    counts occupied boxes N(ε), fits OLS slope of log N vs log(1/ε).
    
    Uses ALL heavy atoms → values in [2.0, 2.6] for globular proteins.
    
    Parameters
    ----------
    coords : np.ndarray, shape (N, 3)
        3D coordinates of all heavy atoms.
    n_scales : int
        Number of box sizes to use (more = more accurate OLS).
    
    Returns
    -------
    fd_bc : float
        Fractal dimension via Box-Counting, clamped to [1.0, 3.0].
    r2 : float
        R² of the OLS fit (quality indicator).
    """
    if len(coords) < 10:
        return 1.5, 0.0
    
    mins = coords.min(axis=0)
    maxs = coords.max(axis=0)
    ranges = maxs - mins
    max_range = max(ranges)
    
    if max_range < 1e-6:
        return 1.5, 0.0

    n_atoms = len(coords)

    # FIX (auditoria post-entrega, validacion sobre PDB reales): el rango
    # original bajaba hasta max_range/256, muy por debajo de la distancia
    # interatomica real (~1.2-1.5 A de enlace covalente). A esas escalas cada
    # atomo cae en su propia caja: N(eps) se satura en n_atoms y la pendiente
    # OLS se diluye hacia ~1.0 — el mismo fallo degenerado de v1 (FD_bc=1.000
    # en todos los casos), mezclado silenciosamente con las escalas validas al
    # promediarlas en un solo ajuste. Confirmado corriendo v2 sobre PDB reales
    # (lisozima 1LZ1, hemoglobina, SOD1): FD_bc = 1.000 en los 6 pares, pese a
    # que v2 si funciona sobre las estructuras sinteticas de la Seccion 7.4.6.2.
    # Ahora se descartan las escalas donde N(eps) satura por encima del 90% de
    # n_atoms, en vez de fijar un piso arbitrario en Angstroms que no se adapta
    # al tamano/densidad de cada proteina.
    SATURATION_FRACTION = 0.9

    # Geometric sequence of box sizes from max_range/4 to max_range/256
    log_eps = np.linspace(np.log(max_range / 4), np.log(max_range / 256), n_scales)
    epsilons = np.exp(log_eps)

    log_one_over_eps = []
    log_N = []

    for eps in epsilons:
        if eps < 0.01:
            break
        # Assign each atom to a box
        box_indices = np.floor((coords - mins) / eps).astype(int)
        box_set = set(map(tuple, box_indices))
        N = len(box_set)
        if N > 1 and N <= SATURATION_FRACTION * n_atoms:
            log_one_over_eps.append(np.log(1.0 / eps))
            log_N.append(np.log(N))
    
    if len(log_one_over_eps) < 3:
        return 1.5, 0.0
    
    # OLS regression: slope = FD_bc
    x = np.array(log_one_over_eps)
    y = np.array(log_N)
    n = len(x)
    sx, sy = x.sum(), y.sum()
    sxx = (x**2).sum()
    sxy = (x * y).sum()
    denom = n * sxx - sx**2
    if abs(denom) < 1e-12:
        return 1.5, 0.0
    
    slope = (n * sxy - sx * sy) / denom
    intercept = (sy - slope * sx) / n
    
    # R² quality
    y_pred = slope * x + intercept
    ss_res = ((y - y_pred)**2).sum()
    ss_tot = ((y - y.mean())**2).sum()
    r2 = 1 - ss_res / ss_tot if ss_tot > 1e-12 else 0.0
    
    fd_bc = float(np.clip(slope, 1.0, 3.0))
    return fd_bc, float(r2)

# ─── Mass-Radius (FD_mr) ──────────────────────────────────────────────────────

def mass_radius(coords, n_radii=10):
    """
    Mass-Radius fractal dimension using Cα atoms.
    Counts M(r) atoms within sphere of radius r from centroid,
    fits OLS slope of log M vs log r.
    
    Parameters
    ----------
    coords : np.ndarray, shape (N, 3)  — Cα coordinates.
    n_radii : int  — number of radius samples.
    
    Returns
    -------
    fd_mr : float
    """
    if len(coords) < 4:
        return 1.8
    
    centroid = coords.mean(axis=0)
    dists = np.linalg.norm(coords - centroid, axis=1)
    dists_sorted = np.sort(dists)
    max_d = dists_sorted[-1]
    
    if max_d < 1e-6:
        return 1.8
    
    radii = np.linspace(max_d * 0.05, max_d * 0.95, n_radii)
    log_r, log_m = [], []
    
    for r in radii:
        M = (dists <= r).sum()
        if M >= 2:
            log_r.append(np.log(r))
            log_m.append(np.log(M))
    
    if len(log_r) < 3:
        return 1.8
    
    x, y = np.array(log_r), np.array(log_m)
    n = len(x)
    sx, sy = x.sum(), y.sum()
    sxx, sxy = (x**2).sum(), (x * y).sum()
    denom = n * sxx - sx**2
    if abs(denom) < 1e-12:
        return 1.8
    
    slope = (n * sxy - sx * sy) / denom
    return float(np.clip(slope, 1.0, 3.0))

# ─── Local FD by sliding window ───────────────────────────────────────────────

def local_fd_bc(structure, window=21, chain_id=None):
    """
    Compute local FD_bc per residue using a sliding window of `window` residues.
    Each window uses ALL heavy atoms (backbone + side chains).
    Window of 21 residues ≈ 160-200 heavy atoms → reliable FD estimate.
    
    Returns list of (residue_index, fd_bc) tuples.
    """
    residues = []
    for model in structure:
        for chain in model:
            if chain_id and chain.id != chain_id:
                continue
            for residue in chain:
                if residue.id[0] == ' ':
                    residues.append(residue)
        break
    
    results = []
    half = window // 2
    
    for i in range(len(residues)):
        start = max(0, i - half)
        end = min(len(residues), i + half + 1)
        
        window_coords = []
        for residue in residues[start:end]:
            for atom in residue:
                if atom.element not in ('H', 'D') and atom.element is not None:
                    window_coords.append(atom.coord)
                elif atom.element is None and not atom.name.startswith('H'):
                    window_coords.append(atom.coord)
        
        if len(window_coords) >= 10:
            fd, r2 = box_counting_global(np.array(window_coords), n_scales=6)
        else:
            fd = 1.5
        
        results.append((i, fd))
    
    return results

# ─── Main analysis function ────────────────────────────────────────────────────

def analyze_wt_vs_mut(wt_pdb_path, mut_pdb_path, chain_id='A'):
    """
    Full FD analysis comparing WT vs MUT protein structures.
    
    Returns dict with:
      - fd_bc_wt, fd_bc_mut, delta_fd_bc : global Box-Counting values
      - fd_mr_wt, fd_mr_mut              : global Mass-Radius values
      - local_fd_bc_wt, local_fd_bc_mut  : per-residue FD_bc lists
      - delta_local_fd_bc                : per-residue ΔFD_bc
      - r2_wt, r2_mut                    : OLS quality indicators
    """
    parser = PDBParser(QUIET=True)
    
    wt_struct  = parser.get_structure('WT',  wt_pdb_path)
    mut_struct = parser.get_structure('MUT', mut_pdb_path)
    
    # Global FD — all heavy atoms
    wt_coords  = get_all_heavy_atoms(wt_struct,  chain_id)
    mut_coords = get_all_heavy_atoms(mut_struct, chain_id)
    
    fd_bc_wt,  r2_wt  = box_counting_global(wt_coords)
    fd_bc_mut, r2_mut = box_counting_global(mut_coords)
    
    # Global FD_mr — Cα only
    ca_wt  = get_ca_atoms(wt_struct,  chain_id)
    ca_mut = get_ca_atoms(mut_struct, chain_id)
    
    fd_mr_wt  = mass_radius(ca_wt)
    fd_mr_mut = mass_radius(ca_mut)
    
    # Local FD_bc per residue
    local_wt  = local_fd_bc(wt_struct,  chain_id=chain_id)
    local_mut = local_fd_bc(mut_struct, chain_id=chain_id)
    
    # ΔFD_bc per residue (align by index)
    min_len = min(len(local_wt), len(local_mut))
    delta_local = [(local_mut[i][1] - local_wt[i][1]) for i in range(min_len)]
    
    return {
        'fd_bc_wt':        fd_bc_wt,
        'fd_bc_mut':       fd_bc_mut,
        'delta_fd_bc':     fd_bc_mut - fd_bc_wt,
        'fd_mr_wt':        fd_mr_wt,
        'fd_mr_mut':       fd_mr_mut,
        'delta_fd_mr':     fd_mr_mut - fd_mr_wt,
        'r2_wt':           r2_wt,
        'r2_mut':          r2_mut,
        'n_atoms_wt':      len(wt_coords),
        'n_atoms_mut':     len(mut_coords),
        'local_fd_bc_wt':  [v for _, v in local_wt],
        'local_fd_bc_mut': [v for _, v in local_mut],
        'delta_local_fd_bc': delta_local,
    }

if __name__ == '__main__':
    import sys, os, json
    if len(sys.argv) < 3:
        print("Usage: python fract_engine_v2.py WT.pdb MUT.pdb [chain_id]")
        sys.exit(1)
    
    chain = sys.argv[3] if len(sys.argv) > 3 else 'A'
    result = analyze_wt_vs_mut(sys.argv[1], sys.argv[2], chain_id=chain)
    
    print(f"\n{'='*55}")
    print(f"  FractEngine v2 — All Heavy Atoms Box-Counting")
    print(f"{'='*55}")
    print(f"  Atoms WT  : {result['n_atoms_wt']:,} heavy atoms")
    print(f"  Atoms MUT : {result['n_atoms_mut']:,} heavy atoms")
    print(f"  FD_bc  WT  = {result['fd_bc_wt']:.4f}  (R²={result['r2_wt']:.4f})")
    print(f"  FD_bc  MUT = {result['fd_bc_mut']:.4f}  (R²={result['r2_mut']:.4f})")
    print(f"  ΔFD_bc     = {result['delta_fd_bc']:+.4f}")
    print(f"  FD_mr  WT  = {result['fd_mr_wt']:.4f}")
    print(f"  FD_mr  MUT = {result['fd_mr_mut']:.4f}")
    print(f"  ΔFD_mr     = {result['delta_fd_mr']:+.4f}")
    print(f"{'='*55}\n")
    
    # Save JSON
    out_path = sys.argv[1].replace('.pdb', '_fd_v2.json')
    with open(out_path, 'w') as f:
        # Remove non-serializable lists for brief output
        brief = {k: v for k, v in result.items() 
                 if not isinstance(v, list)}
        json.dump(brief, f, indent=2)
    print(f"  Saved: {out_path}")
