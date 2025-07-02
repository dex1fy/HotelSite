using HotelAPI.Models.DTOs;
using HotelAPI.Models.DTOs.Registration;
using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace HotelAPI.Tests
{
    public class ProfileControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _httpClient;
        public ProfileControllerTests(WebApplicationFactory<Program> client)
        {
            _httpClient = client.CreateClient();
        }

        [Fact]
        public async Task GetUser_ReturnsUser_WhenValidData()
        {
            var response = await _httpClient.GetAsync($"/api/Profile/GetUser?email=test@example.com");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var user = await response.Content.ReadFromJsonAsync<GuestResponse>();
            Assert.NotNull(user);
            Assert.Equal("test@example.com", user.GuestEmail);
        }

    }
    
}
