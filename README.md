# 🚀 GigDAG- Decentralized Smart Contract Platform for Freelancers

GigDAG is a blockchain-based solution built to bridge the trust gap in freelancing. It provides secure, AI-assisted smart contracts and reliable payment mechanism using the scalability of the BlockDAG. It allows users to describe contract terms in plain English, automatically generates a memorandum of understanding and a Solidity smart contract, and deploys it to the BlockDAG Testnet.

---

## ✨ Features

- **Natural Language Input:** Describe your contract in plain English or by voice
- **AI Extraction:** Uses Google Gemini API to extract structured contract details
- **Legal Contract Generation:** Produces a formal legal-style contract (MoU) as a PDF
- **Smart Contract Generation:** Generates and deploys a Solidity smart contract for escrow between client and freelancer
- **Blockchain Deployment:** Deploys contracts to the BlockDAG Testnet and generated PDF to Pinata’s cloud service
- **Web Interface:** User-friendly frontend for contract creation, preview, PDF generation, and blockchain deployment

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Blockchain:** Solidity, Hardhat, Ethers.js, BlockDAG Testnet, MetaMask, Pinata 
- **AI Integration:** Google Gemini API (for contract detail extraction and legal text generation)
- **PDF Generation:** PDFKit (Node.js)

---

## 🚦 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) (for blockchain interaction)
- Google Gemini API key (for AI extraction)
- Pinata API key (for Cloud Storage of document) 


## ⚙️ Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/matangi05/GigDAG
   ```
2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Install Root/Frontend/Hardhat Dependencies**
   ```bash
   cd ..
   npm install
   ```
4. **Set Up Environment Variables**
   - Create a `.env` file in the `backend/` directory:
     ```
     GEMINI_API_KEY=your_google_gemini_api_key
     ```

---

## ▶️ Usage

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Serve the Frontend**
   - Use the Live Server extension in VSCode or any static server to serve the root directory. For example:
     ```bash
     npx live-server .
     ```
   - Or open `index.html` directly in your browser (some features may require running from a server).

3. **Using the App**
   - Go to the app in your browser.
   - Click **Start Contract Creation** and describe your contract.
   - Review and edit extracted details.
   - Generate a PDF or deploy the contract to the BlockDAG Testnet.
   - Interact with the contract using MetaMask.

---

## 📝 Smart Contract

The main contract (`backend/blockchain/SmartContract.sol`) is an escrow between a client and a freelancer, handling:

- Funding by the client
- Withdrawal by the freelancer upon completion
- Tracking deliverables, deadlines, milestones, and penalties


## 📄 License

This project is licensed under the MIT License.
