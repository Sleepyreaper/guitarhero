// Renders a chord shape as an SVG string. Strings are drawn low-E (left) to high-e (right),
// matching how you look down at the fretboard while playing.

export function chordSVG(chord, opts = {}) {
  const W = opts.w || 122;
  const H = opts.h || 152;
  const padX = 16;
  const padTop = 30;
  const padBottom = 14;
  const nStr = 6;

  const maxFret = Math.max(...chord.frets);
  const base = chord.baseFret || 1;
  const nFret = Math.max(4, maxFret - base + 1);

  const gridW = W - padX * 2;
  const gridH = H - padTop - padBottom;
  const dx = gridW / (nStr - 1);
  const dy = gridH / nFret;
  const xOf = (i) => padX + i * dx;
  const topY = padTop;

  const parts = [];

  // Grid: vertical strings
  for (let i = 0; i < nStr; i++) {
    parts.push(`<line x1="${xOf(i)}" y1="${topY}" x2="${xOf(i)}" y2="${topY + gridH}" style="stroke:var(--faint);stroke-width:1.3" />`);
  }
  // Grid: horizontal frets
  for (let f = 0; f <= nFret; f++) {
    const y = topY + f * dy;
    const isNut = f === 0 && base === 1;
    parts.push(`<line x1="${padX}" y1="${y}" x2="${padX + gridW}" y2="${y}" style="stroke:${isNut ? 'var(--text)' : 'var(--faint)'};stroke-width:${isNut ? 4 : 1.3}" />`);
  }

  // Base-fret label for moved shapes (not needed for our open chords, but supported).
  if (base > 1) {
    parts.push(`<text x="${padX - 6}" y="${topY + dy * 0.6}" text-anchor="end" style="fill:var(--muted);font:600 11px var(--font)">${base}fr</text>`);
  }

  // Markers above the nut (open / muted) and fretted dots.
  chord.frets.forEach((fret, i) => {
    const x = xOf(i);
    if (fret === -1) {
      parts.push(`<text x="${x}" y="${topY - 10}" text-anchor="middle" style="fill:var(--faint);font:700 14px var(--font)">×</text>`);
    } else if (fret === 0) {
      parts.push(`<circle cx="${x}" cy="${topY - 14}" r="5" fill="none" style="stroke:var(--muted);stroke-width:1.6" />`);
    } else {
      const y = topY + (fret - base + 0.5) * dy;
      parts.push(`<circle cx="${x}" cy="${y}" r="8.5" style="fill:var(--rust)" />`);
      const finger = chord.fingers[i];
      if (finger) {
        parts.push(`<text x="${x}" y="${y + 4}" text-anchor="middle" style="fill:#fff;font:700 11px var(--font)">${finger}</text>`);
      }
    }
  });

  return `<svg class="chord" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${chord.name} chord diagram">${parts.join('')}</svg>`;
}

// A full card: diagram + name + optional "hear it" strum button (wired by the view).
export function chordCard(chord, { withPlay = true } = {}) {
  return `
    <div class="panel chord-card" data-chord="${chord.name}">
      <div class="chord-name">${chord.name}</div>
      ${chordSVG(chord)}
      <div class="chord-sub">${chord.label}</div>
      ${withPlay ? `<button class="btn btn-ghost btn-play" data-chord="${chord.name}">▶ hear it</button>` : ''}
    </div>`;
}
