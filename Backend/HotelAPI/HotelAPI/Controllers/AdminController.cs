using HotelAPI.Models.DTOs;
using HotelAPI.Models.Entities;
using HotelAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly SupabaseService _supabaseService;

        public AdminController(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        [HttpGet("GetAllReservations")]
        public async Task<IActionResult> GetAllReservations()
        {
            var supabaseClient = await _supabaseService.InitSupabase();

            var response = await supabaseClient.From<ReservationsModel>().Get();
            var rooms = await supabaseClient.From<RoomModel>().Get();
            var guests = await supabaseClient.From<GuestModel>().Get();


            var reservation = response.Models.Select(r => {
                var room = rooms.Models.FirstOrDefault(room => room.Id == r.RoomId);
                var guest = guests.Models.FirstOrDefault(guest => guest.Id == r.GuestId);
                return new ReservationRequest
                {
                    Id = r.Id,
                    GuestName = guest.GuestName,
                    Email = guest.GuestEmail,
                    RoomNumber = room.RoomNumber,
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    CreatedAt = r.CreatedAt

                };
            }).ToList();

            return Ok(reservation);
        }

        [HttpDelete("DeleteReservation")]
        public async Task<IActionResult> DeleteReservation(Guid reservationId)
        {
            var supabaseClient = await _supabaseService.InitSupabase();

            var response = supabaseClient.From<ReservationsModel>().Where(r => r.Id == reservationId).Delete();

            return Ok(new { message = "Reservation deleted successfully" });
        }
    }
}