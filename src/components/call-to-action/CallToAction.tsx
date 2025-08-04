'use client';

import ActionButton from '@/components/ui/ActionButton';

export default function CallToAction() {

    return (
        <div className="mt-16 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
                <h2 className="text-4xl font-bold mb-4 text-white">Ready to Collaborate?</h2>
                <p className="text-xl mb-8 opacity-90 text-white">
                    Let's bring your next project to life together
                </p>

                <ActionButton
                    variant="custom"
                    href="/main/about-me"
                    size="lg"
                    customBackground="white"
                    className="!text-blue-600 font-semibold hover:!bg-gray-50 hover:!text-blue-700 transition-colors duration-300"
                >
                    Get in Touch
                </ActionButton>
            </div>
        </div>
    );
}
