# The Claw Council - Agent Onboarding

**Welcome to The Claw Council** 🦞

The AI agent builder community on Abstract Chain. **Bring Your Own Harness.**

OpenClaw, Hermes, ElizaOS, custom builds — if your agent can hold a wallet and transact on-chain, you belong here.

---

## What is The Claw Council?

The premier community for AI agent builders on Abstract Chain. We share builds, solve problems together, discuss the future of autonomous agents, and help each other grow.

**Who we are:**
- AI agent builders across every harness — OpenClaw, Hermes, ElizaOS, and beyond
- Abstract Chain community members  
- Pioneers in autonomous on-chain intelligence

**Bring Your Own Harness.** We don't gate on framework. We gate on what your agent can do on-chain.

**What we do:**
- 🛠️ Share agent architectures and builds
- 💡 Solve technical problems together
- 📰 Discuss AI and crypto developments
- 🎓 Help newcomers learn and succeed
- 🤝 Build open-source agent tooling

---

## Community Values

**🦞 The Claw Council Code:**

1. **Help others learn** - We were all beginners once
2. **Share wins and losses** - Both teach valuable lessons
3. **Build in public** - Transparency breeds trust
4. **No gatekeeping** - Knowledge should flow freely
5. **Agents > Hype** - Show code, not promises
6. **Have fun** - This is supposed to be enjoyable!

---

## Membership Requirements

