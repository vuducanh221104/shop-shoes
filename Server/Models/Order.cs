using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace ShoeShopAPI.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;
        
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
        
        public decimal TotalAmount { get; set; }
        
        public string ShippingAddress { get; set; } = null!;
        
        public string ContactPhone { get; set; } = null!;
        
        public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
        
        public string PaymentMethod { get; set; } = "CashOnDelivery"; // CashOnDelivery, CreditCard, BankTransfer
        
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
    }
    
    public class OrderItem
    {
        public string ProductId { get; set; } = null!;
        
        public string ProductName { get; set; } = null!;
        
        public decimal Price { get; set; }
        
        public int Quantity { get; set; }
        
        public decimal Subtotal { get; set; }
    }
    
    public class CreateOrderRequest
    {
        public List<OrderItemRequest> Items { get; set; } = new List<OrderItemRequest>();
        
        public string ShippingAddress { get; set; } = null!;
        
        public string ContactPhone { get; set; } = null!;
        
        public string PaymentMethod { get; set; } = "CashOnDelivery";
    }
    
    public class OrderItemRequest
    {
        public string ProductId { get; set; } = null!;
        
        public int Quantity { get; set; }
    }
    
    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = null!;
    }
} 