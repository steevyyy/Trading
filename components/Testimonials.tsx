import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Wanjiku',
    role: 'Wedding Client',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'Connecta made our wedding day perfect! The bridal car was beautifully decorated and the drivers were so professional. Highly recommend!'
  },
  {
    name: 'James Omondi',
    role: 'Corporate Client',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'Reliable and punctual service for our conference. The executive transport was top-notch. Will definitely use again!'
  },
  {
    name: 'Grace Muthoni',
    role: 'Graduation Transport',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: 'Excellent coordination for our family. Made our graduation day stress-free and memorable. Thank you Connecta!'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-3 sm:mb-4">What Our Clients Say</h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-4">Join thousands of satisfied customers who trust Connecta for their transportation needs</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-sky-200 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-neutral-700 mb-4 sm:mb-6 italic leading-relaxed">"{testimonial.text}"</p>
              <div className="flex items-center mb-3 sm:mb-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-3 sm:mr-4 border-2 border-sky-200" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-neutral-800">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-neutral-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};