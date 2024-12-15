// mongodbInit.js
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:2717/admin';
const client = new MongoClient(url);

const dbName = 'admin';

async function mongodbInit() {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents');
    const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    console.log('Inserted documents =>', insertResult);

    return 'done.';
  } catch (err) {
    console.error('Error during MongoDB operation:', err);
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
    console.log('MongoDB client connection closed');
  }
}

export default mongodbInit;
