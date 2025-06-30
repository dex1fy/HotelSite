using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace HotelAPI.Models.Entities
{
    [Table("image_room")]
    public class ImageModel : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("room_id")]
        public Guid RoomId { get; set; }

        [Column("image_url")]
        public string ImageUrl { get; set; }
    }
}
