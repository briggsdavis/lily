"use client"

import { ArrowRightIcon } from "@phosphor-icons/react"
import { useQuery } from "convex/react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { dashboardRef } from "@/lib/admin-api"

const ranges = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
] as const
const chartSeries = [
  { color: "#5a2631", key: "pageViews", label: "Page views" },
  { color: "#93606d", key: "uniqueVisitors", label: "Unique visitors" },
  { color: "#866528", key: "menuViews", label: "Menu views" },
  { color: "#334b3c", key: "eventViews", label: "Event views" },
  { color: "#b27052", key: "inquiries", label: "Inquiries" },
] as const

export function AdminDashboard() {
  const [days, setDays] = useState<7 | 30 | 90 | 180>(30)
  const data = useQuery(dashboardRef, { days })
  const lines = useMemo(() => {
    const points = data?.points ?? []
    const max = Math.max(
      1,
      ...points.flatMap((point) => chartSeries.map((series) => point[series.key])),
    )
    return chartSeries.map((series) => ({
      ...series,
      points: points
        .map(
          (point, index) =>
            `${points.length === 1 ? 0 : (index / (points.length - 1)) * 100},${48 - (point[series.key] / max) * 42}`,
        )
        .join(" "),
    }))
  }, [data])
  const metrics = data
    ? [
        ["Page views", data.metrics.pageViews],
        ["Unique visitors", data.metrics.uniqueVisitors],
        ["Menu views", data.metrics.menuViews],
        ["Event views", data.metrics.eventViews],
        ["Inquiries", data.metrics.inquiries],
      ]
    : []

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-deep-brown/60">Your site at a glance.</p>
        </div>
        <div className="flex w-fit rounded-xl border border-deep-brown/10 bg-white p-1 shadow-sm">
          {ranges.map((range) => (
            <button
              aria-pressed={days === range.days}
              className="min-w-12 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-stone-100 aria-pressed:bg-deep-brown aria-pressed:text-white"
              key={range.days}
              onClick={() => setDays(range.days)}
              type="button"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.length
          ? metrics.map(([label, value]) => (
              <article
                className="rounded-2xl border border-deep-brown/10 bg-white p-5 shadow-sm"
                key={label}
              >
                <p className="text-sm font-medium text-deep-brown/60">{label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {value.toLocaleString()}
                </p>
              </article>
            ))
          : Array.from({ length: 5 }, (_, index) => (
              <div className="h-28 rounded-2xl bg-deep-brown/8" key={index} />
            ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_19rem]">
        <section className="rounded-2xl border border-deep-brown/10 bg-white p-5 shadow-sm md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Visits over time</h2>
            </div>
            <p className="text-sm text-deep-brown/55">Last {days} days</p>
          </div>
          <div className="relative h-72 border-b border-l border-deep-brown/20">
            {lines[0]?.points ? (
              <svg
                aria-label="Five site metrics over the selected period"
                className="absolute inset-0 h-full w-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 50"
              >
                <title>Five site metrics over the selected period</title>
                {lines.map((series) => (
                  <polyline
                    className="admin-chart-line"
                    fill="none"
                    key={series.key}
                    points={series.points}
                    stroke={series.color}
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            ) : (
              <div className="grid h-full place-items-center text-sm text-deep-brown/50">
                Analytics will appear as visits are recorded.
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {chartSeries.map((series) => (
              <span className="flex items-center gap-2 text-xs" key={series.key}>
                <span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
                {series.label}
              </span>
            ))}
          </div>
        </section>
        <aside className="grid content-start gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Needs attention</h2>
          <Link
            className="group rounded-2xl border border-deep-brown bg-deep-brown p-5 text-white shadow-sm hover:bg-deep-brown/90"
            href="/admin/contact"
          >
            <p className="text-xs font-bold text-cream/65 uppercase">New contact inquiries</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-semibold">{data?.newContact ?? "N/A"}</span>
              <ArrowRightIcon
                aria-hidden="true"
                className="size-5 transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
          <Link
            className="group rounded-2xl border border-deep-brown/10 bg-white p-5 shadow-sm hover:border-deep-brown/25"
            href="/admin/catering"
          >
            <p className="text-xs font-bold text-wine uppercase">New catering inquiries</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-semibold">{data?.newCatering ?? "N/A"}</span>
              <ArrowRightIcon
                aria-hidden="true"
                className="size-5 transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
        </aside>
      </div>
    </div>
  )
}
