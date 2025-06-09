ALTER TABLE restaurants ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

UPDATE restaurants SET user_id = 1 WHERE id = 1;
UPDATE restaurants SET user_id = 1 WHERE id = 2;
UPDATE restaurants SET user_id = 2 WHERE id = 3;
UPDATE restaurants SET user_id = 3 WHERE id = 4;
UPDATE restaurants SET user_id = 4 WHERE id = 5;
UPDATE restaurants SET user_id = 5 WHERE id = 6;
UPDATE restaurants SET user_id = 6 WHERE id = 7;
UPDATE restaurants SET user_id = 7 WHERE id = 8;
UPDATE restaurants SET user_id = 8 WHERE id = 9;
UPDATE restaurants SET user_id = 9 WHERE id = 10;