using Supabase.Postgrest.Attributes;

namespace HotelAPI.Models.DTOs
{
    public class GuestResponse
    {
       
        public Guid Id { get; set; }

        public string? GuestSurname { get; set; }

        public string? GuestName { get; set; }

        public string? GuestPatronymic { get; set; }

        public string? GuestEmail { get; set; }

        public string? GuestPhone { get; set; }

    }
}
