import React, { useState, useEffect } from 'react';
import './PlanEditModal.css';

const PlanEditModal = ({ plan, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    duration: 30, // in days
    maxBooks: 3,
    features: [],
    description: '',
    isPopular: false
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        features: plan.features || [],
        duration: plan.duration || 30,
        maxBooks: plan.maxBooks || 3
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{plan?.id ? 'Edit Subscription Plan' : 'Add New Plan'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="plan-form">
          <div className="form-grid">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Plan Name</label>
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
                <label htmlFor="price">Monthly Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (days)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxBooks">Maximum Books</label>
                <input
                  type="number"
                  id="maxBooks"
                  name="maxBooks"
                  value={formData.maxBooks}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                  />
                  Mark as Popular Plan
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Plan Features</h3>
              
              <div className="form-group">
                <label htmlFor="description">Plan Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Features List</label>
                <div className="features-input">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Enter a feature"
                  />
                  <button
                    type="button"
                    className="add-feature-btn"
                    onClick={handleAddFeature}
                  >
                    Add
                  </button>
                </div>

                <ul className="features-list">
                  {formData.features.map((feature, index) => (
                    <li key={index}>
                      {feature}
                      <button
                        type="button"
                        className="remove-feature-btn"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {plan?.id ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanEditModal; 