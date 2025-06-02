INSERT INTO user_follows_user (follower_id, followed_id)
VALUES
  (1, 2),
  (1, 3),
  (1, 4),
  (2, 1),
  (3, 1),
  (4, 1),
  (2, 3),
  (3, 4),
  (4, 2);

INSERT INTO user_follows_restaurant (user_id, restaurant_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 4),
  (2, 5),
  (3, 2),
  (3, 3),
  (3, 6),
  (4, 1),
  (4, 7);