using Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System;

namespace Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ShopContext context)
        {
            // Apply migrations
            context.Database.Migrate();

            // Kiểm tra xem đã có dữ liệu trong bảng Categories chưa
            if (context.Categories.Any())
            {
                return;   // DB đã được seed
            }

            // Seed categories
            var categories = new Category[]
            {
                new Category { Name = "men", Description = "Men's footwear collection", Slug = "men" },
                new Category { Name = "women", Description = "Women's footwear collection", Slug = "women" },
                new Category { Name = "children", Description = "Children's footwear collection", Slug = "children" },
                new Category { Name = "sport", Description = "Sport footwear for active lifestyle", Slug = "sport" },
                new Category { Name = "casual", Description = "Casual everyday footwear", Slug = "casual" }
            };

            context.Categories.AddRange(categories);
            context.SaveChanges();

            // Sample products
            var products = new Product[]
            {
                new Product
                {
                    Name = "Nike Air Max",
                    Description = "The latest Air Max model with improved cushioning for maximum comfort during long runs.",
                    Brand = "Nike",
                    Price = 1450000,
                    Stock = 30,
                    CategoryId = 1, // Men
                    Slug = "nike-air-max"
                },
                new Product
                {
                    Name = "Adidas Ultraboost",
                    Description = "Versatile training shoes with responsive cushioning and breathable upper.",
                    Brand = "Adidas",
                    Price = 1350000,
                    Stock = 25,
                    CategoryId = 2, // Women
                    Slug = "adidas-ultraboost"
                },
                new Product
                {
                    Name = "Puma RS-X",
                    Description = "Durable and comfortable sport shoes for active children with velcro straps for easy wearing.",
                    Brand = "Puma",
                    Price = 950000,
                    Stock = 20,
                    CategoryId = 3, // Children
                    Slug = "puma-rs-x"
                },
                new Product
                {
                    Name = "Converse Chuck Taylor",
                    Description = "Classic canvas shoes with timeless design for casual wear.",
                    Brand = "Converse",
                    Price = 850000,
                    Stock = 35,
                    CategoryId = 1, // Men
                    Slug = "converse-chuck-taylor"
                },
                new Product
                {
                    Name = "New Balance 574",
                    Description = "Comfortable and stylish sneakers with excellent support for everyday use.",
                    Brand = "New Balance",
                    Price = 1250000,
                    Stock = 18,
                    CategoryId = 2, // Women
                    Slug = "new-balance-574"
                },
                new Product
                {
                    Name = "Vans Old Skool",
                    Description = "Iconic skate shoes with durable construction and comfortable fit.",
                    Brand = "Vans",
                    Price = 750000,
                    Stock = 22,
                    CategoryId = 3, // Children
                    Slug = "vans-old-skool"
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();

            // Sample variants
            var variants = new Variant[]
            {
                // Nike Air Max variants
                new Variant { 
                    Color = "Black", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "40", Stock = 3 },
                        new SizeInfo { Size = "41", Stock = 4 },
                        new SizeInfo { Size = "42", Stock = 3 },
                        new SizeInfo { Size = "43", Stock = 3 },
                        new SizeInfo { Size = "44", Stock = 2 }
                    }),
                    ImagesString = "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/504b39d1-ccc0-4f9b-bebe-e30b5026e9f2/air-max-1-shoes.png,https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d1982c82-662b-48b7-9e23-940c526c9ee7/air-max-1-shoes-2.png", 
                    ProductId = 1 
                },
                new Variant { 
                    Color = "White", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "39", Stock = 3 },
                        new SizeInfo { Size = "40", Stock = 3 },
                        new SizeInfo { Size = "41", Stock = 3 },
                        new SizeInfo { Size = "42", Stock = 3 },
                        new SizeInfo { Size = "43", Stock = 3 }
                    }),
                    ImagesString = "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/504b39d1-ccc0-4f9b-bebe-e30b5026e9f2/air-max-1-white.png,https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d1982c82-662b-48b7-9e23-940c526c9ee7/air-max-1-white-2.png", 
                    ProductId = 1 
                },
                
                // Adidas Ultraboost variants
                new Variant { 
                    Color = "Pink", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "36", Stock = 3 },
                        new SizeInfo { Size = "37", Stock = 3 },
                        new SizeInfo { Size = "38", Stock = 3 },
                        new SizeInfo { Size = "39", Stock = 3 }
                    }),
                    ImagesString = "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6/ultraboost-22-shoes.jpg,https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2cee64414e1f4f31b441ad7800abd780/ultraboost-22-shoes-2.jpg", 
                    ProductId = 2 
                },
                new Variant { 
                    Color = "Blue", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "36", Stock = 3 },
                        new SizeInfo { Size = "37", Stock = 3 },
                        new SizeInfo { Size = "38", Stock = 3 },
                        new SizeInfo { Size = "39", Stock = 2 },
                        new SizeInfo { Size = "40", Stock = 2 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1556906781-9a412961c28c,https://images.unsplash.com/photo-1557142046-c704a3adf364", 
                    ProductId = 2 
                },
                
                // Puma RS-X variants
                new Variant { 
                    Color = "Red", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "28", Stock = 2 },
                        new SizeInfo { Size = "29", Stock = 2 },
                        new SizeInfo { Size = "30", Stock = 2 },
                        new SizeInfo { Size = "31", Stock = 2 },
                        new SizeInfo { Size = "32", Stock = 2 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1560769629-975ec94e6a86", 
                    ProductId = 3 
                },
                new Variant { 
                    Color = "Green", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "29", Stock = 3 },
                        new SizeInfo { Size = "30", Stock = 3 },
                        new SizeInfo { Size = "31", Stock = 2 },
                        new SizeInfo { Size = "32", Stock = 2 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1560769629-975ec94e6a86,https://images.unsplash.com/photo-1608231387042-66d1773070a5", 
                    ProductId = 3 
                },
                
                // Converse Chuck Taylor variants
                new Variant { 
                    Color = "Black", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "40", Stock = 3 },
                        new SizeInfo { Size = "41", Stock = 3 },
                        new SizeInfo { Size = "42", Stock = 3 },
                        new SizeInfo { Size = "43", Stock = 3 },
                        new SizeInfo { Size = "44", Stock = 3 },
                        new SizeInfo { Size = "45", Stock = 3 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1494496195158-c3becb4f2475", 
                    ProductId = 4 
                },
                new Variant { 
                    Color = "Red", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "39", Stock = 4 },
                        new SizeInfo { Size = "40", Stock = 4 },
                        new SizeInfo { Size = "41", Stock = 3 },
                        new SizeInfo { Size = "42", Stock = 3 },
                        new SizeInfo { Size = "43", Stock = 3 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1494496195158-c3becb4f2475,https://images.unsplash.com/photo-1607522370275-f14206abe5d3", 
                    ProductId = 4 
                },
                
                // New Balance 574 variants
                new Variant { 
                    Color = "Grey", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "36", Stock = 2 },
                        new SizeInfo { Size = "37", Stock = 2 },
                        new SizeInfo { Size = "38", Stock = 2 },
                        new SizeInfo { Size = "39", Stock = 2 },
                        new SizeInfo { Size = "40", Stock = 1 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1539185441755-769473a23570", 
                    ProductId = 5 
                },
                new Variant { 
                    Color = "Navy", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "35", Stock = 2 },
                        new SizeInfo { Size = "36", Stock = 2 },
                        new SizeInfo { Size = "37", Stock = 2 },
                        new SizeInfo { Size = "38", Stock = 2 },
                        new SizeInfo { Size = "39", Stock = 1 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1539185441755-769473a23570,https://images.unsplash.com/photo-1539185441755-769473a23570", 
                    ProductId = 5 
                },
                
                // Vans Old Skool variants
                new Variant { 
                    Color = "Black", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "30", Stock = 2 },
                        new SizeInfo { Size = "31", Stock = 3 },
                        new SizeInfo { Size = "32", Stock = 3 },
                        new SizeInfo { Size = "33", Stock = 2 },
                        new SizeInfo { Size = "34", Stock = 1 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77", 
                    ProductId = 6 
                },
                new Variant { 
                    Color = "Checkerboard", 
                    SizesJson = JsonSerializer.Serialize(new List<SizeInfo> {
                        new SizeInfo { Size = "31", Stock = 3 },
                        new SizeInfo { Size = "32", Stock = 3 },
                        new SizeInfo { Size = "33", Stock = 3 },
                        new SizeInfo { Size = "34", Stock = 2 }
                    }),
                    ImagesString = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77,https://images.unsplash.com/photo-1604868189265-219ba7bfbc32", 
                    ProductId = 6 
                }
            };

            context.Variants.AddRange(variants);
            context.SaveChanges();
            
            // Sample users
            if (!context.Users.Any())
            {
                var users = new User[]
                {
                    new User
                    {
                        Username = "admin",
                        Email = "admin@example.com",
                        Password = "Admin123", // In production, this should be hashed
                        FullName = "Admin User",
                        Type = "WEBSITE",
                        Role = 2, // Admin
                        Gender = "male",
                        PhoneNumber = "0123456789",
                        Avatar = "https://randomuser.me/api/portraits/men/1.jpg",
                        Status = 1, // Active
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new User
                    {
                        Username = "user",
                        Email = "user@example.com",
                        Password = "User123", // In production, this should be hashed
                        FullName = "Regular User",
                        Type = "WEBSITE",
                        Role = 0, // Regular user
                        Gender = "female",
                        PhoneNumber = "0987654321",
                        Avatar = "https://randomuser.me/api/portraits/women/1.jpg",
                        Status = 1, // Active
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    }
                };

                context.Users.AddRange(users);
                context.SaveChanges();
                
                // Add sample addresses
                var addresses = new Address[]
                {
                    new Address
                    {
                        Street = "123 Main St",
                        City = "Ho Chi Minh City",
                        District = "District 1",
                        Ward = "Ben Nghe",
                        Country = "Vietnam",
                        IsDefault = true,
                        UserId = 2, // Regular user
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    },
                    new Address
                    {
                        Street = "456 Secondary St",
                        City = "Ho Chi Minh City",
                        District = "District 3",
                        Ward = "Ward 4",
                        Country = "Vietnam",
                        IsDefault = false,
                        UserId = 2, // Regular user
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    }
                };
                
                context.Addresses.AddRange(addresses);
                context.SaveChanges();
            }
        }
    }
}