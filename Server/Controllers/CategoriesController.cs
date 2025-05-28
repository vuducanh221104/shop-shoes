using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Models;
using ShoeShopAPI.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ProductService _productService;

        public CategoriesController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetAllCategories()
        {
            var categories = await _productService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategoryById(string id)
        {
            var category = await _productService.GetCategoryByIdAsync(id);
            
            if (category == null)
            {
                return NotFound();
            }
            
            return Ok(category);
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<Category>> GetCategoryBySlug(string slug)
        {
            var category = await _productService.GetCategoryBySlugAsync(slug);
            
            if (category == null)
            {
                return NotFound();
            }
            
            return Ok(category);
        }

        [HttpGet("{categoryId}/products")]
        public async Task<ActionResult<List<Product>>> GetProductsByCategory(string categoryId)
        {
            var products = await _productService.GetByCategoryAsync(categoryId);
            return Ok(products);
        }

        [HttpGet("slug/{slug}/products")]
        public async Task<ActionResult<List<Product>>> GetProductsByCategorySlug(string slug)
        {
            var products = await _productService.GetProductsByCategorySlugAsync(slug);
            return Ok(products);
        }
        
        [HttpPost]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult<Category>> CreateCategory(CategoryCreateRequest categoryRequest)
        {
            try
            {
                var category = await _productService.CreateCategoryAsync(categoryRequest);
                return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> UpdateCategory(string id, Category categoryIn)
        {
            var category = await _productService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            
            await _productService.UpdateCategoryAsync(id, categoryIn);
            return NoContent();
        }
        
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> DeleteCategory(string id)
        {
            var category = await _productService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            
            await _productService.RemoveCategoryAsync(id);
            return NoContent();
        }
    }
} 