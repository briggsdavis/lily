"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, MouseEvent } from "react"
import { TransitionLink } from "@/components/transition-link"
import {
  cateringCategories,
  cateringPriceBounds,
  cateringProducts,
  formatCateringPrice,
} from "@/data/catering-products"
import type { CateringCategory, CateringProduct } from "@/data/catering-products"

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
] as const

type SortOption = (typeof sortOptions)[number]["value"]
type SelectedCategory = CateringCategory | "all"
type CatalogSelection = {
  category: SelectedCategory
  maximum: number
  minimum: number
  sort: SortOption
}

const collator = new Intl.Collator("en-US", { sensitivity: "base" })
const minimumPrice = cateringPriceBounds.min
const maximumPrice = cateringPriceBounds.max

const clampPrice = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value))

const isCategory = (value: string | null): value is CateringCategory =>
  cateringCategories.some((category) => category.id === value)

const isSortOption = (value: string | null): value is SortOption =>
  sortOptions.some((option) => option.value === value)

function createCatalogQuery({ category, maximum, minimum, sort }: CatalogSelection) {
  const parameters = new URLSearchParams()
  if (category !== "all") parameters.set("category", category)
  if (minimum !== minimumPrice) parameters.set("min", String(minimum))
  if (maximum !== maximumPrice) parameters.set("max", String(maximum))
  if (sort !== "newest") parameters.set("sort", sort)
  return parameters.toString()
}

function parseCatalogSelection(parameters: {
  get: (name: string) => string | null
}): CatalogSelection {
  const categoryParameter = parameters.get("category")
  const sortParameter = parameters.get("sort")
  const minimum = clampPrice(
    Number(parameters.get("min")) || minimumPrice,
    minimumPrice,
    maximumPrice,
  )

  return {
    category: isCategory(categoryParameter) ? categoryParameter : "all",
    maximum: clampPrice(Number(parameters.get("max")) || maximumPrice, minimum, maximumPrice),
    minimum,
    sort: isSortOption(sortParameter) ? sortParameter : "newest",
  }
}

function ProductCard({ product, returnQuery }: { product: CateringProduct; returnQuery: string }) {
  const detailHref = `/catering/${product.slug}${returnQuery ? `?return=${encodeURIComponent(returnQuery)}` : ""}`

  return (
    <article className="group min-w-0 text-center">
      <TransitionLink className="block" href={detailHref}>
        <div className="relative aspect-square overflow-hidden bg-zinc-950/15">
          <Image
            alt={product.imageAlt}
            className="object-cover transition-transform duration-700 ease-lily group-hover:scale-[1.025]"
            fill
            sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 44vw, 28vw"
            src={product.image}
          />
        </div>
        <h2 className="mt-5 font-display text-2xl leading-tight text-pink transition-opacity group-hover:opacity-70">
          {product.name}
        </h2>
        <p className="mt-2 text-sm font-semibold tracking-[0.04em] text-cream">
          {formatCateringPrice(product.portions[0].priceCents)}
        </p>
      </TransitionLink>
    </article>
  )
}

