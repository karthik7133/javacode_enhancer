const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.java')) {
      cb(null, true);
    } else {
      cb(new Error('Only .java files are allowed'));
    }
  }
});

router.post('/analyze', analyzeController.analyzeCode);

router.post('/format', analyzeController.formatCode);

router.get('/health', analyzeController.getHealth);

router.post('/analyze/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please upload a .java file'
      });
    }

    const code = req.file.buffer.toString('utf-8');

    req.body.code = code;

    analyzeController.analyzeCode(req, res);

  } catch (error) {
    console.error('Error processing uploaded file:', error);
    res.status(500).json({
      success: false,
      error: 'File processing error',
      message: 'An error occurred while processing the uploaded file'
    });
  }
});

module.exports = router;
