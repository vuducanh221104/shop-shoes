namespace ShoeShopAPI.Models.DTOs
{
    public class ReviewDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ReviewCreateDTO
    {
        public int ProductId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }

    public class ReviewUpdateDTO
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
} 