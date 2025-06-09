using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.Text.RegularExpressions;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ShopContext _context;

        public CategoriesController(ShopContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // GET: api/Categories/name/men
        [HttpGet("name/{name}")]
        public async Task<ActionResult<Category>> GetCategoryByName(string name)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower());

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // GET: api/Categories/slug/men
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<Category>> GetCategoryBySlug(string slug)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Slug.ToLower() == slug.ToLower());

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // GET: api/Categories/slug/men/products
        [HttpGet("slug/{slug}/products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategorySlug(string slug)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Slug.ToLower() == slug.ToLower());

            if (category == null)
            {
                return NotFound();
            }

            var products = await _context.Products
                .Where(p => p.CategoryId == category.Id)
                .Include(p => p.Variants)
                .ToListAsync();

            return products;
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(CategoryCreateDto categoryDto)
        {
            // Tự động tạo slug nếu không được cung cấp
            string slug = categoryDto.Slug;
            if (string.IsNullOrEmpty(slug))
            {
                slug = GenerateSlug(categoryDto.Name);
            }

            // Kiểm tra xem slug đã tồn tại chưa
            bool slugExists = await _context.Categories.AnyAsync(c => c.Slug == slug);
            if (slugExists)
            {
                return BadRequest("Slug đã tồn tại. Vui lòng chọn slug khác.");
            }

            var category = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,
                Slug = slug
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryCreateDto categoryDto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Tự động tạo slug nếu không được cung cấp
            string slug = categoryDto.Slug;
            if (string.IsNullOrEmpty(slug))
            {
                slug = GenerateSlug(categoryDto.Name);
            }

            // Kiểm tra xem slug đã tồn tại chưa (trừ category hiện tại)
            bool slugExists = await _context.Categories.AnyAsync(c => c.Slug == slug && c.Id != id);
            if (slugExists)
            {
                return BadRequest("Slug đã tồn tại. Vui lòng chọn slug khác.");
            }

            category.Name = categoryDto.Name;
            category.Description = categoryDto.Description;
            category.Slug = slug;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Check if category has products
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
            {
                return BadRequest("Cannot delete category that has products. Remove or reassign products first.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Hàm tạo slug từ tên
        private string GenerateSlug(string name)
        {
            // Chuyển thành chữ thường
            string slug = name.ToLower();
            
            // Thay thế dấu cách bằng dấu gạch ngang
            slug = slug.Replace(" ", "-");
            
            // Loại bỏ các ký tự đặc biệt
            slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");
            
            // Loại bỏ nhiều dấu gạch ngang liên tiếp
            slug = Regex.Replace(slug, @"-+", "-");
            
            // Loại bỏ dấu gạch ngang ở đầu và cuối
            slug = slug.Trim('-');
            
            return slug;
        }
    }

    // DTO for category creation and update
    public class CategoryCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Slug { get; set; }
    }
} 