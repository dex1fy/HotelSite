using HotelAPI.Models.DTOs;
using HotelAPI.Models.Entities;
using HotelAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Supabase.Core.Extensions;
using System.Reflection.Metadata.Ecma335;

namespace HotelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly SupabaseService _supabaseService;
        public ProfileController(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser(string email)
        {
            var supabaseClient = await _supabaseService.InitSupabase();

            var response = await supabaseClient.From<GuestModel>().Where(g => g.GuestEmail == email).Single();

            var user = new GuestResponse
            {
                GuestEmail = response.GuestEmail,
                GuestName = response.GuestName,
                GuestPatronymic = response.GuestPatronymic,
                GuestPhone = response.GuestPhone,
                GuestSurname = response.GuestSurname,
                Id = response.Id
            };

            return Ok(user);
        }

        [HttpGet("GetUserReservations")]
        public async Task<IActionResult> GetUserReservations(string email)
        {
            var supabaseClient = await _supabaseService.InitSupabase();

           
            var guest = await supabaseClient.From<GuestModel>()
                .Where(g => g.GuestEmail == email)
                .Single();

           
            var reservations = await supabaseClient.From<ReservationsModel>()
                .Where(r => r.GuestId == guest.Id)
                .Get();

        
            var rooms = await supabaseClient.From<RoomModel>()
                .Get();

          
            var result = reservations.Models.Select(r =>
            {
               
                var room = rooms.Models.FirstOrDefault(room => room.Id == r.RoomId);

                return new ReservationResponse
                {
                    Id = r.Id,
                    GuestId = guest.Id,
                    RoomNumber = room.RoomNumber, 
                    CheckInDate = r.CheckInDate,
                    CheckOutDate = r.CheckOutDate,
                    CreatedAt = r.CreatedAt,
                };
            }).ToList();

            return Ok(result);
        }
    }
}