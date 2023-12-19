using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace PitBox.Core.Entities
{
    public class Alert
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public int Priority { get; set; }
        public string LinkText { get; set; }
        public string LinkLocation { get; set; }
        public bool SessionDismissible { get; set; }
        public bool PermanentlyDismissible { get; set; }
        public DateTime DateActive { get; set; }
        public DateTime? DateInactive { get; set; }
    }
}