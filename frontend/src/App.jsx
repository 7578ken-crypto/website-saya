import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  // 1. Ambil daftar produk dari backend
  useEffect(() => {
    fetch('https://website-saya-backend.vercel.app/')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Gagal mengambil data produk:', err));
  }, []);

  // 2. Tambah produk ke keranjang
  const addToCart = (product) => {
    setCart([...cart, product]);
    setCheckoutMessage(''); // Reset pesan checkout saat belanja lagi
  };

  // Hitung total belanja
  const totalHarga = cart.reduce((sum, item) => sum + item.price, 0);

  // 3. Kirim data checkout ke backend
  const handleCheckout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total: totalHarga })
      });
      const data = await res.json();
      
      if (data.success) {
        setCheckoutMessage(data.message);
        setCart([]);
      }
    } catch (err) {
      console.error('Gagal checkout:', err);
    }
  };

  return (
    <div className="container">
      {/* Navbar / Header */}
      <header className="navbar">
        <h1 className="brand-title">🛒 Toko Online PC Store</h1>
        <div className="cart-badge">
          Keranjang: <strong>{cart.length} Item</strong>
        </div>
      </header>

      {/* Main Layout */}
      <div className="shop-layout">
        {/* Katalog Produk (Kolom Kiri) */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Semua Produk ({products.length})</h2>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <span className="product-tag">{p.category}</span>
                <img 
                  src={`https://picsum.photos/seed/${p.id + 10}/220/150`} 
                  alt={p.name} 
                  className="product-image" 
                />
                <h3 className="product-name">{p.name}</h3>
                <div className="product-meta">
                  <span className="product-price">Rp {p.price.toLocaleString('id-ID')}</span>
                  <span className="product-rating">⭐ {p.rating}</span>
                </div>
                <button className="btn btn-primary" onClick={() => addToCart(p)}>
                  + Keranjang
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar Ringkasan Belanja (Kolom Kanan) */}
        <aside className="cart-panel">
          <h2 className="section-title">Ringkasan Pesanan</h2>
          
          {cart.length === 0 ? (
            <p className="empty-cart-text">Belum ada item di dalam keranjang.</p>
          ) : (
            <>
              <ul className="cart-items">
                {cart.map((item, index) => (
                  <li key={index} className="cart-item">
                    <span className="cart-item-title">{item.name}</span>
                    <span className="cart-item-price">Rp {item.price.toLocaleString('id-ID')}</span>
                  </li>
                ))}
              </ul>
              
              <div className="cart-total">
                <span>Total Pembayaran:</span>
                <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
              </div>

              <button className="btn btn-success" onClick={handleCheckout}>
                Proses Pembayaran
              </button>
            </>
          )}

          {checkoutMessage && (
            <div className="alert-success">
              {checkoutMessage}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;