import { link } from '../mixins/link';
import { VantComponent } from '../common/component';
VantComponent({
  classes: ['num-class', 'desc-class', 'detail-class' , 'thumb-class', 'title-class', 'price-class', 'origin-price-class'],
  mixins: [link],
  props: {
    shopname:String,
    ordernum: String,
    ordertime:String,
    orderstate:String,
    ordermoney: String,
    discountmoney:String,
    deliveryCost:String,
    totalmoney:String,
  },
  methods: {
    onClickThumb: function onClickThumb() {
      this.jumpLink('thumbLink');
    }
  }
});