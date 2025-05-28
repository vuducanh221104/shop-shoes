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
    // [Authorize] // Tạm thời comment lại
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult<List<Order>>> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("my-orders")]
        public async Task<ActionResult<List<Order>>> GetMyOrders()
        {
            // Tạm thời hardcode một userId để test
            var userId = "test_user_id";
            
            // var userId = User.FindFirst("id")?.Value;
            // if (string.IsNullOrEmpty(userId))
            // {
            //     return Unauthorized();
            // }

            var orders = await _orderService.GetByUserIdAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetById(string id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            // Only allow users to see their own orders or admins to see any order
            // var userId = User.FindFirst("id")?.Value;
            // if (order.UserId != userId && !User.IsInRole("Admin"))
            // {
            //     return Forbid();
            // }

            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> Create(CreateOrderRequest orderRequest)
        {
            try
            {
                // Tạm thời hardcode một userId để test
                var userId = "test_user_id";
                
                // var userId = User.FindFirst("id")?.Value;
                // if (string.IsNullOrEmpty(userId))
                // {
                //     return Unauthorized();
                // }

                var order = await _orderService.CreateAsync(userId, orderRequest);
                return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> UpdateStatus(string id, UpdateOrderStatusRequest request)
        {
            try
            {
                var order = await _orderService.UpdateStatusAsync(id, request.Status);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/payment")]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> UpdatePaymentStatus(string id, [FromBody] string paymentStatus)
        {
            try
            {
                var order = await _orderService.UpdatePaymentStatusAsync(id, paymentStatus);
                return Ok(order);
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
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            await _orderService.RemoveAsync(id);
            return NoContent();
        }
    }
} 