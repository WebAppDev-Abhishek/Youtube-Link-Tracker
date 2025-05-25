const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/links.json');

// Ensure data directory exists
fs.ensureDirSync(path.dirname(DATA_FILE));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeJsonSync(DATA_FILE, []);
}

class DataStore {
    static async getAllLinks() {
        try {
            const links = await fs.readJson(DATA_FILE);
            // Sort links by creation date, newest first
            return links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error reading links:', error);
            return [];
        }
    }

    static async getLinkByShortCode(shortCode) {
        try {
            const links = await this.getAllLinks();
            return links.find(link => link.shortCode === shortCode);
        } catch (error) {
            console.error('Error finding link:', error);
            return null;
        }
    }

    static async createLink(linkData) {
        try {
            const links = await this.getAllLinks();
            const newLink = {
                ...linkData,
                clicks: [],
                createdAt: new Date().toISOString()
            };
            links.push(newLink);
            await fs.writeJson(DATA_FILE, links, { spaces: 2 });
            return newLink;
        } catch (error) {
            console.error('Error creating link:', error);
            throw error;
        }
    }

    static async addClick(shortCode, clickData) {
        try {
            const links = await this.getAllLinks();
            const linkIndex = links.findIndex(link => link.shortCode === shortCode);
            
            if (linkIndex === -1) {
                return null;
            }

            links[linkIndex].clicks.push({
                ...clickData,
                timestamp: new Date().toISOString()
            });

            await fs.writeJson(DATA_FILE, links, { spaces: 2 });
            return links[linkIndex];
        } catch (error) {
            console.error('Error adding click:', error);
            throw error;
        }
    }

    static async validateYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(url);
    }

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

    static async getAllLinksWithStats() {
        const links = await this.getAllLinks();
        return Promise.all(links.map(link => this.getLinkStats(link)));
    }
}

module.exports = DataStore; 