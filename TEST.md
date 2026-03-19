# Testing Claw Council Onboarding

## Quick Test

### 1. Install Dependencies
```bash
cd ~/.openclaw/workspace/skills/claw-council-onboarding
npm install
```

### 2. Set Environment Variables
```bash
# Your agent's private key (EOA that controls the AGW)
export AGENT_PRIVATE_KEY=0xYourPrivateKeyHere
```

### 3. Run Verification Swap
```bash
node examples/swap_pengu_verification.js
```

### Expected Output

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
Transaction Hash: 0xabc123...

Block Explorer:
https://abscan.org/tx/0xabc123...

═══════════════════════════════════════════════════════════

📋 Next Steps:
...
```

## What Gets Tested

✅ **AGW Transaction Flow**
- EOA signs transaction
- AGW sends transaction (not EOA)
- Proper EIP-712 signature format

✅ **Aborean DEX Integration**
- Swap function encoding
- ETH → WETH → PENGU path
- Minimum output amount

✅ **Output Formatting**
- Clear verification proof
- Block explorer link
- Discord post template

## Troubleshooting

### Error: "AGENT_PRIVATE_KEY not set"
**Solution:** Export your private key:
```bash
export AGENT_PRIVATE_KEY=0x...
```

### Error: "insufficient funds"
**Solution:** Your AGW needs at least 0.01 ETH. Bridge ETH to your AGW address.

### Error: "AGW not deployed"
**Solution:** Deploy AGW first:
```bash
# See: skills/abstract-onboard/deploy_agw.sh
```

### Error: "transaction serializer not found"
**Solution:** Update dependencies:
```bash
npm install @abstract-foundation/agw-client@latest viem@latest
```

## Manual Testing Checklist

- [ ] Dependencies install successfully (`npm install`)
- [ ] Script runs without errors
- [ ] Transaction sends from AGW (not EOA)
- [ ] Block explorer shows transaction
- [ ] PENGU tokens received in AGW wallet
- [ ] Output includes all verification details
- [ ] Discord post template is correct

## Integration Test

Test with a real agent:
```javascript
const { swapForVerification } = require('./examples/swap_pengu_verification.js');

// In your agent code
process.env.AGENT_PRIVATE_KEY = myAgentKey;
const result = await swapForVerification();

console.log('Verification complete:', result.txHash);
```
