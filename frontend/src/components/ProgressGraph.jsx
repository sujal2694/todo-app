import React, { useContext, useMemo, useState } from 'react'
import { Context } from '../context/context'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const DailyProgressGraph = () => {
  const { todos } = useContext(Context)
  const [viewMode, setViewMode] = useState('daily') // 'daily' or 'monthly'

  const dailyStats = useMemo(() => {
    const list = Array.isArray(todos) ? todos : []
    const completed = list.filter(t => !!t.completed).length
    const total = list.length
    const pending = Math.max(0, total - completed)
    return { pending, completed, total }
  }, [todos])

  const monthlyStats = useMemo(() => {
    const list = Array.isArray(todos) ? todos : []
    const monthlyData = {}

    list.forEach(todo => {
      // Assume todos have a createdAt or date field
      const date = todo.createdAt ? new Date(todo.createdAt) : new Date()
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, completed: 0, pending: 0 }
      }
      
      monthlyData[monthKey].total++
      if (todo.completed) {
        monthlyData[monthKey].completed++
      } else {
        monthlyData[monthKey].pending++
      }
    })

    // Sort by month and get last 6 months
    const sortedMonths = Object.keys(monthlyData).sort().slice(-6)
    
    return {
      labels: sortedMonths.map(m => {
        const [year, month] = m.split('-')
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }),
      data: sortedMonths.map(m => monthlyData[m]),
      raw: monthlyData
    }
  }, [todos])

  const dailyData = {
    labels: ['Pending', 'Completed'],
    datasets: [
      {
        label: 'Tasks',
        data: [dailyStats.pending, dailyStats.completed],
        backgroundColor: ['#fb923c', '#10b981'],
        borderRadius: 6
      }
    ]
  }

  const monthlyData = {
    labels: monthlyStats.labels,
    datasets: [
      {
        label: 'Completed',
        data: monthlyStats.data.map(d => d.completed),
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        tension: 0.4
      },
      {
        label: 'Pending',
        data: monthlyStats.data.map(d => d.pending),
        backgroundColor: '#fb923c',
        borderColor: '#fb923c',
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: viewMode === 'monthly',
        position: 'top'
      },
      title: { 
        display: true, 
        text: viewMode === 'daily' ? 'Daily Task Summary' : 'Monthly Progress Trend'
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y ?? ctx.parsed}`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  }

  const completionRate = monthlyStats.data.length > 0
    ? (monthlyStats.data.reduce((sum, d) => sum + (d.total > 0 ? (d.completed / d.total) * 100 : 0), 0) / monthlyStats.data.length).toFixed(1)
    : 0

  return (
    <div className='w-[95vw] lg:w-[70vw] md:w-[80vw] bg-white m-auto mt-10 p-6 rounded-2xl shadow-2xl mb-10'>
      <div className='flex items-start justify-between flex-wrap gap-4'>
        <div className='flex items-start flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <i className='bx bx-chart text-4xl text-purple-700'></i>
            <h1 className='text-2xl font-semibold'>
              {viewMode === 'daily' ? 'Daily Task Summary' : 'Monthly Progress Analysis'}
            </h1>
          </div>
          <p className='text-[14px] text-gray-400'>
            {viewMode === 'daily' 
              ? 'Pending, completed and total tasks' 
              : `Average completion rate: ${completionRate}%`}
          </p>
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'daily'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'monthly'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {todos.length > 0 ? (
        <>
          <div className='h-64 mt-6'>
            {viewMode === 'daily' ? (
              <Bar data={dailyData} options={chartOptions} />
            ) : (
              <Line data={monthlyData} options={chartOptions} />
            )}
          </div>

          {viewMode === 'monthly' && monthlyStats.data.length > 0 && (
            <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-blue-50 p-4 rounded-lg'>
                <p className='text-sm text-gray-600'>Total Tasks (All Time)</p>
                <p className='text-2xl font-bold text-blue-700'>
                  {Object.values(monthlyStats.raw).reduce((sum, d) => sum + d.total, 0)}
                </p>
              </div>
              <div className='bg-green-50 p-4 rounded-lg'>
                <p className='text-sm text-gray-600'>Completed Tasks</p>
                <p className='text-2xl font-bold text-green-700'>
                  {Object.values(monthlyStats.raw).reduce((sum, d) => sum + d.completed, 0)}
                </p>
              </div>
              <div className='bg-orange-50 p-4 rounded-lg'>
                <p className='text-sm text-gray-600'>Pending Tasks</p>
                <p className='text-2xl font-bold text-orange-700'>
                  {Object.values(monthlyStats.raw).reduce((sum, d) => sum + d.pending, 0)}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='flex items-center justify-center flex-col mt-16 mb-16'>
          <i className='bx bx-check-circle text-5xl text-gray-400 mb-3'></i>
          <h2 className='text-md text-gray-400'>No todos yet</h2>
          <p className='text-sm text-gray-400'>Create one to get started!</p>
        </div>
      )}
    </div>
  )
}

export default DailyProgressGraph