using ShoeShopAPI.Models;
using ShoeShopAPI.Models.DTOs;

namespace ShoeShopAPI.Services
{
    public interface IProductService
    {
        Task<List<ProductDTO>> GetAllProductsAsync();
        Task<ProductDTO> GetProductByIdAsync(int id);
        Task<List<ProductDTO>> GetProductsByCategoryAsync(int categoryId);
        Task<ProductDTO> CreateProductAsync(ProductCreateDTO productDto);
        Task<ProductDTO> UpdateProductAsync(int id, ProductUpdateDTO productDto);
        Task<bool> DeleteProductAsync(int id);
        Task<List<ProductDTO>> SearchProductsAsync(string searchTerm);
    }
} 