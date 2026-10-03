"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
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

export function ReservationForm() {
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

  const calendarDays = useMemo(() => {
    const firstWeekday = calendarMonth.getDay()
    const daysInMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0,
    ).getDate()

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ]
  }, [calendarMonth])

  useEffect(() => {
    function closePicker(event: PointerEvent) {
      const target = event.target as HTMLElement
      if (!target.closest(".field--picker")) setOpenPicker(null)
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedDate) {
      setDateError(true)
      setOpenPicker("date")
      return
    }
    setSubmitted(true)
  }

  function chooseDate(day: number) {
    setSelectedDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day))
    setDateError(false)
    setOpenPicker(null)
  }

  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(selectedDate)
    : "dd/mm/yy"

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="reservation-form__row">
        <div className="field">
          <label className="sr-only" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" placeholder="Your name" required type="text" />
        </div>
        <div className="field">
          <label className="sr-only" htmlFor="phone">
            Phone number
          </label>
          <input id="phone" name="phone" placeholder="+1 (412) 555-0100" required type="tel" />
        </div>
      </div>

      <div className="reservation-form__row reservation-form__row--three">
        <div className="field field--picker">
          <input name="guests" type="hidden" value={guests} />
          <button
            aria-expanded={openPicker === "guests"}
            className="picker-field__trigger"
            onClick={() => setOpenPicker(openPicker === "guests" ? null : "guests")}
            type="button"
          >
            <span>
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
            <span aria-hidden="true">&#9662;</span>
          </button>
          {openPicker === "guests" && (
            <div aria-label="Number of guests" className="picker-menu">
              {guestOptions.map((option) => (
                <button
                  aria-pressed={option === guests}
                  className={option === guests ? "is-selected" : ""}
                  key={option}
                  onClick={() => {
                    setGuests(option)
                    setOpenPicker(null)
                  }}
                  type="button"
                >
                  {option} {option === 1 ? "guest" : "guests"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`field field--picker field--date ${dateError ? "has-error" : ""}`}>
          <input name="date" type="hidden" value={selectedDate ? dateValue(selectedDate) : ""} />
          <button
            aria-expanded={openPicker === "date"}
            className="picker-field__trigger"
            onClick={() => setOpenPicker(openPicker === "date" ? null : "date")}
            type="button"
          >
            <span>{formattedDate}</span>
            <span aria-hidden="true">+</span>
          </button>
          {openPicker === "date" && (
            <div className="calendar-picker">
              <div className="calendar-picker__header">
                <button
                  aria-label="Previous month"
                  disabled={
                    calendarMonth.getFullYear() === today.getFullYear() &&
                    calendarMonth.getMonth() === today.getMonth()
                  }
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                    )
                  }
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
                  onClick={() =>
                    setCalendarMonth(
                      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                    )
                  }
                  type="button"
                >
                  &rarr;
                </button>
              </div>
              <div className="calendar-picker__grid">
                {weekdays.map((weekday) => (
                  <span className="calendar-picker__weekday" key={weekday}>
                    {weekday}
                  </span>
                ))}
                {calendarDays.map((day, index) => {
                  if (!day) return <span aria-hidden="true" key={`blank-${index}`} />

                  const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                  const disabled = date < today
                  const selected = selectedDate ? sameDay(date, selectedDate) : false

                  return (
                    <button
                      aria-label={date.toLocaleDateString("en-US")}
                      className={selected ? "is-selected" : ""}
                      disabled={disabled}
                      key={day}
                      onClick={() => chooseDate(day)}
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

        <div className="field field--picker field--picker-end">
          <input name="time" type="hidden" value={time} />
          <button
            aria-expanded={openPicker === "time"}
            className="picker-field__trigger"
            onClick={() => setOpenPicker(openPicker === "time" ? null : "time")}
            type="button"
          >
            <span>{time}</span>
            <span aria-hidden="true">&#9662;</span>
          </button>
          {openPicker === "time" && (
            <div aria-label="Reservation time" className="picker-menu">
              {timeOptions.map((option) => (
                <button
                  aria-pressed={option === time}
                  className={option === time ? "is-selected" : ""}
                  key={option}
                  onClick={() => {
                    setTime(option)
                    setOpenPicker(null)
                  }}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="reservation-form__footer">
        <label className="consent">
          <input required type="checkbox" />
          <span>
            I agree to Lily&apos;s <Link href="/privacy">privacy policy</Link>.
          </span>
        </label>
        <PillButton color="burgundy" type="submit">
          Request a table
        </PillButton>
      </div>

      {submitted && (
        <output className="reservation-form__success">
          Thanks. This preview form is ready to connect to your booking system.
        </output>
      )}
    </form>
  )
}
