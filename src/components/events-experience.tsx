"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, SyntheticEvent } from "react";
import { flushSync } from "react-dom";
import { DoubleFrame } from "@/components/double-frame";
import { PillLink } from "@/components/pill-button";
import { RotatingCrest } from "@/components/rotating-crest";
import {
  events as fallbackEvents,
  weekdays,
  type LilyEvent,
} from "@/data/events";
import { publicEventsRef, type EventRecord } from "@/lib/admin-api";

type ViewMode = "events" | "calendar";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => void;
};

function EventImageStack({
  active,
  className,
  imageClassName = "",
  side,
  sizes,
  events,
}: {
  active: number;
  className: string;
  imageClassName?: string;
  side: "left" | "right";
  sizes: string;
  events: readonly LilyEvent[];
}) {
  return (
    <div aria-hidden="true" className={`relative overflow-hidden ${className}`}>
      {events.map((event, index) => {
        const src = side === "left" ? event.leftImage : event.rightImage;
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
        );
      })}
    </div>
  );
}

function EventList({
  events,
  expanded,
  onActivate,
  onToggle,
}: {
  events: readonly LilyEvent[];
  expanded: number | null;
  onActivate: (index: number) => void;
  onToggle: (index: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 64rem)");
    const eventItems = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-event-item]") ?? [],
    );
    let pointerPosition: { x: number; y: number } | null = null;
    let frame = 0;

    const updateActiveEvent = () => {
      frame = 0;
      if (!desktopQuery.matches || !listRef.current?.getClientRects().length)
        return;

      if (pointerPosition) {
        const hoveredItem = document
          .elementFromPoint(pointerPosition.x, pointerPosition.y)
          ?.closest<HTMLElement>("[data-event-item]");
        const hoveredIndex = Number(hoveredItem?.dataset.eventIndex);

        if (
          hoveredItem &&
          listRef.current?.contains(hoveredItem) &&
          Number.isInteger(hoveredIndex) &&
          events[hoveredIndex]
        ) {
          onActivate(hoveredIndex);
          return;
        }
      }

      const viewportFocus = window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      eventItems.forEach((item, index) => {
        const bounds = item.getBoundingClientRect();
        const itemCenter = bounds.top + bounds.height / 2;
        const distance = Math.abs(itemCenter - viewportFocus);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      onActivate(closestIndex);
    };

    const queueUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveEvent);
    };
    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        pointerPosition = { x: event.clientX, y: event.clientY };
      }
    };

    updateActiveEvent();
    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    desktopQuery.addEventListener("change", queueUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      desktopQuery.removeEventListener("change", queueUpdate);
    };
  }, [events, onActivate]);

  const activateEvent = useCallback(
    (event: SyntheticEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.eventIndex);
      if (Number.isInteger(index) && events[index]) onActivate(index);
    },
    [events, onActivate],
  );
  const toggleSelectedEvent = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.eventIndex);
      if (Number.isInteger(index) && events[index]) onToggle(index);
    },
    [events, onToggle],
  );

  return (
    <div ref={listRef}>
      {events.map((event, index) => {
        const isExpanded = expanded === index;
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
              className="group grid w-full cursor-pointer gap-4 py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-inset sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)_auto] sm:items-start md:py-8 lg:py-10"
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
                <span className="block pt-2 font-display text-2xl leading-tight md:pt-3 md:text-3xl">
                  {event.title}
                </span>
                <span className="mt-1 block text-sm text-cream/60">
                  {event.time}
                </span>
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
                isExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
              id={`event-details-${index}`}
              inert={!isExpanded}
            >
              <div className="overflow-hidden">
                <div className="flex max-w-[46ch] flex-col items-start gap-6 pb-8 sm:ml-[calc(35%+0.5rem)] md:pb-10">
                  <p className="text-sm leading-7 text-cream/75 md:text-base">
                    {event.description}
                  </p>
                  {event.action ? (
                    <PillLink color="pink" href={event.action.href}>
                      {event.action.label}
                    </PillLink>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function CalendarEventModal({
  events,
  eventIndex,
  open,
  onClose,
}: {
  events: readonly LilyEvent[];
  eventIndex: number;
  open: boolean;
  onClose: () => void;
}) {
  const event = events[eventIndex];
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const dialogTitleId = `calendar-event-title-${eventIndex}`;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleDialogKeyboard = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
        return;
      }
      if (keyboardEvent.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (keyboardEvent.shiftKey && document.activeElement === first) {
        keyboardEvent.preventDefault();
        last.focus();
      } else if (!keyboardEvent.shiftKey && document.activeElement === last) {
        keyboardEvent.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleDialogKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleDialogKeyboard);
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  return (
    <dialog
      open
      aria-labelledby={dialogTitleId}
      aria-hidden={!open}
      aria-modal="true"
      className={`fixed inset-0 z-80 m-0 grid h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-dark-maroon/75 p-4 text-cream transition-[opacity,backdrop-filter] duration-500 ease-lily motion-reduce:transition-none sm:p-8 ${
        open
          ? "pointer-events-auto opacity-100 backdrop-blur-md"
          : "pointer-events-none opacity-0 backdrop-blur-none"
      }`}
      inert={!open}
    >
      <button
        aria-label="Close event details"
        className="fixed inset-0 cursor-default"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section
        className={`relative isolate z-10 m-auto grid w-full max-w-5xl overflow-hidden border border-pink/50 bg-events-gray text-cream shadow-[0_32px_100px_rgba(10,4,5,0.55)] transition-[opacity,filter,transform] duration-700 ease-lily motion-reduce:transition-none md:grid-cols-[minmax(16rem,0.85fr)_minmax(0,1.15fr)] ${
          open
            ? "translate-y-0 scale-100 opacity-100 blur-none"
            : "translate-y-5 scale-[0.985] opacity-0 blur-xl"
        }`}
        ref={dialogRef}
      >
        <button
          aria-label="Close event details"
          className="absolute top-4 right-4 z-20 grid size-11 cursor-pointer place-items-center rounded-full border border-cream/60 bg-dark-maroon/35 text-2xl leading-none text-cream backdrop-blur-md transition-colors hover:bg-cream hover:text-dark-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="relative min-h-64 overflow-hidden sm:min-h-80 md:min-h-[34rem]">
          <Image
            alt={event.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            src={event.rightImage}
          />
          <div className="absolute inset-0 bg-linear-to-t from-events-gray/80 via-transparent to-black/15 md:bg-linear-to-r md:from-transparent md:to-events-gray/30" />
        </div>

        <div className="relative flex flex-col items-start justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <p className="eyebrow text-pink">{event.dateLabel}</p>
          <h3
            className="mt-3 max-w-[12ch] font-display text-4xl leading-none font-medium text-warm-white sm:text-5xl lg:text-6xl"
            id={dialogTitleId}
          >
            {event.title}
          </h3>
          <p className="mt-5 text-xs font-bold tracking-[0.12em] text-pink uppercase">
            {event.time}
          </p>
          <p className="mt-7 max-w-[42ch] text-sm leading-7 text-cream/75 sm:text-base sm:leading-8">
            {event.description}
          </p>
          {event.action ? (
            <div className="mt-9">
              <PillLink color="pink" href={event.action.href}>
                {event.action.label}
              </PillLink>
            </div>
          ) : null}
        </div>
      </section>
    </dialog>
  );
}

function ViewSelector({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  const selectView = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const nextMode = event.currentTarget.dataset.viewMode;
      if (nextMode === "events" || nextMode === "calendar") onChange(nextMode);
    },
    [onChange],
  );

  return (
    <div className="flex items-center gap-5 text-lg font-medium tracking-[0.08em] sm:gap-6 md:text-xl lg:gap-8 lg:text-2xl">
      <button
        aria-pressed={mode === "events"}
        className="animated-underline cursor-pointer pb-1 uppercase opacity-55 transition-opacity aria-pressed:opacity-100"
        data-view-mode="events"
        onClick={selectView}
        type="button"
      >
        Upcoming events
      </button>
      <button
        aria-pressed={mode === "calendar"}
        className="animated-underline cursor-pointer pb-1 uppercase opacity-55 transition-opacity aria-pressed:opacity-100"
        data-view-mode="calendar"
        onClick={selectView}
        type="button"
      >
        Calendar
      </button>
    </div>
  );
}

function EventsSectionHeader({
  mode,
  onChange,
  sticky = false,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  sticky?: boolean;
}) {
  return (
    <header
      className={`flex flex-col gap-6 border-b border-pink/35 pb-7 sm:flex-row sm:items-end sm:justify-between ${
        sticky
          ? "mb-10 lg:sticky lg:top-20 lg:z-30 lg:mb-0 lg:bg-dark-maroon lg:pt-4 lg:pb-5 lg:before:pointer-events-none lg:before:absolute lg:before:inset-x-0 lg:before:bottom-full lg:before:h-20 lg:before:bg-dark-maroon"
          : "mb-8"
      }`}
    >
      <h2 className="font-header-stencil text-4xl tracking-[0.04em] text-pink uppercase md:text-5xl lg:text-6xl">
        Happenings
      </h2>
      <ViewSelector mode={mode} onChange={onChange} />
    </header>
  );
}

function EventsView({ events }: { events: readonly LilyEvent[] }) {
  const [mode, setMode] = useState<ViewMode>("events");
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(2026, 9, 1),
  );
  const [calendarEvent, setCalendarEvent] = useState<number | null>(null);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const calendarModalTimer = useRef<number | null>(null);

  const switchMode = useCallback(
    (nextMode: ViewMode) => {
      if (nextMode === mode) return;
      const transitionDocument = document as ViewTransitionDocument;
      const update = () => flushSync(() => setMode(nextMode));

      if (transitionDocument.startViewTransition) {
        transitionDocument.startViewTransition(update);
      } else {
        update();
      }
    },
    [mode],
  );

  const toggleEvent = useCallback((index: number) => {
    setActive(index);
    setExpanded((current) => (current === index ? null : index));
  }, []);

  const changeMonth = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const offset = Number(event.currentTarget.dataset.monthOffset);
    if (!Number.isInteger(offset)) return;
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
    setCalendarModalOpen(false);
    setCalendarEvent(null);
  }, []);

  const selectCalendarEvent = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.calendarEvent);
      if (!Number.isInteger(index) || !events[index]) return;
      if (calendarModalTimer.current)
        window.clearTimeout(calendarModalTimer.current);
      setCalendarEvent(index);
      window.requestAnimationFrame(() => setCalendarModalOpen(true));
    },
    [events],
  );

  const closeCalendarEvent = useCallback(() => {
    setCalendarModalOpen(false);
    calendarModalTimer.current = window.setTimeout(() => {
      setCalendarEvent(null);
      calendarModalTimer.current = null;
    }, 700);
  }, []);

  useEffect(
    () => () => {
      if (calendarModalTimer.current)
        window.clearTimeout(calendarModalTimer.current);
    },
    [],
  );

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Only as many weeks as the month spans, so no row is entirely empty.
    const cells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    return Array.from({ length: cells }, (_, index) => {
      const day = index - firstWeekday + 1;
      return {
        day: day > 0 && day <= daysInMonth ? day : null,
        key: `calendar-${year}-${month}-${index}`,
      };
    });
  }, [calendarMonth]);

  const monthEvents = useMemo(
    () =>
      events
        .map((event, index) => ({ event, index }))
        .filter(
          ({ event }) =>
            event.year === calendarMonth.getFullYear() &&
            event.month === calendarMonth.getMonth(),
        ),
    [calendarMonth, events],
  );

  return (
    <section
      className="relative isolate min-h-dvh overflow-clip bg-dark-maroon text-cream"
      data-nav-tone="dark"
    >
      <RotatingCrest className="pointer-events-none absolute right-[-8%] bottom-[-6rem] h-auto w-[min(48vw,38rem)] opacity-50" />
      <div className="relative z-10 [view-transition-name:events-view]">
        {mode === "events" ? (
          <div className="min-h-dvh px-page pt-20 lg:pt-28">
            <div>
              <EventsSectionHeader mode={mode} onChange={switchMode} sticky />

              <div className="hidden grid-cols-[minmax(10rem,0.7fr)_minmax(28rem,1.8fr)_minmax(10rem,0.7fr)] items-start gap-10 lg:grid xl:grid-cols-[minmax(13rem,0.8fr)_minmax(24rem,1.45fr)_minmax(13rem,0.8fr)] xl:gap-16">
                <div className="sticky top-40 flex h-[calc(100dvh-11rem)] items-center">
                  <div className="relative w-full max-w-[16rem]">
                    <EventImageStack
                      active={active}
                      className="aspect-4/5 w-full"
                      side="left"
                      sizes="16rem"
                      events={events}
                    />
                    <DoubleFrame className="[--frame-inset:-22px]" />
                  </div>
                </div>
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none sticky top-[11.5rem] z-20 -mb-16 h-16 bg-linear-to-b from-dark-maroon via-dark-maroon/80 to-transparent [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)] backdrop-blur-[6px]"
                  />
                  <EventList
                    events={events}
                    expanded={expanded}
                    onActivate={setActive}
                    onToggle={toggleEvent}
                  />
                </div>
                <div className="sticky top-40 flex h-[calc(100dvh-11rem)] items-center justify-end">
                  <div className="relative w-full max-w-[16rem]">
                    <EventImageStack
                      active={active}
                      className="aspect-4/5 w-full"
                      side="right"
                      sizes="16rem"
                      events={events}
                    />
                    <DoubleFrame className="[--frame-inset:-22px]" seed={11} />
                  </div>
                </div>
              </div>

              <div className="lg:hidden">
                <EventImageStack
                  active={active}
                  className="mb-10 aspect-16/10 w-full"
                  imageClassName="object-center"
                  side="right"
                  sizes="calc(100vw - 2.5rem)"
                  events={events}
                />
                <EventList
                  events={events}
                  expanded={expanded}
                  onActivate={setActive}
                  onToggle={toggleEvent}
                />
              </div>
            </div>
            <div aria-hidden="true" className="h-64 lg:h-80" />
          </div>
        ) : (
          <div className="min-h-dvh px-page pt-20 pb-64 lg:pt-28 lg:pb-80">
            <EventsSectionHeader mode={mode} onChange={switchMode} />

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
              <h3 className="font-display text-2xl uppercase md:text-3xl">
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
                      : [];
                    return (
                      <div
                        className="min-h-20 border-r border-b border-pink/35 p-1 sm:min-h-28 sm:p-2 md:p-3 xl:min-h-32"
                        key={key}
                      >
                        {day ? (
                          <p className="mb-2 text-xs text-cream/55">{day}</p>
                        ) : null}
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
                    );
                  })}
                </div>
              </div>
            </div>

            {calendarEvent !== null ? (
              <CalendarEventModal
                events={events}
                eventIndex={calendarEvent}
                onClose={closeCalendarEvent}
                open={calendarModalOpen}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function toLilyEvents(records: EventRecord[]): LilyEvent[] {
  const output: LilyEvent[] = [];
  for (const record of records) {
    const start = new Date(`${record.date}T12:00:00`);
    if (Number.isNaN(start.valueOf())) continue;
    const limit = new Date(start);
    limit.setMonth(limit.getMonth() + 18);
    let cursor = new Date(start);
    do {
      output.push({
        action:
          record.buttonLabel && record.buttonLink
            ? { href: record.buttonLink, label: record.buttonLabel }
            : undefined,
        dateLabel: cursor.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        day: cursor.getDate(),
        description: record.description,
        leftImage: record.leftImage,
        month: cursor.getMonth(),
        rightImage: record.rightImage,
        time: record.time,
        title: record.title,
        year: cursor.getFullYear(),
      });
      if (record.recurrence === "weekly")
        cursor = new Date(
          cursor.getFullYear(),
          cursor.getMonth(),
          cursor.getDate() + 7,
        );
      else if (record.recurrence === "monthly")
        cursor = new Date(
          cursor.getFullYear(),
          cursor.getMonth() + 1,
          cursor.getDate(),
        );
      else break;
    } while (cursor <= limit);
  }
  return output.toSorted(
    (a, b) =>
      new Date(a.year, a.month, a.day).valueOf() -
      new Date(b.year, b.month, b.day).valueOf(),
  );
}

function ConnectedEventsExperience() {
  const records = useQuery(publicEventsRef, {});
  const events = useMemo(
    () => (records?.length ? toLilyEvents(records) : [...fallbackEvents]),
    [records],
  );
  return <EventsView events={events} />;
}

export function EventsExperience() {
  return process.env.NEXT_PUBLIC_CONVEX_URL ? (
    <ConnectedEventsExperience />
  ) : (
    <EventsView events={fallbackEvents} />
  );
}
