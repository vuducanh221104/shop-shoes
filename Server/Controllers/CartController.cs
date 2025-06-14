using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;
using System.Text.Json;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ShopContext _context;

        public CartController(ShopContext context)
        {
            _context = context;
        }

        // GET: api/Cart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDTO>>> GetCartItems([FromQuery] int userId)
        {            
            try
            {
                var cartItems = await _context.CartItems
                    .Include(c => c.Product)
                    .ThenInclude(p => p.Variants)
                    .Where(c => c.UserId == userId)
                    .Select(c => new CartItemDTO
                    {
                        Id = c.Id,
                        ProductId = c.ProductId,
                        ProductName = c.Product!.Name,
                        ProductImage = GetFirstImageForVariant(c.Product.Variants, c.ColorOrder),
                        Quantity = c.Quantity,
                        Price = c.Product.Price,
                        PriceDiscount = c.Product.PriceDiscount,
                        Size = c.SizeOrder,
                        Color = c.ColorOrder,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    })
                    .ToListAsync();

                return cartItems;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Cart
        [HttpPost]
        public async Task<ActionResult<CartItemDTO>> AddToCart([FromQuery] int userId, AddToCartDTO addToCartDTO)
        {
            try
            {
                // Check if user exists
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Check if product exists
                var product = await _context.Products
                    .Include(p => p.Variants)
                    .FirstOrDefaultAsync(p => p.Id == addToCartDTO.ProductId);
                    
                if (product == null)
                {
                    return NotFound("Product not found");
                }

                // Check if variant exists with specified color and size
                var variant = product.Variants != null 
                    ? product.Variants.FirstOrDefault(v => v.Color == addToCartDTO.Color)
                    : null;
                    
                if (variant == null)
                {
                    return BadRequest("Invalid color selection");
                }

                // Parse sizes from variant
                List<SizeInfo> sizes;
                try
                {
                    sizes = JsonSerializer.Deserialize<List<SizeInfo>>(variant.SizesJson ?? "[]") ?? new List<SizeInfo>();
                }
                catch (Exception ex)
                {
                    return BadRequest($"Invalid size data in variant: {ex.Message}");
                }

                var sizeInfo = sizes.FirstOrDefault(s => s.Size == addToCartDTO.Size);
                if (sizeInfo == null)
                {
                    return BadRequest($"Size {addToCartDTO.Size} is not available for this variant");
                }

                if (sizeInfo.Stock <= 0)
                {
                    return BadRequest($"Size {addToCartDTO.Size} is out of stock");
                }

                // Check if item already exists in cart
                var existingItem = await _context.CartItems
                    .FirstOrDefaultAsync(c => 
                        c.ProductId == addToCartDTO.ProductId &&
                        c.ColorOrder == addToCartDTO.Color &&
                        c.SizeOrder == addToCartDTO.Size &&
                        c.UserId == userId);

                if (existingItem != null)
                {
                    // Check if adding more would exceed stock
                    if (existingItem.Quantity + addToCartDTO.Quantity > sizeInfo.Stock)
                    {
                        return BadRequest($"Cannot add {addToCartDTO.Quantity} more items. Only {sizeInfo.Stock - existingItem.Quantity} available.");
                    }

                    // Update quantity if item exists
                    existingItem.Quantity += addToCartDTO.Quantity;
                    existingItem.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    return Ok(new CartItemDTO
                    {
                        Id = existingItem.Id,
                        ProductId = existingItem.ProductId,
                        ProductName = product.Name,
                        ProductImage = GetFirstImageForVariant(product.Variants, existingItem.ColorOrder),
                        Quantity = existingItem.Quantity,
                        Price = product.Price,
                        PriceDiscount = product.PriceDiscount,
                        Size = existingItem.SizeOrder,
                        Color = existingItem.ColorOrder,
                        CreatedAt = existingItem.CreatedAt,
                        UpdatedAt = existingItem.UpdatedAt
                    });
                }

                // Check if quantity exceeds stock
                if (addToCartDTO.Quantity > sizeInfo.Stock)
                {
                    return BadRequest($"Cannot add {addToCartDTO.Quantity} items. Only {sizeInfo.Stock} available.");
                }

                // Create new cart item
                var now = DateTime.UtcNow;
                var cartItem = new CartItem
                {
                    ProductId = addToCartDTO.ProductId,
                    UserId = userId,
                    Quantity = addToCartDTO.Quantity,
                    SizeOrder = addToCartDTO.Size,
                    ColorOrder = addToCartDTO.Color,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                _context.CartItems.Add(cartItem);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetCartItems),
                    new CartItemDTO
                    {
                        Id = cartItem.Id,
                        ProductId = cartItem.ProductId,
                        ProductName = product.Name,
                        ProductImage = GetFirstImageForVariant(product.Variants, cartItem.ColorOrder),
                        Quantity = cartItem.Quantity,
                        Price = product.Price,
                        PriceDiscount = product.PriceDiscount,
                        Size = cartItem.SizeOrder,
                        Color = cartItem.ColorOrder,
                        CreatedAt = cartItem.CreatedAt,
                        UpdatedAt = cartItem.UpdatedAt
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Cart/5/quantity
        [HttpPut("{id}/quantity")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromQuery] int userId, UpdateCartQuantityDTO updateDTO)
        {
            try
            {
                var cartItem = await _context.CartItems
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

                if (cartItem == null)
                {
                    return NotFound();
                }

                if (updateDTO.Quantity < 1)
                {
                    return BadRequest("Quantity must be at least 1");
                }

                cartItem.Quantity = updateDTO.Quantity;
                cartItem.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Cart/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCartItem(int id, [FromQuery] int userId)
        {
            try
            {
                var cartItem = await _context.CartItems
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

                if (cartItem == null)
                {
                    return NotFound();
                }

                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Cart
        [HttpDelete]
        public async Task<IActionResult> ClearCart([FromQuery] int userId)
        {
            try
            {
                var cartItems = await _context.CartItems
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private static string? GetFirstImageForVariant(ICollection<Variant>? variants, string color)
        {
            try
            {
                if (variants == null) return null;
                
                var variant = variants.FirstOrDefault(v => v.Color == color);
                if (variant?.ImagesString == null) return null;

                // Parse the JSON string to get the array of image URLs
                var images = JsonSerializer.Deserialize<List<string>>(variant.ImagesString);
                return images?.FirstOrDefault();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing variant images: {ex.Message}");
                return null;
            }
        }
    }
} 