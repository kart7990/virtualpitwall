using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Pitwall.Server.Core.Database.Entities
{
    public class TeamMember
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public bool IsOwner { get; set; }
        public bool IsAdmin { get; set; }
        public Guid TeamId { get; set; }
        [JsonIgnore]
        public virtual Team Team { get; set; }
        public Guid UserId { get; set; }
        [JsonIgnore]
        public virtual PitwallUser User { get; set; }
    }
}
