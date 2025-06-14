using Microsoft.AspNetCore.Mvc;
using Server.Utils;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly CloudinaryService _cloudinaryService;

        public UploadController(CloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        // POST: api/upload
        [HttpPost]
        public async Task<IActionResult> UploadFiles()
        {
            try
            {
                if (Request.Form.Files == null || Request.Form.Files.Count == 0)
                {
                    return BadRequest(new { message = "No files uploaded" });
                }

                // Get files with the name 'img' to match the Express.js implementation
                var imgFiles = new List<IFormFile>();
                foreach (var file in Request.Form.Files)
                {
                    if (file.Name == "img")
                    {
                        imgFiles.Add(file);
                    }
                }
                
                if (imgFiles.Count == 0)
                {
                    return BadRequest(new { message = "No files found with name 'img'" });
                }

                // Check file size limit (10MB per file)
                foreach (var file in imgFiles)
                {
                    if (file.Length > 10 * 1024 * 1024)
                    {
                        return BadRequest(new { message = $"File {file.FileName} exceeds the 10MB size limit" });
                    }

                    // Check file type
                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg", "image/webp" };
                    if (!allowedTypes.Contains(file.ContentType.ToLower()))
                    {
                        return BadRequest(new { message = $"File {file.FileName} has an invalid format. Only jpg, jpeg, png, and webp are allowed." });
                    }
                }

                var uploadResults = await _cloudinaryService.UploadImagesAsync(imgFiles);

                return Ok(uploadResults);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error uploading files", error = ex.Message });
            }
        }

        // GET: api/upload/test
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Upload service is working", timestamp = DateTime.UtcNow });
        }
    }
} 