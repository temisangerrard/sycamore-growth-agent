CREATE TABLE IF NOT EXISTS workspace (id INTEGER PRIMARY KEY CHECK(id=1), version INTEGER NOT NULL DEFAULT 0, document TEXT NOT NULL);
INSERT OR IGNORE INTO workspace(id,version,document) VALUES(1,0,'{"records":[],"suppression":[]}');
CREATE TABLE IF NOT EXISTS research (id INTEGER PRIMARY KEY CHECK(id=1),document TEXT NOT NULL);
