import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import logo from '../assets/profile1.png'

const Footer = () => {
  return (
    <footer className="bg-white py-10 shadow-[0px_-2px_8px_0px_rgba(0,_0,_0,_0.8)]">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className='flex items-center'>
            <Link to={"/"}><img src={logo} alt="khaja" width={200} /></Link>
          </div>
          <p className="mt-2 text-gray-900">Because Your Home Deserves the Best.</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/aboutus" className="text-gray-900 hover:text-gray-500">About GharMa</Link></li>
            <li><Link to="/contact" className="text-gray-900 hover:text-gray-500">Contact</Link></li>
            <li><Link to="/privacypolicy" className="text-gray-900 hover:text-gray-500">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex mt-3 space-x-4">
            <a href="#" className="text-gray-900 hover:text-blue-500 text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-900 hover:text-red-500 text-2xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-900 hover:text-black text-2xl">
              <FaSquareXTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-700 mt-8 border-t border-gray-700 pt-4">
        &copy; 2025 GharMa. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
