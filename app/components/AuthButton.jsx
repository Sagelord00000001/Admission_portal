'use client';

import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function AuthButton() {
  return (
    <div className="space-y-4">
      <LoginLink className="w-full block text-center bg-[#4e3f64] hover:bg-[#342a42] text-white font-medium py-3 px-4 rounded-lg transition duration-200">
        Sign In
      </LoginLink>
      <RegisterLink className="w-full block text-center border-2 border-[#4e3f64] text-[#4e3f64] hover:bg-indigo-50 font-medium py-3 px-4 rounded-lg transition duration-200">
        Create Account
      </RegisterLink>
    </div>
  );
}