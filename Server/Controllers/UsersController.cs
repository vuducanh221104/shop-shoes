using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeShopAPI.Models;
using ShoeShopAPI.Services;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterRequest model)
        {
            try
            {
                var user = await _userService.RegisterAsync(model);
                return Ok(new { message = "Registration successful", userId = user.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest model)
        {
            try
            {
                var response = await _userService.LoginAsync(model);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        // [Authorize] // Tạm thời comment lại
        public async Task<ActionResult<User>> GetById(string id)
        {
            // Only allow admins to access other user records
            // var currentUserId = User.FindFirst("id")?.Value;
            // if (id != currentUserId && !User.IsInRole("Admin"))
            // {
            //     return Forbid();
            // }

            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("profile")]
        // [Authorize] // Tạm thời comment lại
        public async Task<ActionResult<User>> GetProfile()
        {
            // Tạm thời hardcode một userId để test
            var userId = "test_user_id";
            
            // var userId = User.FindFirst("id")?.Value;
            // if (string.IsNullOrEmpty(userId))
            // {
            //     return Unauthorized();
            // }

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        // [Authorize] // Tạm thời comment lại
        public async Task<ActionResult> Update(string id, User userIn)
        {
            // Only allow users to update their own record or admins to update any record
            // var currentUserId = User.FindFirst("id")?.Value;
            // if (id != currentUserId && !User.IsInRole("Admin"))
            // {
            //     return Forbid();
            // }

            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Prevent changing critical fields
            userIn.Id = user.Id;
            userIn.Email = user.Email;
            userIn.Username = user.Username;
            userIn.PasswordHash = user.PasswordHash;
            userIn.IsAdmin = user.IsAdmin; // Only allow changing admin status via a specific admin API

            await _userService.UpdateAsync(id, userIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Tạm thời comment lại
        public async Task<ActionResult> Delete(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await _userService.RemoveAsync(id);
            return NoContent();
        }
    }
} 