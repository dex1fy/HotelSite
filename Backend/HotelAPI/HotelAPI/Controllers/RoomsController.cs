using HotelAPI.Models.DTOs;
using HotelAPI.Models.Entities;
using HotelAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly SupabaseService _supabaseService;
        public RoomsController(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        [HttpGet("GetAllRooms")] 
        public async Task<IActionResult> GetAllRooms()
        {
            var supabaseClient = await _supabaseService.InitSupabase();

            var response = await supabaseClient.From<RoomModel>().Get();

            var roomTypeResponse = await supabaseClient.From<RoomTypeModel>().Get();
            var roomTypeList = roomTypeResponse.Models;

            var rooms = response.Models.Select(r => {
                var roomType = roomTypeList.FirstOrDefault(rt => rt.Id == r.RoomTypeId);
                return new RoomsResponse
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomTypeName = roomType?.Name,
                    Floor = r.Floor,
                    Description = r.Description,
                    Status = r.Status,
                    Guests = r.Guests,
                };
                }).ToList();
            
            return Ok(rooms);
        }
    }
}
