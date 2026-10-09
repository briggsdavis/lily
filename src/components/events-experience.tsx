"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { MouseEvent, SyntheticEvent } from "react"
import { flushSync } from "react-dom"
import { events, weekdays } from "@/data/events"

type ViewMode = "events" | "calendar"

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => void
}

function EventImageStack({
  active,
  className,
  imageClassName = "",
  side,
  sizes,
}: {
  active: number
  className: string
  imageClassName?: string
  side: "left" | "right"
  sizes: string
}) {
  return (
    <div aria-hidden="true" className={`relative overflow-hidden ${className}`}>
      {events.map((event, index) => {
        const src = side === "left" ? event.leftImage : event.rightImage
        return (
          <div
            className={`absolute inset-0 transition-[clip-path] duration-900 ease-lily ${
              index === active
                ? "z-10 [clip-path:inset(0_0_0_0)]"
                : "z-0 [clip-path:inset(100%_0_0_0)]"
            }`}
            key={`${side}-${src}`}
          >
            <Image
              alt=""
              className={`object-cover ${imageClassName}`}
              fill
              sizes={sizes}
              src={src}
            />
          </div>
        )
      })}
    </div>
  )
}

function EventList({
  expanded,
  onActivate,
  onToggle,
}: {
  expanded: number | null
  onActivate: (index: number) => void
  onToggle: (index: number) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 64rem)")
    const eventItems = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-event-item]") ?? [],
    )
    let pointerPosition: { x: number; y: number } | null = null
    let frame = 0

    const updateActiveEvent = () => {
      frame = 0
      if (!desktopQuery.matches || !listRef.current?.getClientRects().length) return

      if (pointerPosition) {
        const hoveredItem = document
          .elementFromPoint(pointerPosition.x, pointerPosition.y)
          ?.closest<HTMLElement>("[data-event-item]")
        const hoveredIndex = Number(hoveredItem?.dataset.eventIndex)

        if (
          hoveredItem &&
          listRef.current?.contains(hoveredItem) &&
          Number.isInteger(hoveredIndex) &&
          events[hoveredIndex]
        ) {
          onActivate(hoveredIndex)
          return
        }
      }

      const viewportFocus = window.innerHeight * 0.5
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      eventItems.forEach((item, index) => {
        const bounds = item.getBoundingClientRect()
        const itemCenter = bounds.top + bounds.height / 2
        const distance = Math.abs(itemCenter - viewportFocus)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      onActivate(closestIndex)
    }

    const queueUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateActiveEvent)
    }
    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        pointerPosition = { x: event.clientX, y: event.clientY }
      }
    }

    updateActiveEvent()
    window.addEventListener("pointermove", trackPointer, { passive: true })
    window.addEventListener("scroll", queueUpdate, { passive: true })
    window.addEventListener("resize", queueUpdate)
    desktopQuery.addEventListener("change", queueUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", trackPointer)
      window.removeEventListener("scroll", queueUpdate)
      window.removeEventListener("resize", queueUpdate)
      desktopQuery.removeEventListener("change", queueUpdate)
    }
  }, [onActivate])

  const activateEvent = useCallback(
    (event: SyntheticEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.eventIndex)
      if (Number.isInteger(index) && events[index]) onActivate(index)
    },
    [onActivate],
  )
  const toggleSelectedEvent = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.eventIndex)
      if (Number.isInteger(index) && events[index]) onToggle(index)
    },
    [onToggle],
  )

  return (
    <div ref={listRef}>
      {events.map((event, index) => {
        const isExpanded = expanded === index
        return (
          <article
            className="border-b border-pink/35"
            data-event-index={index}
            data-event-item
            key={event.title}
          >
            <button
              aria-controls={`event-details-${index}`}
              aria-expanded={isExpanded}
              className="group grid w-full cursor-pointer gap-4 py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-inset sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)_auto] sm:items-start md:py-9 lg:min-h-[42vh] lg:content-start lg:py-16"
              data-event-index={index}
              onClick={toggleSelectedEvent}
              onFocus={activateEvent}
              onMouseEnter={activateEvent}
              type="button"
            >
              <span className="text-xs font-bold tracking-[0.08em] text-pink uppercase">
                {event.dateLabel}
              </span>
              <span>
                <span className="block font-display text-2xl leading-tight md:text-3xl">
                  {event.title}
                </span>
                <span className="mt-1 block text-sm text-cream/60">{event.time}</span>
              </span>
              <span
                aria-hidden="true"
                className={`text-xl transition-transform duration-500 ${isExpanded ? "rotate-45" : "rotate-0"}`}
              >
                +
              </span>
            </button>

            <div
              aria-hidden={!isExpanded}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-lily ${
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              id={`event-details-${index}`}
              inert={!isExpanded}
            >
              <div className="overflow-hidden">
                <p className="max-w-[46ch] pb-8 text-sm leading-7 text-cream/75 sm:ml-[calc(35%+0.5rem)] md:pb-10 md:text-base">
                  {event.description}
                </p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function ViewSelector({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) {
  const selectView = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const nextMode = event.currentTarget.dataset.viewMode
      if (nextMode === "events" || nextMode === "calendar") onChange(nextMode)
    },
    [onChange],
  )

  return (
    <div className="flex items-center gap-4 text-xs font-bold tracking-[0.08em] uppercase sm:gap-6">
      <button
        aria-pressed={mode === "events"}
        className="animated-underline cursor-pointer pb-1 opacity-55 transition-opacity aria-pressed:opacity-100"
        data-view-mode="events"
        onClick={selectView}
        type="button"
      >
        Upcoming events
      </button>
      <button
        aria-pressed={mode === "calendar"}
        className="animated-underline cursor-pointer pb-1 opacity-55 transition-opacity aria-pressed:opacity-100"
        data-view-mode="calendar"
        onClick={selectView}
        type="button"
      >
        Calendar
      </button>
    </div>
  )
}

function EventsSectionHeader({
  eyebrow,
  mode,
  onChange,
  sticky = false,
}: {
  eyebrow: string
  mode: ViewMode
  onChange: (mode: ViewMode) => void
  sticky?: boolean
}) {
  return (
    <header
      className={`flex flex-col gap-6 border-b border-pink/35 pb-7 sm:flex-row sm:items-end sm:justify-between ${
        sticky
          ? "mb-10 lg:sticky lg:top-20 lg:z-30 lg:mb-0 lg:bg-events-gray lg:pt-4 lg:pb-5 lg:before:pointer-events-none lg:before:absolute lg:before:inset-x-0 lg:before:bottom-full lg:before:h-20 lg:before:bg-events-gray"
          : "mb-8"
      }`}
    >
      <div>
        <p className="mb-2 eyebrow text-pink/70">{eyebrow}</p>
        <h2 className="font-display text-4xl font-medium text-pink md:text-5xl lg:text-6xl">
          Lily Events Calendar
        </h2>
      </div>
      <ViewSelector mode={mode} onChange={onChange} />
    </header>
  )
}

export function EventsExperience() {
  const [mode, setMode] = useState<ViewMode>("events")
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 9, 1))
  const [calendarEvent, setCalendarEvent] = useState<number | null>(null)

  const switchMode = useCallback(
    (nextMode: ViewMode) => {
      if (nextMode === mode) return
      const transitionDocument = document as ViewTransitionDocument
      const update = () => flushSync(() => setMode(nextMode))

      if (transitionDocument.startViewTransition) {
        transitionDocument.startViewTransition(update)
      } else {
        update()
      }
    },
    [mode],
  )

  const toggleEvent = useCallback((index: number) => {
    setActive(index)
    setExpanded((current) => (current === index ? null : index))
  }, [])

  const changeMonth = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const offset = Number(event.currentTarget.dataset.monthOffset)
    if (!Number.isInteger(offset)) return
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
    setCalendarEvent(null)
  }, [])

  const selectCalendarEvent = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.calendarEvent)
    if (Number.isInteger(index) && events[index]) setCalendarEvent(index)
  }, [])

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstWeekday + 1
      return {
        day: day > 0 && day <= daysInMonth ? day : null,
        key: `calendar-${year}-${month}-${index}`,
      }
    })
  }, [calendarMonth])

  const monthEvents = useMemo(
    () =>
      events
        .map((event, index) => ({ event, index }))
        .filter(
          ({ event }) =>
            event.year === calendarMonth.getFullYear() && event.month === calendarMonth.getMonth(),
        ),
    [calendarMonth],
  )

  return (
    <section className="min-h-dvh bg-events-gray text-cream" data-nav-tone="dark">
      <div className="[view-transition-name:events-view]">
        {mode === "events" ? (
          <div className="min-h-dvh px-page pt-20 lg:pt-28">
            <div>
              <EventsSectionHeader eyebrow="What's on" mode={mode} onChange={switchMode} sticky />

              <div className="hidden grid-cols-[minmax(9rem,0.6fr)_minmax(28rem,1.8fr)_minmax(11rem,0.7fr)] items-start gap-10 lg:grid xl:grid-cols-[minmax(10rem,0.7fr)_minmax(24rem,1.45fr)_minmax(16rem,0.9fr)] xl:gap-16">
                <div className="sticky top-40 flex h-[calc(100dvh-11rem)] items-center">
                  <EventImageStack
                    active={active}
                    className="aspect-4/3 w-full max-w-[15rem]"
                    side="left"
                    sizes="15rem"
                  />
                </div>
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none sticky top-[11.5rem] z-20 -mb-16 h-16 bg-linear-to-b from-events-gray via-events-gray/80 to-transparent [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)] backdrop-blur-[6px]"
                  />
                  <EventList expanded={expanded} onActivate={setActive} onToggle={toggleEvent} />
                </div>
                <div className="sticky top-40 flex h-[calc(100dvh-11rem)] items-center justify-end">
                  <EventImageStack
                    active={active}
                    className="aspect-4/5 w-full max-w-sm"
                    side="right"
                    sizes="24vw"
                  />
                </div>
              </div>

              <div className="lg:hidden">
                <EventImageStack
                  active={active}
                  className="mb-10 aspect-16/10 w-full"
                  imageClassName="object-center"
                  side="right"
                  sizes="calc(100vw - 2.5rem)"
                />
                <EventList expanded={expanded} onActivate={setActive} onToggle={toggleEvent} />
              </div>
            </div>
            <div aria-hidden="true" className="h-64 lg:h-80" />
          </div>
        ) : (
          <div className="min-h-dvh bg-events-gray px-page pt-20 pb-64 lg:pt-28 lg:pb-80">
            <EventsSectionHeader eyebrow="Plan an evening" mode={mode} onChange={switchMode} />

            <div className="mb-5 flex items-center justify-between">
              <button
                aria-label="Previous month"
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-cream/50 transition-colors hover:bg-cream hover:text-dark-green"
                data-month-offset="-1"
                onClick={changeMonth}
                type="button"
              >
                &larr;
              </button>
              <h3 className="font-display text-2xl md:text-3xl">
                {monthFormatter.format(calendarMonth)}
              </h3>
              <button
                aria-label="Next month"
                className="grid size-11 cursor-pointer place-items-center rounded-full border border-cream/50 transition-colors hover:bg-cream hover:text-dark-green"
                data-month-offset="1"
                onClick={changeMonth}
                type="button"
              >
                &rarr;
              </button>
            </div>

            <div className="pb-4">
              <div className="min-w-0 border-t border-l border-pink/35">
                <div className="grid grid-cols-7">
                  {weekdays.map(([weekday, shortWeekday]) => (
                    <div
                      className="border-r border-b border-pink/35 px-1 py-2 text-center text-[0.55rem] font-bold tracking-[0.08em] text-pink uppercase sm:px-3 sm:text-[0.65rem]"
                      key={weekday}
                    >
                      <span className="sm:hidden">{shortWeekday}</span>
                      <span className="hidden sm:inline">{weekday}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map(({ day, key }) => {
                    const dayEvents = day
                      ? monthEvents.filter(({ event }) => event.day === day)
                      : []
                    return (
                      <div
                        className="min-h-20 border-r border-b border-pink/35 p-1 sm:min-h-28 sm:p-2 md:p-3 xl:min-h-32"
                        key={key}
                      >
                        {day ? <p className="mb-2 text-xs text-cream/55">{day}</p> : null}
                        {dayEvents.map(({ event, index }) => (
                          <button
                            aria-pressed={calendarEvent === index}
                            className="w-full cursor-pointer overflow-hidden border-l-2 border-pink bg-pink/10 px-1 py-1 text-left transition-colors hover:bg-pink hover:text-dark-green aria-pressed:bg-pink aria-pressed:text-dark-green sm:px-2 sm:py-1.5"
                            data-calendar-event={index}
                            key={event.title}
                            onClick={selectCalendarEvent}
                            type="button"
                          >
                            <span className="block text-[0.55rem] leading-tight font-semibold sm:text-xs">
                              {event.title}
                            </span>
                            <span className="mt-0.5 block text-[0.5rem] opacity-70 sm:text-[0.65rem]">
                              {event.time}
                            </span>
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {calendarEvent !== null ? (
              <div className="mt-4 grid gap-3 border-l-2 border-pink pl-4 md:grid-cols-[1fr_2fr] md:gap-8">
                <div>
                  <p className="eyebrow text-pink">{events[calendarEvent].dateLabel}</p>
                  <p className="mt-1 font-display text-xl">{events[calendarEvent].title}</p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-cream/70">
                  {events[calendarEvent].description}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
