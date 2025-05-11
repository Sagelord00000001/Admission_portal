// export default function ConfirmationPage({ searchParams }) {
//   const email = searchParams.email || 'your email';

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
//         <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//           <svg
//             className="h-6 w-6 text-green-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         </div>
//         <h2 className="mt-3 text-lg font-medium text-gray-900">
//           Application Submitted Successfully!
//         </h2>
//         <p className="mt-2 text-sm text-gray-500">
//           Your admission application has been received and is being processed. 
//           A confirmation has been sent to {email}. You will receive an update shortly.
//         </p>
//         <div className="mt-5">
//           <a
//             href="/dashboard"
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4e3f64] hover:bg-[#4e3f64] focus:outline-none focus:ring-2 focus:ring-offset-2"
//           >
//             Return to Dashboard
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Application Confirmed!</h1>

        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            Thank you for submitting your application. We have received your information and payment.
          </p>

          <p className="text-gray-600">
            Our admissions team will review your application and contact you within 3-5 working days.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Check your email for a confirmation receipt</li>
              <li>Prepare for a possible interview</li>
              <li>Watch for updates on your application status</li>
            </ol>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={() => router.push("/")} className="bg-[#4e3f64] hover:bg-[#3d3150]">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
