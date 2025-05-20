using ShoeShopAPI.Models.DTOs;

namespace ShoeShopAPI.Services
{
    public interface IUserService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto);
        Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto);
        Task<UserDTO> GetUserByIdAsync(string id);
        Task<UserDTO> UpdateProfileAsync(string id, UpdateProfileDTO profileDto);
        Task<bool> ChangePasswordAsync(string id, ChangePasswordDTO passwordDto);
        Task<List<UserDTO>> GetAllUsersAsync();
        Task<bool> AssignRoleAsync(string userId, string role);
        Task<bool> RemoveRoleAsync(string userId, string role);
    }
} 