import React, { useState, useEffect } from 'react';
import './App.css';
import data from './data/data.json';
import ProductCard from './components/ProductCard';


function App() {
  const [products, setProducts] = useState(data.products || []);
  const [categories, setCategories] = useState(data.categories || []);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filter, setFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  // Función para cargar datos desde un archivo JSON o URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Puedes cambiar la URL o ruta del archivo local según sea necesario
        const response = await fetch('./data/data.json'); // Cambia a una URL si es necesario
        const data = await response.json();

        setProducts(data.products);
        setCategories(data.categories);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleFilterClick = (type) => {
    setFilter(type);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const isInCart = prevCart.find((item) => item.id === product.id);
      if (!isInCart) {
        return [...prevCart, product];
      }
      return prevCart; // No agregar duplicados
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  

  const filteredProducts = products.filter(product => {
    // Filtrar por categoría seleccionada
  const matchesCategory = selectedCategory
    ? product.categories.includes(selectedCategory)
    : true;

    
    
    // Filtrar por tipo de filtro
    const matchesFilter =
    filter === 'available' ? product.available :
    filter === 'outOfStock' ? !product.available :
    filter === 'bestSeller' ? product.best_seller :
    filter === 'priceAbove30000' ? parseFloat(product.price.replace('.', '')) > 30000 :
    filter === 'priceBelow10000' ? parseFloat(product.price.replace('.', '')) < 10000 :
    true;
    
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()); // Comparar el término de búsqueda

    return matchesCategory && matchesFilter && matchesSearch; // Combinar todos los filtros
  });
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name); // Ordenar alfabéticamente
    }
    if (sortOrder === 'priceHighToLow') {
      return parseFloat(b.price.replace('.', '')) - parseFloat(a.price.replace('.', '')); // Mayor a menor precio
    }
    if (sortOrder === 'priceLowToHigh') {
      return parseFloat(a.price.replace('.', '')) - parseFloat(b.price.replace('.', '')); // Menor a mayor precio
    }
    return 0; // Sin orden
  });

  return (
    
  <div className="App">
  {/* Header */}
  <header>
    <div className="header-content">
      <h1>Tienda Online</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  </header>

 {/* Sidebar con Categorías, Filtros y Ordenas por*/}
  <aside className="sidebar">
    <section className="categories-section">
      <h2>Categorías</h2>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.categori_id}
            onClick={() => handleCategoryClick(category.categori_id)}
            className={selectedCategory === category.categori_id ? 'active' : ''}
          >
            {category.name}
          </button>
        ))}
        <button onClick={() => setSelectedCategory(null)}>Ver Todas</button>
      </div>
    </section>

    <section className="filters-section">
      <h2>Filtros</h2>
      <div className="filter-buttons">
        <button 
          onClick={() => handleFilterClick('available')} 
          className={filter === 'available' ? 'active' : ''}>
          Disponibles
        </button>
        <button 
          onClick={() => handleFilterClick('outOfStock')} 
          className={filter === 'outOfStock' ? 'active' : ''}>
          Agotados
        </button>
        <button 
          onClick={() => handleFilterClick('bestSeller')} 
          className={filter === 'bestSeller' ? 'active' : ''}>
          Más Vendidos
        </button>
        <button 
          onClick={() => handleFilterClick('priceBelow10000')}
          className={filter === 'priceBelow10000' ? 'active' : ''}>
          Precio {'<'} 10,000
        </button>
        <button 
          onClick={() => handleFilterClick('priceAbove30000')}
          className={filter === 'priceAbove30000' ? 'active' : ''}> 
          Precio {'>'} 30,000
        </button>
        <button 
          onClick={() => setFilter(null)} 
          className={filter === null ? 'active' : ''}>
          Ver Todos
        </button>
      </div>
    </section>

    <section className="Order-section"></section>
      <h2>Ordenar por</h2>
      <div className="filter-buttons">
        <button 
          onClick={() => setSortOrder('name')} 
          className={sortOrder === 'name' ? 'active' : ''}>
          Ordenar por Nombre
        </button>

        <button 
          onClick={() => setSortOrder('priceHighToLow')} 
          className={sortOrder === 'priceHighToLow' ? 'active' : ''}>
          Mayor Precio
        </button>

        <button 
          onClick={() => setSortOrder('priceLowToHigh')} 
          className={sortOrder === 'priceLowToHigh' ? 'active' : ''}>
          Menor Precio
        </button>
      </div>
  </aside>

 {/* Contenido principal */}
  <main>
    <section className="products-section">
      <h2>Productos</h2>
      <div className="product-list">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <ProductCard product={product} />
            <button
              onClick={() => handleAddToCart(product)}
              disabled={!product.available}
              className={!product.available ? 'disabled-button' : ''}
            >
              {product.available ? 'Agregar al Carrito' : 'Agotado'}
            </button>
          </div>
        ))}
      </div>
    </section>

    <section className="cart-section">
      <h2>Carrito</h2>
      <div className="cart">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <button onClick={() => handleRemoveFromCart(item.id)}>Eliminar</button>
            </div>
          ))
        ) : (
          <p>El carrito está vacío.</p>
        )}
      </div>
    </section>
  </main>

 {/* Footer */}
  <footer>
    <p>&copy; 2024 Tienda Online. Todos los derechos reservados.</p>
  </footer>
</div>
  );
}

export default App;
