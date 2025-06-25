'use client'

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
