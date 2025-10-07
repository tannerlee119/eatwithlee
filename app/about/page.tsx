import { Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-display font-bold mb-8 text-gray-900">
        About Eat with Lee
      </h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p>
          Welcome to Eat with Lee, where I share my culinary adventures and restaurant
          discoveries. From hidden gems to renowned establishments, I explore the diverse
          food scene and bring you honest and detailed reviews of my dining experiences.
        </p>

        <p>
          Each review goes beyond just the food—I dive into the atmosphere, service,
          location, and overall experience to give you a complete picture of what to expect.
          Whether you're looking for the perfect date night spot, a casual lunch destination,
          or just craving something specific, I hope my reviews help guide your next meal.
        </p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
          <h2 className="text-2xl font-display font-semibold mb-4 text-gray-900">
            Connect with Me
          </h2>
          <div className="flex flex-col gap-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
            >
              <Instagram size={24} />
              <span className="font-medium">Follow me on Instagram</span>
            </a>
            <a
              href="https://beli.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
            >
              <span className="font-bold text-xl">B</span>
              <span className="font-medium">Check out my Beli profile</span>
            </a>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-8">
          All reviews are based on my personal experiences and opinions. Ratings reflect
          my overall impression including food quality, service, atmosphere, and value.
        </p>
      </div>
    </div>
  );
}
