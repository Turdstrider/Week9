import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { addProducts } from './add.js';
import { readProducts } from './read.js';
import { updateProduct } from './update.js';
import { removeProduct } from './remove.js';

// Get the location of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the existing server .env file
dotenv.config({
    path: path.join(__dirname, '../.env')
});

const client = new MongoClient(process.env.mongo_url);

async function main() {
    try {
        await client.connect();

        console.log('Connected to MongoDB');

        const db = client.db('mydb');

        // Create/access the products collection
        const collection = db.collection('products');

        // The workshop asks us to clear the products before execution
        try {
            await collection.drop();
            console.log('Products collection dropped');
        } catch (error) {
            // Collection doesn't exist yet, so there is nothing to drop
            if (error.codeName !== 'NamespaceNotFound') {
                throw error;
            }
            console.log('Products collection did not exist');
        }

        // Run the CRUD operations
        await addProducts(collection);

        console.log('\nProducts after adding:');
        console.log(await readProducts(collection));

        await updateProduct(collection);

        console.log('\nProducts after updating:');
        console.log(await readProducts(collection));

        await removeProduct(collection);

        console.log('\nProducts after removing:');
        console.log(await readProducts(collection));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('\nDatabase connection closed');
    }
}

main();