using Supabase.Postgrest.Attributes;

namespace HotelAPI.Models.DTOs
{
    public class ReservationResponse
    {
        public Guid Id { get; set; }

        public Guid GuestId { get; set; }

        public Guid RoomId { get; set; }

        public DateOnly CheckInDate { get; set; }

        public DateOnly CheckOutDate { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
