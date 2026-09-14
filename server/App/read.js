export async function readProducts(collection) {

    const products = await collection.find({}).toArray();

    return products;
}