import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { name: 'X (Twitter)', href: 'https://twitter.com', icon: '𝕏' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
    { name: 'Discord', href: 'https://discord.com', icon: '💬' },
    { name: 'Reddit', href: 'https://reddit.com', icon: '🤖' }
  ];

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground text-sm">Follow us:</span>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-lg"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Pricing Link */}
          <div className="flex items-center gap-4">
            <Link 
              to="/pricing" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
            >
              Pricing
            </Link>
            <span className="text-muted-foreground text-sm">
              © 2024 Prompt2App. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;