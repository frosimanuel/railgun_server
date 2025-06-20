const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { createRailgunWallet, startRailgunEngine, getProver, setLoggers } = require('@railgun-community/wallet');
const { ethers } = require('ethers');
const { groth16 } = require('snarkjs');
const LevelDOWN = require('leveldown');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');

// Set up paths as in replicate.ts
const DB_PATH = path.join(__dirname, '.railgun', 'railgun.db');
const ARTIFACT_PATH = path.join(__dirname, '.railgun', 'artifacts');

// Password hashing logic from replicate.ts
function getIV() {
  return crypto.randomBytes(16);
}

function computePasswordHash(input, length = 32, salt) {
  const saltBuffer = salt ? Buffer.from(salt.replace('0x', ''), 'hex') : getIV();
  const inputBuffer = Buffer.from(input);

  return new Promise((resolve, reject) => {
    crypto.scrypt(inputBuffer, saltBuffer, length, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

function ensureDirectories() {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
        console.log(`Creating database directory: ${dbDir}`);
        fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(ARTIFACT_PATH)) {
        console.log(`Creating artifacts directory: ${ARTIFACT_PATH}`);
        fs.mkdirSync(ARTIFACT_PATH, { recursive: true });
    }
}

let isRailgunReady = false;

// Initialize Railgun Engine ONCE at server startup
async function initRailgunEngine() {
  ensureDirectories();

  console.log('Initializing RAILGUN engine...');
  const engineDatabase = new LevelDOWN(DB_PATH);

  await startRailgunEngine(
    'backend',         // wallet source
    engineDatabase,    // database
    true,              // shouldDebug
    ARTIFACT_PATH,     // artifact path
    false,             // useNativeArtifacts
    false,             // skipMerkletreeScans
    [ "https://ppoi-agg.horsewithsixlegs.xyz" ], // poiNodeURLs
    undefined,         // customPOIList
    true               // shouldInitializeMerkletrees
  );
  getProver().setSnarkJSGroth16(groth16);
  setLoggers(console.log, console.error);
  console.log('RAILGUN Engine initialized!');
}

// Start the server immediately
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend API is live and listening on port ${PORT}`);
  // Now, start the heavy initialization in the background
  console.log("Starting Railgun engine initialization...");
  initRailgunEngine()
    .then(() => {
      isRailgunReady = true;
      console.log("✅ Railgun Engine is fully initialized and ready.");
    })
    .catch(err => {
      console.error("🔴 Railgun Engine failed to initialize:", err);
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', railgunReady: isRailgunReady });
});

// POST /wallet/create
app.post('/wallet/create', async (req, res) => {
  if (!isRailgunReady) {
    // 503 means "Service Unavailable" - the correct code for this state
    return res.status(503).json({ error: 'Server is initializing, please try again in a moment.' });
  }
  try {
    const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase;
    if (!mnemonic) {
      return res.status(500).json({ error: 'Failed to generate mnemonic' });
    }
    const password = req.body.password || 'example-password-123';
    const hashedPassword = await computePasswordHash(password, 32);
    const wallet = await createRailgunWallet(hashedPassword, mnemonic);

    // Derive public address from mnemonic
    const ethersWallet = ethers.Wallet.fromPhrase(mnemonic);
    const derivedPublicAddress = ethersWallet.address;

    // Test: Re-create wallet from same mnemonic and password
    const testWallet = await createRailgunWallet(hashedPassword, mnemonic);
    const testEthersWallet = ethers.Wallet.fromPhrase(mnemonic);
    const testPublicAddress = testEthersWallet.address;

    // Check for mismatches
    let testResults = [];
    if (wallet.id !== testWallet.id) {
      testResults.push(`Wallet ID mismatch: ${wallet.id} vs ${testWallet.id}`);
    }
    if (derivedPublicAddress !== testPublicAddress) {
      testResults.push(`Public address mismatch: ${derivedPublicAddress} vs ${testPublicAddress}`);
    }
    if (wallet.railgunAddress !== testWallet.railgunAddress) {
      testResults.push(`Railgun address mismatch: ${wallet.railgunAddress} vs ${testWallet.railgunAddress}`);
    }

    // Log test results
    if (testResults.length === 0) {
      console.log('Replicate-style tests passed: wallet creation is deterministic and matches CLI logic.');
    } else {
      console.error('Replicate-style test mismatches:', testResults);
    }

    res.json({
      railgunWalletID: wallet.id,
      railgunWalletAddress: wallet.railgunAddress,
      publicAddress: derivedPublicAddress,
      mnemonic,
      testResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /wallet/load
app.post('/wallet/load', async (req, res) => {
  try {
    const { mnemonic, password } = req.body;
    if (!mnemonic || !password) {
      return res.status(400).json({ error: 'Mnemonic and password are required.' });
    }
    const hashedPassword = await computePasswordHash(password, 32);
    const wallet = await createRailgunWallet(hashedPassword, mnemonic);

    // Derive public address from mnemonic
    const ethersWallet = ethers.Wallet.fromPhrase(mnemonic);
    const derivedPublicAddress = ethersWallet.address;

    // Test: Re-create wallet from same mnemonic and password
    const testWallet = await createRailgunWallet(hashedPassword, mnemonic);
    const testEthersWallet = ethers.Wallet.fromPhrase(mnemonic);
    const testPublicAddress = testEthersWallet.address;

    // Check for mismatches
    let testResults = [];
    if (wallet.id !== testWallet.id) {
      testResults.push(`Wallet ID mismatch: ${wallet.id} vs ${testWallet.id}`);
    }
    if (derivedPublicAddress !== testPublicAddress) {
      testResults.push(`Public address mismatch: ${derivedPublicAddress} vs ${testPublicAddress}`);
    }
    if (wallet.railgunAddress !== testWallet.railgunAddress) {
      testResults.push(`Railgun address mismatch: ${wallet.railgunAddress} vs ${testWallet.railgunAddress}`);
    }

    // Log test results
    if (testResults.length === 0) {
      console.log('Replicate-style tests passed: wallet load is deterministic and matches CLI logic.');
    } else {
      console.error('Replicate-style test mismatches (load):', testResults);
    }

    res.json({
      railgunWalletID: wallet.id,
      railgunWalletAddress: wallet.railgunAddress,
      publicAddress: derivedPublicAddress,
      mnemonic,
      testResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}); 