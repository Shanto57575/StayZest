import React from "react";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
	FaHeart,
} from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

const Footer = () => {
	return (
		<footer className="bg-gray-100 dark:bg-gray-950/35 font-serif">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* About Section */}
					<div>
						<h3 className="text-2xl font-bold mb-4 text-blue-500">StayZest</h3>
						<p className="mb-4">
							Discover unique stays and experiences around the world with
							StayZest. Your next adventure is just a click away!
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-blue-500 hover:text-blue-500 transition-colors duration-300"
							>
								<FaFacebookF size={20} />
							</a>
							<a
								href="#"
								className="text-blue-500 hover:text-blue-500 transition-colors duration-300"
							>
								<FaTwitter size={20} />
							</a>
							<a
								href="#"
								className="text-blue-500 hover:text-blue-500 transition-colors duration-300"
							>
								<FaInstagram size={20} />
							</a>
							<a
								href="#"
								className="text-blue-500 hover:text-blue-500 transition-colors duration-300"
							>
								<FaLinkedinIn size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-xl font-semibold mb-4 text-blue-500">
							Quick Links
						</h3>
						<ul className="space-y-2 ml-1">
							<li>
								<a
									href="#"
									className="hover:text-blue-500 transition-colors duration-300"
								>
									Home
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-blue-500 transition-colors duration-300"
								>
									Explore
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-blue-500 transition-colors duration-300"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-blue-500 transition-colors duration-300"
								>
									Contact
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-blue-500 transition-colors duration-300"
								>
									Blog
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-xl font-semibold mb-4 text-blue-500">
							Contact Us
						</h3>
						<ul className="space-y-2">
							<li className="flex items-center">
								<MdLocationOn className="mr-2 text-blue-500" size={20} />
								<span>789 Booking Street, Travel City</span>
							</li>
							<li className="flex items-center">
								<MdPhone className="mr-2 text-blue-500" size={20} />
								<span>+1 (123) 456-7890</span>
							</li>
							<li className="flex items-center">
								<MdEmail className="mr-2 text-blue-500" size={20} />
								<span>info@stayzest.com</span>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h3 className="text-xl font-semibold mb-4 text-blue-500">
							Newsletter
						</h3>
						<p className="mb-4">Stay updated with our latest offers and news</p>
						<form className="flex flex-col sm:flex-row">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-grow px-4 py-2 text-black mb-2 sm:mb-0 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-300 border border-gray-300"
							/>
							<button
								type="submit"
								className="bg-blue-500 text-white font-bold px-4 py-2 rounded-lg sm:rounded-l-none hover:bg-blue-600 transition-colors duration-300"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-8 border-t border-gray-300 text-center">
					<p className="dark:text-gray-400 text-gray-700">
						© {new Date().getFullYear()} StayZest. All rights reserved. Created
						with <FaHeart className="inline-block text-red-500" /> by Sh@nto
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
