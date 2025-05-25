# YouTube Link Tracker

A modern web application for creating, managing, and tracking short links for YouTube videos. Built with Node.js, Express, and EJS, this application provides a user-friendly interface for generating short URLs and monitoring their performance through detailed analytics.

## 🌟 Features

### 1. Link Management
- **Short Link Generation**: Convert long YouTube URLs into short, manageable links
- **YouTube URL Validation**: Ensures only valid YouTube URLs are processed
- **Copy to Clipboard**: One-click copying of generated links
- **Link History**: View and manage all created links in one place

### 2. Analytics & Tracking
- **Click Tracking**: Monitor total clicks for each link
- **Unique Visitor Tracking**: Count distinct IP addresses accessing each link
- **Timeline Analysis**: Track when links are accessed
- **Performance Dashboard**: Quick overview of link performance metrics

### 3. User Interface
- **Modern Design**: Clean, responsive interface using Tailwind CSS
- **Real-time Updates**: Instant feedback on link creation and statistics
- **Interactive Elements**: Copy buttons, clickable links, and intuitive navigation
- **Mobile Responsive**: Works seamlessly across all device sizes

## 🛠️ Technical Implementation

### Data Storage
```javascript
// Using local JSON storage for data persistence
const DATA_FILE = path.join(__dirname, '../../data/links.json');

class DataStore {
    static async getAllLinks() {
        const links = await fs.readJson(DATA_FILE);
        return links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}
```

### Link Generation
```javascript
// Unique short code generation using shortid
const shortCode = shortid.generate();
const link = await DataStore.createLink({
    originalUrl: url,
    shortCode,
    clicks: [],
    createdAt: new Date().toISOString()
});
```

### Analytics Processing
```javascript
static async getLinkStats(link) {
    return {
        ...link,
        totalClicks: link.clicks.length,
        lastClick: link.clicks.length > 0 
            ? new Date(Math.max(...link.clicks.map(c => new Date(c.timestamp))))
            : null,
        uniqueIPs: new Set(link.clicks.map(c => c.ip)).size
    };
}
```

## 📊 Key Metrics Tracked

1. **Link Statistics**
   - Total number of clicks
   - Unique visitor count
   - Last click timestamp
   - Creation date and time

2. **Aggregate Analytics**
   - Total links created
   - Overall click count
   - Total unique visitors
   - Most popular links

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-link-tracker.git
cd youtube-link-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the application at `http://localhost:3000`

## 🏗️ Project Structure

```
youtube-link-tracker/
├── data/                  # JSON data storage
├── src/
│   ├── app.js            # Main application file
│   ├── routes/           # Route handlers
│   │   └── linkRoutes.js # Link management routes
│   ├── services/         # Business logic
│   │   └── dataStore.js  # Data management service
│   └── views/            # EJS templates
│       ├── index.ejs     # Home page
│       ├── history.ejs   # Link history
│       └── layout.ejs    # Base template
├── package.json          # Project configuration
└── README.md            # Project documentation
```

## 🔒 Security Features

1. **Input Validation**
   - YouTube URL format validation
   - XSS protection through EJS templating
   - Sanitized user inputs

2. **Data Protection**
   - Local storage with JSON file
   - Secure click tracking
   - IP address anonymization

## 🎨 UI/UX Features

1. **Dashboard Components**
   - Quick stats cards
   - Recent links list
   - Interactive charts
   - Copy-to-clipboard functionality

2. **Navigation**
   - Intuitive menu structure
   - Clear call-to-action buttons
   - Responsive design elements

## 🔄 Workflow

1. **Link Creation**
   - User enters YouTube URL
   - System validates URL format
   - Generates unique short code
   - Creates tracking link

2. **Link Management**
   - View all created links
   - Access detailed statistics
   - Copy or share links
   - Monitor performance

3. **Analytics Processing**
   - Track click events
   - Calculate unique visitors
   - Generate performance reports
   - Update real-time statistics

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, Tailwind CSS
- **Data Storage**: Local JSON file
- **Utilities**: shortid, fs-extra
- **Development**: nodemon

## 📈 Performance Considerations

1. **Data Management**
   - Efficient JSON file operations
   - Optimized sorting and filtering
   - Cached statistics calculation

2. **Response Time**
   - Quick link generation
   - Fast redirect handling
   - Efficient data retrieval

## 🔜 Future Enhancements

1. **Planned Features**
   - User authentication
   - Custom short URLs
   - Advanced analytics
   - API integration

2. **Potential Improvements**
   - Database integration
   - Real-time updates
   - Enhanced security
   - Additional analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Abhishek - abhisheknodejsdeveloper@gmail.com

## 🙏 Acknowledgments

- Express.js community
- Tailwind CSS team
- EJS template engine
- All contributors and users
  
![screencapture-localhost-3000-2025-05-26-00_44_36](https://github.com/user-attachments/assets/22d1ae72-3a45-426c-babc-c0add6271c3d)

![screencapture-localhost-3000-create-2025-05-26-00_42_57](https://github.com/user-attachments/assets/b2ee779c-76fe-46c7-ad6c-44f4f1239451)

![screencapture-localhost-3000-stats-cKPqnuji-2025-05-26-00_44_10](https://github.com/user-attachments/assets/1771ad5c-1355-44d7-8185-6951cd61eaaf)

![Screenshot 2025-05-26 004953](https://github.com/user-attachments/assets/d5f79f3c-9c87-4bb2-a548-e4faa3e740f8)

 
