'use client';

import Link from 'next/link';

export default function CallToAction() {

    return (
        <div className="mt-16 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Ready to Collaborate?</h2>
                <p className="text-xl mb-8 opacity-90">
                    Let's bring your next project to life together
                </p>

                <Link
                    href="/main/about-me"
                    className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    prefetch={true}
                >
                    Get in Touch
                </Link>
            </div>
        </div>
    );
}
