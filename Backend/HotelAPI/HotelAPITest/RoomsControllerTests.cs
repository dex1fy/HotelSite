using HotelAPI.Models.DTOs;
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
    public class RoomsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _httpClient;
        public RoomsControllerTests(WebApplicationFactory<Program> client)
        {
            _httpClient = client.CreateClient();
        }

        [Fact]
        public async Task GetAllRooms_ReturnsRooms_WhenValidData()
        {
            // Arrange 


            // Act
            var response = await _httpClient.GetAsync("/api/Rooms/GetAllRooms");

            // Assert
            response.EnsureSuccessStatusCode();
            var rooms = await response.Content.ReadFromJsonAsync<List<ReservationResponse>>();
            Assert.NotNull(rooms);
            Assert.NotEmpty(rooms);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        }
    }
}
