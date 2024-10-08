# Integration of Anchor Pallet

* Anchor is an On-chain Linked List pallet for [substrate](https://github.com/paritytech/substrate), it is based on substrate transfer extension.

* You can storage data on chain by anchor, as this way, it is a On-chain Key-value Storage.

* Anchor is also can be treaded as Name Service, you can own special anchor name by initializing it. 

## Mini Template

* Target source: [https://github.com/paritytech/polkadot-sdk-minimal-template](https://github.com/paritytech/polkadot-sdk-minimal-template)

* This is a min substrate node, only basic pallets.

### How To

* Add new folder `anchor` under `./pallets`, link source code from [https://github.com/ff13dfly/iNFT/tree/master/pallet](https://github.com/ff13dfly/iNFT/tree/master/pallet). The substrate template folder `/Users/fuzhongqiang/Desktop/www/pure`

  ```BASH
    cd pallets/anchor
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/anchor/Cargo_mini_template.toml Cargo.toml

    mkdir src
    cd src
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/anchor/src/lib.rs lib.rs
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/anchor/src/tests.rs tests.rs
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/anchor/src/weights.rs weights.rs
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/anchor/src/benchmarking.rs benchmarking.rs
  ```

* Add `Anchor Pallet` to root `Cargo.toml`.

  ```TOML
    [workspace]
    members = [
        ...,
        "pallets/anchor",
    ]

    [workspace.dependencies]
    ...,
    pallet-anchor = { path = "./pallets/anchor", default-features = false }
  ```

* Add `Anchor Pallet` to `./runtime/Cargo.toml`.
  
  ```RUST
    [dependencies]
    ...
    pallet-anchor.workspace = true

    [features]
    ...
    "pallet-anchor/std",
  ```


* Add `Anchor Pallet` to `./runtime/src/lib.rs`, two parts as follow.

  ```RUST
    #[runtime]
    mod runtime {
      ...

      /// Anchor Pallet, linked list on chain.
      #[runtime::pallet_index(6)]
      pub type Anchor = pallet_anchor::Pallet<Runtime>;
    }

    //after `impl pallet_minimal_template::Config for Runtime {}`
    impl pallet_anchor::Config for Runtime {
      type RuntimeEvent = RuntimeEvent;
      type Currency = Balances;
      type WeightInfo = pallet_anchor::weights::SubstrateWeight<Runtime>;
    }
  ```

## Resource