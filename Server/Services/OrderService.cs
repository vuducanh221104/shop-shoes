using MongoDB.Driver;
using ShoeShopAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoeShopAPI.Services
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _orders;
        private readonly ProductService _productService;

        public OrderService(MongoDBContext context, ProductService productService)
        {
            _orders = context.Orders;
            _productService = productService;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _orders.Find(_ => true).ToListAsync();
        }

        public async Task<List<Order>> GetByUserIdAsync(string userId)
        {
            return await _orders.Find(o => o.UserId == userId).ToListAsync();
        }

        public async Task<Order> GetByIdAsync(string id)
        {
            return await _orders.Find(o => o.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Order> CreateAsync(string userId, CreateOrderRequest orderRequest)
        {
            // Validate order items
            if (orderRequest.Items == null || !orderRequest.Items.Any())
            {
                throw new Exception("Order must contain at least one item");
            }

            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var item in orderRequest.Items)
            {
                var product = await _productService.GetByIdAsync(item.ProductId);
                if (product == null)
                {
                    throw new Exception($"Product with ID {item.ProductId} not found");
                }

                if (product.Stock < item.Quantity)
                {
                    throw new Exception($"Product {product.Name} is not available in the requested quantity");
                }

                var price = product.Price.Discount > 0 ? product.Price.Discount : product.Price.Original;
                var subtotal = price * item.Quantity;
                
                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id!,
                    ProductName = product.Name,
                    Price = price,
                    Quantity = item.Quantity,
                    Subtotal = subtotal
                });

                totalAmount += subtotal;

                // Update product stock
                product.Stock -= item.Quantity;
                await _productService.UpdateAsync(product.Id!, product);
            }

            var order = new Order
            {
                UserId = userId,
                Items = orderItems,
                TotalAmount = totalAmount,
                ShippingAddress = orderRequest.ShippingAddress,
                ContactPhone = orderRequest.ContactPhone,
                PaymentMethod = orderRequest.PaymentMethod,
                Status = "Pending",
                PaymentStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _orders.InsertOneAsync(order);
            return order;
        }

        public async Task<Order> UpdateStatusAsync(string id, string status)
        {
            var order = await GetByIdAsync(id);
            if (order == null)
            {
                throw new Exception($"Order with ID {id} not found");
            }

            // Validate status
            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(status))
            {
                throw new Exception($"Invalid order status: {status}");
            }

            // If cancelling an order, restore product stock
            if (status == "Cancelled" && order.Status != "Cancelled")
            {
                foreach (var item in order.Items)
                {
                    var product = await _productService.GetByIdAsync(item.ProductId);
                    if (product != null)
                    {
                        product.Stock += item.Quantity;
                        await _productService.UpdateAsync(product.Id!, product);
                    }
                }
            }

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            await _orders.ReplaceOneAsync(o => o.Id == id, order);
            return order;
        }

        public async Task<Order> UpdatePaymentStatusAsync(string id, string paymentStatus)
        {
            var order = await GetByIdAsync(id);
            if (order == null)
            {
                throw new Exception($"Order with ID {id} not found");
            }

            // Validate payment status
            var validStatuses = new[] { "Pending", "Paid", "Failed" };
            if (!validStatuses.Contains(paymentStatus))
            {
                throw new Exception($"Invalid payment status: {paymentStatus}");
            }

            order.PaymentStatus = paymentStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _orders.ReplaceOneAsync(o => o.Id == id, order);
            return order;
        }

        public async Task RemoveAsync(string id)
        {
            await _orders.DeleteOneAsync(o => o.Id == id);
        }
    }
} 