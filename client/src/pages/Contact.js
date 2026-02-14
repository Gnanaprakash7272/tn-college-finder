import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(language === 'ta' ? 'தேவையான அனைத்து புலங்களையும் பூர்த்துக்கவும்' : 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      // Here you would normally send the data to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(language === 'ta' ? 'செய்தி அனுப்பப்பட்டது!' : 'Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(language === 'ta' ? 'செய்தி அனுப்புவதில் பிழை' : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      label: language === 'ta' ? 'மின்னஞ்சல்' : 'Email',
      value: 'support@collegefinder.tn',
      href: 'mailto:support@collegefinder.tn'
    },
    {
      icon: PhoneIcon,
      label: language === 'ta' ? 'தொலைபேசி' : 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210'
    },
    {
      icon: MapPinIcon,
      label: language === 'ta' ? 'முகவரி' : 'Address',
      value: language === 'ta' 
        ? 'சென்னை, தமிழ்நாடு, இந்தியா'
        : 'Chennai, Tamil Nadu, India',
      href: '#'
    },
    {
      icon: ClockIcon,
      label: language === 'ta' ? 'வேலை நேரம்' : 'Working Hours',
      value: language === 'ta' 
        ? 'திங்கள் - வெள்ளி: 9:00 AM - 6:00 PM'
        : 'Monday - Friday: 9:00 AM - 6:00 PM',
      href: '#'
    }
  ];

  const faqs = [
    {
      question: language === 'ta' 
        ? 'இந்த சேவை இலவசமா?' 
        : 'Is this service free?',
      answer: language === 'ta'
        ? 'ஆம், கல்லூரி தேடுபவரின் அனைத்து அம்சங்களும் மாணவர்களுக்கு முற்றிலும் இலவசம்.'
        : 'Yes, all features of College Finder are completely free for students.'
    },
    {
      question: language === 'ta' 
        ? 'தகவல்கள் எவ்வளவு அடிக்கடி புதுப்பிக்கப்படுகின்றன?' 
        : 'How often is the information updated?',
      answer: language === 'ta'
        ? 'நாங்கள் அரசு அதிகாரப்பூர்வ அறிவிப்புகள் வெளியாகும்போது தகவல்களை புதுப்பிக்கிறோம், குறிப்பாக TNEA ஆலோசனை காலங்களில்.'
        : 'We update information as soon as official government announcements are made, especially during TNEA counselling periods.'
    },
    {
      question: language === 'ta' 
        ? 'நான் எப்படி சரியான கல்லூரியைத் தேர்ந்தெடுக்கிறேன்?' 
        : 'How do I choose the right college?',
      answer: language === 'ta'
        ? 'உங்கள் மதிப்பெண்கள், சமூகம், விருப்பங்கள், மற்றும் பட்ஜெட்டைப் பொறுத்து கல்லூரிகளை ஒப்பிட்டு பார்க்கவும்.'
        : 'Compare colleges based on your marks, community, preferences, and budget using our comparison tool.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('contact')}
            </h1>
            <p className="text-xl text-primary-100">
              {language === 'ta'
                ? 'எங்களைத் தொடர்பு கொள்ளுங்கள். உங்கள் கேள்விகளுக்கும் கருத்துக்களுக்கும் நாங்கள் உதவ தயாராக உள்ளோம்.'
                : 'Get in touch with us. We are here to help with your questions and suggestions.'
              }
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {language === 'ta' ? 'தொடர்பு தகவல்' : 'Contact Information'}
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <info.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{info.label}</h3>
                    {info.href.startsWith('#') ? (
                      <p className="text-gray-600">{info.value}</p>
                    ) : (
                      <a 
                        href={info.href}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {info.value}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'ta' ? 'அடிக்கட்டு கேள்விகள்' : 'Frequently Asked Questions'}
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="bg-white rounded-lg shadow-sm">
                    <summary className="p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50">
                      {faq.question}
                    </summary>
                    <div className="px-4 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {language === 'ta' ? 'உங்கள் செய்தியை அனுப்பவும்' : 'Send us a Message'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ta' ? 'பெயர் *' : 'Name *'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={language === 'ta' ? 'உங்கள் பெயர்' : 'Your Name'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ta' ? 'மின்னஞ்சல் *' : 'Email *'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={language === 'ta' ? 'உங்கள் மின்னஞ்சல்' : 'Your Email'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ta' ? 'தொலைபேசி' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={language === 'ta' ? 'உங்கள் தொலைபேசி எண்' : 'Your Phone Number'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ta' ? 'பொருள்' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={language === 'ta' ? 'உங்கள் செய்தியின் பொருள்' : 'Message Subject'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ta' ? 'செய்தி *' : 'Message *'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical"
                    placeholder={language === 'ta' ? 'உங்கள் செய்தியை இங்கே எழுதுங்கள்...' : 'Write your message here...'}
                  ></textarea>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {language === 'ta' ? '* குறியிட்ட புலங்கள் கட்டாயமானவை' : '* Marked fields are required'}
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading 
                      ? (language === 'ta' ? 'அனுப்புகிறது...' : 'Sending...')
                      : (language === 'ta' ? 'செய்தியை அனுப்பு' : 'Send Message')
                    }
                  </button>
                </div>
              </form>
            </div>

            {/* Social Media */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ta' ? 'சமூக ஊடகங்கள்' : 'Follow Us'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'ta'
                  ? 'சமீபத்திய புதுப்பிப்புகள் மற்றும் அறிவிப்புகளுக்கு எங்களைப் பின்தொடரவும்'
                  : 'Follow us for latest updates and announcements'
                }
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <span className="font-semibold">f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <span className="font-semibold">t</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <span className="font-semibold">i</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <span className="font-semibold">y</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
