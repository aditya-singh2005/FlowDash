import React, { useEffect, useState } from 'react'
import { User, Mail, Phone, Calendar, MapPin, Building2, Badge, Edit3 } from 'lucide-react'
import axios from 'axios';
import EmpNavbar from "./EmpNavbar"

function EmpProfilePage() {
    // Sample employee data - replace with real data
    const [employeeData, setEmployeeData] = useState(null);

    useEffect(() => {
        fetchEmployeeDetails('Gracie Hamilton');
    },[])
    
    useEffect( () => {
        if(employeeData){
            console.log(employeeData)
        }
    },[employeeData])

    const fetchEmployeeDetails = async (employeeName) => {
        try{
            const response = await axios.get(`http://localhost:3000/api/employee-details?name=${encodeURIComponent(employeeName)}`);
            
            const data = response.data;
            setEmployeeData(data);
        }
        catch(err){
            console.log("Error fetching employee details",err);
        }
    }

    const yearsAtCompany = () => {
        if (!employeeData?.date_of_joining) return "NA";

        const joiningDate = new Date(employeeData.date_of_joining);
        const currentDate = new Date();

        const diffInMilliseconds = currentDate - joiningDate;
        const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); 

        return diffInYears.toFixed(1);
    };


    const employee = {
        id: "EMP001",
        name: "Sarah Johnson",
        department: "Software Engineering",
        email: "sarah.johnson@company.com",
        phone: "+1 (555) 123-4567",
        dateOfJoining: "January 15, 2022",
        location: "New York, NY",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        position: "Senior Software Engineer",
        employmentType: "Full-time"
    }

    const InfoCard = ({ icon: Icon, label, value, colorClass = "text-blue-600" }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${colorClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1 break-words">{value}</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <EmpNavbar />
            
            <div className="max-w-7xl ml-[20%] px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl bg-gradient-to-tl from-slate-200 via-slate-100 to-slate-50 shadow-2xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 h-32 sm:h-40"></div>
                    <div className="px-6 sm:px-8 pb-8 ">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20">
                            <div className="relative">
                                <img
                                    src={employeeData?.profile_url || 'Not Found'}
                                    alt={employeeData?.emp_name || 'Not Found'}
                                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white shadow-xl object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                            </div>
                            
                            <div className="mt-4 sm:mt-0 sm:ml-8 text-center sm:text-left flex-1">
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-100  mb-2">{employeeData?.emp_name || "NA"}</h1>
                                <p className="text-xl font-semibold text-gray-600 mb-2">{employeeData?.department || "NA"}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
                                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {employeeData?.role || "NA"}
                                    </span>
                                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        Active
                                    </span>
                                </div>
                            </div>
                            
                            <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl">
                                <Edit3 className="h-5 w-5" />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <InfoCard 
                        icon={Badge} 
                        label="Employee ID" 
                        value={employeeData?.emp_id || "Not Found"}
                        colorClass="text-purple-600"
                    />
                    <InfoCard 
                        icon={Building2} 
                        label="Department" 
                        value={employeeData?.department || `Not Found`}
                        colorClass="text-indigo-600"
                    />
                    <InfoCard 
                        icon={MapPin} 
                        label="Location" 
                        value={employee?.location || `Not Found`}
                        colorClass="text-red-600"
                    />
                    <InfoCard 
                        icon={Mail} 
                        label="Email Address" 
                        value={employeeData?.email || `Not Found`}
                        colorClass="text-blue-600"
                    />
                    <InfoCard 
                        icon={Phone} 
                        label="Phone Number" 
                        value={employeeData?.phone || `Not Found`}
                        colorClass="text-green-600"
                    />
                    <InfoCard 
                        icon={Calendar} 
                        label="Date of Joining" 
                        value={employeeData?.date_of_joining ? new Date (employeeData.date_of_joining).toLocaleDateString("en-us", {
                            year: "numeric",
                            month: 'long',
                            day: 'numeric'
                        }) : "Not Found"}
                        colorClass="text-orange-600"
                    />
                    
                </div>

                {/* Additional Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3"></div>
                            Quick Stats
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                <span className="font-medium text-gray-700">Years at Company</span>
                                <span className="text-2xl font-bold text-blue-600">{yearsAtCompany()}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                <span className="font-medium text-gray-700">Projects Completed</span>
                                <span className="text-2xl font-bold text-green-600">28</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                <span className="font-medium text-gray-700">Team Members</span>
                                <span className="text-2xl font-bold text-purple-600">12</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mr-3"></div>
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Completed Q2 Performance Review</p>
                                    <p className="text-sm text-gray-500">2 days ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Attended Leadership Training</p>
                                    <p className="text-sm text-gray-500">1 week ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Updated Profile Information</p>
                                    <p className="text-sm text-gray-500">2 weeks ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmpProfilePage