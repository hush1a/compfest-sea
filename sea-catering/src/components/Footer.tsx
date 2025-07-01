'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook,  
  Instagram, 
  Linkedin, 
  Youtube,
  Send,
  ArrowRight,
  Heart,
  Leaf,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsSubmitting(false);
    setEmail('');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/story' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' }
    ],
    services: [
      { name: 'Meal Plans', href: '/subscription' },
      { name: 'Menu', href: '/menu' },
      { name: 'Corporate', href: '/corporate' },
      { name: 'Nutrition', href: '/nutrition' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Order Tracking', href: '/tracking' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/seacatering', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/seacatering', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/seacatering', color: 'hover:text-blue-600' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/seacatering', color: 'hover:text-red-500' }
  ];

  const features = [
    { icon: Leaf, text: 'Fresh Ingredients' },
    { icon: Shield, text: 'Quality Guaranteed' },
    { icon: Clock, text: 'On-Time Delivery' },
    { icon: Heart, text: 'Made with Love' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-6 py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-600 rounded-xl">
                  <Utensils className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">SEA Catering</h3>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Transforming your eating habits with fresh, healthy, and delicious meals delivered straight to your door. Join thousands of satisfied customers on their wellness journey.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <feature.icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200 ${social.color} group`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <motion.div key={category} variants={itemVariants}>
                  <h4 className="text-lg font-semibold mb-4 text-emerald-400 capitalize">
                    {category}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors duration-200 text-sm group flex items-center gap-1"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Newsletter Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">
                Stay Updated
              </h4>
              <p className="text-gray-300 text-sm mb-6">
                Get the latest recipes, nutrition tips, and exclusive offers delivered to your inbox.
              </p>
              
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-600 rounded-xl p-4 text-center"
                >
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold mb-1">Thank you!</p>
                  <p className="text-sm text-emerald-100">You're now subscribed to our newsletter.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Subscribe
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div>
                  <p className="text-xs text-gray-400">24/7 Customer Support</p>
                  <p className="font-semibold">+62 812 3456 789</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email Support</p>
                  <p className="font-semibold">support@seacatering.com</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Headquarters</p>
                  <p className="font-semibold">Jakarta, Indonesia</p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-400 mb-1">Serving healthy meals since 2020</p>
                <div className="flex items-center gap-2 justify-center md:justify-end">
                  <span className="text-sm font-semibold">Made with passion in Indonesia.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 bg-gray-900"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                © 2025 SEA Catering. All rights reserved. 
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
