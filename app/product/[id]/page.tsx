"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { useCart } from "@/context/CartContext"

interface VariantImage {
    id: string
    imageBannar: string
    imageGallery: string[]
    productVariantId: string
}

interface Variant {
    id: string
    name: string
    size: string
    color: string
    productId: string
    images: VariantImage[]
}

interface SKU {
    id: string
    price: number
    stock: number
    productId: string
    productVariantId: string
    skuCode: string
}

interface Product {
    id: string
    name: string
    description: string
    brand: string
    defaultPrice: number
    maxPrice: number
    minPrice: number
    defaultImageBanner: string
    defaultImagesGallery: string[]
    variants: Variant[]
    skus: SKU[]
}

interface ApiResponse {
    statusCode: number
    message: string
    data: Product
}

const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addToCart } = useCart()

    // Selection states
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                // Reset states for new product
                setSelectedColor(null)
                setSelectedSize(null)
                setMainImage(null)
                setQuantity(1)

                const response = await axios.get<ApiResponse>(`http://localhost:3000/v1/product/${id}`)
                const productData = response.data.data
                setProduct(productData)
                setMainImage(productData.defaultImageBanner)

                // Auto-select first variant if available
                if (productData.variants && productData.variants.length > 0) {
                    const firstVariant = productData.variants[0]
                    setSelectedColor(firstVariant.color)
                    setSelectedSize(firstVariant.size)
                    if (firstVariant.images?.[0]?.imageBannar) {
                        setMainImage(firstVariant.images[0].imageBannar)
                    }
                }
            } catch (err) {
                console.error("Error fetching product details:", err)
                setError("Failed to load product details.")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    // Get available colors and sizes
    const colors = useMemo(() => {
        if (!product || !product.variants) return []
        return Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)))
    }, [product])

    const sizes = useMemo(() => {
        if (!product || !selectedColor || !product.variants) return []
        return Array.from(
            new Set(
                product.variants
                    .filter((v) => v.color === selectedColor)
                    .map((v) => v.size)
                    .filter(Boolean)
            )
        )
    }, [product, selectedColor])

    // Find selected variant and SKU
    const selectedVariant = useMemo(() => {
        if (!product || !selectedColor || !selectedSize || !product.variants) return null
        return product.variants.find(
            (v) => v.color === selectedColor && v.size === selectedSize
        )
    }, [product, selectedColor, selectedSize])

    const selectedSku = useMemo(() => {
        if (!product || !selectedVariant || !product.skus) return null
        return product.skus.find((s) => s.productVariantId === selectedVariant.id)
    }, [product, selectedVariant])

    // Update main image when color changes
    useEffect(() => {
        if (product?.variants && selectedColor) {
            const firstVariantWithColor = product.variants.find(v => v.color === selectedColor)
            if (firstVariantWithColor?.images?.[0]?.imageBannar) {
                setMainImage(firstVariantWithColor.images[0].imageBannar)
            }
        }
    }, [selectedColor, product])

    const allGalleryImages = useMemo(() => {
        if (!product) return []

        const variantImages = selectedVariant?.images[0]
        if (variantImages) {
            return [
                variantImages.imageBannar,
                ...(variantImages.imageGallery?.slice(0, 3) || [])
            ].filter(img => img)
        }

        return [
            product.defaultImageBanner,
            ...(product.defaultImagesGallery?.slice(0, 3) || [])
        ].filter(img => img)
    }, [product, selectedVariant])

    const handleAddToCart = async () => {
        if (selectedSku) {
            await addToCart(selectedSku.id, quantity)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-vh-100 py-40">
                <span className="loading loading-spinner loading-lg text-[#543441]"></span>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="text-center py-40 text-red-500">
                <h2 className="text-2xl font-bold">{error || "Product not found"}</h2>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 mt-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Left Column: Images */}
                <div className="space-y-6">
                    <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                        {mainImage && (
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-opacity duration-300"
                                priority
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {allGalleryImages.filter(img => img).map((img, index) => (
                            <div
                                key={index}
                                className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? 'border-[#543441]' : 'border-transparent hover:border-gray-300'}`}
                                onClick={() => setMainImage(img)}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} gallery ${index}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col space-y-8">
                    <div>
                        <span className="text-sm font-semibold text-[#543441] uppercase tracking-wider">{product.brand}</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">{product.name}</h1>
                    </div>

                    <div className="space-y-4">
                        {selectedSku && (
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                SKU: <span className="text-gray-900">{selectedSku.skuCode}</span>
                            </div>
                        )}
                        <div className="flex items-baseline space-x-4">
                            <span className="text-3xl font-bold text-[#543441]">
                                {selectedSku ? `${selectedSku.price} BDT` : `${product.defaultPrice} BDT`}
                            </span>
                            {product.maxPrice > product.defaultPrice && !selectedSku && (
                                <span className="text-lg text-gray-400 line-through">
                                    {product.maxPrice} BDT
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="divider opacity-50"></div>

                    <div className="space-y-6">
                        {/* Color Selection */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Color: {selectedColor}</h3>
                            <div className="flex flex-wrap gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            setSelectedColor(color)
                                            // Reset size if not available for new color
                                            const hasSize = product.variants.some(v => v.color === color && v.size === selectedSize)
                                            if (!hasSize) {
                                                const firstSizeForColor = product.variants.find(v => v.color === color)?.size || null
                                                setSelectedSize(firstSizeForColor)
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${selectedColor === color
                                            ? "border-[#543441] bg-[#543441] text-white"
                                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Size: {selectedSize}</h3>
                            <div className="flex flex-wrap gap-3">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedSize === size
                                            ? "border-[#543441] bg-[#543441] text-white"
                                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selection */}
                        <div className="flex items-center space-x-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase">Quantity</h3>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                >
                                    -
                                </button>
                                <span className="px-6 py-2 font-semibold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${selectedSku && selectedSku.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                            <span className="text-sm font-medium text-gray-600">
                                {selectedSku ? (selectedSku.stock > 0 ? `In Stock (${selectedSku.stock} units)` : "Out of Stock") : "Select variants to see stock"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary bg-[#543441] hover:bg-[#3d262f] border-none text-white h-14 text-lg"
                                disabled={!selectedSku || selectedSku.stock === 0}
                            >
                                ADD TO CART
                            </button>
                            <button
                                className="btn btn-outline border-[#543441] text-[#543441] hover:bg-[#543441] hover:border-[#543441] h-14 text-lg"
                                disabled={!selectedSku || selectedSku.stock === 0}
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
