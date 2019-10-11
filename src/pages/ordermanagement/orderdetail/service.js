import request from 'utils/request';
 
export const getOrderList = (data) => {
  return request({
    url: '/bagorder/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "phone": data.phone
    }
  });
};
