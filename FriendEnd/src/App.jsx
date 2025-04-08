import React, { useState, useEffect } from 'react';
import './JobPortal.css';
import Accessibility from './Components/Accebility';
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [bgColor,setBgColor] = useState('');
  const [largeText,SetlargeText] = useState('');
   const [space,setSpace] = useState('');
   const [highContrast,sethighContrast] = useState('');
   
  const jobCategories = [

    { title: 'Technology', icon: '💻', count: 1243 },
    { title: 'Healthcare', icon: '🏥', count: 857 },
    { title: 'Education', icon: '🎓', count: 639 },
    { title: 'Finance', icon: '💰', count: 524 },
    { title: 'Marketing', icon: '📊', count: 498 },
    { title: 'Hospitality', icon: '🏨', count: 362 }
  ];
  
  const featuredJobs = [
    { title: 'Senior React Developer', company: 'TechCorp', location: 'Kochi', salary: 'Rs 25000', type: 'Full-time', posted: '2 days ago' },
    { title: 'Marketing Manager', company: 'Brand Solutions', location: 'Kannur', salary: 'Rs 20000', type: 'Full-time', posted: '3 days ago' },
    { title: 'UX Designer', company: 'Creative Studio', location: 'Remote', salary: 'Rs 30000', type: 'Contract', posted: '1 day ago' },
    { title: 'Data Analyst', company: 'DataInsights', location: 'Tamilnadu', salary: 'Rs 35000', type: 'Full-time', posted: '5 days ago' }
  ];

  // Initialize speech synthesis when component mounts
  useEffect(() => {
    let accessibilityFeature = localStorage.getItem("accessibilityPreferences");
    if (accessibilityFeature) {
        let data = JSON.parse(accessibilityFeature);
        
        if (data.darkMode) {
            setBgColor('black');
        }
        if (data.largeText) {
            SetlargeText('20px'); // Adjust font size as needed
        }
        if (data.lineSpacing) {
            setSpace('4em'); // Adjust line spacing
        }
        if (data.highContrast) {
          setBgColor('yellow');
        }
        if (data.grayscale) {
          document.body.style.filter = 'grayscale(100%)';
          
        } else {
          document.body.style.filter = 'none';
          
        } 
        if (data.dyslexiaFont) {
          document.body.classList.add('dyslexia-font');
        } else {
          document.body.classList.remove('dyslexia-font');
        }
        if (data.largeCursor) {
          document.body.classList.add('large-cursor');
        } else {
          document.body.classList.remove('large-cursor');
        }
    }

    if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
    }
}, []);


  // Function to speak text
  const speakText = (text) => {
    if (speechSynthesis) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  // Function to stop speaking
  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  // Higher-order function to create mouse enter/leave handlers
  const createSpeechHandlers = (text) => {
    return {
      onMouseEnter: () => speakText(text),
      onMouseLeave: stopSpeaking
    };
  };

  return (
    <div className={`app ${highContrast ? 'high-contrast' : ''}`} 
    style={{
        backgroundColor: bgColor, 
        lineHeight: space,
        fontSize: largeText
     }}
    >
      {/* Header */}
      <header className="header">
  <div className="container header-container">
    <div className="logo" {...createSpeechHandlers("JobConnect - Find Your Dream Job Today")}>
      <h1>JobConnect</h1>
    </div>
    <nav className="main-nav">
      <a href="http://localhost:4000/login" className="nav-link active" {...createSpeechHandlers("Find Jobs")} style={{fontSize:largeText}}>Find Jobs</a>
      <a href="http://localhost:4000/company/signup" className="nav-link" {...createSpeechHandlers("Companies")} style={{fontSize:largeText}}>Companies</a>
      {/* <a href="#" className="nav-link" {...createSpeechHandlers("Career Resources")}>Career Resources</a> */}
      <a href="http://localhost:4000/LoginRouter" className="nav-link" {...createSpeechHandlers("Admin")} style={{ fontSize: largeText,marginRight: '50px' }}>Admin</a>
      
      {/* Accessibility Icon */}
      <button 
        className="accessibility-icon-btn"
        onClick={() => setShowAccessibility(true)}
        {...createSpeechHandlers("Accessibility Options")}
        aria-label="Open Accessibility Options"
        style={{ fontSize: '40px', padding: '10px 10px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',marginRight: 'auto' }}
      >
        <span style={{ fontSize: '100%' }}>♿</span>
      </button>
    </nav>
  </div>
  
  {/* Accessibility Component */}
  {showAccessibility && <Accessibility onClose={() => setShowAccessibility(false)} />}
</header>

      {/* Hero Section with Search */}
      <section className="hero" style={{backgroundColor:bgColor,lineSpacing:space}}>
        <div className="container hero-container">
          <h2 className="hero-title" {...createSpeechHandlers("Find Your Dream Job Today")}>Find Your Dream Job Today</h2>
          <p className="hero-description" style={{fontSize:largeText}} {...createSpeechHandlers("Search through thousands of job listings to find the perfect match for your skills and experience.")}>
            Search through thousands of job listings to find the perfect match for your skills and experience.
          </p>
          
          <div className="search-box">
            <div className="search-form">
              <div className="input-group" {...createSpeechHandlers("Search for job title, keywords, or company")}>
                <span className="input-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="input-group" {...createSpeechHandlers("Enter city, state, or remote")}>
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  className="search-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button 
                className="search-btn"
                {...createSpeechHandlers("Search Jobs")}
              >
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="categories" style={{backgroundColor:bgColor}}>
        <div className="container">
          <h2 className="section-title" {...createSpeechHandlers("Explore Job Categories")}style={{fontSize:largeText}}>Explore Job Categories</h2>
          <div className="category-grid">
            {jobCategories.map((category, index) => (
              <div 
                key={index} 
                className="category-card"
                {...createSpeechHandlers(`${category.title}. ${category.count} jobs available`)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-title">{category.title}</h3>
                <p className="category-count">{category.count} jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="featured-jobs" style={{backgroundColor:bgColor}}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" {...createSpeechHandlers("Featured Jobs")}style={{fontSize:largeText}}>Featured Jobs</h2>
            <a href="#" className="view-all" {...createSpeechHandlers("View All Jobs")}>View All Jobs →</a>
    

          </div>
          
          <div className="jobs-grid">
            {featuredJobs.map((job, index) => (
              <div 
                key={index} 
                className="job-card"
                {...createSpeechHandlers(`${job.title} at ${job.company}. Location: ${job.location}. Salary: ${job.salary}. Employment type: ${job.type}. Posted ${job.posted}.`)}
              >
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-posted">{job.posted}</span>
                </div>
                <p className="job-company">{job.company} • {job.location}</p>
                <div className="job-details">
                  <span className="job-salary">{job.salary}</span>
                  <span className="job-type">{job.type}</span>
                </div>
                <button className="view-job-btn" {...createSpeechHandlers("View Job Details")}>View Details</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <h2 className="section-title" {...createSpeechHandlers("Why Choose JobConnect")}>Why Choose JobConnect</h2>
          <div className="features-grid">
            <div 
              className="feature"
              {...createSpeechHandlers("Fastest Growing Jobs. Access to the newest job postings from top companies around the world.")}
            >
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title"style={{fontSize:largeText}}>Fastest Growing Jobs</h3>
              <p className="feature-description" style={{fontSize:largeText}}>Access to the newest job postings from top companies around the world.</p>
            </div>
            <div 
              className="feature"
              {...createSpeechHandlers("Trusted by Employers. Over 10,000 companies post their vacancies on our platform regularly.")}
            >
              <div className="feature-icon">👔</div>
              <h3 className="feature-title" style={{fontSize:largeText}}>Trusted by Employers</h3>
              <p className="feature-description"style={{fontSize:largeText}}>Over 10,000 companies post their vacancies on our platform regularly.</p>
            </div>
            <div 
              className="feature"
              {...createSpeechHandlers("Mobile Friendly. Search and apply for jobs on the go with our mobile-optimized platform.")}
            >
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Friendly</h3>
              <p className="feature-description" style={{fontSize:largeText}}>Search and apply for jobs on the go with our mobile-optimized platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter" style={{backgroundColor:bgColor}}>
        <div className="container">
          <h2 
            className="newsletter-title"
            {...createSpeechHandlers("Stay Updated with New Opportunities")}
          >
            Stay Updated with New Opportunities
          </h2>
          <p 
            className="newsletter-description"
            {...createSpeechHandlers("Subscribe to our newsletter and receive personalized job recommendations directly to your inbox.")}
            style={{fontSize:largeText}}>
            Subscribe to our newsletter and receive personalized job recommendations directly to your inbox.
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
              {...createSpeechHandlers("Enter your email address to subscribe")}
            />
            <button 
              className="newsletter-btn"
              {...createSpeechHandlers("Subscribe to our newsletter")}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div 
              className="footer-about"
              {...createSpeechHandlers("JobConnect. Connecting talented professionals with their dream careers since 2018.")}
            >
              <h3 className="footer-title">JobConnect</h3>
              <p className="footer-description"style={{fontSize:largeText}}>Connecting talented professionals with their dream careers since 2018.</p>
            </div>
            <div className="footer-links">
              <h4 
                className="footer-heading"
                {...createSpeechHandlers("For Job Seekers")}
              >
                For Job Seekers
              </h4>
              <ul className="footer-list">
                <li><a href="#" {...createSpeechHandlers("Browse Jobs")}>Browse Jobs</a></li>
                <li><a href="#" {...createSpeechHandlers("Create Resume")}>Create Resume</a></li>
                <li><a href="#" {...createSpeechHandlers("Job Alerts")}>Job Alerts</a></li>
                <li><a href="#" {...createSpeechHandlers("Career Resources")}>Career Resources</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4 
                className="footer-heading"
                {...createSpeechHandlers("For Employers")}
              >
                For Employers
              </h4>
              <ul className="footer-list">
                <li><a href="#" {...createSpeechHandlers("Post a Job")}>Post a Job</a></li>
                <li><a href="#" {...createSpeechHandlers("Browse Candidates")}>Browse Candidates</a></li>
                <li><a href="#" {...createSpeechHandlers("Recruiting Solutions")}>Recruiting Solutions</a></li>
                <li><a href="#" {...createSpeechHandlers("Pricing Plans")}>Pricing Plans</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4 
                className="footer-heading"
                {...createSpeechHandlers("Contact Us")}
              >
                Contact Us
              </h4>
              <ul className="footer-list">
                <li {...createSpeechHandlers("Email: support at jobconnect dot com")}>📧 support@jobconnect.com</li>
                <li {...createSpeechHandlers("Phone: 555-123-4567")}>📞 (555) 123-4567</li>
                <li {...createSpeechHandlers("Address: 123 Job Street, Employment City")}>📍 123 Job Street, Employment City</li>
              </ul>
            </div>
          </div>
          <div 
            className="footer-bottom"
            {...createSpeechHandlers("Copyright 2025 JobConnect. All rights reserved.")}
          >
            <p>© 2025 JobConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;