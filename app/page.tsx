'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Heart, Star, Users, Palette, Sparkles, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Clock, Award, Camera } from 'lucide-react'

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const heroImages = [
    "Elegant French Manicure",
    "Glittery Galaxy Nails",
    "Floral Art Design",
    "Geometric Patterns",
    "Seasonal Collection"
  ]

  const services = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Classic Manicure",
      description: "Professional nail care with perfect polish application and cuticle maintenance.",
      price: "$35",
      duration: "45 min"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Gel Manicure",
      description: "Long-lasting gel polish that maintains shine and durability for weeks.",
      price: "$45",
      duration: "60 min"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Nail Art Design",
      description: "Custom artistic designs tailored to your style and preferences.",
      price: "$55+",
      duration: "75 min"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Special Occasion",
      description: "Premium designs for weddings, parties, and special events.",
      price: "$75+",
      duration: "90 min"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Virtual Try-On",
      description: "Preview your nail design with our AI-powered virtual try-on technology.",
      price: "Free",
      duration: "5 min"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Luxury Package",
      description: "Complete nail care experience with premium treatment and exclusive designs.",
      price: "$95+",
      duration: "120 min"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Absolutely amazing! The nail art exceeded my expectations. The attention to detail is incredible.",
      service: "Gel Manicure with Art"
    },
    {
      name: "Emily Chen",
      rating: 5,
      text: "Professional service and stunning results. I get compliments on my nails everywhere I go!",
      service: "Special Occasion Design"
    },
    {
      name: "Jessica Williams",
      rating: 5,
      text: "The virtual try-on feature is revolutionary! I knew exactly how my nails would look before the appointment.",
      service: "Virtual Try-On + Classic Manicure"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-8 h-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                NailArt Genius
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Home</a>
              <a href="#services" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Services</a>
              <a href="#gallery" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Gallery</a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Contact</a>
              <motion.button 
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-6 bg-gray-600 transform transition duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`} />
                <span className={`absolute h-0.5 w-6 bg-gray-600 top-3 transition duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute h-0.5 w-6 bg-gray-600 transform transition duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-pink-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Home</a>
                <a href="#services" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Services</a>
                <a href="#gallery" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Gallery</a>
                <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Reviews</a>
                <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Contact</a>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all font-medium w-fit">
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Express Yourself
                  </span>
                  <br />
                  <span className="text-gray-800">Through Nail Art</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Transform your nails into works of art with our AI-powered design tools and professional nail services. 
                  Create, visualize, and wear your perfect manicure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-xl flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </motion.button>
                <motion.button 
                  className="border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-5 h-5" />
                  <span>Try Virtual Design</span>
                </motion.button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">1000+</div>
                  <div className="text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-gray-600">Unique Designs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">5.0</div>
                  <div className="text-gray-600">Rating</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <Sparkles className="w-16 h-16 mx-auto" />
                      <h3 className="text-2xl font-bold">{heroImages[currentImageIndex]}</h3>
                      <p className="text-lg opacity-90">Professional Nail Art</p>
                    </motion.div>
                  </div>
                </div>
                
                {/* Image indicator dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From classic manicures to innovative AI-powered nail art, we offer comprehensive services to make your nails stunning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-pink-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-pink-500 mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-pink-200">
                  <span className="text-2xl font-bold text-pink-600">{service.price}</span>
                  <span className="text-gray-500">{service.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">Portfolio Gallery</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our stunning collection of nail art designs that showcase creativity, precision, and artistic excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Elegant French", category: "Classic" },
              { name: "Galaxy Glitter", category: "Creative" },
              { name: "Floral Paradise", category: "Artistic" },
              { name: "Geometric Vibes", category: "Modern" },
              { name: "Sunset Ombre", category: "Gradient" },
              { name: "Marble Luxury", category: "Luxury" },
              { name: "Holographic Dream", category: "Trending" },
              { name: "Minimalist Chic", category: "Simple" }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="aspect-square bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-2xl shadow-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-white p-6">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 mx-auto mb-2" />
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-sm opacity-80">{item.category}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read testimonials from our satisfied clients who love their nail art experience with us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-pink-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-purple-600">{testimonial.service}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold">Get In Touch</h2>
            <p className="text-xl text-pink-200 max-w-3xl mx-auto">
              Ready to transform your nails? Contact us to schedule your appointment or learn more about our services.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-pink-400" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-pink-200">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-pink-400" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-pink-200">hello@nailartgenius.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-pink-400" />
                <div>
                  <div className="font-semibold">Address</div>
                  <div className="text-pink-200">123 Beauty Avenue, Studio City, CA 90210</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="w-6 h-6 text-pink-400" />
                <div>
                  <div className="font-semibold">Hours</div>
                  <div className="text-pink-200">Mon-Sat: 9AM-7PM, Sun: 11AM-5PM</div>
                </div>
              </div>

              <div className="pt-8">
                <div className="font-semibold mb-4">Follow Us</div>
                <div className="flex space-x-4">
                  <Instagram className="w-6 h-6 text-pink-400 hover:text-white cursor-pointer transition-colors" />
                  <Facebook className="w-6 h-6 text-pink-400 hover:text-white cursor-pointer transition-colors" />
                  <Twitter className="w-6 h-6 text-pink-400 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </motion.div>

            <motion.form 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-pink-300/30 focus:border-pink-400 focus:outline-none transition-colors text-white placeholder-pink-200"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-pink-300/30 focus:border-pink-400 focus:outline-none transition-colors text-white placeholder-pink-200"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <select className="w-full px-4 py-3 rounded-lg bg-white/10 border border-pink-300/30 focus:border-pink-400 focus:outline-none transition-colors text-white">
                  <option value="" className="text-gray-800">Select a service</option>
                  <option value="classic" className="text-gray-800">Classic Manicure</option>
                  <option value="gel" className="text-gray-800">Gel Manicure</option>
                  <option value="art" className="text-gray-800">Nail Art Design</option>
                  <option value="special" className="text-gray-800">Special Occasion</option>
                  <option value="virtual" className="text-gray-800">Virtual Try-On</option>
                  <option value="luxury" className="text-gray-800">Luxury Package</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-pink-300/30 focus:border-pink-400 focus:outline-none transition-colors text-white placeholder-pink-200"
                  placeholder="Tell us about your desired nail design or any special requests..."
                />
              </div>
              <motion.button 
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="w-6 h-6 text-pink-400" />
              <span className="text-xl font-bold">NailArt Genius</span>
            </div>
            <div className="text-center md:text-right text-gray-400">
              <p>&copy; 2025 NailArt Genius. All rights reserved.</p>
              <p className="text-sm mt-1">Powered by AI • Crafted with Love</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}