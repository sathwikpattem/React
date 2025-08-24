const API_BASE_URL = 'http://localhost:5000/api';

class ItemService {
  // Get all items
  static async getAllItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  // Get item by ID
  static async getItemById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch item with id ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  // Add new item
  static async addItem(item) {
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  // Update item
  static async updateItem(id, item) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error(`Failed to update item with id ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Delete item
  static async deleteItem(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete item with id ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
}

export default ItemService;
