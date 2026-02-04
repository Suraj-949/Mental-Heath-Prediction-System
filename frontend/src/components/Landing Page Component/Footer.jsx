import React from 'react'
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <>
    {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-xl bg-white/5 px-10 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-purple-500/50">
                  MH
                </div>
                <span className="text-xl font-semibold text-slate-100">
                  Mental Health Prediction
                </span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Empowering individuals to take control of their mental wellness through 
                advanced AI-powered predictions and personalized care.
              </p>
              <p className="text-slate-500 text-sm">
                © 2026 Mental Health Prediction. All rights reserved.
              </p>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-slate-400 hover:text-purple-400 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#feature" className="text-slate-400 hover:text-purple-400 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-slate-400 hover:text-purple-400 transition">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-purple-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-purple-400 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-purple-400 transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm">
                If you're in crisis, please call the National Suicide Prevention Lifeline at 988
              </p>
              <div className="flex gap-4">
                
                {/*Facebook*/}
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-400 transition"
                >
                  <Facebook size={28} className="text-slate-400 hover:text-purple-500 transition cursor-pointer"/>
                </a>
                

                {/*Instagram*/}
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-400 transition"
                >
                  <Instagram size={28} className="text-slate-400 hover:text-purple-500 transition cursor-pointer"/>
                </a>
                
                {/*Twitter*/}
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-500 transition cursor-pointer"
                >
                  <Twitter size={28} />
                </a>

              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer