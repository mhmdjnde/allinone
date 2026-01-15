insert into product_types (name, slug, description)
values
    ('Apparel', 'apparel', 'Everyday clothing essentials.'),
    ('Gear', 'gear', 'Daily carry and travel gear.'),
    ('Tech', 'tech', 'Practical tech accessories.'),
    ('Home', 'home', 'Home and workspace essentials.')
on conflict (slug) do nothing;

insert into products (
    product_type_id,
    name,
    slug,
    description,
    price,
    tag,
    image_path,
    image_alt
)
select
    pt.id,
    p.name,
    p.slug,
    p.description,
    p.price,
    p.tag,
    p.image_path,
    p.image_alt
from (
    values
        ('apparel', 'Minimal Hoodie', 'minimal-hoodie', 'Soft brushed fleece with a structured fit and clean seams for daily wear.', 39.00, 'New', 'products/minimal-hoodie.jpg', 'Minimal hoodie'),
        ('gear', 'Daily Backpack', 'daily-backpack', 'Lightweight carry with padded straps, quick-access pockets, and room for everything.', 49.00, 'Best', 'products/daily-backpack.jpg', 'Daily backpack'),
        ('tech', 'Wireless Earbuds', 'wireless-earbuds', 'Clean sound, low-latency pairing, and an ultra-compact charging case.', 59.00, 'New', 'products/wireless-earbuds.jpg', 'Wireless earbuds'),
        ('home', 'Desk Lamp', 'desk-lamp', 'Warm ambient glow with a slim profile and touch-dim controls.', 29.00, 'New', 'products/desk-lamp.jpg', 'Desk lamp'),
        ('gear', 'Travel Bottle', 'travel-bottle', 'Double-wall insulation keeps drinks cold and the profile stays pack-friendly.', 18.00, 'Popular', 'products/travel-bottle.jpg', 'Travel bottle'),
        ('tech', 'Cable Organizer', 'cable-organizer', 'Compact organizer with elastic loops and a clean zip closure.', 12.00, 'New', 'products/cable-organizer.jpg', 'Cable organizer'),
        ('apparel', 'Studio Tote', 'studio-tote', 'Heavy canvas tote with reinforced handles and a minimal logo mark.', 24.00, 'Best', 'products/studio-tote.jpg', 'Studio tote bag'),
        ('home', 'Ceramic Mug', 'ceramic-mug', 'Matte ceramic with a balanced handle and a smooth, durable glaze.', 16.00, 'New', 'products/ceramic-mug.jpg', 'Ceramic mug')
) as p(category_slug, name, slug, description, price, tag, image_path, image_alt)
join product_types pt on pt.slug = p.category_slug
on conflict (slug) do nothing;
