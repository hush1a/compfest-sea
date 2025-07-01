'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Check, 
  CheckCircle, 
  Star, 
  Shield, 
  Clock, 
  Truck, 
  Heart, 
  Calculator,
  DollarSign,
  Calendar,
  Utensils,
  User,
  Phone,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Gift,
  Target,
  Award,
  Zap,
  Package
} from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { subscriptionApi } from '../../services/api';

interface SubscriptionFormData {
  name: string;
  phone: string;
  plan: 'diet' | 'protein' | 'royal';
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
}

const planPrices = {
  diet: 30000,
  protein: 40000,
  royal: 60000
};

const planDetails = {
  diet: {
    name: 'Diet Plan',
    description: 'Perfect for weight management',
    features: ['Low calorie meals', 'Balanced nutrition', 'Fresh vegetables', 'Portion controlled'],
    badge: 'Most Popular',
    color: 'emerald',
    icon: Target
  },
  protein: {
    name: 'Protein Plan', 
    description: 'Ideal for muscle building',
    features: ['High protein content', 'Lean meats', 'Post-workout meals', 'Energy boosting'],
    badge: 'Athletes Choice',
    color: 'blue',
    icon: Zap
  },
  royal: {
    name: 'Royal Plan',
    description: 'Premium gourmet experience',
    features: ['Premium ingredients', 'Chef curated', 'Gourmet recipes', 'Luxury presentation'],
    badge: 'Premium',
    color: 'purple',
    icon: Award
  }
};

const mealOptions = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', description: 'Start your day right' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', description: 'Midday fuel' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', description: 'Evening satisfaction' }
];

