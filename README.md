# College Finder - Smart Engineering College Finder for Tamil Nadu

A comprehensive platform to help 12th standard students choose the right engineering college and course in Tamil Nadu for TNEA counselling.

## 🎯 Features

- **Complete College Profiles**: Detailed information about all engineering colleges in Tamil Nadu
- **Course-wise Details**: Fees, placement statistics, and cutoff information for each course
- **Community-wise Cutoffs**: Support for all Tamil Nadu communities (OC, BC, BCM, MBC, SC, SCA, ST)
- **Smart Search & Discovery**: Advanced search with autocomplete and fuzzy matching
- **College Comparison**: Side-by-side comparison of multiple colleges
- **Advanced Filters**: Filter by location, fees, cutoff, college type, and more
- **ML-based Predictions**: Expected cutoff predictions using machine learning
- **Multi-language Support**: Tamil and English language support
- **Notification System**: Alerts for counselling dates and cutoff updates

## 🏗️ Architecture

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Tailwind CSS, Material-UI
- **Database**: MongoDB with scalable schema design
- **ML Model**: Python-based cutoff prediction system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Python (for ML predictions)

### Installation

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

This will start:
- Backend server at http://localhost:5000
- Frontend app at http://localhost:3000

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Colleges**: College information, accreditation, rankings
- **Courses**: Course details, intake capacity, fees
- **Cutoffs**: Historical and predicted cutoff data by community
- **Placements**: Placement statistics and salary information
- **Notifications**: Alert system for counselling updates

## 🔧 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- RESTful APIs
- File upload handling

### Frontend
- React.js with React Router
- Tailwind CSS for styling
- Material-UI components
- Axios for API calls
- React Query for data management

### ML & Analytics
- Python with scikit-learn
- Pandas for data processing
- Historical cutoff analysis
- Trend prediction algorithms

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices
- Rural and government school students

## 🌐 Multi-language Support

- Tamil language interface
- English language interface
- Easy language toggle
- Localized content and labels

## 📈 Features Overview

### College Profiles
- Complete college information
- NBA accreditation status
- NIRF rankings
- Contact details and websites
- TNEA counselling codes

### Course Information
- All engineering branches
- Intake capacity
- Fee structure
- Placement statistics
- Historical cutoffs

### Search & Discovery
- College-wise search
- Course-wise search
- Autocomplete suggestions
- Fuzzy search capabilities
- Advanced filtering

### Comparison Tools
- Side-by-side college comparison
- Multiple selection (2-3 colleges)
- Detailed comparison metrics
- Visual comparison charts

### Predictions & Analytics
- ML-based cutoff predictions
- Trend analysis
- Expected cutoff ranges
- Probability calculations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For support and queries:
- Email: support@collegefinder.tn
- Website: www.collegefinder.tn

---

**Empowering Tamil Nadu students to make informed engineering career choices** 🎓
