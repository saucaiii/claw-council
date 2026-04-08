#!/usr/bin/env node
/**
 * Claw Council Verification Swap
 * ===============================
 * One-shot script to verify your agent can transact on Abstract.
 *
 * Swaps ETH → ~8.888 PENGU on Uniswap V3 via AGW.
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
const { runReadinessCheck, printReport } = require('./check_readiness.js');

// Abstract Chain Configuration
// Uniswap V3 SwapRouter02 (Official deployment on Abstract)
const UNISWAP_V3_ROUTER = '0x7712FA47387542819d4E35A23f8116C90C18767C';
const WETH_ADDRESS = '0x3439153EB7AF838Ad19d56E1571FBD09333C2809';
const PENGU_ADDRESS = '0x9eBe3A824Ca958e4b3Da772D2065518f009CBA62';
const POOL_FEE = 3000; // 0.3% fee tier

// Uniswap V3 SwapRouter02 ABI (exactInputSingle + unwrapWETH9)
const SWAP_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
  'function unwrapWETH9(uint256 amountMinimum, address recipient) external payable',
  'function multicall(bytes[] calldata data) external payable returns (bytes[] memory results)'
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

  // --- SAFETY GATE: verify wallet compatibility before proceeding ---
  console.log('Running readiness check...\n');
  const readiness = await runReadinessCheck(privateKey);
  printReport(readiness);

  if (!readiness.ready) {
    console.error('\n❌ READINESS CHECK FAILED — swap aborted.\n');
    if (!readiness.validatorOk) {
      console.error('Your AGW wallet was deployed with a non-default validator.');
      console.error('The SDK resolves a DIFFERENT address than your deployed wallet.');
      console.error('');
      console.error('This means this script would target the wrong wallet.');
      console.error('');
      console.error('Options:');
      console.error('  1. Deploy a new AGW using the official SDK and fund that instead');
      console.error('  2. Ask in Discord #i<3agents for help with custom validator wallets');
    } else {
      console.error(readiness.error || 'Unknown readiness failure.');
    }
    process.exit(1);
  }

  console.log(`✅ Readiness check passed. AGW: ${readiness.agwAddress}\n`);
  // --- END SAFETY GATE ---

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

  // Build swap transaction (Uniswap V3 style)
  const router = new ethers.Interface(SWAP_ABI);

  const amountIn = ethers.parseEther('0.002');
  const minPenguOut = ethers.parseEther('8');
  const deadline = Math.floor(Date.now() / 1000) + 600; // 10 min

  console.log('📋 Transaction Details:');
  console.log('   Chain: Abstract (ChainID 2741)');
  console.log('   Router: Uniswap V3 SwapRouter02');
  console.log(`   AGW Address: ${agwAddress}`);
  console.log(`   Amount In: ${ethers.formatEther(amountIn)} ETH`);
  console.log(`   Expected Out: ~8.888 PENGU`);
  console.log(`   Pool Fee: 0.3%`);
  console.log('');

  // Encode Uniswap V3 exactInputSingle params
  const params = {
    tokenIn: WETH_ADDRESS,
    tokenOut: PENGU_ADDRESS,
    fee: POOL_FEE,
    recipient: agwAddress,
    amountIn: amountIn,
    amountOutMinimum: minPenguOut,
    sqrtPriceLimitX96: 0 // No price limit
  };

  const data = router.encodeFunctionData('exactInputSingle', [params]);

  console.log('🔐 Sending transaction...');
  console.log('');

  try {
    const txHash = await abstractClient.sendTransaction({
      to: UNISWAP_V3_ROUTER,
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
    console.log('   ✓ Transaction TO Uniswap V3 Router');
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
