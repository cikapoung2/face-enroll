CREATE TABLE IF NOT EXISTS students (student_id TEXT PRIMARY KEY, name TEXT NOT NULL, classroom TEXT, descriptors TEXT NOT NULL, consent_at TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS attendance (student_id TEXT NOT NULL, day TEXT NOT NULL, checked_at TEXT NOT NULL, PRIMARY KEY (student_id, day));
