"use client";

import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface FooterLink {
  label: string;
  href: string;
}

interface StatItem {
  value: string;
  description: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const quickLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Crop advisor", href: "/crop-recommendation" },
  { label: "Disease detection", href: "/disease-detection" },
  { label: "Weather forecast", href: "/weather" },
  { label: "Market prices", href: "/Market" },
  { label: "About us", href: "/about-us" },
];

const services: FooterLink[] = [
  { label: "Soil analysis", href: "/services/soil-analysis" },
  { label: "Irrigation planning", href: "/services/irrigation" },
  { label: "Pest management", href: "/services/pest-management" },
  { label: "Fertilizer guide", href: "/services/fertilizer" },
  { label: "Yield prediction", href: "/services/yield-prediction" },
  { label: "Expert consultation", href: "/services/consultation" },
];

const stats: StatItem[] = [
  { value: "50K+", description: "Farmers helped" },
  { value: "120+", description: "Crop varieties" },
  { value: "98%", description: "Prediction accuracy" },
  { value: "24/7", description: "AI support" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Cookie settings", href: "/cookies" },
];

// ── SVG Icons ──────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 12.64 19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LeafIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 22c1.25-1.25 2.87-1.99 4.6-2.17 1.17-.12 2.57.18 3.9.57C12 21 15.5 22 18 20.5c3-1.75 4-5 4-9.5 0-4-4-9-10-9C6 2 2 8 2 12c0 2 .5 4 1.5 5.5" />
    <path d="M10 14c1 .67 2 1 3 1" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 11.5 8a12.8 12.8 0 0 1-9.29-4.71 4.52 4.52 0 0 0 1.4 6.03A4.49 4.49 0 0 1 1.64 9v.06a4.52 4.52 0 0 0 3.62 4.43 4.54 4.54 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.13A9.05 9.05 0 0 1 1 19.54a12.77 12.77 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84l-.01-.58A9.17 9.17 0 0 0 23 3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

// ── Sub-components ─────────────────────────────────────────────────────────
const SocialButton: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({
  href,
  label,
  children,
}) => (
  <a
    href={href}
    aria-label={label}
    className="social-btn"
    rel="noopener noreferrer"
    target="_blank"
  >
    {children}
  </a>
);

const FooterLinkItem: React.FC<{ link: FooterLink }> = ({ link }) => (
  <li>
    <a href={link.href} className="footer-link">
      <span className="arrow-icon" aria-hidden="true">
        <ArrowIcon />
      </span>
      {link.label}
    </a>
  </li>
);

const ContactRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <div className="contact-row">
    <span className="contact-icon">{icon}</span>
    <span className="contact-text">{children}</span>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const AgriFooter: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubscribe();
  };

  return (
    <>
      <style>{`
        .agri-footer {
          background: #1a2e1a;
          color: #c8e6c9;
          font-family: 'Segoe UI', system-ui, sans-serif;
          width: 100%;
        }

        /* ── Main grid ── */
        .footer-main {
          background: #2e4a2e;
          padding: 3rem 2.5rem 2.5rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
          align-items: start;
        }

        /* ── Brand ── */
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
          text-decoration: none;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: #4caf50;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .brand-name {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          line-height: 1.1;
        }
        .brand-tagline {
          font-size: 11px;
          color: #81c784;
          letter-spacing: 0.06em;
          margin: 0;
        }
        .brand-desc {
          font-size: 13px;
          color: #a5d6a7;
          line-height: 1.75;
          margin: 0 0 1.25rem;
          max-width: 270px;
        }

        /* ── Social ── */
        .social-row {
          display: flex;
          gap: 8px;
        }
        .social-btn {
          width: 32px;
          height: 32px;
          background: #3a5c3a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #81c784;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        .social-btn:hover {
          background: #4caf50;
          color: #fff;
          transform: translateY(-2px);
        }

        /* ── Column heading ── */
        .col-heading {
          font-size: 11px;
          font-weight: 600;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 1rem;
        }

        /* ── Links list ── */
        .links-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .footer-link {
          font-size: 13px;
          color: #a5d6a7;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: color 0.2s, gap 0.2s;
        }
        .footer-link:hover {
          color: #ffffff;
          gap: 10px;
        }
        .arrow-icon {
          color: #4caf50;
          font-size: 10px;
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }
        .footer-link:hover .arrow-icon {
          transform: translateX(2px);
        }

        /* ── Contact ── */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 1.25rem;
        }
        .contact-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .contact-icon {
          color: #4caf50;
          margin-top: 2px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .contact-text {
          font-size: 12px;
          color: #a5d6a7;
          line-height: 1.65;
        }

        /* ── Newsletter ── */
        .newsletter-label {
          font-size: 12px;
          color: #81c784;
          margin: 0 0 8px;
        }
        .newsletter-row {
          display: flex;
          gap: 6px;
        }
        .newsletter-input {
          flex: 1;
          min-width: 0;
          font-size: 12px;
          padding: 8px 10px;
          background: #1a2e1a;
          border: 0.5px solid #4caf50;
          border-radius: 6px;
          color: #c8e6c9;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .newsletter-input::placeholder { color: #558b2f; }
        .newsletter-input:focus {
          border-color: #66bb6a;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.18);
        }
        .subscribe-btn {
          background: #4caf50;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
          transition: background 0.2s, transform 0.15s;
        }
        .subscribe-btn:hover { background: #43a047; transform: scale(0.98); }
        .subscribed-msg {
          font-size: 12px;
          color: #81c784;
          padding: 8px 0;
        }

        /* ── Stats bar ── */
        .stats-bar {
          background: #243c24;
          padding: 1rem 2.5rem;
          display: flex;
          gap: 0;
          align-items: center;
          border-top: 0.5px solid #3a5c3a;
          border-bottom: 0.5px solid #3a5c3a;
          flex-wrap: wrap;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.5rem 2rem 0.5rem 0;
        }
        .stat-item:not(:first-child) {
          padding-left: 2rem;
          border-left: 0.5px solid #3a5c3a;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #4caf50;
          line-height: 1;
        }
        .stat-desc {
          font-size: 11px;
          color: #81c784;
          line-height: 1.4;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          background: #111f11;
          padding: 0.9rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .copyright {
          font-size: 12px;
          color: #66bb6a;
          margin: 0;
        }
        .legal-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .legal-links a {
          font-size: 12px;
          color: #66bb6a;
          text-decoration: none;
          transition: color 0.2s;
        }
        .legal-links a:hover { color: #a5d6a7; }
        .made-with {
          font-size: 12px;
          color: #4caf50;
          margin: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 600px) {
          .footer-main {
            grid-template-columns: 1fr;
            padding: 2rem 1.25rem;
          }
          .stats-bar {
            padding: 0.75rem 1.25rem;
            gap: 1rem;
          }
          .stat-item {
            padding: 0.25rem 0.75rem;
          }
          .stat-item:not(:first-child) {
            padding-left: 0.75rem;
          }
          .footer-bottom {
            padding: 0.75rem 1.25rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>

      <footer className="agri-footer" role="contentinfo">
        {/* ── Main grid ── */}
        <div className="footer-main">

          {/* Brand */}
          <div>
            <a href="/" className="brand-logo" aria-label="AI Agri Advisor home">
              <div className="logo-icon">
                <LeafIcon />
              </div>
              <div>
                <p className="brand-name">My Agri App</p>
                <p className="brand-tagline">Smart Farming, Smarter Future</p>
              </div>
            </a>
            <p className="brand-desc">
              Empowering farmers with AI-driven insights for crop planning,
              disease detection, weather forecasting, and sustainable agriculture.
            </p>
            <div className="social-row">
              <SocialButton href="https://facebook.com" label="Facebook">
                <FacebookIcon />
              </SocialButton>
              <SocialButton href="https://twitter.com" label="Twitter">
                <TwitterIcon />
              </SocialButton>
              <SocialButton href="https://instagram.com" label="Instagram">
                <InstagramIcon />
              </SocialButton>
              <SocialButton href="https://linkedin.com" label="LinkedIn">
                <LinkedInIcon />
              </SocialButton>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <p className="col-heading">Quick links</p>
            <ul className="links-list">
              {quickLinks.map((link) => (
                <FooterLinkItem key={link.href} link={link} />
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Our services">
            <p className="col-heading">Our services</p>
            <ul className="links-list">
              {services.map((link) => (
                <FooterLinkItem key={link.href} link={link} />
              ))}
            </ul>
          </nav>

          {/* Contact + Newsletter */}
          <div>
            <p className="col-heading">Contact us</p>
            <div className="contact-list">
              <ContactRow icon={<LocationIcon />}>
                Manhana, near MPGI, Kanpur
                <br />
                Uttar Pradesh, India
              </ContactRow>
              <ContactRow icon={<PhoneIcon />}>+91 98765 43210</ContactRow>
              <ContactRow icon={<MailIcon />}>support@agriadvisor.in</ContactRow>
            </div>

            {/* Newsletter */}
            <p className="newsletter-label">Subscribe for farm tips</p>
            {subscribed ? (
              <p className="subscribed-msg">Thanks for subscribing!</p>
            ) : (
              <div className="newsletter-row">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Email address for newsletter"
                />
                <button
                  className="subscribe-btn"
                  onClick={handleSubscribe}
                  aria-label="Subscribe to newsletter"
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="stats-bar" role="list" aria-label="Key statistics">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.description} role="listitem">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-desc">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} AI Agri Advisor. All rights reserved.
          </p>
          <ul className="legal-links" aria-label="Legal links">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <p className="made-with">Made with care for Indian farmers</p>
        </div>
      </footer>
    </>
  );
};

export default AgriFooter;