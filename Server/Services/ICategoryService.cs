using ShoeShopAPI.Models.DTOs;

namespace ShoeShopAPI.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDTO>> GetAllCategoriesAsync();
        Task<CategoryDTO> GetCategoryByIdAsync(int id);
        Task<CategoryDTO> CreateCategoryAsync(CategoryCreateDTO categoryDto);
        Task<CategoryDTO> UpdateCategoryAsync(int id, CategoryUpdateDTO categoryDto);
        Task<bool> DeleteCategoryAsync(int id);
    }
} 