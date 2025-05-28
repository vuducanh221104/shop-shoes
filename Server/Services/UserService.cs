using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using ShoeShopAPI.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace ShoeShopAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _configuration;

        public UserService(MongoDBContext context, IConfiguration configuration)
        {
            _users = context.Users;
            _configuration = configuration;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task<User> RegisterAsync(RegisterRequest model)
        {
            // Check if email already exists
            if (await _users.Find(u => u.Email == model.Email).AnyAsync())
            {
                throw new Exception("Email already exists");
            }

            // Check if username already exists
            if (await _users.Find(u => u.Username == model.Username).AnyAsync())
            {
                throw new Exception("Username already exists");
            }

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = HashPassword(model.Password),
                FullName = model.FullName,
                Address = model.Address,
                Phone = model.Phone,
                CreatedAt = DateTime.UtcNow,
                IsAdmin = false
            };

            await _users.InsertOneAsync(user);
            
            return user;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest model)
        {
            var user = await _users.Find(u => u.Email == model.Email).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (!VerifyPassword(model.Password, user.PasswordHash))
            {
                throw new Exception("Invalid password");
            }

            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Token = token,
                IsAdmin = user.IsAdmin
            };
        }

        public async Task<User> UpdateAsync(string id, User userIn)
        {
            await _users.ReplaceOneAsync(u => u.Id == id, userIn);
            return userIn;
        }

        public async Task RemoveAsync(string id)
        {
            await _users.DeleteOneAsync(u => u.Id == id);
        }
        
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
        
        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
        
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"] ?? "super_secret_key_at_least_16_characters_long");
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
} 