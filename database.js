// Sistema de gerenciamento de dados usando localStorage
// Simula um banco de dados para produtos, pedidos, pagamentos e configurações

const DB = {
  // Chaves do localStorage
  KEYS: {
    PRODUCTS: 'shop_products_v1',
    ORDERS: 'shop_orders_v1',
    PAYMENTS: 'shop_payment_methods_v1',
    CART: 'shop_cart_v1',
    ADMIN_PASSWORD: 'shop_admin_pass_v1'
  },

  // Inicializar banco de dados com dados padrão
  init() {
    // Senha do admin
    if (!localStorage.getItem(this.KEYS.ADMIN_PASSWORD)) {
      localStorage.setItem(this.KEYS.ADMIN_PASSWORD, 'hevelyn12%');
    }

    // Produtos padrão
    if (!localStorage.getItem(this.KEYS.PRODUCTS)) {
      const defaultProducts = [
        {
          id: 1,
          name: 'Camiseta Premium',
          price: 89.90,
          description: 'Camiseta de algodão premium com design exclusivo. Confortável e elegante para o dia a dia.',
          image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%239333EA" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ECamiseta Premium%3C/text%3E%3C/svg%3E',
          category: 'Roupas',
          stock: 50,
          active: true
        },
        {
          id: 2,
          name: 'Calça Jeans Slim',
          price: 159.90,
          description: 'Calça jeans slim fit de alta qualidade. Tecido resistente e modelagem perfeita.',
          image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%233B82F6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ECalça Jeans%3C/text%3E%3C/svg%3E',
          category: 'Roupas',
          stock: 30,
          active: true
        },
        {
          id: 3,
          name: 'Tênis Esportivo',
          price: 249.90,
          description: 'Tênis esportivo com tecnologia de amortecimento. Ideal para corridas e treinos.',
          image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%237C3AED" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ETênis Esportivo%3C/text%3E%3C/svg%3E',
          category: 'Calçados',
          stock: 20,
          active: true
        }
      ];
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    }

    // Formas de pagamento padrão
    if (!localStorage.getItem(this.KEYS.PAYMENTS)) {
      const defaultPayments = [
        {
          id: 1,
          name: 'PIX - QR Code',
          type: 'qr',
          value: '',
          description: 'Escaneie o QR Code para pagar via PIX',
          active: true,
          order: 1
        },
        {
          id: 2,
          name: 'PIX - Chave',
          type: 'text',
          value: 'seuemail@exemplo.com',
          description: 'Copie a chave PIX para realizar o pagamento',
          active: true,
          order: 2
        },
        {
          id: 3,
          name: 'Transferência Bancária',
          type: 'text',
          value: 'Banco: 001 - Bradesco\nAgência: 1234-5\nConta: 12345-6\nCPF: 123.456.789-00',
          description: 'Realize uma transferência bancária',
          active: true,
          order: 3
        }
      ];
      localStorage.setItem(this.KEYS.PAYMENTS, JSON.stringify(defaultPayments));
    }

    // Pedidos (vazio inicialmente)
    if (!localStorage.getItem(this.KEYS.ORDERS)) {
      localStorage.setItem(this.KEYS.ORDERS, JSON.stringify([]));
    }

    // Carrinho (vazio inicialmente)
    if (!localStorage.getItem(this.KEYS.CART)) {
      localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
    }
  },

  // PRODUTOS
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.PRODUCTS) || '[]');
    } catch (e) {
      return [];
    }
  },

  getProduct(id) {
    const products = this.getProducts();
    return products.find(p => p.id === parseInt(id));
  },

  saveProducts(products) {
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct(product) {
    const products = this.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    product.id = newId;
    products.push(product);
    this.saveProducts(products);
    return product;
  },

  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  },

  deleteProduct(id) {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));
    this.saveProducts(filtered);
  },

  // PEDIDOS
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.ORDERS) || '[]');
    } catch (e) {
      return [];
    }
  },

  getOrder(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  },

  saveOrders(orders) {
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
  },

  addOrder(order) {
    const orders = this.getOrders();
    order.id = 'ORD-' + Date.now();
    order.createdAt = new Date().toISOString();
    order.status = 'pending';
    orders.unshift(order);
    this.saveOrders(orders);
    return order;
  },

  updateOrder(id, updates) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      this.saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  // FORMAS DE PAGAMENTO
  getPaymentMethods() {
    try {
      const methods = JSON.parse(localStorage.getItem(this.KEYS.PAYMENTS) || '[]');
      return methods.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (e) {
      return [];
    }
  },

  getActivePaymentMethods() {
    return this.getPaymentMethods().filter(m => m.active).slice(0, 3);
  },

  savePaymentMethods(methods) {
    localStorage.setItem(this.KEYS.PAYMENTS, JSON.stringify(methods));
  },

  updatePaymentMethod(id, updates) {
    const methods = this.getPaymentMethods();
    const index = methods.findIndex(m => m.id === parseInt(id));
    if (index !== -1) {
      methods[index] = { ...methods[index], ...updates };
      this.savePaymentMethods(methods);
      return methods[index];
    }
    return null;
  },

  // CARRINHO
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CART) || '[]');
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
  },

  addToCart(productId, quantity = 1) {
    const cart = this.getCart();
    const product = this.getProduct(productId);
    if (!product) return null;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(productId) {
    const cart = this.getCart();
    const filtered = cart.filter(item => item.productId !== productId);
    this.saveCart(filtered);
    return filtered;
  },

  updateCartQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart(cart);
    }
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // AUTENTICAÇÃO ADMIN
  checkAdminPassword(password) {
    const stored = localStorage.getItem(this.KEYS.ADMIN_PASSWORD);
    return password === stored;
  },

  // UTILITÁRIOS
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  formatDate(dateString) {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  }
};

// Inicializar ao carregar
if (typeof window !== 'undefined') {
  DB.init();
}
