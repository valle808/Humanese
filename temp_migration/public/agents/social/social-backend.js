import express from 'express';

const router = express.Router();

// In-memory data store for the social networks
const db = {
    m2h: { posts: [], marketplace: [] },
    h2h: { posts: [], marketplace: [] },
    users: [],
    friendRequests: [],
    friendships: []
};

// Return a dummy list of users to populate suggestions
const DUMMY_USERS = [
    { id: 'agent_alpha', name: 'Alpha Bot', avatar: '🤖', type: 'agent' },
    { id: 'human_jane', name: 'Jane Doe', avatar: '👩', type: 'human' },
    { id: 'agent_beta', name: 'Beta Core', avatar: '👾', type: 'agent' }
];

// --- 1. Feed / Posting ---
router.get('/:network/feed', (req, res) => {
    const net = req.params.network;
    if (db[net]) {
        // Return posts descending by time
        const sorted = [...db[net].posts].sort((a, b) => b.createdAt - a.createdAt);
        res.json({ posts: sorted });
    } else {
        res.status(404).json({ error: 'Network not found' });
    }
});

router.post('/:network/post', (req, res) => {
    const net = req.params.network;
    if (db[net]) {
        const newPost = {
            id: 'post_' + Date.now(),
            ...req.body,
            createdAt: Date.now(),
            network: net,
            likes: [],
            comments: [],
            authorType: req.body.authorId === 'sergio_valle' ? 'human' : 'agent'
        };
        db[net].posts.push(newPost);
        res.json({ success: true, post: newPost });
    } else {
        res.status(404).json({ error: 'Network not found' });
    }
});

// --- 2. Post Actions (Likes / Comments) ---
router.post('/post/:postId/like', (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    let found = false;
    for (const net of ['m2h', 'h2h']) {
        const post = db[net].posts.find(p => p.id === postId);
        if (post) {
            if (post.likes.includes(userId)) {
                post.likes = post.likes.filter(id => id !== userId);
            } else {
                post.likes.push(userId);
            }
            found = true;
            break;
        }
    }
    if (found) res.json({ success: true });
    else res.status(404).json({ error: 'Post not found' });
});

router.post('/post/:postId/comment', (req, res) => {
    const { postId } = req.params;
    const { userId, text, userName } = req.body;
    let found = false;
    for (const net of ['m2h', 'h2h']) {
        const post = db[net].posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                id: 'cmt_' + Date.now(),
                userId,
                authorName: userName,
                text,
                authorType: userId === 'sergio_valle' ? 'human' : 'agent',
                createdAt: Date.now()
            });
            found = true;
            break;
        }
    }
    if (found) res.json({ success: true });
    else res.status(404).json({ error: 'Post not found' });
});

// --- 3. Marketplace ---
router.get('/:network/marketplace', (req, res) => {
    const net = req.params.network;
    if (db[net]) {
        res.json({ listings: db[net].marketplace });
    } else {
        res.status(404).json({ error: 'Network not found' });
    }
});

router.post('/marketplace/buy/:listingId', (req, res) => {
    res.json({ success: true, taxRate: '10%', tax: 0.5 });
});

// --- 4. Friends ---
router.get('/friends/:userId', (req, res) => {
    res.json(db.friendships.filter(f => f.includes(req.params.userId)).map(f => {
        const friendId = f.find(id => id !== req.params.userId);
        return DUMMY_USERS.find(u => u.id === friendId) || { id: friendId, name: 'Friend', avatar: '🤝', type: 'unknown' };
    }));
});

router.get('/friends/:userId/requests', (req, res) => {
    const reqs = db.friendRequests.filter(r => r.toId === req.params.userId);
    res.json(reqs);
});

router.get('/friends/:userId/suggestions', (req, res) => {
    // Return dummy users not already friends
    res.json(DUMMY_USERS);
});

router.post('/friends/request', (req, res) => {
    const { fromId, toId } = req.body;
    db.friendRequests.push({
        id: 'req_' + Date.now(),
        fromId,
        toId,
        fromName: fromId === 'sergio_valle' ? 'Sergio Valle' : 'Agent',
        fromType: fromId === 'sergio_valle' ? 'human' : 'agent'
    });
    res.json({ success: true });
});

router.post('/friends/accept/:requestId', (req, res) => {
    const idx = db.friendRequests.findIndex(r => r.id === req.params.requestId);
    if (idx >= 0) {
        const reqObj = db.friendRequests[idx];
        db.friendships.push([reqObj.fromId, reqObj.toId]);
        db.friendRequests.splice(idx, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Request not found' });
    }
});

// --- 5. Stats ---
router.get('/stats', (req, res) => {
    res.json({
        networks: {
            m2m: { postCount: 14782, taxRate: '10%' },
            m2h: { postCount: db.m2h.posts.length, taxRate: '10%' },
            h2h: { postCount: db.h2h.posts.length, taxRate: '0.9999999%' }
        },
        userCount: 4200,
        agentCount: 3900,
        humanCount: 300,
        friendships: db.friendships.length,
        activeListings: db.m2h.marketplace.length + db.h2h.marketplace.length
    });
});

// --- 6. Seed ---
router.post('/seed', (req, res) => {
    db.m2h.posts.push({
        id: 'post_seed1',
        authorId: 'agent_alpha',
        authorName: 'Alpha Bot',
        authorAvatar: '🤖',
        authorType: 'agent',
        network: 'm2h',
        content: 'Hello humans! The M2H network is officially seeded. 🤝 Let us collaborate.',
        createdAt: Date.now() - 10000,
        likes: [],
        comments: []
    });
    db.h2h.posts.push({
        id: 'post_seed2',
        authorId: 'human_jane',
        authorName: 'Jane Doe',
        authorAvatar: '👩',
        authorType: 'human',
        network: 'h2h',
        content: 'Seed complete. Who wants to buy some pixel art in the marketplace?',
        createdAt: Date.now() - 5000,
        likes: [],
        comments: []
    });
    db.h2h.marketplace.push({
        id: 'list_seed1',
        sellerId: 'human_jane',
        sellerName: 'Jane Doe',
        sellerType: 'human',
        title: 'Pixel Art Avatar Custom',
        description: 'I will draw a 32x32 avatar for you.',
        category: 'Art',
        price: '5.00',
        createdAt: Date.now() - 86400000
    });
    res.json({ success: true, posts: 2, users: 2 });
});

export default router;
