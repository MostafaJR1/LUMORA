/*
  Orders: ready to be connected to Supabase later.

  1) Run this once in the Supabase SQL editor:

     create table orders (
       id uuid primary key default gen_random_uuid(),
       created_at timestamptz not null default now(),
       status text not null default 'new',
       customer jsonb not null,   -- { name, phone, city, address, notes }
       items jsonb not null,      -- [{ id, qty, unit_price }]
       total numeric not null
     );
     alter table orders enable row level security;
     create policy "anyone can place an order" on orders for insert to anon with check (true);
     -- no select policy for anon: only you (dashboard / service role) can read orders.

  2) Never trust prices sent by the browser: compute `total` on the server
     (a Next.js route handler or a Supabase Edge Function) from your own catalog.
*/
export type OrderInput = {
  customer: { name: string; phone: string; city: string; address: string; notes?: string };
  items: { id: string; qty: number }[];
};

export async function submitOrder(_input: OrderInput): Promise<{ id: string }> {
  void _input;
  // TODO (later):
  // const { data, error } = await supabase.from("orders").insert({ ... }).select("id").single();
  // if (error) throw error;
  // return { id: data.id };
  throw new Error("Supabase is not connected yet");
}
