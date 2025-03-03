import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Test profile creation and retrieval",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('skill-grid', 'create-profile', 
        [types.ascii("Test Profile")], 
        wallet1.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    
    let response = chain.callReadOnlyFn(
      'skill-grid',
      'get-profile',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    
    response.result.expectOk().expectSome();
  }
});

Clarinet.test({
  name: "Test skill addition and level updates",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    // Add skill
    let block = chain.mineBlock([
      Tx.contractCall('skill-grid', 'add-skill',
        [types.ascii("Smart Contracts"), types.uint(1)],
        wallet1.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Check initial level
    let response = chain.callReadOnlyFn(
      'skill-grid',
      'get-skill-level',
      [types.principal(wallet1.address), types.ascii("Smart Contracts")],
      wallet1.address
    );
    
    response.result.expectOk().expectUint(1);
    
    // Update level
    block = chain.mineBlock([
      Tx.contractCall('skill-grid', 'update-skill-level',
        [types.ascii("Smart Contracts"), types.uint(2)],
        wallet1.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Verify updated level
    response = chain.callReadOnlyFn(
      'skill-grid',
      'get-skill-level',
      [types.principal(wallet1.address), types.ascii("Smart Contracts")],
      wallet1.address
    );
    
    response.result.expectOk().expectUint(2);
  }
});

Clarinet.test({
  name: "Test invalid skill level handling",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    // Try to add skill with invalid level
    let block = chain.mineBlock([
      Tx.contractCall('skill-grid', 'add-skill',
        [types.ascii("Invalid Skill"), types.uint(6)],
        wallet1.address
      )
    ]);
    
    block.receipts[0].result.expectErr().expectUint(102);
  }
});
