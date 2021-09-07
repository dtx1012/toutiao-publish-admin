/* 文章相关请求模块 */
import request from '@/utils/request';

/* 获取文章列表 */
export const getArticles = params => {
  return request({
    methods: 'GET',
    url: '/mp/v1_0/articles',
    /* 
      Body参数使用data设置
      Query参数使用params设置
      Headers参数使用headers设置 
    */
    params
  })
}

/* 获取文章频道数据 */
export const getArticleChannels = params => {
  return request({
    methods: 'GET',
    url: '/mp/v1_0/channels'
  })
}

/* 删除文章数据 */
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中的写的路径参数需要在 url 中传递
    // 凡是看见接口路径中有的 :xxx 格式的字段，则需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/* 新建文章数据 */
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft //是否为草稿（true为草稿）
    },
    data
  })
}

/* 获取指定文章数据 */
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`,
  })
}

/* 修改文章数据 */
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft //是否为草稿（true为草稿）
    },
    data
  })
}
