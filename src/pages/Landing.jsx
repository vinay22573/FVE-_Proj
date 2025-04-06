import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Privacy-First Reproductive Health Consultation
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access confidential healthcare services in your preferred language, from the comfort of your home.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600">
                Your identity is protected with pseudonym-based login and secure video consultations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-gray-600">
                Consult with doctors in Hindi, English, Odia, or Tamil - your choice.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold mb-2">Ayushmaan Bharat</h3>
              <p className="text-gray-600">
                Integrated with Ayushmaan Bharat for accessible healthcare services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to take control of your reproductive health?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of users who trust ReproMitra for confidential healthcare consultations.
          </p>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing; 