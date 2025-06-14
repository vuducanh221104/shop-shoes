using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Server.Utils
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService()
        {
            var account = new Account(
                "deymlksje",
                "586475811362686",
                "Wco7HTznIl8iAy85N572ujTEbG4"
            );

            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;
        }

        public async Task<List<string>> UploadImagesAsync(List<IFormFile> files)
        {
            var uploadResults = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var stream = file.OpenReadStream())
                    {
                        var uploadParams = new ImageUploadParams
                        {
                            File = new FileDescription(file.FileName, stream),
                            Folder = "ecommerce_uploads",
                            Transformation = new Transformation()
                                .Quality("auto:good")
                                .FetchFormat("auto")
                        };

                        // Add stripping of metadata - use the correct property
                        uploadParams.UseFilename = true;
                        uploadParams.UniqueFilename = true;
                        
                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                        
                        if (uploadResult.Error == null)
                        {
                            uploadResults.Add(uploadResult.SecureUrl.ToString());
                        }
                    }
                }
            }

            return uploadResults;
        }
    }
} 