using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Windows.Core.Models
{
    public class Track
    {
        private readonly List<Sector> _sectors = new List<Sector>();

        public int Id { get; set; }
        public string Name { get; set; }
        public string CodeName { get; set; }
        public double Length { get; set; }
        public List<Sector> Sectors
        {
            get { return _sectors; }
        }
    }
}
