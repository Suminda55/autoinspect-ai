export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-slate-900 text-white border-b border-slate-800">
      <div className="text-2xl font-bold text-blue-500">
        AutoInspect <span className="text-white">AI</span>
      </div>
      <div className="hidden md:flex space-x-6 text-slate-300 font-medium">
        <a href="#home" className="hover:text-blue-400 transition">Home</a>
        <a href="#features" className="hover:text-blue-400 transition">Features</a>
        <a href="#how-it-works" className="hover:text-blue-400 transition">How it Works</a>
      </div>
      <div className="space-x-4">
        <button className="text-slate-300 hover:text-white font-medium">Sign In</button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition">
          Get Started
        </button>
      </div>
    </nav>
  );
}