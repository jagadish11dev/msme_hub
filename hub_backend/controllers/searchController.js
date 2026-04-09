/**
 * @desc    Proxy search request to FastAPI ML service
 * @route   POST /api/search
 * @access  Public
 */
const searchProducts = async (req, res) => {
    try {
        const pythonResponse = await fetch('http://localhost:8000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        
        if (!pythonResponse.ok) {
            throw new Error(`Python service responded with status: ${pythonResponse.status}`);
        }
        
        const data = await pythonResponse.json();
        return res.json(data);
    } catch (error) {
        console.error('Error proxying to FastAPI:', error.message);
        return res.status(500).json({ 
            error: 'Failed to process search request through ML microservice.',
            details: error.message 
        });
    }
};

module.exports = {
    searchProducts
};
