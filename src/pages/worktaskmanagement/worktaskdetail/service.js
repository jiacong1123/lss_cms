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


//缴费记录
export const paymentRecords = (data) => {
  return request({
    url: '/workorder/pay/list',
    method: 'POST',
    data:{
      orderno:data.orderno,
      page: 1,
      limit: 9999
    }
  });
};