const dayOptions = [
  { id: 'monday', label: 'Mon', fullLabel: 'Monday' },
  { id: 'tuesday', label: 'Tue', fullLabel: 'Tuesday' },
  { id: 'wednesday', label: 'Wed', fullLabel: 'Wednesday' },
  { id: 'thursday', label: 'Thu', fullLabel: 'Thursday' },
  { id: 'friday', label: 'Fri', fullLabel: 'Friday' },
  { id: 'saturday', label: 'Sat', fullLabel: 'Saturday' },
  { id: 'sunday', label: 'Sun', fullLabel: 'Sunday' }
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<'diet' | 'protein' | 'royal'>('diet');
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      name: '',
      phone: '',
      plan: 'diet',
      mealTypes: [],
      deliveryDays: [],
      allergies: ''
    }
  });

  const watchedName = watch('name');
  const watchedPhone = watch('phone');

  // Calculate total price
  const calculatePrice = () => {
    if (selectedMealTypes.length === 0 || selectedDays.length === 0) {
      return 0;
    }
    
    const planPrice = planPrices[selectedPlan];
    const mealTypesCount = selectedMealTypes.length;
    const deliveryDaysCount = selectedDays.length;
    const multiplier = 4.3;
    
    return planPrice * mealTypesCount * deliveryDaysCount * multiplier;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePlanChange = (plan: 'diet' | 'protein' | 'royal') => {
    setSelectedPlan(plan);
    setValue('plan', plan);
  };

  const handleMealTypeToggle = (mealType: string) => {
    const updatedMealTypes = selectedMealTypes.includes(mealType)
      ? selectedMealTypes.filter(type => type !== mealType)
      : [...selectedMealTypes, mealType];
    
    setSelectedMealTypes(updatedMealTypes);
    setValue('mealTypes', updatedMealTypes);
  };

  const handleDayToggle = (day: string) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(updatedDays);
    setValue('deliveryDays', updatedDays);
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    
    try {
      const subscriptionData = {
        name: data.name,
        phone: data.phone,
        plan: selectedPlan,
        mealTypes: selectedMealTypes,
        deliveryDays: selectedDays,
        allergies: data.allergies || ''
      };

      const response = await subscriptionApi.create(subscriptionData);
      
      if (response.success) {
        setShowSuccess(true);
        // Reset form
        setSelectedMealTypes([]);
        setSelectedDays([]);
        setSelectedPlan('diet');
      } else {
        throw new Error('Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription creation error:', error);
      alert(`Error creating subscription: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = calculatePrice();
  const savings = totalPrice * 0.2; // 20% savings

  const steps = [
    { title: 'Choose Plan', completed: !!selectedPlan },
    { title: 'Select Meals', completed: selectedMealTypes.length > 0 },
    { title: 'Pick Days', completed: selectedDays.length > 0 },
    { title: 'Personal Info', completed: watchedName && watchedPhone }
  ];

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

  const benefits = [
    { icon: DollarSign, title: 'Save up to 20%', description: 'Compared to individual orders' },
    { icon: Shield, title: 'Quality Guarantee', description: 'Fresh ingredients daily' },
    { icon: Truck, title: 'Free Delivery', description: 'On all subscription orders' },
    { icon: Calendar, title: 'Flexible Schedule', description: 'Pause or modify anytime' }
  ];

  if (showSuccess) {
    return (
      <ProtectedRoute>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-4"
              >
                Subscription Created!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                Your healthy meal journey starts now. We'll process your subscription and contact you shortly.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Create Another Subscription
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
                <Sparkles className="w-4 h-4" />
                Start Your Healthy Journey
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Create Your Personal
                <span className="text-emerald-600 block">Meal Subscription</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Choose from our expertly crafted meal plans and enjoy fresh, healthy meals delivered to your door. Cancel or modify anytime.
              </p>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Subscription Form */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Progress Steps */}
                <div className="bg-gray-50 px-8 py-6 border-b">
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                      <div key={step.title} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step.completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step.completed ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${
                          step.completed ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </span>
                        {index < steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Content */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Plan Selection */}
                      <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <Package className="w-6 h-6 text-emerald-600" />
                          Choose Your Plan
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          {Object.entries(planDetails).map(([planKey, plan]) => {
                            const IconComponent = plan.icon;
                            return (
                              <motion.div
                                key={planKey}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                                  selectedPlan === planKey
                                    ? `border-${plan.color}-500 bg-${plan.color}-50 shadow-lg`
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                                onClick={() => handlePlanChange(planKey as 'diet' | 'protein' | 'royal')}
                              >
                                {plan.badge && (
                                  <div className={`absolute -top-2 left-4 bg-${plan.color}-600 text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                    {plan.badge}
                                  </div>
                                )}
                                
                                <div className="text-center">
                                  <div className={`w-12 h-12 bg-${plan.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                    <IconComponent className={`w-6 h-6 text-${plan.color}-600`} />
                                  </div>
                                  <h4 className="font-bold text-gray-900 mb-1">{plan.name}</h4>
                                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                                  <p className="text-2xl font-bold text-emerald-600 mb-4">
                                    {formatPrice(planPrices[planKey as keyof typeof planPrices])}
                                  </p>
                                  <div className="space-y-2">
                                    {plan.features.map((feature, index) => (
                                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        {feature}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* Meal Types */}
                      <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <Utensils className="w-6 h-6 text-emerald-600" />
                          Select Meal Types
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          {mealOptions.map((meal) => (
                            <motion.div
                              key={meal.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                                selectedMealTypes.includes(meal.id)
                                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                              onClick={() => handleMealTypeToggle(meal.id)}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-3">{meal.icon}</div>
                                <h4 className="font-semibold text-gray-900 mb-1">{meal.label}</h4>
                                <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                                {selectedMealTypes.includes(meal.id) && (
                                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {selectedMealTypes.length === 0 && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Please select at least one meal type
                          </p>
                        )}
                      </motion.div>

                      {/* Delivery Days */}
                      <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <Calendar className="w-6 h-6 text-emerald-600" />
                          Delivery Days
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                          {dayOptions.map((day) => (
                            <motion.div
                              key={day.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`border-2 rounded-xl p-4 cursor-pointer transition-all text-center ${
                                selectedDays.includes(day.id)
                                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                              onClick={() => handleDayToggle(day.id)}
                            >
                              <div className="font-semibold text-gray-900 mb-1">{day.label}</div>
                              {selectedDays.includes(day.id) && (
                                <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                        {selectedDays.length === 0 && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Please select at least one delivery day
                          </p>
                        )}
                      </motion.div>

                      {/* Personal Information */}
                      <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <User className="w-6 h-6 text-emerald-600" />
                          Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              {...register('name', { 
                                required: 'Full name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' }
                              })}
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter your full name"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                id="phone"
                                {...register('phone', { 
                                  required: 'Phone number is required',
                                  pattern: {
                                    value: /^(\+62|62|0)[0-9]{9,13}$/,
                                    message: 'Please enter a valid Indonesian phone number'
                                  }
                                })}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                  errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., 08123456789"
                              />
                            </div>
                            {errors.phone && (
                              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6">
                          <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700 mb-2">
                            Allergies / Dietary Restrictions (Optional)
                          </label>
                          <textarea
                            id="allergies"
                            {...register('allergies')}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="Please list any allergies or dietary restrictions..."
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Price Summary Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-8">
                        <motion.div 
                          variants={itemVariants}
                          className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6"
                        >
                          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-600" />
                            Price Summary
                          </h3>
                          
                          <AnimatePresence>
                            {totalPrice > 0 ? (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                              >
                                <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Plan:</span>
                                    <span className="font-semibold">{planDetails[selectedPlan].name}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Price per meal:</span>
                                    <span className="font-semibold">{formatPrice(planPrices[selectedPlan])}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Meal types:</span>
                                    <span className="font-semibold">{selectedMealTypes.length}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery days:</span>
                                    <span className="font-semibold">{selectedDays.length}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Monthly multiplier:</span>
                                    <span className="font-semibold">4.3 weeks</span>
                                  </div>
                                </div>

                                <hr className="border-emerald-200" />

                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">{formatPrice(totalPrice + savings)}</span>
                                  </div>
                                  <div className="flex justify-between text-emerald-600">
                                    <span className="flex items-center gap-1">
                                      <Gift className="w-4 h-4" />
                                      Subscription discount:
                                    </span>
                                    <span className="font-semibold">-{formatPrice(savings)}</span>
                                  </div>
                                </div>

                                <hr className="border-emerald-200" />

                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-bold text-gray-900">Total Monthly:</span>
                                  <span className="text-2xl font-bold text-emerald-600">{formatPrice(totalPrice)}</span>
                                </div>

                                <div className="bg-white rounded-xl p-4 mt-4">
                                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                                    <Star className="w-4 h-4" />
                                    You save {formatPrice(savings)} monthly!
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    That's 20% off compared to individual orders
                                  </p>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8"
                              >
                                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Select your preferences to see pricing</p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Submit Button */}
                          <motion.button
                            type="submit"
                            disabled={
                              isSubmitting || 
                              selectedMealTypes.length === 0 || 
                              selectedDays.length === 0 || 
                              totalPrice === 0 ||
                              !watchedName ||
                              !watchedPhone
                            }
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 ${
                              isSubmitting || selectedMealTypes.length === 0 || selectedDays.length === 0 || totalPrice === 0 || !watchedName || !watchedPhone
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg'
                            }`}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating Subscription...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Heart className="w-5 h-5" />
                                Create My Subscription
                              </span>
                            )}
                          </motion.button>

                          <p className="text-xs text-gray-500 mt-3 text-center">
                            Cancel or modify anytime. No long-term commitment.
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
