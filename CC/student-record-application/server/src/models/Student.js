import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true }, // auto-generated e.g. STU-2024-0001
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    dob: { type: Date, default: null },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    avatarSeed: { type: String, default: '' }, // used to build DiceBear URL
    address: { type: String, default: '' },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', ''],
      default: '',
    },
    guardianName: { type: String, default: '' },
    guardianPhone: { type: String, default: '' },
    status: { type: String, enum: ['active', 'alumni', 'suspended'], default: 'active' },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate studentId before saving
studentSchema.pre('save', async function (next) {
  if (this.studentId) return next();
  const count = await mongoose.model('Student').countDocuments();
  const year = new Date().getFullYear();
  this.studentId = `STU-${year}-${String(count + 1).padStart(4, '0')}`;
  // Default avatarSeed to full name
  if (!this.avatarSeed) {
    this.avatarSeed = `${this.firstName} ${this.lastName}`;
  }
  next();
});

export default mongoose.model('Student', studentSchema);
