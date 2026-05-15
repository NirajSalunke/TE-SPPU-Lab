import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    hodName: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Department', departmentSchema);
