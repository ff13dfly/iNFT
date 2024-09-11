#![cfg_attr(rustfmt, rustfmt_skip)]
#![allow(unused_parens)]
#![allow(unused_imports)]

use frame_support::{traits::Get, weights::{Weight, constants::RocksDbWeight}};
use core::marker::PhantomData;

/// Weight functions needed for pallet_bounty.
pub trait WeightInfo {
    fn create() -> Weight;
}

/// Weights for pallet_anchor using the Substrate node and recommended hardware.
pub struct SubstrateWeight<T>(PhantomData<T>);
impl<T: frame_system::Config> WeightInfo for SubstrateWeight<T> {

    fn create() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(T::DbWeight::get().writes(1_u64))
	}
}

// For backwards compatibility and tests
impl WeightInfo for () {
    fn create() -> Weight {
		Weight::from_parts(10_000_000, 12000)
			.saturating_add(RocksDbWeight::get().writes(1_u64))
	}
}