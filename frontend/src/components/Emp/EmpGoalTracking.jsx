import React, { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Target, TrendingUp, Calendar, CheckCircle, Plus, Edit3, Award, Clock, Star } from 'lucide-react';
import EmpNavbar from './EmpNavbar';

// Performance data for radar chart
const performanceData = [
  { category: 'Goal Achievement', current: 85, target: 90 },
  { category: 'Task Completion', current: 92, target: 95 },
  { category: 'Innovation', current: 78, target: 85 },
  { category: 'Collaboration', current: 88, target: 90 },
  { category: 'Communication', current: 82, target: 88 },
  { category: 'Learning', current: 90, target: 95 },
];

// Progress data for line chart
const progressData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 78 },
  { month: 'Mar', score: 82 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 88 },
  { month: 'Jun', score: 85 },
];

function EmpGoalTracking() {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Complete Project Alpha', progress: 75, deadline: '2025-08-15', status: 'In Progress' },
    { id: 2, title: 'Improve Team Communication', progress: 90, deadline: '2025-07-30', status: 'Almost Done' },
    { id: 3, title: 'Learn New Technology Stack', progress: 45, deadline: '2025-09-01', status: 'In Progress' },
  ]);

  const [notes, setNotes] = useState([
    { id: 1, content: 'Focus on completing the frontend components this week', date: '2025-07-08' },
    { id: 2, content: 'Team meeting went well, need to follow up on action items', date: '2025-07-07' },
  ]);

  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Weekly Code Review', completed: true, points: 10 },
    { id: 2, title: 'Mentor Junior Developer', completed: false, points: 15 },
    { id: 3, title: 'Attend Training Session', completed: true, points: 5 },
  ]);

  const [newNote, setNewNote] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', deadline: '' });

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { 
        id: Date.now(), 
        content: newNote, 
        date: new Date().toISOString().split('T')[0] 
      }]);
      setNewNote('');
    }
  };

  const addGoal = () => {
    if (newGoal.title.trim() && newGoal.deadline) {
      setGoals([...goals, {
        id: Date.now(),
        title: newGoal.title,
        progress: 0,
        deadline: newGoal.deadline,
        status: 'Not Started'
      }]);
      setNewGoal({ title: '', deadline: '' });
      setShowAddGoal(false);
    }
  };

  const toggleChallenge = (id) => {
    setChallenges(challenges.map(challenge => 
      challenge.id === id ? { ...challenge, completed: !challenge.completed } : challenge
    ));
  };

  const totalPoints = challenges.reduce((sum, challenge) => 
    sum + (challenge.completed ? challenge.points : 0), 0
  );

  return (
    <div className="min-h-screen bg-blue-100">
      <EmpNavbar />
      
      <div className="ml-[20%] p-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-xl">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            Goal Tracking Dashboard
          </h1>
          <p className="text-slate-200 text-lg">Track your progress, set new goals, and achieve excellence</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Goals</p>
                <p className="text-3xl font-bold text-blue-600">{goals.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Progress</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Challenge Points</p>
                <p className="text-3xl font-bold text-purple-600">{totalPoints}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-3xl font-bold text-orange-600">88</p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" className="text-sm" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Goals Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Active Goals</h3>
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {goals.map(goal => (
                  <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 text-sm">{goal.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Challenges */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Challenges</h3>
              <div className="space-y-3">
                {challenges.map(challenge => (
                  <div key={challenge.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleChallenge(challenge.id)}
                        className={`p-1 rounded-full ${
                          challenge.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <span className={`text-sm ${
                        challenge.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {challenge.title}
                      </span>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      +{challenge.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Progress Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Notes</h3>
            <div className="space-y-3 mb-4">
              {notes.map(note => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 text-sm">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{note.date}</p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addNote}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Goals Completed This Month</span>
                <span className="font-bold text-green-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-bold text-blue-600">4.8/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Streak Days</span>
                <span className="font-bold text-purple-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Next Deadline</span>
                <span className="font-bold text-orange-600">3 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Goal</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Goal title..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={addGoal}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmpGoalTracking;