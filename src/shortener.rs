use rand::{distr::Alphanumeric, Rng};

// Generate a random short ID for a URL
pub fn generate_short_id(length: usize) -> String {
    rand::rng()
        .sample_iter(&Alphanumeric)
        .take(length)
        .map(char::from)
        .collect()
}

// Validate URL format
pub fn is_valid_url(url: &str) -> bool {
    url.starts_with("http://") || url.starts_with("https://")
}