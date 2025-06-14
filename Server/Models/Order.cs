using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = null!;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Address { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = null!;

        [StringLength(500)]
        public string? Note { get; set; }

        [Required]
        [StringLength(20)]
        public string PaymentMethod { get; set; } = null!;

        [Required]
        public string Status { get; set; } = "Pending"; //  PENDING: 'Pending', CONFIRMED: 'Confirmed', SHIPPING: 'Shipping',DELIVERED: 'Delivered',CANCELLED: 'Cancelled'

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
    
    // public class OrderItem
    // {
    //     [Key]
    //     public int Id { get; set; }

    //     [Required]
    //     public int OrderId { get; set; }

    //     [Required]
    //     public int ProductId { get; set; }

    //     [Required]
    //     public int Quantity { get; set; }

    //     [Required]
    //     [Column(TypeName = "decimal(18,2)")]
    //     public decimal Price { get; set; }

    //     [Required]
    //     [StringLength(10)]
    //     public string Size { get; set; } = null!;

    //     [Required]
    //     [StringLength(50)]
    //     public string Color { get; set; } = null!;

    //     public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
    //     public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    //     // Navigation properties
    //     [ForeignKey("OrderId")]
    //     [JsonIgnore]
    //     public virtual Order? Order { get; set; }

    //     [ForeignKey("ProductId")]
    //     public virtual Product? Product { get; set; }
    // }
} 