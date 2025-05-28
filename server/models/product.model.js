import mongoose from "mongoose";


const AddOnSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});


const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: Array,
        default: []
    },
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ],
    subCategory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory'
        }
    ],
    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "review"
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    pricingModel: {
        type: String,
        enum: ['fixed', 'per_unit', 'per_hour', 'area_based'],
        default: 'fixed',
    },
    unitName: {
        type: String,
        default: ""
    },
    BasePrice: {
        type: Number,
        default: null
    },
    pricePerUnit: {
        type: Number
    },
    minUnits: { type: Number, default: 1 },
    addOns: [AddOnSchema],
    discount: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

productSchema.index({
    name: "text",
    description: "text"
}, {
    name: 10,
    description: 5
})

const ProductModel = mongoose.model("product", productSchema)

export default ProductModel