"use client"

import { FormEvent, useState } from "react"

export function ReservationForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Your name" required type="text" />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" placeholder="+34 600 000 000" required type="tel" />
      </div>
      <div className="field">
        <label htmlFor="guests">Guests</label>
        <select defaultValue="2" id="guests" name="guests">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>
      <div className="reservation-form__row">
        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" required type="date" />
        </div>
        <div className="field">
          <label htmlFor="time">Time</label>
          <select defaultValue="20:00" id="time" name="time">
            <option>18:30</option>
            <option>19:00</option>
            <option>19:30</option>
            <option>20:00</option>
            <option>20:30</option>
            <option>21:00</option>
            <option>21:30</option>
            <option>22:00</option>
          </select>
        </div>
      </div>
      <label className="consent">
        <input required type="checkbox" />
        <span>I agree to Lily&apos;s privacy policy.</span>
      </label>
      <button className="reservation-form__submit" type="submit">Request a table</button>
      {submitted && (
        <p className="reservation-form__success" role="status">
          Thanks. This preview form is ready to connect to your booking system.
        </p>
      )}
    </form>
  )
}
