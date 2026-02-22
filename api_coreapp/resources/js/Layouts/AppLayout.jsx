import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-[--color-bg-dark] flex flex-col justify-between font-sans text-[--color-mx-white]">
            <div>
                <Header />
                <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
