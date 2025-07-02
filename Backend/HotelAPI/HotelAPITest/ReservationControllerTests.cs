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
using Xunit.Abstractions;

namespace HotelAPI.Tests
{
    public class ReservationControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _httpClient;
        public ReservationControllerTests(WebApplicationFactory<Program> client)
        {
            _httpClient = client.CreateClient();
        }

        [Fact]
        public async Task GetAllReservations_ReturnsReservation_WhenValidData()
        {
            // Arrange 


            // Act
            var response = await _httpClient.GetAsync("/api/Reservation/GetAllReservations");

            // Assert
            response.EnsureSuccessStatusCode();
            var reservations = await response.Content.ReadFromJsonAsync<List<ReservationResponse>>();
            Assert.NotNull(reservations);
            Assert.NotEmpty(reservations);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        }

  
    }
}
