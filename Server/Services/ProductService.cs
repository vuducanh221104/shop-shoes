using MongoDB.Driver;
using ShoeShopAPI.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoeShopAPI.Services
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _products;
        private readonly IMongoCollection<Category> _categories;

        public ProductService(MongoDBContext context)
        {
            _products = context.Products;
            _categories = context.Categories;
        }

        // Product Methods
        public async Task<List<Product>> GetAllAsync()
        {
            try
            {
                return await _products.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllAsync: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return new List<Product>();
            }
        }

        public async Task<List<Product>> GetByCategoryAsync(string category)
        {
            try
            {
                return await _products.Find(p => p.Category.Contains(category)).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetByCategoryAsync: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return new List<Product>();
            }
        }

        public async Task<Product> GetByIdAsync(string id)
        {
            try
            {
                return await _products.Find(p => p.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetByIdAsync: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return null;
            }
        }

        public async Task<Product> CreateAsync(ProductCreateRequest productRequest)
        {
            var product = new Product
            {
                Name = productRequest.Name,
                Description = productRequest.Description,
                Brand = productRequest.Brand,
                Category = productRequest.Category,
                Tags = productRequest.Tags,
                Stock = productRequest.Stock,
                Price = productRequest.Price,
                Variants = productRequest.Variants,
                Rating = 0,
                ReviewCount = 0,
                CreatedAt = DateTime.UtcNow
            };

            await _products.InsertOneAsync(product);
            return product;
        }

        public async Task<Product> UpdateAsync(string id, Product productIn)
        {
            productIn.UpdatedAt = DateTime.UtcNow;
            await _products.ReplaceOneAsync(p => p.Id == id, productIn);
            return productIn;
        }

        public async Task<Product> UpdateAsync(string id, ProductUpdateRequest updateRequest)
        {
            var product = await GetByIdAsync(id);
            if (product == null)
            {
                throw new Exception($"Product with ID {id} not found");
            }

            if (updateRequest.Name != null)
                product.Name = updateRequest.Name;
            
            if (updateRequest.Description != null)
                product.Description = updateRequest.Description;
            
            if (updateRequest.Brand != null)
                product.Brand = updateRequest.Brand;
            
            if (updateRequest.Category != null)
                product.Category = updateRequest.Category;
            
            if (updateRequest.Tags != null)
                product.Tags = updateRequest.Tags;
            
            if (updateRequest.Stock.HasValue)
                product.Stock = updateRequest.Stock.Value;
            
            if (updateRequest.Price != null)
                product.Price = updateRequest.Price;
            
            if (updateRequest.Variants != null)
                product.Variants = updateRequest.Variants;
            
            if (updateRequest.Rating.HasValue)
                product.Rating = updateRequest.Rating.Value;
            
            if (updateRequest.ReviewCount.HasValue)
                product.ReviewCount = updateRequest.ReviewCount.Value;
            
            product.UpdatedAt = DateTime.UtcNow;
            
            await _products.ReplaceOneAsync(p => p.Id == id, product);
            return product;
        }

        public async Task RemoveAsync(string id)
        {
            await _products.DeleteOneAsync(p => p.Id == id);
        }

        // Category Methods
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _categories.Find(_ => true).ToListAsync();
        }

        public async Task<Category> GetCategoryByIdAsync(string id)
        {
            return await _categories.Find(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Category> GetCategoryBySlugAsync(string slug)
        {
            return await _categories.Find(c => c.Slug == slug).FirstOrDefaultAsync();
        }

        public async Task<List<Product>> GetProductsByCategorySlugAsync(string slug)
        {
            try
            {
                // First find the category by slug
                var category = await GetCategoryBySlugAsync(slug);
                if (category == null)
                {
                    return new List<Product>();
                }

                // Then get products by category ID
                return await GetByCategoryAsync(category.Id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProductsByCategorySlugAsync: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return new List<Product>();
            }
        }

        public async Task<Category> CreateCategoryAsync(CategoryCreateRequest categoryRequest)
        {
            var category = new Category
            {
                Name = categoryRequest.Name,
                Slug = categoryRequest.Slug,
                Description = categoryRequest.Description,
                Image = categoryRequest.Image
            };

            await _categories.InsertOneAsync(category);
            return category;
        }

        public async Task<Category> UpdateCategoryAsync(string id, Category categoryIn)
        {
            await _categories.ReplaceOneAsync(c => c.Id == id, categoryIn);
            return categoryIn;
        }

        public async Task RemoveCategoryAsync(string id)
        {
            await _categories.DeleteOneAsync(c => c.Id == id);
        }
    }
} 