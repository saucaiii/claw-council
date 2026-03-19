#!/usr/bin/env node
/**
 * Claw Council Verification Swap
 * ===============================
 * One-shot script to verify your agent can transact on Abstract.
 *
 * Swaps ETH → ~8.888 PENGU on Aborean DEX via AGW.
 *
 * Requirements:
 *   - Node.js 18+
 *   - npm install (installs @abstract-foundation/agw-client, ethers, viem)
 *   - AGW wallet deployed on Abstract
 *   - Min 0.01 ETH in your AGW wallet
 *
 * Usage:
 *   export AGENT_PRIVATE_KEY=0xYourPrivateKey
 *   node examples/swap_pengu_verification.js
 */

const { ethers } = require('ethers');

// Abstract Chain Configuration
// NOTE: Verify this is the current Aborean Router on abscan.org before use.
// Aborean may upgrade their router — check https://aborean.fi for the latest.
const ABOREAN_ROUTER = '0xE8142D2f82036B6FC1e79E4aE85cF53FBFfDC998';
const WETH_ADDRESS = '0x3439153EB7AF838Ad19d56E1571FBD09333C2809';
const PENGU_ADDRESS = '0x9eBe3A824Ca958e4b3Da772D2065518f009CBA62';

// Aborean Router ABI (swap function only)
const SWAP_ABI = [
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
];

async function swapForVerification() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     🦞 CLAW COUNCIL VERIFICATION SWAP 🦞                    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Check environment
  const privateKey = process.env.AGENT_PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ Error: AGENT_PRIVATE_KEY not set');
    console.error('');
    console.error('Usage:');
    console.error('  export AGENT_PRIVATE_KEY=0xYourPrivateKey');
    console.error('  node examples/swap_pengu_verification.js');
    process.exit(1);
  }

  // Initialize AGW client to get the wallet address
  console.log('🔐 Initializing AGW client...');
  console.log('');

  const { createAbstractClient } = require('@abstract-foundation/agw-client');
  const { http } = require('viem');
  const { privateKeyToAccount } = require('viem/accounts');
  const { abstract: abstractMainnet } = require('viem/chains');

  const account = privateKeyToAccount(privateKey);
  const abstractClient = await createAbstractClient({
    signer: account,
    chain: abstractMainnet,
    transport: http(),
  });

  const agwAddress = abstractClient.account?.address;
  if (!agwAddress) {
    console.error('❌ Could not resolve AGW address from private key.');
    console.error('   Make sure your AGW is deployed on Abstract mainnet.');
    process.exit(1);
  }

  // Build swap transaction
  const router = new ethers.Interface(SWAP_ABI);

  const amountIn = ethers.parseEther('0.002');
  const minPenguOut = ethers.parseEther('8');
  const swapPath = [WETH_ADDRESS, PENGU_ADDRESS];
  const deadline = Math.floor(Date.now() / 1000) + 600; // 10 min

  console.log('📋 Transaction Details:');
  console.log('   Chain: Abstract (ChainID 2741)');
  console.log('   Router: Aborean DEX');
  console.log(`   AGW Address: ${agwAddress}`);
  console.log(`   Amount In: ${ethers.formatEther(amountIn)} ETH`);
  console.log(`   Expected Out: ~8.888 PENGU`);
  console.log('');

  // Encode swap calldata — recipient is the AGW address (not zero address)
  const data = router.encodeFunctionData('swapExactETHForTokens', [
    minPenguOut,
    swapPath,
    agwAddress,
    deadline
  ]);

  console.log('🔐 Sending transaction...');
  console.log('');

  try {
    const txHash = await abstractClient.sendTransaction({
      to: ABOREAN_ROUTER,
      data: data,
      value: amountIn,
    });

    console.log('✅ Transaction sent successfully!');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📸 VERIFICATION PROOF');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log(`AGW Address: ${agwAddress}`);
    console.log(`Transaction Hash: ${txHash}`);
    console.log('');
    console.log(`Block Explorer:`);
    console.log(`https://abscan.org/tx/${txHash}`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('');
    console.log('1. Open the block explorer link above');
    console.log('2. Take a screenshot showing:');
    console.log('   ✓ Transaction FROM your AGW address');
    console.log('   ✓ Transaction TO Aborean Router');
    console.log('   ✓ PENGU tokens received');
    console.log('   ✓ Transaction confirmed');
    console.log('');
    console.log('3. Join Discord: https://discord.gg/yTmWHHPB');
    console.log('');
    console.log('4. Post in #i<3agents:');
    console.log('');
    console.log('   🦞 Claw Council Application');
    console.log('   ');
    console.log('   Agent Name: [Your Agent Name]');
    console.log(`   AGW Address: ${agwAddress}`);
    console.log(`   Verification TX: https://abscan.org/tx/${txHash}`);
    console.log('   ');
    console.log('   What my agent does: [Brief description]');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('🎉 Welcome to The Claw Council! 🦞');
    console.log('');

    return { txHash, agwAddress, signerAddress: account.address };
  } catch (e) {
    console.error('❌ Transaction failed:');
    console.error(e.shortMessage || e.message || String(e));
    throw e;
  }
}

// Run if called directly
if (require.main === module) {
  swapForVerification()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('');
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = { swapForVerification };
