# Substrate Modification

* These pallets is for iNFT system.  `Anchor` is the pallet which can record the iNFT minting data on chain, can be traded between accounts easily. `Bounty` is the pallet to record the authority, when somebody want to mint bounty iNFT need to buy a ticket that is recorded on this pallet.

* Anchor Network is a droppable blockchain, the gas fee is pretty low.

## Running


## Details

### Account Format

* Locate to the file  `runtime\src\lib.rs`, the code is as follow:

  ```RUST
    parameter_types! {
      pub const Version: RuntimeVersion = VERSION;
      pub const SS58Prefix: u16 = 42;   //[0:Polkadot, 1:Kusama, 42:Substrate]
    }
  ```

### Balance

* Locate to the file  `node\src\chain_spec.rs`. Need to add `sp-core` on the project `Cargo.toml` and node  .  Then add the code as follow.

  ```TOML
    #project root Cargo.toml file. Path: ./Cargo.toml
    [workspace.dependencies]
    sp-core = { version = "34.0.0", default-features = false }
  ```

  ```TOML
    #node Cargo.toml. Path: ./node/Cargo.toml
    [dependencies]
    sp-core.workspace = true
    sp-core.default-features = true
  ```

  ```RUST
    fn testnet_genesis() -> Value {
      use sp_core::crypto::{Ss58Codec};
      use sp_runtime::{AccountId32};
      let account_id: AccountId32 = sp_core::crypto::Ss58Codec::from_ss58check("5FQmGPk7qGBmU3K6kDfMSBiUHBYq5NqXpx93KFEvDvyz5sRJ")
          .expect("Invalid SS58 address");

      let initial_balances: Vec<(AccountId32, u64)> = vec![
        (account_id.clone(), 20_000_000_000_000),     // Set 20M $ANK balance (6 decimal)
      ];
      
      json!({
        "balances": BalancesConfig {
          balances: initial_balances,
        },
        "sudo": SudoConfig { key: Some(AccountKeyring::Alice.to_account_id()) },
      })
    }
  ```

### Token Symbol

* Locate to the file  `node\src\chain_spec.rs`. The code as follow.

  ```RUST
    fn props() -> Properties {
      let mut properties = Properties::new();
      properties.insert("tokenDecimals".to_string(), 6.into());
      properties.insert("tokenSymbol".to_string(), "ANK".into());
      properties
    }
  ```

### Decimals

* Locate to the file  `node\src\chain_spec.rs`. The code is the same as `Token Symbol` setting.

## Resource

* Get the documents by Rust command `cargo doc --open`, you can get the URL `{ROOT_FOLDER_OF_PROJECT}/target/doc/minimal_template_node/index.html`.