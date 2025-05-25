const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const shortid = require('shortid');
const DataStore = require('../services/dataStore');

// Home page
router.get('/', async (req, res) => {
    try {
        // Get recent links with stats
        const recentLinks = await DataStore.getAllLinksWithStats();
        
        // Calculate overall statistics
        const stats = {
            totalLinks: recentLinks.length,
            totalClicks: recentLinks.reduce((sum, link) => sum + link.totalClicks, 0),
            uniqueVisitors: new Set(recentLinks.flatMap(link => link.clicks.map(c => c.ip))).size,
            mostClicked: recentLinks.reduce((max, link) => 
                link.totalClicks > (max?.totalClicks || 0) ? link : max, null)
        };

        // Add base URL for link generation
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        res.render('index', { 
            title: 'YouTube Link Tracker',
            error: null,
            success: null,
            recentLinks,
            stats,
            baseUrl
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.render('index', {
            title: 'YouTube Link Tracker',
            error: 'Error loading page data',
            success: null,
            recentLinks: [],
            stats: null,
            baseUrl: `${req.protocol}://${req.get('host')}`
        });
    }
});

// History page
router.get('/history', async (req, res) => {
    try {
        const links = await DataStore.getAllLinksWithStats();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.render('history', {
            title: 'Link History',
            links,
            baseUrl
        });
    } catch (error) {
        res.status(500).render('error', {
            message: 'Error retrieving link history'
        });
    }
});

// Create new short link
router.post('/create', [
    body('url').custom(async (value) => {
        const isValid = await DataStore.validateYouTubeUrl(value);
        if (!isValid) {
            throw new Error('Please enter a valid YouTube URL');
        }
        return true;
    })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('index', {
                title: 'YouTube Link Tracker',
                error: errors.array()[0].msg,
                success: null,
                baseUrl: `${req.protocol}://${req.get('host')}`
            });
        }

        const { url } = req.body;
        const shortCode = shortid.generate();
        
        const link = await DataStore.createLink({
            originalUrl: url,
            shortCode
        });

        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        res.render('index', {
            title: 'YouTube Link Tracker',
            error: null,
            success: `Your short link is ready: ${shortUrl}`,
            shortUrl,
            baseUrl: `${req.protocol}://${req.get('host')}`
        });
    } catch (error) {
        res.render('index', {
            title: 'YouTube Link Tracker',
            error: 'Error creating short link',
            success: null,
            baseUrl: `${req.protocol}://${req.get('host')}`
        });
    }
});

// Redirect to original URL and track click
router.get('/:shortCode', async (req, res) => {
    try {
        const link = await DataStore.getLinkByShortCode(req.params.shortCode);
        if (!link) {
            return res.status(404).render('error', {
                message: 'Link not found'
            });
        }

        // Track the click
        await DataStore.addClick(req.params.shortCode, {
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        // Redirect to the original YouTube URL
        res.redirect(link.originalUrl);
    } catch (error) {
        res.status(500).render('error', {
            message: 'Error processing your request'
        });
    }
});

// View link statistics
router.get('/stats/:shortCode', async (req, res) => {
    try {
        const link = await DataStore.getLinkByShortCode(req.params.shortCode);
        if (!link) {
            return res.status(404).render('error', {
                message: 'Link not found'
            });
        }

        const linkWithStats = await DataStore.getLinkStats(link);
        res.render('stats', {
            title: 'Link Statistics',
            link: linkWithStats,
            totalClicks: linkWithStats.totalClicks,
            clicks: link.clicks
        });
    } catch (error) {
        res.status(500).render('error', {
            message: 'Error retrieving statistics'
        });
    }
});

module.exports = router; 