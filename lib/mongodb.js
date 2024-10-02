import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let clientPromise;

if (!clientPromise) {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
