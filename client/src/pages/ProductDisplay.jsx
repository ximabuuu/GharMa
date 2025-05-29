"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import AxiosToastError from "../utils/AxiosToastError.js"
import Axios from "../utils/axios.js"
import SummaryApi from "../config/SummaryApi.js"
import { ChevronLeft, ChevronRight, Star, Plus, Minus, Truck, Award, Package } from "lucide-react"
import { DiscountedPrice } from "../utils/DiscountedPrice"
import AddToCart from "../component/AddToCart.jsx"

const ProductDisplay = () => {
  const params = useParams()
  const productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    reviews: [],
    pricingModel: "fixed",
    unitName: "",
    BasePrice: null,
    pricePerUnit: 0,
    minUnits: 1,
    addOns: [],
    discount: 0,
    description: "",
    more_details: {},
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [userId, setUserId] = useState()

  // New state for pricing calculations
  const [selectedUnits, setSelectedUnits] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState([])

  const fetchReviews = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getReview,
        params: { productId },
      })

      if (response.data.success) {
        setReviews(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleReviewSubmit = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.addReview,
        data: {
          productId,
          userId,
          rating,
          comment: reviewText,
        },
      })

      if (response.data.success) {
        setReviewText("")
        fetchReviews()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleNext = () => {
    imageContainer.current.scrollLeft += 100
  }

  const handlePrev = () => {
    imageContainer.current.scrollLeft -= 100
  }

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
        // Initialize selected units with minimum required
        setSelectedUnits(responseData.data.minUnits || 1)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate total price based on pricing model and selected options
  const calculateTotalPrice = () => {
    let basePrice = 0

    if (data.pricingModel === "fixed") {
      basePrice = data.BasePrice || 0
    } else if (data.pricingModel === "per_unit") {
      basePrice = (data.BasePrice || 0) + data.pricePerUnit * selectedUnits
    } else if (data.pricingModel === "per_hour") {
      basePrice = (data.BasePrice || 0) + data.pricePerUnit * selectedUnits
    } else if (data.pricingModel === "area_based") {
      basePrice = (data.BasePrice || 0) + data.pricePerUnit * selectedUnits
    }

    // Add selected add-ons
    const addOnPrice = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = data.addOns?.find((addon) => addon._id === addOnId)
      return sum + (addOn ? addOn.price : 0)
    }, 0)

    const totalBeforeDiscount = basePrice + addOnPrice
    return DiscountedPrice(totalBeforeDiscount, data.discount)
  }

  // Calculate original total (before discount)
  const calculateOriginalTotal = () => {
    let basePrice = 0

    if (data.pricingModel === "fixed") {
      basePrice = data.BasePrice || 0
    } else if (data.pricingModel === "per_unit") {
      basePrice = (data.BasePrice || 0) + data.pricePerUnit * selectedUnits
    } else if (data.pricingModel === "per_hour") {
      basePrice = (data.BasePrice || 0) + data.pricePerUnit * selectedUnits
    } else if (data.pricingModel === "area_based") {
      basePrice = (data.BasePrice || 0) + data.pricePerUnit * selectedUnits
    }

    const addOnPrice = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = data.addOns?.find((addon) => addon._id === addOnId)
      return sum + (addOn ? addOn.price : 0)
    }, 0)

    return basePrice + addOnPrice
  }

  const handleAddOnToggle = (addOnId) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }

  const handleUnitsChange = (value) => {
    const units = Math.max(data.minUnits || 1, Number.parseInt(value) || 1)
    setSelectedUnits(units)
  }

  const getPricingModelLabel = () => {
    switch (data.pricingModel) {
      case "per_unit":
        return data.unitName || "unit"
      case "per_hour":
        return "hour"
      case "area_based":
        return "sq ft"
      default:
        return ""
    }
  }

  useEffect(() => {
    fetchProductDetails()
    fetchReviews()
  }, [params, productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Section - Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <img
                  src={data.image[image] || "/placeholder.svg"}
                  alt="Product Image"
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                {data.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {data.discount}% OFF
                  </div>
                )}
              </div>

              {/* Image Navigation Dots */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {data.image.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === image ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="relative">
              <div
                ref={imageContainer}
                className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {data.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(index)}
                    className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      index === image ? "border-blue-600 shadow-lg" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain bg-white p-1"
                    />
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Product Details - Desktop Only */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{data.description}</p>
              </div>

              {data?.more_details && Object.keys(data?.more_details).length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                  <div className="space-y-3">
                    {Object.keys(data?.more_details).map((key, index) => (
                      <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <p className="font-medium text-gray-900">{key}</p>
                        <p className="text-gray-600 mt-1">{data?.more_details[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{data.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(data.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">({data.averageRating || 0})</span>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <Truck className="w-4 h-4" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Award className="w-4 h-4" />
                  <span>Best Price</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <Package className="w-4 h-4" />
                  <span>Quality Assured</span>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Details</h3>

              {data.pricingModel === "fixed" ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium mb-1">Fixed Price</p>
                  <p className="text-2xl font-bold text-blue-900">₹{data.BasePrice}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.BasePrice > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium mb-1">Base Price</p>
                      <p className="text-xl font-bold text-gray-900">₹{data.BasePrice}</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 font-medium mb-1">Price per {getPricingModelLabel()}</p>
                    <p className="text-xl font-bold text-green-900">₹{data.pricePerUnit}</p>
                  </div>

                  {/* Units Selection */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-blue-900 mb-3">
                      Select {getPricingModelLabel()}s (minimum: {data.minUnits})
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUnitsChange(selectedUnits - 1)}
                        disabled={selectedUnits <= (data.minUnits || 1)}
                        className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={data.minUnits || 1}
                        value={selectedUnits}
                        onChange={(e) => handleUnitsChange(e.target.value)}
                        className="w-20 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleUnitsChange(selectedUnits + 1)}
                        className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600 font-medium">{getPricingModelLabel()}s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add-ons Section */}
              {data.addOns && data.addOns.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Add-ons (Optional)</h4>
                  <div className="space-y-3">
                    {data.addOns.map((addOn) => (
                      <label
                        key={addOn._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAddOns.includes(addOn._id)}
                            onChange={() => handleAddOnToggle(addOn._id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-3 font-medium text-gray-900">{addOn.name}</span>
                        </div>
                        <span className="font-semibold text-green-600">+₹{addOn.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Price Display */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total Price</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">₹{calculateTotalPrice()}</div>
                    {data.discount !== 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 line-through">₹{calculateOriginalTotal()}</span>
                        <span className="text-green-600 font-semibold">{data.discount}% OFF</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                {data.pricingModel !== "fixed" && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-1">
                    {data.BasePrice > 0 && (
                      <div className="flex justify-between">
                        <span>Base:</span>
                        <span>₹{data.BasePrice}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>
                        {selectedUnits} {getPricingModelLabel()}s × ₹{data.pricePerUnit}:
                      </span>
                      <span>₹{data.pricePerUnit * selectedUnits}</span>
                    </div>
                    {selectedAddOns.length > 0 && (
                      <div className="flex justify-between">
                        <span>Add-ons:</span>
                        <span>
                          ₹
                          {selectedAddOns.reduce((sum, addOnId) => {
                            const addOn = data.addOns?.find((addon) => addon._id === addOnId)
                            return sum + (addOn ? addOn.price : 0)
                          }, 0)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <AddToCart
                data={{
                  ...data,
                  selectedUnits,
                  selectedAddOns,
                  totalPrice: calculateTotalPrice(),
                }}
              />
            </div>

            {/* Mobile Product Details */}
            <div className="lg:hidden space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{data.description}</p>
              </div>

              {data?.more_details && Object.keys(data?.more_details).length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                  <div className="space-y-3">
                    {Object.keys(data?.more_details).map((key, index) => (
                      <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <p className="font-medium text-gray-900">{key}</p>
                        <p className="text-gray-600 mt-1">{data?.more_details[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>

              {/* Review List */}
              <div className="space-y-4 mb-6">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{review.userId.name}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                          {star} Star{star > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Share your experience with this product..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleReviewSubmit}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay
