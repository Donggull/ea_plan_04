import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'
import { queryKeys } from '@/lib/react-query'

// 차트 데이터 타입
interface ChartData {
  name: string
  projects: number
  completed: number
  active: number
}

// 모킹 데이터 (실제로는 Supabase에서 가져옴)
const mockChartData: ChartData[] = [
  { name: '1월', projects: 12, completed: 8, active: 4 },
  { name: '2월', projects: 15, completed: 10, active: 5 },
  { name: '3월', projects: 18, completed: 12, active: 6 },
  { name: '4월', projects: 22, completed: 16, active: 6 },
  { name: '5월', projects: 25, completed: 18, active: 7 },
  { name: '6월', projects: 28, completed: 20, active: 8 },
  { name: '7월', projects: 32, completed: 23, active: 9 },
  { name: '8월', projects: 35, completed: 25, active: 10 },
  { name: '9월', projects: 38, completed: 28, active: 10 },
  { name: '10월', projects: 42, completed: 30, active: 12 },
  { name: '11월', projects: 45, completed: 33, active: 12 },
  { name: '12월', projects: 48, completed: 35, active: 13 }
]

type ChartType = 'area' | 'bar'

export function ProjectChart() {
  const [chartType, setChartType] = useState<ChartType>('area')
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('1y')

  // 프로젝트 차트 데이터 쿼리
  const { data: chartData, isLoading } = useQuery({
    queryKey: [...queryKeys.analytics.dashboard(), 'chart', timeRange],
    queryFn: async () => {
      // TODO: 실제 Supabase 쿼리로 대체
      await new Promise(resolve => setTimeout(resolve, 500))

      // 시간 범위에 따른 데이터 필터링
      const monthsToShow = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
      return mockChartData.slice(-monthsToShow)
    },
    staleTime: 1000 * 60 * 10, // 10분
  })

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-80 linear-flex-center">
          <div className="linear-loading linear-loading-lg"></div>
        </div>
      )
    }

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--linear-accent-blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--linear-accent-blue)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--linear-accent-green)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--linear-accent-green)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--linear-border-primary)" />
            <XAxis
              dataKey="name"
              stroke="var(--linear-text-tertiary)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--linear-text-tertiary)"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--linear-bg-elevated)',
                border: '1px solid var(--linear-border-primary)',
                borderRadius: 'var(--linear-radius-md)',
                color: 'var(--linear-text-primary)'
              }}
            />
            <Area
              type="monotone"
              dataKey="projects"
              stroke="var(--linear-accent-blue)"
              fillOpacity={1}
              fill="url(#colorProjects)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="var(--linear-accent-green)"
              fillOpacity={1}
              fill="url(#colorCompleted)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--linear-border-primary)" />
          <XAxis
            dataKey="name"
            stroke="var(--linear-text-tertiary)"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="var(--linear-text-tertiary)"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--linear-bg-elevated)',
              border: '1px solid var(--linear-border-primary)',
              borderRadius: 'var(--linear-radius-md)',
              color: 'var(--linear-text-primary)'
            }}
          />
          <Bar
            dataKey="completed"
            fill="var(--linear-accent-green)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="active"
            fill="var(--linear-accent-blue)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="linear-card">
      {/* 차트 헤더 */}
      <div className="linear-flex-between mb-6">
        <div>
          <h3 className="linear-title-2 mb-1">프로젝트 진행 현황</h3>
          <p className="linear-text-small linear-text-tertiary">
            시간에 따른 프로젝트 완료 및 진행 상황
          </p>
        </div>

        <div className="linear-flex-end linear-gap-sm">
          {/* 시간 범위 선택 */}
          <div className="linear-flex rounded-linear-md bg-background-secondary p-1">
            {(['3m', '6m', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-linear-sm linear-text-small transition-all ${
                  timeRange === range
                    ? 'bg-accent-blue text-white'
                    : 'linear-text-tertiary hover:linear-text-secondary'
                }`}
              >
                {range === '3m' ? '3개월' : range === '6m' ? '6개월' : '1년'}
              </button>
            ))}
          </div>

          {/* 차트 타입 선택 */}
          <div className="linear-flex rounded-linear-md bg-background-secondary p-1">
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-linear-sm transition-all ${
                chartType === 'area'
                  ? 'bg-accent-blue text-white'
                  : 'linear-text-tertiary hover:linear-text-secondary'
              }`}
              title="영역 차트"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-linear-sm transition-all ${
                chartType === 'bar'
                  ? 'bg-accent-blue text-white'
                  : 'linear-text-tertiary hover:linear-text-secondary'
              }`}
              title="막대 차트"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="linear-flex-start linear-gap-lg mb-4">
        <div className="linear-flex-center linear-gap-xs">
          <div className="w-3 h-3 rounded-full bg-accent-blue"></div>
          <span className="linear-text-small linear-text-secondary">
            {chartType === 'area' ? '총 프로젝트' : '진행 중'}
          </span>
        </div>
        <div className="linear-flex-center linear-gap-xs">
          <div className="w-3 h-3 rounded-full bg-accent-green"></div>
          <span className="linear-text-small linear-text-secondary">
            완료된 프로젝트
          </span>
        </div>
      </div>

      {/* 차트 */}
      {renderChart()}
    </div>
  )
}