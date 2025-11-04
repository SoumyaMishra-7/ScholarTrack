// src/components/admin/ReportsDashboard.jsx
import React, { useState, useMemo } from 'react'

export default function ReportsDashboard({ students, scholarships, applications, stats }) {
  const [dateRange, setDateRange] = useState('all')
  const [activeChart, setActiveChart] = useState('overview')

  // Process data for charts
  const chartData = useMemo(() => {
    const now = new Date()
    const filteredApplications = applications.filter(app => {
      if (dateRange === 'all') return true
      const appDate = new Date(app.appliedDate)
      const diffTime = now - appDate
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      
      switch (dateRange) {
        case '7days': return diffDays <= 7
        case '30days': return diffDays <= 30
        case '90days': return diffDays <= 90
        default: return true
      }
    })

    // Application Status Distribution
    const statusData = {
      submitted: filteredApplications.filter(app => app.status === 'submitted').length,
      approved: filteredApplications.filter(app => app.status === 'approved').length,
      rejected: filteredApplications.filter(app => app.status === 'rejected').length,
      in_progress: filteredApplications.filter(app => app.status === 'in_progress').length
    }

    // Monthly Applications Trend
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const month = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()
      const key = `${month} ${year}`
      
      const monthApplications = filteredApplications.filter(app => {
        const appDate = new Date(app.appliedDate)
        return appDate.getMonth() === date.getMonth() && 
               appDate.getFullYear() === date.getFullYear()
      })
      
      return {
        month: key,
        applications: monthApplications.length,
        approved: monthApplications.filter(app => app.status === 'approved').length,
        rejected: monthApplications.filter(app => app.status === 'rejected').length
      }
    })

    // Scholarship Popularity
    const scholarshipData = scholarships.map(scholarship => {
      const scholarshipApps = filteredApplications.filter(app => 
        app.scholarshipId === scholarship.id
      )
      return {
        name: scholarship.name,
        applications: scholarshipApps.length,
        approved: scholarshipApps.filter(app => app.status === 'approved').length,
        amount: scholarship.amount
      }
    }).sort((a, b) => b.applications - a.applications).slice(0, 8)

    // Student Demographics
    const majorData = students.reduce((acc, student) => {
      acc[student.major] = (acc[student.major] || 0) + 1
      return acc
    }, {})

    const gpaRanges = students.reduce((acc, student) => {
      const gpa = parseFloat(student.gpa)
      if (gpa >= 3.5) acc['3.5-4.0'] = (acc['3.5-4.0'] || 0) + 1
      else if (gpa >= 3.0) acc['3.0-3.49'] = (acc['3.0-3.49'] || 0) + 1
      else if (gpa >= 2.5) acc['2.5-2.99'] = (acc['2.5-2.99'] || 0) + 1
      else acc['Below 2.5'] = (acc['Below 2.5'] || 0) + 1
      return acc
    }, {})

    // Success Rate by Scholarship
    const successRateData = scholarships.map(scholarship => {
      const scholarshipApps = filteredApplications.filter(app => 
        app.scholarshipId === scholarship.id
      )
      const approved = scholarshipApps.filter(app => app.status === 'approved').length
      const rate = scholarshipApps.length > 0 ? (approved / scholarshipApps.length) * 100 : 0
      
      return {
        name: scholarship.name,
        successRate: Math.round(rate),
        totalApplications: scholarshipApps.length,
        approved: approved
      }
    }).filter(item => item.totalApplications > 0).sort((a, b) => b.successRate - a.successRate).slice(0, 6)

    return {
      statusData,
      monthlyData,
      scholarshipData,
      majorData,
      gpaRanges,
      successRateData,
      filteredApplications
    }
  }, [applications, scholarships, students, dateRange])

  // Chart Components
  const DonutChart = ({ data, colors, size = 120 }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0)
    let accumulated = 0
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 42 42" className="transform -rotate-90">
          {Object.entries(data).map(([key, value], index) => {
            if (value === 0) return null
            
            const percentage = (value / total) * 100
            const strokeDasharray = `${percentage} ${100 - percentage}`
            const strokeDashoffset = -accumulated
            accumulated += percentage
            
            return (
              <circle
                key={key}
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700 transform rotate-90">
            {total}
          </span>
        </div>
      </div>
    )
  }

  const BarChart = ({ data, color = 'blue', height = 200 }) => {
    const maxValue = Math.max(...data.map(item => item.value))
    
    return (
      <div className="flex items-end justify-between space-x-2 h-48 pt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-full rounded-t transition-all duration-500 ease-out hover:opacity-80 cursor-pointer bg-gradient-to-t ${
                color === 'blue' ? 'from-blue-500 to-blue-400' :
                color === 'green' ? 'from-green-500 to-green-400' :
                color === 'purple' ? 'from-purple-500 to-purple-400' :
                'from-cyan-500 to-cyan-400'
              }`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-xs text-gray-600 mt-2 text-center leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const LineChart = ({ data, lines, height = 200 }) => {
    const maxValue = Math.max(...data.flatMap(d => lines.map(line => d[line.key])))
    
    return (
      <div className="relative h-48 pt-4">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent, index) => (
            <line
              key={index}
              x1="0"
              y1={`${percent}%`}
              x2="100%"
              y2={`${percent}%`}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Data lines */}
          {lines.map((line, lineIndex) => (
            <polyline
              key={lineIndex}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.map((d, i) => 
                `${(i / (data.length - 1)) * 100},${100 - ((d[line.key] / maxValue) * 100)}`
              ).join(' ')}
              className="transition-all duration-500"
            />
          ))}
          
          {/* Data points */}
          {lines.map((line, lineIndex) => (
            data.map((d, i) => (
              <circle
                key={`${lineIndex}-${i}`}
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={`${100 - ((d[line.key] / maxValue) * 100)}%`}
                r="3"
                fill={line.color}
                className="transition-all duration-500 hover:r-4"
              />
            ))
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((d, i) => (
            <span key={i} className="text-xs text-gray-500">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const ProgressBar = ({ percentage, color = 'blue', label }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${
            color === 'blue' ? 'bg-blue-500' :
            color === 'green' ? 'bg-green-500' :
            color === 'red' ? 'bg-red-500' :
            'bg-purple-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and visual analytics</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'applications', label: 'Applications', icon: '📝' },
            { id: 'scholarships', label: 'Scholarships', icon: '🎓' },
            { id: 'students', label: 'Students', icon: '👥' },
            { id: 'performance', label: 'Performance', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeChart === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Dashboard */}
      {activeChart === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Key Metrics */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold mt-1">{chartData.filteredApplications.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Approval Rate</span>
                <span className="font-semibold">
                  {chartData.filteredApplications.length > 0
                    ? Math.round((chartData.statusData.approved / chartData.filteredApplications.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold mt-1">{chartData.statusData.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-400">
              <div className="flex justify-between text-sm">
                <span className="text-green-100">Success Rate</span>
                <span className="font-semibold">
                  {chartData.filteredApplications.length > 0
                    ? Math.round((chartData.statusData.approved / chartData.filteredApplications.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Students</p>
                <p className="text-3xl font-bold mt-1">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-400">
              <div className="flex justify-between text-sm">
                <span className="text-purple-100">Avg. Applications</span>
                <span className="font-semibold">
                  {students.length > 0 ? Math.round(applications.length / students.length) : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">Total Awarded</p>
                <p className="text-3xl font-bold mt-1">
                  ${applications
                    .filter(app => app.status === 'approved' && app.scholarshipAmount)
                    .reduce((sum, app) => sum + app.scholarshipAmount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cyan-400">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-100">Scholarships</span>
                <span className="font-semibold">{scholarships.length}</span>
              </div>
            </div>
          </div>

          {/* Application Status Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
            <div className="flex items-center justify-center">
              <DonutChart
                data={chartData.statusData}
                colors={['#3B82F6', '#10B981', '#EF4444', '#F59E0B']}
                size={200}
              />
              <div className="ml-8 space-y-3">
                {[
                  { label: 'Submitted', value: chartData.statusData.submitted, color: 'blue' },
                  { label: 'Approved', value: chartData.statusData.approved, color: 'green' },
                  { label: 'Rejected', value: chartData.statusData.rejected, color: 'red' },
                  { label: 'In Progress', value: chartData.statusData.in_progress, color: 'yellow' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
            <LineChart
              data={chartData.monthlyData}
              lines={[
                { key: 'applications', color: '#3B82F6', label: 'Total Applications' },
                { key: 'approved', color: '#10B981', label: 'Approved' },
                { key: 'rejected', color: '#EF4444', label: 'Rejected' }
              ]}
            />
            <div className="flex justify-center space-x-6 mt-4">
              {[
                { color: 'bg-blue-500', label: 'Total Applications' },
                { color: 'bg-green-500', label: 'Approved' },
                { color: 'bg-red-500', label: 'Rejected' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Applications Analytics */}
      {activeChart === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Volume */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Volume</h3>
            <BarChart
              data={chartData.monthlyData.map(item => ({
                label: item.month,
                value: item.applications
              }))}
              color="blue"
            />
          </div>

          {/* Status Over Time */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Over Time</h3>
            <LineChart
              data={chartData.monthlyData}
              lines={[
                { key: 'applications', color: '#3B82F6', label: 'Total' },
                { key: 'approved', color: '#10B981', label: 'Approved' },
                { key: 'rejected', color: '#EF4444', label: 'Rejected' }
              ]}
            />
          </div>

          {/* Application Rates */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{chartData.filteredApplications.length}</div>
                <div className="text-sm text-blue-700 font-medium">Total Applications</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {chartData.filteredApplications.length > 0
                    ? Math.round((chartData.statusData.approved / chartData.filteredApplications.length) * 100)
                    : 0}%
                </div>
                <div className="text-sm text-green-700 font-medium">Approval Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {students.length > 0 ? Math.round(chartData.filteredApplications.length / students.length) : 0}
                </div>
                <div className="text-sm text-purple-700 font-medium">Avg per Student</div>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-xl">
                <div className="text-2xl font-bold text-cyan-600">
                  {scholarships.length > 0 ? Math.round(chartData.filteredApplications.length / scholarships.length) : 0}
                </div>
                <div className="text-sm text-cyan-700 font-medium">Avg per Scholarship</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scholarships Analytics */}
      {activeChart === 'scholarships' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Scholarships */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Scholarships</h3>
            <BarChart
              data={chartData.scholarshipData.map(item => ({
                label: item.name.split(' ')[0], // First word for brevity
                value: item.applications
              }))}
              color="purple"
            />
            <div className="mt-4 space-y-2">
              {chartData.scholarshipData.slice(0, 5).map((scholarship, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700 truncate flex-1">
                    {scholarship.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">{scholarship.applications} apps</span>
                </div>
              ))}
            </div>
          </div>

          {/* Success Rates */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rates by Scholarship</h3>
            <div className="space-y-4">
              {chartData.successRateData.map((scholarship, index) => (
                <ProgressBar
                  key={index}
                  percentage={scholarship.successRate}
                  color={scholarship.successRate >= 50 ? 'green' : scholarship.successRate >= 25 ? 'blue' : 'red'}
                  label={`${scholarship.name} (${scholarship.totalApplications} apps)`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Students Analytics */}
      {activeChart === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Major Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Majors</h3>
            <div className="space-y-3">
              {Object.entries(chartData.majorData)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([major, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{major}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(count / Math.max(...Object.values(chartData.majorData))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* GPA Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GPA Distribution</h3>
            <DonutChart
              data={chartData.gpaRanges}
              colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
              size={180}
            />
            <div className="flex justify-center mt-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(chartData.gpaRanges).map(([range, count], index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      range === '3.5-4.0' ? 'bg-green-500' :
                      range === '3.0-3.49' ? 'bg-blue-500' :
                      range === '2.5-2.99' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-600">{range}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analytics */}
      {activeChart === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Review Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Timeline</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Review Time</span>
                <span className="font-semibold text-gray-900">2.3 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Reviews</span>
                <span className="font-semibold text-gray-900">{chartData.statusData.submitted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {applications.length > 0
                    ? Math.round(((applications.length - chartData.statusData.submitted) / applications.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Scholarship Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Performance</h3>
            <div className="space-y-3">
              {chartData.scholarshipData.slice(0, 5).map((scholarship, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{scholarship.name}</p>
                    <p className="text-xs text-gray-500">
                      {scholarship.approved} approved • ${scholarship.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      {scholarship.applications > 0
                        ? Math.round((scholarship.approved / scholarship.applications) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500">success rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{scholarships.length}</div>
            <div className="text-sm text-gray-600">Active Scholarships</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{applications.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-cyan-600">
              ${applications
                .filter(app => app.status === 'approved' && app.scholarshipAmount)
                .reduce((sum, app) => sum + app.scholarshipAmount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Awarded</div>
          </div>
        </div>
      </div>
    </div>
  )
}