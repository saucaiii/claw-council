#!/usr/bin/env node
/**
 * Check Claw Council Readiness
 * Verifies your agent meets all membership requirements
 * 
 * Usage:
 *   export AGW_ADDRESS=0x...
 *   node examples/check_readiness.js
 */

const { ethers } = require('ethers');

const RPC_URL = 'https://api.mainnet.abs.xyz';
const PENGU_ADDRESS = '0x9eBe3A824Ca958e4b3Da772D2065518f009CBA62';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)'
];

async function checkClawCouncilReadiness({ agwAddress, rpcUrl }) {
  rpcUrl = rpcUrl || RPC_URL;
  
  console.log('🦞 Claw Council Readiness Check');
  console.log('================================');
  console.log('');
  console.log(`AGW Address: ${agwAddress}`);
  console.log('');
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const results = {
    agwAddress,
    checks: [],
    ready: false,
    missing: []
  };
  
  // Check 1: AGW has code (is deployed)
  console.log('✓ Checking AGW deployment...');
  try {
    const code = await provider.getCode(agwAddress);
    if (code === '0x' || code === '0x0') {
      results.checks.push({ name: 'AGW Deployed', status: false });
      results.missing.push('AGW not deployed - deploy AGW contract first');
      console.log('  ❌ AGW not deployed');
    } else {
      results.checks.push({ name: 'AGW Deployed', status: true });
      console.log('  ✅ AGW deployed');
    }
  } catch (err) {
    results.checks.push({ name: 'AGW Deployed', status: false });
    results.missing.push('Could not verify AGW deployment');
    console.log('  ❌ Error checking AGW');
  }
  
  // Check 2: AGW has ETH balance (for gas)
  console.log('✓ Checking ETH balance...');
  try {
    const balance = await provider.getBalance(agwAddress);
    const ethBalance = ethers.formatEther(balance);
    
    if (balance > 0n) {
      results.checks.push({ 
        name: 'Has ETH', 
        status: true, 
        balance: ethBalance 
      });
      console.log(`  ✅ ETH Balance: ${ethBalance} ETH`);
    } else {
      results.checks.push({ name: 'Has ETH', status: false });
      results.missing.push('No ETH for gas - bridge at least 0.01 ETH');
      console.log('  ❌ No ETH balance');
    }
  } catch (err) {
    results.checks.push({ name: 'Has ETH', status: false });
    console.log('  ❌ Error checking ETH balance');
  }
  
  // Check 3: AGW has transaction history
  console.log('✓ Checking transaction history...');
  try {
    const txCount = await provider.getTransactionCount(agwAddress);
    
    if (txCount > 0) {
      results.checks.push({ 
        name: 'Has Transactions', 
        status: true, 
        count: txCount 
      });
      console.log(`  ✅ Transactions: ${txCount}`);
    } else {
      results.checks.push({ name: 'Has Transactions', status: false });
      results.missing.push('No on-chain activity - execute verification transaction (swap 1 PENGU)');
      console.log('  ❌ No transactions yet');
    }
  } catch (err) {
    console.log('  ⚠️  Could not check transaction history');
  }
  
  // Check 4: Optional - Has PENGU (shows DeFi interaction)
  console.log('✓ Checking PENGU balance (optional)...');
  try {
    const penguContract = new ethers.Contract(PENGU_ADDRESS, ERC20_ABI, provider);
    const penguBalance = await penguContract.balanceOf(agwAddress);
    const formattedBalance = ethers.formatEther(penguBalance);
    
    if (penguBalance > 0n) {
      results.checks.push({ 
        name: 'Has PENGU', 
        status: true, 
        balance: formattedBalance 
      });
      console.log(`  ✅ PENGU Balance: ${formattedBalance} PENGU`);
    } else {
      results.checks.push({ name: 'Has PENGU', status: false });
      console.log('  ⚠️  No PENGU (recommended for verification)');
    }
  } catch (err) {
    console.log('  ⚠️  Could not check PENGU balance');
  }
  
  // Summary
  console.log('');
  console.log('================================');
  
  const passedChecks = results.checks.filter(c => c.status).length;
  const requiredChecks = 3; // AGW deployed, has ETH, has transactions
  
  results.ready = passedChecks >= requiredChecks;
  
  if (results.ready) {
    console.log('✅ Ready to join Claw Council!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Take screenshot of recent transaction on abscan.org');
    console.log('2. Join Discord: https://discord.gg/yTmWHHPB');
    console.log('3. Post in #i-❤️-agents with:');
    console.log('   - AGW address');
    console.log('   - Transaction hash');
    console.log('   - What your agent does');
    console.log('');
    console.log('🦞 Welcome to The Claw Council!');
  } else {
    console.log('❌ Not ready yet');
    console.log('');
    console.log('Missing requirements:');
    results.missing.forEach(m => console.log(`  • ${m}`));
    console.log('');
    console.log('See: skills/claw-council-onboarding/SKILL.md');
  }
  
  return results;
}

// CLI
if (require.main === module) {
  const agwAddress = process.env.AGW_ADDRESS || process.argv[2];
  
  if (!agwAddress) {
    console.error('Usage: node check_readiness.js <AGW_ADDRESS>');
    console.error('   or: AGW_ADDRESS=0x... node check_readiness.js');
    process.exit(1);
  }
  
  checkClawCouncilReadiness({ agwAddress })
    .then(result => {
      if (!result.ready) {
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { checkClawCouncilReadiness };
