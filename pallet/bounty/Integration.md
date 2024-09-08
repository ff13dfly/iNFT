# Integration of Bounty Pallet

* Bounty Pallet is the authority tool for iNFT bounty.

* User need to pay the authority fee to bounty owner, the fee is set by the Bounty Pallet. As the payment needed, Bounty Pallet is used to manage the iNFT bounty task. 

## Mini Template

* Target source: [https://github.com/paritytech/polkadot-sdk-minimal-template](https://github.com/paritytech/polkadot-sdk-minimal-template)

* This is a min substrate node, only basic pallets.

### How To

* Add new folder `bounty` under `./pallets`, link source code from [https://github.com/ff13dfly/iNFT/tree/master/pallet](https://github.com/ff13dfly/iNFT/tree/master/pallet). The substrate template folder `/Users/fuzhongqiang/Desktop/www/pure/`

  ```BASH
    cd pallets/bounty
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/bounty/Cargo_mini_template.toml Cargo.toml

    mkdir src
    cd src
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/bounty/src/lib.rs lib.rs
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/bounty/src/tests.rs tests.rs
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/bounty/src/weights.rs weights.rs
    ln /Users/fuzhongqiang/Desktop/www/iNFT/pallet/bounty/src/benchmarking.rs benchmarking.rs
  ```

* copy `Cargo_mini_template.toml` to `./pallets/bounty/Cargo_mini.toml`;

* Add `Bounty Pallet` to root `Cargo.toml`.

  ```TOML
    [workspace]
    members = [
        ...,
        "pallets/bounty",
    ]

    [workspace.dependencies]
    ...,
    pallet-anchor = { path = "./pallets/bounty", default-features = false }
  ```

* Add `Bounty Pallet` to runtime, two parts as follow.

  ```RUST
    #[runtime]
    mod runtime {
      ...

      /// Anchor Pallet,linked list on chain.
      #[runtime::bounty_index(7)]
      pub type Anchor = pallet_bounty::Pallet<Runtime>;
    }

    impl pallet_bounty::Config for Runtime {
      type RuntimeEvent = RuntimeEvent;
      type Currency = Balances;
      type WeightInfo = pallet_bounty::weights::SubstrateWeight<Runtime>;
    }
  ```

* Modify the `tokenSymbol` to `ANK`. Open the file `./node/src/chain_spec.rs` to search `tokenSymbol`.Replace it with the name you love.

## Resource