function Hero() {
  return (
    <section className="bg-white text-center mt-28 px-4 py-20">
      
      {/* Heading */}
      <h1 className="text-[80px] md:text-[100px] font-extrabold text-slate-900 leading-tight">
        RepoRole
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-500 mt-4">
        No Resume, No form, Just Code → Roles
      </p>

      {/* Input */}
      <div className="mt-10 flex justify-center items-center gap-4 flex-wrap">
        
        <input
          type="text"
          placeholder="https://github.com/username/repo"
          className="w-[400px] md:w-[520px] px-6 py-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
        />

        <button className="bg-yellow-900 hover:bg-yellow-500 px-8 py-4 rounded-xl text-lg font-medium shadow-md text-blue">
          Analyze →
        </button>

      </div>
    </section>
  );
}

export default Hero;