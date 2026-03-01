export default function handler(req, res) {
    res.status(200).json({ status: 'Health Mock Alive', timestamp: new Date() });
}
