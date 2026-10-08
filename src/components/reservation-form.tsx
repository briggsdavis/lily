"use client"

import { FormEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from "react"
import { PillButton } from "@/components/pill-button"

const guestOptions = Array.from({ length: 8 }, (_, index) => index + 1)
const timeOptions = [
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
]
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const inquiryOptions = [
  { label: "Reservation", value: "reservation" },
  { label: "Events", value: "events" },
  { label: "General inquiry", value: "general" },
] as const

export type InquiryReason = (typeof inquiryOptions)[number]["value"] | null
type Picker = "guests" | "date" | "time" | null

function sameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function dateValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

const inquiryFieldsClass =
  "grid animate-inquiry-fields gap-5 [view-transition-name:inquiry-fields] md:gap-6"
const pickerTriggerClass =
  "field-input flex cursor-pointer items-center justify-between gap-3 text-left"
const pickerMenuClass =
  "absolute top-full left-0 z-20 mt-2 grid max-h-52 w-full overflow-y-auto border border-orange-brown bg-cream p-1.5 shadow-xl shadow-burgundy/15"
const pickerOptionClass =
  "cursor-pointer px-3 py-2 text-left outline-none hover:bg-burgundy hover:text-cream focus-visible:bg-burgundy focus-visible:text-cream aria-pressed:bg-burgundy aria-pressed:text-cream"
const calendarNavClass =
  "grid size-8 cursor-pointer place-items-center border border-transparent outline-none enabled:hover:border-current enabled:focus-visible:border-current disabled:cursor-default disabled:opacity-25"

export function ReservationForm({
  inquiryReason,
  onInquiryReasonChange,
}: {
  inquiryReason: InquiryReason
  onInquiryReasonChange: (reason: Exclude<InquiryReason, null>) => void
}) {
  const [today] = useState(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  })
  const [openPicker, setOpenPicker] = useState<Picker>(null)
  const [guests, setGuests] = useState(2)
  const [time, setTime] = useState("8:00 PM")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [submitted, setSubmitted] = useState(false)
  const [dateError, setDateError] = useState(false)
  const [reasonError, setReasonError] = useState(false)

  const calendarDays = useMemo(() => {
    const firstWeekday = calendarMonth.getDay()
    const daysInMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0,
    ).getDate()

    return [
      ...Array.from({ length: firstWeekday }, (_, index) => ({
        day: null,
        key: `blank-${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${index}`,
      })),
      ...Array.from({ length: daysInMonth }, (_, index) => ({
        day: index + 1,
        key: `day-${index + 1}`,
      })),
    ]
  }, [calendarMonth])

  useEffect(() => {
    function closePicker(event: PointerEvent) {
      const target = event.target as HTMLElement
      if (!target.closest("[data-picker]")) setOpenPicker(null)
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPicker(null)
    }

    document.addEventListener("pointerdown", closePicker)
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closePicker)
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!inquiryReason) {
        setReasonError(true)
        return
      }
      if (inquiryReason === "reservation" && !selectedDate) {
        setDateError(true)
        setOpenPicker("date")
        return
      }
      setSubmitted(true)
    },
    [inquiryReason, selectedDate],
  )

  const chooseReason = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const reason = event.currentTarget.dataset.reason as Exclude<InquiryReason, null> | undefined
      if (!reason || !inquiryOptions.some((option) => option.value === reason)) return
      setReasonError(false)
      setSubmitted(false)
      setOpenPicker(null)
      onInquiryReasonChange(reason)
    },
    [onInquiryReasonChange],
  )

  const togglePicker = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const picker = event.currentTarget.dataset.pickerTrigger as Exclude<Picker, null> | undefined
    if (!picker) return
    setOpenPicker((current) => (current === picker ? null : picker))
  }, [])

  const chooseGuests = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const nextGuests = Number(event.currentTarget.dataset.guests)
    if (!guestOptions.includes(nextGuests)) return
    setGuests(nextGuests)
    setOpenPicker(null)
  }, [])

  const changeCalendarMonth = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const offset = Number(event.currentTarget.dataset.monthOffset)
    if (!Number.isInteger(offset)) return
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }, [])

  const chooseDate = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const day = Number(event.currentTarget.dataset.day)
      if (!Number.isInteger(day)) return
      setSelectedDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day))
      setDateError(false)
      setOpenPicker(null)
    },
    [calendarMonth],
  )

  const chooseTime = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const nextTime = event.currentTarget.dataset.time
    if (!nextTime || !timeOptions.includes(nextTime)) return
    setTime(nextTime)
    setOpenPicker(null)
  }, [])

  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(selectedDate)
    : "dd/mm/yy"

  return (
    <form className="grid gap-5 md:gap-6" onSubmit={handleSubmit}>
      <fieldset
        aria-describedby={reasonError ? "inquiry-reason-error" : undefined}
        className="min-w-0"
      >
        <legend className="mb-3 eyebrow">Reason for inquiry</legend>
        <div className="grid grid-cols-3 gap-2 lg:gap-3">
          {inquiryOptions.map((option) => (
            <button
              aria-pressed={inquiryReason === option.value}
              className={`group relative isolate inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[0.75px] border-current px-3 py-2.5 text-xs font-bold uppercase outline-none ${reasonError ? "ring-1 ring-burgundy" : ""}`}
              data-reason={option.value}
              key={option.value}
              onClick={chooseReason}
              type="button"
            >
              <span className="relative text-center">{option.label}</span>
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-burgundy px-3 py-2.5 text-center text-cream transition-[clip-path] duration-500 ease-curtain [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)] group-aria-pressed:[clip-path:inset(0)]"
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
        {reasonError && (
          <p className="mt-2 text-xs" id="inquiry-reason-error">
            Choose a reason for your inquiry.
          </p>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-8">
        <div className="relative grid">
          <label className="sr-only" htmlFor="name">
            Name
          </label>
          <input
            className="field-input"
            id="name"
            name="name"
            placeholder="Your name"
            required
            type="text"
          />
        </div>
        <div className="relative grid">
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <input
            className="field-input"
            id="email"
            name="email"
            placeholder="Email address"
            required
            type="email"
          />
        </div>
      </div>

      <div className="relative grid">
        <label className="sr-only" htmlFor="phone">
          Phone number
        </label>
        <input
          className="field-input"
          id="phone"
          name="phone"
          placeholder="+1 (724) 555-0100"
          required
          type="tel"
        />
      </div>

      {inquiryReason === "reservation" ? (
        <div className={inquiryFieldsClass} key="reservation">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
            <div className="relative col-span-2 grid md:col-span-1" data-picker>
              <input name="guests" type="hidden" value={guests} />
              <button
                aria-expanded={openPicker === "guests"}
                className={pickerTriggerClass}
                data-picker-trigger="guests"
                onClick={togglePicker}
                type="button"
              >
                <span>
                  {guests} {guests === 1 ? "guest" : "guests"}
                </span>
                <span aria-hidden="true">&#9662;</span>
              </button>
              {openPicker === "guests" && (
                <div aria-label="Number of guests" className={pickerMenuClass}>
                  {guestOptions.map((option) => (
                    <button
                      aria-pressed={option === guests}
                      className={pickerOptionClass}
                      data-guests={option}
                      key={option}
                      onClick={chooseGuests}
                      type="button"
                    >
                      {option} {option === 1 ? "guest" : "guests"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative grid" data-picker>
              <input
                name="date"
                type="hidden"
                value={selectedDate ? dateValue(selectedDate) : ""}
              />
              <button
                aria-expanded={openPicker === "date"}
                className={`${pickerTriggerClass} ${dateError ? "border-current! shadow-[0_1px_0_currentColor]!" : ""}`}
                data-picker-trigger="date"
                onClick={togglePicker}
                type="button"
              >
                <span>{formattedDate}</span>
                <span aria-hidden="true">+</span>
              </button>
              {openPicker === "date" && (
                <div className="absolute top-full left-0 z-20 mt-2 w-80 max-w-[calc(100vw-2.5rem)] border border-orange-brown bg-cream p-3 shadow-xl shadow-burgundy/15">
                  <div className="mb-2.5 grid grid-cols-[auto_1fr_auto] items-center text-center">
                    <button
                      aria-label="Previous month"
                      className={calendarNavClass}
                      data-month-offset="-1"
                      disabled={
                        calendarMonth.getFullYear() === today.getFullYear() &&
                        calendarMonth.getMonth() === today.getMonth()
                      }
                      onClick={changeCalendarMonth}
                      type="button"
                    >
                      &larr;
                    </button>
                    <strong>
                      {new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        year: "numeric",
                      }).format(calendarMonth)}
                    </strong>
                    <button
                      aria-label="Next month"
                      className={calendarNavClass}
                      data-month-offset="1"
                      onClick={changeCalendarMonth}
                      type="button"
                    >
                      &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-0.5">
                    {weekdays.map((weekday) => (
                      <span className="py-1 text-center eyebrow" key={weekday}>
                        {weekday}
                      </span>
                    ))}
                    {calendarDays.map(({ day, key }) => {
                      if (!day) return <span aria-hidden="true" key={key} />

                      const date = new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth(),
                        day,
                      )
                      const disabled = date < today
                      const selected = selectedDate ? sameDay(date, selectedDate) : false

                      return (
                        <button
                          aria-label={date.toLocaleDateString("en-US")}
                          className={`grid aspect-square cursor-pointer place-items-center rounded-full text-xs outline-none focus-visible:bg-burgundy focus-visible:text-cream enabled:hover:bg-burgundy enabled:hover:text-cream disabled:cursor-default disabled:opacity-25 ${selected ? "bg-burgundy text-cream" : ""}`}
                          data-day={day}
                          disabled={disabled}
                          key={key}
                          onClick={chooseDate}
                          type="button"
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="relative grid" data-picker>
              <input name="time" type="hidden" value={time} />
              <button
                aria-expanded={openPicker === "time"}
                className={pickerTriggerClass}
                data-picker-trigger="time"
                onClick={togglePicker}
                type="button"
              >
                <span>{time}</span>
                <span aria-hidden="true">&#9662;</span>
              </button>
              {openPicker === "time" && (
                <div aria-label="Reservation time" className={pickerMenuClass}>
                  {timeOptions.map((option) => (
                    <button
                      aria-pressed={option === time}
                      className={pickerOptionClass}
                      data-time={option}
                      key={option}
                      onClick={chooseTime}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative grid">
            <label className="sr-only" htmlFor="special-requests">
              Special requests
            </label>
            <textarea
              className="field-input min-h-20 resize-y"
              id="special-requests"
              name="specialRequests"
              placeholder="Special requests"
              rows={2}
            />
          </div>
        </div>
      ) : (
        <div className={inquiryFieldsClass} key={inquiryReason ?? "unselected"}>
          <div className="relative grid">
            <label className="sr-only" htmlFor="message">
              Message
            </label>
            <textarea
              className="field-input min-h-20 resize-y"
              id="message"
              name="message"
              placeholder="Your message"
              required
              rows={3}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-stretch gap-4 [view-transition-name:inquiry-footer] sm:flex-row sm:items-center sm:justify-between">
        <PillButton className="w-full sm:w-auto sm:min-w-44" color="burgundy" type="submit">
          {inquiryReason === "reservation" ? "Reserve" : "Send inquiry"}
        </PillButton>
      </div>

      {submitted && (
        <output className="border-l-2 border-current pl-3 text-sm">
          {inquiryReason === "reservation"
            ? "Thank you. Your reservation request is ready to send."
            : "Thank you. Your inquiry is ready to send."}
        </output>
      )}
    </form>
  )
}
