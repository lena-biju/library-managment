import React, { useState, useEffect } from 'react';
import './AboutEditor.css';

const AboutEditor = ({ content, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    mission: '',
    vision: '',
    history: '',
    team: [],
    contact: {
      address: '',
      phone: '',
      email: '',
      hours: ''
    },
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    position: '',
    bio: '',
    image: ''
  });

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTeamMemberChange = (e) => {
    const { name, value } = e.target;
    setNewTeamMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMemberImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTeamMember(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling image:', error);
    }
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.name && newTeamMember.position) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, { ...newTeamMember, id: Date.now() }]
      }));
      setNewTeamMember({
        name: '',
        position: '',
        bio: '',
        image: ''
      });
    }
  };

  const handleRemoveTeamMember = (id) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="about-editor">
      <div className="editor-grid">
        <div className="editor-section">
          <h3>Main Content</h3>
          
          <div className="form-group">
            <label htmlFor="title">Page Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subtitle">Subtitle</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mission">Our Mission</label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vision">Our Vision</label>
            <textarea
              id="vision"
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="history">Our History</label>
            <textarea
              id="history"
              name="history"
              value={formData.history}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>
        </div>

        <div className="editor-section">
          <h3>Team Members</h3>
          
          <div className="team-member-form">
            <div className="form-group">
              <label htmlFor="member-name">Name</label>
              <input
                type="text"
                id="member-name"
                name="name"
                value={newTeamMember.name}
                onChange={handleTeamMemberChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="member-position">Position</label>
              <input
                type="text"
                id="member-position"
                name="position"
                value={newTeamMember.position}
                onChange={handleTeamMemberChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="member-bio">Bio</label>
              <textarea
                id="member-bio"
                name="bio"
                value={newTeamMember.bio}
                onChange={handleTeamMemberChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Profile Picture</label>
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTeamMemberImageChange}
                />
                {newTeamMember.image && (
                  <img
                    src={newTeamMember.image}
                    alt="Profile preview"
                    className="image-preview"
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              className="add-member-btn"
              onClick={handleAddTeamMember}
            >
              Add Team Member
            </button>
          </div>

          <div className="team-members-list">
            {formData.team.map(member => (
              <div key={member.id} className="team-member-card">
                {member.image && (
                  <img src={member.image} alt={member.name} />
                )}
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p className="position">{member.position}</p>
                  <p className="bio">{member.bio}</p>
                </div>
                <button
                  type="button"
                  className="remove-member-btn"
                  onClick={() => handleRemoveTeamMember(member.id)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="contact.address">Address</label>
            <textarea
              id="contact.address"
              name="contact.address"
              value={formData.contact.address}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.phone">Phone</label>
            <input
              type="text"
              id="contact.phone"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.email">Email</label>
            <input
              type="email"
              id="contact.email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.hours">Business Hours</label>
            <textarea
              id="contact.hours"
              name="contact.hours"
              value={formData.contact.hours}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>
        </div>

        <div className="editor-section">
          <h3>Social Media Links</h3>
          
          <div className="form-group">
            <label htmlFor="socialLinks.facebook">Facebook</label>
            <input
              type="url"
              id="socialLinks.facebook"
              name="socialLinks.facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks.twitter">Twitter</label>
            <input
              type="url"
              id="socialLinks.twitter"
              name="socialLinks.twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks.instagram">Instagram</label>
            <input
              type="url"
              id="socialLinks.instagram"
              name="socialLinks.instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks.linkedin">LinkedIn</label>
            <input
              type="url"
              id="socialLinks.linkedin"
              name="socialLinks.linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/..."
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default AboutEditor; 