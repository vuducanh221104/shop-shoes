using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [StringLength(100)]
        public string? Username { get; set; }
        
        [StringLength(200)]
        public string? FullName { get; set; }
        
        [StringLength(100)]
        public string? Email { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Password { get; set; } = null!;
        
        [Required]
        [StringLength(20)]
        public string Type { get; set; } = "WEBSITE";
        
        [Required]
        public int Role { get; set; } = 0;
        
        [StringLength(10)]
        public string Gender { get; set; } = "male";
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [StringLength(255)]
        public string? Avatar { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [Required]
        public int Status { get; set; } = 1;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        
        // Navigation properties
        public virtual ICollection<Address>? Addresses { get; set; }
        
        public virtual ICollection<RefreshToken>? RefreshTokens { get; set; }
        
        // Reference to Orders (assuming we'll create an Order model)
        public virtual ICollection<Order>? Orders { get; set; }
    }

    public class Address
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Street { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        public string City { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        public string Country { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        public string District { get; set; } = null!;
        
        [StringLength(100)]
        public string? Ward { get; set; }
        
        public bool IsDefault { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        
        // Foreign key for User
        public int UserId { get; set; }
        
        // Navigation property
        [ForeignKey("UserId")]
        [JsonIgnore]
        public virtual User? User { get; set; }
    }

    public class RefreshToken
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Token { get; set; } = null!;
        
        [Required]
        public DateTime ExpiresAt { get; set; }
        
        public bool IsRevoked { get; set; } = false;
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        [StringLength(255)]
        public string? UserAgent { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Foreign key for User
        public int UserId { get; set; }
        
        // Navigation property
        [ForeignKey("UserId")]
        [JsonIgnore]
        public virtual User? User { get; set; }
    }
} 