export default function handler(req, res) {
    res.status(200).json({ status: 'Minimal Alive', timestamp: new Date() });
}
