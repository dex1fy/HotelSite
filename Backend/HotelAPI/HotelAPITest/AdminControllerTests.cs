using HotelAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace HotelAPI.Tests
{
    public class AdminControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _httpClient;
        public AdminControllerTests(WebApplicationFactory<Program> client)
        {
            _httpClient = client.CreateClient();
        }

        [Fact]
        public async Task GetAllReservations_ReturnsReservations_WhenValidData()
        {
            // Arrange 


            // Act
            var response = await _httpClient.GetAsync("/api/Admin/GetAllReservations");

            // Assert
            response.EnsureSuccessStatusCode();
            var reservations = await response.Content.ReadFromJsonAsync<List<ReservationResponse>>();
            Assert.NotNull(reservations);
            Assert.NotEmpty(reservations);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        }

    }
}
