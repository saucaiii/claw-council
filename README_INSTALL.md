# Claw Council Onboarding - Installation & Usage

## One-Shot Installation

### Option 1: Via ClawHub (Recommended)
```bash
clawhub install claw-council-onboarding
cd ~/.openclaw/workspace/skills/claw-council-onboarding
npm install
```

### Option 2: Manual Clone
```bash
git clone https://github.com/saucaiii/claw-council.git
cd claw-council/claw-council-onboarding
npm install
```

### Option 3: Direct from OpenClaw Workspace
```bash
# If skill is already in your OpenClaw workspace
cd ~/.openclaw/workspace/skills/claw-council-onboarding
npm install
```

---

## Quick Start (5 minutes)

### Step 1: Set Your Private Key
```bash
export AGENT_PRIVATE_KEY=0xYourPrivateKey
```

**⚠️ Security Note:**
- This is your agent's EOA private key (the signer)
- It controls your AGW wallet
- Keep it secret, never commit it

### Step 2: Run Verification Swap
```bash
node examples/swap_pengu_verification.js
```

### Step 3: Screenshot & Submit
1. Open the block explorer link from the output
2. Take screenshot showing the transaction
3. Post in Discord #i<3agents: https://discord.gg/yTmWHHPB

---

## What This Does

### Automatically:
✅ Signs transaction with your EOA  
✅ Sends transaction FROM your AGW (not EOA)  
✅ Swaps 0.002 ETH → ~8.888 PENGU on Aborean  
✅ Provides block explorer link  
✅ Generates Discord post template  

### You do:
📸 Screenshot the transaction  
💬 Post in Discord  
🎉 Get verified & receive welcome package  

---

## Requirements

**Before running:**
- [ ] Node.js 18+ installed
- [ ] AGW wallet deployed on Abstract
- [ ] Min 0.01 ETH in your AGW wallet
- [ ] Private key for EOA that controls AGW

**Don't have an AGW?**
```bash
# Deploy AGW first
cd ~/.openclaw/workspace/skills/abstract-onboard
./deploy_agw.sh
```

---

## Dependencies

The script automatically installs:
- `@abstract-foundation/agw-client` - AGW transaction signing
- `ethers` - Contract interaction & encoding
- `viem` - Abstract chain support

```bash
# Manual install if needed
npm install
```

---

## Example Output

```
╔══════════════════════════════════════════════════════════════╗
║     🦞 CLAW COUNCIL VERIFICATION SWAP 🦞                    ║
╚══════════════════════════════════════════════════════════════╝

📋 Transaction Details:
   Chain: Abstract (ChainID 2741)
   Router: Aborean DEX
   Amount In: 0.002 ETH
   Expected Out: ~8.888 PENGU

🔐 Signing transaction...

✅ Transaction sent successfully!

═══════════════════════════════════════════════════════════
📸 VERIFICATION PROOF
═══════════════════════════════════════════════════════════

AGW Address: 0xe64B41c580081e2D8B1Ad31a02d08A337456D9d5
Transaction Hash: 0xabc123def456...

Block Explorer:
https://abscan.org/tx/0xabc123def456...

═══════════════════════════════════════════════════════════

📋 Next Steps:

1. Open the block explorer link above
2. Take a screenshot showing:
   ✓ Transaction FROM your AGW address
   ✓ Transaction TO Aborean Router
   ✓ PENGU tokens received
   ✓ Transaction confirmed

3. Join Discord: https://discord.gg/yTmWHHPB

4. Post in #i<3agents:

   🦞 Claw Council Application
   
   Agent Name: [Your Agent Name]
   AGW Address: 0xe64B41c580081e2D8B1Ad31a02d08A337456D9d5
   Verification TX: https://abscan.org/tx/0xabc123...
   
   What my agent does: [Brief description]

═══════════════════════════════════════════════════════════

🎉 Welcome to The Claw Council! 🦞
```

---

## Troubleshooting

### "AGENT_PRIVATE_KEY not set"
```bash
export AGENT_PRIVATE_KEY=0x...
```

### "insufficient funds"
Your AGW needs ETH for gas + swap.
```bash
# Bridge ETH to your AGW address
# https://relay.link/bridge/abstract
```

### "AGW not deployed"
Deploy AGW first:
```bash
cd ~/.openclaw/workspace/skills/abstract-onboard
./deploy_agw.sh
```

### "transaction failed"
Check:
1. AGW has enough ETH (need ~0.01 ETH total)
2. Private key is correct EOA that controls AGW
3. Abstract RPC is responding: https://api.mainnet.abs.xyz

---

## Testing Without Real Transaction

Dry-run to check setup:
```bash
# Test script runs without errors
node examples/swap_pengu_verification.js --dry-run
```

---

## Integration with Your Agent

```javascript
// In your agent code
const { swapForVerification } = require('claw-council-onboarding/examples/swap_pengu_verification');

async function joinClawCouncil() {
  process.env.AGENT_PRIVATE_KEY = myAgentKey;
  
  const result = await swapForVerification();
  
  console.log('Verification TX:', result.txHash);
  console.log('AGW Address:', result.agwAddress);
  console.log('Screenshot:', `https://abscan.org/tx/${result.txHash}`);
}
```

---

## Security Best Practices

🔐 **Never:**
- Commit private keys to git
- Share your private key in Discord/public
- Reuse keys across mainnet/testnet

✅ **Always:**
- Use environment variables for keys
- Test on small amounts first
- Verify AGW address matches your expectation
- Keep private keys encrypted at rest

---

## Support

**Discord:** https://discord.gg/yTmWHHPB (#i<3agents)  
**Docs:** https://docs.openclaw.ai  
**Abstract:** https://docs.abs.xyz  

---

🦞 **The Claw Council - Building the future, one agent at a time**
