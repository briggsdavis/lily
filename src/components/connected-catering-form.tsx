"use client"

import { useMutation } from "convex/react"
import { CateringInquiryForm } from "@/components/catering-inquiry-form"
import { submitCateringRef } from "@/lib/admin-api"

export function ConnectedCateringForm() {
  const submit = useMutation(submitCateringRef)
  return <CateringInquiryForm onSubmitInquiry={submit} />
}
