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
            //添加用户名不能重复
            userInfo[] list = SqlHelper.GetInfo<userInfo, int>(u => u.name == username, a => a.userId);
            if (list.Length != 0)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
            userInfo info = new userInfo
            {
                name = username,
                psw = password,
                email = email,
                userHeaderPic = "/res/DefaultHead.jpg",
                isEnable = 0
            };
            bool IsSuccess = SqlHelper.Insert<userInfo>(info);
            return Json(IsSuccess, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult ActivateUser(string username)
        {
            userInfo tmp = new userInfo
            {
                name = username,
                isEnable = 1
            };
            bool result = SqlHelper.UpdateUserInfo(tmp, u => u.name == username, "isEnable");
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult HaveUser(string username)
        {
            userInfo[] list = SqlHelper.GetInfo<userInfo, int>(u => u.name == username, a => a.userId);
            return Json(list.Length == 0, JsonRequestBehavior.AllowGet);
        }
    }
}