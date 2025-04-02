'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdmissionPortal() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    nationality: '',
    stateOfOrigin: '',
    contactAddress: '',
    email: '',
    phone: '',
    photo: null,
    
    // Academic Information
    highestEducation: '',
    previousInstitutions: '',
    graduationYear: '',
    examResults: null,
    certifications: '',
    
    // Program Selection
    desiredCourse: '',
    studyMode: 'full-time',
    
    // Parent/Guardian
    guardianName: '',
    guardianRelationship: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    
    // Additional Info
    heardAboutUs: '',
    specialNeeds: '',
    
    // Declaration
    agreeTerms: false,
    signature: '',
    
    // Payment
    paymentMethod: '',
    paymentProof: null
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // router.push('/confirmation');
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${i < step ? 'bg-[#c0b15f] text-white' : 
                     i === step ? 'bg-[#4e3f64] text-white' : 
                     'bg-gray-200 text-gray-600'}`}
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#4e3f64] h-2.5 rounded-full" 
                style={{ width: `${(step / 8) * 100}%` }}
              ></div>
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                  >
                    <option value="">Select Course</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="business-admin">Business Administration</option>
                    <option value="electrical-eng">Electrical Engineering</option>
                    <option value="medicine">Medicine</option>
                    <option value="law">Law</option>
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
                        checked={formData.studyMode === 'full-time'}
                        onChange={handleChange}
                        className=" h-4 w-4 text-[#4e3f64] border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Full-time
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="studyMode"
                        value="distance"
                        checked={formData.studyMode === 'distance'}
                        onChange={handleChange}
                        className=" h-4 w-4 text-[#4e3f64] border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Distance Learning
                      </label>
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Relationship</label>
                  <input
                    type="text"
                    name="guardianRelationship"
                    value={formData.guardianRelationship}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="guardianAddress"
                    value={formData.guardianAddress}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
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
                <h3 className="text-lg font-semibold mb-2">Terms and Conditions</h3>
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
                      className=" h-4 w-4 text-[#4e3f64] border-gray-300 rounded"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  "
                />
                <p className="mt-1 text-sm text-gray-500">Your typed name serves as your electronic signature</p>
              </div>
            </div>
          )}

          {/* Step 8: Payment */}
          {step === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Information</h2>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Application Fee: $50</h3>
                <p className="text-gray-700">Payment is required to process your application.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="credit-card"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleChange}
                      className=" h-4 w-4 text-[#4e3f64] border-gray-300"
                    />
                    <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bank-transfer"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={handleChange}
                      className=" h-4 w-4 text-[#4e3f64] border-gray-300"
                    />
                    <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                      Bank Transfer
                    </label>
                  </div>
                </div>
              </div>
              
              {formData.paymentMethod === 'bank-transfer' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-[#4e3f64] mb-2">Bank Transfer Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Bank Name:</span> University Trust Bank</p>
                    <p><span className="font-medium">Account Name:</span> University Admissions</p>
                    <p><span className="font-medium">Account Number:</span> 1234567890</p>
                    <p><span className="font-medium">Sort Code:</span> 04-00-04</p>
                    <p><span className="font-medium">Reference:</span> Your Application ID</p>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Upload Payment Proof *</label>
                    <input
                      type="file"
                      name="paymentProof"
                      onChange={handleChange}
                      required={formData.paymentMethod === 'bank-transfer'}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#4e3f64] hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">Upload proof of bank transfer (5MB max)</p>
                  </div>
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 "
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4e3f64] hover:bg-[#4e3f64] focus:outline-none focus:ring-2 focus:ring-offset-2 "
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#c0b15f] hover:bg-[#c0b15f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#c0b15f]"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}