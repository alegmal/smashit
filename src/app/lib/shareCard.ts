/**
 * Generates and downloads a PNG score card.
 */
export function downloadShareCard(
    totalKeys: number,
    discoveredEggs: number,
    totalEggs: number,
    siteUrl: string,
) {
    const W = 640;
    const H = 340;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, W, H);

    // Decorative emoji scatter — left/right edges + top/bottom strips, never over text
    // Left column: x≈28-56, y 85–295. Right column: x≈584-612, y 85–295.
    // Top strip: y≈22. Bottom strip: y≈322.
    const scatter: { e: string; x: number; y: number; s: number }[] = [
        // Left edge
        { e: '🦄', x: 28,  y:  85, s: 26 },
        { e: '🍕', x: 56,  y: 127, s: 22 },
        { e: '🦈', x: 26,  y: 169, s: 26 },
        { e: '🐸', x: 56,  y: 211, s: 22 },
        { e: '💩', x: 26,  y: 253, s: 20 },
        { e: '☕', x: 56,  y: 295, s: 24 },
        // Right edge
        { e: '🌈', x: 614, y:  85, s: 26 },
        { e: '💫', x: 584, y: 127, s: 22 },
        { e: '🐱', x: 614, y: 169, s: 24 },
        { e: '🦕', x: 584, y: 211, s: 26 },
        { e: '🐶', x: 614, y: 253, s: 22 },
        { e: '💥', x: 584, y: 295, s: 24 },
        // Top strip (between corner text areas), y≈22
        { e: '✨', x: 175, y: 22,  s: 18 },
        { e: '🦆', x: 320, y: 18,  s: 20 },
        { e: '🎉', x: 462, y: 22,  s: 18 },
        // Bottom strip (below egg-line baseline at y≈302), y≈322
        { e: '🚂', x: 140, y: 322, s: 20 },
        { e: '🚀', x: 320, y: 325, s: 22 },
        { e: '🐛', x: 496, y: 322, s: 20 },
    ];

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.85;
    for (const d of scatter) {
        ctx.font = `${d.s}px system-ui, Arial, sans-serif`;
        ctx.fillText(d.e, d.x, d.y);
    }
    ctx.restore();

    // Gradient border
    const border = ctx.createLinearGradient(0, 0, W, H);
    border.addColorStop(0,   '#ff6b6b');
    border.addColorStop(0.4, '#ffd32a');
    border.addColorStop(0.8, '#2ed573');
    border.addColorStop(1,   '#74b9ff');
    ctx.strokeStyle = border;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

    // Game name — top left
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = 'bold 24px system-ui, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(siteUrl, 42, 52);

    // Baby — top right
    ctx.font = '34px system-ui, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('👶', W - 40, 52);

    // Big key count — centre
    const fontSize = totalKeys >= 100000 ? 76 : totalKeys >= 10000 ? 90 : 108;
    ctx.fillStyle = '#ffd32a';
    ctx.font = `bold ${fontSize}px system-ui, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ffd32a';
    ctx.shadowBlur = 28;
    ctx.fillText(totalKeys.toLocaleString(), W / 2, H / 2 + 20);
    ctx.shadowBlur = 0;

    // "KEYS PRESSED" sub-label
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = 'bold 20px system-ui, Arial, sans-serif';
    ctx.fillText('KEYS PRESSED', W / 2, H / 2 + 60);

    // Author
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '16px system-ui, Arial, sans-serif';
    ctx.fillText('by Aleg Malinovsky', W / 2, H / 2 + 96);

    // Eggs discovered — bottom
    const allFound = discoveredEggs === totalEggs;
    ctx.fillStyle = allFound ? '#2ed573' : 'rgba(255,255,255,0.3)';
    ctx.font = '17px system-ui, Arial, sans-serif';
    ctx.fillText(`🔍 ${discoveredEggs} / ${totalEggs} magic things discovered`, W / 2, H - 34);

    // Download
    const link = document.createElement('a');
    link.download = 'maka-sh-score.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
