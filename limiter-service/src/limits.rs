use std::collections::HashMap;

use crate::limiter::{Limiter, LimiterConfig};

#[derive(Clone)]
pub struct Limits {
    limiters: HashMap<String, Limiter>,
}
impl Limits {
    /// New should be called only once
    pub fn new() -> Self {
        let mut map = HashMap::new();
        /*
         * Limit to prevent SMS flood attack.
         * Characteristics (T= trial): T T 5 T 5 T 5 T 5 ...
         */
        map.insert(
            "smsSend".into(),
            Limiter::new(LimiterConfig {
                max_free_trials: 2,   // After 2 trials and every consecutive trials
                ban_minutes_base: 5., // 5 min ban
                multiplier: 1.,       // Do not increase the time
                reset_count_after_ban_expires: false, // false = allow only 1 trial after ban expires
            }),
        );

        /*
         * Limit to prevent brute force OTP attack.
         * Characteristics (T= trial): T T T 5 T 50 T 500 T 5000 ...
         */
        map.insert(
            "authenticatorAuth".into(),
            Limiter::new(LimiterConfig {
                max_free_trials: 3,   // After 3 trials and on every consecutive trials
                ban_minutes_base: 5., // 5 min ban
                multiplier: 10.,
                reset_count_after_ban_expires: false, // false = allow only 1 trial after ban expires
            }),
        );

        /*
         * Limit to prevent brute force Password attack.
         * Characteristics (T= trial): T T T T T 5 T 15 T 45 T 135 ...
         */
        map.insert(
            "passwordAuth".into(),
            Limiter::new(LimiterConfig {
                max_free_trials: 5,   // After 5 trials and on every consecutive trials
                ban_minutes_base: 5., // 5 min ban
                multiplier: 3.,
                reset_count_after_ban_expires: false, // false = allow only 1 trial after ban expires
            }),
        );

        /*
         * Limit to prevent high AWS costs for identity verification
         * This limit is calculated together with 2 uploads + 1 submit
         *
         * Characteristics (T^N= N trials): T^60 5hour T^60 25hour T^60 ...
         */
        map.insert(
            "identityVerificationLimit".into(),
            Limiter::new(LimiterConfig {
                // for letting users correct their picture issues like "head is not straight enough"
                // I estimate the maximum trials for one photo is about 20
                // identity verification has two photos, so its 40
                // and with each trial the user can submit the form which is another 20 so 60
                max_free_trials: 60,
                ban_minutes_base: 5. * 60.,          // 5 hour cool down
                multiplier: 5., // after 5 hour ban and another 60 trials the user will be banned from the feature for a whole day
                reset_count_after_ban_expires: true, // after the ban expires the user can send another 60 requests
            }),
        );

        Limits { limiters: map }
    }

    /// clone the limiter
    /// The history is under a RC so cloning is cheap
    pub fn get_limiter(&self, name: &str) -> Option<Limiter> {
        Some(self.limiters.get(name)?.clone())
    }

    pub fn clean_obsoletes(&self) {
        self.limiters.iter().for_each(|(_, limiter)| {
            limiter.clear_obsoletes()
        })
    }
}
