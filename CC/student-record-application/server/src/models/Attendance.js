import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

// One record per student per course per date
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
