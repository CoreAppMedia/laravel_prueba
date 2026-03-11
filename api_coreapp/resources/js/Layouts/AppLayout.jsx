import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-[--color-bg-main] flex flex-col justify-between font-sans text-[--color-text-primary]">
            <div>
                <Header />
                <main>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
