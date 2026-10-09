import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CateringProductDetail } from "@/components/catering-product-detail"
import { cateringProducts, getCateringProduct } from "@/data/catering-products"

export const dynamicParams = false

export function generateStaticParams() {
  return cateringProducts.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getCateringProduct(slug)
  if (!product) return { title: "Catering item" }

  return {
    title: `${product.name} • Catering`,
    description: product.description,
  }
}

function DetailFallback() {
  return (
    <section className="min-h-svh bg-events-gray px-page pt-40 text-cream">
      Preparing this catering item…
    </section>
  )
}

const detailFallback = <DetailFallback />

export default async function CateringProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getCateringProduct(slug)
  if (!product) notFound()

  return (
    <Suspense fallback={detailFallback}>
      <CateringProductDetail product={product} />
    </Suspense>
  )
}
