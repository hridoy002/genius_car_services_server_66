const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;


// middlewrae 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Runnig Server!!!");
})

// db connection 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.rsi1q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db('geniusCar').collection('services');

    // data send to route by api
    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })

    // data details send by id 
    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.send(service);
    }) 

    // post data add new service to database
    app.post('/services', async(req,res)=>{
      const newService =req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result)
    })

    // document delete 
    app.delete('/services/:id', async(req,res)=> {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await serviceCollection.deleteOne(query);
        res.send(result);
    })

  }
  finally {

  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log('Server On', port);
})