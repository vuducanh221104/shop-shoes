using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoeShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public ActionResult<string> Get()
        {
            return Ok("Test API is working!");
        }

        [HttpGet("time")]
        public ActionResult<Dictionary<string, string>> GetTime()
        {
            var result = new Dictionary<string, string>
            {
                { "currentTime", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") },
                { "timeZone", TimeZoneInfo.Local.DisplayName }
            };
            
            return Ok(result);
        }

        [HttpGet("echo/{message}")]
        public ActionResult<object> Echo(string message)
        {
            return Ok(new { message, timestamp = DateTime.Now });
        }
    }
} 