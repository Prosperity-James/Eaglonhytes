import React, { useState, useEffect } from "react";
import {
  FiUsers as Users,
  FiAward as Award,
  FiHeart as Heart,
  FiHome as Home,
  FiShield as Shield,
  FiStar as Star,
} from "react-icons/fi";
import api from '../utils/api.js';
import "../styles/about.css";

const About = () => {
  const [storyContent, setStoryContent] = useState({
    title: "Our Journey",
    content_paragraph_1: "",
    content_paragraph_2: "",
    image_url: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch story content from database
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch story content
        const storyResponse = await api.get('/content_management.php?action=get_story');
        console.log('Story API Response:', storyResponse);
        if (storyResponse.success && storyResponse.data) {
          console.log('Story Data:', storyResponse.data);
          console.log('Image URL:', storyResponse.data.image_url);
          setStoryContent(storyResponse.data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const values = [
    {
      icon: <Shield className="value-icon" />,
      title: "Safety & Security",
      description: "24/7 surveillance and modern security systems for peace of mind.",
    },
    {
      icon: <Heart className="value-icon" />,
      title: "Comfort Living",
      description: "Spacious layouts and premium amenities designed for relaxation.",
    },
    {
      icon: <Users className="value-icon" />,
      title: "Strong Community",
      description: "We foster a welcoming environment for neighbors to connect.",
    },
    {
      icon: <Award className="value-icon" />,
      title: "Quality Standards",
      description: "Top-notch construction and maintenance to ensure long-lasting homes.",
    },
  ];

  const achievements = [
    { number: "500+", label: "Happy Residents" },
    { number: "50+", label: "Modern Apartments" },
    { number: "4.9/5", label: "Resident Satisfaction" },
    { number: "10", label: "Years of Excellence" },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background"></div>
        <div className="about-hero-overlay">
          <div className="hero-content">
            <h1 className="about-title">About Our Company</h1>
            <p className="about-subtitle">
              Discover the story behind our community, our commitment to quality land,
              and what makes our lands the perfect investment.
            </p>
            <div className="hero-stats">
              {achievements.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container about-section1">
          <div className="story-content1 image-left">
          <div className="story-text">
            <h2 className="section-title">{storyContent.title}</h2>
            <p className="about-text">
              {storyContent.content_paragraph_1}
            </p>
            <p className="about-text">
              {storyContent.content_paragraph_2}
            </p>
          </div>
          <div className="story-image">
            <img 
              src={'/assets/storyimg.jpg'}
              alt="Real Estate Keys - Our Story"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{
              display: 'none',
              width: '100%',
              height: '400px',
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '15px',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              flexDirection: 'column'
            }}>
              <p>📷 Add storyimg.jpg to /assets/ folder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                {value.icon}
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container about-section mission-vision">
        <div className="about-card mission-card">
          <div className="card-header">
            <Star className="card-icon" />
            <h3>Our Mission</h3>
          </div>
          <p>
At Eaglophytes Global Consults, our mission is to empower Nigerians at home and in the diaspora to build their dreams with confidence and transparency. We are dedicated to eliminating the risks of real estate investment, such as the misuse of funds, by offering reliable services in land procurement, property development, and the supply of high-quality building materials. Based in Abuja’s Building Materials Market, Timber Shed, Kugbo, we strive to deliver exceptional value, integrity, and peace of mind in every project, ensuring your vision for a home or investment becomes a reality you can trust.
          </p>
        </div>
        <div className="about-card vision-card">
          <div className="card-header">
            <Home className="card-icon" />
            <h3>Our Vision</h3>
          </div>
          <p>
            At Eaglophytes Global Consults, our vision is to redefine real estate and construction services by creating a seamless, trustworthy platform for Nigerians and the diaspora to invest in their dreams with absolute confidence. We aim to be the leading name in Africa’s real estate industry, delivering innovative solutions for land acquisition, property development, and building material supply. By leveraging transparency, technology, and unparalleled expertise, we aspire to build a future where every client’s investment is secure, their projects are completed with excellence, and their peace of mind is guaranteed.
          </p>
        </div>
      </section>


      {/* Sustainability Section */}
      <section className="sustainability-section">
        <div className="container">
          <div className="sustainability-content">
            <div className="sustainability-text">
              <h2 className="section-title">Our Sustainability Commitment</h2>
              <p>
                At Eaglophytes Global Consults, we are committed to building a sustainable future for our communities and the planet. We integrate eco-friendly practices into every aspect of our work,
                from sourcing responsibly produced building materials to promoting energy-efficient property designs.
              </p>
              <ul className="sustainability-list">
                <li>Energy-efficient designs</li>
                <li>Responsible land use </li>
                <li>Waste reduction </li>
                <li>Water conservation </li>
                <li>Community management </li>
                <li>Eco-friendly building materials</li>
              </ul>
            </div>
            <div className="sustainability-image">
              <img
                src={'assets/sustainability.jpg'}
                alt="Sustainability"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-content">
          <h2>Find your ideal land</h2>
          <p>
            Explore our available properties and building materials.
          </p>
          <div className="cta-buttons">
            <a href="/apartments" className="about-btn primary">
              View Lands
            </a>
            <a href="/contact" className="about-btn secondary">
              Schedule a Visit
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
