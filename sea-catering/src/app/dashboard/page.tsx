'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function Dashboard() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'pause' | 'cancel' | null>(null);
  const [pauseForm, setPauseForm] = useState<PauseFormData>({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [cancelForm, setCancelForm] = useState<CancelFormData>({
    reason: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Redirect to login if not authenticated
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
      const response = await subscriptionApi.getUserSubscriptions();
      setSubscriptions(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPlanDisplayName = (plan: string) => {
    const planNames = {
      diet: 'Diet Plan',
      protein: 'Protein Plan',
      royal: 'Royal Plan'
    };
    return planNames[plan as keyof typeof planNames] || plan;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCurrentPausePeriod = (subscription: Subscription) => {
    if (!subscription.pausePeriods || subscription.status !== 'paused') return null;
    
    const now = new Date();
    return subscription.pausePeriods.find(period => 
      new Date(period.startDate) <= now && new Date(period.endDate) >= now
    );
  };

  const handlePauseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    try {
      setActionLoading(true);
      await subscriptionApi.pause(
        selectedSubscription,
        pauseForm.startDate,
        pauseForm.endDate,
        pauseForm.reason
      );
      
      await fetchSubscriptions();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    try {
      setActionLoading(true);
      await subscriptionApi.cancel(selectedSubscription, cancelForm.reason);
      
      await fetchSubscriptions();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async (subscriptionId: string) => {
    try {
      setActionLoading(true);
      await subscriptionApi.reactivate(subscriptionId);
      await fetchSubscriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (subscriptionId: string, action: 'pause' | 'cancel') => {
    setSelectedSubscription(subscriptionId);
    setActionType(action);
    
    // Set default dates for pause
    if (action === 'pause') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      setPauseForm({
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0],
        reason: ''
      });
    }
  };

  const closeModal = () => {
    setSelectedSubscription(null);
    setActionType(null);
    setPauseForm({ startDate: '', endDate: '', reason: '' });
    setCancelForm({ reason: '' });
    setError(null);
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {authLoading ? 'Loading...' : 'Redirecting to login...'}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your subscriptions...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-grow">
        <div className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
            <p className="text-xl opacity-90">Manage your meal subscriptions</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 -mt-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
              <button 
                onClick={() => setError(null)}
                className="float-right ml-4 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {subscriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Subscriptions Found</h3>
              <p className="text-gray-600 mb-6">You don't have any meal subscriptions yet.</p>
              <a 
                href="/subscription" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Subscribe Now
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {subscriptions.map((subscription) => {
                const currentPause = getCurrentPausePeriod(subscription);
                
                return (
                  <div key={subscription._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {getPlanDisplayName(subscription.plan)}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                            {capitalizeFirst(subscription.status)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatPrice(subscription.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-600">per month</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Meal Types</h4>
                          <div className="flex flex-wrap gap-2">
                            {subscription.mealTypes.map((meal) => (
                              <span key={meal} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                                {capitalizeFirst(meal)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Delivery Days</h4>
                          <div className="flex flex-wrap gap-2">
                            {subscription.deliveryDays.map((day) => (
                              <span key={day} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                {capitalizeFirst(day)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                        <div>
                          <span className="font-medium">Started:</span> {formatDate(subscription.startDate)}
                        </div>
                        <div>
                          <span className="font-medium">Subscribed:</span> {formatDate(subscription.createdAt)}
                        </div>
                      </div>

                      {currentPause && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-yellow-800 mb-2">Currently Paused</h4>
                          <p className="text-yellow-700 text-sm">
                            From {formatDate(currentPause.startDate)} to {formatDate(currentPause.endDate)}
                          </p>
                          {currentPause.reason && (
                            <p className="text-yellow-700 text-sm mt-1">
                              Reason: {currentPause.reason}
                            </p>
                          )}
                        </div>
                      )}

                      {subscription.status === 'cancelled' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-red-800 mb-2">Cancelled</h4>
                          {subscription.cancellationDate && (
                            <p className="text-red-700 text-sm">
                              Cancelled on: {formatDate(subscription.cancellationDate)}
                            </p>
                          )}
                          {subscription.cancellationReason && (
                            <p className="text-red-700 text-sm mt-1">
                              Reason: {subscription.cancellationReason}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3">
                        {subscription.status === 'active' && (
                          <>
                            <button
                              onClick={() => openModal(subscription._id, 'pause')}
                              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                              disabled={actionLoading}
                            >
                              Pause Subscription
                            </button>
                            <button
                              onClick={() => openModal(subscription._id, 'cancel')}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              disabled={actionLoading}
                            >
                              Cancel Subscription
                            </button>
                          </>
                        )}
                        
                        {subscription.status === 'paused' && (
                          <button
                            onClick={() => handleReactivate(subscription._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Reactivating...' : 'Reactivate Subscription'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Pause Modal */}
      {actionType === 'pause' && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pause Subscription</h3>
              
              <form onSubmit={handlePauseSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={pauseForm.startDate}
                    onChange={(e) => setPauseForm({ ...pauseForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={pauseForm.endDate}
                    onChange={(e) => setPauseForm({ ...pauseForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={pauseForm.reason}
                    onChange={(e) => setPauseForm({ ...pauseForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Why are you pausing your subscription?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Pausing...' : 'Pause Subscription'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {actionType === 'cancel' && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cancel Subscription</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this subscription? This action cannot be undone.
              </p>
              
              <form onSubmit={handleCancelSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={cancelForm.reason}
                    onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Why are you cancelling your subscription?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Cancelling...' : 'Cancel Subscription'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Keep Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
