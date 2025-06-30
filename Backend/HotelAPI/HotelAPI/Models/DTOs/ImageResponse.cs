using Supabase.Postgrest.Attributes;

namespace HotelAPI.Models.DTOs
{
    public class ImageResponse
    {
        public Guid Id { get; set; }

        public Guid RoomId { get; set; }

        public string ImageUrl { get; set; }
    }
}
