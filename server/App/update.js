export async function updateProduct(collection) {

    await collection.updateOne(
        { id: 1 },
        {
            $set: {
                name: "Green Banana",
                description: "Fresh green banana",
                price: 7.50,
                units: 12
            }
        }
    );

    console.log("Product updated");
}