using ShoeShopAPI.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ShoeShopAPI.Services
{
    public class CategoryService
    {
        private List<Category> _categories;
        private List<Product> _products;

        public CategoryService()
        {
            // Initialize categories
            _categories = new List<Category>
            {
                new Category
                {
                    Id = "68357d04f36a0ed8780f72dd",
                    Name = "Sneaker",
                    Slug = "sneaker",
                    Description = "Casual athletic shoes designed for comfort and style",
                    Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                },
                new Category
                {
                    Id = "68357d04f36a0ed8780f72de",
                    Name = "Boot",
                    Slug = "boot",
                    Description = "Durable footwear for rugged terrain and weather",
                    Image = "https://images.unsplash.com/photo-1608256246200-53e635b5b65f"
                },
                new Category
                {
                    Id = "68357d04f36a0ed8780f72df",
                    Name = "Running",
                    Slug = "running",
                    Description = "Performance shoes designed for runners",
                    Image = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
                },
                new Category
                {
                    Id = "68357d04f36a0ed8780f72e1",
                    Name = "Men",
                    Slug = "men",
                    Description = "Shoes designed for men",
                    Image = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2"
                }
            };

            // Initialize products with category references
            _products = new List<Product>
            {
                new Product { 
                    Id = "sneaker-1", 
                    Name = "Nike Air Max", 
                    Description = "Giày thời trang với đệm khí cực êm.",
                    Brand = "Nike",
                    Category = new List<string> { "68357d04f36a0ed8780f72dd", "68357d04f36a0ed8780f72e1" },
                    Tags = new List<string> { "Popular", "Classic" },
                    Stock = 15,
                    Rating = 4.5,
                    ReviewCount = 87,
                    Price = new PriceInfo { Original = 3200000, Discount = 2900000, QuantityDiscount = 5 },
                    Variants = new List<ProductVariant> 
                    { 
                        new ProductVariant 
                        {
                            Color = "Black",
                            Sizes = new List<int> { 39, 40, 41, 42 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/AIR+FORCE+1+%2707.png" }
                        },
                        new ProductVariant 
                        {
                            Color = "White",
                            Sizes = new List<int> { 39, 40, 41, 42 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/AIR+FORCE+1+%2707.png" }
                        }
                    },
                    CreatedAt = DateTime.Parse("2025-04-20T09:00:00"),
                    UpdatedAt = DateTime.Parse("2025-05-15T14:30:00")
                },
                new Product { 
                    Id = "sneaker-2", 
                    Name = "Adidas Ultraboost", 
                    Description = "Giày chạy bộ hiệu suất cao với đệm Boost.",
                    Brand = "Adidas",
                    Category = new List<string> { "68357d04f36a0ed8780f72dd", "68357d04f36a0ed8780f72e1" },
                    Tags = new List<string> { "Running", "Performance" },
                    Stock = 12,
                    Rating = 4.7,
                    ReviewCount = 95,
                    Price = new PriceInfo { Original = 3800000, Discount = 3500000, QuantityDiscount = 8 },
                    Variants = new List<ProductVariant> 
                    { 
                        new ProductVariant 
                        {
                            Color = "Black",
                            Sizes = new List<int> { 40, 41, 42, 43 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/eaf524f7-a9f7-4f70-a438-1b0480eb2540/NIKE+COURT+VISION+LO.png" }
                        },
                        new ProductVariant 
                        {
                            Color = "Blue",
                            Sizes = new List<int> { 40, 41, 42 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/eaf524f7-a9f7-4f70-a438-1b0480eb2540/NIKE+COURT+VISION+LO.png" }
                        }
                    },
                    CreatedAt = DateTime.Parse("2025-04-25T10:15:00"),
                    UpdatedAt = DateTime.Parse("2025-05-20T11:45:00")
                },
                new Product { 
                    Id = "boot-1", 
                    Name = "Dr. Martens 1460", 
                    Description = "Boot da kinh điển với độ bền cao.",
                    Brand = "Dr. Martens",
                    Category = new List<string> { "68357d04f36a0ed8780f72de", "68357d04f36a0ed8780f72e1" },
                    Tags = new List<string> { "Classic", "Leather" },
                    Stock = 8,
                    Rating = 4.6,
                    ReviewCount = 72,
                    Price = new PriceInfo { Original = 3500000, Discount = 3300000, QuantityDiscount = 5 },
                    Variants = new List<ProductVariant> 
                    { 
                        new ProductVariant 
                        {
                            Color = "Black",
                            Sizes = new List<int> { 39, 40, 41, 42, 43 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4e0f6d2a-62c3-47c0-8272-57bde95ca6c8/KILLSHOT+2+LEATHER.png" }
                        },
                        new ProductVariant 
                        {
                            Color = "Cherry Red",
                            Sizes = new List<int> { 40, 41, 42 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4e0f6d2a-62c3-47c0-8272-57bde95ca6c8/KILLSHOT+2+LEATHER.png" }
                        }
                    },
                    CreatedAt = DateTime.Parse("2025-03-15T08:30:00"),
                    UpdatedAt = DateTime.Parse("2025-05-10T16:20:00")
                },
                new Product { 
                    Id = "running-1", 
                    Name = "Nike Pegasus Plus", 
                    Description = "Giày chạy bộ cao cấp với công nghệ đệm Air Zoom.",
                    Brand = "Nike",
                    Category = new List<string> { "68357d04f36a0ed8780f72df", "68357d04f36a0ed8780f72e1" },
                    Tags = new List<string> { "Performance", "Cushioning" },
                    Stock = 10,
                    Rating = 4.8,
                    ReviewCount = 110,
                    Price = new PriceInfo { Original = 3900000, Discount = 3600000, QuantityDiscount = 10 },
                    Variants = new List<ProductVariant> 
                    { 
                        new ProductVariant 
                        {
                            Color = "Blue",
                            Sizes = new List<int> { 39, 40, 41, 42, 43 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e21e9282-d220-42d7-974d-873e5736f598/PEGASUS+PLUS.png" }
                        },
                        new ProductVariant 
                        {
                            Color = "Black",
                            Sizes = new List<int> { 40, 41, 42, 43 },
                            Images = new List<string> { "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e21e9282-d220-42d7-974d-873e5736f598/PEGASUS+PLUS.png" }
                        }
                    },
                    CreatedAt = DateTime.Parse("2025-05-01T10:00:00"),
                    UpdatedAt = DateTime.Parse("2025-05-27T09:00:00")
                }
            };
        }

        public Task<List<Category>> GetAllCategoriesAsync()
        {
            return Task.FromResult(_categories);
        }

        public Task<Category?> GetCategoryByIdAsync(string id)
        {
            var category = _categories.FirstOrDefault(c => c.Id == id);
            return Task.FromResult(category);
        }

        public Task<List<Product>> GetAllProductsAsync()
        {
            return Task.FromResult(_products);
        }

        public Task<List<Product>> GetProductsByCategoryIdAsync(string categoryId)
        {
            var products = _products.Where(p => p.Category.Contains(categoryId)).ToList();
            return Task.FromResult(products);
        }

        public Task<Product?> GetProductByIdAsync(string productId)
        {
            var product = _products.FirstOrDefault(p => p.Id == productId);
            return Task.FromResult(product);
        }
    }
} 