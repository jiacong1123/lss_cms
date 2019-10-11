import request from 'utils/request';

export const getOrderDetail = (data) => {
  return request({
    url: '/workorder/details',
    method: 'POST',
    data:{
      orderno:data.orderno
    }
  })
}

export const reserveOrder = (data) => {
  return request({
    url: '/workorder/reserve',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "clinicid": data.clinicid,
      "reservedate":data.reservedate,
      "reservetime":data.reservetime
    }
  })
}

export const followOrder = (data) => {
  return request({
    url: '/workorder/followup',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "complaint": data.complaint,
      "level": data.level,
      "returndate": data.returndate,
      "followup": data.followup,
    }
  })
}

export const closeOrder = (data)=> {
  return request({
    url: '/workorder/close',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "closereason": data.closereason
    }
  })
}


export const arrivalsOrder = (data)=> {
  return request({
    url: '/workorder/arrivals',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "doctorid": data.doctorid
    }
  })
}


export const turnfollowupOrder = (data)=> {
  return request({
    url: '/workorder/turnfollowup',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "content": data.content
    }
  })
}

export const updatereserveOrder = (data)=> {
  return request({
    url: '/workorder/updatereserve',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "clinicid": data.clinicid,
      "reservedate": data.reservedate,
      "reservetime": data.reservetime
    }
  })
}


export const transactionOrder = (data)=> {
  console.log(data)
  return request({
    url: '/workorder/transaction',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "projectid": data.classid,
      "pid": data.pid,
      "worknotes": data.worknotes,
      "receivablesamt": data.receivablesamt,
      "amount": data.amount,
      "debtamt": data.debtamt,
      "payTime": data.payTime
    }
  })
}

export const changeLabels= (data) => {
  return request({
    url: '/workorder/lable/edit',
    method: 'POST',
    data:{
      "userid": data.userid,
      "lablenames": data.labels
    }
  })
}
