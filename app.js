function formatBRL(v){ return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
document.addEventListener('DOMContentLoaded', ()=>{
  const price = Number(document.getElementById('product-price').textContent);
  const qtyInput = document.getElementById('qty');
  const addCartBtn = document.getElementById('add-cart');
  const buyNowBtn = document.getElementById('buy-now');
  const cartLink = document.getElementById('cart-link');
  const cartSection = document.getElementById('cart');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  function loadCart(){ try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){ return []; } }
  function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
  function renderCart(){
    const cart = loadCart();
    cartItemsDiv.innerHTML = '';
    if(cart.length===0){ cartItemsDiv.innerHTML = '<div class="small">Carrinho vazio.</div>'; cartTotalEl.textContent = formatBRL(0); cartCount.textContent = 0; return; }
    let total = 0;
    cart.forEach((it, idx)=>{
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `<div><strong>${it.name}</strong> x ${it.qty}</div><div>${formatBRL(it.qty*it.price)} <button data-idx="${idx}" class="btn">Remover</button></div>`;
      cartItemsDiv.appendChild(div);
      total += it.qty*it.price;
    });
    cartTotalEl.textContent = formatBRL(total);
    cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
    cartItemsDiv.querySelectorAll('button').forEach(b=> b.addEventListener('click', (e)=>{
      const idx = Number(e.currentTarget.dataset.idx);
      const c = loadCart(); c.splice(idx,1); saveCart(c); renderCart();
    }));
  }

  addCartBtn.addEventListener('click', ()=>{
    const q = Math.max(1, Number(qtyInput.value)||1);
    const item = { name: 'Camiseta Exemplo', price, qty: q };
    const c = loadCart(); c.push(item); saveCart(c); renderCart();
    alert('Adicionado ao carrinho');
  });

  buyNowBtn.addEventListener('click', ()=>{
    const q = Math.max(1, Number(qtyInput.value)||1);
    const orderId = Date.now().toString();
    const amount = (q*price).toFixed(2);
    localStorage.setItem('last_order', JSON.stringify({ orderId, items:[{name:'Camiseta Exemplo',qty:q,price}], amount }));
    window.location.href = `payment.html?order=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(amount)}`;
  });

  cartLink.addEventListener('click', (e)=>{ e.preventDefault(); cartSection.classList.toggle('hidden'); renderCart(); });

  checkoutBtn.addEventListener('click', ()=>{
    const cart = loadCart();
    if(cart.length===0){ alert('Carrinho vazio'); return; }
    const orderId = Date.now().toString();
    const amount = cart.reduce((s,i)=>s+i.qty*i.price,0).toFixed(2);
    localStorage.setItem('last_order', JSON.stringify({ orderId, items: cart, amount }));
    localStorage.removeItem('cart');
    renderCart();
    window.location.href = `payment.html?order=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(amount)}`;
  });

  renderCart();
});
