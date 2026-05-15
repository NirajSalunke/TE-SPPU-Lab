import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { SEMESTERS, BLOOD_GROUPS } from '../../utils/formatters.js';

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '', gender: 'male',
  dob: '', department: '', semester: 1, address: '',
  bloodGroup: '', guardianName: '', guardianPhone: '', avatarSeed: '',
};

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(EMPTY);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/departments').then((r) => setDepartments(r.data.data));
    if (isEdit) {
      api.get(`/students/${id}`).then((r) => {
        const s = r.data.data;
        setForm({
          firstName: s.firstName, lastName: s.lastName, email: s.email,
          phone: s.phone || '', gender: s.gender, dob: s.dob ? s.dob.slice(0, 10) : '',
          department: s.department?._id || '', semester: s.semester,
          address: s.address || '', bloodGroup: s.bloodGroup || '',
          guardianName: s.guardianName || '', guardianPhone: s.guardianPhone || '',
          avatarSeed: s.avatarSeed || '',
        });
      });
    }
  }, [id, isEdit]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = 'Required';
    if (!form.lastName.trim()) err.lastName = 'Required';
    if (!form.email.trim()) err.email = 'Required';
    if (!form.department) err.department = 'Required';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    const payload = { ...form };
    if (!payload.avatarSeed) payload.avatarSeed = `${form.firstName} ${form.lastName}`;
    try {
      if (isEdit) {
        await api.put(`/students/${id}`, payload);
        toast.success('Student updated!');
      } else {
        await api.post('/students', payload);
        toast.success('Student created!');
      }
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', children, required }) => (
    <div>
      <label className="label">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children || (
        <input id={name} type={type} value={form[name]} onChange={set(name)}
          className={`input ${errors[name] ? 'input-error' : ''}`} />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Student' : 'Add New Student'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update student information' : 'Fill in the details to enrol a new student'}</p>
        </div>
        <Link to="/students" className="btn-secondary btn-sm">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6" id="student-form">
        {/* Personal info */}
        <section>
          <h2 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" name="firstName" required />
            <Field label="Last Name" name="lastName" required />
            <Field label="Email Address" name="email" type="email" required />
            <Field label="Phone Number" name="phone" />
            <Field label="Date of Birth" name="dob" type="date" />
            <Field label="Gender" name="gender">
              <select className="select" value={form.gender} onChange={set('gender')}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Blood Group" name="bloodGroup">
              <select className="select" value={form.bloodGroup} onChange={set('bloodGroup')}>
                <option value="">Select...</option>
                {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </Field>
            <Field label="Avatar Seed" name="avatarSeed">
              <input type="text" value={form.avatarSeed} onChange={set('avatarSeed')} placeholder={`${form.firstName || 'First'} ${form.lastName || 'Last'}`} className="input" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Address" name="address">
              <textarea value={form.address} onChange={set('address')} className="input resize-none" rows={2} />
            </Field>
          </div>
        </section>

        {/* Academic info */}
        <section>
          <h2 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Academic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Department" name="department" required>
              <select className={`select ${errors.department ? 'input-error' : ''}`} value={form.department} onChange={set('department')}>
                <option value="">Select Department...</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Semester" name="semester">
              <select className="select" value={form.semester} onChange={set('semester')}>
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </Field>
          </div>
        </section>

        {/* Guardian */}
        <section>
          <h2 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">Guardian Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Guardian Name" name="guardianName" />
            <Field label="Guardian Phone" name="guardianPhone" />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/students" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={loading} id="submit-btn">
            {loading ? 'Saving...' : isEdit ? 'Update Student' : 'Create Student'}
          </button>
        </div>
      </form>
    </div>
  );
}
