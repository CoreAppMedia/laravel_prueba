import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BasePanel({ children, backUrl }) {
    return (
        <AppLayout>

            {/* Content Area */}
            <div className="animate-fade-in">
                {children}
            </div>
        </AppLayout>
    );
}


