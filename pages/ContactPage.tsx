import React, { useState } from 'react';
import { MapView } from '../components/MapView';
import { EnvelopeIcon, PhoneIcon } from '../components/icons/PageIcons';
import { LocationPinIcon } from '../components/icons/FormIcons';

const officeLocation: [number, number] = [-1.2657, 36.8021];

export default function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Sending...');
        setTimeout(() => {
            setStatus('Your message has been sent successfully!');
            (e.target as HTMLFormElement).reset();
             setTimeout(() => setStatus(''), 5000);
        }, 1500);
    };

    return (
        <div>
            <section className="relative py-20 md:py-32 bg-white">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: `url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1200&auto=format&fit=crop')`}}></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                        Get In Touch
                    </h1>
                    <p className="text-lg text-neutral-600 mt-4 max-w-3xl mx-auto">
                        Have a question, feedback, or a special request? Our team is here to help. Reach out to us anytime.
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-neutral-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12 bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-neutral-200/80">
                        <div className="md:col-span-2">
                            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Contact Information</h2>
                            <p className="text-neutral-600 mb-8">Fill out the form or use our contact details below to connect with us. We look forward to hearing from you!</p>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                                        <PhoneIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-800">Phone</h4>
                                        <a href="tel:+254712345678" className="text-neutral-600 hover:text-sky-500 transition-colors">+254 712 345 678</a>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                                        <EnvelopeIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-800">Email</h4>
                                        <a href="mailto:support@connecta.co.ke" className="text-neutral-600 hover:text-sky-500 transition-colors">support@connecta.co.ke</a>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                                        <LocationPinIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-800">Address</h4>
                                        <p className="text-neutral-600">123 Westlands Rd, Nairobi, Kenya</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-3">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-3xl font-bold text-neutral-800 mb-4">Send us a Message</h2>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-600 mb-2">Full Name</label>
                                    <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-600 mb-2">Email Address</label>
                                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-neutral-600 mb-2">Subject</label>
                                    <input type="text" id="subject" name="subject" required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-neutral-600 mb-2">Message</label>
                                    <textarea id="message" name="message" rows={5} required className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"></textarea>
                                </div>
                                {status && <p className={`text-sm ${status.includes('successfully') ? 'text-green-600' : 'text-neutral-600'}`}>{status}</p>}
                                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-300 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16 md:pb-24">
                <div className="h-96 md:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80">
                    <MapView officeLocation={officeLocation} />
                </div>
            </div>
        </div>
    );
}