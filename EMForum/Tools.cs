using EMForum.Class;
using EMForum.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EMForum
{
    public static class Tools
    {
        public static areaInfoData[] ConvertAreaInfo(areaInfo[] data)
        {
            if (data == null)
                return new areaInfoData[0];
            areaInfoData[] result = new areaInfoData[data.Length];
            for(int count = 0; count < data.Length; count++)
            {
                result[count] = new areaInfoData(data[count]);
            }
            return result;
        }
    }
}