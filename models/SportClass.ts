import mongoose, { Schema } from 'mongoose';

const sportClassSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: Date,
  age: String,
  duration: Number,
  enrolledUsers: [Schema.Types.ObjectId],
  averageRating: { type: Number, default: 0 },
  reviews: [
    {
      userId: Schema.Types.ObjectId,
      comment: String,
      rating: Number,
    },
  ],
});

const SportClass = mongoose.model('SportClass', sportClassSchema);
export default SportClass;
