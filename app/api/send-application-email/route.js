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

// import { type NextRequest, NextResponse } from "next/server"
// import { createTransport } from "nodemailer"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()
//     const fields: Record<string, string> = {}
//     const attachments = []

//     // Check for payment verification
//     const paymentReference = formData.get("paymentReference")
//     const paymentVerified = formData.get("paymentVerified")

//     if (!paymentReference || paymentVerified !== "true") {
//       return NextResponse.json({ success: false, error: "Payment verification is required" }, { status: 400 })
//     }

//     // Process form data
//     for (const [key, value] of formData.entries()) {
//       if (typeof value === "string") {
//         fields[key] = value
//       } else if (value instanceof File && value.size > 0) {
//         // For files, we'll just include the filename in the email
//         // since we can't easily store files in this environment
//         attachments.push({
//           filename: value.name,
//           content: `File uploaded: ${value.name} (${value.size} bytes)`,
//           contentType: "text/plain",
//         })
//       }
//     }

//     // Validate required fields
//     const requiredFields = ["firstName", "lastName", "email"]
//     const missingFields = requiredFields.filter((field) => !fields[field])
//     if (missingFields.length) {
//       throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
//     }

//     // Configure email transporter with fallback options
//     const transporter = createTransport({
//       host: process.env.EMAIL_HOST || "mail.riverdaleedu.ng",
//       port: Number.parseInt(process.env.EMAIL_PORT || "465"),
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER || "admission@riverdaleedu.ng",
//         pass: process.env.EMAIL_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     })

//     // Create email content
//     const emailContent = `
//       <h1>New Application Submission</h1>
//       <p><strong>Payment Reference:</strong> ${paymentReference}</p>
//       <p><strong>Payment Status:</strong> Verified</p>
//       ${Object.entries(fields)
//         .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
//         .join("")}
//     `

//     // Send email
//     const info = await transporter.sendMail({
//       from: `"Riverdale Admissions" <${process.env.EMAIL_USER || "admission@riverdaleedu.ng"}>`,
//       to: process.env.ADMIN_EMAIL || "admin@riverdaleedu.ng",
//       subject: `New Application: ${fields.firstName} ${fields.lastName}`,
//       text: Object.entries(fields)
//         .map(([k, v]) => `${k}: ${v}`)
//         .join("\n"),
//       html: emailContent,
//       attachments,
//     })

//     return NextResponse.json(
//       {
//         success: true,
//         messageId: info.messageId,
//       },
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     )
//   } catch (error) {
//     console.error("Error processing request:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message || "Internal server error",
//         details: process.env.NODE_ENV === "development" ? error.stack : undefined,
//       },
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     )
//   }
// }


// // import { NextResponse } from "next/server";

// // export async function POST(request) {
// //   try {
// //     const { reference } = await request.json();

// //     if (!reference) {
// //       return NextResponse.json(
// //         { success: false, error: "Payment reference is required" },
// //         { status: 400 }
// //       );
// //     }

// //     // Check if we have the Paystack secret key
// //     if (!process.env.PAYSTACK_SECRET_KEY) {
// //       console.warn("PAYSTACK_SECRET_KEY is not set. Using mock verification for development.");
// //       // For development/testing, we'll mock a successful verification
// //       return NextResponse.json({
// //         success: true,
// //         data: {
// //           amount: 20000, // ₦20,000
// //           reference: reference,
// //           status: "success",
// //           paidAt: new Date().toISOString(),
// //         },
// //       });
// //     }

// //     // Verify the payment with Paystack
// //     try {
// //       const verifyResponse = await fetch(
// //         `https://api.paystack.co/transaction/verify/${reference}`,
// //         {
// //           method: "GET",
// //           headers: {
// //             Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       const verifyData = await verifyResponse.json();

// //       if (!verifyResponse.ok) {
// //         console.error("Paystack verification failed:", verifyData);
// //         return NextResponse.json(
// //           {
// //             success: false,
// //             error: "Payment verification failed",
// //             details: verifyData,
// //           },
// //           { status: 400 }
// //         );
// //       }

// //       if (verifyData.data.status !== "success") {
// //         return NextResponse.json(
// //           {
// //             success: false,
// //             error: "Payment was not successful",
// //             status: verifyData.data.status,
// //           },
// //           { status: 400 }
// //         );
// //       }

// //       // Payment was successful
// //       return NextResponse.json({
// //         success: true,
// //         data: {
// //           amount: verifyData.data.amount / 100, // Convert from kobo to naira
// //           reference: verifyData.data.reference,
// //           status: verifyData.data.status,
// //           paidAt: verifyData.data.paid_at,
// //         },
// //       });
// //     } catch (error) {
// //       console.error("Error during Paystack API call:", error);
// //       // For development/testing fallback
// //       return NextResponse.json({
// //         success: true,
// //         data: {
// //           amount: 20000, // ₦20,000
// //           reference: reference,
// //           status: "success",
// //           paidAt: new Date().toISOString(),
// //           note: "This is a fallback response due to Paystack API error",
// //         },
// //       });
// //     }
// //   } catch (error) {
// //     console.error("Error verifying payment:", error);
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: "An error occurred while verifying payment",
// //         details: process.env.NODE_ENV === "development" ? error.stack : undefined,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }