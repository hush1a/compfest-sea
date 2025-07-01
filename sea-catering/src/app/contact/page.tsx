'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  MessageSquare, 
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Headphones,
  Shield,
  Zap,
  Heart,
  Star,
  Award,
  Instagram,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    urgency: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const contactInfo = [
    {
      icon: Phone,
      title: '24/7 Customer Support',
      details: '+62 812 3456 789',
      description: 'Call us anytime for immediate assistance',
      color: 'emerald'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: 'support@seacatering.com',
      description: 'We respond within 2 hours',
      color: 'blue'
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      details: 'Jakarta, Indonesia',
      description: 'Central Kitchen & Office',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: '6 AM - 10 PM',
      description: 'Monday to Sunday',
      color: 'orange'
    }
  ];

  const features = [
    { icon: Zap, title: 'Quick Response', description: 'Average reply time: 15 minutes' },
    { icon: Shield, title: 'Secure Communication', description: 'Your data is protected' },
    { icon: Heart, title: 'Personal Touch', description: 'Real humans, real care' },
    { icon: Award, title: 'Expert Support', description: 'Trained professionals' }
  ];

  const socialLinks = [
    { icon: Instagram, url: 'https://instagram.com/seacatering', name: 'Instagram' },
    { icon: Facebook, url: 'https://facebook.com/seacatering', name: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com/seacatering', name: 'Twitter' },
    { icon: Linkedin, url: 'https://linkedin.com/company/seacatering', name: 'LinkedIn' }
  ];

  const faqs: FAQ[] = [
    {
      question: 'How far in advance should I place my order?',
      answer: 'We recommend placing your order at least 24 hours in advance to ensure availability. For subscription plans, you can set up automatic deliveries. For special events or large orders, please contact us at least 48-72 hours ahead to guarantee your preferred menu items.'
    },
    {
      question: 'Do you accommodate dietary restrictions and allergies?',
      answer: 'Absolutely! We offer various meal plans including vegetarian, vegan, gluten-free, keto, and halal options. We take allergies very seriously and have strict protocols in place. Please specify your dietary requirements when placing your order, and our chefs will ensure your meals are prepared safely.'
    },
    {
      question: 'What are your delivery areas and fees?',
      answer: 'We currently deliver throughout Jakarta, Bogor, Depok, Tangerang, and Bekasi (Jabodetabek area). Delivery is free for subscription orders and orders above IDR 200,000. Standard delivery fee is IDR 15,000 within Jakarta and IDR 25,000 for surrounding areas.'
    },
    {
      question: 'Can I pause, modify, or cancel my subscription?',
      answer: 'Yes, you have complete flexibility with your subscription! You can pause for up to 4 weeks, modify your meal preferences, change delivery days, or cancel anytime through your dashboard. Changes made before 6 PM take effect the next business day.'
    },
    {
      question: 'How do you ensure food safety and freshness?',
      answer: 'Food safety is our top priority. We use temperature-controlled vehicles, prepare meals fresh daily, and follow strict HACCP guidelines. All meals are delivered in insulated packaging and should be consumed within 2-3 days when refrigerated properly.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard), bank transfers, GoPay, OVO, DANA, and ShopeePay. For subscriptions, we offer automatic billing to make your experience seamless.'
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        urgency: 'medium'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Headphones className="w-4 h-4" />
                We're Here to Help
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Get in Touch
                <span className="text-emerald-600 block">with Our Team</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Have questions about our meal plans? Need help with your subscription? Our friendly support team is ready to assist you 24/7.
              </p>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Information Cards */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <div className={`w-12 h-12 bg-${info.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <info.icon className={`w-6 h-6 text-${info.color}-600`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-1">{info.details}</p>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-12">
                {/* Form */}
                <div className="lg:col-span-3">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-2xl p-8"
                  >
                    <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-emerald-600" />
                      Send us a Message
                    </motion.h2>

                    <AnimatePresence>
                      {submitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-12"
                        >
                          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                          <p className="text-gray-600 mb-6">
                            Thank you for reaching out. We'll get back to you within 2 hours during business hours.
                          </p>
                          <button
                            onClick={() => setSubmitted(false)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                          >
                            Send Another Message
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form 
                          variants={itemVariants}
                          onSubmit={handleSubmit} 
                          className="space-y-6"
                        >
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name *
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="text"
                                  value={formData.name}
                                  onChange={(e) => handleInputChange('name', e.target.value)}
                                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="Your full name"
                                />
                              </div>
                              {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address *
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="your.email@example.com"
                                />
                              </div>
                              {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number (Optional)
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                  placeholder="+62 812 3456 789"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Urgency Level
                              </label>
                              <select
                                value={formData.urgency}
                                onChange={(e) => handleInputChange('urgency', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                              >
                                <option value="low">Low - General inquiry</option>
                                <option value="medium">Medium - Need help</option>
                                <option value="high">High - Urgent issue</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Subject *
                            </label>
                            <input
                              type="text"
                              value={formData.subject}
                              onChange={(e) => handleInputChange('subject', e.target.value)}
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                errors.subject ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="What's this about?"
                            />
                            {errors.subject && (
                              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Message *
                            </label>
                            <textarea
                              rows={5}
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                errors.message ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Tell us how we can help you..."
                            />
                            {errors.message && (
                              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formData.message.length}/500 characters
                            </p>
                          </div>

                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending Message...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Send Message
                              </span>
                            )}
                          </motion.button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-2">
                  <div className="sticky top-8 space-y-8">
                    {/* Quick Contact */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 text-white"
                    >
                      <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
                      <p className="mb-6 text-emerald-100">
                        For urgent matters, call us directly or chat with our support team.
                      </p>
                      <div className="space-y-4">
                        <a
                          href="tel:+6281234567890"
                          className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                          <span>+62 812 3456 789</span>
                        </a>
                        <a
                          href="mailto:support@seacatering.com"
                          className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                          <span>support@seacatering.com</span>
                        </a>
                      </div>
                    </motion.div>

                    {/* Social Media */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                      <p className="text-gray-600 mb-6">
                        Stay connected for updates, recipes, and healthy living tips.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {socialLinks.map((social) => (
                          <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <social.icon className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">{social.name}</span>
                          </a>
                        ))}
                      </div>
                    </motion.div>

                    {/* Reviews */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        <div>
                          <div className="font-bold text-gray-900">4.9/5 Rating</div>
                          <div className="text-sm text-gray-600">Based on 1,200+ reviews</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        "Exceptional customer service and delicious meals. The support team is always helpful and responsive!"
                      </p>
                      <div className="text-sm text-gray-500 mt-2">- Sarah J., Jakarta</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600">
                  Quick answers to common questions about our service
                </p>
              </motion.div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {openFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
