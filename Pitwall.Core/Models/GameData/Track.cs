using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class Track
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CodeName { get; set; }
        public double Length { get; set; }
        public List<Sector> Sectors { get; set; } = new List<Sector>();
    }
}
