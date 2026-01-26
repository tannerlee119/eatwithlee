import { Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        className="text-5xl font-display font-bold mb-8 text-gray-900"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.02s both' }}
      >
        About Eat with Lee
      </h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p style={{ animation: 'fadeInUp 0.6s ease-out 0.08s both' }}>
          Welcome to Eat with Lee, where I share my culinary adventures and restaurant
          discoveries. From hidden gems to renowned establishments, I explore the diverse
          food scene and bring you honest and detailed reviews of my dining experiences.
        </p>

        <p style={{ animation: 'fadeInUp 0.6s ease-out 0.14s both' }}>
          Each review goes beyond just the food—I dive into the atmosphere, service,
          location, and overall experience to give you a complete picture of what to expect.
          Whether you&apos;re looking for the perfect date night spot, a casual lunch destination,
          or just craving something specific, I hope my reviews help guide your next meal.
        </p>

        <div
          className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          <h2 className="text-2xl font-display font-semibold mb-4 text-gray-900">
            Connect with Me
          </h2>
          <div className="flex flex-col gap-4">
            <a
              href="https://www.instagram.com/seafoodiereviews"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
            >
              <Instagram size={24} />
              <span className="font-medium">Follow me on Instagram</span>
            </a>
            <a
              href="https://beliapp.co/app/tannerlee119"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
            >
              <span className="font-bold text-xl">B</span>
              <span className="font-medium">Check out my Beli profile</span>
            </a>
            <a
              href="https://www.yelp.com/user_details?userid=PLSjHiJgk6VDYQO8RigTuw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 9.194 9.194 0 0 1 2.364 3.252 1.073 1.073 0 0 1-.686 1.459zm-5.025 3.152l4.942 1.606a1.072 1.072 0 0 1 .636 1.48 9.316 9.316 0 0 1-2.47 3.169 1.073 1.073 0 0 1-1.592-.26l-2.76-4.409c-.528-.847.288-1.894 1.236-1.584zm-4.796-4.368L5.454 2.916a1.072 1.072 0 0 1 .466-1.5A14.973 14.973 0 0 1 11.184.003a1.07 1.07 0 0 1 1.153 1.068v9.768c0 1.096-1.45 1.483-1.998.535zm-.857 4.17L4.44 16.806a1.073 1.073 0 0 1-1.324-.92 9.218 9.218 0 0 1 .43-3.997 1.07 1.07 0 0 1 1.485-.62l4.668 2.279c.9.438.763 1.76-.207 2.000zm.886 1.477c.669-.744 1.901-.246 1.866.752l-.19 5.188a1.073 1.073 0 0 1-1.247 1.02 9.314 9.314 0 0 1-3.722-1.502 1.072 1.072 0 0 1-.187-1.6l3.477-3.864z" />
              </svg>
              <span className="font-medium">Find me on Yelp</span>
            </a>
          </div>
        </div>

        <p
          className="text-sm text-gray-600 mt-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.26s both' }}
        >
          All reviews are based on my personal experiences and opinions. Ratings reflect
          my overall impression including food quality, service, atmosphere, and value.
        </p>
      </div>
    </div>
  );
}
