import request from 'utils/request';
 
export const getOrderDetail = (data) => {
  return request({
    url: '/workorder/details',
    method: 'POST',
    data:{
      orderno:data.orderno
    }
  });
};
