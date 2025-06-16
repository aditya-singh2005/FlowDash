import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy, TrendingUp } from 'lucide-react';
import * as d3 from 'd3';

const EmployeeRaceChart = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [data, setData] = useState([]);
  const [hoveredEmployee, setHoveredEmployee] = useState(null);
  const svgRef = useRef();
  const intervalRef = useRef();

  // Sample data - 12 months of performance data (scaled to 100)
  const performanceData = [
    // Month 1
    [
      { name: 'You', value: 75, color: '#3B82F6', isUser: true },
      { name: 'Emp l', value: 82, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 68, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 71, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 79, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 65, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 73, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 77, color: '#4B5563', isUser: false }
    ],
    // Month 2
    [
      { name: 'You', value: 78, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 84, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 72, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 69, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 81, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 67, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 75, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 79, color: '#4B5563', isUser: false }
    ],
    // Month 3
    [
      { name: 'You', value: 85, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 83, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 76, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 74, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 78, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 71, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 77, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 80, color: '#4B5563', isUser: false }
    ],
    // Month 4
    [
      { name: 'You', value: 88, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 86, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 79, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 72, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 82, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 74, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 81, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 83, color: '#4B5563', isUser: false }
    ],
    // Month 5
    [
      { name: 'You', value: 91, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 88, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 83, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 76, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 85, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 78, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 84, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 86, color: '#4B5563', isUser: false }
    ],
    // Month 6
    [
      { name: 'You', value: 94, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 89, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 86, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 79, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 87, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 81, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 88, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 90, color: '#4B5563', isUser: false }
    ],
    // Month 7
    [
      { name: 'You', value: 96, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 92, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 89, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 82, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 90, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 84, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 91, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 93, color: '#4B5563', isUser: false }
    ],
    // Month 8
    [
      { name: 'You', value: 98, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 94, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 91, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 85, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 92, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 87, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 93, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 95, color: '#4B5563', isUser: false }
    ],
    // Month 9
    [
      { name: 'You', value: 100, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 96, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 93, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 88, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 94, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 89, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 95, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 97, color: '#4B5563', isUser: false }
    ],
    // Month 10
    [
      { name: 'You', value: 100, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 98, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 95, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 90, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 96, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 91, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 97, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 99, color: '#4B5563', isUser: false }
    ],
    // Month 11
    [
      { name: 'You', value: 100, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 100, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 97, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 92, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 98, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 93, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 99, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 100, color: '#4B5563', isUser: false }
    ],
    // Month 12
    [
      { name: 'You', value: 100, color: '#3B82F6', isUser: true },
      { name: 'Emp 1', value: 100, color: '#6B7280', isUser: false },
      { name: 'Emp 2', value: 99, color: '#9CA3AF', isUser: false },
      { name: 'Emp 3', value: 94, color: '#4B5563', isUser: false },
      { name: 'Emp 4', value: 100, color: '#374151', isUser: false },
      { name: 'Emp 5', value: 95, color: '#6B7280', isUser: false },
      { name: 'Emp 6', value: 100, color: '#9CA3AF', isUser: false },
      { name: 'Emp 7', value: 100, color: '#4B5563', isUser: false }
    ]
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    setData(performanceData[currentMonth]);
  }, [currentMonth]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentMonth(prev => {
          if (prev >= 11) {
            setIsPlaying(false);
            return 11;
          }
          return prev + 1;
        });
      }, 1200); // Slightly slower for better vertical animation viewing
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  useEffect(() => {
    drawChart();
  }, [data, hoveredEmployee]);

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    
    const margin = { top: 30, right: 30, bottom: 60, left: 30 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Sort data by value for ranking
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    const xScale = d3.scaleBand()
      .domain(sortedData.map(d => d.name))
      .range([0, width])
      .padding(0.15);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Create or select the main group
    let g = svg.select(".main-group");
    if (g.empty()) {
      g = svg.append("g")
        .attr("class", "main-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    // Add Y-axis grid lines
    let gridLines = g.selectAll(".grid-line")
      .data([0, 20, 40, 60, 80, 100]);
    
    gridLines.enter()
      .append("line")
      .attr("class", "grid-line")
      .merge(gridLines)
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,2");

    // Add Y-axis labels
    let yLabels = g.selectAll(".y-label")
      .data([0, 20, 40, 60, 80, 100]);
    
    yLabels.enter()
      .append("text")
      .attr("class", "y-label")
      .merge(yLabels)
      .attr("x", -10)
      .attr("y", d => yScale(d))
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("font-size", "11px")
      .attr("fill", "#000000")
      .text(d => `${d}%`);

    // Bind data to bars
    let bars = g.selectAll(".bar")
      .data(sortedData, d => d.name);

    // Enter new bars
    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name))
      .attr("y", height)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", d => d.color)
      .attr("rx", 6)
      .attr("ry", 6)
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        setHoveredEmployee(d.name);
      })
      .on("mouseleave", () => {
        setHoveredEmployee(null);
      });

    // Update all bars with smooth transitions
    bars.merge(bars.selectAll(".bar"))
      .transition()
      .duration(800)
      .ease(d3.easeBackOut.overshoot(1.1))
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.value))
      .attr("fill", d => d.color)
      .style("filter", d => hoveredEmployee === d.name ? "brightness(1.15) drop-shadow(0 8px 16px rgba(0,0,0,0.3))" : "none");

    // Add value labels on top of bars
    let valueLabels = g.selectAll(".value-label")
      .data(sortedData, d => d.name);

    valueLabels.enter()
      .append("text")
      .attr("class", "value-label")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "#000000")
      .style("opacity", 0);

    valueLabels.merge(valueLabels.selectAll(".value-label"))
      .transition()
      .duration(800)
      .delay(200)
      .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 6)
      .text(d => `${d.value}%`)
      .style("opacity", 1);

    // Add employee names at bottom
    let nameLabels = g.selectAll(".name-label")
      .data(sortedData, d => d.name);

    nameLabels.enter()
      .append("text")
      .attr("class", "name-label")
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", d => d.isUser ? "700" : "500")
      .style("opacity", 0);

    nameLabels.merge(nameLabels.selectAll(".name-label"))
      .transition()
      .duration(800)
      .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", height + 15)
      .attr("fill", d => {
        if (hoveredEmployee === d.name) return d.isUser ? "#1D4ED8" : "#000000";
        return d.isUser ? "#3B82F6" : "#000000";
      })
      .text(d => d.name)
      .style("opacity", 1);

    // Add rank badges
    let rankBadges = g.selectAll(".rank-badge")
      .data(sortedData, d => d.name);

    rankBadges.enter()
      .append("circle")
      .attr("class", "rank-badge")
      .attr("r", 12)
      .attr("fill", d => d.isUser ? "#3B82F6" : "#9CA3AF")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("opacity", 0);

    rankBadges.merge(rankBadges.selectAll(".rank-badge"))
      .transition()
      .duration(800)
      .delay(300)
      .attr("cx", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.value) - 25)
      .attr("fill", d => d.isUser ? "#3B82F6" : "#9CA3AF")
      .style("opacity", 1);

    // Add rank numbers
    let rankNumbers = g.selectAll(".rank-number")
      .data(sortedData, d => d.name);

    rankNumbers.enter()
      .append("text")
      .attr("class", "rank-number")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("fill", "white")
      .style("opacity", 0);

    rankNumbers.merge(rankNumbers.selectAll(".rank-number"))
      .transition()
      .duration(800)
      .delay(400)
      .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 25)
      .attr("dy", "0.35em")
      .text((d, i) => i + 1)
      .style("opacity", 1);

    // Add trophy for first place
    let trophies = g.selectAll(".trophy")
      .data(sortedData.slice(0, 1), d => d.name);

    trophies.enter()
      .append("text")
      .attr("class", "trophy")
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .style("opacity", 0);

    trophies.merge(trophies.selectAll(".trophy"))
      .transition()
      .duration(800)
      .delay(600)
      .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 45)
      .text("🏆")
      .style("opacity", 1);

    // Remove exited elements
    bars.exit().remove();
    valueLabels.exit().remove();
    nameLabels.exit().remove();
    rankBadges.exit().remove();
    rankNumbers.exit().remove();
    trophies.exit().remove();
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentMonth(0);
  };

  const yourRank = data.sort((a, b) => b.value - a.value).findIndex(d => d.name === 'You') + 1;
  const yourScore = data.find(d => d.name === 'You')?.value || 0;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Anonymous Performance Race Chart</h2>
            <p className="text-sm text-slate-600">Compare your performace with your peers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Current Rank</p>
              <div className="flex items-center gap-1">
                <Trophy className={`w-4 h-4 ${yourRank === 1 ? 'text-yellow-500' : yourRank <= 3 ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className={`text-lg font-bold ${yourRank === 1 ? 'text-yellow-600' : yourRank <= 3 ? 'text-amber-600' : 'text-slate-600'}`}>
                  #{yourRank}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Your Score</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-lg font-bold text-blue-600">{yourScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-500 hover:bg-slate-600 text-white transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Current Period</p>
            <p className="text-sm font-bold text-slate-800">{months[currentMonth]} 2024</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 mb-3 border border-slate-100">
        <svg
          ref={svgRef}
          width="700"
          height="350"
          className="w-full h-auto"
          viewBox="0 0 700 350"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded shadow-sm"></div>
          <span className="font-semibold text-slate-700">You</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-500 rounded shadow-sm"></div>
          <span className="text-slate-600">Other Employees</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Progress</span>
          <span>{currentMonth + 1}/12 months</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${((currentMonth + 1) / 12) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Racing Instructions */}
      <div className="text-center">
        <p className="text-xs text-slate-500 italic">
          🏁 Watch the bars race vertically! Hover over bars for highlights.
        </p>
      </div>
    </div>
  );
};

export default EmployeeRaceChart;