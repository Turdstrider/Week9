export async function addProducts(collection) {

    const products = [
        {
            id: 1,
            name: "Banana",
            description: "Fresh yellow banana",
            price: 8.00,
            units: 10
        },
        {
            id: 2,
            name: "Apple",
            description: "Fresh red apple",
            price: 5.50,
            units: 20
        },
        {
            id: 3,
            name: "Orange",
            description: "Fresh orange",
            price: 6.75,
            units: 15
        }
    ];

    await collection.insertMany(products);

    console.log("3 products added");
}