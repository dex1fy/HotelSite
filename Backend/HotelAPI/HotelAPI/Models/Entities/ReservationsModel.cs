using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace HotelAPI.Models.Entities
{
    [Table("reservations")]
    public class ReservationsModel : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("guest_id")]
        public Guid GuestId { get; set; }

        [Column("room_id")]
        public Guid RoomId { get; set; }

        [Column("check_in_date")]
        public DateOnly CheckInDate { get; set; }

        [Column("check_out_date")]
        public DateOnly CheckOutDate { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
