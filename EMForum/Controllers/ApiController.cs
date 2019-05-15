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
        //测试
        public JsonResult Insert()
        {
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        //获取全部的分区信息
        public JsonResult GetAllAreaInfo()
        {
            areaInfo[] data = SqlHelper.GetInfo<areaInfo,int>(a => a.areaId == a.areaId, a => a.areaId);
            areaInfoData[] rData = Tools.ConvertAreaInfo(data);
            return Json(rData,"", Encoding.UTF8,JsonRequestBehavior.AllowGet);
        }
        //注册 返回是否注册成功
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

        public JsonResult LoginIn(string username,string password)
        {
            userInfo[] data = SqlHelper.GetInfo<userInfo, int>(x => x.name == username &&
            x.psw == password, x => x.userId);
            bool isSuccess;
            if (data.Length != 0)
                isSuccess = true;
            else
                isSuccess = false;
            return Json(isSuccess, JsonRequestBehavior.AllowGet);
        }
        //激活用户 返回是否激活成功
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
        //是否有这个用户
        //有返回true 无返回false
        public JsonResult HaveUser(string username)
        {
            userInfo[] list = SqlHelper.GetInfo<userInfo, int>(u => u.name == username, a => a.userId);
            return Json(!(list.Length == 0), JsonRequestBehavior.AllowGet);
        }
    }
}