CREATE TABLE IF NOT EXISTS marketplaces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    currency_code VARCHAR(3) NOT NULL,
    platform_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    external_id VARCHAR(255) DEFAULT NULL,
    base_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_platform_name (platform_name),
    INDEX idx_country_code (country_code),
    INDEX idx_external_id (external_id)
); 