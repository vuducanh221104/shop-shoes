using MongoDB.Driver;
using ShoeShopAPI.Models;
using Microsoft.Extensions.Configuration;

namespace ShoeShopAPI.Services
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetSection("DatabaseSettings:ConnectionString").Value ?? "mongodb://localhost:27017");
            _database = client.GetDatabase(configuration.GetSection("DatabaseSettings:DatabaseName").Value ?? "ShoeShopDB");
        }

        public IMongoCollection<Product> Products => _database.GetCollection<Product>("Products");
        public IMongoCollection<Category> Categories => _database.GetCollection<Category>("Categories");
        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<Order> Orders => _database.GetCollection<Order>("Orders");
    }
} 