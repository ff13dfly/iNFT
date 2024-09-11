
// Ensure we're `no_std` when compiling for Wasm.
#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	dispatch::{DispatchResult},
	traits::{Currency,ExistenceRequirement},
	weights::Weight,
};
use frame_system::ensure_signed;
use sp_runtime::{
	traits::{SaturatedConversion,StaticLookup},
	Vec,
};

// here to import all pallets ?
pub use pallet::*;

#[cfg(test)]
mod tests;

pub mod weights;
pub use weights::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::config]
	pub trait Config: frame_system::Config {
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		type WeightInfo: WeightInfo;
		type Currency: Currency<Self::AccountId>;
	}

	pub(crate) const STORAGE_VERSION: StorageVersion = StorageVersion::new(1);

    #[pallet::pallet]
	#[pallet::storage_version(STORAGE_VERSION)]
	#[pallet::without_storage_info]
	pub struct Pallet<T>(_);

    #[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn on_initialize(_n: BlockNumberFor<T>) -> Weight {
			Weight::zero()
		}
		fn on_finalize(_n: BlockNumberFor<T>) {}
		fn offchain_worker(_n: BlockNumberFor<T>) {}
	}

    #[pallet::error]
	pub enum Error<T> {

        ///unknown anchor owner data in storage.
		UnexceptError,
    }

    #[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// An bounty is created.
		BountyCreated(Vec<u8>, u64, T::AccountId, u64, T::AccountId),		//(name,blocknumber,owner, price , expired)
    }


    /// Hashmap to record bounty, (Bounty Anchor, Block) => ( Owner, Price, Expired Blocknumber )
	#[pallet::storage]
	#[pallet::getter(fn bountyOwner)]
	pub(super) type Bounty<T: Config> = StorageMap<	
		_, 
		Twox64Concat,
		(Vec<u8>,BlockNumberFor<T>),
		(T::AccountId,u64,BlockNumberFor<T>)
	>;
 
	/// Multi-key storage map to save the tickets record. (Bounty, Block, Account) => ( call blocknumber )
	#[pallet::storage]
	#[pallet::getter(fn accountTicket)]
	pub(super) type Tickets<T: Config> = StorageMap<	
		_, 
		Twox64Concat,
		(T::AccountId,Vec<u8>,BlockNumberFor<T>),
		BlockNumberFor<T>
	>;

    #[pallet::call]
	impl<T: Config> Pallet<T> {

        #[pallet::call_index(0)]
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::create()
		)]
		pub fn create(
			origin: OriginFor<T>,
			name: Vec<u8>,						//bounty anchor name
			block:BlockNumberFor<T>,			//bonnty detail block
			price: u64, 						//ticket price of the bounty
			expired:BlockNumberFor<T>			//the expired blocknumber, when expired, can not buy. 0 for unlimited
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;

			//1.check the owner of bounty anchor

			//2.check wether created

			//3.
            Ok(())
        }

		#[pallet::call_index(1)]
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::create()
		)]
		pub fn ticket(
			origin: OriginFor<T>,
			name: Vec<u8>,
			block:BlockNumberFor<T>
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;

            Ok(())
        }

		#[pallet::call_index(2)]
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::create()
		)]
		pub fn update_price(
			origin: OriginFor<T>,
			name: Vec<u8>,
			block:BlockNumberFor<T>,
			price: u64
		) -> DispatchResult {
			let sender = ensure_signed(origin)?;

            Ok(())
        }

    }
}