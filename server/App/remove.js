export async function removeProduct(collection) {

    await collection.deleteOne({ id: 3 });

    console.log("Product removed");
}