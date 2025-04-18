import { createTransport } from 'nodemailer';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  // Create a temporary directory in the project root
  const tempDir = path.join('/tmp', 'temp-uploads');
  let attachments = [];

  try {
    // Ensure temp directory exists
    await mkdir(tempDir, { recursive: true });

    const formData = await request.formData();
    const fields = {};

    // Process form data
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value;
      } else if (value instanceof File && value.size > 0) {
        const fileExt = path.extname(value.name);
        const tempFileName = `${uuidv4()}${fileExt}`;
        const tempFilePath = path.join(tempDir, tempFileName);
        
        // Write file to temp directory
        const buffer = Buffer.from(await value.arrayBuffer());
        await writeFile(tempFilePath, buffer);

        attachments.push({
          filename: value.name,
          path: tempFilePath,
          contentType: value.type || 'application/octet-stream'
        });
      }
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    const missingFields = requiredFields.filter(field => !fields[field]);
    if (missingFields.length) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Configure email transporter
    const transporter = createTransport({
      host: 'mail.riverdaleedu.ng',
      port: 465,
      secure: true,
      auth: {
        user: 'admission@riverdaleedu.ng',
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send email with attachments
    const info = await transporter.sendMail({
      from: '"Riverdale Admissions" <admission@riverdaleedu.ng>',
      to: process.env.ADMIN_EMAIL || 'admin@riverdaleedu.ng',
      subject: `New Application: ${fields.firstName} ${fields.lastName}`,
      text: Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `
        <h1>New Application Submission</h1>
        ${Object.entries(fields)
          .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
          .join('')}
      `,
      attachments
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: info.messageId 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } finally {
    // Clean up all temp files whether request succeeds or fails
    await Promise.allSettled(
      attachments.map(file => 
        unlink(file.path).catch(e => 
          console.error(`Error deleting temp file ${file.path}:`, e)
        )
      )
    );
  }
}