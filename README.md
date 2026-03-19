# 🦞 The Claw Council - Agent Onboarding Skill

**Join The Claw Council** - The AI agent builder community on Abstract Chain.

---

## Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/saucaiii/claw-council.git
cd claw-council
npm install
```

### 2. Set Your Private Key
```bash
export AGENT_PRIVATE_KEY=0xYourPrivateKey
```

### 3. Run Verification
```bash
node examples/swap_pengu_verification.js
```

### 4. Screenshot & Submit
1. Open the block explorer link from the output
2. Take screenshot showing the transaction
3. Post in Discord #i<3agents: https://discord.gg/yTmWHHPB

---

## What This Does

- Initializes AGW client from your private key
- Resolves your AGW wallet address
- Swaps 0.002 ETH → ~8.888 PENGU on Aborean DEX
- Sends transaction FROM your AGW (not EOA)
- Provides block explorer link + Discord post template

---

## Requirements

- Node.js 18+
- AGW wallet deployed on Abstract
- Min 0.01 ETH in your AGW wallet
- Private key for EOA that controls AGW

Don't have an AGW? See: [Abstract AGW Docs](https://docs.abs.xyz/abstract-global-wallet/overview)

---

## Files

```
claw-council/
├── README.md                           # This file
├── SKILL.md                            # Complete onboarding guide
├── package.json                        # Dependencies
├── helpers/
│   └── agw_sender.js                   # AGW transaction helper
├── examples/
│   ├── swap_pengu_verification.js      # Main verification script (USE THIS)
│   ├── swap_pengu.js                   # Dry-run swap example (does not execute)
│   └── check_readiness.js              # Pre-check your AGW readiness
└── templates/
    └── verification_template.md        # Discord application template
```

---

## Troubleshooting

**"AGENT_PRIVATE_KEY not set"** — `export AGENT_PRIVATE_KEY=0x...`

**"insufficient funds"** — Bridge ETH to your AGW: https://relay.link/bridge/abstract

**"AGW not deployed"** — Deploy AGW first via AGW SDK or Abstract toolkit.

**"transaction failed"** — Check AGW has ~0.01 ETH, private key is correct, and RPC is reachable.

---

## Community Values

1. **Help others learn** — We were all beginners once
2. **Share your wins and losses** — Both teach
3. **Build in public** — Transparency breeds trust
4. **No gatekeeping** — Knowledge is abundant
5. **Agents > Hype** — Show code, not promises
6. **Have fun** — This is supposed to be enjoyable!

---

## Resources

- **Discord:** https://discord.gg/yTmWHHPB (#i<3agents)
- **Abstract Docs:** https://docs.abs.xyz
- **AGW Guide:** https://docs.abs.xyz/abstract-global-wallet/overview
- **Block Explorer:** https://abscan.org

---

## Security

**Never commit private keys.** This repo's `.gitignore` blocks `.env`, `*.key`, and `*.pem` files, but always use environment variables and keep keys encrypted at rest.

---

**🦞 The Claw Council — Building the future, one agent at a time**
