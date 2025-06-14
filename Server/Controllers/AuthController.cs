using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Utils;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ShopContext _context;
        private readonly JwtUtils _jwtUtils;

        public AuthController(ShopContext context, JwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }

        public class LoginRequest
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        public class RegisterRequest
        {
            public string Username { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
            public string? FullName { get; set; }
        }

        public class AuthResponse
        {
            public int UserId { get; set; }
            public string Username { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string? FullName { get; set; }
            public string AccessToken { get; set; } = null!;
            public string RefreshToken { get; set; } = null!;
        }

        // POST: api/Auth/Register
        [HttpPost("Register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email already in use");
            }

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("Username already in use");
            }

            // In a real application, you would hash the password
            // string hashedPassword = HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = request.Password, // Should be hashed in production
                FullName = request.FullName,
                Type = "WEBSITE",
                Role = 0, // Regular user
                Status = 1, // Active
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate tokens
            string accessToken = _jwtUtils.GenerateAccessToken(user);
            string refreshToken = _jwtUtils.GenerateRefreshToken(user);
            
            // Save refresh token
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.Now.AddDays(7),
                CreatedAt = DateTime.Now,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            };
            
            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                UserId = user.Id,
                Username = user.Username ?? "",
                Email = user.Email ?? "",
                FullName = user.FullName,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        public async Task<ActionResult<object>> Login(LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.OrderItems)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // In a real application, you would verify the password hash
            // bool isPasswordValid = VerifyPassword(request.Password, user.Password);
            bool isPasswordValid = user.Password == request.Password; // Simplified for demo

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid credentials");
            }

            // Generate tokens
            string accessToken = _jwtUtils.GenerateAccessToken(user);
            string refreshToken = _jwtUtils.GenerateRefreshToken(user);
            
            // Save refresh token
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.Now.AddDays(7),
                CreatedAt = DateTime.Now,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            };
            
            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new
            {
                User = user,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        // POST: api/Auth/Admin/Login
        [HttpPost("Admin/Login")]
        public async Task<ActionResult<object>> AdminLogin(LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.OrderItems)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            // Check if user is admin (role >= 2)
            if (user.Role < 2)
            {
                return Unauthorized("Access denied. Admin privileges required.");
            }

            // In a real application, you would verify the password hash
            // bool isPasswordValid = VerifyPassword(request.Password, user.Password);
            bool isPasswordValid = user.Password == request.Password; // Simplified for demo

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid credentials");
            }

            // Generate tokens
            string accessToken = _jwtUtils.GenerateAccessToken(user);
            string refreshToken = _jwtUtils.GenerateRefreshToken(user);
            
            // Save refresh token
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.Now.AddDays(7),
                CreatedAt = DateTime.Now,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            };
            
            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new
            {
                User = user,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        // POST: api/Auth/RefreshToken
        [HttpPost("RefreshToken")]
        public async Task<ActionResult<AuthResponse>> RefreshToken(string token)
        {
            // Validate the refresh token
            var userId = _jwtUtils.ValidateRefreshToken(token);
            if (userId == null)
            {
                return Unauthorized("Invalid or expired refresh token");
            }

            // Find the user
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Unauthorized("User not found");
            }

            // Check if the token is in the database and not revoked
            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == token && !r.IsRevoked && r.ExpiresAt > DateTime.Now);

            if (storedToken == null)
            {
                return Unauthorized("Invalid or expired refresh token");
            }

            // Generate new tokens
            string accessToken = _jwtUtils.GenerateAccessToken(user);
            string newRefreshToken = _jwtUtils.GenerateRefreshToken(user);
            
            // Revoke old token
            storedToken.IsRevoked = true;
            
            // Save new refresh token
            var refreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.Now.AddDays(7),
                CreatedAt = DateTime.Now,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            };
            
            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                UserId = user.Id,
                Username = user.Username ?? "",
                Email = user.Email ?? "",
                FullName = user.FullName,
                AccessToken = accessToken,
                RefreshToken = newRefreshToken
            };
        }

        // POST: api/Auth/Logout
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout(string token)
        {
            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == token);

            if (storedToken != null)
            {
                storedToken.IsRevoked = true;
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }
    }
} 