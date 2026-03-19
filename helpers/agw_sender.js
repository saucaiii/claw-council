#!/usr/bin/env node
/**
 * AGW Transaction Sender Bridge
 * ==============================
 * Thin bridge between the Python PENGU bot and Abstract's AGW SDK.
 * 
 * CRITICAL: Uses `abstract` chain from viem/chains (NOT a generic defineChain).
 * The viem chain definition includes Abstract's custom EIP-712 transaction
 * serializer. Without it: "transaction serializer not found on chain".
 * 
 * Usage (called by Python via subprocess):
 *   node agw_sender.js <json_args>
 * 
 * JSON args:
 *   {
 *     "to": "0x...",
 *     "data": "0x...",
 *     "value": "0",
 *     "privateKey": "0x..."
 *   }
 * 
 * Output (JSON to stdout):
 *   { "success": true, "txHash": "0x..." }
 *   { "success": false, "error": "..." }
 */

const { createAbstractClient } = require('@abstract-foundation/agw-client');
const { http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { abstract: abstractMainnet } = require('viem/chains');

async function main() {
  const argsJson = process.argv[2];
  if (!argsJson) {
    console.log(JSON.stringify({ success: false, error: 'No arguments provided' }));
    process.exit(1);
  }

  let args;
  try {
    args = JSON.parse(argsJson);
  } catch (e) {
    console.log(JSON.stringify({ success: false, error: `Invalid JSON: ${e.message}` }));
    process.exit(1);
  }

  const { to, data, value, privateKey } = args;

  if (!to || !privateKey) {
    console.log(JSON.stringify({ success: false, error: 'Missing required fields: to, privateKey' }));
    process.exit(1);
  }

  try {
    const account = privateKeyToAccount(privateKey);

    const abstractClient = await createAbstractClient({
      signer: account,
      chain: abstractMainnet,
      transport: http(),
    });

    const agwAddress = abstractClient.account?.address;

    const txParams = {
      to,
      data: data || '0x',
      value: value ? BigInt(value) : 0n,
    };

    const txHash = await abstractClient.sendTransaction(txParams);

    console.log(JSON.stringify({
      success: true,
      txHash,
      agwAddress,
      signerAddress: account.address,
    }));

  } catch (e) {
    console.log(JSON.stringify({
      success: false,
      error: e.message || String(e),
      shortMessage: e.shortMessage || '',
    }));
    process.exit(1);
  }
}

main();
