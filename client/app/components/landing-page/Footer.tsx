import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Asset path
const LOGO_PATH = '/logo.png'; 

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/95 border-t border-indigo-900 text-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
                {/* Main Grid: Logo/Copyright and Navigation Links */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-10 mb-8">
                    {/* Column 1: Logo and Company Info */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center mb-4">
                            <Image 
                                src={LOGO_PATH} 
                                alt="Warmly Logo" 
                                width={64} 
                                height={64} 
                                className="w-16 h-16 mr-2"
                            />
                        </Link>
                        <p className="text-sm text-gray-600">
                            The easiest way to manage investor introductions.
                        </p>
                    </div>

                    {/* Column 2: Company Links */}
                    <div>
                        <h3 className="text-md font-semibold mb-4 text-gray-900">Company</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-gray-500 hover:text-gray-800 transition duration-150 text-sm">About Us</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-gray-800 transition duration-150 text-sm">Terms of Service</Link></li>
                            <li><Link href="/contact" className="text-gray-500 hover:text-gray-800 transition duration-150 text-sm">Contact</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar: Copyright */}
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Warmly Introduction Assistant. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;