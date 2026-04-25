-- ============================================================
-- 1. Create the product_reviews table (if it doesn't exist)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reviewer_name TEXT         NOT NULL,
    rating        INTEGER      NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment       TEXT         NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx
    ON product_reviews (product_id);

-- ============================================================
-- 2. Enable RLS and allow public read access
-- ============================================================
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on product_reviews" ON product_reviews;
CREATE POLICY "Allow public read on product_reviews"
    ON product_reviews FOR SELECT
    USING (true);

-- ============================================================
-- 3. Clear old reviews and insert fresh ones
--    Products get 2, 3, or 5 reviews depending on their position
--    (rn % 3 = 0 → 2 reviews, rn % 3 = 1 → 3 reviews, rn % 3 = 2 → 5 reviews)
-- ============================================================
DELETE FROM product_reviews;

WITH numbered_products AS (
    SELECT id, (row_number() OVER (ORDER BY created_at) - 1) AS rn
    FROM products
    WHERE is_active = true
),
review_templates (seq, reviewer_name, rating, comment) AS (
    VALUES
    (1, 'Ali Khalil',       5, 'Amazing quality, exactly what I was looking for! Will definitely order again.'),
    (2, 'Sara Haddad',      5, 'Super cute and well made, shipping was fast too. Totally worth it!'),
    (3, 'Ahmad Nassar',     4, 'Really good product overall. Delivery was quick and packaging solid.'),
    (4, 'Rima Khoury',      5, 'Mnii7 ktiir! I got two because I could not resist, haida shi la7alo.'),
    (5, 'Jad Moussa',       4, 'Honestly exceeded my expectations. Fast delivery and the packaging was perfect.')
),
review_counts AS (
    SELECT
        id,
        CASE rn % 3
            WHEN 0 THEN 2
            WHEN 1 THEN 3
            ELSE 5
        END AS max_reviews
    FROM numbered_products
)
INSERT INTO product_reviews (product_id, reviewer_name, rating, comment, created_at)
SELECT
    rc.id,
    rt.reviewer_name,
    rt.rating,
    rt.comment,
    now() - (random() * interval '90 days')
FROM review_counts rc
JOIN review_templates rt ON rt.seq <= rc.max_reviews;

-- ============================================================
-- 4. Update product rating & rating_count from actual review data
-- ============================================================
UPDATE products p
SET
    rating       = sub.avg_rating,
    rating_count = sub.cnt
FROM (
    SELECT
        product_id,
        ROUND(AVG(rating)::numeric, 1) AS avg_rating,
        COUNT(*)                        AS cnt
    FROM product_reviews
    GROUP BY product_id
) sub
WHERE p.id = sub.product_id;
