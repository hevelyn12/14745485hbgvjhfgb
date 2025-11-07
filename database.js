// Sistema de gerenciamento de dados usando localStorage
// Todas as operações de CRUD para produtos, pedidos, formas de pagamento, etc.

const DB = {
  // Chaves do localStorage
  KEYS: {
    PRODUCTS: 'shop_products_v1',
    ORDERS: 'shop_orders_v1',
    PAYMENT_METHODS: 'shop_payment_methods_v1',
    ADMIN_PASSWORD: 'shop_admin_password_v1',
    CART: 'shop_cart_v1'
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
          id: Date.now(),
          name: 'Camiseta Premium',
          description: 'Camiseta de alta qualidade, 100% algodão. Confortável e durável. Disponível em diversos tamanhos.',
          price: 89.90,
          image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%239333EA" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ECamiseta Premium%3C/text%3E%3C/svg%3E',
          stock: 50,
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          name: 'Calça Jeans Moderna',
          description: 'Calça jeans com corte moderno e confortável. Tecido de alta qualidade que não desbota.',
          price: 159.90,
          image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%233B82F6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3ECalça Jeans%3C/text%3E%3C/svg%3E',
          stock: 30,
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() + 2,
          name: 'Jaqueta Elegante',
          description: 'Jaqueta elegante perfeita para qualquer ocasião. Material resistente e estilo atemporal.',
          price: 249.90,
          image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%237C3AED" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em"%3EJaqueta Elegante%3C/text%3E%3C/svg%3E',
          stock: 20,
          active: true,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    }

    // Formas de pagamento padrão
    if (!localStorage.getItem(this.KEYS.PAYMENT_METHODS)) {
      const defaultMethods = [
        {
          id: 1,
          name: 'PIX',
          type: 'qr',
          value: '',
          description: 'Pagamento instantâneo via PIX',
          active: true
        },
        {
          id: 2,
          name: 'Transferência Bancária',
          type: 'text',
          value: 'Banco: 001 - Bradesco\nAgência: 1234-5\nConta: 12345-6\nCPF: 123.456.789-00',
          description: 'Transferência bancária tradicional',
          active: true
        },
        {
          id: 3,
          name: 'Boleto',
          type: 'link',
          value: '',
          description: 'Pagamento via boleto bancário',
          active: false
        }
      ];
      localStorage.setItem(this.KEYS.PAYMENT_METHODS, JSON.stringify(defaultMethods));
    }

    // Pedidos
    if (!localStorage.getItem(this.KEYS.ORDERS)) {
      localStorage.setItem(this.KEYS.ORDERS, JSON.stringify([]));
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
    return products.find(p => p.id === id);
  },

  saveProduct(product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index >= 0) {
      products[index] = { ...products[index], ...product, updatedAt: new Date().toISOString() };
    } else {
      product.id = Date.now();
      product.createdAt = new Date().toISOString();
      products.push(product);
    }
    
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  },

  deleteProduct(id) {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(filtered));
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

  saveOrder(order) {
    const orders = this.getOrders();
    order.id = order.id || Date.now().toString();
    order.createdAt = order.createdAt || new Date().toISOString();
    order.status = order.status || 'pending';
    orders.unshift(order); // Adiciona no início
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    return order;
  },

  updateOrderStatus(id, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  // FORMAS DE PAGAMENTO
  getPaymentMethods() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.PAYMENT_METHODS) || '[]');
    } catch (e) {
      return [];
    }
  },

  savePaymentMethods(methods) {
    localStorage.setItem(this.KEYS.PAYMENT_METHODS, JSON.stringify(methods));
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

  clearCart() {
    localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
  },

  addToCart(productId, quantity = 1) {
    const cart = this.getCart();
    const product = this.getProduct(productId);
    
    if (!product) return false;

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }
    
    this.saveCart(cart);
    return true;
  },

  removeFromCart(productId) {
    const cart = this.getCart();
    const filtered = cart.filter(item => item.productId !== productId);
    this.saveCart(filtered);
  },

  updateCartQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart(cart);
    }
  },

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // AUTENTICAÇÃO
  checkPassword(password) {
    const stored = localStorage.getItem(this.KEYS.ADMIN_PASSWORD);
    return password === stored;
  },

  changePassword(newPassword) {
    localStorage.setItem(this.KEYS.ADMIN_PASSWORD, newPassword);
  }
};

// Utilitários
const Utils = {
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
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  generateWhatsAppLink(phone, message = '') {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
  },

  pictographPhone(phone) {
    // Transforma número em pictogramas para dificultar bots
    const map = {
      '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④',
      '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    };
    return phone.split('').map(char => map[char] || char).join('');
  }
};

// Inicializar ao carregar
if (typeof window !== 'undefined') {
  DB.init();
}
