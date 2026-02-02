import { sendEmail, getEmailPreview, type EmailTemplateType } from '@/lib/email/emailService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, templateType, data, preview } = await request.json();

    if (!to || !templateType) {
      return NextResponse.json({ error: 'Email and template type required' }, { status: 400 });
    }

    // If preview requested, return HTML without sending
    if (preview) {
      const html = getEmailPreview(templateType as EmailTemplateType, data);
      return NextResponse.json({ success: true, html, preview: true });
    }

    // Send the email
    const result = await sendEmail({
      to,
      templateType: templateType as EmailTemplateType,
      data,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
