import mongoose from 'mongoose'

// default uniqueなどを => schema optionという
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    brand: { type: String, required: true },
    rating: { type: String, required: true },
    numReviews: { type: String, required: true, default: 0 },
    countInStock: { type: String, required: true, default: 0 },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const testSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  isBoolean: Boolean,
  ofDate: [Date],
})

export const Test = mongoose.models.Test || mongoose.model('Test', testSchema)

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema)
