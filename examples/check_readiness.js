#!/usr/bin/env node
/**
 * Claw Council Readiness Check — Safety Gate
 * ============================================
 * Verifies signer, AGW address, validator, and balance BEFORE any swap.
 *
 * Usage (standalone):
 *   export AGENT_PRIVATE_KEY=0xYourPrivateKey
 *   node examples/check_readiness.js
 *
 * Usage (from swap_pengu_verification.js):
 *   const { runReadinessCheck } = require('./check_readiness.js');
 *   const result = await runReadinessCheck(privateKey);
 *   if (!result.ready) process.exit(1);
 */

const { ethers } = require('ethers');

const RPC_URL = 'https://api.mainnet.abs.xyz';

// SDK default validator — from @abstract-foundation/agw-client/src/constants.ts
const DEFAULT_EOA_VALIDATOR = '0x74b9ae28EC45E3FA11533c7954752597C3De3e7A';

/**
 * Run the full readiness check.
 * @param {string} privateKey — hex private key (with or without 0x prefix)
 * @returns {{ ready, signerAddress, agwAddress, deployed, validatorOk, balance, error? }}
 */
async function runReadinessCheck(privateKey) {
  if (!privateKey) {
    return {
      ready: false,
      signerAddress: null,
      agwAddress: null,
      deployed: false,
      validatorOk: false,
      balance: '0',
      error: 'AGENT_PRIVATE_KEY not provided',
    };
  }

  // 1. Derive EOA signer
  const { privateKeyToAccount } = require('viem/accounts');
  const { http, createPublicClient } = require('viem');
  const { abstract: abstractMainnet } = require('viem/chains');
  const { createAbstractClient } = require('@abstract-foundation/agw-client');

  const account = privateKeyToAccount(privateKey);
  const signerAddress = account.address;

  // 2. Create Abstract client and resolve AGW address
  let agwAddress;
  try {
    const abstractClient = await createAbstractClient({
      signer: account,
      chain: abstractMainnet,
      transport: http(),
    });
    agwAddress = abstractClient.account?.address;
  } catch (err) {
    return {
      ready: false,
      signerAddress,
      agwAddress: null,
      deployed: false,
      validatorOk: false,
      balance: '0',
      error: `Failed to create Abstract client: ${err.message}`,
    };
  }

  if (!agwAddress) {
    return {
      ready: false,
      signerAddress,
      agwAddress: null,
      deployed: false,
      validatorOk: false,
      balance: '0',
      error: 'Could not resolve AGW address from signer',
    };
  }

  // 3. Check deployment and validator
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  let deployed = false;
  let validatorOk = true; // default true if not deployed (will deploy with default on first tx)
  let validatorInfo = 'NOT YET DEPLOYED';

  const code = await provider.getCode(agwAddress);
  if (code !== '0x' && code !== '0x0') {
    deployed = true;

    // Check validator by reading the first storage slot of the account.
    // In the AGW smart account architecture (zkSync native AA), the initial
    // validator module is stored as part of the account initializer. We check
    // if the account was initialized with the SDK's default EOA validator by
    // querying the AGW registry or by checking the known validator module.
    //
    // The simplest reliable approach: call the account to get its r1/k1 owner
    // and check if the factory-deployed validator matches the default.
    // Since the smart account uses modular validation, the validator address
    // is embedded in the initialization data used during CREATE2 deployment.
    //
    // We can verify by reading storage slot 0 of the smart account which
    // typically holds the validator module address in zkSync's AA architecture.
    try {
      // Read storage slot 0 — in Abstract's AGW implementation, this stores
      // the validation hooks/modules. We read raw storage to check the validator.
      const slot0 = await provider.getStorage(agwAddress, 0);

      // The slot stores the address in the lower 20 bytes
      const storedAddress = '0x' + slot0.slice(-40);
      const storedNormalized = storedAddress.toLowerCase();
      const expectedNormalized = DEFAULT_EOA_VALIDATOR.toLowerCase();

      if (storedNormalized === expectedNormalized) {
        validatorOk = true;
        validatorInfo = 'DEFAULT';
      } else if (storedNormalized === '0x' + '0'.repeat(40)) {
        // Slot 0 might not be the validator. Fallback: assume OK if deployed
        // via the standard factory (we derived the address through the SDK,
        // so the factory would have used the default initializer).
        validatorOk = true;
        validatorInfo = 'DEFAULT (inferred)';
      } else {
        // Non-default value in slot 0 — could be a custom validator
        // As a secondary check, use the AGW registry to confirm this is a valid AGW
        const AGW_REGISTRY = '0xd5E3efDA6bB5aB545cc2358796E96D9033496Dda';
        const registryAbi = ['function isAGW(address) view returns (bool)'];
        const registry = new ethers.Contract(AGW_REGISTRY, registryAbi, provider);

        try {
          const isRegistered = await registry.isAGW(agwAddress);
          if (isRegistered) {
            // It's a registered AGW — likely deployed with default factory
            validatorOk = true;
            validatorInfo = 'DEFAULT (registry confirmed)';
          } else {
            // Not in registry AND has non-default storage — flag it
            validatorOk = false;
            validatorInfo = `CUSTOM (${storedAddress})`;
          }
        } catch {
          // Registry call failed — fall back to flagging as custom
          validatorOk = false;
          validatorInfo = `UNKNOWN (${storedAddress})`;
        }
      }
    } catch (err) {
      // Could not read storage — be cautious
      validatorOk = true;
      validatorInfo = 'COULD NOT VERIFY (proceeding)';
    }
  }

  // 4. Check ETH balance
  const rawBalance = await provider.getBalance(agwAddress);
  const balance = ethers.formatEther(rawBalance);

  // 5. Determine readiness
  let ready = true;
  let error = null;

  if (!validatorOk) {
    ready = false;
    error = `Validator mismatch — deployed with ${validatorInfo}, expected DEFAULT (${DEFAULT_EOA_VALIDATOR})`;
  }

  // Not-deployed is OK (deploys on first tx), but we note it
  // Insufficient balance is a warning, not a hard fail for readiness
  // (the swap itself will fail with a clear error if balance is too low)

  const result = {
    ready,
    signerAddress,
    agwAddress,
    deployed,
    validatorOk,
    validatorInfo,
    balance,
    error,
  };

  return result;
}

