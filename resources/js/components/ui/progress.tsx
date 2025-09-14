import React from 'react';

interface ProgressProps {
    value: number;
    className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
    const percentage = Math.min(100, Math.max(0, value));
    
    return (
        <div className={`w-full bg-gray-200 rounded-full ${className}`}>
            <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
