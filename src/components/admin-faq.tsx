"use client"

import { useId, useState } from "react"
import { AdminHeader } from "@/components/admin-ui"

const sections = [
  {
    title: "Getting started & navigation",
    items: [
      [
        "How do I find the page I want to change?",
        "Use Pages for Home and About, Menu editor for individual menus, and the Events, Catering, or Contact links for those areas. Expand a sidebar group to see its pages.",
      ],
      [
        "How do I hide an entire public page?",
        "Use the switch beside its sidebar link. This changes the public page’s visibility while keeping its content available in admin. Switch it back on to restore visibility.",
      ],
      [
        "How do I use admin on a phone?",
        "Open the menu in the top bar, then choose a page. The sidebar closes after you navigate.",
      ],
      ["How do I sign out?", "Choose Log out at the bottom of the sidebar."],
    ],
  },
  {
    title: "Dashboard",
    items: [
      [
        "What is the dashboard for?",
        "It provides an overview of site activity and quick access to the areas you manage.",
      ],
      [
        "How do I compare activity over time?",
        "Choose a reporting period on the dashboard. Its metrics and chart update for that period.",
      ],
    ],
  },
  {
    title: "Home page",
    items: [
      [
        "How do I edit home page content?",
        "Open Pages → Home and click text, buttons, or images in the editable preview to change them.",
      ],
      [
        "When do my changes go live?",
        "Click Save changes to publish your edits. Changes in the preview stay in your draft until you save.",
      ],
      [
        "How do I change a button?",
        "Click the button in the editable preview, update its text or destination in the editor, then save your changes.",
      ],
    ],
  },
  {
    title: "About page",
    items: [
      [
        "How do I edit the About page?",
        "Open Pages → About and click the content in the editable preview. Use Save changes to publish.",
      ],
      [
        "Can I hide the timeline?",
        "Use the timeline visibility switch in the About editor, then save your changes.",
      ],
      [
        "How do I replace an About image?",
        "Click the image in the preview, choose replacement media, then use Save changes to publish the draft.",
      ],
    ],
  },
  {
    title: "Menu pages",
    items: [
      [
        "How do I create a menu page?",
        "Expand Menu editor and choose the plus button. Enter the new page’s details and create it, then open it to edit its content.",
      ],
      [
        "How do I change menu page order?",
        "Drag menu pages in the sidebar into the order you want. You can also use the ordering controls on the Menu pages screen.",
      ],
      [
        "Can I temporarily hide a menu?",
        "Use the switch beside the menu’s sidebar link. Its content remains available to edit.",
      ],
      [
        "What happens when I archive a menu?",
        "It leaves the current menu list and can be recovered from Archive until that archive is cleared.",
      ],
    ],
  },
  {
    title: "Menu sections & items",
    items: [
      [
        "How do I add or style a section?",
        "Choose Add menu section, select the image position and background color, then add it. Use the section’s color dropdown to change its background later.",
      ],
      [
        "How do I edit menu text and images?",
        "Click the title, description, item text, or image directly in the editor. Click the plus button in a section to add an item.",
      ],
      [
        "How do I reorder or remove content?",
        "Use the up and down arrows for sections or items, and the X to remove one. The final remaining section cannot be removed. Section controls work independently of the image.",
      ],
      [
        "When are menu edits published?",
        "Choose Save changes after editing. Removing items or sections in the editor is part of your draft until you save.",
      ],
    ],
  },
  {
    title: "Events",
    items: [
      [
        "How do I create or edit an event?",
        "Open Events, choose Create event or Edit, and fill in the title, description, date, time, images, and optional button. Choose Save event.",
      ],
      [
        "How do repeating events work?",
        "Choose One-off, Weekly, or Monthly in the Repeats field, then save the event.",
      ],
      [
        "How do I temporarily hide an event?",
        "Choose Deactivate beside Edit. The event disappears publicly but stays editable in admin. Choose Activate to restore it. The Active checkbox in the editor controls the same status.",
      ],
      [
        "What does Delete do?",
        "Delete permanently removes the event after confirmation. It does not go to Archive and cannot be restored there. Use Deactivate if you may need the event again.",
      ],
    ],
  },
  {
    title: "Catering",
    items: [
      [
        "Where can I find catering requests?",
        "Open Catering to see inquiries submitted through the public catering form. Select an inquiry to read its details.",
      ],
      [
        "How do I keep track of requests?",
        "Use the inquiry’s read status controls to distinguish new requests from ones you have reviewed.",
      ],
      [
        "How do I remove a request from the current list?",
        "Open the inquiry and choose Archive. You can restore it from Archive until that archive is cleared.",
      ],
      [
        "How do I change catering page images?",
        "Use the page image controls above the inquiries, select the image location, choose replacement media, and save.",
      ],
    ],
  },
  {
    title: "Contact",
    items: [
      [
        "Where do website messages appear?",
        "Open Contact and select an inquiry to read the submitted details.",
      ],
      [
        "Can I mark a message as read or unread?",
        "Yes. Use the read status controls to keep track of messages you have reviewed.",
      ],
      [
        "How do I archive a message?",
        "Open the message and choose Archive. It remains recoverable in Archive until that archive is cleared.",
      ],
      [
        "How do I update contact page images?",
        "Use the page image controls at the top of Contact, select a location, choose replacement media, and save.",
      ],
    ],
  },
  {
    title: "Images, video & saving",
    items: [
      [
        "How do I replace media?",
        "Click an editable image or use the media picker for the relevant page location. Choose a supported file and wait for the upload to complete.",
      ],
      [
        "Can I upload a video anywhere?",
        "Use video only where the media picker supports it. Other image fields require an image; the picker validates the file type and size.",
      ],
      [
        "Does uploading automatically publish my change?",
        "In the Home, About, and menu editors, upload adds media to your draft; use Save changes to publish. Page image panels have their own save action, and event images are saved with Save event.",
      ],
      [
        "What should I do if saving or uploading fails?",
        "Read the error shown by the editor, check the file or entered values, and try again. Wait for a successful save message before leaving the page.",
      ],
    ],
  },
  {
    title: "Announcement Bar",
    items: [
      [
        "How do I create an announcement?",
        "Open Marketing → Announcement Bar, create an announcement, and enter its text, optional link, and colors. Save when ready.",
      ],
      [
        "Can more than one announcement be active?",
        "Only one announcement can be active at a time. Activating one deactivates the previous announcement.",
      ],
      [
        "How do I hide or remove an announcement?",
        "Deactivate it to keep it for later, or choose Delete and confirm to remove it permanently.",
      ],
    ],
  },
  {
    title: "Pop-Ups & email capture",
    items: [
      [
        "How do I create a pop-up?",
        "Open Marketing → Pop-Ups and create one. Choose its layout, add text and any image, customize its appearance, then save.",
      ],
      [
        "How do I add a button or collect emails?",
        "Enable the optional button and enter its text and destination. Use the email capture option when you want visitors to submit their email addresses.",
      ],
      [
        "How do I control which pop-up appears?",
        "Activate the pop-up you want to show. Only one pop-up is active at a time; this is independent of the active announcement. Deactivate it to stop showing it.",
      ],
      [
        "How do I download captured emails?",
        "Use Export CSV in the acquired email area. Deleting a pop-up preserves the attribution of emails already collected.",
      ],
    ],
  },
  {
    title: "Archive & recovery",
    items: [
      [
        "What can I find in Archive?",
        "Archive groups archived menus, events, contact inquiries, and catering inquiries. Previously archived events may still appear here; new event deletions are permanent.",
      ],
      [
        "How do I restore an archived record?",
        "Open Archive, choose its collection, and use Restore on the record you want to return to the current list.",
      ],
      [
        "What does Clear this archive do?",
        "It permanently deletes the archived records in the selected collection after confirmation. Those records can no longer be restored.",
      ],
    ],
  },
] as const

