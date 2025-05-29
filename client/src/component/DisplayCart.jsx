import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global/globalFunc';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import AddToCart from './AddToCart';
import { DiscountedPrice } from '../utils/DiscountedPrice';
import emptyCart from '../assets/emptyCart.png'
import toast from 'react-hot-toast';

const DisplayCart = ({ close }) => {

  const { originalPriceTotal, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const redirectToCheckOut = () => {
    if (user?._id) {
      navigate("/checkout")
      if (close) {
        close()
      }
      return
    }
    toast("You are not Logged in yet.")
  }

  const getDeliveryCharge = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 23 ? 120 : 60;
  };

  const deliveryCharge = getDeliveryCharge()

  const showLateNightNotice = new Date().getHours() >= 23;

  // Helper function to calculate item price based on pricing model
  const calculateItemPrice = (cartItem) => {
    const product = cartItem.productId;
    let itemPrice = 0;

    if (product.pricingModel === 'fixed') {
      itemPrice = product.BasePrice || product.price || 0;
    } else if (product.pricingModel === 'per_unit') {
      const units = cartItem.selectedUnits || 1;
      itemPrice = (product.BasePrice || 0) + (product.pricePerUnit * units);
    } else if (product.pricingModel === 'per_hour') {
      const hours = cartItem.selectedUnits || 1;
      itemPrice = (product.BasePrice || 0) + (product.pricePerUnit * hours);
    } else if (product.pricingModel === 'area_based') {
      const area = cartItem.selectedUnits || 1;
      itemPrice = (product.BasePrice || 0) + (product.pricePerUnit * area);
    } else {
      // Fallback to legacy price field
      itemPrice = product.price || 0;
    }

    // Add selected add-ons
    if (cartItem.selectedAddOns && cartItem.selectedAddOns.length > 0) {
      const addOnPrice = cartItem.selectedAddOns.reduce((sum, addOnId) => {
        const addOn = product.addOns?.find(addon => addon._id === addOnId);
        return sum + (addOn ? addOn.price : 0);
      }, 0);
      itemPrice += addOnPrice;
    }

    // Apply discount
    return DiscountedPrice(itemPrice, product.discount || 0);
  };

  // Helper function to get pricing model label
  const getPricingModelLabel = (pricingModel, unitName) => {
    switch (pricingModel) {
      case 'per_unit': return unitName || 'unit';
      case 'per_hour': return 'hour';
      case 'area_based': return 'sq ft';
      default: return '';
    }
  };

  return (
    <section className='bg-neutral-900/50 fixed top-0 right-0 left-0 bottom-0 z-50'>
      <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
        <div className='bg-white flex justify-between items-center p-4 shadow-md '>
          <h2 className='font-semibold text-lg '>Cart</h2>
          <Link to={"/"} className='ml-auto  lg:hidden  '><IoMdCloseCircle size={25} /></Link>
          <button className='ml-auto  hidden lg:block' onClick={close}><IoMdCloseCircle size={25} /></button>
        </div>
        <div className='max-h-[calc(100vh-135px)] h-full lg:min-h-[80vh] min-h-[77vh] bg-blue-50 p-2 flex flex-col gap-4'>
          {
            cartItem[0] ? (
              <>
                <div className='flex items-center px-4 py-2 bg-blue-100 text-blue-500 rounded justify-between'>
                  <p>Your Total Savings </p>
                  <p>Rs. {originalPriceTotal - totalPrice}</p>
                </div>
                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                  {
                    cartItem[0] && (
                      cartItem.map((i, index) => {
                        const itemPrice = calculateItemPrice(i);
                        const product = i?.productId;
                        
                        return (
                          <div key={i._id + "cart" + index} className='flex w-full gap-4 items-start '>
                            <div className='w-15 h-15 min-w-16 min-h-16 border rounded'>
                              <img src={product?.image[0]} alt="" className='object-scale-down' />
                            </div>
                            <div className='w-full max-w-sm'>
                              <p className='text-ellipsis line-clamp-1 font-medium'>{product?.name}</p>
                              
                              {/* Enhanced pricing display */}
                              {product?.pricingModel !== 'fixed' && i.selectedUnits && (
                                <p className='text-xs text-slate-600'>
                                  {i.selectedUnits} {getPricingModelLabel(product.pricingModel, product.unitName)}
                                  {i.selectedUnits > 1 ? 's' : ''}
                                </p>
                              )}
                              
                              {/* Show selected add-ons */}
                              {i.selectedAddOns && i.selectedAddOns.length > 0 && (
                                <div className='text-xs text-green-600 mt-1'>
                                  {i.selectedAddOns.map(addOnId => {
                                    const addOn = product?.addOns?.find(addon => addon._id === addOnId);
                                    return addOn ? (
                                      <p key={addOnId} className='flex justify-between'>
                                        <span>+ {addOn.name}</span>
                                        <span>Rs. {addOn.price}</span>
                                      </p>
                                    ) : null;
                                  })}
                                </div>
                              )}
                              
                              <p className='text-sm font-semibold mt-1'>Rs. {itemPrice}</p>
                              
                              {/* Show original price if there's a discount */}
                              {product?.discount > 0 && (
                                <p className='text-xs text-gray-500 line-through'>
                                  Rs. {product.pricingModel === 'fixed' 
                                    ? product.BasePrice || product.price
                                    : (product.BasePrice || 0) + (product.pricePerUnit * (i.selectedUnits || 1))
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <AddToCart data={{
                                ...product,
                                selectedUnits: i.selectedUnits,
                                selectedAddOns: i.selectedAddOns,
                                totalPrice: itemPrice
                              }} />
                            </div>
                          </div>
                        )
                      })
                    )
                  }
                </div>
                <div className='bg-white p-4'>
                  <h3 className='font-semibold'>Bill Details</h3>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Total Items</p>
                    <p className='font-medium flex items-center gap-2'>
                      {originalPriceTotal !== totalPrice && (
                        <span className='line-through text-neutral-700'>Rs. {originalPriceTotal}</span>
                      )}
                      <span>Rs. {totalPrice}</span>
                    </p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Total Quantity</p>
                    <p className='font-medium flex items-center gap-2'><span>{totalQty} Items</span></p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Delivery Charge</p>
                    <p className='font-medium flex items-center gap-2'><span>Rs. {deliveryCharge}</span></p>
                  </div>
                  {showLateNightNotice && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 rounded">
                      <p className="text-sm font-medium">
                        Late-night delivery charges applied. (After 11 PM)
                      </p>
                    </div>
                  )}
                  <div className='font-semibold flex items-center justify-between gap-4'>
                    <p>Grand Totals</p>
                    <p>Rs. {totalPrice + deliveryCharge}</p>
                  </div>
                </div>

              </>
            ) : (
              <div className='bg-white flex flex-col items-center justify-center'>
                <img src={emptyCart} alt="empty cart" className='w-full h-full object-scale-down' />
                <Link onClick={close} to={"/"} className='bg-red-800 text-white px-2 py-1 rounded m-2 hover:bg-red-600 font-semibold'>Shop Now</Link>
              </div>
            )
          }
        </div>
        {
          cartItem[0] && (
            <div className='p-2'>
              <div className='bg-red-800 text-white p-2 py-4 sticky bottom-3 font-bold lg:text-lg text-base rounded flex gap-4 items-center justify-between'>
                <div>
                  Rs. {totalPrice + deliveryCharge}
                </div>
                <div>

                </div>
                <div>
                  <button onClick={redirectToCheckOut} className='flex items-center gap-1 cursor-pointer'>
                    Proceed
                    <span><FaArrowAltCircleRight size={15} /></span>
                  </button>
                </div>
              </div>
            </div>

          )
        }
      </div>
    </section>
  )
}

export default DisplayCart