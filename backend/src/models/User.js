import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
