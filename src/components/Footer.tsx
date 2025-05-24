
import React from 'react';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">TaskMaster Pro</h3>
            <p className="text-white/80 mb-4 max-w-md">
              Advanced task management and productivity suite designed to help you organize, 
              prioritize, and complete your tasks efficiently. Built with modern web technologies 
              for optimal performance across all devices.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="mailto:contact@example.com" 
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-white/80 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#tasks" className="hover:text-white transition-colors">All Tasks</a></li>
              <li><a href="#calendar" className="hover:text-white transition-colors">Calendar</a></li>
              <li><a href="#analytics" className="hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-white/80">
              <li>Priority Management</li>
              <li>Deadline Tracking</li>
              <li>Smart Notifications</li>
              <li>Progress Analytics</li>
              <li>Cross-Device Sync</li>
              <li>Responsive Design</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-300 animate-pulse" />
              <span>by</span>
              <strong className="text-white">Gali Vamsee Krishna</strong>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-white/60">
              <span>© 2024 TaskMaster Pro. All rights reserved.</span>
              <div className="flex space-x-4">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#support" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Rich Footer */}
        <div className="mt-6 text-xs text-white/50 text-center">
          <p>
            TaskMaster Pro - Professional Task Management Software | Priority-Based Task Organization | 
            Deadline Management System | Productivity Enhancement Tool | Cross-Platform Task Tracker | 
            Smart Notification System | Real-time Progress Monitoring | Advanced Task Analytics
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
