const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const jwt = require('jsonwebtoken');
require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json());



const dbUser = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${dbUser}:${password}@cluster0.bfv30pl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function dbConnect() {
    try {
      await client.connect();
    } finally {
    }
  }
dbConnect().catch(console.dir)

//--------------------------------------------------------
//For Product Add,delete,update ,read
const productCollection = client.db("Ema-jhon-Product").collection("Product");
//C
app.post("/product", async (req, res) => {
  const product = req.body;
  const result = await productCollection.insertOne(product);
  res.send(result);
  // console.log(result)
});
//R
app.get("/product", async (req, res) => {
  const query = {};
  const findProduct = productCollection.find(query);
  const products = await findProduct.toArray();
  res.send(products);
  // console.log(products)
});
//D
app.delete(`/product/:id`, async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productCollection.deleteOne(query);
  res.send(result);
  // console.log(id)
});
//U
app.get(`/product/:id`, async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productCollection.findOne(query);
  res.send(result);
  // console.log(result)
});
app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const option = { upsert: true };
  const product = req.body;
  console.log(id, product.ProductName);
  const updateProduct = {
    $set: {
      ProductName: product.ProductName,
      Price: product.Price,
      img: product.img,
    },
  };
  const result = await productCollection.updateOne(
    filter,
    updateProduct,
    option
  );
  // res.send(result)
});
//=======================================================
//For service data
const collection = client.db("Ema-jhon-Product").collection("Service");
app.get('/service',async(req,res)=>{
    const query = {}
    const find = collection.find(query)
    const result =await find.toArray()
    res.send(result)
    // console.log(result)
})
app.get('/service/:id',async(req,res)=>{
    const id = req.params.id
    const query = { _id : new ObjectId(id)}
    const result =await collection.findOne(query)
    res.send(result)
    // console.log(result)
})
//======================================================
//jwt varify funtion
function varifyJWT (req,res,next){
  const authHeader= req.headers.authorization;
  const token = authHeader.split(' ')[1]
  if(!authHeader){
    return res.status(401).send({message:'UnAuthorized access'})
  }
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
    if(err){
     return res.status(401).send({message:'unAuthorized acces'})
    }
    req.decoded =decoded
    next()
  })
}
//order info DB
const orderCollection = client.db("Ema-jhon-Product").collection("Order");
app.post('/order',async(req,res )=>{
    const orderInfo = req.body
    const result = await orderCollection.insertOne(orderInfo)
    res.send(result)
})
app.get('/order',varifyJWT,async(req,res)=>{
  const decode = req.decoded
  console.log('inside api',decode)
  if(decode.email !== req.query.email){
     res.status(403).send({message: 'unAuthorized acces'})
  }
  let query = {}
  // console.log(req.query.email)
  if(req.query.email){
    query ={
      email : req.query.email
    }
  }
  const result =  orderCollection.find(query)
  const orders = await result.toArray()
  res.send(orders)
})
app.delete('/order/:id',async(req,res)=>{
  const id =req.params.id
  console.log(id)
  const query = {_id : new ObjectId(id)}
  const result = await orderCollection.deleteOne(query)
  res.send(result)
  // console.log(result)
})
//JWT add for sequrity purpose
//----------------------------------------------------
app.post('/jwt',(req,res)=>{
  const user = req.body
  console.log(user)
  const token =jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
  res.send({token})
})
//-----------------------------------------------------
//testing perpose
//--------------------------------------------------------
app.get("/", (req, res) => {
  res.send("server is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("api is running"));
