-- PostgreSQL Schema
CREATE TABLE analyses (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    analysis_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
