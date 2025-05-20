using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Models;

namespace ShoeShopAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.ProductId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId);

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Sneaker", Description = "Giày thể thao sneaker" },
                new Category { Id = 2, Name = "Boot", Description = "Giày boot" },
                new Category { Id = 3, Name = "Sandal", Description = "Giày sandal" },
                new Category { Id = 4, Name = "Running", Description = "Giày chạy bộ" }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Name = "Nike Air Max",
                    Description = "Giày Nike Air Max chất lượng cao, thiết kế hiện đại",
                    Price = 1200000,
                    ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                    CategoryId = 1,
                    InStock = true,
                    CreatedAt = DateTime.Now
                },
                new Product
                {
                    Id = 2,
                    Name = "Adidas Ultraboost",
                    Description = "Giày Adidas Ultraboost êm ái, phù hợp chạy bộ",
                    Price = 1800000,
                    ImageUrl = "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
                    CategoryId = 1,
                    InStock = true,
                    CreatedAt = DateTime.Now
                },
                new Product
                {
                    Id = 3,
                    Name = "Timberland Classic",
                    Description = "Giày boot Timberland Classic bền bỉ, chống nước tốt",
                    Price = 2200000,
                    ImageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e",
                    CategoryId = 2,
                    InStock = true,
                    CreatedAt = DateTime.Now
                },
                new Product
                {
                    Id = 4,
                    Name = "Dr. Martens 1460",
                    Description = "Giày Dr. Martens 1460 thiết kế cổ điển, bền bỉ",
                    Price = 1950000,
                    ImageUrl = "https://images.unsplash.com/photo-1610398752800-146f269dfcc8",
                    CategoryId = 2,
                    InStock = true,
                    CreatedAt = DateTime.Now
                }
            );
        }
    }
} 