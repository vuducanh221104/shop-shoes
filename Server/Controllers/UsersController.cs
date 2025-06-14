using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ShopContext _context;

        public UsersController(ShopContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                            .ThenInclude(p => p.Variants)
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    FullName = u.FullName,
                    Email = u.Email,
                    Password = u.Password,
                    Type = u.Type,
                    Role = u.Role,
                    Gender = u.Gender,
                    PhoneNumber = u.PhoneNumber,
                    Avatar = u.Avatar,
                    DateOfBirth = u.DateOfBirth,
                    Status = u.Status,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    Addresses = u.Addresses,
                    Orders = u.Orders.Select(o => new Order
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        FullName = o.FullName,
                        Email = o.Email,
                        Phone = o.Phone,
                        Address = o.Address,
                        City = o.City,
                        Note = o.Note,
                        PaymentMethod = o.PaymentMethod,
                        Status = o.Status,
                        TotalAmount = o.TotalAmount,
                        CreatedAt = o.CreatedAt,
                        UpdatedAt = o.UpdatedAt,
                        OrderItems = o.OrderItems.Select(oi => new OrderItem
                        {
                            Id = oi.Id,
                            OrderId = oi.OrderId,
                            ProductId = oi.ProductId,
                            Quantity = oi.Quantity,
                            Price = oi.Price,
                            Color = oi.Color,
                            Size = oi.Size,
                            Product = new Product
                            {
                                Id = oi.Product.Id,
                                Name = oi.Product.Name,
                                Variants = oi.Product.Variants.Select(v => new Variant
                                {
                                    Id = v.Id,
                                    Color = v.Color,
                                    Images = v.Images,
                                    ImagesString = v.ImagesString
                                }).ToList()
                            }
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                            .ThenInclude(p => p.Variants)
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    FullName = u.FullName,
                    Email = u.Email,
                    Password = u.Password,
                    Type = u.Type,
                    Role = u.Role,
                    Gender = u.Gender,
                    PhoneNumber = u.PhoneNumber,
                    Avatar = u.Avatar,
                    DateOfBirth = u.DateOfBirth,
                    Status = u.Status,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    Addresses = u.Addresses,
                    Orders = u.Orders.Select(o => new Order
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        FullName = o.FullName,
                        Email = o.Email,
                        Phone = o.Phone,
                        Address = o.Address,
                        City = o.City,
                        Note = o.Note,
                        PaymentMethod = o.PaymentMethod,
                        Status = o.Status,
                        TotalAmount = o.TotalAmount,
                        CreatedAt = o.CreatedAt,
                        UpdatedAt = o.UpdatedAt,
                        OrderItems = o.OrderItems.Select(oi => new OrderItem
                        {
                            Id = oi.Id,
                            OrderId = oi.OrderId,
                            ProductId = oi.ProductId,
                            Quantity = oi.Quantity,
                            Price = oi.Price,
                            Color = oi.Color,
                            Size = oi.Size,
                            Product = new Product
                            {
                                Id = oi.Product.Id,
                                Name = oi.Product.Name,
                                Variants = oi.Product.Variants.Select(v => new Variant
                                {
                                    Id = v.Id,
                                    Color = v.Color,
                                    Images = v.Images,
                                    ImagesString = v.ImagesString
                                }).ToList()
                            }
                        }).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            // In a real application, you would hash the password here
            // user.Password = HashPassword(user.Password);
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO updateDTO)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Update only the fields that are provided
            if (!string.IsNullOrEmpty(updateDTO.Email))
                user.Email = updateDTO.Email;
            if (!string.IsNullOrEmpty(updateDTO.FullName))
                user.FullName = updateDTO.FullName;
            if (!string.IsNullOrEmpty(updateDTO.PhoneNumber))
                user.PhoneNumber = updateDTO.PhoneNumber;
            if (!string.IsNullOrEmpty(updateDTO.Gender))
                user.Gender = updateDTO.Gender;
            if (updateDTO.DateOfBirth.HasValue)
                user.DateOfBirth = updateDTO.DateOfBirth;

            user.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Users/5/Addresses
        [HttpPost("{userId}/Addresses")]
        public async Task<ActionResult<Address>> AddAddress(int userId, Address address)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            address.UserId = userId;
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = userId }, address);
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
} 