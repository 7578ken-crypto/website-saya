const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. KONEKSI MONGO DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Terhubung!'))
  .catch((err) => console.error('Error MongoDB:', err));

// 2. SCHEMA & MODEL PRODUK
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);

// 3. SEEDING DATA OTOMATIS (Mengisi produk jika DB kosong)
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: 'Laptop Gaming RTX 4060',
        price: 15000000,
        image: 'https://via.placeholder.com/200',
        description: 'Laptop performa tinggi untuk gaming dan editing.'
      },
      {
        name: 'Mouse Wireless Gaming',
        price: 350000,
        image: 'https://via.placeholder.com/200',
        description: 'Mouse responsif dengan sensor presisi tinggi.'
      },
      {
        name: 'Keyboard Mechanical RGB',
        price: 750000,
        image: 'https://via.placeholder.com/200',
        description: 'Keyboard switch biru dengan lampu RGB kustom.'
      }
    ]);
    console.log('Data produk berhasil ditambahkan!');
  }
};
seedProducts();

// 4. API ENDPOINT
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE TEST
app.get('/', (req, res) => {
  res.send('API Backend Aktif!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));