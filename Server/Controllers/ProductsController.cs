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
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<Product>>> GetByCategory(string category)
        {
            var products = await _productService.GetByCategoryAsync(category);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(string id)
        {
            var product = await _productService.GetByIdAsync(id);
            
            if (product == null)
            {
                return NotFound();
            }
            
            return Ok(product);
        }

        [HttpPost]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult<Product>> Create(ProductCreateRequest productRequest)
        {
            try
            {
                var product = await _productService.CreateAsync(productRequest);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> Update(string id, ProductUpdateRequest updateRequest)
        {
            try
            {
                var product = await _productService.UpdateAsync(id, updateRequest);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> Delete(string id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            await _productService.RemoveAsync(id);
            return NoContent();
        }
    }
} 