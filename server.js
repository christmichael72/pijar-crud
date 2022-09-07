const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

app.listen(3000, function() {
  console.log('listening on 3000')
})

const url = 'mongodb://127.0.0.1:27017'

MongoClient.connect(url, (err, client) => {
  if (err) return console.error(err)
  dbName = 'pijarcamp'
  const db = client.db(dbName)
  console.log(`Connected MongoDB: ${url}`)
  console.log(`Database: ${dbName}`)
  const produkCollection = db.collection('produk')
  
  app.set('view engine', 'ejs')
  app.use(express.static('public'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  
  app.get('/', (req, res) => {
  db.collection('produk').find().toArray()
    .then(results => {
      res.render('index.ejs', { produk: results })
    })
    .catch(/* ... */)
  })
  
  app.post('/produk', (req, res) => {
  produkCollection.insertOne(req.body)
    .then(result => {
      console.log(result)
	  res.redirect('/')
    })
    .catch(error => console.error(error))
  })
  
  app.post('/update', (req, res) => {
    produkCollection.findOneAndUpdate(
		{ nama_produk: req.body.nama_produk },
		{
			$set: {
				keterangan: req.body.keterangan,
				harga: req.body.harga,
				jumlah: req.body.jumlah
			}
		},
		{
		upsert: true
		}
    )
	if(err) throw err;
      res.redirect('/');
  })
  
  app.post('/delete', (req, res) => {
      produkCollection.deleteOne(
        { nama_produk: req.body.nama_produk }
      )
      if(err) throw err;
		res.redirect('/');
   })
  
})