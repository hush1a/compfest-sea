'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, ShoppingBag, Home, BookOpen, MessageSquare, Phone, BarChart3, UserCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import UserProfile from './auth/UserProfile'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user, isLoading } = useAuth()

  const publicItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'menu', label: 'Meal Plans', path: '/menu', icon: BookOpen },
    { id: 'testimonials', label: 'Testimonials', path: '/testimonials', icon: MessageSquare },
    { id: 'contact', label: 'Contact Us', path: '/contact', icon: Phone }
  ]

  const protectedItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { id: 'subscription', label: 'Subscribe', path: '/subscription', icon: ShoppingBag }
  ]

  const adminItems = [
    { id: 'admin', label: 'Admin Dashboard', path: '/admin', icon: BarChart3 }
  ]

  const getNavigationItems = () => {
    let items = [...publicItems];
    if (isAuthenticated) {
      items = [...items, ...protectedItems];
      if (user?.role === 'admin') {
        items = [...items, ...adminItems];
      }
    }
    return items;
  };

  const allItems = getNavigationItems();

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">SEA Catering</span>
                <p className="text-xs text-gray-500 leading-none">Premium Meals</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {allItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
                      isActive(item.path)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-green-100 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="hidden lg:flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        Welcome, <span className="font-semibold text-gray-900">{user?.email}</span>
                      </span>
                      <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform duration-200 shadow-lg"
                      >
                        <UserCircle size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="hidden lg:flex items-center space-x-3">
                      <Link
                        href="/login"
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-3">
                  {allItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive(item.path)
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <Icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}

                  {!isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: allItems.length * 0.1 }}
                      className="pt-4 border-t border-gray-100"
                    >
                      {isAuthenticated ? (
                        <div className="flex flex-col space-y-3">
                          <div className="px-4 py-2">
                            <p className="text-sm text-gray-600">
                              Welcome, <span className="font-semibold text-gray-900">{user?.email}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setShowProfile(!showProfile)
                              setIsMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                          >
                            <User size={20} />
                            <span>Profile</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3">
                          <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                          >
                            <User size={20} />
                            <span>Sign In</span>
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-all duration-200"
                          >
                            <span>Get Started</span>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* User Profile Dropdown */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-6 z-50"
          >
            <UserProfile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfile(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
