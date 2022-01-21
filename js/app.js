(() => {
  "use strict";
  class t {
    constructor(t) {
      let e = {
        logging: !0,
        init: !0,
        attributeOpenButton: "data-popup",
        attributeCloseButton: "data-close",
        fixElementSelector: "[data-lp]",
        youtubeAttribute: "data-youtube",
        youtubePlaceAttribute: "data-youtube-place",
        setAutoplayYoutube: !0,
        classes: {
          popup: "popup",
          popupContent: "popup__content",
          popupActive: "popup_show",
          bodyActive: "popup-show",
        },
        focusCatch: !0,
        closeEsc: !0,
        bodyLock: !0,
        bodyLockDelay: 500,
        hashSettings: { location: !0, goHash: !0 },
        on: {
          beforeOpen: function () {},
          afterOpen: function () {},
          beforeClose: function () {},
          afterClose: function () {},
        },
      };
      (this.isOpen = !1),
        (this.targetOpen = { selector: !1, element: !1 }),
        (this.previousOpen = { selector: !1, element: !1 }),
        (this.lastClosed = { selector: !1, element: !1 }),
        (this._dataValue = !1),
        (this.hash = !1),
        (this._reopen = !1),
        (this._selectorOpen = !1),
        (this.lastFocusEl = !1),
        (this._focusEl = [
          "a[href]",
          'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
          "button:not([disabled]):not([aria-hidden])",
          "select:not([disabled]):not([aria-hidden])",
          "textarea:not([disabled]):not([aria-hidden])",
          "area[href]",
          "iframe",
          "object",
          "embed",
          "[contenteditable]",
          '[tabindex]:not([tabindex^="-"])',
        ]),
        (this.options = {
          ...e,
          ...t,
          classes: { ...e.classes, ...t?.classes },
          hashSettings: { ...e.hashSettings, ...t?.hashSettings },
          on: { ...e.on, ...t?.on },
        }),
        this.options.init && this.initPopups();
    }
    initPopups() {
      this.popupLogging("Проснулся"), this.eventsPopup();
    }
    eventsPopup() {
      document.addEventListener(
        "click",
        function (t) {
          const e = t.target.closest(`[${this.options.attributeOpenButton}]`);
          if (e)
            return (
              t.preventDefault(),
              (this._dataValue = e.getAttribute(
                this.options.attributeOpenButton
              )
                ? e.getAttribute(this.options.attributeOpenButton)
                : "error"),
              "error" !== this._dataValue
                ? (this.isOpen || (this.lastFocusEl = e),
                  (this.targetOpen.selector = `${this._dataValue}`),
                  (this._selectorOpen = !0),
                  void this.open())
                : void this.popupLogging(
                    `Ой ой, не заполнен атрибут у ${e.classList}`
                  )
            );
          return t.target.closest(`[${this.options.attributeCloseButton}]`) ||
            (!t.target.closest(`.${this.options.classes.popupContent}`) &&
              this.isOpen)
            ? (t.preventDefault(), void this.close())
            : void 0;
        }.bind(this)
      ),
        document.addEventListener(
          "keydown",
          function (t) {
            if (
              this.options.closeEsc &&
              27 == t.which &&
              "Escape" === t.code &&
              this.isOpen
            )
              return t.preventDefault(), void this.close();
            this.options.focusCatch &&
              9 == t.which &&
              this.isOpen &&
              this._focusCatch(t);
          }.bind(this)
        ),
        document.querySelector("form[data-ajax],form[data-dev]") &&
          document.addEventListener(
            "formSent",
            function (t) {
              const e = t.detail.form.dataset.popupMessage;
              e && this.open(e);
            }.bind(this)
          ),
        this.options.hashSettings.goHash &&
          (window.addEventListener(
            "hashchange",
            function () {
              window.location.hash
                ? this._openToHash()
                : this.close(this.targetOpen.selector);
            }.bind(this)
          ),
          window.addEventListener(
            "load",
            function () {
              window.location.hash && this._openToHash();
            }.bind(this)
          ));
    }
    open(t) {
      if (
        (t &&
          "string" == typeof t &&
          "" !== t.trim() &&
          ((this.targetOpen.selector = t), (this._selectorOpen = !0)),
        this.isOpen && ((this._reopen = !0), this.close()),
        this._selectorOpen ||
          (this.targetOpen.selector = this.lastClosed.selector),
        this._reopen || (this.previousActiveElement = document.activeElement),
        (this.targetOpen.element = document.querySelector(
          this.targetOpen.selector
        )),
        this.targetOpen.element)
      ) {
        if (
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
        ) {
          const t = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
              this.options.youtubeAttribute
            )}?rel=0&showinfo=0&autoplay=1`,
            e = document.createElement("iframe");
          e.setAttribute("allowfullscreen", "");
          const s = this.options.setAutoplayYoutube ? "autoplay;" : "";
          e.setAttribute("allow", `${s}; encrypted-media`),
            e.setAttribute("src", t),
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
              this.targetOpen.element
                .querySelector(`[${this.options.youtubePlaceAttribute}]`)
                .appendChild(e);
        }
        this.options.hashSettings.location &&
          (this._getHash(), this._setHash()),
          this.options.on.beforeOpen(this),
          this.targetOpen.element.classList.add(
            this.options.classes.popupActive
          ),
          document.body.classList.add(this.options.classes.bodyActive),
          this._reopen ? (this._reopen = !1) : n(),
          this.targetOpen.element.setAttribute("aria-hidden", "false"),
          (this.previousOpen.selector = this.targetOpen.selector),
          (this.previousOpen.element = this.targetOpen.element),
          (this._selectorOpen = !1),
          (this.isOpen = !0),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          document.dispatchEvent(
            new CustomEvent("afterPopupOpen", { detail: { popup: this } })
          ),
          this.popupLogging("Открыл попап");
      } else
        this.popupLogging(
          "Ой ой, такого попапа нет. Проверьте корректность ввода. "
        );
    }
    close(t) {
      t &&
        "string" == typeof t &&
        "" !== t.trim() &&
        (this.previousOpen.selector = t),
        this.isOpen &&
          i &&
          (this.options.on.beforeClose(this),
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute) &&
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
            (this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ).innerHTML = ""),
          this.previousOpen.element.classList.remove(
            this.options.classes.popupActive
          ),
          this.previousOpen.element.setAttribute("aria-hidden", "true"),
          this._reopen ||
            (document.body.classList.remove(this.options.classes.bodyActive),
            n(),
            (this.isOpen = !1)),
          this._removeHash(),
          this._selectorOpen &&
            ((this.lastClosed.selector = this.previousOpen.selector),
            (this.lastClosed.element = this.previousOpen.element)),
          this.options.on.afterClose(this),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          this.popupLogging("Закрыл попап"));
    }
    _getHash() {
      this.options.hashSettings.location &&
        (this.hash = this.targetOpen.selector.includes("#")
          ? this.targetOpen.selector
          : this.targetOpen.selector.replace(".", "#"));
    }
    _openToHash() {
      let t = document.querySelector(
        `.${window.location.hash.replace("#", "")}`
      )
        ? `.${window.location.hash.replace("#", "")}`
        : document.querySelector(`${window.location.hash}`)
        ? `${window.location.hash}`
        : null;
      document.querySelector(`[${this.options.attributeOpenButton}="${t}"]`) &&
        t &&
        this.open(t);
    }
    _setHash() {
      history.pushState("", "", this.hash);
    }
    _removeHash() {
      history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(t) {
      const e = this.targetOpen.element.querySelectorAll(this._focusEl),
        s = Array.prototype.slice.call(e),
        o = s.indexOf(document.activeElement);
      t.shiftKey && 0 === o && (s[s.length - 1].focus(), t.preventDefault()),
        t.shiftKey || o !== s.length - 1 || (s[0].focus(), t.preventDefault());
    }
    _focusTrap() {
      const t = this.previousOpen.element.querySelectorAll(this._focusEl);
      !this.isOpen && this.lastFocusEl
        ? this.lastFocusEl.focus()
        : t[0].focus();
    }
    popupLogging(t) {
      this.options.logging && l(`[Попапос]: ${t}`);
    }
  }
  let e = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        e.Android() || e.BlackBerry() || e.iOS() || e.Opera() || e.Windows()
      );
    },
  };
  let s = (t, e = 500, s = 0) => {
      t.classList.contains("_slide") ||
        (t.classList.add("_slide"),
        (t.style.transitionProperty = "height, margin, padding"),
        (t.style.transitionDuration = e + "ms"),
        (t.style.height = `${t.offsetHeight}px`),
        t.offsetHeight,
        (t.style.overflow = "hidden"),
        (t.style.height = s ? `${s}px` : "0px"),
        (t.style.paddingTop = 0),
        (t.style.paddingBottom = 0),
        (t.style.marginTop = 0),
        (t.style.marginBottom = 0),
        window.setTimeout(() => {
          (t.hidden = !s),
            !s && t.style.removeProperty("height"),
            t.style.removeProperty("padding-top"),
            t.style.removeProperty("padding-bottom"),
            t.style.removeProperty("margin-top"),
            t.style.removeProperty("margin-bottom"),
            !s && t.style.removeProperty("overflow"),
            t.style.removeProperty("transition-duration"),
            t.style.removeProperty("transition-property"),
            t.classList.remove("_slide");
        }, e));
    },
    o = (t, e = 500, s = 0) => {
      if (!t.classList.contains("_slide")) {
        t.classList.add("_slide"),
          (t.hidden = !t.hidden && null),
          s && t.style.removeProperty("height");
        let o = t.offsetHeight;
        (t.style.overflow = "hidden"),
          (t.style.height = s ? `${s}px` : "0px"),
          (t.style.paddingTop = 0),
          (t.style.paddingBottom = 0),
          (t.style.marginTop = 0),
          (t.style.marginBottom = 0),
          t.offsetHeight,
          (t.style.transitionProperty = "height, margin, padding"),
          (t.style.transitionDuration = e + "ms"),
          (t.style.height = o + "px"),
          t.style.removeProperty("padding-top"),
          t.style.removeProperty("padding-bottom"),
          t.style.removeProperty("margin-top"),
          t.style.removeProperty("margin-bottom"),
          window.setTimeout(() => {
            t.style.removeProperty("height"),
              t.style.removeProperty("overflow"),
              t.style.removeProperty("transition-duration"),
              t.style.removeProperty("transition-property"),
              t.classList.remove("_slide");
          }, e);
      }
    },
    i = !0,
    n = (t = 500) => {
      document.documentElement.classList.contains("lock") ? a(t) : r(t);
    },
    a = (t = 500) => {
      let e = document.querySelector("body");
      if (i) {
        let s = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
          for (let t = 0; t < s.length; t++) {
            s[t].style.paddingRight = "0px";
          }
          (e.style.paddingRight = "0px"),
            document.documentElement.classList.remove("lock");
        }, t),
          (i = !1),
          setTimeout(function () {
            i = !0;
          }, t);
      }
    },
    r = (t = 500) => {
      let e = document.querySelector("body");
      if (i) {
        let s = document.querySelectorAll("[data-lp]");
        for (let t = 0; t < s.length; t++) {
          s[t].style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
        }
        (e.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px"),
          document.documentElement.classList.add("lock"),
          (i = !1),
          setTimeout(function () {
            i = !0;
          }, t);
      }
    };
  function l(t) {
    setTimeout(() => {
      window.FLS && console.log(t);
    }, 0);
  }
  function c(t) {
    return t.filter(function (t, e, s) {
      return s.indexOf(t) === e;
    });
  }
  function h(t, e) {
    const s = Array.from(t).filter(function (t, s, o) {
      if (t.dataset[e]) return t.dataset[e].split(",")[0];
    });
    if (s.length) {
      const t = [];
      s.forEach((s) => {
        const o = {},
          i = s.dataset[e].split(",");
        (o.value = i[0]),
          (o.type = i[1] ? i[1].trim() : "max"),
          (o.item = s),
          t.push(o);
      });
      let o = t.map(function (t) {
        return (
          "(" + t.type + "-width: " + t.value + "px)," + t.value + "," + t.type
        );
      });
      o = c(o);
      const i = [];
      if (o.length)
        return (
          o.forEach((e) => {
            const s = e.split(","),
              o = s[1],
              n = s[2],
              a = window.matchMedia(s[0]),
              r = t.filter(function (t) {
                if (t.value === o && t.type === n) return !0;
              });
            i.push({ itemsArray: r, matchMedia: a });
          }),
          i
        );
    }
  }
  let d = (t, e = !1, s = 500, o = 0) => {
    const i = document.querySelector(t);
    if (i) {
      let n = "",
        r = 0;
      e &&
        ((n = "header.header"), (r = document.querySelector(n).offsetHeight));
      let c = {
        speedAsDuration: !0,
        speed: s,
        header: n,
        offset: o,
        easing: "easeOutQuad",
      };
      if (
        (document.documentElement.classList.contains("menu-open") &&
          (a(), document.documentElement.classList.remove("menu-open")),
        "undefined" != typeof SmoothScroll)
      )
        new SmoothScroll().animateScroll(i, "", c);
      else {
        let t = i.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: r ? t - r : t, behavior: "smooth" });
      }
      l(`[gotoBlock]: Юхуу...едем к ${t}`);
    } else l(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${t}`);
  };
  class u {
    constructor(t) {
      (this.config = Object.assign({ logging: !0 }, t)),
        this.observer,
        !document.documentElement.classList.contains("watcher") &&
          this.scrollWatcherRun();
    }
    scrollWatcherUpdate() {
      this.scrollWatcherRun();
    }
    scrollWatcherRun() {
      document.documentElement.classList.add("watcher"),
        this.scrollWatcherConstructor(
          document.querySelectorAll("[data-watch]")
        );
    }
    scrollWatcherConstructor(t) {
      if (t.length) {
        this.scrollWatcherLogging(
          `Проснулся, слежу за объектами (${t.length})...`
        ),
          c(
            Array.from(t).map(function (t) {
              return `${
                t.dataset.watchRoot ? t.dataset.watchRoot : null
              }|${t.dataset.watchMargin ? t.dataset.watchMargin : "0px"}|${t.dataset.watchThreshold ? t.dataset.watchThreshold : 0}`;
            })
          ).forEach((e) => {
            let s = e.split("|"),
              o = { root: s[0], margin: s[1], threshold: s[2] },
              i = Array.from(t).filter(function (t) {
                let e = t.dataset.watchRoot ? t.dataset.watchRoot : null,
                  s = t.dataset.watchMargin ? t.dataset.watchMargin : "0px",
                  i = t.dataset.watchThreshold ? t.dataset.watchThreshold : 0;
                if (
                  String(e) === o.root &&
                  String(s) === o.margin &&
                  String(i) === o.threshold
                )
                  return t;
              }),
              n = this.getScrollWatcherConfig(o);
            this.scrollWatcherInit(i, n);
          });
      } else
        this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
    }
    getScrollWatcherConfig(t) {
      let e = {};
      if (
        (document.querySelector(t.root)
          ? (e.root = document.querySelector(t.root))
          : "null" !== t.root &&
            this.scrollWatcherLogging(
              `Эмм... родительского объекта ${t.root} нет на странице`
            ),
        (e.rootMargin = t.margin),
        !(t.margin.indexOf("px") < 0 && t.margin.indexOf("%") < 0))
      ) {
        if ("prx" === t.threshold) {
          t.threshold = [];
          for (let e = 0; e <= 1; e += 0.005) t.threshold.push(e);
        } else t.threshold = t.threshold.split(",");
        return (e.threshold = t.threshold), e;
      }
      this.scrollWatcherLogging(
        "Ой ой, настройку data-watch-margin нужно задавать в PX или %"
      );
    }
    scrollWatcherCreate(t) {
      this.observer = new IntersectionObserver((t, e) => {
        t.forEach((t) => {
          this.scrollWatcherCallback(t, e);
        });
      }, t);
    }
    scrollWatcherInit(t, e) {
      this.scrollWatcherCreate(e), t.forEach((t) => this.observer.observe(t));
    }
    scrollWatcherIntersecting(t, e) {
      t.isIntersecting
        ? (!e.classList.contains("_watcher-view") &&
            e.classList.add("_watcher-view"),
          this.scrollWatcherLogging(
            `Я вижу ${e.classList}, добавил класс _watcher-view`
          ))
        : (e.classList.contains("_watcher-view") &&
            e.classList.remove("_watcher-view"),
          this.scrollWatcherLogging(
            `Я не вижу ${e.classList}, убрал класс _watcher-view`
          ));
    }
    scrollWatcherOff(t, e) {
      e.unobserve(t),
        this.scrollWatcherLogging(`Я перестал следить за ${t.classList}`);
    }
    scrollWatcherLogging(t) {
      this.config.logging && l(`[Наблюдатель]: ${t}`);
    }
    scrollWatcherCallback(t, e) {
      const s = t.target;
      this.scrollWatcherIntersecting(t, s),
        s.hasAttribute("data-watch-once") &&
          t.isIntersecting &&
          this.scrollWatcherOff(s, e),
        document.dispatchEvent(
          new CustomEvent("watcherCallback", { detail: { entry: t } })
        );
    }
  }
  let p = !1;
  setTimeout(() => {
    if (p) {
      let t = new Event("windowScroll");
      window.addEventListener("scroll", function (e) {
        document.dispatchEvent(t);
      });
    }
  }, 0),
    (window.FLS = !0),
    (function (t) {
      let e = new Image();
      (e.onload = e.onerror =
        function () {
          t(2 == e.height);
        }),
        (e.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
    })(function (t) {
      let e = !0 === t ? "webp" : "no-webp";
      document.documentElement.classList.add(e);
    }),
    e.any() && document.documentElement.classList.add("touch"),
    (function () {
      let t = document.querySelector(".icon-menu");
      t &&
        t.addEventListener("click", function (t) {
          i && (n(), document.documentElement.classList.toggle("menu-open"));
        });
    })(),
    (function () {
      if (document.querySelectorAll("[data-fullscreen]").length && e.any()) {
        function t() {
          let t = 0.01 * window.innerHeight;
          document.documentElement.style.setProperty("--vh", `${t}px`);
        }
        window.addEventListener("resize", t), t();
      }
    })(),
    (function () {
      const t = document.querySelectorAll("[data-tabs]");
      let e = [];
      if (t.length > 0) {
        const s = location.hash.replace("#", "");
        s.startsWith("tab-") && (e = s.replace("tab-", "").split("-")),
          t.forEach((t, s) => {
            t.classList.add("_tab-init"),
              t.setAttribute("data-tabs-index", s),
              t.addEventListener("click", n),
              (function (t) {
                const s = t.querySelectorAll("[data-tabs-titles]>*"),
                  o = t.querySelectorAll("[data-tabs-body]>*"),
                  i = t.dataset.tabsIndex,
                  n = e[0] == i;
                if (n) {
                  t.querySelector(
                    "[data-tabs-titles]>._tab-active"
                  ).classList.remove("_tab-active");
                }
                o.length > 0 &&
                  o.forEach((t, o) => {
                    s[o].setAttribute("data-tabs-title", ""),
                      t.setAttribute("data-tabs-item", ""),
                      n && o == e[1] && s[o].classList.add("_tab-active"),
                      (t.hidden = !s[o].classList.contains("_tab-active"));
                  });
              })(t);
          });
        let o = h(t, "tabs");
        o &&
          o.length &&
          o.forEach((t) => {
            t.matchMedia.addEventListener("change", function () {
              i(t.itemsArray, t.matchMedia);
            }),
              i(t.itemsArray, t.matchMedia);
          });
      }
      function i(t, e) {
        t.forEach((t) => {
          const s = (t = t.item).querySelector("[data-tabs-titles]"),
            o = t.querySelectorAll("[data-tabs-title]"),
            i = t.querySelector("[data-tabs-body]");
          t.querySelectorAll("[data-tabs-item]").forEach((n, a) => {
            e.matches
              ? (i.append(o[a]), i.append(n), t.classList.add("_tab-spoller"))
              : (s.append(o[a]), t.classList.remove("_tab-spoller"));
          });
        });
      }
      function n(t) {
        const e = t.target;
        if (e.closest("[data-tabs-title]")) {
          const i = e.closest("[data-tabs-title]"),
            n = i.closest("[data-tabs]");
          if (
            !i.classList.contains("_tab-active") &&
            !n.querySelectorAll("._slide").length
          ) {
            const t = n.querySelector("[data-tabs-title]._tab-active");
            t && t.classList.remove("_tab-active"),
              i.classList.add("_tab-active"),
              (function (t) {
                const e = t.querySelectorAll("[data-tabs-title]"),
                  i = t.querySelectorAll("[data-tabs-item]"),
                  n = t.dataset.tabsIndex,
                  a = (function (t) {
                    if (t.hasAttribute("data-tabs-animate"))
                      return t.dataset.tabsAnimate > 0
                        ? t.dataset.tabsAnimate
                        : 500;
                  })(t);
                i.length > 0 &&
                  i.forEach((t, i) => {
                    e[i].classList.contains("_tab-active")
                      ? (a ? o(t, a) : (t.hidden = !1),
                        t.closest(".popup") ||
                          (location.hash = `tab-${n}-${i}`))
                      : a
                      ? s(t, a)
                      : (t.hidden = !0);
                  });
              })(n);
          }
          t.preventDefault();
        }
      }
    })(),
    new t({}),
    new u({}),
    (function () {
      function t(t) {
        if ("click" === t.type) {
          const e = t.target;
          if (e.closest("[data-goto]")) {
            const s = e.closest("[data-goto]"),
              o = s.dataset.goto ? s.dataset.goto : "",
              i = !!s.hasAttribute("data-goto-header"),
              n = s.dataset.gotoSpeed ? s.dataset.gotoSpeed : "500";
            d(o, i, n), t.preventDefault();
          }
        } else if ("watcherCallback" === t.type && t.detail) {
          const e = t.detail.entry,
            s = e.target;
          if ("navigator" === s.dataset.watch) {
            const t = s.id,
              o =
                (document.querySelector("[data-goto]._navigator-active"),
                document.querySelector(`[data-goto="${t}"]`));
            e.isIntersecting
              ? o && o.classList.add("_navigator-active")
              : o && o.classList.remove("_navigator-active");
          }
        }
      }
      document.addEventListener("click", t),
        document.addEventListener("watcherCallback", t);
    })();
})();
