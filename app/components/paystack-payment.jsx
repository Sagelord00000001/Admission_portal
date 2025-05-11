"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PaystackPayment({
  email,
  amount,
  name,
  phone,
  onSuccess,
  onClose,
  disabled = false,
  validateForm, // Added validateForm as a prop
}) {
  const [isClient, setIsClient] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [paystackLoaded, setPaystackLoaded] = useState(false)
  const [error, setError] = useState(null)

  // Load Paystack script dynamically
  useEffect(() => {
    setIsClient(true)

    // Check if Paystack script is already loaded
    if (window.PaystackPop) {
      setPaystackLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    script.onload = () => setPaystackLoaded(true)
    script.onerror = () => setError("Failed to load payment gateway. Please refresh the page.")

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePayment = () => {
    setError(null)

    // Validate the form before proceeding
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsInitializing(true)

    try {
      if (!window.PaystackPop) {
        throw new Error("Payment gateway not loaded")
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email,
        amount,
        currency: "NGN",
        ref: new Date().getTime().toString(),
        firstname: name.split(" ")[0] || "",
        lastname: name.split(" ").slice(1).join(" ") || "",
        phone: phone || "",
        label: "Admission Application Fee",
        onClose: () => {
          setIsInitializing(false)
          onClose()
        },
        callback: (response) => {
          setIsInitializing(false)
          onSuccess(response.reference || response.trxref)
        },
      })

      handler.openIframe()
    } catch (err) {
      console.error("Paystack initialization error:", err)
      setError("Failed to initialize payment. Please try again.")
      setIsInitializing(false)
    }
  }

  if (!isClient) {
    return (
      <Button disabled className="w-full">
        Loading payment...
      </Button>
    )
  }

  return (
    <div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

      <Button
        onClick={handlePayment}
        disabled={disabled || isInitializing || !paystackLoaded || !process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}
        className="w-full bg-[#0ba4db] hover:bg-[#0a93c4]"
      >
        {isInitializing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : !paystackLoaded ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading payment gateway...
          </>
        ) : (
          "Pay Now with Paystack"
        )}
      </Button>
    </div>
  )
}
