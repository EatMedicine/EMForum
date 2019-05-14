using EMForum.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;

namespace EMForum
{
    public static class SqlHelper
    {
        #region 查询
        public static T[] GetInfo<T,TKey>(Expression<Func<T,bool>> whereLambda,Expression<Func<T,TKey>> orderBy) where T:class
        {
            try
            {
                using(EMForumEntities db = new EMForumEntities())
                {
                    DbQuery<T> dataObject = db.Set<T>().Where<T>(whereLambda).OrderBy(orderBy) as DbQuery<T>;
                    T[] dataList = dataObject.ToArray();
                    return dataList;
                }
            }
            catch
            {
                return new T[0];
            }
        }
        #endregion
        #region 插入
        public static bool Insert<T>(T obj) where T:class
        {
            try
            {
                using(EMForumEntities db = new EMForumEntities())
                {
                    db.Set<T>().Add(obj);
                    db.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }
        #endregion

        public static bool Update<T>(T obj, Expression<Func<T, bool>> whereLambda,params string[] partList) where T : class
        {
            try
            {
                using(EMForumEntities db = new EMForumEntities())
                {
                    DbEntityEntry entry = db.Entry<T>(obj);
                    entry.State = EntityState.Unchanged;
                    foreach (string proName in partList)
                    {
                        entry.Property(proName).IsModified = true;
                    }
                    db.Configuration.ValidateOnSaveEnabled = false;
                    db.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public static bool UpdateUserInfo(userInfo data, Expression<Func<userInfo, bool>> whereLambda, params string[] propList)
        {
            using (EMForumEntities db = new EMForumEntities())
            {
                userInfo user = db.userInfo.Where(whereLambda).FirstOrDefault();
                Type t = data.GetType();
                try
                {
                    foreach (string field in propList)
                    {
                        //搜索对应的属性名 要是没有则继续
                        PropertyInfo pi = t.GetProperty(field);
                        if (pi == null)
                        {
                            continue;
                        }
                        object obj = pi.GetValue(data);
                        pi.SetValue(user, obj);
                    }
                    db.SaveChanges();
                }
                catch
                {
                    return false;
                }

                return true;
            }

        }

    }
}