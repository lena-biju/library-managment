import React, { useState, useEffect } from 'react';
import './TestimonialEditModal.css';

const TestimonialEditModal = ({ testimonial, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    text: '',
    image: '',
    rating: 5
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        ...testimonial,
        rating: testimonial.rating || 5
      });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling image:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{testimonial?.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="testimonial-form">
          <div className="form-grid">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role/Position</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (1-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="text">Testimonial Text</label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Profile Picture</label>
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Profile preview"
                      className="image-preview"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {testimonial?.id ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialEditModal; 