// Demo mode for testing when OpenAI API quota is exceeded
import fs from "fs";
import path from "path";
import type { NailMeasurement, PhotoAnalysisResult } from "./preciseNailMeasurement";

export function createDemoMeasurements(): NailMeasurement[] {
  const fingerTypes = [
    'left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_pinky',
    'right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_pinky'
  ];

  return fingerTypes.map((fingerType, index) => {
    // Realistic nail measurements based on actual hand anatomy
    const baseWidths = [14, 12, 13, 12, 9, 14, 12, 13, 12, 9]; // mm
    const baseLengths = [12, 15, 17, 15, 12, 12, 15, 17, 15, 12]; // mm
    const fingerWidths = [20, 17, 18, 17, 14, 20, 17, 18, 17, 14]; // mm
    const fingerLengths = [48, 75, 85, 78, 65, 48, 75, 85, 78, 65]; // mm
    
    const nailWidthMm = baseWidths[index] + (Math.random() - 0.5) * 2;
    const nailLengthMm = baseLengths[index] + (Math.random() - 0.5) * 3;
    const fingerWidthMm = fingerWidths[index] + (Math.random() - 0.5) * 3;
    const fingerLengthMm = fingerLengths[index] + (Math.random() - 0.5) * 5;
    
    // Convert mm to pixels (using standard 3.78 pixels per mm)
    const pixelsPerMm = 3.78;
    
    return {
      fingerType,
      nailWidth: nailWidthMm * pixelsPerMm,
      nailLength: nailLengthMm * pixelsPerMm,
      nailCurvature: 0.2 + Math.random() * 0.4, // 0.2-0.6 range
      fingerWidth: fingerWidthMm * pixelsPerMm,
      fingerLength: fingerLengthMm * pixelsPerMm,
      shapeCategory: ['oval', 'square', 'round', 'almond', 'coffin'][Math.floor(Math.random() * 5)],
      confidence: 0.85 + Math.random() * 0.1, // 0.85-0.95 range
      cardScale: pixelsPerMm,
      realWorldMeasurements: {
        nailWidthMm,
        nailLengthMm,
        fingerWidthMm,
        fingerLengthMm
      }
    };
  });
}

export function createDemoAnalysisResult(): PhotoAnalysisResult {
  return {
    cardDetected: true,
    cardDimensions: {
      width: 85.60,
      height: 53.98,
      pixelsPerMm: 3.78
    },
    fingerMeasurements: createDemoMeasurements(),
    analysisConfidence: 0.89,
    recommendations: [
      "모든 손가락이 성공적으로 측정되었습니다",
      "카드 기준점이 명확하게 인식되었습니다",
      "네일아트 생성을 위한 충분한 데이터가 수집되었습니다"
    ]
  };
}

export function generateDemoNailArt(measurements: NailMeasurement[]): any {
  const demoImages: string[] = [];
  const descriptions: string[] = [];
  const designSpecs: any[] = [];

  // Create demo SVG nail art for each finger
  measurements.forEach((measurement, index) => {
    const fileName = `demo_nail_art_${measurement.fingerType}_${Date.now()}_${index}.svg`;
    const filePath = path.join(process.cwd(), 'uploads', fileName);
    
    const svgContent = createDemoNailArtSVG(measurement, index);
    
    try {
      fs.writeFileSync(filePath, svgContent);
      demoImages.push(`/uploads/${fileName}`);
    } catch (error) {
      console.error(`Failed to create demo SVG for ${measurement.fingerType}:`, error);
      // Create a placeholder
      demoImages.push(`data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`);
    }

    descriptions.push(
      `${measurement.fingerType} 손가락용 데모 네일아트 디자인 (${measurement.realWorldMeasurements.nailWidthMm.toFixed(1)}mm × ${measurement.realWorldMeasurements.nailLengthMm.toFixed(1)}mm)`
    );

    designSpecs.push({
      fingerType: measurement.fingerType,
      designDescription: `${measurement.fingerType} 손가락을 위한 우아한 그라데이션 디자인`,
      colorPalette: getRandomColorPalette(),
      designComplexity: ['simple', 'medium', 'complex'][Math.floor(Math.random() * 3)],
      estimatedSize: `${measurement.realWorldMeasurements.nailWidthMm.toFixed(1)}mm × ${measurement.realWorldMeasurements.nailLengthMm.toFixed(1)}mm`
    });
  });

  return {
    generatedImages: demoImages,
    descriptions,
    designSpecs
  };
}

