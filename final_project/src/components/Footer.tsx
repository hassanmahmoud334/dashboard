import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Dashboard. All rights reserved.
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors duration-200">
              Support
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}