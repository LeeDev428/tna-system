import React from 'react';

interface TabsProps {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
}

interface TabsListProps {
    className?: string;
    children: React.ReactNode;
}

interface TabsTriggerProps {
    value: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

interface TabsContentProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}

const TabsContext = React.createContext<{
    activeTab: string;
    setActiveTab: (value: string) => void;
} | null>(null);

export function Tabs({ defaultValue, className, children }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, children }: TabsListProps) {
    return (
        <div className={`flex space-x-1 ${className}`}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, className, children, onClick }: TabsTriggerProps) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    const handleClick = () => {
        setActiveTab(value);
        onClick?.();
    };

    return (
        <button
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
            } ${className}`}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, className, children }: TabsContentProps) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    const { activeTab } = context;

    if (activeTab !== value) return null;

    return (
        <div className={className}>
            {children}
        </div>
    );
}
