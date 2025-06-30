using Supabase.Postgrest.Attributes;

namespace HotelAPI.Models.DTOs
{
    public class ReservationRequest
    {
        public Guid Id { get; set; }

        public Guid GuestId { get; set; }

        public Guid RoomId { get; set; }

        public DateOnly CheckInDate { get; set; }

        public DateOnly CheckOutDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Email { get; set; }

        public int RoomNumber { get; set; }

        public string GuestName { get; set; }
    }
}