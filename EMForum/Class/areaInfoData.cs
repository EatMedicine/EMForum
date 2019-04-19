using EMForum.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EMForum.Class
{
    public class areaInfoData
    {
        public int areaId;
        public string name;
        public bool isEnable;
        public int R;
        public int G;
        public int B;

        public areaInfoData(areaInfo data)
        {
            areaId = data.areaId;
            name = data.name;
            isEnable = data.isEnable == 1;
            Random random = new Random(areaId+100);
            R = random.Next(0, 255);
            G = random.Next(0, 255);
            B = random.Next(0, 255);
            switch (random.Next(1, 3))
            {
                case 1:R = 83;B = 255; break;
                case 2:G = 83;R = 255; break;
                case 3:B = 83;G = 255; break;
                default: R = 47;break;
            }
        }

    }
}