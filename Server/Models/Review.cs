using System.ComponentModel.DataAnnotations;

namespace ShoeShopAPI.Models
{
    public class Review
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public int Rating { get; set; } // 1-5 stars

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual Product Product { get; set; }

        public virtual ApplicationUser User { get; set; }
    }
} 