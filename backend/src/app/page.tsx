import DownloadButtons from "@/components/DownloadButtons";
import EmailCapture from "@/components/EmailCapture";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simplify Your
              <span className="text-blue-600"> Gym Workouts</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The ultimate exercise planner app that guides you through every rep, set, and rest period. 
              Make your gym sessions efficient and effective.
            </p>
            <EmailCapture />
            <DownloadButtons />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features that make workouts simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan, execute, and track your gym workouts in one simple app.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Play Mode Feature */}
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M12 3v18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Play Mode</h3>
              <p className="text-gray-600">
                Guided workout experience with get-ready periods, rep counters, rest timers, and automatic progression through your entire workout routine.
              </p>
            </div>

            {/* Smart Reminders Feature */}
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Reminders</h3>
              <p className="text-gray-600">
                Set custom reminders for each day of the week to stay consistent with your workout schedule and build lasting fitness habits.
              </p>
            </div>

            {/* Exercise Library Feature */}
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Unlimited Exercises</h3>
              <p className="text-gray-600">
                Add unlimited exercises with detailed tracking for weight, reps, and rest periods. Customize everything to fit your specific workout needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
