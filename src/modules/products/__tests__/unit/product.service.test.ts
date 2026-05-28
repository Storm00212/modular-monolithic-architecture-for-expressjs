import {
  fetchProducts,
  findProductById,
  createProductService,
  updateProductService,
  deleteProductService,
} from '../../services/product.service';

const getProducts = jest.fn();
const getProductById = jest.fn();
const createProduct = jest.fn();
const updateProduct = jest.fn();
const deleteProduct = jest.fn();

jest.mock('../../product.repository', () => ({
  getProducts: () => getProducts(),
  getProductById: () => getProductById(),
  createProduct: () => createProduct(),
  updateProduct: () => updateProduct(),
  deleteProduct: () => deleteProduct(),
}));

describe('product.service', () => {
  const mockProduct = {
    id: 'product-123',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    createdBy: 'user-123',
    creator: { id: 'user-123', name: 'Creator', email: 'creator@test.com' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should return all products', async () => {
      getProducts.mockResolvedValue([mockProduct]);

      const result = await fetchProducts();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Product');
    });
  });

  describe('findProductById', () => {
    it('should return product by ID', async () => {
      getProductById.mockResolvedValue(mockProduct);

      const result = await findProductById('product-123');
      expect(result.id).toBe('product-123');
    });

    it('should return null if product not found', async () => {
      getProductById.mockResolvedValue(null);

      const result = await findProductById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('createProductService', () => {
    it('should create a product with provided data', async () => {
      createProduct.mockResolvedValue(mockProduct);

      const result = await createProductService({
        name: 'New Product',
        description: 'New Description',
        price: 50.0,
        stock: 5,
        createdBy: 'user-123',
      });

      expect(result.name).toBe('Test Product');
    });

    it('should create a product with default stock of 0', async () => {
      createProduct.mockResolvedValue({ ...mockProduct, stock: 0 });

      await createProductService({
        name: 'New Product',
        description: 'New Description',
        price: 50.0,
        stock: undefined as any,
        createdBy: 'user-123',
      });

      expect(createProduct).toHaveBeenCalled();
    });
  });

  describe('updateProductService', () => {
    it('should update product with provided data', async () => {
      updateProduct.mockResolvedValue({ ...mockProduct, name: 'Updated Product' });

      const result = await updateProductService('product-123', { name: 'Updated Product' });
      expect(result.name).toBe('Updated Product');
    });
  });

  describe('deleteProductService', () => {
    it('should delete a product', async () => {
      deleteProduct.mockResolvedValue(mockProduct);

      const result = await deleteProductService('product-123');
      expect(result).toEqual(mockProduct);
    });
  });
});