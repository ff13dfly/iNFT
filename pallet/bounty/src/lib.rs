
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
		///Anchor do not belong to the account
		AnchorNotBelogToAccount,

		///No zero blocknumber of bounty
		NoZeroBlocknumber,

		///Bounty price can not more than 20M ( the limitation of $ANK )
		PriceMaxLimited,

		///Bounty already exsist.
		BountyExsisted,

		///Bounty is not exsisted.
		BountyNotExsisted,

		///Low balance of ticket buyer
		InsufficientBalance,

		///Not allowed creator to buy ticket 
		NotAllowedByCreator,

		///The bounty is expired.
		ExpiredBounty,

		///Ticket already exsist
		TicketExsisted,

		///Transaction failed by any reason.
		TransferFailed,

        ///unknown anchor owner data in storage.
		UnexceptError,
    }

    #[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// An bounty is created.
		BountyCreated(Vec<u8>, BlockNumberFor<T>, T::AccountId, u64, BlockNumberFor<T>),		//(name,blocknumber,owner, price , expired)
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
		(
			T::AccountId,			//owner of bounty
			u64, 					//price of ticket
			BlockNumberFor<T>		// expired blocknumer
		)			
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

	const MAX_PRICE:u64=1000000*20000000;

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
			
			//1.Parameters checking
			//1.1.confirm the price limit
			ensure!(price < MAX_PRICE, Error::<T>::PriceMaxLimited);

			let val:u64=0;
			let zero :BlockNumberFor<T> = val.saturated_into();
			ensure!(block != zero, Error::<T>::NoZeroBlocknumber);

			//2.confirm the ownship of anchor to setup bounty.
			let sender = ensure_signed(origin)?;
			let owned=anchor::Pallet::<T>::is_owner(&name,&sender);
			ensure!(owned, Error::<T>::AnchorNotBelogToAccount);

			//3. check wether exsist
			let bounty =<Bounty<T>>::get((&name,&block));
			ensure!(bounty.is_none(),Error::<T>::BountyExsisted);

			//4.insert bounty data
			<Bounty<T>>::insert(
				(&name,&block), 
				(&sender,&price,&expired)
			);

			//5.deposit eveen
			Self::deposit_event(Event::BountyCreated(name,block,sender,price,expired));

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

			//1.Parameters checking
			//1.1.confirm the price limit
			let val:u64=0;
			let zero :BlockNumberFor<T> = val.saturated_into();
			ensure!(block != zero, Error::<T>::NoZeroBlocknumber);
			
			//2.confirm bounty exsist
			let sender = ensure_signed(origin)?;
			let bounty =<Bounty<T>>::get((&name,&block));
			ensure!(!bounty.is_none(), Error::<T>::BountyNotExsisted);
			
			match bounty {
				Some((to, price, expired)) => {
					//3.1. check wether expired
					if expired!= zero {
						let current_block_number = <frame_system::Pallet<T>>::block_number();
						ensure!(current_block_number <= expired, Error::<T>::ExpiredBounty);
					}

					//3.2. check wether the creator
					ensure!(&to!=&sender, Error::<T>::NotAllowedByCreator);

					//3.3.check wether ticket exsist;
					let ticket =<Tickets<T>>::get((&name,&block,&sender));
					ensure!(ticket.is_none(), Error::<T>::TicketExsisted);
					
					//3.4. check balance
					ensure!(<T as pallet::Config>::Currency::free_balance(&sender) >= price.saturated_into(), Error::<T>::InsufficientBalance);

					//3.5.do transfer
					let transaction=<T as pallet::Config>::Currency::transfer(
						&sender,		//transfer from
						&to,			//transfer to
						price.saturated_into(),		//ticket price to pay
						ExistenceRequirement::AllowDeath
					);
					ensure!(transaction.is_ok(), Error::<T>::TransferFailed);

					//5.insert the ticket record;
					let record_block_number = <frame_system::Pallet<T>>::block_number();
					<Tickets<T>>::insert((name,block,&sender), record_block_number);
					Ok(())
				},
				None => {
					return Err(Error::<T>::BountyNotExsisted.into());
				}
			}	
        }
    }
}