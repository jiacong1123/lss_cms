import request from 'utils/request';

export const getMonthList = (data) => {
  return request({
    url: '/storder/list/currmonth',
    method: 'POST',
    data: {
      "page": data.page,
      "limit": data.limit,
      "adminName": data.adminName,
    }
  });
}

export const getHistoryList = (data) => {
  return request({
    url: '/storder/list/history',
    method: 'POST',
    data: {
      "page": data.page,
      "limit": data.limit,
      "adminName": data.adminName,
      "startDateStr": data.startDateStr,
      "endDateStr": data.endDateStr
    }
  });
}
