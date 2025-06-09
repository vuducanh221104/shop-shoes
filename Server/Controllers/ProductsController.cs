using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ShopContext _context;
        private readonly JsonSerializerOptions _jsonOptions;

        public ProductsController(ShopContext context)
        {
            _context = context;
            _jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve,
                WriteIndented = true
            };
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .ToListAsync();

            // Xử lý dữ liệu cho từng sản phẩm
            foreach (var product in products)
            {
                ProcessProductData(product);
            }

            return products;
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            // Xử lý dữ liệu sản phẩm
            ProcessProductData(product);

            return product;
        }

        // GET: api/Products/category/men
        [HttpGet("category/{categoryName}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory(string categoryName)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == categoryName.ToLower());

            if (category == null)
            {
                return NotFound();
            }

            var products = await _context.Products
                .Where(p => p.CategoryId == category.Id)
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .ToListAsync();

            // Xử lý dữ liệu cho từng sản phẩm
            foreach (var product in products)
            {
                ProcessProductData(product);
            }

            return products;
        }

        // GET: api/Products/slug/nike-air-max
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<Product>> GetProductBySlug(string slug)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (product == null)
            {
                return NotFound();
            }

            // Xử lý dữ liệu sản phẩm
            ProcessProductData(product);

            return product;
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(ProductCreateDto productDto)
        {
            try
            {
                // Xác định categoryId
                int categoryId = 1; // Mặc định là category đầu tiên
                if (productDto.Category != null && productDto.Category.Any())
                {
                    // Thử parse categoryId từ input
                    if (int.TryParse(productDto.Category[0], out int parsedCategoryId))
                    {
                        // Kiểm tra xem category có tồn tại không
                        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == parsedCategoryId);
                        if (categoryExists)
                        {
                            categoryId = parsedCategoryId;
                        }
                    }
                }

                // Generate slug if not provided
                string slug = productDto.Slug;
                if (string.IsNullOrEmpty(slug))
                {
                    slug = GenerateSlug(productDto.Name);
                }

                // Check if slug already exists
                if (await _context.Products.AnyAsync(p => p.Slug == slug))
                {
                    // Append a number to make the slug unique
                    int counter = 1;
                    string baseSlug = slug;
                    while (await _context.Products.AnyAsync(p => p.Slug == slug))
                    {
                        slug = $"{baseSlug}-{counter}";
                        counter++;
                    }
                }

                // Tạo sản phẩm mới
                var product = new Product
                {
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Brand = productDto.Brand,
                    Price = productDto.Price?.Discount ?? productDto.Price?.Original ?? 0,
                    Stock = productDto.Stock,
                    CategoryId = categoryId,
                    Slug = slug
                };

                // Lưu sản phẩm để có ID
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Tạo các variants
                if (productDto.Variants != null && productDto.Variants.Any())
                {
                    foreach (var variantDto in productDto.Variants)
                    {
                        var variant = new Variant
                        {
                            Color = variantDto.Color,
                            SizesJson = JsonSerializer.Serialize(variantDto.Sizes),
                            ImagesString = JsonSerializer.Serialize(variantDto.Images.Where(url => !string.IsNullOrEmpty(url)).ToList()),
                            ProductId = product.Id
                        };

                        _context.Variants.Add(variant);
                    }

                    await _context.SaveChangesAsync();
                }

                // Trả về thông tin cơ bản của sản phẩm để tránh vòng lặp tham chiếu
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new
                {
                    product.Id,
                    product.Name,
                    product.Description,
                    product.Brand,
                    product.Price,
                    product.Stock,
                    product.CategoryId,
                    Tags = productDto.Tags,
                    PriceDetails = productDto.Price,
                    VariantsCount = productDto.Variants?.Count ?? 0
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi tạo sản phẩm: {ex.Message}");
            }
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductCreateDto productDto)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound();
                }

                // Xác định categoryId
                if (productDto.Category != null && productDto.Category.Any())
                {
                    // Thử parse categoryId từ input
                    if (int.TryParse(productDto.Category[0], out int parsedCategoryId))
                    {
                        // Kiểm tra xem category có tồn tại không
                        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == parsedCategoryId);
                        if (categoryExists)
                        {
                            product.CategoryId = parsedCategoryId;
                        }
                    }
                }

                // Update slug if provided
                if (!string.IsNullOrEmpty(productDto.Slug))
                {
                    string slug = productDto.Slug;
                    
                    // Check if slug already exists for another product
                    if (await _context.Products.AnyAsync(p => p.Slug == slug && p.Id != id))
                    {
                        // Append a number to make the slug unique
                        int counter = 1;
                        string baseSlug = slug;
                        while (await _context.Products.AnyAsync(p => p.Slug == slug && p.Id != id))
                        {
                            slug = $"{baseSlug}-{counter}";
                            counter++;
                        }
                    }
                    
                    product.Slug = slug;
                }
                else if (product.Name != productDto.Name)
                {
                    // If name changed but no slug provided, generate new slug
                    string slug = GenerateSlug(productDto.Name);
                    
                    // Check if slug already exists for another product
                    if (await _context.Products.AnyAsync(p => p.Slug == slug && p.Id != id))
                    {
                        // Append a number to make the slug unique
                        int counter = 1;
                        string baseSlug = slug;
                        while (await _context.Products.AnyAsync(p => p.Slug == slug && p.Id != id))
                        {
                            slug = $"{baseSlug}-{counter}";
                            counter++;
                        }
                    }
                    
                    product.Slug = slug;
                }

                // Cập nhật thông tin sản phẩm
                product.Name = productDto.Name;
                product.Description = productDto.Description;
                product.Brand = productDto.Brand;
                product.Price = productDto.Price?.Discount ?? productDto.Price?.Original ?? product.Price;
                product.Stock = productDto.Stock;
                
                // Xóa variants hiện tại
                var existingVariants = await _context.Variants.Where(v => v.ProductId == id).ToListAsync();
                _context.Variants.RemoveRange(existingVariants);

                // Tạo variants mới
                if (productDto.Variants != null && productDto.Variants.Any())
                {
                    foreach (var variantDto in productDto.Variants)
                    {
                        var variant = new Variant
                        {
                            Color = variantDto.Color,
                            SizesJson = JsonSerializer.Serialize(variantDto.Sizes),
                            ImagesString = JsonSerializer.Serialize(variantDto.Images.Where(url => !string.IsNullOrEmpty(url)).ToList()),
                            ProductId = product.Id
                        };

                        _context.Variants.Add(variant);
                    }
                }

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi cập nhật sản phẩm: {ex.Message}");
            }
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Products/1/variants
        [HttpPost("{productId}/variants")]
        public async Task<ActionResult<object>> AddVariant(int productId, VariantCreateDto variantDto)
        {
            try
            {
                var product = await _context.Products.FindAsync(productId);
                if (product == null)
                {
                    return NotFound();
                }

                var variant = new Variant
                {
                    Color = variantDto.Color,
                    SizesJson = JsonSerializer.Serialize(variantDto.Sizes),
                    ImagesString = string.Join(",", variantDto.Images.Where(url => !string.IsNullOrEmpty(url))),
                    ProductId = productId
                };
                
                _context.Variants.Add(variant);
                await _context.SaveChangesAsync();

                // Trả về thông tin cơ bản để tránh vòng lặp tham chiếu
                return CreatedAtAction("GetProduct", new { id = productId }, new
                {
                    variant.Id,
                    variant.Color,
                    Sizes = variantDto.Sizes,
                    Images = variantDto.Images,
                    variant.ProductId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi thêm biến thể: {ex.Message}");
            }
        }

        // PATCH: api/Products/variants/1/size/{size}/stock
        [HttpPatch("variants/{variantId}/size/{size}/stock")]
        public async Task<IActionResult> UpdateSizeStock(int variantId, string size, [FromBody] StockUpdateModel stockUpdate)
        {
            var variant = await _context.Variants.FindAsync(variantId);
            if (variant == null)
            {
                return NotFound();
            }

            // Deserialize sizes
            List<SizeInfo> sizes = new List<SizeInfo>();
            if (!string.IsNullOrEmpty(variant.SizesJson))
            {
                sizes = JsonSerializer.Deserialize<List<SizeInfo>>(variant.SizesJson) ?? new List<SizeInfo>();
            }

            // Find and update the specific size
            var sizeInfo = sizes.FirstOrDefault(s => s.Size == size);
            if (sizeInfo != null)
            {
                sizeInfo.Stock = stockUpdate.Stock;
            }
            else
            {
                // Add new size if not found
                sizes.Add(new SizeInfo { Size = size, Stock = stockUpdate.Stock });
            }

            // Save back to database
            variant.SizesJson = JsonSerializer.Serialize(sizes);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Products/variants/1
        [HttpDelete("variants/{variantId}")]
        public async Task<IActionResult> DeleteVariant(int variantId)
        {
            var variant = await _context.Variants.FindAsync(variantId);
            if (variant == null)
            {
                return NotFound();
            }

            _context.Variants.Remove(variant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }

        private void ProcessProductData(Product product)
        {
            // Khởi tạo giá chi tiết nếu chưa có
            product.PriceDetails = new PriceDetails
            {
                Original = product.Price * 1.1m, // Giá gốc cao hơn giá hiện tại 10%
                Discount = product.Price,
                QuantityDiscount = 5 // Mặc định giảm giá khi mua từ 5 sản phẩm
            };

            // Xử lý variants
            if (product.Variants != null)
            {
                foreach (var variant in product.Variants)
                {
                    // Chuyển đổi chuỗi JSON sizes thành danh sách
                    if (!string.IsNullOrEmpty(variant.SizesJson))
                    {
                        variant.Sizes = JsonSerializer.Deserialize<List<SizeInfo>>(variant.SizesJson);
                        
                        // Tính tổng stock từ tất cả các sizes
                        variant.TotalStock = variant.Sizes?.Sum(s => s.Stock) ?? 0;
                    }

                    // Chuyển đổi chuỗi images thành danh sách
                    if (!string.IsNullOrEmpty(variant.ImagesString))
                    {
                        // Deserialize trực tiếp từ ImagesString nếu nó đã là JSON
                        try
                        {
                            variant.Images = JsonSerializer.Deserialize<List<string>>(variant.ImagesString);
                        }
                        catch
                        {
                            // Nếu không phải JSON, thì đây là một URL đơn
                            variant.Images = new List<string> { variant.ImagesString };
                        }
                    }
                }
            }
        }

        // Helper method to generate slug from product name
        private string GenerateSlug(string name)
        {
            // Convert to lowercase
            string slug = name.ToLower();
            
            // Replace spaces with hyphens
            slug = slug.Replace(" ", "-");
            
            // Remove special characters
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
            
            // Remove duplicate hyphens
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-");
            
            // Trim hyphens from start and end
            slug = slug.Trim('-');
            
            return slug;
        }
    }

    public class StockUpdateModel
    {
        public int Stock { get; set; }
    }

    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Brand { get; set; }
        public List<string>? Category { get; set; }
        public List<string>? Tags { get; set; }
        public int Stock { get; set; }
        public PriceDetails? Price { get; set; }
        public List<VariantCreateDto>? Variants { get; set; }
        public string? Slug { get; set; }
    }

    public class VariantCreateDto
    {
        public string Color { get; set; } = null!;
        public List<SizeInfo> Sizes { get; set; } = new List<SizeInfo>();
        public List<string> Images { get; set; } = new List<string>();
    }
} 