/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */
const fs = require('fs');
 
const dirName = process.argv[2];
 
if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}
 
// 页面模版
const indexTep = `import React from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import styles from './index.less'

const namespace = '${dirName}'

@connect(({${dirName}}) => ({
  ...${dirName},
}))

class ${titleCase(dirName)} extends React.Component {

  componentDidMount = () => {
 
  }
 
  render() {
    return (
      <div className={styles.${dirName}Page}>
        ${dirName}
      </div>
    )
  }
}

export default ${titleCase(dirName)}
`;
 
// less文件模版
const lessTep = `.${dirName}Page {}`;
 
// model文件模版
const modelTep = `import * as ${dirName}Api from './service';
 
export default {
  namespace: '${dirName}',
  state: {
 
  },
 
  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(${dirName}Api.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },
  },
 
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
       
      })
    }
}
 
};
`;
 
 
// service页面模版
const serviceTep = `import request from 'utils/request';
 
export const demo = (data) => {
  return request({
    url: '路径',
    method: 'POST',
    data,
  });
};
`;
 
 
 
fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1
 
fs.writeFileSync('index.jsx', indexTep);
fs.writeFileSync('index.less', lessTep);
fs.writeFileSync('model.js', modelTep);
fs.writeFileSync('service.js', serviceTep);
 
console.log(`模版${dirName}已创建,请手动增加models`);
 
function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}
 
process.exit(0);