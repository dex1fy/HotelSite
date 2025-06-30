using HotelAPI.Models.DTOs;
using HotelAPI.Models.Entities;
using HotelAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly SupabaseService _supabaseService;
        public ReservationController(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        [HttpGet("GetAllReservations")]
        public async Task<IActionResult> GetAllReservations()
        {
            var supabaseClient = await _supabaseService.InitSupabase();

            var response = await supabaseClient.From<ReservationsModel>().Get();

            var reservation = response.Models.Select(r => new ReservationResponse
            {
                Id = r.Id,
                GuestId = r.GuestId,
                RoomId = r.RoomId,
                CheckInDate = r.CheckInDate,
                CheckOutDate = r.CheckOutDate,
                CreatedAt = r.CreatedAt

            });

            return Ok(reservation);
        }

        [HttpPost("AddReservation")]
        public async Task<IActionResult> AddReservation([FromBody] ReservationResponse request)
        {
            var supabaseClient = await _supabaseService.InitSupabase();
            var response = await supabaseClient.From<ReservationsModel>().Get();
            var guest = await supabaseClient.From<GuestModel>().Where(g => g.GuestEmail == request.Email).Single();

            var reservationsModel = new ReservationsModel
            {
                Id = Guid.NewGuid(),
                GuestId = guest.Id,
                RoomId = request.RoomId,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                CreatedAt = request.CreatedAt
            };

            var reservation = await supabaseClient.From<ReservationsModel>().Insert(reservationsModel);

            return Ok(new {message = "vso ok"});
        }

    }
}
