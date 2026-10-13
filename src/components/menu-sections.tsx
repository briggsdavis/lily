import { MenuParallaxSection } from "@/components/menu-parallax-section"
import { MenuSectionImage } from "@/components/menu-section-image"
import type { MenuCategory } from "@/data/menu"

export function MenuSections({ category }: { category: MenuCategory }) {
  return (
    <div>
      <div>
        {category.sections.map((section, index) => {
          const imageOnRight = index % 2 === 1

          return (
            <MenuParallaxSection index={index} key={section.title}>
              <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
                <div className={imageOnRight ? "md:order-2" : undefined}>
                  <MenuSectionImage alt={section.imageAlt} src={section.image} />
                </div>

                <div className={imageOnRight ? "md:order-1" : undefined}>
                  <div className="mb-9 border-b border-pink/25 pb-8 md:mb-11 md:pb-10">
                    <h2 className="font-display text-4xl leading-none font-medium text-warm-white md:text-5xl">
                      {section.title}
                    </h2>
                  </div>

                  <ul className="grid gap-7 md:gap-8">
                    {section.items.map((item) => (
                      <li
                        className="transition-transform duration-500 ease-lily hover:translate-x-2 motion-reduce:transition-none"
                        key={item.name}
                      >
                        <div className="flex items-baseline gap-4">
                          <h3 className="font-display text-xl leading-tight text-warm-white md:text-2xl">
                            {item.name}
                          </h3>
                          <p className="ml-auto shrink-0 text-sm font-semibold text-pink">
                            {item.price}
                          </p>
                        </div>
                        <p className="mt-1.5 w-full text-sm leading-6 text-pink/65">
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </MenuParallaxSection>
          )
        })}
      </div>
    </div>
  )
}
