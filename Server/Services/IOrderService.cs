using ShoeShopAPI.Models.DTOs;

namespace ShoeShopAPI.Services
{
    public interface IOrderService
    {
        Task<List<OrderDTO>> GetAllOrdersAsync();
        Task<OrderDTO> GetOrderByIdAsync(int id);
        Task<List<OrderDTO>> GetOrdersByUserIdAsync(string userId);
        Task<OrderDTO> CreateOrderAsync(string userId, OrderCreateDTO orderDto);
        Task<OrderDTO> UpdateOrderStatusAsync(int id, OrderUpdateStatusDTO statusDto);
        Task<bool> DeleteOrderAsync(int id);
    }
} 