"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PaystackPayment from "../components/paystack-payment"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function AdmissionPortal() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null) // For debugging purposes
  const [paymentStatus, setPaymentStatus] = useState({
    paid: false,
    reference: "",
    verifying: false,
  })
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    nationality: "",
    stateOfOrigin: "",
    contactAddress: "",
    email: "",
    phone: "",
    photo: null,

    // Academic Information
    highestEducation: "",
    previousInstitutions: "",
    graduationYear: "",
    examResults: null,
    certifications: "",

    // Program Selection
    desiredCourse: "",
    studyMode: "full-time",
    desiredProgram: "",

    // Parent/Guardian
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianAddress: "",

    // Additional Info
    heardAboutUs: "",
    specialNeeds: "",

    // Declaration
    agreeTerms: false,
    signature: "",

    // Payment
    paymentMethod: "",
    paymentProof: null,
  })

  const router = useRouter()

  // Safe error handling with debug info
  const handleError = (error) => {
    console.error("Error:", error)
    setError(error?.message || "An unexpected error occurred. Please try again.")

    // Store debug info for development
    if (process.env.NODE_ENV === "development") {
      setDebugInfo({
        message: error?.message,
        stack: error?.stack,
        time: new Date().toISOString(),
      })
    }

    window.scrollTo(0, 0)
  }

  const handleChange = (e) => {
    try {
      const { name, value, type, checked, files } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
      }))
    } catch (error) {
      handleError(error)
    }
  }

  const validateForm = () => {
    // Basic validation - expand as needed
    if (!formData.firstName) {
      return "First name is required";
    }
    if (!formData.lastName) {
      return "Last name is required";
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Valid email is required";
    }
    if (!formData.dob) {
      return "Date of birth is required";
    }
    if (!formData.gender) {
      return "Gender is required";
    }
    if (!formData.nationality) {
      return "Nationality is required";
    }
    if (!formData.stateOfOrigin) {
      return "State of origin is required";
    }
    if (!formData.contactAddress) {
      return "Contact address is required";
    }
    if (!formData.phone) {
      return "Phone number is required";
    }
    if (!formData.photo) {
      return "Passport photograph is required";
    }
    if (!formData.highestEducation) {
      return "Highest education level is required";
    }
    if (!formData.previousInstitutions) {
      return "Previous institutions are required";
    }
    if (!formData.graduationYear) {
      return "Graduation year is required";
    }
    if (!formData.examResults) {
      return "Exam results are required";
    }
    if (!formData.desiredCourse) {
      return "Desired course is required";
    }
    if (!formData.desiredProgram) {
      return "Desired program is required";
    }
    if (!formData.studyMode) {
      return "Study mode is required";
    }
    if (!formData.guardianName) {
      return "Guardian name is required";
    }
    if (!formData.guardianRelationship) {
      return "Guardian relationship is required";
    }
    if (!formData.guardianPhone) {
      return "Guardian phone number is required";
    }
    if (!formData.guardianEmail) {
      return "Guardian email is required";
    }
    if (!formData.guardianAddress) {
      return "Guardian address is required";
    }
    if (!formData.heardAboutUs) {
      return "Please specify how you heard about us";
    }
    if (!formData.agreeTerms) {
      return "You must agree to the terms and conditions";
    }
    if (!formData.signature) {
      return "Electronic signature is required";
    }
    return null;
  };

  const handlePaystackSuccess = async (reference) => {
    try {
      console.log('Starting payment verification for reference:', reference);
      
      setPaymentStatus({
        ...paymentStatus,
        reference,
        verifying: true,
      });
  
      const verifyResponse = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      });
  
      console.log('Verification response status:', verifyResponse.status);
      
      const verifyData = await verifyResponse.json();
      console.log('Verification response data:', verifyData);
  
      if (!verifyResponse.ok || !verifyData.success) {
        const errorMsg = verifyData.error || "Payment verification failed";
        console.error('Verification failed:', errorMsg);
        throw new Error(errorMsg);
      }
  
      // Payment verified successfully
      setPaymentStatus({
        paid: true,
        reference,
        verifying: false,
      });
  
      // Automatically submit the form after successful payment
      await submitFormAfterPayment(reference);
    } catch (error) {
      console.error('Full verification error:', {
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString()
      });
      setError(`Payment verification failed: ${error.message}`);
      setPaymentStatus({
        ...paymentStatus,
        verifying: false,
      });
    }
  };
  const handlePaystackClose = () => {
    // Payment was canceled
    setError("Payment was canceled. Please try again to complete your application.")
  }

  const submitFormAfterPayment = async (reference) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Prepare form data
      const formDataToSend = new FormData()

      // Add payment verification details
      formDataToSend.append("paymentReference", reference)
      formDataToSend.append("paymentVerified", "true")

      // Add all other form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value instanceof File ? value : String(value))
        }
      })

      // Submit to API with better error handling
      try {
        const response = await fetch("/api/send-application-email", {
          method: "POST",
          body: formDataToSend,
        })

        const responseText = await response.text()
        let data

        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("Failed to parse response as JSON:", responseText)
          throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`)
        }

        if (!response.ok) {
          throw new Error(data.error || `Server error: ${response.status} ${response.statusText}`)
        }

        if (!data.success) {
          throw new Error(data.error || "Submission failed.")
        }

        // Proceed to confirmation after successful submission
        setStep(9) // Success step
      } catch (error) {
        console.error("API call error:", error)
        throw new Error(`Failed to submit application: ${error.message}`)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)

      // 1. Validate all form fields
      const validationError = validateForm()
      if (validationError) {
        setError(validationError)
        window.scrollTo(0, 0)
        return
      }

      // 2. If payment is already verified, submit the form
      if (paymentStatus.paid) {
        submitFormAfterPayment(paymentStatus.reference)
        return
      }

      // 3. If payment method is not selected, show error
      if (formData.paymentMethod !== "paystack") {
        setError("Please select Paystack as your payment method")
        window.scrollTo(0, 0)
        return
      }

      // 4. If we reach here, the form is valid but payment hasn't been made yet
      // The actual payment will be initiated by the PaystackPayment component
      setError("Please complete your payment to submit the application")
      window.scrollTo(0, 0)
    } catch (error) {
      handleError(error)
    }
  }

  const nextStep = () => {
    try {
      setStep((prev) => prev + 1)
    } catch (error) {
      handleError(error)
    }
  }

  const prevStep = () => {
    try {
      setStep((prev) => prev - 1)
    } catch (error) {
      handleError(error)
    }
  }

  // The rest of the component remains the same...
  // (I'm keeping the JSX part the same as before since it's quite long)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Add error display at the top */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug info for development */}
      {debugInfo && process.env.NODE_ENV === "development" && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-gray-100 border border-gray-300 rounded">
          <details>
            <summary className="font-medium cursor-pointer">Debug Information</summary>
            <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-800 text-white rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Payment success message */}
      {paymentStatus.paid && (
        <div className="max-w-4xl mx-auto mb-6">
          <Alert className="bg-green-50 border-green-500">
            <AlertDescription className="text-green-700">
              Payment successful! Your application will be processed after submission.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Payment verification in progress */}
      {paymentStatus.verifying && (
        <div className="max-w-4xl mx-auto mb-6">
          <Alert className="bg-blue-50 border-blue-500">
            <AlertDescription className="text-blue-700 flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying your payment...
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${
                      i < step
                        ? "bg-[#c0b15f] text-white"
                        : i === step
                          ? "bg-[#4e3f64] text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#4e3f64] h-2.5 rounded-full" style={{ width: `${(step / 8) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Introduction */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to Our Admission Portal</h2>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[#4e3f64] mb-2">Instructions</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Complete all required fields (marked with *)</li>
                  <li>Have scanned copies of your documents ready</li>
                  <li>Application takes about 15-20 minutes</li>
                  <li>You can save and return later</li>
                  <li>Payment is required to complete your application</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Admission Requirements</h3>
                <div className="space-y-2">
                  <details className="border rounded-lg p-3">
                    <summary className="font-medium cursor-pointer">Undergraduate Programs</summary>
                    <p className="mt-2 text-gray-600">6 credits including English and Mathematics</p>
                  </details>
                  <details className="border rounded-lg p-3">
                    <summary className="font-medium cursor-pointer">Diploma Programs</summary>
                    <p className="mt-2 text-gray-600">5 credits including English and Mathematics</p>
                  </details>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Contact Information</h3>
                <p className="text-gray-700">Email: admissions@riverdaleedu.ng</p>
                <p className="text-gray-700">Phone: +2349031474240</p>
                <p className="text-gray-700">Office Hours: Mon-Fri, 9am-5pm</p>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 block text-black w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality *</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State/Region of Origin *</label>
                  <input
                    type="text"
                    name="stateOfOrigin"
                    value={formData.stateOfOrigin}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Contact Address *</label>
                  <textarea
                    name="contactAddress"
                    value={formData.contactAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Passport Photograph *</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    required
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#4e3f64] hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">Recent passport photo (2MB max, JPEG/PNG)</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Academic Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Academic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Highest Education *</label>
                  <select
                    name="highestEducation"
                    value={formData.highestEducation}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  >
                    <option value="">Select Level</option>
                    <option value="high-school">High School (WAEC/NECO)</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Institution(s) *</label>
                  <input
                    type="text"
                    name="previousInstitutions"
                    value={formData.previousInstitutions}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Graduation Year *</label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Exam Results *</label>
                  <input
                    type="file"
                    name="examResults"
                    onChange={handleChange}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#4e3f64] hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">Upload WAEC/NECO/GCE results (5MB max)</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Other Certifications</label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none"
                    placeholder="List any additional certifications"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Program Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Program Selection</h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Desired Course *</label>
                  <select
                    name="desiredCourse"
                    value={formData.desiredCourse}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  >
                    <option value="">Select Course</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="business-admin">Business Administration</option>
                    <option value="accounting">Accounting</option>
                    <option value="banking-finance">Banking & Finance</option>
                    <option value="human-resource">Human Resource Management</option>
                    <option value="public-admin">Public Administration</option>
                    <option value="information-tech">Information Technology</option>
                    <option value="political-science">Political Science</option>
                    <option value="international-relation">International Relations</option>
                    <option value="psychology">Psychology</option>
                    <option value="mass-communication">Mass Communication</option>
                    <option value="economics">Economics</option>
                    <option value="estate-management">Estate Management</option>
                    <option value="biomedical-science">Biomedical Science</option>
                    <option value="medical-laboratory">Medical Laboratory Science</option>
                    <option value="microbiology">Microbiology</option>
                    <option value="biochemistry">Biochemistry</option>
                    <option value="marketing">marketing </option>
                    <option value="nursing">nursing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Desired Program *</label>
                  <select
                    name="desiredProgram"
                    value={formData.desiredProgram}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  >
                    <option value="">Select Program</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mode of Study *</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="studyMode"
                        value="full-time"
                        checked={formData.studyMode === "full-time"}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#4e3f64] border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">Full-time</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="studyMode"
                        value="distance"
                        checked={formData.studyMode === "distance"}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#4e3f64] border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">Distance Learning</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Parent/Guardian Information */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Parent/Guardian Information</h2>
              <p className="text-gray-600">Please provide details of your parent or guardian (optional)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    required
                    className="mt-1 block text-black w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Relationship</label>
                  <input
                    type="text"
                    name="guardianRelationship"
                    value={formData.guardianRelationship}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="guardianAddress"
                    value={formData.guardianAddress}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Additional Information */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Additional Information</h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">How did you hear about us?</label>
                  <select
                    name="heardAboutUs"
                    value={formData.heardAboutUs}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  >
                    <option value="">Select Option</option>
                    <option value="social-media">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="school">School Counselor</option>
                    <option value="website">School Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Special Needs (if any)</label>
                  <textarea
                    name="specialNeeds"
                    value={formData.specialNeeds}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="mt-1 text-black block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                    placeholder="Please describe any special needs or accommodations required"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Declaration */}
          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Declaration</h2>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg text-black font-semibold mb-2">Terms and Conditions</h3>
                <div className="max-h-60 overflow-y-auto p-3 bg-white border rounded-md text-sm text-gray-600">
                  <p className="mb-2">1. I certify that all information provided is accurate and complete.</p>
                  <p className="mb-2">2. I understand that providing false information may lead to disqualification.</p>
                  <p className="mb-2">3. I agree to the institution's data processing policies.</p>
                  <p className="mb-2">4. I consent to receive communications regarding my application.</p>
                  <p>5. I understand the application fee is non-refundable.</p>
                </div>

                <div className="mt-4 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 text-[#000000] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">I agree to the terms and conditions *</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Electronic Signature *</label>
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
                  onChange={handleChange}
                  required
                  placeholder="Type your full name as signature"
                  className="mt-1 block text-black w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                />
                <p className="mt-1 text-sm text-gray-500">Your typed name serves as your electronic signature</p>
              </div>
            </div>
          )}

          {/* Step 8: Payment - Modified for Paystack */}
          {step === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Information</h2>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Application Fee: ₦20,000</h3>
                <p className="text-gray-700">Payment is required to process your application.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paystack"
                      name="paymentMethod"
                      value="paystack"
                      checked={formData.paymentMethod === "paystack"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#4e3f64] border-gray-300"
                    />
                    <label htmlFor="paystack" className="ml-3 block text-sm font-medium text-gray-700">
                      Pay with Paystack (Credit/Debit Card, Bank Transfer)
                    </label>
                    
                  </div>
                </div>
              </div>

              {formData.paymentMethod === "paystack" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#4e3f64] mb-4">Complete Payment</h3>

                  {!paymentStatus.paid ? (
                    <div className="space-y-4">
                      <p className="text-gray-700 mb-4">
                        Click the button below to make your payment securely via Paystack.
                      </p>

                      <PaystackPayment
                        email={formData.email || ""}
                        amount={2000000} // ₦20,000 in kobo
                        name={`${formData.firstName} ${formData.lastName}`}
                        phone={formData.phone || ""}
                        onSuccess={handlePaystackSuccess}
                        onClose={handlePaystackClose}
                        disabled={!formData.email || !formData.firstName || !formData.lastName}
                        validateForm={validateForm}
                      />

                      {(!formData.email || !formData.firstName || !formData.lastName) && (
                        <p className="text-sm text-red-600 mt-2">
                          Please fill in your name and email address in the Personal Information section before making
                          payment.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <svg
                          className="h-6 w-6 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-700 font-medium">Payment Completed Successfully!</p>
                      </div>
                      <p className="mt-2 text-gray-600">Reference: {paymentStatus.reference}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {step < 8 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4e3f64] hover:bg-[#4e3f64] focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#c0b15f] hover:bg-[#c0b15f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#c0b15f]"
                disabled={isSubmitting || (!paymentStatus.paid && formData.paymentMethod === "paystack")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            )}
          </div>

          {/* Success Step */}
          {step === 9 && (
            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                We've sent a confirmation to {formData.email}.
                <br />
                Our admissions team will contact you shortly.
              </p>
              <button
                onClick={() => router.push("/confirmation")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4e3f64] hover:bg-[#4e3f64] focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                View Confirmation Details
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
