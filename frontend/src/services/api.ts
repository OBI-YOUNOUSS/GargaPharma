/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async handleResponse(response: Response) {
    if (!response.ok) {
      // Si c'est une erreur 401, déconnecter l'utilisateur
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      let errorMessage = `Erreur HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si la réponse n'est pas du JSON
        const text = await response.text();
        errorMessage = text || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async request(url: string, options: RequestInit = {}) {
  try {
    console.log(`🔄 API Call: ${options.method || 'GET'} ${url}`);

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};

    // Si ce n'est pas un FormData, on met JSON
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    // Si body existe et est un objet normal (pas FormData), stringify
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    return await this.handleResponse(response);

  } catch (error: any) {
    console.error(`❌ API Error [${url}]:`, error);

    // Si c'est une erreur réseau
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    }

    throw error;
  }
}


  // ==================== AUTH ====================
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // ==================== PRODUCTS ====================
  async getProducts(filters: any = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: productData
    });
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: productData
    });
  }

  async deleteProduct(productId: number) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE'
    });
  }

  // ==================== ADMIN ====================
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  // ==================== ORDERS ====================
  async createOrder(orderData: any) {
    console.log('🛒 Envoi commande au backend:', orderData);
    try {
      const result = await this.request('/orders', {
        method: 'POST',
        body: orderData
      });
      console.log('✅ Réponse commande:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur API commande:', error);
      throw error;
    }
  }

  async getUserOrders() {
    return this.request('/orders/my-orders');
  }



  // ==================== CONTACT MESSAGES ====================
  async getContactMessages() {
    return this.request('/contact/messages');
  }

  async getContactMessage(id: number) {
    return this.request(`/contact/messages/${id}`);
  }

  async updateMessageStatus(id: number, status: string) {
    return this.request(`/contact/messages/${id}/status`, {
      method: 'PUT',
      body: { status }
    });
  }

  async deleteMessage(id: number) {
    return this.request(`/contact/messages/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== ADMIN USERS ====================
  async getUsers() {
    return this.request('/admin/users');
  }

  async updateUserStatus(userId: number, isActive: boolean) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: { is_active: isActive }
    });
  }

  async updateUserRole(userId: number, role: string) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role }
    });
  }

  // ==================== UTILS ====================
  async healthCheck() {
    return this.request('/health');
  }

  // ==================== ORDERS ====================
  async getAllOrders() {
    return this.request('/orders');
  }

  async updateOrderStatus(orderId: number, status: string) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }

  async getOrderDetails(orderId: number) {
    return this.request(`/orders/${orderId}`);
  }

  // Ajouter à services/api.ts
// ==================== CONVERSATIONS & MESSAGES ====================
async createConversation(conversationData: any) {
  return this.request('/conversations', {
    method: 'POST',
    body: conversationData
  });
}

async getUserConversations() {
  return this.request('/conversations/my-conversations');
}

async getAllConversations() {
  return this.request('/conversations');
}

async getConversation(conversationId: number) {
  return this.request(`/conversations/${conversationId}`);
}

async sendMessage(conversationId: number, messageData: any) {
  return this.request(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: messageData
  });
}

async markMessagesAsRead(messageIds: number[]) {
  return this.request('/conversations/messages/read', {
    method: 'PATCH',
    body: { message_ids: messageIds }
  });
}

async getUnreadMessageCount() {
  return this.request('/conversations/messages/unread-count');
}

}

export default new ApiService();