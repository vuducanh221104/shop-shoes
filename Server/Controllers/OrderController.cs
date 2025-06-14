using System;
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
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly ShopContext _context;

        public OrderController(ShopContext context)
        {
            _context = context;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                .ThenInclude(p => p!.Variants)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var response = orders.Select(order => new OrderResponseDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                FullName = order.FullName,
                Email = order.Email,
                Phone = order.Phone,
                Address = order.Address,
                City = order.City,
                Note = order.Note,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(item => new OrderItemDTO
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product!.Name,
                    ProductImage = GetFirstImageForVariant(item.Product.Variants, item.Color),
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Size = item.Size,
                    Color = item.Color
                }).ToList()
            }).ToList();

            return Ok(response);
        }

        // GET: api/orders/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                .ThenInclude(p => p!.Variants)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var response = orders.Select(order => new OrderResponseDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                FullName = order.FullName,
                Email = order.Email,
                Phone = order.Phone,
                Address = order.Address,
                City = order.City,
                Note = order.Note,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(item => new OrderItemDTO
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product!.Name,
                    ProductImage = GetFirstImageForVariant(item.Product.Variants, item.Color),
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Size = item.Size,
                    Color = item.Color
                }).ToList()
            }).ToList();

            return Ok(response);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponseDTO>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                .ThenInclude(p => p!.Variants)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var response = new OrderResponseDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                FullName = order.FullName,
                Email = order.Email,
                Phone = order.Phone,
                Address = order.Address,
                City = order.City,
                Note = order.Note,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(item => new OrderItemDTO
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product!.Name,
                    ProductImage = GetFirstImageForVariant(item.Product.Variants, item.Color),
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Size = item.Size,
                    Color = item.Color
                }).ToList()
            };

            return response;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<OrderResponseDTO>> CreateOrder(CreateOrderDTO createOrderDTO)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Get cart items
                var cartItems = await _context.CartItems
                    .Include(c => c.Product)
                    .ThenInclude(p => p!.Variants)
                    .Where(c => c.UserId == createOrderDTO.UserId)
                    .ToListAsync();

                if (!cartItems.Any())
                {
                    return BadRequest("Cart is empty");
                }

                // Calculate total amount
                decimal totalAmount = cartItems.Sum(item => {
                    // Use discounted price if available and different from regular price
                    decimal price = item.Product!.PriceDiscount != 0 && item.Product.PriceDiscount != item.Product.Price
                        ? item.Product.PriceDiscount
                        : item.Product.Price;
                    return price * item.Quantity;
                });

                // Create order
                var order = new Order
                {
                    UserId = createOrderDTO.UserId,
                    FullName = createOrderDTO.FullName,
                    Email = createOrderDTO.Email,
                    Phone = createOrderDTO.Phone,
                    Address = createOrderDTO.Address,
                    City = createOrderDTO.City,
                    Note = createOrderDTO.Note,
                    PaymentMethod = createOrderDTO.PaymentMethod,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Create order items
                foreach (var cartItem in cartItems)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                        Price = cartItem.Product!.PriceDiscount != 0 && cartItem.Product.PriceDiscount != cartItem.Product.Price
                            ? cartItem.Product.PriceDiscount
                            : cartItem.Product.Price,
                        Size = cartItem.SizeOrder,
                        Color = cartItem.ColorOrder,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.OrderItems.Add(orderItem);
                }

                // Clear cart
                _context.CartItems.RemoveRange(cartItems);
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Return response
                var response = new OrderResponseDTO
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    FullName = order.FullName,
                    Email = order.Email,
                    Phone = order.Phone,
                    Address = order.Address,
                    City = order.City,
                    Note = order.Note,
                    PaymentMethod = order.PaymentMethod,
                    Status = order.Status,
                    TotalAmount = order.TotalAmount,
                    CreatedAt = order.CreatedAt,
                    Items = cartItems.Select(item => new OrderItemDTO
                    {
                        ProductId = item.ProductId,
                        ProductName = item.Product!.Name,
                        ProductImage = GetFirstImageForVariant(item.Product.Variants, item.ColorOrder),
                        Quantity = item.Quantity,
                        Price = item.Product.PriceDiscount != 0 && item.Product.PriceDiscount != item.Product.Price
                            ? item.Product.PriceDiscount
                            : item.Product.Price,
                        Size = item.SizeOrder,
                        Color = item.ColorOrder
                    }).ToList()
                };

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PATCH: api/orders/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDTO updateStatusDTO)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            order.Status = updateStatusDTO.Status;
            order.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PATCH: api/orders/5/cancel
        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound("Order not found");
            }

            // Only allow cancellation of pending orders
            if (order.Status != "Pending")
            {
                return BadRequest($"Cannot cancel order in {order.Status} status. Only pending orders can be cancelled.");
            }

            try
            {
                order.Status = "Cancelled";
                order.UpdatedAt = DateTime.UtcNow;

                // Optional: Return items to stock
                foreach (var item in order.OrderItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.Stock += item.Quantity;
                        _context.Products.Update(product);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Order cancelled successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, UpdateOrderDTO updateOrderDTO)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound("Order not found");
            }

            // Update order fields
            order.UserId = updateOrderDTO.UserId;
            order.FullName = updateOrderDTO.FullName;
            order.Email = updateOrderDTO.Email;
            order.Phone = updateOrderDTO.Phone;
            order.Address = updateOrderDTO.Address;
            order.City = updateOrderDTO.City;
            order.Note = updateOrderDTO.Note;
            order.PaymentMethod = updateOrderDTO.PaymentMethod;
            order.Status = updateOrderDTO.Status;
            order.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound("Order not found");
            }

            try
            {
                // Remove all order items first
                _context.OrderItems.RemoveRange(order.OrderItems);
                
                // Then remove the order
                _context.Orders.Remove(order);
                
                await _context.SaveChangesAsync();
                return Ok(new { message = "Order deleted successfully" });
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