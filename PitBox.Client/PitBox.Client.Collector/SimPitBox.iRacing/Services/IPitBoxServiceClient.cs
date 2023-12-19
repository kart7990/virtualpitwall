using System;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Services
{
    public interface IPitBoxServiceClient
    {
        Task Post<T>(Uri uploadUrl, T content);
    }
}