'use client'

import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Menu from '../pages/Menu'
import SubscriptionPage from '../pages/SubscriptionPage'
import Testimonials from '../pages/Testimonials'
import Contact from '../pages/Contact'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function App() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`${plusJakartaSans.className} min-h-screen flex items-center justify-center bg-gray-50`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading SEA Catering...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={plusJakartaSans.className}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}
