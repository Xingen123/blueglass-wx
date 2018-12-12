import { VantComponent } from '../common/component';
var app = getApp()
VantComponent({
  classes: ['bar-class', 'price-class', 'button-class'],
  props: {
    tip: [String, Boolean],
    type: Number,
    price: null,
    label: String,
    labeltext: String,
    freight: String,
    loading: Boolean,
    disabled: Boolean,
    buttonText: String,
    currency: {
      type: String,
      value: '¥'
    },
    buttonType: {
      type: String,
      value: 'danger'
    }
  },
  computed: {
    isIphoneX:function(){
      return app.globalData.isIphoneX ? true : false
    },
    // isIphoneX: app.globalData.isIphoneX ? true : false,
    hasPrice: function hasPrice() {
      return typeof this.data.price === 'number';
    },
    priceStr: function priceStr() {
      return (this.data.price / 100).toFixed(2);
    },
    tipStr: function tipStr() {
      var tip = this.data.tip;
      return typeof tip === 'string' ? tip : '';
    }
  },
  methods: {
    onSubmit: function onSubmit(event) {
     
      this.$emit('submit', event.detail);

    }
  }
});