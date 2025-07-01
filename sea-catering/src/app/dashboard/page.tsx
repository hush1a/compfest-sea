'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Package, 
  TrendingUp, 
  Clock, 
  Play, 
  Pause, 
  X, 
  MoreVertical, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  PauseCircle,
  XCircle,
  DollarSign,
  Utensils,
  MapPin,
  Settings,
  Bell,
  Heart
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { subscriptionApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Subscription {
  _id: string;
  plan: string;
  mealTypes: string[];
  deliveryDays: string[];
  totalPrice: number;
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  createdAt: string;
  pausePeriods?: Array<{
    startDate: string;
    endDate: string;
    reason: string;
  }>;
  cancellationDate?: string;
  cancellationReason?: string;
}

interface PauseFormData {
  startDate: string;
  endDate: string;
  reason: string;
}

interface CancelFormData {
  reason: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    active: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    paused: { icon: PauseCircle, bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Paused' },
    cancelled: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
  }[status] || { icon: AlertCircle, bg: 'bg-gray-100', text: 'text-gray-700', label: 'Unknown' };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <Icon size={14} />
      <span>{config.label}</span>
    </span>
  );
};

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'pause' | 'cancel' | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [pauseForm, setPauseForm] = useState<PauseFormData>({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [cancelForm, setCancelForm] = useState<CancelFormData>({
    reason: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptions();
    }
  }, [isAuthenticated]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriptionApi.getUserSubscriptions();
      
      if (response.success && response.data) {
        setSubscriptions(response.data);
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('An error occurred while fetching your subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (subscriptionId: string, action: 'pause' | 'cancel' | 'reactivate') => {
    setSelectedSubscription(subscriptionId);
    setActionType(action);
    if (action === 'reactivate') {
      handleReactivate(subscriptionId);
    } else {
      setShowActionModal(true);
    }
  };

  const handlePause = async () => {
    if (!selectedSubscription) return;

    try {
      await subscriptionApi.pause(selectedSubscription, pauseForm.startDate, pauseForm.endDate, pauseForm.reason);
      await fetchSubscriptions();
      setShowActionModal(false);
      resetForms();
    } catch (err) {
      console.error('Error pausing subscription:', err);
      setError('Failed to pause subscription');
    }
  };

  const handleCancel = async () => {
    if (!selectedSubscription) return;

    try {
      await subscriptionApi.cancel(selectedSubscription, cancelForm.reason);
      await fetchSubscriptions();
      setShowActionModal(false);
      resetForms();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription');
    }
  };

  const handleReactivate = async (subscriptionId: string) => {
    try {
      await subscriptionApi.reactivate(subscriptionId);
      await fetchSubscriptions();
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError('Failed to reactivate subscription');
    }
  };

  const resetForms = () => {
    setPauseForm({ startDate: '', endDate: '', reason: '' });
    setCancelForm({ reason: '' });
    setSelectedSubscription(null);
    setActionType(null);
  };

  const getDashboardStats = () => {
    const activeCount = subscriptions.filter(sub => sub.status === 'active').length;
    const totalSpent = subscriptions.reduce((sum, sub) => sum + sub.totalPrice, 0);
    const nextDelivery = subscriptions.find(sub => sub.status === 'active')?.deliveryDays[0] || 'N/A';

    return { activeCount, totalSpent, nextDelivery };
  };

  const stats = getDashboardStats();

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 lg:px-6 py-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="h-8 bg-gray-200 rounded skeleton mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded skeleton"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-8 bg-gray-200 rounded skeleton mb-4"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="h-32 bg-gray-200 rounded skeleton"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white py-12">
          <div className="container mx-auto px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
                </h1>
                <p className="text-green-100 text-lg">
                  Manage your meal subscriptions and track your healthy journey
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex space-x-3">
                <button
                  onClick={() => router.push('/subscription')}
                  className="bg-white hover:bg-gray-100 text-green-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Package size={20} />
                  <span>New Subscription</span>
                </button>
                <button
                  onClick={fetchSubscriptions}
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border-2 border-green-400"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-6 py-8">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">
                    Rp {stats.totalSpent.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DollarSign size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Next Delivery</p>
                  <p className="text-3xl font-bold text-gray-900 capitalize">{stats.nextDelivery}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscriptions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Subscriptions</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Utensils size={16} />
                  <span>{subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-3"
                >
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}

              {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions Yet</h3>
                  <p className="text-gray-600 mb-6">Start your healthy journey by subscribing to one of our meal plans.</p>
                  <button
                    onClick={() => router.push('/menu')}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Browse Meal Plans
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription, index) => (
                    <motion.div
                      key={subscription._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{subscription.plan}</h3>
                            <StatusBadge status={subscription.status} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Utensils size={16} />
                              <span>{subscription.mealTypes.join(', ')}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar size={16} />
                              <span>{subscription.deliveryDays.join(', ')}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <DollarSign size={16} />
                              <span>Rp {subscription.totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            Started on {new Date(subscription.startDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {subscription.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleAction(subscription._id, 'pause')}
                                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                              >
                                <Pause size={16} />
                                <span>Pause</span>
                              </button>
                              <button
                                onClick={() => handleAction(subscription._id, 'cancel')}
                                className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                              >
                                <X size={16} />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}
                          
                          {subscription.status === 'paused' && (
                            <button
                              onClick={() => handleAction(subscription._id, 'reactivate')}
                              className="bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                            >
                              <Play size={16} />
                              <span>Reactivate</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Modal */}
        <AnimatePresence>
          {showActionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowActionModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {actionType === 'pause' ? 'Pause Subscription' : 'Cancel Subscription'}
                  </h3>
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {actionType === 'pause' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pause Start Date
                      </label>
                      <input
                        type="date"
                        value={pauseForm.startDate}
                        onChange={(e) => setPauseForm({ ...pauseForm, startDate: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pause End Date
                      </label>
                      <input
                        type="date"
                        value={pauseForm.endDate}
                        onChange={(e) => setPauseForm({ ...pauseForm, endDate: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason (Optional)
                      </label>
                      <textarea
                        value={pauseForm.reason}
                        onChange={(e) => setPauseForm({ ...pauseForm, reason: e.target.value })}
                        placeholder="Tell us why you're pausing..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors duration-200 h-20 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cancellation Reason (Optional)
                    </label>
                    <textarea
                      value={cancelForm.reason}
                      onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                      placeholder="Help us improve by telling us why you're cancelling..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors duration-200 h-24 resize-none"
                    />
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={actionType === 'pause' ? handlePause : handleCancel}
                    disabled={actionType === 'pause' && (!pauseForm.startDate || !pauseForm.endDate)}
                    className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
                      actionType === 'pause'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {actionType === 'pause' ? 'Pause Subscription' : 'Cancel Subscription'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
