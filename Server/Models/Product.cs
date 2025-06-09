using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;
        
        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Brand { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // Thông tin giá chi tiết
        [NotMapped]
        public PriceDetails? PriceDetails { get; set; }
        
        // Số lượng tồn kho tổng
        public int Stock { get; set; }
        
        // Tags cho sản phẩm
        [NotMapped]
        public List<string>? Tags { get; set; }
        
        // Foreign key for Category
        public int CategoryId { get; set; }
        
        // Navigation properties
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Slug { get; set; } = null!;
        
        public virtual ICollection<Variant>? Variants { get; set; }
    }

    public class PriceDetails
    {
        public decimal Original { get; set; }
        public decimal Discount { get; set; }
        public int QuantityDiscount { get; set; }
    }
} 