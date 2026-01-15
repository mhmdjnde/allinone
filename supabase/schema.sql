create extension if not exists "pgcrypto";

create table if not exists product_types (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text not null unique,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    product_type_id uuid not null references product_types(id) on delete restrict,
    name text not null,
    slug text not null unique,
    description text,
    price numeric(10, 2) not null,
    tag text,
    image_path text not null,
    image_alt text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists products_product_type_id_idx on products(product_type_id);
create index if not exists products_is_active_idx on products(is_active);

create or replace function set_updated_at_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_product_types_updated_at on product_types;
create trigger set_product_types_updated_at
before update on product_types
for each row
execute function set_updated_at_timestamp();

drop trigger if exists set_products_updated_at on products;
create trigger set_products_updated_at
before update on products
for each row
execute function set_updated_at_timestamp();

alter table product_types enable row level security;
create policy "Public product types are viewable"
on product_types for select
using (is_active = true);

alter table products enable row level security;
create policy "Public products are viewable"
on products for select
using (is_active = true);
