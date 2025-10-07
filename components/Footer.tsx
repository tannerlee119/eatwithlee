export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-600">
          <p className="text-sm">
            © {new Date().getFullYear()} Eat with Lee. All rights reserved.
          </p>
          <p className="text-sm mt-2">
            Sharing my culinary adventures, one review at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
