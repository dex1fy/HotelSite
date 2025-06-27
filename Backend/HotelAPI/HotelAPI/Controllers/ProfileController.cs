using HotelAPI.Models.DTOs;
using HotelAPI.Models.Entities;
using HotelAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Supabase.Core.Extensions;

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
            //var reservation = await supabaseClient.From<ReservationsModel>().Where().Single();

            var user = new GuestResponse { 
                GuestEmail = response.GuestEmail, 
                GuestName = response.GuestName,
                GuestPatronymic = response.GuestPatronymic,
                GuestPhone = response.GuestPhone, 
                GuestSurname = response.GuestSurname,
                Id = response.Id 
            };

            return Ok(user);
        }
    }
}
