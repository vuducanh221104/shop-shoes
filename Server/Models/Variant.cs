using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models
{
    public class Variant
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Color { get; set; } = null!;
        
        // Danh sách kích cỡ với số lượng
        [NotMapped]
        public List<SizeInfo>? Sizes { get; set; }
        
        // Kích cỡ lưu trong database (chuỗi JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string? SizesJson { get; set; }
        
        // Danh sách hình ảnh
        [NotMapped]
        public List<string>? Images { get; set; }
        
        // Hình ảnh lưu trong database (chuỗi phân tách bằng dấu phẩy)
        [StringLength(1000)]
        public string? ImagesString { get; set; }
        
        // Tổng số lượng của tất cả các size
        [NotMapped]
        public int TotalStock { get; set; }
        
        // Foreign key for Product
        public int ProductId { get; set; }
        
        // Navigation property
        [ForeignKey("ProductId")]
        [JsonIgnore]
        public virtual Product? Product { get; set; }
    }

    public class SizeInfo
    {
        public string Size { get; set; } = null!;
        public int Stock { get; set; }
    }
} 