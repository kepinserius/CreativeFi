// backend/src/routes/upload.ts
import express, { Request, Response } from 'express';
import { upload } from '../middleware/upload';
import PinataClient from '@pinata/sdk';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Define a type for the request with file property
interface MulterRequest extends Request {
  file?: {
    path: string;
    originalname: string;
  };
}

// POST /api/upload - Upload file to IPFS via Pinata
router.post('/', upload.single('file'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
      return res.status(500).json({ message: 'Pinata configuration not set' });
    }

    const pinata = new PinataClient(
      process.env.PINATA_API_KEY,
      process.env.PINATA_SECRET_KEY
    );

    // Upload to IPFS via Pinata
    const result = await pinata.pinFileToIPFS(req.file.path, {
      pinataMetadata: {
        name: req.file.originalname,
        keyvalues: {
          uploadedBy: (req.body.wallet_address as string) || 'anonymous',
          uploadType: (req.body.uploadType as string) || 'general'
        } as any // Type assertion to avoid strict typing issues
      },
      pinataOptions: {
        cidVersion: 0
      }
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      ipfsHash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    res.status(500).json({ message: 'Error uploading file to IPFS', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
});

// GET /api/media/:hash - Get media from IPFS
router.get('/media/:hash', async (req: Request, res: Response) => {
  try {
    const hash = req.params.hash;
    
    // Validate IPFS hash format
    const ipfsHashRegex = /^[a-zA-Z0-9]{46,}$/;
    if (!ipfsHashRegex.test(hash)) {
      return res.status(400).json({ message: 'Invalid IPFS hash format' });
    }
    
    // Return the IPFS gateway URL
    res.json({
      url: `https://gateway.pinata.cloud/ipfs/${hash}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving media:', error);
    res.status(500).json({ message: 'Error retrieving media', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
});

export default router;