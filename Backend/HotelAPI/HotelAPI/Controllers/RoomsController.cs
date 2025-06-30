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


            var rooms = await supabaseClient.From<RoomModel>().Get();
            var roomTypes = await supabaseClient.From<RoomTypeModel>().Get();
            var amenities = await supabaseClient.From<AmenitiesModel>().Get();
            var amenitiesInRoomType = await supabaseClient.From<AmenitiesRoomModel>().Get();

            var imagesResponse = await supabaseClient.From<ImageModel>().Get();
            var images = imagesResponse.Models;

            var result = rooms.Models.Select(r =>
            {
                var roomType = roomTypes.Models.FirstOrDefault(rt => rt.Id == r.RoomTypeId);

                var roomAmenities = amenitiesInRoomType.Models
                    .Where(art => art.IdRoom == r.RoomTypeId.ToString())  
                    .Join(amenities.Models,
                        art => art.IdAmenities,  
                        a => a.Id,                          
                        (art, a) => new AmenityDto         
                        {
                            Id = a.Id,
                            Name = a.Name ?? string.Empty   
                        })
                    .ToList();

                return new RoomsResponse
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomTypeName = roomType?.Name,
                    Floor = r.Floor,
                    Description = r.Description,
                    Status = r.Status,
                    Guests = r.Guests,
                    Price = roomType?.Price ?? 0,
                    Capacities = roomType?.Capacities ?? 0,
                    Amenities = roomAmenities,
                    Images = images.Where(img => img.RoomId == r.Id).Select(img => img.ImageUrl).ToList()
                };
            }).ToList();

            

            return Ok(result);
        }

    }
}