function createDemoNailArtSVG(measurement: NailMeasurement, index: number): string {
  const width = Math.max(measurement.realWorldMeasurements.nailWidthMm * 10, 80);
  const height = Math.max(measurement.realWorldMeasurements.nailLengthMm * 10, 100);
  
  // Different color schemes for variety
  const colorSchemes = [
    ['#FFE4E6', '#FDB2C1', '#F472B6'], // Pink gradient
    ['#E0F2FE', '#7DD3FC', '#0EA5E9'], // Blue gradient
    ['#F3E8FF', '#C084FC', '#9333EA'], // Purple gradient
    ['#ECFDF5', '#86EFAC', '#22C55E'], // Green gradient
    ['#FFF7ED', '#FDBA74', '#EA580C'], // Orange gradient
    ['#F0F9FF', '#BAE6FD', '#0284C7'], // Light blue gradient
    ['#FFFBEB', '#FDE68A', '#D97706'], // Yellow gradient
    ['#FDF2F8', '#FBCFE8', '#EC4899'], // Rose gradient
    ['#F5F3FF', '#DDD6FE', '#8B5CF6'], // Violet gradient
    ['#FAFAF9', '#D6D3D1', '#78716C']  // Neutral gradient
  ];
  
  const colors = colorSchemes[index % colorSchemes.length];
  
  // Create unique patterns for each finger
  const patterns = [
    createFloralPattern(colors),
    createGeometricPattern(colors),
    createGradientPattern(colors),
    createDotPattern(colors),
    createStripesPattern(colors)
  ];
  
  const pattern = patterns[index % patterns.length];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${pattern.defs}
  </defs>
  
  <!-- Nail base shape -->
  <ellipse cx="${width/2}" cy="${height/2}" rx="${width/2-3}" ry="${height/2-3}" 
           fill="${pattern.baseFill}" stroke="${colors[2]}" stroke-width="2"/>
  
  <!-- Pattern overlay -->
  ${pattern.content}
  
  <!-- Highlight effect -->
  <ellipse cx="${width/3}" cy="${height/4}" rx="${width/8}" ry="${height/12}" 
           fill="rgba(255,255,255,0.4)" />
  
  <!-- Finger type label -->
  <text x="${width/2}" y="${height-5}" text-anchor="middle" font-family="Arial, sans-serif" 
        font-size="8" fill="${colors[2]}" opacity="0.7">
    ${measurement.fingerType.replace('_', ' ')}
  </text>
</svg>`;
}

function createFloralPattern(colors: string[]) {
  return {
    defs: `
    <radialGradient id="floral" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
      <stop offset="70%" style="stop-color:${colors[1]};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:0.6" />
    </radialGradient>`,
    baseFill: 'url(#floral)',
    content: `
    <circle cx="30%" cy="40%" r="8" fill="${colors[1]}" opacity="0.7"/>
    <circle cx="70%" cy="30%" r="6" fill="${colors[0]}" opacity="0.8"/>
    <circle cx="50%" cy="70%" r="5" fill="${colors[2]}" opacity="0.6"/>`
  };
}

function createGeometricPattern(colors: string[]) {
  return {
    defs: `
    <linearGradient id="geometric" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${colors[1]};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:0.8" />
    </linearGradient>`,
    baseFill: 'url(#geometric)',
    content: `
    <polygon points="20,20 40,30 30,50" fill="${colors[2]}" opacity="0.5"/>
    <polygon points="60,25 80,35 70,55" fill="${colors[0]}" opacity="0.6"/>`
  };
}

function createGradientPattern(colors: string[]) {
  return {
    defs: `
    <radialGradient id="gradient" cx="50%" cy="30%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
      <stop offset="60%" style="stop-color:${colors[1]};stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:0.4" />
    </radialGradient>`,
    baseFill: 'url(#gradient)',
    content: ''
  };
}

function createDotPattern(colors: string[]) {
  return {
    defs: '',
    baseFill: colors[0],
    content: `
    <circle cx="25%" cy="30%" r="3" fill="${colors[1]}"/>
    <circle cx="75%" cy="40%" r="2" fill="${colors[2]}"/>
    <circle cx="50%" cy="60%" r="2.5" fill="${colors[1]}"/>
    <circle cx="30%" cy="70%" r="2" fill="${colors[2]}"/>
    <circle cx="70%" cy="25%" r="1.5" fill="${colors[1]}"/>`
  };
}

function createStripesPattern(colors: string[]) {
  return {
    defs: `
    <linearGradient id="stripes" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
      <stop offset="33%" style="stop-color:${colors[1]};stop-opacity:0.8" />
      <stop offset="66%" style="stop-color:${colors[2]};stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:${colors[0]};stop-opacity:1" />
    </linearGradient>`,
    baseFill: 'url(#stripes)',
    content: ''
  };
}

function getRandomColorPalette(): string[] {
  const palettes = [
    ['#FFB6C1', '#FFC0CB', '#FFFFFF'],
    ['#E6E6FA', '#DDA0DD', '#9370DB'],
    ['#F0E68C', '#FFD700', '#FFA500'],
    ['#98FB98', '#90EE90', '#32CD32'],
    ['#87CEEB', '#87CEFA', '#4169E1'],
    ['#F5DEB3', '#DEB887', '#CD853F']
  ];
  
  return palettes[Math.floor(Math.random() * palettes.length)];
}