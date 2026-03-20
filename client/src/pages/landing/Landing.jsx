import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Shield, Zap, Globe, CheckCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb-1" />
        <div className="hero-bg-orb hero-orb-2" />
        <div className="hero-content">
          <span className="hero-badge">🚀 #1 Campus Placement Platform</span>
          <h1>Your Career Journey<br /><span className="gradient-text">Starts Here</span></h1>
          <p className="hero-subtitle">
            Connect with top recruiters, discover dream jobs, and land your perfect placement — all in one powerful platform.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to={`/${user.role}/dashboard`} className="btn btn-primary btn-lg" id="hero-dashboard">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="hero-register">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login">
                  Sign In
                </Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong><span>Active Jobs</span></div>
            <div className="hero-stat"><strong>200+</strong><span>Companies</span></div>
            <div className="hero-stat"><strong>10K+</strong><span>Students</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Why Choose <span className="gradient-text">JobConnect</span>?</h2>
        <div className="features-grid">
          {[
            { icon: Briefcase, title: 'Smart Job Matching', desc: 'AI-powered recommendations matching your skills to perfect opportunities.' },
            { icon: Shield, title: 'Verified Recruiters', desc: 'Every recruiter is admin-vetted, ensuring safe and legitimate job postings.' },
            { icon: Zap, title: 'Instant Applications', desc: 'Apply with one click using your pre-built profile and uploaded resume.' },
            { icon: Users, title: 'For Students & Recruiters', desc: 'Dedicated dashboards tailored for both job seekers and hiring managers.' },
            { icon: Globe, title: 'Multi-Location Jobs', desc: 'Browse full-time, remote, internship, and contract roles across cities.' },
            { icon: CheckCircle, title: 'Track Everything', desc: 'Real-time application status tracking from applied to offered.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="feature-card card">
              <div className="feature-icon"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card card-glass">
          <h2>Ready to Launch Your Career?</h2>
          <p>Join thousands of students already finding their dream placements.</p>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-register">Create Free Account</Link>
        </div>
      </section>

      <style>{`
        .landing { padding-top: 0; }
        .hero {
          position: relative; overflow: hidden;
          min-height: calc(100vh - var(--navbar-height));
          display: flex; align-items: center; justify-content: center;
          padding: 4rem 2rem;
        }
        .hero-bg-orb {
          position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.15;
        }
        .hero-orb-1 {
          width: 500px; height: 500px; background: #7c3aed;
          top: -100px; right: -100px;
        }
        .hero-orb-2 {
          width: 400px; height: 400px; background: #3b82f6;
          bottom: -80px; left: -80px;
        }
        .hero-content {
          text-align: center; max-width: 720px; position: relative; z-index: 1;
          animation: fadeIn 0.8s ease;
        }
        .hero-badge {
          display: inline-block; padding: 0.375rem 1rem;
          background: rgba(124, 58, 237, 0.12); color: #a78bfa;
          border-radius: 100px; font-size: 0.813rem; font-weight: 600;
          margin-bottom: 1.5rem; border: 1px solid rgba(124, 58, 237, 0.2);
        }
        .hero h1 {
          font-size: 3.5rem; font-weight: 800; line-height: 1.15;
          color: var(--text-heading); margin-bottom: 1.25rem;
        }
        .gradient-text {
          background: var(--accent-gradient); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.125rem; color: var(--text-secondary);
          max-width: 560px; margin: 0 auto 2rem; line-height: 1.7;
        }
        .hero-actions { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 3rem; }
        .hero-stats {
          display: flex; gap: 3rem; justify-content: center;
        }
        .hero-stat strong {
          display: block; font-size: 1.75rem; font-weight: 700; color: var(--text-heading);
        }
        .hero-stat span { font-size: 0.813rem; color: var(--text-muted); }
        .features-section {
          padding: 5rem 2rem; max-width: 1200px; margin: 0 auto;
        }
        .section-title {
          text-align: center; font-size: 2rem; font-weight: 700;
          color: var(--text-heading); margin-bottom: 3rem;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .feature-card { text-align: center; padding: 2rem 1.5rem; }
        .feature-card:hover { transform: translateY(-4px); }
        .feature-icon {
          width: 56px; height: 56px; margin: 0 auto 1rem;
          background: var(--accent-gradient); border-radius: 14px;
          display: flex; align-items: center; justify-content: center; color: white;
        }
        .feature-card h3 { font-size: 1.125rem; color: var(--text-heading); margin-bottom: 0.5rem; }
        .feature-card p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; }
        .cta-section { padding: 3rem 2rem 5rem; max-width: 800px; margin: 0 auto; }
        .cta-card { text-align: center; padding: 3rem 2rem; }
        .cta-card h2 { font-size: 1.75rem; font-weight: 700; color: var(--text-heading); margin-bottom: 0.5rem; }
        .cta-card p { color: var(--text-secondary); margin-bottom: 1.5rem; }
        @media (max-width: 768px) {
          .hero h1 { font-size: 2.25rem; }
          .hero-stats { gap: 1.5rem; }
          .hero-actions { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
}
