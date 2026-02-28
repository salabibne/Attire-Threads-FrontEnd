"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { IoIosCall, IoIosSearch, IoIosArrowDown, IoMdMenu, IoMdClose } from "react-icons/io";
import { FaShoppingCart, FaUser, FaInfoCircle, FaCommentAlt, FaExchangeAlt, FaRegHeart } from "react-icons/fa";
import { MdTranslate } from "react-icons/md";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

const Navbar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const testCategories = [...categories, ...categories, ...categories, ...categories].slice(0, 10);
  const [loading, setLoading] = useState(true);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState("All Categories");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories from http://localhost:3000/v1/category...");
        const response = await axios.get("http://localhost:3000/v1/category");
        console.log("Categories response:", response.data);
        if (response.data.statusCode === 200) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories with axios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="fixed top-0 left-0  right-0 z-50 bg-white shadow-sm border-b border-gray-100 font-ubuntu">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout (lg and up) */}
        <div className="hidden lg:flex justify-between items-center py-4 gap-x-8">

          {/* Left Part: Logo */}
          <div className="flex-shrink-0 flex items-center mt-2">
            <Link href="/" className="relative block" style={{ width: '120px', height: '120px' }}>
              <Image
                src="https://i.ibb.co.com/sp0mhmpq/attirelogo.jpg"
                alt="ATTIRE THREADS Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right Part: Content Area */}
          <div className="flex-1 flex flex-col pt-2 ">

            {/* Top Row: Utility Links */}
            <div className="flex justify-end items-center mb-6">
              <div className="flex items-center space-x-6">
                <Link href="/login" className="text-primary-brown text-sm font-medium hover:text-[#490D27] transition-colors">Login</Link>
                <Link href="/about" className="text-primary-brown text-sm font-medium hover:text-[#490D27] transition-colors">About us</Link>
                <Link href="/complain" className="text-primary-brown text-sm font-medium hover:text-[#490D27] transition-colors">Complain</Link>
                <Link href="/compare" className="text-primary-brown text-sm font-medium hover:text-[#490D27] transition-colors">Compare</Link>
              </div>
            </div>


            {/* Middle Row: Search, Call Us, and Cart */}
            <div className="flex justify-normal items-center gap-10">
              {/* 3-Part Search Bar */}
              <div className="flex-1 flex  items-center bg-[#490D27]/5 rounded-md border border-[#490D27]/20 overflow-hidden max-w-2xl">
                {/* Part 1: Placeholder/Input */}
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 px-4 py-2 bg-transparent outline-none text-primary-brown placeholder:text-primary-brown/60"
                />

                {/* Part 2: Category Dropdown */}
                <div className="relative border-l border-[#490D27]/20 bg-white/50">
                  <button
                    onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-primary-brown hover:bg-white/80 transition-colors h-full whitespace-nowrap"
                  >
                    <span className="text-sm font-medium">{selectedSearchCategory}</span>
                    <IoIosArrowDown className={`transition-transform duration-200 ${isSearchDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSearchDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-100 shadow-xl rounded-md z-[60] py-2">
                      <button
                        onClick={() => { setSelectedSearchCategory("All Categories"); setIsSearchDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-primary-brown hover:bg-gray-50"
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <div key={cat.id} className="group/item relative">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-primary-brown hover:bg-gray-50 flex justify-between items-center"
                          >
                            {cat.name}
                            {cat.subcategories?.length > 0 && <IoIosArrowDown className="-rotate-90 text-xs" />}
                          </button>
                          {cat.subcategories?.length > 0 && (
                            <div className="absolute left-full top-0 ml-px invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 bg-white border border-gray-100 shadow-xl rounded-md py-2 w-48 transition-all">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => { setSelectedSearchCategory(`${cat.name} > ${sub.name}`); setIsSearchDropdownOpen(false); }}
                                  className="w-full text-left px-4 py-2 text-sm text-primary-brown hover:bg-gray-50"
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Part 3: Search Icon Button */}
                <button className="bg-[#490D27] text-white px-6 py-2 hover:bg-[#490D27]/90 transition-colors h-full flex items-center justify-center">
                  <IoIosSearch className="text-2xl" />
                </button>
              </div>

              {/* Call Us Now */}

              <div className="flex  items-center space-x-3 whitespace-nowrap">
                <div className="bg-[#490D27]/10 p-2 rounded-full">
                  <IoIosCall className="text-2xl text-[#490D27]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-gray-500 text-xs">Call Us Now</span>
                  <span className="text-primary-brown font-bold text-sm">+88 015403433940</span>
                </div>
              </div>

              {/* Translator, Wishlist, and Cart Section */}
              <div className="flex items-center space-x-4 pl-4">
                {/* Translator Icon */}
                <div className="relative group cursor-pointer bg-[#490D27]/5 p-3 rounded-full hover:bg-[#490D27]/10 transition-all duration-300">
                  <MdTranslate className="text-2xl text-[#490D27]" />
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#490D27] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Translate
                  </span>
                </div>

                {/* Wishlist Icon */}
                <div className="  relative group cursor-pointer bg-[#490D27]/5 p-3 rounded-full hover:bg-[#490D27]/10 transition-all duration-300">
                  <FaRegHeart className="text-2xl text-[#490D27]" />
                  <span className="absolute -top-1 -right-1 bg-[#490D27] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                    0
                  </span>
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#490D27] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Wishlist
                  </span>
                </div>

                {/* Cart Icon */}
                <div className="relative group cursor-pointer bg-[#490D27]/5 p-3 rounded-full hover:bg-[#490D27]/10 transition-all duration-300">
                  <FaShoppingCart className="text-2xl text-[#490D27]" />
                  <span className="absolute -top-1 -right-1 bg-[#490D27] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                    0
                  </span>
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#490D27] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Cart
                  </span>
                </div>

                {/* New Arrival Button */}
                <Link
                  href="/new-arrivals"
                  className="bg-[#EFC88A] text-[#490D27] px-4 py-2 rounded-md font-bold text-sm hover:bg-[#EFC88A]/90 transition-all whitespace-nowrap"
                >
                  New Arrival
                </Link>
              </div>
            </div>

            {/* Bottom Row: Categories Nav (below Search) */}
            <div className="mt-6 flex space-x-2 justify-between items-center">
              {loading ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="text-gray-400 text-sm">No categories</div>
              ) : (
                testCategories.map((category) => (
                  <div key={category.id} className="relative group flex items-center">
                    <button className="text-primary-brown font-medium text-sm md:text-base hover:text-opacity-80 transition-colors uppercase py-1 border-b-2 border-transparent hover:border-[#490D27]">
                      {category.name}
                    </button>

                    {/* Subcategory Dropdown */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 py-4 rounded-md z-[55]">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${category.name}/${sub.name}`}
                            className="block px-6 py-2 text-sm text-primary-brown hover:bg-gray-50 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Mobile Layout (hidden on lg) */}
        <div className="lg:hidden py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Logo */}
              <Link href="/" className="relative block w-[120px] h-[60px]">
                <Image
                  src="https://i.ibb.co.com/sp0mhmpq/attirelogo.jpg"
                  alt="ATTIRE THREADS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#490D27] hover:bg-[#490D27]/5 rounded-full transition-colors"
              >
                <IoMdMenu className="text-3xl" />
              </button>
            </div>

            {/* Mobile Actions: Search, Translator, Wishlist, Cart */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 text-[#490D27] hover:bg-[#490D27]/5 rounded-full transition-colors"
              >
                <IoIosSearch className="text-2xl" />
              </button>

              <button className="p-2 text-[#490D27] hover:bg-[#490D27]/5 rounded-full transition-colors">
                <MdTranslate className="text-2xl" />
              </button>

              <div className="relative p-2 text-[#490D27] hover:bg-[#490D27]/5 rounded-full transition-colors cursor-pointer">
                <FaRegHeart className="text-2xl" />
                <span className="absolute top-0 right-0 bg-[#490D27] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </div>

              <div className="relative p-2 text-[#490D27] hover:bg-[#490D27]/5 rounded-full transition-colors cursor-pointer">
                <FaShoppingCart className="text-2xl" />
                <span className="absolute top-0 right-0 bg-[#490D27] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </div>

              {/* New Arrival Button (Mobile) */}
              <Link
                href="/new-arrivals"
                className="bg-[#EFC88A] text-[#490D27] px-2 py-1 rounded-md font-bold text-[10px] hover:bg-[#EFC88A]/90 transition-all whitespace-nowrap"
              >
                New Arrival
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (Expandable) */}
          <div className={`overflow-hidden transition-all duration-300 ${isMobileSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center bg-[#490D27]/5 rounded-md border border-[#490D27]/20 overflow-hidden mx-2">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 bg-transparent outline-none text-primary-brown text-sm"
              />
              <button className="bg-[#490D27] text-white px-4 py-2">
                <IoIosSearch className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer Content */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[101] shadow-2xl transition-transform duration-300 lg:hidden transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-primary-brown font-bold uppercase tracking-wider">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-[#490D27]"
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>

          {/* User Section in Drawer */}
          <div className="p-6 bg-gray-50 flex items-center space-x-4">
            <div className="bg-[#490D27]/10 p-3 rounded-full">
              <FaUser className="text-xl text-[#490D27]" />
            </div>
            <div className="flex flex-col">
              <span className="text-primary-brown font-medium">Guest User</span>
              <Link href="/login" className="text-[#490D27] text-sm hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Login / Register</Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6">
            {/* Main Categories Section */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 px-2">Shop Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-50">
                    <button
                      onClick={() => cat.subcategories?.length > 0 ? toggleCategory(cat.id) : null}
                      className="w-full flex items-center justify-between py-3 px-2 text-left"
                    >
                      <span className="text-primary-brown font-medium">{cat.name}</span>
                      {cat.subcategories?.length > 0 && (
                        <IoIosArrowDown className={`text-gray-400 transition-transform duration-200 ${expandedCategories.includes(cat.id) ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    {cat.subcategories?.length > 0 && expandedCategories.includes(cat.id) && (
                      <div className="bg-gray-50/50 py-2 pl-4 space-y-2">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${cat.name}/${sub.name}`}
                            className="block py-2 px-2 text-sm text-primary-brown/80 hover:text-[#490D27]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Utility Links Section */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 px-2">Help & Tools</h3>
              <div className="grid grid-cols-2 gap-4 px-2">
                <Link href="/about" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-[#490D27]/5 text-primary-brown" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaInfoCircle className="mb-2 text-[#490D27]" />
                  <span className="text-xs">About</span>
                </Link>
                <Link href="/complain" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-[#490D27]/5 text-primary-brown" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaCommentAlt className="mb-2 text-[#490D27]" />
                  <span className="text-xs">Complain</span>
                </Link>
                <Link href="/compare" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-[#490D27]/5 text-primary-brown" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaExchangeAlt className="mb-2 text-[#490D27]" />
                  <span className="text-xs">Compare</span>
                </Link>
                <Link href="/call" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-[#490D27]/5 text-primary-brown" onClick={() => setIsMobileMenuOpen(false)}>
                  <IoIosCall className="mb-2 text-[#490D27]" />
                  <span className="text-xs">Support</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Contact in Drawer */}
          <div className="mt-auto p-6 border-t text-center">
            <span className="text-xs text-gray-400 block mb-2 font-medium">Need Help? Call Us</span>
            <span className="text-primary-brown font-bold">+88 015403433940</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
