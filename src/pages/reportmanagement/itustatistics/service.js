import request from 'utils/request';

export const stcallToday = (data) => {
  return request({
    url: '/stcall/list/today',
    method: 'POST',
    data: {
      "page": data.page,
      "limit": data.limit,
      "adminName": data.adminName,
    }
  });
}

export const stcallTodayCount = (data) => {
  return request({
    url: '/stcall/list/today/count',
    method: 'POST',
    data: {
      "adminName": data.adminName,
    }
  });
}

export const stcallHistory = (data) => {
  return request({
    url: '/stcall/list/history',
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

export const stcallHistoryCount = (data) => {
  return request({
    url: '/stcall/list/history/count',
    method: 'POST',
    data: {
      "adminName": data.adminName,
      "startDateStr": data.startDateStr,
      "endDateStr": data.endDateStr
    }
  });
}
