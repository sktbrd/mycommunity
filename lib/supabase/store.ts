// lib/supabase/store.ts
'use server'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*');

  if (error) throw error;
  return data;
}

// Add a new category
export async function addCategory(name: string, description: string) {
  const { data, error } = await supabase
    .from('product_categories')
    .insert([{ name, description }]);

  if (error) throw error;
  return data;
}

// Update a category
export async function updateCategory(id: string, name: string, description: string) {
  const { data, error } = await supabase
    .from('product_categories')
    .update({ name, description })
    .eq('id', id);

  if (error) throw error;
  return data;
}

// Delete a category
export async function deleteCategory(id: string) {
  const { data, error } = await supabase
    .from('product_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return data;
}

// Fetch all products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*'); // You can also select specific columns if needed

  if (error) throw error;
  return data;
}

// Add a new product
export async function addProduct(name: string, description: string, price: number, images: string[], category_id: string) {
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price, images, category_id }]);

  if (error) throw error;
  return data;
}

// Update a product
export async function updateProduct(id: string, name: string, description: string, price: number, images: string[], category_id: string) {
  const { data, error } = await supabase
    .from('products')
    .update({ name, description, price, images, category_id })
    .eq('id', id);

  if (error) throw error;
  return data;
}

// Delete a product
export async function deleteProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return data;
}
