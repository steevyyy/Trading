import React from 'react';
import { ShieldCheckIcon, SteeringWheelIcon, KeyIcon } from '../components/icons/PageIcons';
import { Users, Target, Award, TrendingUp } from 'lucide-react';

const ValuePropCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-200/80 text-center transform hover:-translate-y-1.5 transition-transform duration-300">
        <div className="mx-auto bg-sky-100 text-sky-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-neutral-800 mb-2">{title}</h3>
        <p className="text-neutral-600">{children}</p>
    </div>
);

const TeamMemberCard = ({ name, title, imageUrl }: { name: string; title: string; imageUrl: string }) => (
    <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
            <img src={imageUrl} alt={name} className="w-full h-full rounded-full object-cover shadow-lg"/>
            <div className="absolute inset-0 rounded-full border-4 border-white/50"></div>
        </div>
        <h4 className="text-lg font-bold text-neutral-800">{name}</h4>
        <p className="text-sky-600 font-semibold">{title}</p>
    </div>
);

export default function AboutPage() {
    return (
        <div>
            <section className="relative py-16 sm:py-20 md:py-32 bg-gradient-to-br from-sky-500 via-blue-600 to-sky-700 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-6">
                        Connecting Kenya,<br/>One Ride at a Time
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-4">
                        Your trusted partner for instant rides and event transportation across Kenya
                    </p>
                </div>
            </section>

            <section className="py-12 sm:py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80" alt="Nairobi cityscape" className="rounded-2xl shadow-2xl w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"/>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-neutral-800 mb-4 sm:mb-6">Our Story</h2>
                            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                                <p>Founded in 2024, Connecta emerged from a simple vision: to revolutionize transportation in Kenya by combining instant ride-hailing with professional event services.</p>
                                <p>We recognized that Kenyans needed more than just a ride—they needed a reliable partner for life's important moments, from daily commutes to weddings and corporate events.</p>
                                <p>Today, we serve thousands of customers across Kenya with our fleet of verified drivers and diverse vehicle options, maintaining our commitment to safety, reliability, and exceptional service.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-gradient-to-br from-neutral-50 to-sky-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-800 mb-4">Our Mission & Vision</h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">Driving Kenya forward with innovation, safety, and excellence</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-sky-100">
                            <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                                <Target className="w-7 h-7 text-sky-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-3">Our Mission</h3>
                            <p className="text-neutral-600 leading-relaxed">To provide safe, reliable, and affordable transportation solutions that connect communities and celebrate life's special moments across Kenya.</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-sky-100">
                            <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                                <TrendingUp className="w-7 h-7 text-sky-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-3">Our Vision</h3>
                            <p className="text-neutral-600 leading-relaxed">To become East Africa's most trusted transportation platform, setting the standard for innovation, customer service, and driver welfare.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-800 mb-4">Why Choose Connecta?</h2>
                        <p className="text-neutral-600 text-lg">
                            Excellence in every journey, trust in every ride
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ValuePropCard title="Safety First" icon={<ShieldCheckIcon className="w-8 h-8"/>}>
                            100% verified drivers, GPS tracking, and 24/7 support. Your safety is our non-negotiable priority.
                        </ValuePropCard>
                        <ValuePropCard title="Professional Service" icon={<SteeringWheelIcon className="w-8 h-8"/>}>
                            Experienced, courteous drivers trained to deliver exceptional service for every ride and event.
                        </ValuePropCard>
                        <ValuePropCard title="Diverse Fleet" icon={<KeyIcon className="w-8 h-8"/>}>
                            From boda bodas to luxury buses—the perfect vehicle for any journey or celebration.
                        </ValuePropCard>
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-sky-500 to-blue-600">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center text-white">
                        <div>
                            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">10K+</div>
                            <p className="text-sky-100 text-xs sm:text-sm md:text-base lg:text-lg">Happy Customers</p>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">500+</div>
                            <p className="text-sky-100 text-xs sm:text-sm md:text-base lg:text-lg">Verified Drivers</p>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">50K+</div>
                            <p className="text-sky-100 text-xs sm:text-sm md:text-base lg:text-lg">Rides Completed</p>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">4.9★</div>
                            <p className="text-sky-100 text-xs sm:text-sm md:text-base lg:text-lg">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>

             <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-800 mb-4">Meet Our Leadership</h2>
                        <p className="text-neutral-600 text-lg">
                           The passionate team driving Connecta's vision forward
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <TeamMemberCard name="Amina Yusuf" title="Founder & CEO" imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" />
                        <TeamMemberCard name="David Otieno" title="Head of Operations" imageUrl="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80" />
                        <TeamMemberCard name="Grace Wanjiru" title="Customer Success" imageUrl="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80" />
                        <TeamMemberCard name="Samuel Kamau" title="Chief Technology Officer" imageUrl="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" />
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-neutral-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 text-center text-white">
                        <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 opacity-90" />
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4">Join the Connecta Family</h2>
                        <p className="text-base sm:text-lg md:text-xl text-sky-50 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                            Whether you're looking for a reliable ride or want to become a driver partner, we're here to connect you to opportunities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button className="bg-white text-sky-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-sky-50 transition-colors shadow-lg">
                                Become a Driver
                            </button>
                            <button className="bg-sky-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-sky-800 transition-colors border-2 border-white/30">
                                Download App
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
