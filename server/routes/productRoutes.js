import {getDB} from '../db.js';
import { ObjectId } from 'mongodb';
function getProductList(app){

   app.get('/api/getProdlist',async function(req,res){ //gets the whole list of products.
       
            const db = getDB();
            let collection = db.collection('products');
            const cursor =  await collection.find({}) //{} makes the find not apply a filter.
            const data = await cursor.toArray();
            if (data){
                res.send(data);
            }  
            else{
                res.send({error:'no data'})
            }  
            });
}

function updateProduct(app){
    app.put('/api/prod', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400);
        }

        let product = req.body;
        const db = getDB();
        const collection = db.collection('products');

        const objectid = ObjectId.createFromHexString(product._id);

        // Check if another product already uses this ID
        const duplicate = await collection.findOne({
            id: product.id,
            _id: { $ne: objectid }
        });

        if (duplicate) {
            return res.send({error: "duplicate"});
        }

        await collection.updateOne(
            {_id: objectid},
            {$set: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                units: product.units
            }}
        );

        res.send({ok: product._id});
    });
}

function addProduct(app){ //add a new product to database.
    app.post('/api/prod',async function(req,res){ 
       
        if (!req.body) {
            return res.sendStatus(400)
        }    
           let product = req.body; //gets the product from Angular.
            const db = getDB();
            
            const collection = db.collection('products');
            //check for duplicates
            const cursor = await collection.find({id: product.id});
            const data = await cursor.toArray();
            
            if (data.length < 1){ //if there are no duplicates.
                
                if (data.length < 1){
                    let result = await collection.insertOne({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        units: product.units
                    });
                    //Return a response to the client to let them know the update was successful
                    return res.send({error:false,id:result.insertedId});    
                }
                    //Return a response to the client to let them know the update was successful
                    return res.send({error:false,id:result.insertedId});    
            }
            else{ //if requested product was already in the database, send an error.
                return res.send({error:"duplicate"});  
            }
        });
}

function deleteProduct(app){
    app.delete('/api/prod', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400);
        }

        let product = req.body;
        const db = getDB();
        const collection = db.collection('products');

        const objectid = ObjectId.createFromHexString(product._id); //convert string to MongoDB ID.

        await collection.deleteOne({_id: objectid}); //delete product with that MongoDB ID, Not the actual ID.

        return res.send({deleted: product._id});
    });
}

export {getProductList,updateProduct,addProduct,deleteProduct}