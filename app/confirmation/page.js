export default function ConfirmationPage({ searchParams }) {
  const email = searchParams.email || 'your email';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-3 text-lg font-medium text-gray-900">
          Application Submitted Successfully!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Your admission application has been received and is being processed. 
          A confirmation has been sent to {email}. You will receive an update shortly.
        </p>
        <div className="mt-5">
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4e3f64] hover:bg-[#4e3f64] focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}