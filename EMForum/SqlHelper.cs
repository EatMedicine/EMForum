using EMForum.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
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
    }
}