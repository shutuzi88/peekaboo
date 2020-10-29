/*
使用方式如下：
綁定需被監視的物件target並給予id, 在頁面設置成對的錨點['start', 'end'], 不限組數, 範列如下：
  $(function () {
    var peekaboo = new Peekaboo();
    peekaboo.setArea('target', [['begin', 'end'], ['begin1', 'end1']]);

    window.onscroll = function () {
      peekaboo.start();
    }
  })
*/
class Peekaboo {
  constructor() {
    this.areas = [];
  }

  setArea(target, positions) {
    let positionObj = positions.map(function (pos) {
      return [this.toObj(pos[0]), this.toObj(pos[1])];
    }, this);
    this.areas.push({ target: this.toObj(target), positions: positionObj });
  }

  toObj(elem) {
    let obj;
    if (typeof (elem) === 'string') {
      obj = $("#" + elem);
    } else if (typeof (elem) === 'object') {
      if (elem instanceof jQuery) {
        obj = elem;
      } else {
        obj = $("#" + elem);
      }
    }

    return obj;
  }

  layout() {
    let documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.clientHeight
    );
    let scrolledHeight =
      window.pageYOffset || //flexible
      document.documentElement.scrollTop ||
      document.scrollingElement.scrollTop ||
      document.body.scrollTop;
    let viewableContent = window.innerHeight; //fixed
    let viewableBrowser = window.outerHeight; //fixed
    let browserBarHeight = viewableBrowser - viewableContent; //fixed
    let unscrolledHeight = documentHeight - scrolledHeight - viewableContent;
    return {
      scrolledHeight: scrolledHeight,
      viewableBrowser: viewableBrowser,
      browserBarHeight: browserBarHeight,
      unscrolledHeight: unscrolledHeight,
      documentHeight: documentHeight
    };
  }
  div(id) {
    let documentHeight = this.layout().documentHeight;
    let divOffsetHeight = $(id).height() || $(id).outerHeight();
    let divOffsetTop =
      (function () {
        let myObj = $(id);
        if (myObj.length) {
          return myObj.offset().top;
        }
      })();
    let divOffsetBottom =
      documentHeight - (divOffsetTop + divOffsetHeight);
    return {
      divOffsetTop: divOffsetTop,
      divOffsetHeight: divOffsetHeight,
      divOffsetBottom: divOffsetBottom
    }
  }
  start() {
    this.areas.forEach(function (area) {
      this.detectVisible(area);
    }, this);
  }

  detectVisible(area) {
    let cat = area.target.css('display', 'none');
    let visible = [];
    area.positions.forEach(function (pos) {
      let begin = this.div(pos[0]).divOffsetTop;
      let end = this.div(pos[1]).divOffsetBottom;
      let scrollBarLocation = this.layout().scrolledHeight;
      let unscrollBarLocation = this.layout().unscrolledHeight;

      switch (document.body.className) {
        case "PC":
          if (begin <= scrollBarLocation && end <= unscrollBarLocation) {
            //true
            // cat.show();
            visible.push(1);
          } else {
            // cat.hide();
            visible.push(0);
          }
          break;
        case "MOBILE":
          if (begin <= scrollBarLocation + 45 && end <= unscrollBarLocation) {
            //true
            // cat.show();
            visible.push(1);
          } else {
            // cat.hide();
            visible.push(0);
          }
          break;
      }
    }, this);

    if (visible.reduce(function (pv, cv) { return pv + cv; }, 0) > 0) {
      cat.show();
    } else {
      cat.hide();
    }
  }
}