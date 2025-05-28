export const DiscountedPrice = (BasePrice,dis = 1)=>{
    const discounAmount = Math.ceil((Number(BasePrice) * Number(dis)) / 100)
    const actualPrice = Number(BasePrice) - Number(discounAmount)
    return actualPrice
}