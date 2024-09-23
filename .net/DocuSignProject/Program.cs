using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

class Program
{
    private static readonly string CLIENT_ID = "f4567ce0-13f0-4eba-a0ca-4541380b0c92";
    private static readonly string CLIENT_SECRET = "db3d1aa4-1673-4081-9db5-2774e0607dbd";

    static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);


        // Add services to the container.
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
        });

        var app = builder.Build();

        // Enable the CORS policy
        app.UseCors("AllowAllOrigins");

        app.MapPost("/oauth/token", async context =>
        {
            using var reader = new StreamReader(context.Request.Body);
            var requestBody = await reader.ReadToEndAsync();

            using var client = new HttpClient();
            var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{CLIENT_ID}:{CLIENT_SECRET}"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
  
            var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://account-d.docusign.com/oauth/token", content);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Success: " + result);
                await context.Response.WriteAsync(result);
            }
            else
            {
                var errorResult = $"Error: {response.StatusCode} - {response.ReasonPhrase}";
                Console.WriteLine(errorResult);
                context.Response.StatusCode = (int)response.StatusCode;
                await context.Response.WriteAsync(errorResult);
            }
        });

        await app.RunAsync();
    }
}
