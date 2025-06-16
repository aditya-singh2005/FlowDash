import React from 'react';

const AttendanceHeatMap = () => {
    const data = [
        {
            id: 'HR',
            data: [
                { x: 'Week 1', y: 92 },
                { x: 'Week 2', y: 88 },
                { x: 'Week 3', y: 91 },
                { x: 'Week 4', y: 95 }
            ]
        },
        {
            id: 'IT',
            data: [
                { x: 'Week 1', y: 85 },
                { x: 'Week 2', y: 79 },
                { x: 'Week 3', y: 82 },
                { x: 'Week 4', y: 87 }
            ]
        },
        {
            id: 'Finance',
            data: [
                { x: 'Week 1', y: 90 },
                { x: 'Week 2', y: 93 },
                { x: 'Week 3', y: 88 },
                { x: 'Week 4', y: 91 }
            ]
        },
        {
            id: 'Operations',
            data: [
                { x: 'Week 1', y: 78 },
                { x: 'Week 2', y: 80 },
                { x: 'Week 3', y: 83 },
                { x: 'Week 4', y: 85 }
            ]
        },
        {
            id: 'Marketing',
            data: [
                { x: 'Week 1', y: 95 },
                { x: 'Week 2', y: 92 },
                { x: 'Week 3', y: 96 },
                { x: 'Week 4', y: 94 }
            ]
        },
        {
            id: 'Admin',
            data: [
                { x: 'Week 1', y: 81 },
                { x: 'Week 2', y: 77 },
                { x: 'Week 3', y: 79 },
                { x: 'Week 4', y: 82 }
            ]
        },
        {
            id: 'Legal',
            data: [
                { x: 'Week 1', y: 87 },
                { x: 'Week 2', y: 84 },
                { x: 'Week 3', y: 88 },
                { x: 'Week 4', y: 89 }
            ]
        },
        {
            id: 'Sales',
            data: [
                { x: 'Week 1', y: 70 },
                { x: 'Week 2', y: 72 },
                { x: 'Week 3', y: 74 },
                { x: 'Week 4', y: 73 }
            ]
        },
        {
            id: 'Support',
            data: [
                { x: 'Week 1', y: 76 },
                { x: 'Week 2', y: 78 },
                { x: 'Week 3', y: 80 },
                { x: 'Week 4', y: 77 }
            ]
        },
        {
            id: 'R&D',
            data: [
                { x: 'Week 1', y: 94 },
                { x: 'Week 2', y: 92 },
                { x: 'Week 3', y: 96 },
                { x: 'Week 4', y: 97 }
            ]
        }
    ]

    // Simple heatmap visualization since we don't have access to @nivo/heatmap
    const getColor = (value) => {
   // Blue Shades: 100 → 76
   if (value >= 100) return '#0033cc';    // Pure blue
   if (value >= 98) return '#0040e6';
   if (value >= 96) return '#004dff';
   if (value >= 94) return '#1a5aff';
   if (value >= 92) return '#3366ff';
   if (value >= 90) return '#4d73ff';
   if (value >= 88) return '#6680ff';
   if (value >= 86) return '#808cff';
   if (value >= 84) return '#9999ff';
   if (value >= 82) return '#b3a6ff';
   if (value >= 80) return '#ccb3ff';
   if (value >= 78) return '#d9c2ff';
   if (value >= 76) return '#e6d1ff';
   // Darker Red Shades: 75 → <60
   if (value >= 75) return '#ff002b';
   if (value >= 74) return '#eb0028';
   if (value >= 74) return '#db0227';
   if (value >= 72) return '#c70022';
   if (value >= 70) return '#b3001e';
   if (value >= 68) return '#9e001a';
   if (value >= 66) return '#8f0017';
   if (value >= 64) return '#8f0017';
   if (value >= 62) return '#610010';
   if (value >= 60) return '#52000d';
   return '#110000';  // <60 — darkest red
};

    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const departments = data.map(d => d.id);

    // Helper function to get value for specific dept and week
    const getValue = (dept, week) => {
        const deptData = data.find(d => d.id === dept);
        const weekData = deptData.data.find(w => w.x === week);
        return weekData.y;
    };

    return (
        <div className=" bg-white">
            
            <div className="overflow-auto">
                <div className="inline-block min-w-full">
                    {/* Header */}
                    <div className="flex mb-2">
                        <div className="w-16 text-right pr-4 font-semibold text-gray-700">Week</div>
                        {departments.map(dept => (
                            <div key={dept} className="w-18 text-center font-semibold text-gray-700 text-xs">
                                {dept}
                            </div>
                        ))}
                    </div>
                    
                    {/* Data rows */}
                    {weeks.map(week => (
                        <div key={week} className="flex mb-1">
                            <div className="w-18 text-right pr-4 font-medium text-gray-800 flex items-center justify-end text-sm">
                                {week}
                            </div>
                            {departments.map(dept => (
                                <div 
                                    key={dept}
                                    className="w-18 h-12 m-0.5 flex items-center justify-center text-white font-bold text-xs rounded border border-gray-300"
                                    style={{ backgroundColor: getColor(getValue(dept, week)) }}
                                >
                                    {getValue(dept, week)}%
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Legend */}
            {/* <div className="mt-8 flex justify-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold mb-3 text-center">Attendance Rate Legend</h3>
                    <div className="flex items-center space-x-1">
                        <span className="text-xs">Low</span>
                        {[60, 65, 70, 75, 80, 85, 90, 95, 100].map(val => (
                            <div 
                                key={val}
                                className="w-10 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: getColor(val) }}
                                title={`${val}%`}
                            >
                            </div>
                        ))}
                        <span className="text-xs ml-2">High</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                        Red: Below 75% | Blue: 75% and above<br/>
                        X-axis: Departments | Y-axis: Weeks
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default AttendanceHeatMap