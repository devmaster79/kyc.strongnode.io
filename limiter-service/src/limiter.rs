use dashmap::DashMap;
use std::sync::Arc;

use crate::utils::now;

#[derive(Clone)]
pub struct Limiter {
    config: LimiterConfig,
    trials: Arc<DashMap<String, Trial>>,
}

impl Limiter {
    pub fn new(config: LimiterConfig) -> Self {
        Self {
            config,
            trials: Arc::new(DashMap::new()),
        }
    }

    /// Decide whether the user should be banned or not
    /// + increase trial count
    pub fn access(&self, id: String) -> AccessResult {
        let now: u128 = now().as_millis();
        let mut trial = self.trials.entry(id).or_insert(Trial {
            next_free_time: None,
            count: 1,
            updated_at: now,
        });
        trial.updated_at = now;

        // STEP 1: set the next free-to-try time
        if trial.count > self.config.max_free_trials {
            match trial.next_free_time {
                // CASE: user should be banned
                None => {
                    trial.next_free_time = Some(
                        calculate_next_free_time(&self.config, trial.count)
                            .try_into()
                            .unwrap(),
                    );
                }

                // CASE: ban expired so the user get another [max_free_trials] free trials
                // starting with this one
                Some(x) if x <= now && self.config.reset_count_after_ban_expires => {
                    trial.count = 1;
                    trial.next_free_time = None;
                }

                // CASE: ban expired so we allow one free trial and renew the ban
                Some(x) if x <= now && !self.config.reset_count_after_ban_expires => {
                    trial.count += 1;
                    trial.next_free_time = Some(
                        calculate_next_free_time(&self.config, trial.count)
                            .try_into()
                            .unwrap(),
                    );
                    return AccessResult::ALLOWED;
                }
                // CASE: user is simply banned and the ban not even expired
                _ => (),
            }
        }

        // STEP 2: check next free time
        if let Some(next_free_time) = trial.next_free_time {
            if next_free_time > now {
                return AccessResult::DENIED { next_free_time };
            }
        }

        trial.count += 1;
        return AccessResult::ALLOWED;
    }

    /// Free user from the ban
    pub fn resolve(&self, id: String) {
        self.trials.remove(&id);
    }

    pub fn clear_obsoletes(&self) {
        let now_ms = now().as_millis();
        let ban_ms = (self.config.ban_minutes_base * 60. * 1000.) as u128;
        self.trials.retain(|_, trial| {
            if let Some(x) = trial.next_free_time {
                x < now_ms
            } else {
                trial.updated_at < ban_ms
            }
        });
    }
}

fn calculate_next_free_time(config: &LimiterConfig, trials: usize) -> u128 {
    let excess_trials = trials as i32 - config.max_free_trials as i32;
    let base = config.ban_minutes_base;
    let m = config.multiplier;
    let e = excess_trials - 1;
    let ban_ms = base * m.powi(e) * 60f32 * 1000f32;
    now().as_millis() + ban_ms as u128
}

#[derive(Clone)]
pub struct LimiterConfig {
    pub max_free_trials: usize,
    pub ban_minutes_base: f32,
    pub multiplier: f32,
    pub reset_count_after_ban_expires: bool,
}

struct Trial {
    next_free_time: Option<u128>,
    count: usize,
    updated_at: u128,
}

pub enum AccessResult {
    ALLOWED,
    DENIED { next_free_time: u128 },
}

#[cfg(test)]
mod test {
    use super::*;

    impl AccessResult {
        fn next_free_time(&self) -> Option<u128> {
            match self {
                Self::ALLOWED => None,
                Self::DENIED { next_free_time } => Some(*next_free_time),
            }
        }
    }

    impl Limiter {
        fn simulate_expiration(&self, id: &str) {
            self.trials.get_mut(id).unwrap().next_free_time = Some(now().as_millis() - 1)
        }
    }

    #[test]
    fn it_should_allow_and_deny_well() {
        // GIVEN
        let limiter = Limiter::new(LimiterConfig {
            max_free_trials: 2,
            ban_minutes_base: 10.,
            multiplier: 2.,
            reset_count_after_ban_expires: false,
        });

        let user_id = String::from("something");

        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::ALLOWED
        ));
        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::ALLOWED
        ));
        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::DENIED { .. }
        ));

        limiter.resolve(user_id.clone());

        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::ALLOWED
        ));
        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::ALLOWED
        ));
        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::DENIED { .. }
        ));
    }

    #[test]
    fn it_should_calculate_the_next_time_well() {
        // GIVEN
        let limiter = Limiter::new(LimiterConfig {
            max_free_trials: 2,
            ban_minutes_base: 10.,
            multiplier: 2.,
            reset_count_after_ban_expires: false,
        });

        let user_id = String::from("something");
        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::ALLOWED
        ));
        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::ALLOWED
        ));

        let now_ms = now().as_millis();
        let time = limiter.access(user_id.clone()).next_free_time().unwrap();
        assert!(
            now_ms + 10 * 60 * 1000 - time < 1000,
            "time: {:?}, now_ms: {:?}",
            time,
            now_ms
        );
        limiter.simulate_expiration(&user_id);
        assert!(matches!(
            limiter.access(user_id.clone()),
            AccessResult::ALLOWED
        ));
        let now_ms = now().as_millis();
        let time = limiter.access(user_id.clone()).next_free_time().unwrap();
        assert!(
            now_ms + 10 * 2 * 60 * 1000 - time < 1000,
            "time: {:?}, now_ms: {:?}",
            time,
            now_ms
        );
    }
}
