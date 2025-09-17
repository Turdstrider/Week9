import {getDB} from '../db.js';
import { ObjectId } from 'mongodb';
function getProductList(app){

   app.get('/api/getProdlist',async function(req,res){
       
            const db = getDB();
            let collection = db.collection('products');
            const cursor =  await collection.find({})
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
    app.put('/api/prod',async function(req,res){
       
        if (!req.body) {
            return res.sendStatus(400)
        }    
           let product = req.body;
            const db = getDB();
            var objectid = ObjectId.createFromHexString(product._id);
            const collection = db.collection('products');
            await collection.updateOne({_id:objectid},{$set:{name:product.name,price:product.price}});
                //Return a response to the client to let them know the update was successful
                res.send({'ok':product._id});      
    })         
}

function addProduct(app){
    app.post('/api/prod',async function(req,res){
       
        if (!req.body) {
            return res.sendStatus(400)
        }    
           let product = req.body;
            const db = getDB();
            
            const collection = db.collection('products');
            //check for duplicates
            const cursor =  await collection.find({name:product.name});
            const data = await cursor.toArray();
            
            if (data.length < 1){
                
                let result = await collection.insertOne({name:product.name,price:product.price});
                    //Return a response to the client to let them know the update was successful
                    return res.send({error:false,id:result.insertedId});    
            }
            else{
                return res.send({error:"duplicate"});  
            }
        });
}

function deleteProduct(app){
    app.delete('/api/prod',async function(req,res){
        
        if (!req.body) {
            return res.sendStatus(400)
        }    
           let product = req.body;
            const db = getDB();
            
            const collection = db.collection('products');
            let query = {name:product.name,price:product.price}
            await collection.deleteOne(query);
                //Return a response to the client to let them know the update was successful
               return res.send({'deleted':product._id});
            });
}

export {getProductList,updateProduct,addProduct,deleteProduct}