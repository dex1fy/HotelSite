
namespace HotelAPI.Models.DTOs
{

    public class RoomsResponse 
    {

        public Guid Id { get; set; }

        public int RoomNumber { get; set; }

        public string? RoomTypeName { get; set; }

        public int Floor { get; set; }

        public string? Description { get; set; }

        public bool Status { get; set; }

        public int Guests { get; set; }

    }
}
