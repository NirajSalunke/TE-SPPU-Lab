import mongoose from 'mongoose';

const enrolmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    academicYear: { type: String, required: true }, // e.g. "2024-25"
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F', null],
      default: null,
    },
    gradePoints: { type: Number, min: 0, max: 10, default: null },
    status: { type: String, enum: ['active', 'dropped', 'completed'], default: 'active' },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate enrolments
enrolmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrolment', enrolmentSchema);
