using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Pitwall.Server.Core.Database.Entities
{
    public class Webhook
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Url { get; set; }
        public string Message { get; set; }
        public Guid UserId { get; set; }
        [JsonIgnore]
        public virtual PitwallUser User { get; set; }
    }
}