function CateringFilters({
  idPrefix,
  maximum,
  minimum,
  onCategoryChange,
  onMaximumChange,
  onMinimumChange,
  selectedCategory,
}: {
  idPrefix: string
  maximum: number
  minimum: number
  onCategoryChange: (event: MouseEvent<HTMLButtonElement>) => void
  onMaximumChange: (event: ChangeEvent<HTMLInputElement>) => void
  onMinimumChange: (event: ChangeEvent<HTMLInputElement>) => void
  selectedCategory: SelectedCategory
}) {
  const rangeSpan = maximumPrice - minimumPrice
  const selectedStart = ((minimum - minimumPrice) / rangeSpan) * 100
  const selectedEnd = ((maximum - minimumPrice) / rangeSpan) * 100
  const selectedRangeStyle = useMemo(
    () => ({ left: `${selectedStart}%`, right: `${100 - selectedEnd}%` }),
    [selectedEnd, selectedStart],
  )

  return (
    <div>
      <div>
        <h2 className="font-display text-3xl text-pink">Browse by</h2>
        <div className="mt-6 grid gap-1.5">
          <button
            aria-pressed={selectedCategory === "all"}
            className="animated-underline w-max cursor-pointer py-1 text-left text-sm text-cream/65 transition-colors hover:text-cream aria-pressed:text-cream"
            data-category="all"
            onClick={onCategoryChange}
            type="button"
          >
            All catering
          </button>
          {cateringCategories.map((category) => (
            <button
              aria-pressed={selectedCategory === category.id}
              className="animated-underline w-max cursor-pointer py-1 text-left text-sm text-cream/65 transition-colors hover:text-cream aria-pressed:text-cream"
              data-category={category.id}
              key={category.id}
              onClick={onCategoryChange}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-10">
        <fieldset>
          <legend className="text-sm font-semibold text-cream">Price range</legend>
          <div className="mt-5">
            <div className="relative h-6">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cream/35" />
              <div
                className="absolute top-1/2 h-px -translate-y-1/2 bg-pink"
                style={selectedRangeStyle}
              />
              <label className="sr-only" htmlFor={`${idPrefix}-minimum`}>
                Minimum price
              </label>
              <input
                aria-label={`Minimum ${formatCateringPrice(minimum)}`}
                className={`dual-range absolute inset-0 w-full ${minimum >= maximum ? "z-30" : "z-10"}`}
                id={`${idPrefix}-minimum`}
                max={maximumPrice}
                min={minimumPrice}
                onChange={onMinimumChange}
                step="100"
                type="range"
                value={minimum}
              />
              <label className="sr-only" htmlFor={`${idPrefix}-maximum`}>
                Maximum price
              </label>
              <input
                aria-label={`Maximum ${formatCateringPrice(maximum)}`}
                className="dual-range absolute inset-0 z-20 w-full"
                id={`${idPrefix}-maximum`}
                max={maximumPrice}
                min={minimumPrice}
                onChange={onMaximumChange}
                step="100"
                type="range"
                value={maximum}
              />
            </div>
            <div className="mt-2 flex justify-between gap-4 text-xs text-cream/65">
              <span>
                Minimum <span className="text-cream">{formatCateringPrice(minimum)}</span>
              </span>
              <span className="text-right">
                Maximum <span className="text-cream">{formatCateringPrice(maximum)}</span>
              </span>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export function CateringCatalog() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.toString()
  const [selection, setSelection] = useState(() => parseCatalogSelection(searchParams))
  const selectionRef = useRef(selection)
  const queryRef = useRef(searchQuery)

  useEffect(() => {
    if (queryRef.current === searchQuery) return
    const nextSelection = parseCatalogSelection(new URLSearchParams(searchQuery))
    queryRef.current = searchQuery
    selectionRef.current = nextSelection
    setSelection(nextSelection)
  }, [searchQuery])

  const selectedCategory = selection.category
  const selectedMaximum = selection.maximum
  const selectedMinimum = selection.minimum
  const selectedSort = selection.sort

  const updateCatalog = useCallback(
    (updates: Partial<CatalogSelection>) => {
      const nextSelection = { ...selectionRef.current, ...updates }
      selectionRef.current = nextSelection
      setSelection(nextSelection)
      const query = createCatalogQuery(nextSelection)
      queryRef.current = query
      router.replace(`/catering${query ? `?${query}` : ""}`, { scroll: false })
    },
    [router],
  )

  const changeCategory = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const category = event.currentTarget.dataset.category
      if (category && (category === "all" || isCategory(category))) {
        updateCatalog({ category })
      }
    },
    [updateCatalog],
  )
  const changeSort = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const sort = event.currentTarget.value
      if (isSortOption(sort)) updateCatalog({ sort })
    },
    [updateCatalog],
  )
  const changeMinimum = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextMinimum = Math.min(Number(event.currentTarget.value), selectedMaximum)
      updateCatalog({ minimum: nextMinimum })
    },
    [selectedMaximum, updateCatalog],
  )
  const changeMaximum = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextMaximum = Math.max(Number(event.currentTarget.value), selectedMinimum)
      updateCatalog({ maximum: nextMaximum })
    },
    [selectedMinimum, updateCatalog],
  )
  const resetFilters = useCallback(
    () => updateCatalog({ category: "all", maximum: maximumPrice, minimum: minimumPrice }),
    [updateCatalog],
  )

  const visibleProducts = useMemo(() => {
    const filtered = cateringProducts.filter((product) => {
      const price = product.portions[0].priceCents
      return (
        (selectedCategory === "all" || product.category === selectedCategory) &&
        price >= selectedMinimum &&
        price <= selectedMaximum
      )
    })

    return filtered.toSorted((first, second) => {
      if (selectedSort === "price-asc")
        return first.portions[0].priceCents - second.portions[0].priceCents
      if (selectedSort === "price-desc")
        return second.portions[0].priceCents - first.portions[0].priceCents
      if (selectedSort === "name-asc") return collator.compare(first.name, second.name)
      if (selectedSort === "name-desc") return collator.compare(second.name, first.name)
      return second.addedAt.localeCompare(first.addedAt)
    })
  }, [selectedCategory, selectedMaximum, selectedMinimum, selectedSort])

  const returnQuery = createCatalogQuery({
    category: selectedCategory,
    maximum: selectedMaximum,
    minimum: selectedMinimum,
    sort: selectedSort,
  })

  return (
    <div className="mt-12 lg:mt-16">
      <details className="py-5 lg:hidden">
        <summary className="cursor-pointer font-display text-2xl text-pink">
          Browse and filter
        </summary>
        <div className="pt-8">
          <CateringFilters
            idPrefix="mobile-price"
            maximum={selectedMaximum}
            minimum={selectedMinimum}
            onCategoryChange={changeCategory}
            onMaximumChange={changeMaximum}
            onMinimumChange={changeMinimum}
            selectedCategory={selectedCategory}
          />
        </div>
      </details>

      <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <CateringFilters
              idPrefix="desktop-price"
              maximum={selectedMaximum}
              minimum={selectedMinimum}
              onCategoryChange={changeCategory}
              onMaximumChange={changeMaximum}
              onMinimumChange={changeMinimum}
              selectedCategory={selectedCategory}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p aria-live="polite" className="text-sm font-semibold text-cream">
              {visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}
            </p>
            <label className="flex items-center gap-3 text-sm text-cream/65">
              Sort by
              <select
                className="min-w-48 cursor-pointer border-0 border-b border-cream/50 bg-transparent py-2 text-cream outline-none focus-visible:border-pink"
                onChange={changeSort}
                value={selectedSort}
              >
                {sortOptions.map((option) => (
                  <option
                    className="bg-events-gray text-cream"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {visibleProducts.length ? (
            <div className="grid gap-x-7 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.slug} product={product} returnQuery={returnQuery} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-96 flex-col items-start justify-center border-y border-cream/30 py-16">
              <p className="eyebrow text-pink/70">Nothing at this table</p>
              <h2 className="mt-3 max-w-[16ch] font-display text-4xl text-pink">
                Try a wider price range or another category.
              </h2>
              <button
                className="animated-underline mt-8 cursor-pointer text-sm font-bold tracking-[0.08em] uppercase"
                onClick={resetFilters}
                type="button"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
