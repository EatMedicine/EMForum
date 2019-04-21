using EMForum.Class;
using EMForum.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace EMForum.Controllers
{
    public class ApiController : Controller
    {
        public JsonResult Insert()
        {
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllAreaInfo()
        {
            areaInfo[] data = SqlHelper.GetInfo<areaInfo,int>(a => a.areaId == a.areaId, a => a.areaId);
            areaInfoData[] rData = Tools.ConvertAreaInfo(data);
            return Json(rData,"", Encoding.UTF8,JsonRequestBehavior.AllowGet);
        }
        public JsonResult SignUp(string username,string password,string email)
        {
            
            return Json(false, JsonRequestBehavior.AllowGet);
        }
    }
}