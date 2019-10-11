import request from 'utils/request';
 
export const demo = (data) => {
  return request({
    url: '路径',
    method: 'POST',
    data,
  });
};
