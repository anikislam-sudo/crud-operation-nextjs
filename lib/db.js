import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

let db;

async function init() {
  if (!db) {
    const client = await clientPromise;
    db = client.db(process.env.MONGODB_DB);
  }
}

// Create an item
export async function createItem(name) {
  await init();
  
  const result = await db.collection('listing-app').insertOne({ name });
  
  // Return the new item, converting ObjectId to string
  return { item: { id: result.insertedId.toString(), name } }; 
}

// Fetch items
// Fetch items
export async function getItems() {
    await init();
    
    try {
      const items = await db.collection('listing-app').find({}).toArray();
      
      // Convert ObjectId to string for all items
      return { items: items.map(item => ({ id: item._id.toString(), name: item.name })) };
    } catch (error) {
      console.error('Error fetching items:', error);
      return { items: [], error: 'Failed to fetch items' };
    }
  }
  

// Update an item
export async function updateItem(id, name) {
  await init();
  
  const result = await db.collection('listing-app').updateOne(
    { _id: ObjectId(id) },
    { $set: { name } }
  );
  
  if (result.modifiedCount === 0) throw new Error('Item not found or not modified');
  
  return { item: { id, name } }; // Ensure the returned item is JSON serializable
}

// Delete an item
export async function deleteItem(id) {
  await init();
  
  const result = await db.collection('listing-app').deleteOne({ _id: ObjectId(id) });
  
  if (result.deletedCount === 0) throw new Error('Item not found');
  
  return { success: true }; // Return success
}
