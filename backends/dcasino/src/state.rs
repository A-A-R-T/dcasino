use cosmwasm_std::{StdResult, Storage};
use schemars::JsonSchema;
use secret_toolkit::serialization::Json;
use secret_toolkit::storage::{Item, Keymap, KeymapBuilder, WithoutIter};
use serde::{Deserialize, Serialize};

use crate::users::User;

/******************************************************************************
 Globals
*******************************************************************************/

/// BEGIN AUTOGEN GENESIS_DATA
// pub static GENESIS_SU: &str;
// pub static VALIDATOR_ADDR: &str;
/// END AUTOGEN

pub static USERS: Keymap<String, User,  Json, WithoutIter> = KeymapBuilder::new(b"users").without_iter().build();
pub static NATIVE: &'static str = "uscrt";
pub static VIEWING_KEYS: Keymap<String, String, Json, WithoutIter> = KeymapBuilder::new(b"viewing_keys").without_iter().build();
pub static SU: Keymap<String, u8,  Json, WithoutIter> = KeymapBuilder::new(b"su").without_iter().build();
pub static CHILD_CONTRACTS: Keymap<String, String,  Json, WithoutIter> = KeymapBuilder::new(b"child_contracts").without_iter().build();
pub static CONFIG: Item<Config, Json> = Item::new(b"config");

#[derive(Serialize, Debug, Deserialize, Clone, JsonSchema)]
pub struct Config {
    pub is_live: bool,
}

impl Config {
    pub fn load(store: & dyn Storage) -> StdResult<Self> {
        CONFIG.load(store)
    }

    pub fn save(self, store: &mut dyn Storage) -> StdResult<()> {
        CONFIG.save(store, &self)
    }
}