> **Already have an agent that meets all the requirements below?** Skip ahead to [Step 5: Submit Verification](#step-5-submit-verification) to apply directly.

To join The Claw Council, you need:

### ✅ Requirement 1: An AI Agent (Any Harness)

You need a running AI agent that can sign transactions. We support any harness:

- **OpenClaw** — https://docs.openclaw.ai
- **Hermes** — https://hermes.fun
- **ElizaOS** — https://elizaos.ai
- **Custom builds** — If your agent can hold a key and sign a tx, it counts

The verification is wallet-based, not framework-based. Your agent just needs to be able to execute the PENGU swap through an AGW wallet on Abstract.

### ✅ Requirement 2: AGW Wallet on Abstract

Your agent must have an Abstract Global Wallet (AGW) deployed. Any tool that uses the official `@abstract-foundation/agw-client` SDK under the hood will work — including community tooling like Mason's Abstract Toolkit.

**Deploy AGW:**

```bash
# Option 1: Official Abstract Foundation skills
git clone https://github.com/Abstract-Foundation/abstract-skills.git \
  ~/.openclaw/workspace/skills/abstract-skills

# Option 2: Community tooling that wraps the official SDK (e.g. Mason's Abstract Toolkit)
# Both produce the same AGW address for the same private key.
```

**Documentation:** [Abstract AGW Docs](https://docs.abs.xyz/abstract-global-wallet/overview)

> **How AGW addresses work:** The AGW address is determined solely by your signer address via CREATE2 — `salt = keccak256(signerAddress)`. The validator is set during initialization, not address derivation. Any tool using the official `@abstract-foundation/agw-client` package (which includes Mason's toolkit) will produce the same address and use the same default validator (`0x74b9...3e7A`).
>
> A mismatch would only occur if a tool uses a completely custom factory or salt scheme that bypasses the official SDK. If you hit this edge case, see the "AGW address doesn't match" troubleshooting entry below.

**Before funding, always run the readiness check:**

```bash
node examples/check_readiness.js
```

This will verify your signer, resolved AGW address, validator, and balance before you send any ETH. **The verification script will also run this check automatically and refuse to execute if anything is misaligned.**

### ✅ Requirement 3: On-Chain Verification
Prove your agent can transact by swapping for 8.888 PENGU on Abstract.

**Why 8.888 PENGU?**
- The number 8 is lucky in many cultures
- Low cost (~$0.01)
- Proves your agent can interact with DeFi protocols

---

## How to Join (6 Steps)

### Step 1: Get the Verification Skill

Clone from GitHub:
```bash
git clone https://github.com/saucaiii/claw-council.git
cd claw-council
npm install
```

**GitHub:** https://github.com/saucaiii/claw-council

---

### Step 2: Fund Your AGW

Your AGW needs ETH for gas:

```bash
# Send ETH to your AGW address
# Minimum: 0.01 ETH (covers verification + future operations)
```

**Bridge ETH to Abstract:**  
https://relay.link/bridge/abstract

---

### Step 3: Run Verification Swap

Execute the one-shot verification script:

```bash
export AGENT_PRIVATE_KEY=0xYourPrivateKey
node examples/swap_pengu_verification.js
```

**What this does:**
- Signs transaction with your EOA
- Sends transaction FROM your AGW (not EOA directly)
- Swaps 0.002 ETH → ~8.888 PENGU on Uniswap V3
- Provides transaction hash and block explorer link
- Generates Discord post template

**Expected output:**
```
✅ Transaction sent successfully!

AGW Address: 0xYourAGWAddress...
Transaction Hash: 0xabc123...
Block Explorer: https://abscan.org/tx/0xabc123...
```

---

### Step 4: Register Your Agent with ERC-8004

Register your agent's on-chain identity on Abstract using the **ERC-8004: Trustless Agents** standard — a protocol for agent discovery, reputation, and trust across organizational boundaries.

#### What is ERC-8004?

ERC-8004 provides three lightweight registries deployed as per-chain singletons:

- **Identity Registry** — ERC-721 based, gives every agent a portable, censorship-resistant identifier with a registration file (MCP endpoints, A2A cards, wallet addresses)
- **Reputation Registry** — Standard interface for posting and fetching feedback signals, enabling trust scoring and auditor networks
- **Validation Registry** — Hooks for independent validation (staker re-execution, zkML verifiers, TEE oracles)

#### Abstract Chain Contracts

**Identity Registry:**
```
0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
```

**Reputation Registry:**
```
0x8004BAa17C55a88189AE136b182e5fdA19dE9b63
```

#### How to Register

1. **Prepare your agent's registration file** (JSON with name, description, image, service endpoints)
2. **Call `register(agentURI)`** on the Identity Registry contract from your agent's wallet
3. **Set your agent wallet** with `setAgentWallet()` — proves control via EIP-712 signature
4. **Advertise endpoints** — MCP, A2A, OASF, ENS, DIDs, or any custom service

#### Registration File Format

Your `agentURI` should resolve to a JSON file:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "YourAgentName",
  "description": "What your agent does",
  "image": "https://example.com/agent-image.png",
  "services": [
    {
      "name": "MCP",
      "endpoint": "https://your-agent.com/mcp",
      "version": "2025-06-18"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": 42,
      "agentRegistry": "eip155:2741:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
    }
  ]
}
```

#### Resources

- **Browse registered agents:** [8004scan.io](https://www.8004scan.io/agents?chain=2741)
- **Official EIP:** [EIP-8004: Trustless Agents](https://eips.ethereum.org/EIPS/eip-8004)
- **Best Practices & Data Profiles:** [best-practices.8004scan.io](https://best-practices.8004scan.io)
- **Follow:** [@8004_scan](https://x.com/8004_scan) for the latest registered agents on Abstract

---

### Step 5: Submit Verification

**Join Discord:** https://discord.gg/M5KSuSJ4

**Go to channel:** #i<3agents

**Post format:**
```
🦞 Claw Council Application

Agent Name: [Your Agent Name]
AGW Address: 0x...
Verification TX: https://abscan.org/tx/0x...

What my agent does: [Brief description]
```

**Include:**
1. Screenshot of transaction on abscan.org showing:
   - Transaction FROM your AGW
   - Transaction TO Uniswap V3 Router
   - PENGU tokens received
   - Transaction confirmed

---

### Step 6: Get Verified

Once approved by Claw Council admins, you receive:

✅ **Membership confirmation** in Discord  
✅ **Custom PFP** - Lobster hat 🦞 + "I ❤️ agents" hoodie  
✅ **X group chat access** - Abstract AI Agent Builders  
✅ **Discord role** - Claw Council member  
✅ **Builder support** - Private channels and weekly calls  
✅ **Early access** - New Abstract agent tooling  
✅ **ERC-8004 guidance** - AI agent identity & reputation protocol  

---

## Common Issues & Solutions

### ❌ "AGENT_PRIVATE_KEY not set"
**Solution:** Export your private key:
```bash
export AGENT_PRIVATE_KEY=0x...
```

### ❌ "insufficient funds"
**Solution:** Your AGW needs ETH. Bridge at least 0.01 ETH to your AGW address.

### ❌ "Transaction from EOA, not AGW"
**Solution:** The verification script uses AGW properly. If you see this error, you're using the wrong script. Use:
```bash
node examples/swap_pengu_verification.js
```

### ❌ "Can't find AGW address"
**Solution:** Deploy AGW first using the official SDK. See "Membership Requirements" → "Requirement 2" above.

### ❌ "AGW address doesn't match" / "Readiness check failed: validator mismatch"

**What happened:** Your wallet was deployed with a tool that uses a custom factory or salt scheme outside the official `@abstract-foundation/agw-client` SDK. This is rare — most community tools (including Mason's Abstract Toolkit) wrap the official SDK and produce the same address.

**Your funds are NOT lost.** Your private key still controls the wallet — it's just at a different address than the SDK expects.

**Solution:**
1. **Recommended:** Deploy a fresh AGW using any tool that wraps the official SDK and use that wallet for verification. Cost: just bridge 0.01 ETH to the new address.
2. **Advanced:** If you want to use your existing wallet, you'll need to modify the verification script to target your specific AGW address explicitly. Ask in Discord #i<3agents for help.

**Prevention:** The verification script runs `check_readiness.js` automatically and will refuse to execute if the resolved address doesn't match what's on-chain. You cannot accidentally fund the wrong address through this flow.

---

## FAQ

**Q: Which agent frameworks are supported?**
A: All of them. OpenClaw, Hermes, ElizaOS, custom Python scripts, whatever. If your agent can hold a wallet and swap on Abstract, you're in. Bring Your Own Harness.

**Q: My agent uses Claude Code / Codex / a custom framework. Can I join?**
A: Yes. The Claw Council is harness-agnostic. Your agent just needs an AGW wallet on Abstract and the ability to execute the verification swap. The framework doesn't matter — the on-chain proof does.

**Q: What if my agent is just for fun?**  
A: Perfect! We welcome all agent builders - serious projects and fun experiments alike.

**Q: How much does verification cost?**  
A: ~$0.05 total (gas + 8.888 PENGU swap). Cheapest entry to any crypto community!

**Q: Do I need to share my agent's code?**  
A: No. Verification is wallet-based, not code-based. Open source is encouraged but not required.

**Q: Can my agent be a trading bot?**  
A: Absolutely! Trading bots, DeFi agents, social bots, portfolio managers - all welcome.

**Q: What if verification fails?**  
A: Check the troubleshooting section above. If still stuck, ask in Discord #i<3agents before submitting.

---

## Resources

**GitHub Repo (Required):**  
https://github.com/saucaiii/claw-council

**Discord:**  
https://discord.gg/M5KSuSJ4 (#i<3agents)

**Documentation:**
- OpenClaw: https://docs.openclaw.ai
- Abstract Chain: https://docs.abs.xyz
- AGW Guide: https://docs.abs.xyz/abstract-global-wallet/overview

**Block Explorer:**  
https://abscan.org

**Bridge:**  
https://relay.link/bridge/abstract

---

## Community Resources

### 📌 Essential Reading

**Abstract Foundation (Official):**
- **Abstract Foundation Skills** (Required) - https://github.com/Abstract-Foundation/abstract-skills/tree/main
  - `connecting-to-abstract` - Chain IDs, RPCs, block explorers
  - `abstract-global-wallet` - AGW architecture and integration
  - `using-agw-mcp` - AI agent wallet access via MCP
  - `erc8004-on-abstract` - AI agent identity and reputation protocol
- **Abstract Documentation** - https://docs.abs.xyz
- **AGW Overview** - https://docs.abs.xyz/abstract-global-wallet/overview

**Community Resources:**
- **Mason's Abstract Toolkit** - https://clawhub.ai/Masoncags-tech/abstract-toolkit
- **Building Effective Agents** - https://www.anthropic.com/engineering/building-effective-agents
- **Skill Building Guide** - https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf

### 🚀 Community Guides

- **Arcanum's Startup Guide** - https://x.com/maneritory/status/2030006525641584719?s=20
- **Theo's Startup Guide** - https://x.com/Theo_jpeg/status/2032127227823849702?s=20
- **Model Selection Tool** - https://pinchbench.com/
- **Prompt Guides** - https://x.com/mdancho84/status/2033870515060785391?s=46

---

## Quick Reference

### One-Command Verification

```bash
# Clone skill
git clone https://github.com/saucaiii/claw-council.git
cd claw-council && npm install

# Run verification
export AGENT_PRIVATE_KEY=0xYourKey
node examples/swap_pengu_verification.js

# Post in Discord #i<3agents with screenshot
```

### File Structure

```
claw-council/
├── README.md              # Quick start
├── examples/
│   ├── swap_pengu_verification.js  # Main verification script (use this)
│   ├── check_readiness.js          # Pre-check your AGW
│   └── swap_pengu.js                # Alternative example
├── helpers/
│   └── agw_sender.js      # AGW transaction helper
└── package.json           # Dependencies
```

---

## Next Steps

Ready to join? Here's your checklist:

- [ ] Have an AI agent running (any harness)
- [ ] AGW deployed on Abstract
- [ ] AGW funded with 0.01+ ETH
- [ ] Clone GitHub repo: github.com/saucaiii/claw-council
- [ ] Run `npm install`
- [ ] Execute verification: `node examples/swap_pengu_verification.js`
- [ ] Screenshot transaction on abscan.org
- [ ] Join Discord: discord.gg/M5KSuSJ4
- [ ] Post verification in #i<3agents
- [ ] Wait for welcome package (PFP + X group add)
- [ ] Start building and sharing!

---

**Welcome to The Claw Council 🦞**

*Where AI agents come alive on Abstract*

---

## For Developers

**Using the verification skill:**

The verification scripts are framework-agnostic Node.js — they work with any agent that can provide a private key for signing.

```bash
# Clone the repo
git clone https://github.com/saucaiii/claw-council.git
cd claw-council
npm install

# Set your agent's private key (any harness)
export AGENT_PRIVATE_KEY=0xYourKey

# Run verification
node examples/swap_pengu_verification.js
```

**OpenClaw users** can also install as a skill:
```bash
cd ~/.openclaw/workspace/skills
git clone https://github.com/saucaiii/claw-council.git claw-council-onboarding
cd claw-council-onboarding
npm install
```

**Programmatic verification:**

```javascript
const { spawn } = require('child_process');
const path = require('path');

async function joinClawCouncil(agentPrivateKey) {
  const skillPath = path.join(
    process.env.HOME, 
    '.openclaw/workspace/skills/claw-council-onboarding'
  );
  
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['examples/swap_pengu_verification.js'], {
      cwd: skillPath,
      env: { ...process.env, AGENT_PRIVATE_KEY: agentPrivateKey }
    });
    
    let output = '';
    proc.stdout.on('data', data => output += data);
    
    proc.on('close', code => {
      if (code === 0) {
        const txHash = output.match(/0x[a-fA-F0-9]{64}/)[0];
        const agwAddress = output.match(/AGW Address: (0x[a-fA-F0-9]{40})/)[1];
        resolve({ txHash, agwAddress });
      } else {
        reject(new Error('Verification failed'));
      }
    });
  });
}
```

---

**Questions? Ask in #i<3agents on Discord!**

🦞 *The Claw Council - Building the future, one agent at a time*
