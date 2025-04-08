use locci_url::shortener;

#[test]
fn test_generate_short_id() {
    let id1 = shortener::generate_short_id(6);
    let id2 = shortener::generate_short_id(6);
    
    // Test that IDs are the expected length
    assert_eq!(id1.len(), 6);
    assert_eq!(id2.len(), 6);
    
    // Test that IDs are different (this could theoretically fail, but it's extremely unlikely)
    assert_ne!(id1, id2);
}

#[test]
fn test_is_valid_url() {
    // Valid URLs
    assert!(shortener::is_valid_url("http://example.com"));
    assert!(shortener::is_valid_url("https://example.com"));
    assert!(shortener::is_valid_url("https://example.com/path?query=param"));
    
    // Invalid URLs
    assert!(!shortener::is_valid_url("example.com"));
    assert!(!shortener::is_valid_url("ftp://example.com"));
    assert!(!shortener::is_valid_url(""));
}
