import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'red' | 'plan' | 'build' | 'security'
  trend?: number
  isLoading?: boolean
}

export function StatsCard({
  title,
  value,
  icon,
  color,
  trend,
  isLoading
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'linear-bg-blue-soft',
      icon: 'linear-accent-blue'
    },
    green: {
      bg: 'linear-bg-green-soft',
      icon: 'linear-accent-green'
    },
    orange: {
      bg: 'linear-bg-orange-soft',
      icon: 'linear-accent-orange'
    },
    red: {
      bg: 'linear-bg-red-soft',
      icon: 'linear-accent-red'
    },
    plan: {
      bg: 'linear-bg-plan-soft',
      icon: 'linear-accent-plan'
    },
    build: {
      bg: 'linear-bg-build-soft',
      icon: 'linear-accent-build'
    },
    security: {
      bg: 'linear-bg-security-soft',
      icon: 'linear-accent-security'
    }
  }

  const colorClass = colorClasses[color]

  if (isLoading) {
    return (
      <div className="linear-card linear-animate-pulse">
        <div className="linear-flex-between">
          <div className="flex-1">
            <div className="h-4 bg-background-tertiary rounded mb-3"></div>
            <div className="h-8 bg-background-tertiary rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-background-tertiary rounded-linear-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="linear-card hover:shadow-linear-md transition-all duration-linear-normal">
      <div className="linear-flex-between">
        <div className="flex-1">
          <p className="linear-text-small linear-text-muted mb-2">
            {title}
          </p>
          <div className="linear-flex-start linear-gap-sm items-end">
            <p className="linear-title-3 linear-text-primary font-bold">
              {value.toLocaleString()}
            </p>
            {trend !== undefined && (
              <div className={`linear-flex-center linear-gap-xs ${
                trend >= 0 ? 'linear-accent-green' : 'linear-accent-red'
              }`}>
                {trend >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="linear-text-mini font-medium">
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={`w-12 h-12 rounded-linear-lg linear-flex-center ${colorClass.bg}`}>
          <div className={colorClass.icon}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}