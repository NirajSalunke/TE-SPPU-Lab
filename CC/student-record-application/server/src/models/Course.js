import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    credits: { type: Number, required: true, min: 1, max: 6 },
    semester: { type: Number, required: true, min: 1, max: 8 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
