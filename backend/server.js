const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Ini akan membaca file .env kamu

const app = express();
app.use(cors());
app.use(express.json());

// Mengambil URI dari file .env
const MONGO_URI = process.env.MONGO_URI;

// Koneksi ke MongoDB Atlas Cloud
mongoose.connect(MONGO_URI)
  .then(() => console.log('Berhasil terhubung ke MongoDB Atlas Cloud!'))
  .catch((err) => console.error('Gagal terhubung ke MongoDB Atlas:', err));

// Skema & Model Produk
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 }
});

const Product = mongoose.model('Product', productSchema);

// Skema & Model Pesanan
const orderSchema = new mongoose.Schema({
  items: Array,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// API Endpoints

// GET: Ambil Produk dari MongoDB
app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();

    // Jika database cloud masih kosong, isi otomatis dengan data awal
    if (products.length === 0) {
      const initialProducts = [
        { name: 'Sepatu Sneakers Sport', category: 'Fashion', price: 250000, rating: 4.8 },
        { name: 'Kaos Polos Cotton 30s', category: 'Fashion', price: 75000, rating: 4.5 },
        { name: 'Jaket Denim Casual', category: 'Fashion', price: 350000, rating: 4.7 },
        { name: 'Headphone Wireless Bluetooth', category: 'Elektronik', price: 450000, rating: 4.9 },
        { name: 'Smartwatch Sport Fit', category: 'Elektronik', price: 620000, rating: 4.6 },
        { name: 'Mouse Gaming RGB', category: 'Elektronik', price: 180000, rating: 4.7 },
        { name: 'Keyboard Mechanical Tactile', category: 'Elektronik', price: 550000, rating: 4.8 },
        { name: 'Tas Ransel Laptop Waterproof', category: 'Aksesoris', price: 220000, rating: 4.6 }
      ];
      products = await Product.insertMany(initialProducts);
      console.log('Data produk awal berhasil dibuat di MongoDB Atlas!');
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data produk' });
  }
});

// POST: Simpan Pesanan ke MongoDB
app.post('/api/checkout', async (req, res) => {
  try {
    const { cart, total } = req.body;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja kosong!' });
    }

    const newOrder = new Order({ items: cart, totalPrice: total });
    await newOrder.save();

    res.json({
      success: true,
      message: `Transaksi berhasil disimpan ke MongoDB Atlas! Total: Rp ${total.toLocaleString('id-ID')}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});