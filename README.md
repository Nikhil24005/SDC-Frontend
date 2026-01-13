# SDC Frontend

Software Developers Community (SDC) Website Frontend Repository

## 📋 Overview

This is the frontend application for the Software Developers Community website, built with React and Vite. The application features both public-facing pages and an admin dashboard for content management.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: CSS
- **Linting**: ESLint

## 📁 Project Structure

```
SDCFrontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API integration layer
│   │   ├── Admin/      # Admin API endpoints
│   │   └── Public/     # Public API endpoints
│   ├── assets/         # Images, icons, logos, videos
│   ├── auth/           # Authentication context and routes
│   ├── components/     # Reusable components
│   ├── layout/         # Layout components
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin dashboard pages
│   │   └── public/     # Public-facing pages
│   ├── routes/         # Route configuration
│   └── utils/          # Utility functions
└── vite.config.js      # Vite configuration
```

## 🎯 Features

### Public Pages
- **Home**: Hero section, featured projects, services, testimonials
- **About**: Overview, team, partners, golden alumni
- **Services**: Service offerings and details
- **Work**: Project showcase
- **People**: Team members, faculty, alumni
- **Career**: Career opportunities and application form
- **Gallery**: Photo gallery
- **Contact**: Contact form

### Admin Dashboard
- **Authentication**: Secure login system
- **Profile Management**: Admin profile settings
- **Content Management**:
  - People (Team, Faculty, Alumni)
  - Projects
  - Testimonials
  - Gallery
  - FAQ
  - Career applications
  - Contact messages
- **Services Management**: Update service offerings

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SDCFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add necessary API endpoints and configuration.

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (default Vite port)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔑 Authentication

The application uses a protected route system for admin pages. Authentication is managed through:
- `AuthContext.jsx`: Authentication state management
- `PrivateRoute.jsx`: Protected route wrapper
- Cookie-based authentication

## 🌐 API Integration

All API calls are centralized in the `src/api` directory:
- **Admin APIs**: CRUD operations for content management
- **Public APIs**: Read-only endpoints for public content
- **Configuration**: `axios.js` and `config.js` for API setup

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop
- Tablet
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

[Add your license information here]

## 👥 Team

Software Developers Community

## 📧 Contact

For questions or support, please use the contact form on the website or reach out to the SDC team.

---

Built with ❤️ by the Software Developers Community
