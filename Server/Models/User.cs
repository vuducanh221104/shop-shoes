using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace ShoeShopAPI.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        
        public string Username { get; set; } = null!;
        
        public string Email { get; set; } = null!;
        
        public string PasswordHash { get; set; } = null!;
        
        public string FullName { get; set; } = null!;
        
        public string Address { get; set; } = string.Empty;
        
        public string Phone { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsAdmin { get; set; } = false;
    }
    
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    
    public class RegisterRequest
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
    
    public class LoginResponse
    {
        public string Id { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Token { get; set; } = null!;
        public bool IsAdmin { get; set; }
    }
} 