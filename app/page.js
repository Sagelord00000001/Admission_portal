import Image from "next/image";
import AuthButton from "./components/AuthButton";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Hero Image Section */}
        <div className="md:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="relative w-full h-64 md:h-full">
            <Image
              src="/logo.png"
              alt="Admission Portal"
              width={200}
              height={200}
              className="opacity-90 object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-3xl pt-20 md:text-5xl font-bold text-[#4e3f64] text-center drop-shadow-md ">
                Welcome to Our <br /> Admission Portal
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Get Started
          </h2>
          <p className="text-gray-600 mb-8">
            Access your account or register to begin your admission journey with
            us.
          </p>

          <AuthButton />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#c0b15f] mr-2">✓</span>
                <span>Simple application process</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#c0b15f] mr-2">✓</span>
                <span>Track your application status</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#c0b15f] mr-2">✓</span>
                <span>Secure and confidential</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Need help? Contact us at admission@riverdaleedu.ng</p>
      </footer>
    </main>
  );
}