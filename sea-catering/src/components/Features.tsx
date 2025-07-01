'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  MapPin, 
  BarChart3, 
  Calendar, 
  Leaf, 
  Shield, 
  Award, 
  Truck,
  Clock,
  Heart,
  ChefHat,
  Users
} from 'lucide-react';

const Features = () => {
  const router = useRouter();
  const features = [
    {
      title: "Smart Meal Customization",
      description: "AI-powered recommendations tailored to your dietary preferences, allergies, and health goals. Create the perfect meal plan that evolves with your needs.",
      icon: Settings,
      color: "emerald",
      stats: "95% Satisfaction",
      benefits: ["Dietary restrictions support", "Personalized nutrition", "AI meal matching"]
    },
    {
      title: "Indonesia-Wide Delivery",
      description: "From Jakarta to Bali, enjoy fresh meals delivered to your door. Our cold-chain logistics ensure quality across 50+ cities nationwide.",
      icon: MapPin,
      color: "blue",
      stats: "50+ Cities",
      benefits: ["Same-day delivery", "Temperature controlled", "Real-time tracking"]
    },
    {
      title: "Detailed Nutrition Analytics",
      description: "Track macros, calories, and nutrients with precision. Get insights into your eating patterns and progress toward your health goals.",
      icon: BarChart3,
      color: "purple",
      stats: "25+ Metrics",
      benefits: ["Macro tracking", "Progress insights", "Health goal alignment"]
    },
    {
      title: "Flexible Scheduling",
      description: "Daily, weekly, or monthly plans that adapt to your lifestyle. Pause, skip, or modify deliveries with just a few taps.",
      icon: Calendar,
      color: "orange",
      stats: "24/7 Control",
      benefits: ["Flexible timing", "Easy modifications", "Pause anytime"]
    },
    {
      title: "Premium Fresh Ingredients",
      description: "Locally sourced, organic when possible, and delivered within 24 hours of preparation. Taste the difference quality makes.",
      icon: Leaf,
      color: "green",
      stats: "Farm to Table",
      benefits: ["Locally sourced", "Organic options", "24hr freshness"]
    },
    {
      title: "Quality Guarantee",
      description: "Not satisfied? We'll make it right with our 100% satisfaction guarantee. Your health and happiness are our top priorities.",
      icon: Shield,
      color: "red",
      stats: "100% Guarantee",
      benefits: ["Full refund policy", "Quality assurance", "Customer first"]
    }
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: ChefHat, value: "100+", label: "Expert Chefs" },
    { icon: Award, value: "4.9", label: "Average Rating" },
    { icon: Truck, value: "99%", label: "On-Time Delivery" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: {
        bg: "bg-emerald-50",
        icon: "bg-emerald-100 text-emerald-600",
        accent: "text-emerald-600",
        border: "border-emerald-200",
        hover: "hover:bg-emerald-100"
      },
      blue: {
        bg: "bg-blue-50",
        icon: "bg-blue-100 text-blue-600",
        accent: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:bg-blue-100"
      },
      purple: {
        bg: "bg-purple-50",
        icon: "bg-purple-100 text-purple-600",
        accent: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:bg-purple-100"
      },
      orange: {
        bg: "bg-orange-50",
        icon: "bg-orange-100 text-orange-600",
        accent: "text-orange-600",
        border: "border-orange-200",
        hover: "hover:bg-orange-100"
      },
      green: {
        bg: "bg-green-50",
        icon: "bg-green-100 text-green-600",
        accent: "text-green-600",
        border: "border-green-200",
        hover: "hover:bg-green-100"
      },
      red: {
        bg: "bg-red-50",
        icon: "bg-red-100 text-red-600",
        accent: "text-red-600",
        border: "border-red-200",
        hover: "hover:bg-red-100"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80')`
          }}
        />
        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/30 to-green-50/50" />
      </div>
      
      {/* Background Pattern (subtle) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>Why Choose SEA Catering</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your Health, <span className="text-emerald-600">Our Priority</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the perfect blend of convenience, nutrition, and taste. Join thousands of satisfied customers who've transformed their eating habits with us.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors duration-300">
                <stat.icon className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative bg-white/85 backdrop-blur-md rounded-2xl p-8 shadow-lg border-2 ${colorClasses.border} ${colorClasses.hover} transition-all duration-300 hover:shadow-2xl hover:bg-white/95 overflow-hidden`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 ${colorClasses.icon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className={`text-sm font-bold ${colorClasses.accent} bg-white px-3 py-1 rounded-full border`}>
                      {feature.stats}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + benefitIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-1.5 h-1.5 ${colorClasses.accent.replace('text-', 'bg-')} rounded-full`} />
                        <span className="text-sm text-gray-600 font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 border-2 ${colorClasses.accent.replace('text-', 'border-')} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-emerald-600/90 to-green-600/90 backdrop-blur-md rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-emerald-500/30">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Eating Habits?
            </h3>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who've made the switch to healthier, convenient meals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="bg-white text-emerald-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Start Your Journey
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
