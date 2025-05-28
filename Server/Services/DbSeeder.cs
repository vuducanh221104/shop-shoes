using MongoDB.Driver;
using ShoeShopAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ShoeShopAPI.Services
{
    public class DbSeeder
    {
        private readonly MongoDBContext _context;

        public DbSeeder(MongoDBContext context)
        {
            _context = context;
        }

        public void Seed()
        {
            if (!_context.Products.Find(_ => true).Any())
            {
                var products = new List<Product>
                {
                    new Product
                    {
                        Name = "Nike Air Force 1 '07",
                        Description = "Giày thời trang kết hợp thể thao với đế Air cực êm.",
                        Brand = "Nike",
                        Category = new List<string> { "68357d04f36a0ed8780f72dd", "68357d04f36a0ed8780f72e1" },
                        Tags = new List<string> { "New", "For Sport", "Popular" },
                        Stock = 30,
                        Rating = 4.5,
                        ReviewCount = 150,
                        Price = new PriceInfo
                        {
                            Original = 2900000,
                            Discount = 2600000,
                            QuantityDiscount = 5
                        },
                        Variants = new List<ProductVariant>
                        {
                            new ProductVariant
                            {
                                Color = "White",
                                Sizes = new List<int> { 39, 40, 41, 42, 43 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/AIR+FORCE+1+%2707.png"
                                }
                            },
                            new ProductVariant
                            {
                                Color = "Black",
                                Sizes = new List<int> { 40, 41, 42, 43 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/AIR+FORCE+1+%2707.png"
                                }
                            }
                        },
                        CreatedAt = DateTime.Parse("2025-05-01T09:00:00"),
                        UpdatedAt = DateTime.Parse("2025-05-25T10:00:00")
                    },
                    new Product
                    {
                        Name = "Nike Court Vision Lo",
                        Description = "Giày thể thao lấy cảm hứng từ giày bóng rổ với thiết kế hiện đại.",
                        Brand = "Nike",
                        Category = new List<string> { "68357d04f36a0ed8780f72dd", "68357d04f36a0ed8780f72e1" },
                        Tags = new List<string> { "New", "Basketball", "Trendy" },
                        Stock = 25,
                        Rating = 4.3,
                        ReviewCount = 98,
                        Price = new PriceInfo
                        {
                            Original = 2200000,
                            Discount = 1990000,
                            QuantityDiscount = 8
                        },
                        Variants = new List<ProductVariant>
                        {
                            new ProductVariant
                            {
                                Color = "White",
                                Sizes = new List<int> { 39, 40, 41, 42 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/eaf524f7-a9f7-4f70-a438-1b0480eb2540/NIKE+COURT+VISION+LO.png"
                                }
                            },
                            new ProductVariant
                            {
                                Color = "Blue",
                                Sizes = new List<int> { 40, 41, 42, 43 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/eaf524f7-a9f7-4f70-a438-1b0480eb2540/NIKE+COURT+VISION+LO.png"
                                }
                            }
                        },
                        CreatedAt = DateTime.Parse("2025-05-03T11:00:00"),
                        UpdatedAt = DateTime.Parse("2025-05-26T09:00:00")
                    },
                    new Product
                    {
                        Name = "Nike Killshot 2 Leather",
                        Description = "Giày thể thao phong cách retro với chất liệu da cao cấp.",
                        Brand = "Nike",
                        Category = new List<string> { "68357d04f36a0ed8780f72de", "68357d04f36a0ed8780f72e1" },
                        Tags = new List<string> { "Retro", "Premium", "Leather" },
                        Stock = 20,
                        Rating = 4.7,
                        ReviewCount = 110,
                        Price = new PriceInfo
                        {
                            Original = 2600000,
                            Discount = 2400000,
                            QuantityDiscount = 6
                        },
                        Variants = new List<ProductVariant>
                        {
                            new ProductVariant
                            {
                                Color = "White",
                                Sizes = new List<int> { 39, 40, 41, 42 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4e0f6d2a-62c3-47c0-8272-57bde95ca6c8/KILLSHOT+2+LEATHER.png"
                                }
                            },
                            new ProductVariant
                            {
                                Color = "Navy",
                                Sizes = new List<int> { 40, 41, 42 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4e0f6d2a-62c3-47c0-8272-57bde95ca6c8/KILLSHOT+2+LEATHER.png"
                                }
                            }
                        },
                        CreatedAt = DateTime.Parse("2025-04-28T14:00:00"),
                        UpdatedAt = DateTime.Parse("2025-05-24T16:00:00")
                    },
                    new Product
                    {
                        Name = "Nike Jam",
                        Description = "Giày thể thao dành cho hoạt động ngoài trời với thiết kế thoáng khí.",
                        Brand = "Nike",
                        Category = new List<string> { "68357d04f36a0ed8780f72df", "68357d04f36a0ed8780f72e1" },
                        Tags = new List<string> { "Outdoor", "Breathable", "Durable" },
                        Stock = 22,
                        Rating = 4.1,
                        ReviewCount = 75,
                        Price = new PriceInfo
                        {
                            Original = 1950000,
                            Discount = 1750000,
                            QuantityDiscount = 10
                        },
                        Variants = new List<ProductVariant>
                        {
                            new ProductVariant
                            {
                                Color = "Black",
                                Sizes = new List<int> { 39, 40, 41, 42, 43 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/df01fd1c-e04b-4836-a9d1-cd7f4221fc74/NIKE+JAM.png"
                                }
                            },
                            new ProductVariant
                            {
                                Color = "Gray",
                                Sizes = new List<int> { 40, 41, 42, 43 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/df01fd1c-e04b-4836-a9d1-cd7f4221fc74/NIKE+JAM.png"
                                }
                            }
                        },
                        CreatedAt = DateTime.Parse("2025-05-05T10:30:00"),
                        UpdatedAt = DateTime.Parse("2025-05-27T08:45:00")
                    },
                    new Product
                    {
                        Name = "Nike Pegasus Plus",
                        Description = "Giày chạy bộ cao cấp với công nghệ đệm Air Zoom mang lại cảm giác êm ái.",
                        Brand = "Nike",
                        Category = new List<string> { "68357d04f36a0ed8780f72e0", "68357d04f36a0ed8780f72e1" },
                        Tags = new List<string> { "New", "Running", "Premium" },
                        Stock = 18,
                        Rating = 4.6,
                        ReviewCount = 130,
                        Price = new PriceInfo
                        {
                            Original = 3900000,
                            Discount = 3600000,
                            QuantityDiscount = 10
                        },
                        Variants = new List<ProductVariant>
                        {
                            new ProductVariant
                            {
                                Color = "Blue",
                                Sizes = new List<int> { 39, 40, 41, 42, 43 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e21e9282-d220-42d7-974d-873e5736f598/PEGASUS+PLUS.png"
                                }
                            },
                            new ProductVariant
                            {
                                Color = "Black",
                                Sizes = new List<int> { 40, 41, 42, 43 },
                                Images = new List<string>
                                {
                                    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e21e9282-d220-42d7-974d-873e5736f598/PEGASUS+PLUS.png"
                                }
                            }
                        },
                        CreatedAt = DateTime.Parse("2025-05-01T10:00:00"),
                        UpdatedAt = DateTime.Parse("2025-05-27T09:00:00")
                    }
                };

                _context.Products.InsertMany(products);
            }
        }
    }
} 