function Question({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="border-b border-deep-brown/10 last:border-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
          className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-5 px-5 py-4 text-left text-sm font-semibold transition-colors hover:bg-deep-brown/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-wine"
        >
          {question}
          <span
            aria-hidden="true"
            className={`shrink-0 text-xl font-normal transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-45" : "rotate-0"}`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={id}
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-deep-brown/75">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function AdminFaq() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader eyebrow="Help" title="Frequently asked questions" />
      <p className="mb-6 text-sm leading-6 text-deep-brown/70">
        Find help for each admin page and everyday task. Choose a topic below, then open a question
        to see its answer.
      </p>
      <nav aria-label="FAQ topics" className="mb-10 flex flex-wrap gap-2">
        {sections.map((section, index) => (
          <a
            key={section.title}
            href={`#faq-topic-${index}`}
            className="rounded-full border border-deep-brown/15 bg-white px-3 py-2 text-xs font-medium transition-colors hover:bg-deep-brown/5 focus-visible:outline-2 focus-visible:outline-wine"
          >
            {section.title}
          </a>
        ))}
      </nav>
      <div className="grid gap-8">
        {sections.map((section, index) => (
          <section
            key={section.title}
            id={`faq-topic-${index}`}
            aria-labelledby={`faq-heading-${index}`}
            className="scroll-mt-24"
          >
            <h2 id={`faq-heading-${index}`} className="mb-3 text-lg font-semibold">
              {section.title}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-deep-brown/10 bg-white shadow-sm">
              {section.items.map(([question, answer]) => (
                <Question key={question} question={question} answer={answer} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
