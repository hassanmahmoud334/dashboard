import { Link } from "react-router-dom";
import NotesManager from "../features/NotesManager";
import AnalyticsCard from "../features/AnalyticsCard";
import WeatherCard from "../features/WeatherCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">User & Posts Manager</h3>
          <p className="text-gray-600 mb-4">Manage users, posts, and todos in one place</p>
          <Link 
            to="/users" 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
          >
            <span>Open Users Manager</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h3>
          <AnalyticsCard />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Weather</h3>
          <WeatherCard />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 min-h-[400px]">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Notes</h3>
          <NotesManager />
        </div>

      </div>
    </div>
  );
}
