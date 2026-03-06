import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, CheckCircle, Smartphone } from 'lucide-react';

const RegistrationPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    department: '',
    phone: '',
    email: '',
    enrollment: '',
    semester: ''
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Student Name is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
    else if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = 'Phone Number must be 10 digits';
    if (!formData.email.trim()) newErrors.email = 'Email ID is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid Email ID';
    if (!formData.enrollment.trim()) newErrors.enrollment = 'Enrollment Number is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      const sheetData = {
        "Student Name": formData.name,
        "Enrollment Number": formData.enrollment,
        "Course": formData.course,
        "Department": formData.department,
        "Email ID": formData.email,
        "Phone Number": formData.phone,
        "Semester": formData.semester,
        "Check-in Status": "" 
      };

      try {
        const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
        const formParams = new URLSearchParams(sheetData).toString();
        let finalTicketId = 'GDG-' + Math.floor(10000 + Math.random() * 90000);

        try {
          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',  
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formParams
          });
          
          let dataJSON;
          try {
            const text = await response.text(); // Get raw text first
            dataJSON = JSON.parse(text); // Try to parse
          } catch(e) { 
            console.error("Server response error", e);
            alert("Server Error: Registration not confirmed. Contact Admin.");
            setIsSubmitting(false);
            return;
          }
          
          if (dataJSON.error) {
            alert(dataJSON.error);
            setIsSubmitting(false);
            return; // STOP HERE
          }

          if (dataJSON.ticketId) finalTicketId = dataJSON.ticketId;
          
          if (finalTicketId === "IWD-0100") {
            alert("Registration is closed");
            setIsSubmitting(false);
            return;
          }
          
          // Send Email via Python backend
          const payload = {
              email: formData.email,
              name: formData.name,
              ticketId: finalTicketId
          };
          
          fetch('/api/send-ticket', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          }).catch(err => console.error('Email failed', err));

          navigate('/success', { 
            state: { user: formData, ticketId: finalTicketId } 
          });
        } catch(fetchError) { 
          console.error(fetchError); 
          alert("Network Error. Registration Failed.");
        }
      } catch (error) {
        console.error(error);
        alert("System Error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>
      
      {/* Branding Section */}
      <div style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
        
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#5f6368', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.8 }}>
          GDG Raipur X SRU Raipur Presents
        </p>
        <h1 style={{ 
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 'clamp(2.5rem, 12vw, 4.5rem)', 
          fontWeight: 800, 
          marginBottom: '0', 
          letterSpacing: '-0.04em', 
          lineHeight: 0.9,
          color: '#202124',
          textTransform: 'uppercase'
        }}>
          IWD 2026
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          fontWeight: 500, 
          color: 'var(--google-blue)', 
          marginTop: '0.6rem',
          marginBottom: '1.5rem',
          fontStyle: 'italic'
        }}>
          "Fearless. Iconic. Her."
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.75rem', 
          marginTop: '0.4rem',
          marginBottom: '0.75rem'
        }}>
          <img src="/gdg_logo.png" style={{ height: '28px', objectFit: 'contain' }} alt="GDG Logo" />
          <div style={{ width: '1.5px', height: '20px', background: '#5f6368', borderRadius: '100px', opacity: 0.6 }}></div>
          <img src="/sru_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="SRU Logo" />
        </div>


        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '12px', 
          flexWrap: 'wrap',
          color: '#5f6368',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginTop: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} className="color-blue" />
            <span>March 7, 2026</span>
          </div>
          
          <div style={{ width: '1px', height: '14px', background: '#5f6368', opacity: 0.5 }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="color-blue">09:30 AM</span>
          </div>

          <div style={{ width: '1px', height: '14px', background: '#5f6368', opacity: 0.5 }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} className="color-green" />
            <span>SRU Campus, Raipur</span>
          </div>
        </div>

      </div>

      {/* Registration Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Registration</h2>
          <div style={{ width: '40px', height: '4px', background: 'var(--google-blue)', borderRadius: '2px' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Student Name</label>
            <input type="text" id="name" name="name" className="form-input" placeholder="Enter full name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="enrollment">Enrollment No.</label>
              <input type="text" id="enrollment" name="enrollment" className="form-input" placeholder="SRU-..." value={formData.enrollment} onChange={handleChange} />
              {errors.enrollment && <span className="form-error">{errors.enrollment}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="semester">Semester</label>
              <select id="semester" name="semester" className="form-select" value={formData.semester} onChange={handleChange}>
                <option value="">Select</option>
                <option value="2">2nd</option>
                <option value="4">4th</option>
                <option value="6">6th</option>
                <option value="8">8th</option>
              </select>
              {errors.semester && <span className="form-error">{errors.semester}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">Department</label>
            <input type="text" id="department" name="department" className="form-input" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} />
            {errors.department && <span className="form-error">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="course">Course</label>
            <input type="text" id="course" name="course" className="form-input" placeholder="e.g. B.Tech" value={formData.course} onChange={handleChange} />
            {errors.course && <span className="form-error">{errors.course}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className="form-input" placeholder="name@domain.com" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" className="form-input" placeholder="10-digit number" value={formData.phone} onChange={handleChange} />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className={`btn-primary ${!isSubmitting ? 'animate-pulse-btn' : ''}`} style={{ width: '100%', marginTop: '1rem' }}>
            {isSubmitting ? 'Processing...' : 'Register for Event'}
            {!isSubmitting && <Sparkles size={18} />}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '3rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#5f6368', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
           Neo Tech Club | SRU Raipur
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
