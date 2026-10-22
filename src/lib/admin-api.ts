import { makeFunctionReference } from "convex/server"

export type MenuItemRecord = { description: string; key: string; price: string; title: string }
export type MenuSectionRecord = {
  backgroundColor: "cream" | "espresso" | "mauve" | "dark-maroon" | "deep-brown"
  image: string
  imageAlt: string
  imageSide: "left" | "right"
  items: MenuItemRecord[]
  key: string
  title: string
}
export type MenuPageRecord = {
  _id: string
  archived: boolean
  description: string
  heroImage: string
  heroImageAlt: string
  order: number
  sections: MenuSectionRecord[]
  slug: string
  title: string
  updatedAt: number
}
export type EventRecord = {
  _id: string
  active: boolean
  archived: boolean
  buttonLabel?: string
  buttonLink?: string
  date: string
  description: string
  leftImage: string
  leftImageAlt: string
  recurrence: "none" | "weekly" | "monthly"
  rightImage: string
  rightImageAlt: string
  time: string
  title: string
  updatedAt: number
}
export type ContactInquiry = {
  _id: string
  archived: boolean
  createdAt: number
  date?: string
  email: string
  guests?: number
  message?: string
  name: string
  phone: string
  read: boolean
  reason: "reservation" | "events" | "general"
  specialRequests?: string
  time?: string
}
export type CateringInquiry = {
  _id: string
  archived: boolean
  createdAt: number
  deliveryAddress?: string
  dietaryNotes?: string
  dietaryRestrictions: string[]
  email: string
  eventDate: string
  fulfillment: "onsite" | "offsite" | "delivery" | "pickup"
  fullName: string
  guestCount: number
  menuSelection: string
  occasion?: string
  phone: string
  read: boolean
  serviceTime: string
  specialInstructions?: string
}
export type DashboardData = {
  metrics: {
    eventViews: number
    inquiries: number
    menuViews: number
    pageViews: number
    uniqueVisitors: number
  }
  newCatering: number
  newContact: number
  points: Array<{
    date: string
    eventViews: number
    inquiries: number
    menuViews: number
    pageViews: number
    uniqueVisitors: number
  }>
}

export const adminMenuPagesRef = makeFunctionReference<
  "query",
  { archived: boolean },
  MenuPageRecord[]
>("cms:adminMenuPages")
export const publicMenuPagesRef = makeFunctionReference<
  "query",
  Record<string, never>,
  MenuPageRecord[]
>("cms:publicMenuPages")
export const saveMenuPageRef = makeFunctionReference<
  "mutation",
  Omit<MenuPageRecord, "_id" | "updatedAt"> & { id?: string },
  string
>("cms:saveMenuPage")
export const reorderMenuPagesRef = makeFunctionReference<"mutation", { ids: string[] }, null>(
  "cms:reorderMenuPages",
)
export const setMenuArchivedRef = makeFunctionReference<
  "mutation",
  { archived: boolean; id: string },
  null
>("cms:setMenuArchived")
export const adminEventsRef = makeFunctionReference<"query", { archived: boolean }, EventRecord[]>(
  "cms:adminEvents",
)
export const publicEventsRef = makeFunctionReference<"query", Record<string, never>, EventRecord[]>(
  "cms:publicEvents",
)
export const initializeContentRef = makeFunctionReference<
  "mutation",
  {
    events: Array<Omit<EventRecord, "_id" | "updatedAt">>
    pages: Array<Omit<MenuPageRecord, "_id" | "updatedAt">>
  },
  null
>("cms:initializeContent")
export const saveEventRef = makeFunctionReference<
  "mutation",
  Omit<EventRecord, "_id" | "updatedAt"> & { id?: string },
  string
>("cms:saveEvent")
export const setEventArchivedRef = makeFunctionReference<
  "mutation",
  { archived: boolean; id: string },
  null
>("cms:setEventArchived")
export const clearArchiveRef = makeFunctionReference<
  "mutation",
  { collection: "menu" | "events" | "contact" | "catering" },
  null
>("cms:clearArchive")
export const listContactRef = makeFunctionReference<
  "query",
  { archived: boolean },
  ContactInquiry[]
>("inquiries:listContact")
export const listCateringRef = makeFunctionReference<
  "query",
  { archived: boolean },
  CateringInquiry[]
>("inquiries:listCatering")
export const setContactStateRef = makeFunctionReference<
  "mutation",
  { archived?: boolean; id: string; read?: boolean },
  null
>("inquiries:setContactState")
export const setCateringStateRef = makeFunctionReference<
  "mutation",
  { archived?: boolean; id: string; read?: boolean },
  null
>("inquiries:setCateringState")
export const dashboardRef = makeFunctionReference<
  "query",
  { days: 7 | 30 | 90 | 180 },
  DashboardData
>("analytics:dashboard")
export const trackPageViewRef = makeFunctionReference<
  "mutation",
  { path: string; sessionId: string },
  string
>("analytics:trackPageView")
export const submitContactRef = makeFunctionReference<
  "mutation",
  Omit<ContactInquiry, "_id" | "archived" | "createdAt" | "read">,
  string
>("inquiries:submitContact")
export const submitCateringRef = makeFunctionReference<
  "mutation",
  Omit<CateringInquiry, "_id" | "archived" | "createdAt" | "read">,
  string
>("inquiries:submitCatering")
export const generateUploadUrlRef = makeFunctionReference<
  "mutation",
  Record<string, never>,
  string
>("files:generateUploadUrl")
export const resolveUploadRef = makeFunctionReference<
  "mutation",
  { storageId: string },
  string | null
>("files:resolveUpload")
