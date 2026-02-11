/**
 * Card Skeleton Loader
 * Displays a shimmer loading effect for card components
 */
export function CardSkeleton({ className = "" }) {
    return (
        <div className={`glass-card p-6 rounded-2xl ${className}`}>
            <div className="animate-pulse space-y-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-5/6" />
                    <div className="h-3 bg-white/10 rounded w-4/6" />
                </div>
            </div>
        </div>
    );
}

/**
 * Table Skeleton Loader
 * Displays a shimmer loading effect for table components
 */
export function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            <div className="animate-pulse">
                {/* Table Header */}
                <div className="bg-white/5 p-4 border-b border-white/10">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                        {Array.from({ length: columns }).map((_, i) => (
                            <div key={i} className="h-4 bg-white/10 rounded" />
                        ))}
                    </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="p-4 border-b border-white/5">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <div key={colIndex} className="h-3 bg-white/10 rounded" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * List Skeleton Loader
 * Displays a shimmer loading effect for list components
 */
export function ListSkeleton({ items = 5, className = "" }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: items }).map((_, index) => (
                <div key={index} className="glass-card p-4 rounded-xl">
                    <div className="animate-pulse flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4" />
                            <div className="h-3 bg-white/10 rounded w-1/2" />
                        </div>
                        <div className="w-20 h-8 bg-white/10 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Stats Skeleton Loader
 * Displays a shimmer loading effect for statistics cards
 */
export function StatsSkeleton({ count = 4, className = "" }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl">
                    <div className="animate-pulse space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/10 rounded-xl" />
                            <div className="w-8 h-8 bg-white/10 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 bg-white/10 rounded w-2/3" />
                            <div className="h-3 bg-white/10 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Chart Skeleton Loader
 * Displays a shimmer loading effect for chart components
 */
export function ChartSkeleton({ className = "" }) {
    return (
        <div className={`glass-card p-6 rounded-2xl ${className}`}>
            <div className="animate-pulse space-y-4">
                {/* Chart Title */}
                <div className="h-6 bg-white/10 rounded w-1/3" />

                {/* Chart Area */}
                <div className="h-64 bg-white/5 rounded-xl flex items-end justify-around gap-2 p-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white/10 rounded-t w-full"
                            style={{ height: `${Math.random() * 60 + 40}%` }}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="flex gap-4">
                    <div className="h-3 bg-white/10 rounded w-20" />
                    <div className="h-3 bg-white/10 rounded w-20" />
                    <div className="h-3 bg-white/10 rounded w-20" />
                </div>
            </div>
        </div>
    );
}
