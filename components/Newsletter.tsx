import React, { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated with Connecta</h2>
          <p className="text-sky-100 mb-8">Subscribe to get exclusive offers, travel tips, and updates on new services</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-sky-600 px-8 py-4 rounded-lg font-bold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
            </button>
          </form>
          <p className="text-sky-200 text-sm mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};