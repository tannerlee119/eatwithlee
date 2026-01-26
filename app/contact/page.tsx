import { Mail, Instagram } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        className="text-5xl font-display font-bold mb-8 text-gray-900"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.02s both' }}
      >
        Contact
      </h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <p
          className="text-xl text-gray-700"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.08s both' }}
        >
          Have a restaurant suggestion or want to collaborate? I&apos;d love to hear from you!
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.14s both' }}
        >
          {/* Email */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Mail size={24} className="text-secondary" />
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Email
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Send me your restaurant recommendations or collaboration ideas
            </p>
            <a
              // href="mailto:hello@eatwithlee.com"
              className="text-secondary hover:text-gray-900 transition-colors font-medium"
            >
              COMING SOON
            </a>
          </div>

          {/* Instagram */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Instagram size={24} className="text-secondary" />
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Instagram
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Follow along for behind-the-scenes content and food adventures
            </p>
            <a
              href="https://www.instagram.com/seafoodiereviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-gray-900 transition-colors font-medium"
            >
              @seafoodiereviews
            </a>
          </div>

          {/* Beli */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-secondary">B</span>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Beli
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Check out my curated list of favorite spots and recommendations
            </p>
            <a
              href="https://beliapp.co/app/tannerlee119"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-gray-900 transition-colors font-medium"
            >
              View My Beli Profile
            </a>
          </div>

          {/* Yelp */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-secondary">Y</span>
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Yelp
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              See my reviews and contributions on Yelp
            </p>
            <a
              href="https://www.yelp.com/user_details?userid=PLSjHiJgk6VDYQO8RigTuw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-gray-900 transition-colors font-medium"
            >
              View My Yelp Profile
            </a>
          </div>
        </div>

        <div
          className="bg-accent border border-gray-200 rounded-xl p-6 mt-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
            Restaurant Recommendations
          </h3>
          <p className="text-gray-700">
            Know a hidden gem I should try? I&apos;m always looking for new places to review!
            Drop me a message with your favorite spots and what makes them special.
          </p>
        </div>
      </div>
    </div>
  );
}
