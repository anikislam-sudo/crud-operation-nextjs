import { createItem, deleteItem, getItems, updateItem } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Define validation schemas
const itemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(50, "Item name must be 50 characters or less")
});

const idSchema = z.object({
  id: z.string().min(1, "Item ID is required")
});

// GET handler to fetch items
export async function GET() {
    try {
        const { items, error } = await getItems()
        if (error) throw new Error(error)
        return NextResponse.json(items)
      } catch (error) {
        console.error('Failed to fetch items:', error)
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
      }
}

// POST handler to create an item
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = itemSchema.parse(body); // Validate the input
    const { item, error } = await createItem(name);

    if (error) throw new Error(error);
    
    return NextResponse.json(item); // Ensure item is JSON serializable
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Failed to create item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

// PUT handler to update an item
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id } = idSchema.parse(body);
    const { name } = itemSchema.parse(body);
    const { item, error } = await updateItem(id, name);

    if (error) throw new Error(error);
    
    return NextResponse.json(item); // Ensure item is JSON serializable
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Failed to update item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE handler to delete an item
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = idSchema.parse(body);
    const { success, error } = await deleteItem(id);

    if (error) throw new Error(error);
    
    return NextResponse.json({ message: 'Item deleted' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Failed to delete item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
