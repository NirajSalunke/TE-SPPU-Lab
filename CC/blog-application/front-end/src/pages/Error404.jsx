import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Error404() {
  const theme = useSelector((state) => state.auth.theme);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#1c1b5a] via-[#0f122c] to-[#0f0d1f]' : 'bg-gradient-to-br from-[#e8f4ff] via-[#f0f9ff] to-[#ffffff]'} relative overflow-hidden`}>
      {/* Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className={`absolute w-1.5 h-1.5 ${theme === 'dark' ? 'bg-white/60' : 'bg-black/20'} rounded-full blur-sm`}
            style={{
              top: `${Math.random() * 90 + 5}%`,
              left: `${Math.random() * 90 + 5}%`,
              filter: `blur(${Math.floor(Math.random() * 4) + 3}px)`,
            }}
          ></span>
        ))}
      </div>

      {/* Main Content */}
      <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-cursive w-full px-4">
        <h1 className={`text-4xl md:text-5xl font-normal text-shadow-lg shadow-[#c3d168a2] ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Page Not Found!
        </h1>
        <div className="mt-8">
          <span className={`text-6xl md:text-7xl text-shadow-lg shadow-[#c3d168a2] ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>4</span>
          <span className="inline-block relative w-20 h-20 md:w-24 md:h-24 mx-4 bg-gradient-to-b from-[#f9ffd2] to-[#ecff70] rounded-full shadow-lg shadow-[#e7f1a3a2] animate-bounce">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-16 border-2 border-current rounded-full border-t-0 border-b-4"></span>
            <span className="absolute top-1/2 left-1/2 w-1 h-1 bg-current rounded-full transform -translate-x-1/2 -translate-y-1/2 origin-[40px_0] animate-spin"></span>
          </span>
          <span className={`text-6xl md:text-7xl text-shadow-lg shadow-[#c3d168a2] ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>4</span>
        </div>
        <p className={`mt-12 text-base md:text-lg text-shadow-lg shadow-[#c3d168a2] ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          We are unable to find the page
          <br />
          you're looking for.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className={`px-6 py-2 rounded-full text-sm font-medium
              transform hover:scale-105 transition-all duration-300
              shadow-lg hover:shadow-xl ${
                theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
              }`}
          >
            Back to Home Page
          </Link>
        </div>
      </main>
    </div>
  );
}
