import React, { useEffect, useState } from 'react'

function Products() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    fetch('https://fakestoreapi.com/products').then(res => res.json()).then(res => {
      // console.log(res);
      setProducts(res);
    })
  }, [])
  const handleRemoveFromCart = (productId) => {
    const updateCartItems = cartItems.filter((item) => item.id !== productId);
    // console.log(selectedProduct);
    setCartItems(updateCartItems)
  }

  const Cart = () =>{
  return (
    <div className='cart-container'>
      <h3 style={{color: 'white', textAlign: 'center'}}>Cart Items</h3>
       <div className='card-wrapper'>
        {cartItems.map(product => (
          <div key={product.id} className='product-card'>
            <div className='img-container'>
              <img src={product.image} alt={product.name} className='product-img' />
            </div>
            <div style={{ textAlign: 'center' }}>
              {product.title}
            </div>
            <button className='addToCartBtn' onClick={() => handleRemoveFromCart(product.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

  const handleAddToCart = (productId) => {
    const selectedProduct = products.find((item) => item.id == productId);
    // console.log(selectedProduct);
    setCartItems((prev)=>[selectedProduct, ...prev])
    console.log(cartItems);
  }
  return (
    <>
    <div className='products-container'>
      <div className='card-wrapper'>
        {products.map(product => (
          <div key={product.id} className='product-card'>
            <div className='img-container'>
              <img src={product.image} alt={product.name} className='product-img' />
            </div>
            <div style={{ textAlign: 'center' }}>
              {product.title}
            </div>
            <button className='addToCartBtn' onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
    <Cart/>
    </>
  )
}

export default Products
