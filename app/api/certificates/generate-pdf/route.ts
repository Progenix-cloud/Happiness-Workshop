import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { workshopTitle, participantName, completionDate, trainerName } = await request.json();

    // Create a simple SVG-based certificate
    const svgContent = `
      <svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fff8e7;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffe8cc;stop-opacity:1" />
          </linearGradient>
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#fbbf24" opacity="0.3"/>
          </pattern>
        </defs>
        
        <!-- Border -->
        <rect width="1000" height="700" fill="url(#bgGradient)"/>
        <rect x="20" y="20" width="960" height="660" fill="none" stroke="#d4af37" stroke-width="3"/>
        <rect x="30" y="30" width="940" height="640" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
        
        <!-- Decorative Pattern -->
        <rect width="1000" height="700" fill="url(#pattern)"/>
        
        <!-- Certificate Title -->
        <text x="500" y="100" font-family="Georgia, serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#2c3e50">
          Certificate of Completion
        </text>
        
        <!-- Subtitle -->
        <text x="500" y="140" font-family="Georgia, serif" font-size="18" text-anchor="middle" fill="#34495e" opacity="0.8">
          Ellipsis of Happiness Foundation
        </text>
        
        <!-- Main Text -->
        <text x="500" y="220" font-family="Georgia, serif" font-size="20" text-anchor="middle" fill="#2c3e50">
          This is to certify that
        </text>
        
        <!-- Participant Name -->
        <text x="500" y="310" font-family="Georgia, serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#d4af37">
          ${participantName}
        </text>
        
        <!-- Has Successfully Completed -->
        <text x="500" y="380" font-family="Georgia, serif" font-size="18" text-anchor="middle" fill="#2c3e50">
          has successfully completed the workshop
        </text>
        
        <!-- Workshop Title -->
        <text x="500" y="430" font-family="Georgia, serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#e74c3c">
          ${workshopTitle}
        </text>
        
        <!-- Date -->
        <text x="500" y="500" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#34495e">
          Date: ${new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </text>
        
        <!-- Signature Section -->
        <line x1="250" y1="580" x2="400" y2="580" stroke="#2c3e50" stroke-width="2"/>
        <line x1="600" y1="580" x2="750" y2="580" stroke="#2c3e50" stroke-width="2"/>
        
        <text x="325" y="610" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#2c3e50">
          Trainer Signature
        </text>
        
        <text x="675" y="610" font-family="Georgia, serif" font-size="14" text-anchor="middle" fill="#2c3e50">
          Director
        </text>
        
        <!-- Certificate Number -->
        <text x="50" y="680" font-family="Arial, sans-serif" font-size="12" fill="#95a5a6">
          Certificate ID: ${Math.random().toString(36).substring(2, 15)}
        </text>
      </svg>
    `;

    // Convert SVG to base64
    const svgBase64 = Buffer.from(svgContent).toString('base64');

    // Return SVG as downloadable certificate
    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="Certificate_${participantName.replace(/\s+/g, '_')}.svg"`
      }
    });
  } catch (error) {
    console.error('[v0] Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
