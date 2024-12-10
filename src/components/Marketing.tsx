import React from 'react';
import { Clock, Star, Award, Shield, Tool, Truck } from 'lucide-react';

export function Marketing() {
  const services = [
    {
      title: 'Shoe Repair',
      description: 'Expert repair of all types of footwear, from casual shoes to luxury brands',
      icon: Tool,
    },
    {
      title: 'Same-Day Service',
      description: 'Quick turnaround for minor repairs when you need it most',
      icon: Clock,
    },
    {
      title: 'Quality Materials',
      description: 'Premium materials and craftsmanship for lasting results',
      icon: Award,
    },
    {
      title: 'Pickup & Delivery',
      description: 'Convenient pickup and delivery service for your busy schedule',
      icon: Truck,
    },
  ];

  const testimonials = [
    {
      text: "They brought my favorite boots back to life! Couldn't be happier with the service.",
      author: "Sarah M.",
      rating: 5,
    },
    {
      text: "Professional, fast, and high-quality work. Best shoe repair shop in town!",
      author: "James P.",
      rating: 5,
    },
    {
      text: "Great attention to detail and excellent customer service. Highly recommended!",
      author: "Michael R.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Expert Shoe Repair</span>
              <span className="block text-indigo-400">Craftsmanship You Can Trust</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Bringing new life to your favorite footwear with professional repair services
              and superior craftsmanship.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Professional shoe repair services tailored to your needs
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="pt-6 bg-gray-900 rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                      <service.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="mt-5 text-center">
                      <h3 className="text-lg font-medium text-white">{service.title}</h3>
                      <p className="mt-2 text-base text-gray-400">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-6 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">{testimonial.text}</p>
                  <p className="text-indigo-400 font-medium">{testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Contact Us
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Book your repair service today
            </p>
          </div>

          <div className="mt-10 max-w-lg mx-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-white mb-2">Location</h3>
                <p className="text-gray-300">123 Main Street<br />Your City, State 12345</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-white mb-2">Hours</h3>
                <p className="text-gray-300">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-white mb-2">Contact</h3>
                <p className="text-gray-300">
                  Phone: (555) 123-4567<br />
                  Email: info@shoerepair.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" aria-hidden="true" />
                <h3 className="ml-3 text-xl font-semibold text-white">
                  Our Satisfaction Guarantee
                </h3>
              </div>
              <div className="mt-4 text-center">
                <p className="text-white">
                  We stand behind our work with a 100% satisfaction guarantee.
                  If you're not completely satisfied with our service,
                  we'll make it right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
