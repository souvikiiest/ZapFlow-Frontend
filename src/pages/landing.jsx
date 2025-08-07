

export default function Landing() {
    
    return (
        <div className="bg-gray-50 text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            <main>
                <section className="bg-white">
                    <div className="container mx-auto px-6 py-24 md:py-32 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                            Automate Your Workflows, <br className="hidden md:block" /> Effortlessly.
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect your favorite apps and automate repetitive tasks with ZapFlow. Focus on what matters most, and let us handle the rest.
                        </p>
                        <div className="mt-8">
                            <a href="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 inline-block">
                                Get Started for Free
                            </a>
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Why You'll Love ZapFlow</h2>
                            <p className="text-gray-600 mt-2">Simple, powerful, and built for you.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <div className="bg-indigo-100 text-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Powerful Triggers</h3>
                                <p className="mt-2 text-gray-600">Start workflows from webhooks, schedules, or your favorite apps like Google Sheets.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <div className="bg-indigo-100 text-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Smart Actions</h3>
                                <p className="mt-2 text-gray-600">Send emails, post to Discord, or use our smart Filter to create conditional logic.</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <div className="bg-indigo-100 text-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Simple Interface</h3>
                                <p className="mt-2 text-gray-600">An intuitive editor that makes creating complex automations feel easy.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t">
                <div className="container mx-auto px-6 py-8 text-center text-gray-500">
                    <p>&copy; 2025 ZapFlow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};