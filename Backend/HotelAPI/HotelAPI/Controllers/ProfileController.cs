using HotelAPI.Models.DTOs;
using HotelAPI.Models.Entities;
using HotelAPI.Services;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetUser()
        {
            var supabaseClient = await _supabaseService.InitSupabase();

            var response = await supabaseClient.From<GuestModel>().Get();

            var userProf = response.Models.Select(r => new GuestResponse
            {
                GuestSurname = r.GuestSurname,
                GuestName = r.GuestName,
                GuestPatronymic = r.GuestPatronymic,
                GuestEmail = r.GuestEmail,
                GuestPhone = r.GuestPhone
            });

            return Ok(userProf);
        }
    }
}
