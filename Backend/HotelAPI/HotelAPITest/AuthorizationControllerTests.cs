using HotelAPI.Models.DTOs.Registration;
using Microsoft.AspNetCore.Mvc.Testing;
using Supabase.Gotrue;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace HotelAPI.Tests
{
    public class AuthorizationControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _httpClient;
        public AuthorizationControllerTests(WebApplicationFactory<Program> client)
        {
            _httpClient = client.CreateClient();
        }

        [Fact]
        public async Task RegisterGuest_ReturnsGuest_WhenRegister()
        {
            //Arrange
            var request = new RegistrationRequest
            {
                Email = "test1@example.com",
                Password = "Test123!",
                ConfirmPassword = "Test123!",
                Name = "Test User"
            };

            //Act
            var response = await _httpClient.PostAsJsonAsync("api/Authentication/RegisterGuest", request);
            //Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
