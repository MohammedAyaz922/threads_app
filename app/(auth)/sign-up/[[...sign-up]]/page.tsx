"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-[#111826] backdrop-blur-lg shadow-xl ring-1 ring-gray-800 p-6"
      >
        <SignUp
          appearance={{
            elements: {
              rootBox: "flex flex-col items-center w-full",
              card: "bg-[#111826] shadow-2xl rounded-xl p-6 w-full backdrop-blur-lg border border-gray-800",
              headerTitle: "text-2xl font-extrabold text-white",
              headerSubtitle: "text-gray-400 text-sm mt-1",
              socialButtonsBlockButton:
                "bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md px-4 py-2 transition-all",
              dividerLine: "bg-gray-700",
              formFieldLabel: "text-gray-300 font-medium",
              formFieldInput:
                "bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500",
              formButtonPrimary:
                "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all",
              footer: {
                background: "#111826",
                padding: "1rem 2rem",
                borderRadius: "0 0 12px 12px",
                "& > div > div:nth-child(1)": {
                  background: "#111826",
                  padding: "1rem",
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
              footerActionLink:
                "text-indigo-400 hover:text-indigo-500 font-semibold transition-all",
            },
          }}
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
        />
      </motion.div>
    </div>
  );
}
