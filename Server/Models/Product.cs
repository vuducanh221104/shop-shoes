using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace ShoeShopAPI.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        
        public string Name { get; set; } = null!;
        
        public string Description { get; set; } = string.Empty;
        
        public string Brand { get; set; } = string.Empty;
        
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Category { get; set; } = new List<string>();
        
        public List<string> Tags { get; set; } = new List<string>();
        
        public int Stock { get; set; } = 0;
        
        public double Rating { get; set; } = 0;
        
        public int ReviewCount { get; set; } = 0;
        
        public PriceInfo Price { get; set; } = new PriceInfo();
        
        public List<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
    }

    public class PriceInfo
    {
        public decimal Original { get; set; }
        public decimal Discount { get; set; }
        public int QuantityDiscount { get; set; }
    }

    public class ProductVariant
    {
        public string Color { get; set; } = string.Empty;
        public List<int> Sizes { get; set; } = new List<int>();
        public List<string> Images { get; set; } = new List<string>();
    }

    public class Category
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        
        public string Name { get; set; } = null!;
        
        public string Slug { get; set; } = null!;
        
        public string Description { get; set; } = string.Empty;
        
        public string Image { get; set; } = string.Empty;
    }
    
    public class ProductCreateRequest
    {
        public string Name { get; set; } = null!;
        
        public string Description { get; set; } = string.Empty;
        
        public string Brand { get; set; } = string.Empty;
        
        public List<string> Category { get; set; } = new List<string>();
        
        public List<string> Tags { get; set; } = new List<string>();
        
        public int Stock { get; set; } = 0;
        
        public PriceInfo Price { get; set; } = new PriceInfo();
        
        public List<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    }
    
    public class ProductUpdateRequest
    {
        public string? Name { get; set; }
        
        public string? Description { get; set; }
        
        public string? Brand { get; set; }
        
        public List<string>? Category { get; set; }
        
        public List<string>? Tags { get; set; }
        
        public int? Stock { get; set; }
        
        public PriceInfo? Price { get; set; }
        
        public List<ProductVariant>? Variants { get; set; }
        
        public double? Rating { get; set; }
        
        public int? ReviewCount { get; set; }
    }
    
    public class CategoryCreateRequest
    {
        public string Name { get; set; } = null!;
        
        public string Slug { get; set; } = null!;
        
        public string Description { get; set; } = string.Empty;
        
        public string Image { get; set; } = string.Empty;
    }
} 