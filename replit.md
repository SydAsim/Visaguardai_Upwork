# VisaGuardAI

## Overview

VisaGuardAI is a modern SaaS application that helps users scan their online presence for potential visa application risks. The platform analyzes social media accounts and provides risk assessments to help users identify content that might negatively impact their visa applications. Built as a client-side application using HTML5, Tailwind CSS, and Vanilla JavaScript, it features user authentication, a comprehensive dashboard, payment integration, and responsive design with dark/light theme support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
**Client-Side SPA**: Built entirely with vanilla HTML5, CSS3, and JavaScript without any frameworks. Uses a multi-page approach with separate HTML files for different sections (landing, login, dashboard, payment).

**Styling Framework**: Tailwind CSS via CDN for rapid UI development and consistent design system. Custom CSS animations and themes are layered on top for enhanced user experience.

**State Management**: Browser LocalStorage handles all client-side data persistence including user authentication state, theme preferences, user profiles, and payment status.

### Authentication System
**Client-Side Authentication**: Simple email/password authentication system stored in LocalStorage. Includes user registration, login/logout functionality, and session persistence.

**Access Control**: Route protection using JavaScript to redirect unauthorized users to login page. Dashboard access requires valid authentication state.

### Data Storage
**LocalStorage Schema**: 
- User accounts with email, password, profile data, and payment status
- Connected social media accounts tracking
- Theme preferences and UI state
- Analysis results and risk assessments

### User Interface Design
**Responsive Design**: Mobile-first approach using Tailwind's responsive utilities. Fully functional across desktop, tablet, and mobile devices.

**Theme System**: Persistent dark/light mode toggle with system preference detection. Theme state maintained across sessions and page refreshes.

**Component Architecture**: Modular JavaScript classes for different functional areas (AuthManager, Dashboard, ThemeManager) promoting code reusability and maintainability.

### Application Flow
**Freemium Model**: Free tier provides limited analysis results, paid tier unlocks full analytics and features. Payment status tracked in user profile data.

**Progressive Enhancement**: JavaScript-driven interactions with graceful fallbacks. CSS animations and transitions provide smooth user experience.

### Security Considerations
**Client-Side Limitations**: All data stored in browser LocalStorage - suitable for demo/prototype but not production security. No server-side validation or encryption.

## External Dependencies

### CDN Resources
- **Tailwind CSS**: Main styling framework via CDN
- **Font Awesome 6.0.0**: Icon library for UI elements
- **Google Fonts**: Typography (if used)

### Payment Integration
**Dummy Payment System**: Simulated payment flow for demonstration purposes. Updates user payment status in LocalStorage upon completion.

### Social Media Integration
**Placeholder Connections**: Mock social media account linking (Instagram, TikTok, LinkedIn, Twitter) for demonstration of analysis features.

### Browser APIs
- **LocalStorage API**: Primary data persistence layer
- **Window.matchMedia**: System theme preference detection
- **DOM API**: All user interface interactions and updates