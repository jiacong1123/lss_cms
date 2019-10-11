import './utils/global'
import './utils/wsItit'
import './themes/index.less'

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

