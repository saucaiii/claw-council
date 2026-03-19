#!/usr/bin/env node
/**
 * Swap ETH → PENGU (Dry-Run / Structure Example)
 *
 * This script shows the transaction structure for an Aborean swap
 * but does NOT execute on-chain. For actual verification, use:
 *   node examples/swap_pengu_verification.js
 *
 * Usage:
 *   export AGENT_PRIVATE_KEY=0x...
 *   export AGW_ADDRESS=0x...
 *   node examples/swap_pengu.js
 */

const { ethers } = require('ethers');

// Abstract Chain + Aborean Router
const RPC_URL = 'https://api.mainnet.abs.xyz';
const ABOREAN_ROUTER = '0xE8142D2f82036B6FC1e79E4aE85cF53FBFfDC998';
const WETH_ADDRESS = '0x3439153EB7AF838Ad19d56E1571FBD09333C2809';
const PENGU_ADDRESS = '0x9eBe3A824Ca958e4b3Da772D2065518f009CBA62';

// Aborean Router ABI (simplified)
const ROUTER_ABI = [
  'function swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline) payable returns (uint[])'
];

async function swapETHForPENGU({ amountIn, agwAddress, privateKey }) {
  console.log('🦞 Claw Council — Swap Structure (DRY RUN)');
  console.log('==========================================');
  console.log('');
  console.log('⚠️  This script shows the transaction structure but does NOT execute.');
  console.log('   For actual verification, use: node examples/swap_pengu_verification.js');
  console.log('');
  console.log('Swap: ETH → PENGU on Aborean');
  console.log(`Amount: ${ethers.formatEther(amountIn)} ETH`);
  console.log(`From AGW: ${agwAddress}`);
  console.log('');

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const eoaWallet = new ethers.Wallet(privateKey, provider);

  console.log(`EOA Signer: ${eoaWallet.address}`);
  console.log('');

  const swapPath = [WETH_ADDRESS, PENGU_ADDRESS];
  const deadline = Math.floor(Date.now() / 1000) + 300;
  const minPenguOut = ethers.parseEther('0.5');

  console.log('Transaction Details:');
  console.log(`  Router: ${ABOREAN_ROUTER}`);
  console.log(`  Path: ETH → PENGU`);
  console.log(`  Amount In: ${ethers.formatEther(amountIn)} ETH`);
  console.log(`  Min Out: ${ethers.formatEther(minPenguOut)} PENGU`);
  console.log('');

  console.log('📝 To execute this swap on-chain, run:');
  console.log('   node examples/swap_pengu_verification.js');
  console.log('');
  console.log('Submit to Discord: https://discord.gg/yTmWHHPB (#i<3agents)');

  return {
    router: ABOREAN_ROUTER,
    path: swapPath,
    amountIn: ethers.formatEther(amountIn),
    minOut: ethers.formatEther(minPenguOut),
    agwAddress,
    note: 'Dry run only — use swap_pengu_verification.js for actual execution'
  };
}

// CLI
if (require.main === module) {
  const agwAddress = process.env.AGW_ADDRESS;
  const privateKey = process.env.AGENT_PRIVATE_KEY;
  const amountIn = process.env.AMOUNT_ETH || '0.001';

  if (!agwAddress || !privateKey) {
    console.error('Missing environment variables:');
    console.error('  AGW_ADDRESS=0x...');
    console.error('  AGENT_PRIVATE_KEY=0x...');
    console.error('  AMOUNT_ETH=0.001 (optional)');
    process.exit(1);
  }

  swapETHForPENGU({
    amountIn: ethers.parseEther(amountIn),
    agwAddress,
    privateKey
  })
    .then(result => {
      console.log('');
      console.log('✅ Swap structure ready (not executed)');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = { swapETHForPENGU };