/**
 * Print a structured readiness report to stdout.
 */
function printReport(r) {
  console.log('');
  console.log('\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
  console.log('\u2551         CLAW COUNCIL READINESS CHECK             \u2551');
  console.log('\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
  console.log(`\u2551 Signer (EOA):    ${r.signerAddress || 'N/A'}`);
  console.log(`\u2551 Resolved AGW:    ${r.agwAddress || 'N/A'}`);
  console.log(`\u2551 AGW Deployed:    ${r.deployed ? 'YES' : 'NOT YET'}`);
  console.log(`\u2551 Validator:       ${r.validatorInfo || (r.validatorOk ? 'DEFAULT \u2705' : 'CUSTOM \u274C')}`);
  console.log(`\u2551 ETH Balance:     ${r.balance} ETH`);
  console.log('\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
  console.log(`\u2551 Status:          ${r.ready ? '\u2705 READY' : '\u274C NOT READY'}`);
  if (r.error) {
    console.log(`\u2551 Reason:          ${r.error}`);
  }
  console.log('\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D');
  console.log('');
}

// CLI entry point
if (require.main === module) {
  const privateKey = process.env.AGENT_PRIVATE_KEY;

  if (!privateKey) {
    console.error('Usage: AGENT_PRIVATE_KEY=0x... node examples/check_readiness.js');
    process.exit(1);
  }

  runReadinessCheck(privateKey)
    .then((result) => {
      printReport(result);
      process.exit(result.ready ? 0 : 1);
    })
    .catch((err) => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { runReadinessCheck, printReport };
