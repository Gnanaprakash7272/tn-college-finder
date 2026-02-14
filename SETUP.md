# College Finder Tamil Nadu - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation Steps

1. **Clone/Extract the Project**
   ```bash
   cd "d:\mini project1"
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cd ../server
   cp .env.example .env
   
   # Edit .env with your MongoDB connection string
   # MONGODB_URI=mongodb://localhost:27017/college_finder_tn
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Then run the seed script to populate sample data
   npm run seed
   ```

5. **Start the Application**
   ```bash
   # From root directory
   npm run dev
   ```
   
   This will start:
   - Backend server at http://localhost:5000
   - Frontend app at http://localhost:3000

## 📁 Project Structure

```
college-finder-tamilnadu/
├── server/                 # Backend Node.js application
│   ├── controllers/        # API controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── scripts/           # Database scripts
│   └── index.js          # Server entry point
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/           # Static files
├── database/              # Database schemas and data
└── docs/                 # Documentation
```

## 🗄️ Database Schema

### Collections
1. **Colleges** - Engineering college information
2. **Courses** - Course details and fees
3. **Cutoffs** - Historical and predicted cutoffs
4. **Placements** - Placement statistics
5. **Notifications** - Alert system
6. **Predictions** - ML prediction results

### Key Features
- Complete college profiles with NIRF rankings
- Course-wise details with fee structures
- Community-wise cutoffs (OC, BC, BCM, MBC, SC, SCA, ST)
- Placement statistics and salary information
- Smart search with autocomplete
- College comparison tool
- ML-based cutoff predictions
- Multi-language support (Tamil/English)

## 🔧 API Endpoints

### Colleges
- `GET /api/colleges` - Get all colleges with filters
- `GET /api/colleges/:id` - Get college by ID
- `GET /api/colleges/search` - Search colleges

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/college/:collegeId` - Get courses by college
- `GET /api/courses/fee-range` - Get courses by fee range

### Cutoffs
- `GET /api/cutoffs` - Get cutoffs with filters
- `GET /api/cutoffs/latest` - Get latest cutoffs
- `GET /api/cutoffs/within-range` - Find colleges within cutoff range

### Placements
- `GET /api/placements` - Get placement data
- `GET /api/placements/statistics` - Get placement statistics

### Search & Comparison
- `GET /api/search` - Global search
- `POST /api/comparison/colleges` - Compare colleges
- `GET /api/predictions/cutoff` - Get cutoff predictions

## 🌐 Frontend Features

### Pages
- **Home** - Landing page with search
- **Colleges** - Browse colleges with filters
- **Courses** - Browse courses with details
- **Comparison** - Side-by-side college comparison
- **Search** - Advanced search functionality
- **Cutoffs** - Community-wise cutoff information
- **Placements** - Placement statistics
- **About** - About the platform
- **Contact** - Contact information

### Components
- **Header** - Navigation with search
- **Sidebar** - Quick navigation menu
- **Footer** - Links and information
- **Language Toggle** - Tamil/English switcher

### Key Features
- Responsive design for all devices
- Tamil language support
- Real-time search suggestions
- Interactive comparison tables
- Animated UI transitions
- Error handling and loading states

## 🎯 Sample Data

The seed script creates:
- 3 sample colleges (Anna University, PSG Tech, MIT Chennai)
- 4 courses per college (CSE, ECE, MECH, IT)
- Historical cutoff data for 2 years
- Placement statistics for 2 years
- Complete college and course information

## 🔍 Testing the Application

1. **Browse Colleges**
   - Visit http://localhost:3000/colleges
   - Use filters for district, type, NBA accreditation
   - Search by college name

2. **View College Details**
   - Click on any college card
   - View courses, cutoffs, and placements
   - Check NIRF rankings and accreditation

3. **Compare Colleges**
   - Go to http://localhost:3000/comparison
   - Select 2-3 colleges to compare
   - View side-by-side comparison

4. **Search Functionality**
   - Use the search bar in header
   - Try advanced search with filters
   - Test autocomplete suggestions

5. **Language Toggle**
   - Click the language button in header
   - Switch between Tamil and English
   - Verify all text translations

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
cd server
npm start
```

### Frontend Deployment
```bash
# Build React app
cd client
npm run build
```

### Environment Variables
- `NODE_ENV` - Set to 'production'
- `MONGODB_URI` - Production MongoDB connection
- `JWT_SECRET` - Secret key for authentication
- `REACT_APP_API_URL` - Frontend API URL

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## 🔧 Customization

### Adding New Colleges
1. Use the admin API or directly add to database
2. Follow the college schema structure
3. Include all required fields

### Adding New Courses
1. Link to existing college
2. Complete course information
3. Add fee structure and accreditation

### Updating Cutoffs
1. Import latest TNEA cutoff data
2. Use the cutoff import script
3. Verify community-wise data

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify MongoDB service status

2. **Port Already in Use**
   - Kill processes using ports 3000/5000
   - Change ports in package.json

3. **Dependencies Installation Error**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json
   - Run `npm install` again

4. **Frontend Not Loading**
   - Check if backend is running
   - Verify API endpoints are accessible
   - Check browser console for errors

### Getting Help

1. Check the console logs for errors
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check network connectivity

## 📊 Performance Optimization

### Backend
- Database indexes for faster queries
- Pagination for large datasets
- Response caching for static data
- API rate limiting

### Frontend
- Code splitting for faster loading
- Image optimization
- Lazy loading for large lists
- Service worker for caching

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on APIs
- Secure password hashing
- JWT token authentication

## 📈 Future Enhancements

1. **Real-time Notifications** - WebSocket integration
2. **Advanced Analytics** - Google Analytics integration
3. **Mobile App** - React Native application
4. **Chatbot Support** - AI-powered assistance
5. **Video Content** - College tour videos
6. **Alumni Network** - Connect with alumni
7. **Scholarship Information** - Financial aid details
8. **Hostel Information** - Accommodation details

## 📞 Support

For technical support:
- Email: support@collegefinder.tn
- GitHub Issues: Create an issue in the repository
- Documentation: Check the /docs folder

---

**Built with ❤️ for Tamil Nadu Engineering Students**
