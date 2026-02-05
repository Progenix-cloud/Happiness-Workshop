/**
 * Certificate Download API
 * GET /api/certificates/download/[workshopId]
 * Generates and downloads certificate PDF for a workshop
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';
import { users, workshops, workshopParticipants, certificates } from '@/lib/mongodb/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const { workshopId } = await params;

    // Get authenticated user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await authService.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has completed workshop with certificate
    const participant = workshopParticipants.find(
      (p) => p.userId === user._id && p.workshopId === workshopId
    );

    if (!participant) {
      return NextResponse.json(
        { error: 'You have not attended this workshop' },
        { status: 404 }
      );
    }

    if (!participant.certificateUnlocked) {
      return NextResponse.json(
        {
          error: 'Certificate not available',
          message: 'You need at least 75% attendance to earn a certificate',
          attendance: participant.attendancePercentage,
        },
        { status: 403 }
      );
    }

    // Get workshop details
    const workshop = workshops.find((w) => w._id === workshopId);
    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    // Get or create certificate
    let certificate = certificates.find(
      (c) => c.userId === user._id && c.workshopId === workshopId
    );

    if (!certificate) {
      // Generate new certificate
      const certificateNumber = `EHAP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      certificate = {
        _id: `cert_${Date.now()}`,
        userId: user._id!,
        workshopId,
        workshopTitle: workshop.title,
        trainerName: 'Dr. Sarah Johnson', // TODO: Get actual trainer
        issuedDate: new Date(),
        certificateNumber,
        status: 'issued',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      certificates.push(certificate);
    }

    // Generate certificate HTML (simplified version)
    const certificateHTML = generateCertificateHTML(
      user.name,
      workshop.title,
      certificate.certificateNumber,
      certificate.issuedDate,
      participant.attendancePercentage
    );

    // Return HTML for now (in production, use a PDF library like puppeteer or pdfkit)
    return new NextResponse(certificateHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 🎨 Generate Certificate HTML
 * TODO: Replace with actual PDF generation using puppeteer/pdfkit
 */
function generateCertificateHTML(
  userName: string,
  workshopTitle: string,
  certificateNumber: string,
  issuedDate: Date,
  attendancePercentage: number
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Completion</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .certificate {
      background: white;
      width: 100%;
      max-width: 800px;
      padding: 60px;
      border: 20px solid #f4f4f4;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      position: relative;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      border: 2px solid #667eea;
      pointer-events: none;
    }
    .header {
      font-size: 48px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 40px;
    }
    .recipient-label {
      font-size: 14px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .recipient-name {
      font-size: 42px;
      color: #333;
      margin: 20px 0;
      font-weight: bold;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
      display: inline-block;
    }
    .completion-text {
      font-size: 16px;
      color: #666;
      margin: 30px 0;
      line-height: 1.8;
    }
    .workshop-title {
      font-size: 28px;
      color: #764ba2;
      font-weight: bold;
      margin: 20px 0;
    }
    .attendance {
      font-size: 18px;
      color: #28a745;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature-block {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #333;
      width: 200px;
      margin-bottom: 10px;
    }
    .signature-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .certificate-number {
      font-size: 12px;
      color: #999;
      margin-top: 40px;
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .print-button:hover {
      background: #764ba2;
    }
    @media print {
      body {
        background: white;
      }
      .print-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">🖨️ Print Certificate</button>
  
  <div class="certificate">
    <div class="header">Certificate</div>
    <div class="subtitle">of Completion</div>
    
    <div class="recipient-label">This is to certify that</div>
    <div class="recipient-name">${userName}</div>
    
    <div class="completion-text">
      has successfully completed the workshop
    </div>
    
    <div class="workshop-title">"${workshopTitle}"</div>
    
    <div class="attendance">
      ✅ ${attendancePercentage}% Attendance
    </div>
    
    <div class="completion-text">
      Organized by Ellipsis of Happiness Foundation<br>
      ${issuedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
    
    <div class="footer">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">Director</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-label">Program Coordinator</div>
      </div>
    </div>
    
    <div class="certificate-number">
      Certificate No: ${certificateNumber}
    </div>
  </div>
</body>
</html>
  `;
}
