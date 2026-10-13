"use client"

import { useCallback, useState } from "react"
import type { ChangeEvent, FormEvent, MouseEvent } from "react"
import { PillButton } from "@/components/pill-button"

const steps = ["Contact information", "Event basics", "Order details"] as const
const stepShortLabels = ["Contact", "Event", "Order"] as const
const progressWidths = ["w-1/3", "w-2/3", "w-full"] as const
const dietaryOptions = ["Gluten-Free", "Vegan", "Vegetarian", "Nut Allergy"] as const

const fieldClass =
  "field-input text-cream placeholder:text-cream/45 focus-visible:border-pink focus-visible:shadow-[0_1px_0_#c9a8b2]"

export function CateringInquiryForm() {
  const [step, setStep] = useState(0)
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery")
  const [submitted, setSubmitted] = useState(false)

  const chooseFulfillment = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === "delivery" || event.currentTarget.value === "pickup") {
      setFulfillment(event.currentTarget.value)
    }
  }, [])

  const goBack = useCallback(() => setStep((current) => Math.max(0, current - 1)), [])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (step < steps.length - 1) {
        setStep((current) => current + 1)
        return
      }
      setSubmitted(true)
    },
    [step],
  )

  const restart = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.form?.reset()
    setFulfillment("delivery")
    setStep(0)
    setSubmitted(false)
  }, [])

  return (
    <section
      className="relative isolate min-h-svh overflow-hidden bg-espresso px-page py-24 text-cream md:py-32 lg:py-36"
      data-nav-tone="dark"
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-16">
          <div>
            <p className="mb-3 eyebrow text-pink">Catering inquiry</p>
            <h1 className="font-display text-5xl leading-none font-medium tracking-[0.04em] uppercase md:text-7xl lg:text-8xl">
              Catering
            </h1>
          </div>
          <p className="max-w-[48ch] text-sm leading-7 text-cream/70 md:justify-self-end md:text-base md:leading-8">
            Tell us what you&apos;re planning. We&apos;ll help shape the menu, timing, and details
            around your table.
          </p>
        </div>

        <div className="relative border border-pink/65 p-3 md:p-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 border border-pink/35"
          />

          <div className="relative px-5 py-7 md:px-10 md:py-10 lg:px-14 lg:py-12">
            <div className="mb-10 md:mb-12">
              <div className="mb-4 flex items-end justify-between gap-6">
                <div>
                  <p aria-live="polite" className="eyebrow text-pink">
                    Step {step + 1} of {steps.length}
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-medium md:text-4xl">
                    {steps[step]}
                  </h2>
                </div>
                <p className="hidden text-xs font-bold tracking-[0.12em] text-cream/45 uppercase sm:block">
                  {Math.round(((step + 1) / steps.length) * 100)}% complete
                </p>
              </div>
              <progress
                aria-label="Catering inquiry progress"
                className="sr-only"
                max={steps.length}
                value={step + 1}
              />
              <div aria-hidden="true" className="h-px overflow-hidden bg-cream/20">
                <div
                  className={`h-full bg-pink transition-[width] duration-700 ease-lily ${progressWidths[step]}`}
                />
              </div>
              <ol className="mt-3 grid grid-cols-3 gap-3 text-[0.6rem] font-bold tracking-[0.08em] uppercase md:text-xs">
                {steps.map((label, index) => (
                  <li className={index <= step ? "text-pink" : "text-cream/35"} key={label}>
                    <span className="md:hidden">{stepShortLabels[index]}</span>
                    <span className="hidden md:inline">{label}</span>
                  </li>
                ))}
              </ol>
            </div>

            {submitted ? (
              <div
                className="grid min-h-80 place-items-center py-10 text-center"
                aria-live="polite"
              >
                <div>
                  <p className="eyebrow text-pink">All three sections complete</p>
                  <p className="mt-4 font-display text-4xl font-medium md:text-5xl">
                    Your catering inquiry is ready.
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-cream/65">
                    Thank you for sharing the details of your gathering with Lily.
                  </p>
                  <PillButton className="mt-8" color="cream" onClick={restart}>
                    Start another
                  </PillButton>
                </div>
              </div>
            ) : (
              <form className="grid gap-8" onSubmit={handleSubmit}>
                <fieldset
                  aria-hidden={step !== 0}
                  className={`grid gap-6 md:grid-cols-2 md:gap-x-10 md:gap-y-8 ${step === 0 ? "" : "hidden"}`}
                >
                  <legend className="sr-only">Contact information</legend>
                  <label className="grid gap-2 md:col-span-2">
                    <span className="eyebrow text-pink">Full name</span>
                    <input
                      autoComplete="name"
                      className={fieldClass}
                      name="fullName"
                      placeholder="Your name"
                      required={step === 0}
                      type="text"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="eyebrow text-pink">Phone number</span>
                    <input
                      autoComplete="tel"
                      className={fieldClass}
                      name="phone"
                      placeholder="Day-of contact"
                      required={step === 0}
                      type="tel"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="eyebrow text-pink">Email address</span>
                    <input
                      autoComplete="email"
                      className={fieldClass}
                      name="email"
                      placeholder="you@example.com"
                      required={step === 0}
                      type="email"
                    />
                  </label>
                </fieldset>

                <fieldset
                  aria-hidden={step !== 1}
                  className={`grid gap-7 md:grid-cols-2 md:gap-x-10 md:gap-y-8 ${step === 1 ? "" : "hidden"}`}
                >
                  <legend className="sr-only">Event basics</legend>
                  <div className="grid gap-3 md:col-span-2">
                    <p className="eyebrow text-pink">Fulfillment method</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(["delivery", "pickup"] as const).map((method) => (
                        <label
                          className="cursor-pointer rounded-full border border-cream/55 px-5 py-3 text-center text-xs font-bold uppercase transition-colors has-checked:bg-cream has-checked:text-espresso"
                          key={method}
                        >
                          <input
                            checked={fulfillment === method}
                            className="sr-only"
                            name="fulfillment"
                            onChange={chooseFulfillment}
                            type="radio"
                            value={method}
                          />
                          {method === "delivery" ? "Drop-off delivery" : "Pickup"}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="grid gap-2">
                    <span className="eyebrow text-pink">Event date</span>
                    <input
                      className={fieldClass}
                      name="eventDate"
                      required={step === 1}
                      type="date"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="eyebrow text-pink">Service time</span>
                    <input
                      className={fieldClass}
                      name="serviceTime"
                      required={step === 1}
                      type="time"
                    />
                  </label>
                  {fulfillment === "delivery" ? (
                    <label className="grid gap-2 md:col-span-2">
                      <span className="eyebrow text-pink">Delivery address</span>
                      <textarea
                        className={`${fieldClass} min-h-24 resize-y`}
                        name="deliveryAddress"
                        placeholder="Street, suite or unit, and access codes"
                        required={step === 1}
                        rows={3}
                      />
                    </label>
                  ) : null}
                </fieldset>

                <fieldset
                  aria-hidden={step !== 2}
                  className={`grid gap-7 md:grid-cols-2 md:gap-x-10 md:gap-y-8 ${step === 2 ? "" : "hidden"}`}
                >
                  <legend className="sr-only">Order details</legend>
                  <label className="grid gap-2">
                    <span className="eyebrow text-pink">Guest count</span>
                    <input
                      className={fieldClass}
                      min="1"
                      name="guestCount"
                      placeholder="Total headcount"
                      required={step === 2}
                      type="number"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="eyebrow text-pink">Menu selection</span>
                    <input
                      className={fieldClass}
                      name="menuSelection"
                      placeholder="Items or package choices"
                      required={step === 2}
                      type="text"
                    />
                  </label>
                  <div className="grid gap-3 md:col-span-2">
                    <p className="eyebrow text-pink">Dietary restrictions &amp; allergies</p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {dietaryOptions.map((option) => (
                        <label
                          className="flex cursor-pointer items-center gap-3 border border-cream/25 px-4 py-3 text-sm transition-colors has-checked:border-pink has-checked:bg-pink/10"
                          key={option}
                        >
                          <input
                            className="size-4 accent-[#c9a8b2]"
                            name="dietaryRestrictions"
                            type="checkbox"
                            value={option}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    <input
                      className={fieldClass}
                      name="dietaryNotes"
                      placeholder="Additional dietary details"
                      type="text"
                    />
                  </div>
                  <label className="grid gap-2 md:col-span-2">
                    <span className="eyebrow text-pink">Special instructions</span>
                    <textarea
                      className={`${fieldClass} min-h-28 resize-y`}
                      name="specialInstructions"
                      placeholder="Gate codes, parking, or drop-off location specifics"
                      rows={4}
                    />
                  </label>
                </fieldset>

                <div className="flex flex-col-reverse gap-3 border-t border-cream/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? (
                    <button
                      className="cursor-pointer py-3 text-sm font-bold tracking-[0.08em] text-cream/65 uppercase transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4"
                      onClick={goBack}
                      type="button"
                    >
                      ← Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <PillButton color="cream" type="submit">
                    {step === steps.length - 1 ? "Complete inquiry" : "Continue"}
                  </PillButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
