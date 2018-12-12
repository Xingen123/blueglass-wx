import { link } from '../mixins/link';
import { VantComponent } from '../common/component';
VantComponent({
  mixins: [link],
  props: {
    minute: {
      type: String,
      value: '15'
    },
    second: {
      type: String,
      value: '0'
    },
  },
  methods: {
    onClickThumb: function onClickThumb() {
      this.jumpLink('thumbLink');
    },
  }
});
// 倒计时
// https://www.cnblogs.com/yan0802/p/vue.html