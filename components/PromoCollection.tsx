"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"

interface Product {
  id: string
  name: string
  description: string
  brand: string
  defaultPrice: number
  defaultImageBanner: string
  minPrice: number
  maxPrice: number
}

interface PromoCollection {
  id: string
  name: string
  status: boolean
  limit: number
  products_id: string[]
  createdAt: string
  updatedAt: string
  products: Product[]
}

interface ApiResponse {
  statusCode: number
  message: string
  data: PromoCollection[]
  meta: {
    total: number
    page: string
    limit: string
    totalPages: number
  }
}

const PromoCollection = () => {
  const [collections, setCollections] = useState<PromoCollection[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  const lastProductElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(
        `http://localhost:3000/v1/promo-products?page=${page}&limit=8`
      )
      const newData = response.data.data
      setCollections((prev) => [...prev, ...newData])
      setHasMore(page < response.data.meta.totalPages)
    } catch (error) {
      console.error("Error fetching collections:", error)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="max-w-[100%] px-4 sm:px-6 lg:px-8 py-20">
      {collections.map((collection, collectionIndex) => (
        <div key={collection.id} className="mb-20 last:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold text-[#543441] text-center mb-12 uppercase tracking-wide">
            {collection.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[100%]">
            {collection.products.map((product, productIndex) => {
              const isLastElement =
                collectionIndex === collections.length - 1 &&
                productIndex === collection.products.length - 1
              return (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  ref={isLastElement ? lastProductElementRef : null}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                >
                  <figure className="relative h-72 overflow-hidden">
                    <Image
                      src={product.defaultImageBanner}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 badge badge-primary font-bold">
                      {product.brand}
                    </div>
                  </figure>
                  <div className="card-body p-5">
                    <h3 className="card-title text-lg font-bold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">
                          Price Range
                        </span>
                        <span className="text-lg font-bold text-[#543441]">
                          {product.minPrice} - {product.maxPrice} BDT
                        </span>
                      </div>
                    </div>
                    <div className="card-actions mt-4">
                      <button className="btn btn-outline btn-primary w-full border-2 hover:bg-[#543441] hover:border-[#543441]">
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-center mt-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {!hasMore && collections.length > 0 && (
        <p className="text-center text-gray-500 mt-12 font-medium italic">
          You have seen all collections.
        </p>
      )}
    </div>
  )
}

export default PromoCollection
