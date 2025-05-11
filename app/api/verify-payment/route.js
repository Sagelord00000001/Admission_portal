// // app/api/verify-payment/route.js
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { reference } = await request.json();
    
//     if (!reference) {
//       return NextResponse.json(
//         { success: false, error: "Reference is required" },
//         { status: 400 }
//       );
//     }

//     // Test mode verification
//     if (process.env.NODE_ENV === 'development' && !process.env.PAYSTACK_SECRET_KEY) {
//       return NextResponse.json({
//         success: true,
//         data: {
//           amount: 50000,
//           reference: reference,
//           status: "success",
//           paidAt: new Date().toISOString()
//         }
//       });
//     }

//     // Live verification
//     const verifyResponse = await fetch(
//       `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const verifyData = await verifyResponse.json();

//     if (!verifyResponse.ok) {
//       console.error('Paystack Error:', verifyData);
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: verifyData.message || "Verification failed",
//           details: verifyData
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: {
//         amount: verifyData.data.amount / 100, // Convert to Naira
//         reference: verifyData.data.reference,
//         status: verifyData.data.status,
//         paidAt: verifyData.data.paid_at
//       }
//     });

//   } catch (error) {
//     console.error('Server Error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: "Server error during verification",
//         details: process.env.NODE_ENV === 'development' ? error.message : null
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { reference } = await req.json();
    
    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Test mode simulation - remove in production
    if (process.env.NODE_ENV === 'development') {
      console.log('Running in development mode - mock verification');
      return NextResponse.json({
        success: true,
        data: {
          reference,
          status: "success",
          amount: 2000000, // ₦20,000 in kobo
          paidAt: new Date().toISOString()
        }
      });
    }

    // Live verification
    const verifyUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    console.log('Verifying with Paystack:', verifyUrl);
    
    const verifyResponse = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const verifyData = await verifyResponse.json();
    console.log('Paystack verification response:', verifyData);

    if (!verifyResponse.ok || !verifyData.status) {
      return NextResponse.json(
        { 
          success: false, 
          error: verifyData.message || "Payment verification failed",
          details: verifyData
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: verifyData.data.reference,
        status: verifyData.data.status,
        amount: verifyData.data.amount, // Amount in kobo
        paidAt: verifyData.data.paid_at
      }
    });

  } catch (error) {
    console.error('Verification server error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error during verification",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}