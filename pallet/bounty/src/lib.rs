
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

pub use pallet::*;					//must put here
pub use pallet_anchor as anchor; 

// #[cfg(test)]
// mod tests;

pub mod weights;
pub use weights::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::config]
	pub trait Config: frame_system::Config + anchor::Config {
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
	#[pallet::getter(fn bounty)]
	pub(super) type Bounty<T: Config> = StorageNMap<	
		_,
		(
			NMapKey<Twox64Concat, Vec<u8>>,				//anchor name of bounty
			NMapKey<Twox64Concat, BlockNumberFor<T>>,	//bounty update blocknumber
		),
		(T::AccountId, u64, BlockNumberFor<T>)			// ( { owner of bounty }, { price of ticket }, { expired blocknumer } )
	>;
 
	/// Multi-key storage map to save the tickets record. (Bounty, Block, Account) => ( call blocknumber )
	#[pallet::storage]
	#[pallet::getter(fn access)]
	pub(super) type Tickets<T: Config> = StorageNMap<	
		_,
		(
			NMapKey<Twox64Concat, Vec<u8>>,				//anchor name of bounty
			NMapKey<Twox64Concat, BlockNumberFor<T>>,	//bounty update blocknumber
			NMapKey<Blake2_128Concat, T::AccountId>,	//ticket buyer account
		),	
		BlockNumberFor<T>								// blocknumber of buying stamptime
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

			//error on "pallet_anchor", associated type `pallet_anchor` not found
			//let result=T::pallet_anchor::is_owner(&name,sender);
			
			//error on "is_owner", not found in `pallet_anchor`
			//let result=pallet_anchor::is_owner(&name,sender);

			//error on "pallet_anchor", not a type`
			//let result=<pallet_anchor<T>>::is_owner(&name,sender);

			//error on "is_owner", not found in `pallet_anchor`
			//let result=pallet_anchor::<T>::is_owner(&name,sender);

			//the function or associated item `is_owner` exists for struct `Pallet<T>`, but its trait bounds were not satisfied
			//error on "is_owner", function or associated item cannot be called on `Pallet<T>` due to unsatisfied trait bounds
			//let result=pallet_anchor::Pallet::<T>::is_owner(&name,sender);

			let result=anchor::Pallet::<T>::is_owner(&name,&sender);

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

			let current_block_number = <frame_system::Pallet<T>>::block_number();
			<Tickets<T>>::insert((name,block,&sender), current_block_number);

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

		#[pallet::call_index(3)]
		#[pallet::weight(
			<T as pallet::Config>::WeightInfo::create()
		)]
		pub fn update_expire(
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