import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        medicine_id: {
          type: Number,
          required: true,
        },
        medicine_name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total_amount: {
      type: Number,
      required: true,
    },
    delivery_address: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
