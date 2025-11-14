var Bv = Object.defineProperty,
  Hv = Object.defineProperties;
var Uv = Object.getOwnPropertyDescriptors;
var Qf = Object.getOwnPropertySymbols;
var zv = Object.prototype.hasOwnProperty,
  $v = Object.prototype.propertyIsEnumerable;
var Xf = (t, n, e) =>
    n in t ? Bv(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (t[n] = e),
  x = (t, n) => {
    for (var e in (n ||= {})) zv.call(n, e) && Xf(t, e, n[e]);
    if (Qf) for (var e of Qf(n)) $v.call(n, e) && Xf(t, e, n[e]);
    return t;
  },
  Q = (t, n) => Hv(t, Uv(n));
var wl;
function Mo() {
  return wl;
}
function Et(t) {
  let n = wl;
  return ((wl = t), n);
}
var Jf = Symbol('NotFound');
function bi(t) {
  return t === Jf || t?.name === '\u0275NotFound';
}
var Fe = null,
  To = !1,
  Il = 1,
  Gv = null,
  Se = Symbol('SIGNAL');
function T(t) {
  let n = Fe;
  return ((Fe = t), n);
}
function Oo() {
  return Fe;
}
var Nn = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: 'unknown',
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Di(t) {
  if (To) throw new Error('');
  if (Fe === null) return;
  Fe.consumerOnSignalRead(t);
  let n = Fe.producersTail;
  if (n !== void 0 && n.producer === t) return;
  let e,
    i = Fe.recomputing;
  if (i && ((e = n !== void 0 ? n.nextProducer : Fe.producers), e !== void 0 && e.producer === t)) {
    ((Fe.producersTail = e), (e.lastReadVersion = t.version));
    return;
  }
  let r = t.consumersTail;
  if (r !== void 0 && r.consumer === Fe && (!i || qv(r, Fe))) return;
  let o = Ci(Fe),
    s = {
      producer: t,
      consumer: Fe,
      nextProducer: e,
      prevConsumer: r,
      lastReadVersion: t.version,
      nextConsumer: void 0,
    };
  ((Fe.producersTail = s), n !== void 0 ? (n.nextProducer = s) : (Fe.producers = s), o && ih(t, s));
}
function eh() {
  Il++;
}
function ko(t) {
  if (!(Ci(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Il)) {
    if (!t.producerMustRecompute(t) && !kn(t)) {
      No(t);
      return;
    }
    (t.producerRecomputeValue(t), No(t));
  }
}
function Sl(t) {
  if (t.consumers === void 0) return;
  let n = To;
  To = !0;
  try {
    for (let e = t.consumers; e !== void 0; e = e.nextConsumer) {
      let i = e.consumer;
      i.dirty || Wv(i);
    }
  } finally {
    To = n;
  }
}
function xl() {
  return Fe?.consumerAllowSignalWrites !== !1;
}
function Wv(t) {
  ((t.dirty = !0), Sl(t), t.consumerMarkedDirty?.(t));
}
function No(t) {
  ((t.dirty = !1), (t.lastCleanEpoch = Il));
}
function nn(t) {
  return (t && th(t), T(t));
}
function th(t) {
  ((t.producersTail = void 0), (t.recomputing = !0));
}
function On(t, n) {
  (T(n), t && nh(t));
}
function nh(t) {
  t.recomputing = !1;
  let n = t.producersTail,
    e = n !== void 0 ? n.nextProducer : t.producers;
  if (e !== void 0) {
    if (Ci(t))
      do e = Ml(e);
      while (e !== void 0);
    n !== void 0 ? (n.nextProducer = void 0) : (t.producers = void 0);
  }
}
function kn(t) {
  for (let n = t.producers; n !== void 0; n = n.nextProducer) {
    let e = n.producer,
      i = n.lastReadVersion;
    if (i !== e.version || (ko(e), i !== e.version)) return !0;
  }
  return !1;
}
function rn(t) {
  if (Ci(t)) {
    let n = t.producers;
    for (; n !== void 0; ) n = Ml(n);
  }
  ((t.producers = void 0),
    (t.producersTail = void 0),
    (t.consumers = void 0),
    (t.consumersTail = void 0));
}
function ih(t, n) {
  let e = t.consumersTail,
    i = Ci(t);
  if (
    (e !== void 0
      ? ((n.nextConsumer = e.nextConsumer), (e.nextConsumer = n))
      : ((n.nextConsumer = void 0), (t.consumers = n)),
    (n.prevConsumer = e),
    (t.consumersTail = n),
    !i)
  )
    for (let r = t.producers; r !== void 0; r = r.nextProducer) ih(r.producer, r);
}
function Ml(t) {
  let n = t.producer,
    e = t.nextProducer,
    i = t.nextConsumer,
    r = t.prevConsumer;
  if (
    ((t.nextConsumer = void 0),
    (t.prevConsumer = void 0),
    i !== void 0 ? (i.prevConsumer = r) : (n.consumersTail = r),
    r !== void 0)
  )
    r.nextConsumer = i;
  else if (((n.consumers = i), !Ci(n))) {
    let o = n.producers;
    for (; o !== void 0; ) o = Ml(o);
  }
  return e;
}
function Ci(t) {
  return t.consumerIsAlwaysLive || t.consumers !== void 0;
}
function Fo(t) {
  Gv?.(t);
}
function qv(t, n) {
  let e = n.producersTail;
  if (e !== void 0) {
    let i = n.producers;
    do {
      if (i === t) return !0;
      if (i === e) break;
      i = i.nextProducer;
    } while (i !== void 0);
  }
  return !1;
}
function Po(t, n) {
  return Object.is(t, n);
}
function hr(t, n) {
  let e = Object.create(Yv);
  ((e.computation = t), n !== void 0 && (e.equal = n));
  let i = () => {
    if ((ko(e), Di(e), e.value === fr)) throw e.error;
    return e.value;
  };
  return ((i[Se] = e), Fo(e), i);
}
var Ro = Symbol('UNSET'),
  Ao = Symbol('COMPUTING'),
  fr = Symbol('ERRORED'),
  Yv = Q(x({}, Nn), {
    value: Ro,
    dirty: !0,
    error: null,
    equal: Po,
    kind: 'computed',
    producerMustRecompute(t) {
      return t.value === Ro || t.value === Ao;
    },
    producerRecomputeValue(t) {
      if (t.value === Ao) throw new Error('');
      let n = t.value;
      t.value = Ao;
      let e = nn(t),
        i,
        r = !1;
      try {
        ((i = t.computation()), T(null), (r = n !== Ro && n !== fr && i !== fr && t.equal(n, i)));
      } catch (o) {
        ((i = fr), (t.error = o));
      } finally {
        On(t, e);
      }
      if (r) {
        t.value = n;
        return;
      }
      ((t.value = i), t.version++);
    },
  });
function Zv() {
  throw new Error();
}
var rh = Zv;
function oh(t) {
  rh(t);
}
function Tl(t) {
  rh = t;
}
var Kv = null;
function Rl(t, n) {
  let e = Object.create(Lo);
  ((e.value = t), n !== void 0 && (e.equal = n));
  let i = () => sh(e);
  return ((i[Se] = e), Fo(e), [i, (s) => pr(e, s), (s) => Al(e, s)]);
}
function sh(t) {
  return (Di(t), t.value);
}
function pr(t, n) {
  (xl() || oh(t), t.equal(t.value, n) || ((t.value = n), Qv(t)));
}
function Al(t, n) {
  (xl() || oh(t), pr(t, n(t.value)));
}
var Lo = Q(x({}, Nn), { equal: Po, value: void 0, kind: 'signal' });
function Qv(t) {
  (t.version++, eh(), Sl(t), Kv?.(t));
}
function P(t) {
  return typeof t == 'function';
}
function Vo(t) {
  let e = t((i) => {
    (Error.call(i), (i.stack = new Error().stack));
  });
  return ((e.prototype = Object.create(Error.prototype)), (e.prototype.constructor = e), e);
}
var jo = Vo(
  (t) =>
    function (e) {
      (t(this),
        (this.message = e
          ? `${e.length} errors occurred during unsubscription:
${e.map((i, r) => `${r + 1}) ${i.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = e));
    },
);
function Fn(t, n) {
  if (t) {
    let e = t.indexOf(n);
    0 <= e && t.splice(e, 1);
  }
}
var W = class t {
  constructor(n) {
    ((this.initialTeardown = n),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let n;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: e } = this;
      if (e)
        if (((this._parentage = null), Array.isArray(e))) for (let o of e) o.remove(this);
        else e.remove(this);
      let { initialTeardown: i } = this;
      if (P(i))
        try {
          i();
        } catch (o) {
          n = o instanceof jo ? o.errors : [o];
        }
      let { _finalizers: r } = this;
      if (r) {
        this._finalizers = null;
        for (let o of r)
          try {
            ah(o);
          } catch (s) {
            ((n = n ?? []), s instanceof jo ? (n = [...n, ...s.errors]) : n.push(s));
          }
      }
      if (n) throw new jo(n);
    }
  }
  add(n) {
    var e;
    if (n && n !== this)
      if (this.closed) ah(n);
      else {
        if (n instanceof t) {
          if (n.closed || n._hasParent(this)) return;
          n._addParent(this);
        }
        (this._finalizers = (e = this._finalizers) !== null && e !== void 0 ? e : []).push(n);
      }
  }
  _hasParent(n) {
    let { _parentage: e } = this;
    return e === n || (Array.isArray(e) && e.includes(n));
  }
  _addParent(n) {
    let { _parentage: e } = this;
    this._parentage = Array.isArray(e) ? (e.push(n), e) : e ? [e, n] : n;
  }
  _removeParent(n) {
    let { _parentage: e } = this;
    e === n ? (this._parentage = null) : Array.isArray(e) && Fn(e, n);
  }
  remove(n) {
    let { _finalizers: e } = this;
    (e && Fn(e, n), n instanceof t && n._removeParent(this));
  }
};
W.EMPTY = (() => {
  let t = new W();
  return ((t.closed = !0), t);
})();
var Nl = W.EMPTY;
function Bo(t) {
  return t instanceof W || (t && 'closed' in t && P(t.remove) && P(t.add) && P(t.unsubscribe));
}
function ah(t) {
  P(t) ? t() : t.unsubscribe();
}
var dt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Ei = {
  setTimeout(t, n, ...e) {
    let { delegate: i } = Ei;
    return i?.setTimeout ? i.setTimeout(t, n, ...e) : setTimeout(t, n, ...e);
  },
  clearTimeout(t) {
    let { delegate: n } = Ei;
    return (n?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Ho(t) {
  Ei.setTimeout(() => {
    let { onUnhandledError: n } = dt;
    if (n) n(t);
    else throw t;
  });
}
function mr() {}
var lh = Ol('C', void 0, void 0);
function ch(t) {
  return Ol('E', void 0, t);
}
function dh(t) {
  return Ol('N', t, void 0);
}
function Ol(t, n, e) {
  return { kind: t, value: n, error: e };
}
var Pn = null;
function wi(t) {
  if (dt.useDeprecatedSynchronousErrorHandling) {
    let n = !Pn;
    if ((n && (Pn = { errorThrown: !1, error: null }), t(), n)) {
      let { errorThrown: e, error: i } = Pn;
      if (((Pn = null), e)) throw i;
    }
  } else t();
}
function uh(t) {
  dt.useDeprecatedSynchronousErrorHandling && Pn && ((Pn.errorThrown = !0), (Pn.error = t));
}
var Ln = class extends W {
    constructor(n) {
      (super(),
        (this.isStopped = !1),
        n ? ((this.destination = n), Bo(n) && n.add(this)) : (this.destination = eb));
    }
    static create(n, e, i) {
      return new Lt(n, e, i);
    }
    next(n) {
      this.isStopped ? Fl(dh(n), this) : this._next(n);
    }
    error(n) {
      this.isStopped ? Fl(ch(n), this) : ((this.isStopped = !0), this._error(n));
    }
    complete() {
      this.isStopped ? Fl(lh, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(n) {
      this.destination.next(n);
    }
    _error(n) {
      try {
        this.destination.error(n);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Xv = Function.prototype.bind;
function kl(t, n) {
  return Xv.call(t, n);
}
var Pl = class {
    constructor(n) {
      this.partialObserver = n;
    }
    next(n) {
      let { partialObserver: e } = this;
      if (e.next)
        try {
          e.next(n);
        } catch (i) {
          Uo(i);
        }
    }
    error(n) {
      let { partialObserver: e } = this;
      if (e.error)
        try {
          e.error(n);
        } catch (i) {
          Uo(i);
        }
      else Uo(n);
    }
    complete() {
      let { partialObserver: n } = this;
      if (n.complete)
        try {
          n.complete();
        } catch (e) {
          Uo(e);
        }
    }
  },
  Lt = class extends Ln {
    constructor(n, e, i) {
      super();
      let r;
      if (P(n) || !n) r = { next: n ?? void 0, error: e ?? void 0, complete: i ?? void 0 };
      else {
        let o;
        this && dt.useDeprecatedNextContext
          ? ((o = Object.create(n)),
            (o.unsubscribe = () => this.unsubscribe()),
            (r = {
              next: n.next && kl(n.next, o),
              error: n.error && kl(n.error, o),
              complete: n.complete && kl(n.complete, o),
            }))
          : (r = n);
      }
      this.destination = new Pl(r);
    }
  };
function Uo(t) {
  dt.useDeprecatedSynchronousErrorHandling ? uh(t) : Ho(t);
}
function Jv(t) {
  throw t;
}
function Fl(t, n) {
  let { onStoppedNotification: e } = dt;
  e && Ei.setTimeout(() => e(t, n));
}
var eb = { closed: !0, next: mr, error: Jv, complete: mr };
var Ii = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function Vt(t) {
  return t;
}
function fh(t) {
  return t.length === 0
    ? Vt
    : t.length === 1
      ? t[0]
      : function (e) {
          return t.reduce((i, r) => r(i), e);
        };
}
var L = (() => {
  class t {
    constructor(e) {
      e && (this._subscribe = e);
    }
    lift(e) {
      let i = new t();
      return ((i.source = this), (i.operator = e), i);
    }
    subscribe(e, i, r) {
      let o = nb(e) ? e : new Lt(e, i, r);
      return (
        wi(() => {
          let { operator: s, source: a } = this;
          o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
        }),
        o
      );
    }
    _trySubscribe(e) {
      try {
        return this._subscribe(e);
      } catch (i) {
        e.error(i);
      }
    }
    forEach(e, i) {
      return (
        (i = hh(i)),
        new i((r, o) => {
          let s = new Lt({
            next: (a) => {
              try {
                e(a);
              } catch (l) {
                (o(l), s.unsubscribe());
              }
            },
            error: o,
            complete: r,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(e) {
      var i;
      return (i = this.source) === null || i === void 0 ? void 0 : i.subscribe(e);
    }
    [Ii]() {
      return this;
    }
    pipe(...e) {
      return fh(e)(this);
    }
    toPromise(e) {
      return (
        (e = hh(e)),
        new e((i, r) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => r(s),
            () => i(o),
          );
        })
      );
    }
  }
  return ((t.create = (n) => new t(n)), t);
})();
function hh(t) {
  var n;
  return (n = t ?? dt.Promise) !== null && n !== void 0 ? n : Promise;
}
function tb(t) {
  return t && P(t.next) && P(t.error) && P(t.complete);
}
function nb(t) {
  return (t && t instanceof Ln) || (tb(t) && Bo(t));
}
function Ll(t) {
  return P(t?.lift);
}
function q(t) {
  return (n) => {
    if (Ll(n))
      return n.lift(function (e) {
        try {
          return t(e, this);
        } catch (i) {
          this.error(i);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function z(t, n, e, i, r) {
  return new Vl(t, n, e, i, r);
}
var Vl = class extends Ln {
  constructor(n, e, i, r, o, s) {
    (super(n),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = e
        ? function (a) {
            try {
              e(a);
            } catch (l) {
              n.error(l);
            }
          }
        : super._next),
      (this._error = r
        ? function (a) {
            try {
              r(a);
            } catch (l) {
              n.error(l);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = i
        ? function () {
            try {
              i();
            } catch (a) {
              n.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: e } = this;
      (super.unsubscribe(), !e && ((n = this.onFinalize) === null || n === void 0 || n.call(this)));
    }
  }
};
function ph() {
  return q((t, n) => {
    let e = null;
    t._refCount++;
    let i = z(n, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        e = null;
        return;
      }
      let r = t._connection,
        o = e;
      ((e = null), r && (!o || r === o) && r.unsubscribe(), n.unsubscribe());
    });
    (t.subscribe(i), i.closed || (e = t.connect()));
  });
}
var gr = class extends L {
  constructor(n, e) {
    (super(),
      (this.source = n),
      (this.subjectFactory = e),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Ll(n) && (this.lift = n.lift));
  }
  _subscribe(n) {
    return this.getSubject().subscribe(n);
  }
  getSubject() {
    let n = this._subject;
    return ((!n || n.isStopped) && (this._subject = this.subjectFactory()), this._subject);
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: n } = this;
    ((this._subject = this._connection = null), n?.unsubscribe());
  }
  connect() {
    let n = this._connection;
    if (!n) {
      n = this._connection = new W();
      let e = this.getSubject();
      (n.add(
        this.source.subscribe(
          z(
            e,
            void 0,
            () => {
              (this._teardown(), e.complete());
            },
            (i) => {
              (this._teardown(), e.error(i));
            },
            () => this._teardown(),
          ),
        ),
      ),
        n.closed && ((this._connection = null), (n = W.EMPTY)));
    }
    return n;
  }
  refCount() {
    return ph()(this);
  }
};
var mh = Vo(
  (t) =>
    function () {
      (t(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed'));
    },
);
var D = (() => {
    class t extends L {
      constructor() {
        (super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null));
      }
      lift(e) {
        let i = new zo(this, this);
        return ((i.operator = e), i);
      }
      _throwIfClosed() {
        if (this.closed) throw new mh();
      }
      next(e) {
        wi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let i of this.currentObservers) i.next(e);
          }
        });
      }
      error(e) {
        wi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ((this.hasError = this.isStopped = !0), (this.thrownError = e));
            let { observers: i } = this;
            for (; i.length; ) i.shift().error(e);
          }
        });
      }
      complete() {
        wi(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: e } = this;
            for (; e.length; ) e.shift().complete();
          }
        });
      }
      unsubscribe() {
        ((this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null));
      }
      get observed() {
        var e;
        return ((e = this.observers) === null || e === void 0 ? void 0 : e.length) > 0;
      }
      _trySubscribe(e) {
        return (this._throwIfClosed(), super._trySubscribe(e));
      }
      _subscribe(e) {
        return (this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e));
      }
      _innerSubscribe(e) {
        let { hasError: i, isStopped: r, observers: o } = this;
        return i || r
          ? Nl
          : ((this.currentObservers = null),
            o.push(e),
            new W(() => {
              ((this.currentObservers = null), Fn(o, e));
            }));
      }
      _checkFinalizedStatuses(e) {
        let { hasError: i, thrownError: r, isStopped: o } = this;
        i ? e.error(r) : o && e.complete();
      }
      asObservable() {
        let e = new L();
        return ((e.source = this), e);
      }
    }
    return ((t.create = (n, e) => new zo(n, e)), t);
  })(),
  zo = class extends D {
    constructor(n, e) {
      (super(), (this.destination = n), (this.source = e));
    }
    next(n) {
      var e, i;
      (i = (e = this.destination) === null || e === void 0 ? void 0 : e.next) === null ||
        i === void 0 ||
        i.call(e, n);
    }
    error(n) {
      var e, i;
      (i = (e = this.destination) === null || e === void 0 ? void 0 : e.error) === null ||
        i === void 0 ||
        i.call(e, n);
    }
    complete() {
      var n, e;
      (e = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null ||
        e === void 0 ||
        e.call(n);
    }
    _subscribe(n) {
      var e, i;
      return (i = (e = this.source) === null || e === void 0 ? void 0 : e.subscribe(n)) !== null &&
        i !== void 0
        ? i
        : Nl;
    }
  };
var ut = class extends D {
  constructor(n) {
    (super(), (this._value = n));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(n) {
    let e = super._subscribe(n);
    return (!e.closed && n.next(this._value), e);
  }
  getValue() {
    let { hasError: n, thrownError: e, _value: i } = this;
    if (n) throw e;
    return (this._throwIfClosed(), i);
  }
  next(n) {
    super.next((this._value = n));
  }
};
var _r = {
  now() {
    return (_r.delegate || Date).now();
  },
  delegate: void 0,
};
var $o = class extends D {
  constructor(n = 1 / 0, e = 1 / 0, i = _r) {
    (super(),
      (this._bufferSize = n),
      (this._windowTime = e),
      (this._timestampProvider = i),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = e === 1 / 0),
      (this._bufferSize = Math.max(1, n)),
      (this._windowTime = Math.max(1, e)));
  }
  next(n) {
    let {
      isStopped: e,
      _buffer: i,
      _infiniteTimeWindow: r,
      _timestampProvider: o,
      _windowTime: s,
    } = this;
    (e || (i.push(n), !r && i.push(o.now() + s)), this._trimBuffer(), super.next(n));
  }
  _subscribe(n) {
    (this._throwIfClosed(), this._trimBuffer());
    let e = this._innerSubscribe(n),
      { _infiniteTimeWindow: i, _buffer: r } = this,
      o = r.slice();
    for (let s = 0; s < o.length && !n.closed; s += i ? 1 : 2) n.next(o[s]);
    return (this._checkFinalizedStatuses(n), e);
  }
  _trimBuffer() {
    let { _bufferSize: n, _timestampProvider: e, _buffer: i, _infiniteTimeWindow: r } = this,
      o = (r ? 1 : 2) * n;
    if ((n < 1 / 0 && o < i.length && i.splice(0, i.length - o), !r)) {
      let s = e.now(),
        a = 0;
      for (let l = 1; l < i.length && i[l] <= s; l += 2) a = l;
      a && i.splice(0, a + 1);
    }
  }
};
var Go = class extends W {
  constructor(n, e) {
    super();
  }
  schedule(n, e = 0) {
    return this;
  }
};
var yr = {
  setInterval(t, n, ...e) {
    let { delegate: i } = yr;
    return i?.setInterval ? i.setInterval(t, n, ...e) : setInterval(t, n, ...e);
  },
  clearInterval(t) {
    let { delegate: n } = yr;
    return (n?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Wo = class extends Go {
  constructor(n, e) {
    (super(n, e), (this.scheduler = n), (this.work = e), (this.pending = !1));
  }
  schedule(n, e = 0) {
    var i;
    if (this.closed) return this;
    this.state = n;
    let r = this.id,
      o = this.scheduler;
    return (
      r != null && (this.id = this.recycleAsyncId(o, r, e)),
      (this.pending = !0),
      (this.delay = e),
      (this.id = (i = this.id) !== null && i !== void 0 ? i : this.requestAsyncId(o, this.id, e)),
      this
    );
  }
  requestAsyncId(n, e, i = 0) {
    return yr.setInterval(n.flush.bind(n, this), i);
  }
  recycleAsyncId(n, e, i = 0) {
    if (i != null && this.delay === i && this.pending === !1) return e;
    e != null && yr.clearInterval(e);
  }
  execute(n, e) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = !1;
    let i = this._execute(n, e);
    if (i) return i;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(n, e) {
    let i = !1,
      r;
    try {
      this.work(n);
    } catch (o) {
      ((i = !0), (r = o || new Error('Scheduled action threw falsy error')));
    }
    if (i) return (this.unsubscribe(), r);
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: n, scheduler: e } = this,
        { actions: i } = e;
      ((this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Fn(i, this),
        n != null && (this.id = this.recycleAsyncId(e, n, null)),
        (this.delay = null),
        super.unsubscribe());
    }
  }
};
var Si = class t {
  constructor(n, e = t.now) {
    ((this.schedulerActionCtor = n), (this.now = e));
  }
  schedule(n, e = 0, i) {
    return new this.schedulerActionCtor(this, n).schedule(i, e);
  }
};
Si.now = _r.now;
var qo = class extends Si {
  constructor(n, e = Si.now) {
    (super(n, e), (this.actions = []), (this._active = !1));
  }
  flush(n) {
    let { actions: e } = this;
    if (this._active) {
      e.push(n);
      return;
    }
    let i;
    this._active = !0;
    do if ((i = n.execute(n.state, n.delay))) break;
    while ((n = e.shift()));
    if (((this._active = !1), i)) {
      for (; (n = e.shift()); ) n.unsubscribe();
      throw i;
    }
  }
};
var vr = new qo(Wo),
  gh = vr;
var Vn = new L((t) => t.complete());
function Yo(t) {
  return t && P(t.schedule);
}
function jl(t) {
  return t[t.length - 1];
}
function Zo(t) {
  return P(jl(t)) ? t.pop() : void 0;
}
function wt(t) {
  return Yo(jl(t)) ? t.pop() : void 0;
}
function _h(t, n) {
  return typeof jl(t) == 'number' ? t.pop() : n;
}
function vh(t, n, e, i) {
  function r(o) {
    return o instanceof e
      ? o
      : new e(function (s) {
          s(o);
        });
  }
  return new (e || (e = Promise))(function (o, s) {
    function a(d) {
      try {
        c(i.next(d));
      } catch (f) {
        s(f);
      }
    }
    function l(d) {
      try {
        c(i.throw(d));
      } catch (f) {
        s(f);
      }
    }
    function c(d) {
      d.done ? o(d.value) : r(d.value).then(a, l);
    }
    c((i = i.apply(t, n || [])).next());
  });
}
function yh(t) {
  var n = typeof Symbol == 'function' && Symbol.iterator,
    e = n && t[n],
    i = 0;
  if (e) return e.call(t);
  if (t && typeof t.length == 'number')
    return {
      next: function () {
        return (t && i >= t.length && (t = void 0), { value: t && t[i++], done: !t });
      },
    };
  throw new TypeError(n ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function jn(t) {
  return this instanceof jn ? ((this.v = t), this) : new jn(t);
}
function bh(t, n, e) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var i = e.apply(t, n || []),
    r,
    o = [];
  return (
    (r = Object.create((typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype)),
    a('next'),
    a('throw'),
    a('return', s),
    (r[Symbol.asyncIterator] = function () {
      return this;
    }),
    r
  );
  function s(h) {
    return function (m) {
      return Promise.resolve(m).then(h, f);
    };
  }
  function a(h, m) {
    i[h] &&
      ((r[h] = function (_) {
        return new Promise(function (w, v) {
          o.push([h, _, w, v]) > 1 || l(h, _);
        });
      }),
      m && (r[h] = m(r[h])));
  }
  function l(h, m) {
    try {
      c(i[h](m));
    } catch (_) {
      p(o[0][3], _);
    }
  }
  function c(h) {
    h.value instanceof jn ? Promise.resolve(h.value.v).then(d, f) : p(o[0][2], h);
  }
  function d(h) {
    l('next', h);
  }
  function f(h) {
    l('throw', h);
  }
  function p(h, m) {
    (h(m), o.shift(), o.length && l(o[0][0], o[0][1]));
  }
}
function Dh(t) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var n = t[Symbol.asyncIterator],
    e;
  return n
    ? n.call(t)
    : ((t = typeof yh == 'function' ? yh(t) : t[Symbol.iterator]()),
      (e = {}),
      i('next'),
      i('throw'),
      i('return'),
      (e[Symbol.asyncIterator] = function () {
        return this;
      }),
      e);
  function i(o) {
    e[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, l) {
          ((s = t[o](s)), r(a, l, s.done, s.value));
        });
      };
  }
  function r(o, s, a, l) {
    Promise.resolve(l).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var Ko = (t) => t && typeof t.length == 'number' && typeof t != 'function';
function Qo(t) {
  return P(t?.then);
}
function Xo(t) {
  return P(t[Ii]);
}
function Jo(t) {
  return Symbol.asyncIterator && P(t?.[Symbol.asyncIterator]);
}
function es(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == 'object' ? 'an invalid object' : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function ib() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var ts = ib();
function ns(t) {
  return P(t?.[ts]);
}
function is(t) {
  return bh(this, arguments, function* () {
    let e = t.getReader();
    try {
      for (;;) {
        let { value: i, done: r } = yield jn(e.read());
        if (r) return yield jn(void 0);
        yield yield jn(i);
      }
    } finally {
      e.releaseLock();
    }
  });
}
function rs(t) {
  return P(t?.getReader);
}
function oe(t) {
  if (t instanceof L) return t;
  if (t != null) {
    if (Xo(t)) return rb(t);
    if (Ko(t)) return ob(t);
    if (Qo(t)) return sb(t);
    if (Jo(t)) return Ch(t);
    if (ns(t)) return ab(t);
    if (rs(t)) return lb(t);
  }
  throw es(t);
}
function rb(t) {
  return new L((n) => {
    let e = t[Ii]();
    if (P(e.subscribe)) return e.subscribe(n);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function ob(t) {
  return new L((n) => {
    for (let e = 0; e < t.length && !n.closed; e++) n.next(t[e]);
    n.complete();
  });
}
function sb(t) {
  return new L((n) => {
    t.then(
      (e) => {
        n.closed || (n.next(e), n.complete());
      },
      (e) => n.error(e),
    ).then(null, Ho);
  });
}
function ab(t) {
  return new L((n) => {
    for (let e of t) if ((n.next(e), n.closed)) return;
    n.complete();
  });
}
function Ch(t) {
  return new L((n) => {
    cb(t, n).catch((e) => n.error(e));
  });
}
function lb(t) {
  return Ch(is(t));
}
function cb(t, n) {
  var e, i, r, o;
  return vh(this, void 0, void 0, function* () {
    try {
      for (e = Dh(t); (i = yield e.next()), !i.done; ) {
        let s = i.value;
        if ((n.next(s), n.closed)) return;
      }
    } catch (s) {
      r = { error: s };
    } finally {
      try {
        i && !i.done && (o = e.return) && (yield o.call(e));
      } finally {
        if (r) throw r.error;
      }
    }
    n.complete();
  });
}
function Ge(t, n, e, i = 0, r = !1) {
  let o = n.schedule(function () {
    (e(), r ? t.add(this.schedule(null, i)) : this.unsubscribe());
  }, i);
  if ((t.add(o), !r)) return o;
}
function os(t, n = 0) {
  return q((e, i) => {
    e.subscribe(
      z(
        i,
        (r) => Ge(i, t, () => i.next(r), n),
        () => Ge(i, t, () => i.complete(), n),
        (r) => Ge(i, t, () => i.error(r), n),
      ),
    );
  });
}
function ss(t, n = 0) {
  return q((e, i) => {
    i.add(t.schedule(() => e.subscribe(i), n));
  });
}
function Eh(t, n) {
  return oe(t).pipe(ss(n), os(n));
}
function wh(t, n) {
  return oe(t).pipe(ss(n), os(n));
}
function Ih(t, n) {
  return new L((e) => {
    let i = 0;
    return n.schedule(function () {
      i === t.length ? e.complete() : (e.next(t[i++]), e.closed || this.schedule());
    });
  });
}
function Sh(t, n) {
  return new L((e) => {
    let i;
    return (
      Ge(e, n, () => {
        ((i = t[ts]()),
          Ge(
            e,
            n,
            () => {
              let r, o;
              try {
                ({ value: r, done: o } = i.next());
              } catch (s) {
                e.error(s);
                return;
              }
              o ? e.complete() : e.next(r);
            },
            0,
            !0,
          ));
      }),
      () => P(i?.return) && i.return()
    );
  });
}
function as(t, n) {
  if (!t) throw new Error('Iterable cannot be null');
  return new L((e) => {
    Ge(e, n, () => {
      let i = t[Symbol.asyncIterator]();
      Ge(
        e,
        n,
        () => {
          i.next().then((r) => {
            r.done ? e.complete() : e.next(r.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function xh(t, n) {
  return as(is(t), n);
}
function Mh(t, n) {
  if (t != null) {
    if (Xo(t)) return Eh(t, n);
    if (Ko(t)) return Ih(t, n);
    if (Qo(t)) return wh(t, n);
    if (Jo(t)) return as(t, n);
    if (ns(t)) return Sh(t, n);
    if (rs(t)) return xh(t, n);
  }
  throw es(t);
}
function Qe(t, n) {
  return n ? Mh(t, n) : oe(t);
}
function jt(...t) {
  let n = wt(t);
  return Qe(t, n);
}
function ls(t) {
  return !!t && (t instanceof L || (P(t.lift) && P(t.subscribe)));
}
function Th(t) {
  return t instanceof Date && !isNaN(t);
}
function ue(t, n) {
  return q((e, i) => {
    let r = 0;
    e.subscribe(
      z(i, (o) => {
        i.next(t.call(n, o, r++));
      }),
    );
  });
}
var { isArray: db } = Array;
function ub(t, n) {
  return db(n) ? t(...n) : t(n);
}
function cs(t) {
  return ue((n) => ub(t, n));
}
var { isArray: fb } = Array,
  { getPrototypeOf: hb, prototype: pb, keys: mb } = Object;
function ds(t) {
  if (t.length === 1) {
    let n = t[0];
    if (fb(n)) return { args: n, keys: null };
    if (gb(n)) {
      let e = mb(n);
      return { args: e.map((i) => n[i]), keys: e };
    }
  }
  return { args: t, keys: null };
}
function gb(t) {
  return t && typeof t == 'object' && hb(t) === pb;
}
function us(t, n) {
  return t.reduce((e, i, r) => ((e[i] = n[r]), e), {});
}
function Bn(...t) {
  let n = wt(t),
    e = Zo(t),
    { args: i, keys: r } = ds(t);
  if (i.length === 0) return Qe([], n);
  let o = new L(_b(i, n, r ? (s) => us(r, s) : Vt));
  return e ? o.pipe(cs(e)) : o;
}
function _b(t, n, e = Vt) {
  return (i) => {
    Rh(
      n,
      () => {
        let { length: r } = t,
          o = new Array(r),
          s = r,
          a = r;
        for (let l = 0; l < r; l++)
          Rh(
            n,
            () => {
              let c = Qe(t[l], n),
                d = !1;
              c.subscribe(
                z(
                  i,
                  (f) => {
                    ((o[l] = f), d || ((d = !0), a--), a || i.next(e(o.slice())));
                  },
                  () => {
                    --s || i.complete();
                  },
                ),
              );
            },
            i,
          );
      },
      i,
    );
  };
}
function Rh(t, n, e) {
  t ? Ge(e, t, n) : n();
}
function Ah(t, n, e, i, r, o, s, a) {
  let l = [],
    c = 0,
    d = 0,
    f = !1,
    p = () => {
      f && !l.length && !c && n.complete();
    },
    h = (_) => (c < i ? m(_) : l.push(_)),
    m = (_) => {
      (o && n.next(_), c++);
      let w = !1;
      oe(e(_, d++)).subscribe(
        z(
          n,
          (v) => {
            (r?.(v), o ? h(v) : n.next(v));
          },
          () => {
            w = !0;
          },
          void 0,
          () => {
            if (w)
              try {
                for (c--; l.length && c < i; ) {
                  let v = l.shift();
                  s ? Ge(n, s, () => m(v)) : m(v);
                }
                p();
              } catch (v) {
                n.error(v);
              }
          },
        ),
      );
    };
  return (
    t.subscribe(
      z(n, h, () => {
        ((f = !0), p());
      }),
    ),
    () => {
      a?.();
    }
  );
}
function Bl(t, n, e = 1 / 0) {
  return P(n)
    ? Bl((i, r) => ue((o, s) => n(i, o, r, s))(oe(t(i, r))), e)
    : (typeof n == 'number' && (e = n), q((i, r) => Ah(i, r, t, e)));
}
function fs(t = 1 / 0) {
  return Bl(Vt, t);
}
function Nh() {
  return fs(1);
}
function xi(...t) {
  return Nh()(Qe(t, wt(t)));
}
function Hl(t) {
  return new L((n) => {
    oe(t()).subscribe(n);
  });
}
function Ul(...t) {
  let n = Zo(t),
    { args: e, keys: i } = ds(t),
    r = new L((o) => {
      let { length: s } = e;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        l = s,
        c = s;
      for (let d = 0; d < s; d++) {
        let f = !1;
        oe(e[d]).subscribe(
          z(
            o,
            (p) => {
              (f || ((f = !0), c--), (a[d] = p));
            },
            () => l--,
            void 0,
            () => {
              (!l || !f) && (c || o.next(i ? us(i, a) : a), o.complete());
            },
          ),
        );
      }
    });
  return n ? r.pipe(cs(n)) : r;
}
function Oh(t = 0, n, e = gh) {
  let i = -1;
  return (
    n != null && (Yo(n) ? (e = n) : (i = n)),
    new L((r) => {
      let o = Th(t) ? +t - e.now() : t;
      o < 0 && (o = 0);
      let s = 0;
      return e.schedule(function () {
        r.closed || (r.next(s++), 0 <= i ? this.schedule(void 0, i) : r.complete());
      }, o);
    })
  );
}
function It(...t) {
  let n = wt(t),
    e = _h(t, 1 / 0),
    i = t;
  return i.length ? (i.length === 1 ? oe(i[0]) : fs(e)(Qe(i, n))) : Vn;
}
function Pe(t, n) {
  return q((e, i) => {
    let r = 0;
    e.subscribe(z(i, (o) => t.call(n, o, r++) && i.next(o)));
  });
}
function kh(t) {
  return q((n, e) => {
    let i = !1,
      r = null,
      o = null,
      s = !1,
      a = () => {
        if ((o?.unsubscribe(), (o = null), i)) {
          i = !1;
          let c = r;
          ((r = null), e.next(c));
        }
        s && e.complete();
      },
      l = () => {
        ((o = null), s && e.complete());
      };
    n.subscribe(
      z(
        e,
        (c) => {
          ((i = !0), (r = c), o || oe(t(c)).subscribe((o = z(e, a, l))));
        },
        () => {
          ((s = !0), (!i || !o || o.closed) && e.complete());
        },
      ),
    );
  });
}
function hs(t, n = vr) {
  return kh(() => Oh(t, n));
}
function br(t, n = vr) {
  return q((e, i) => {
    let r = null,
      o = null,
      s = null,
      a = () => {
        if (r) {
          (r.unsubscribe(), (r = null));
          let c = o;
          ((o = null), i.next(c));
        }
      };
    function l() {
      let c = s + t,
        d = n.now();
      if (d < c) {
        ((r = this.schedule(void 0, c - d)), i.add(r));
        return;
      }
      a();
    }
    e.subscribe(
      z(
        i,
        (c) => {
          ((o = c), (s = n.now()), r || ((r = n.schedule(l, t)), i.add(r)));
        },
        () => {
          (a(), i.complete());
        },
        void 0,
        () => {
          o = r = null;
        },
      ),
    );
  });
}
function Dr(t) {
  return t <= 0
    ? () => Vn
    : q((n, e) => {
        let i = 0;
        n.subscribe(
          z(e, (r) => {
            ++i <= t && (e.next(r), t <= i && e.complete());
          }),
        );
      });
}
function ps() {
  return q((t, n) => {
    let e,
      i = !1;
    t.subscribe(
      z(n, (r) => {
        let o = e;
        ((e = r), i && n.next([o, r]), (i = !0));
      }),
    );
  });
}
function Fh(t = {}) {
  let {
    connector: n = () => new D(),
    resetOnError: e = !0,
    resetOnComplete: i = !0,
    resetOnRefCountZero: r = !0,
  } = t;
  return (o) => {
    let s,
      a,
      l,
      c = 0,
      d = !1,
      f = !1,
      p = () => {
        (a?.unsubscribe(), (a = void 0));
      },
      h = () => {
        (p(), (s = l = void 0), (d = f = !1));
      },
      m = () => {
        let _ = s;
        (h(), _?.unsubscribe());
      };
    return q((_, w) => {
      (c++, !f && !d && p());
      let v = (l = l ?? n());
      (w.add(() => {
        (c--, c === 0 && !f && !d && (a = zl(m, r)));
      }),
        v.subscribe(w),
        !s &&
          c > 0 &&
          ((s = new Lt({
            next: (Re) => v.next(Re),
            error: (Re) => {
              ((f = !0), p(), (a = zl(h, e, Re)), v.error(Re));
            },
            complete: () => {
              ((d = !0), p(), (a = zl(h, i)), v.complete());
            },
          })),
          oe(_).subscribe(s)));
    })(o);
  };
}
function zl(t, n, ...e) {
  if (n === !0) {
    t();
    return;
  }
  if (n === !1) return;
  let i = new Lt({
    next: () => {
      (i.unsubscribe(), t());
    },
  });
  return oe(n(...e)).subscribe(i);
}
function ms(t, n, e) {
  let i,
    r = !1;
  return (
    t && typeof t == 'object'
      ? ({ bufferSize: i = 1 / 0, windowTime: n = 1 / 0, refCount: r = !1, scheduler: e } = t)
      : (i = t ?? 1 / 0),
    Fh({
      connector: () => new $o(i, n, e),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: r,
    })
  );
}
function $l(t) {
  return Pe((n, e) => t <= e);
}
function Bt(...t) {
  let n = wt(t);
  return q((e, i) => {
    (n ? xi(t, e, n) : xi(t, e)).subscribe(i);
  });
}
function Cr(t, n) {
  return q((e, i) => {
    let r = null,
      o = 0,
      s = !1,
      a = () => s && !r && i.complete();
    e.subscribe(
      z(
        i,
        (l) => {
          r?.unsubscribe();
          let c = 0,
            d = o++;
          oe(t(l, d)).subscribe(
            (r = z(
              i,
              (f) => i.next(n ? n(l, f, d, c++) : f),
              () => {
                ((r = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function xe(t) {
  return q((n, e) => {
    (oe(t).subscribe(z(e, () => e.complete(), mr)), !e.closed && n.subscribe(e));
  });
}
function Gl(t, n = !1) {
  return q((e, i) => {
    let r = 0;
    e.subscribe(
      z(i, (o) => {
        let s = t(o, r++);
        ((s || n) && i.next(o), !s && i.complete());
      }),
    );
  });
}
function Wl(t, n, e) {
  let i = P(t) || n || e ? { next: t, error: n, complete: e } : t;
  return i
    ? q((r, o) => {
        var s;
        (s = i.subscribe) === null || s === void 0 || s.call(i);
        let a = !0;
        r.subscribe(
          z(
            o,
            (l) => {
              var c;
              ((c = i.next) === null || c === void 0 || c.call(i, l), o.next(l));
            },
            () => {
              var l;
              ((a = !1), (l = i.complete) === null || l === void 0 || l.call(i), o.complete());
            },
            (l) => {
              var c;
              ((a = !1), (c = i.error) === null || c === void 0 || c.call(i, l), o.error(l));
            },
            () => {
              var l, c;
              (a && ((l = i.unsubscribe) === null || l === void 0 || l.call(i)),
                (c = i.finalize) === null || c === void 0 || c.call(i));
            },
          ),
        );
      })
    : Vt;
}
function Ph(t) {
  let n = T(null);
  try {
    return t();
  } finally {
    T(n);
  }
}
var Lh = Q(x({}, Nn), {
  consumerIsAlwaysLive: !0,
  consumerAllowSignalWrites: !0,
  dirty: !0,
  kind: 'effect',
});
function Vh(t) {
  if (((t.dirty = !1), t.version > 0 && !kn(t))) return;
  t.version++;
  let n = nn(t);
  try {
    (t.cleanup(), t.fn());
  } finally {
    On(t, n);
  }
}
var ic = 'https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss',
  A = class extends Error {
    code;
    constructor(n, e) {
      (super(vs(n, e)), (this.code = n));
    }
  };
function yb(t) {
  return `NG0${Math.abs(t)}`;
}
function vs(t, n) {
  return `${yb(t)}${n ? ': ' + n : ''}`;
}
function te(t) {
  for (let n in t) if (t[n] === te) return n;
  throw Error('');
}
function Hh(t, n) {
  for (let e in n) n.hasOwnProperty(e) && !t.hasOwnProperty(e) && (t[e] = n[e]);
}
function on(t) {
  if (typeof t == 'string') return t;
  if (Array.isArray(t)) return `[${t.map(on).join(', ')}]`;
  if (t == null) return '' + t;
  let n = t.overriddenName || t.name;
  if (n) return `${n}`;
  let e = t.toString();
  if (e == null) return '' + e;
  let i = e.indexOf(`
`);
  return i >= 0 ? e.slice(0, i) : e;
}
function bs(t, n) {
  return t ? (n ? `${t} ${n}` : t) : n || '';
}
var vb = te({ __forward_ref__: te });
function ln(t) {
  return (
    (t.__forward_ref__ = ln),
    (t.toString = function () {
      return on(this());
    }),
    t
  );
}
function Ae(t) {
  return rc(t) ? t() : t;
}
function rc(t) {
  return typeof t == 'function' && t.hasOwnProperty(vb) && t.__forward_ref__ === ln;
}
function y(t) {
  return { token: t.token, providedIn: t.providedIn || null, factory: t.factory, value: void 0 };
}
function V(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function Ds(t) {
  return bb(t, Cs);
}
function bb(t, n) {
  return (t.hasOwnProperty(n) && t[n]) || null;
}
function Db(t) {
  let n = t?.[Cs] ?? null;
  return n || null;
}
function Yl(t) {
  return t && t.hasOwnProperty(_s) ? t[_s] : null;
}
var Cs = te({ ɵprov: te }),
  _s = te({ ɵinj: te }),
  g = class {
    _desc;
    ngMetadataName = 'InjectionToken';
    ɵprov;
    constructor(n, e) {
      ((this._desc = n),
        (this.ɵprov = void 0),
        typeof e == 'number'
          ? (this.__NG_ELEMENT_ID__ = e)
          : e !== void 0 &&
            (this.ɵprov = y({
              token: this,
              providedIn: e.providedIn || 'root',
              factory: e.factory,
            })));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function oc(t) {
  return t && !!t.ɵproviders;
}
var sc = te({ ɵcmp: te }),
  ac = te({ ɵdir: te }),
  lc = te({ ɵpipe: te });
var wr = te({ ɵfac: te }),
  Gn = te({ __NG_ELEMENT_ID__: te }),
  jh = te({ __NG_ENV_ID__: te });
function Es(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t);
}
function Uh(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : Es(t);
}
var zh = te({ ngErrorCode: te }),
  Cb = te({ ngErrorMessage: te }),
  Eb = te({ ngTokenPath: te });
function cc(t, n) {
  return $h('', -200, n);
}
function ws(t, n) {
  throw new A(-201, !1);
}
function $h(t, n, e) {
  let i = new A(n, t);
  return ((i[zh] = n), (i[Cb] = t), e && (i[Eb] = e), i);
}
function wb(t) {
  return t[zh];
}
var Zl;
function Gh() {
  return Zl;
}
function Ue(t) {
  let n = Zl;
  return ((Zl = t), n);
}
function dc(t, n, e) {
  let i = Ds(t);
  if (i && i.providedIn == 'root') return i.value === void 0 ? (i.value = i.factory()) : i.value;
  if (e & 8) return null;
  if (n !== void 0) return n;
  ws(t, 'Injector');
}
var Ib = {},
  Hn = Ib,
  Sb = '__NG_DI_FLAG__',
  Kl = class {
    injector;
    constructor(n) {
      this.injector = n;
    }
    retrieve(n, e) {
      let i = Un(e) || 0;
      try {
        return this.injector.get(n, i & 8 ? null : Hn, i);
      } catch (r) {
        if (bi(r)) return r;
        throw r;
      }
    }
  };
function xb(t, n = 0) {
  let e = Mo();
  if (e === void 0) throw new A(-203, !1);
  if (e === null) return dc(t, void 0, n);
  {
    let i = Mb(n),
      r = e.retrieve(t, i);
    if (bi(r)) {
      if (i.optional) return null;
      throw r;
    }
    return r;
  }
}
function $(t, n = 0) {
  return (Gh() || xb)(Ae(t), n);
}
function u(t, n) {
  return $(t, Un(n));
}
function Un(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Mb(t) {
  return { optional: !!(t & 8), host: !!(t & 1), self: !!(t & 2), skipSelf: !!(t & 4) };
}
function Ql(t) {
  let n = [];
  for (let e = 0; e < t.length; e++) {
    let i = Ae(t[e]);
    if (Array.isArray(i)) {
      if (i.length === 0) throw new A(900, !1);
      let r,
        o = 0;
      for (let s = 0; s < i.length; s++) {
        let a = i[s],
          l = Tb(a);
        typeof l == 'number' ? (l === -1 ? (r = a.token) : (o |= l)) : (r = a);
      }
      n.push($(r, o));
    } else n.push($(i));
  }
  return n;
}
function Tb(t) {
  return t[Sb];
}
function sn(t, n) {
  let e = t.hasOwnProperty(wr);
  return e ? t[wr] : null;
}
function Wh(t, n, e) {
  if (t.length !== n.length) return !1;
  for (let i = 0; i < t.length; i++) {
    let r = t[i],
      o = n[i];
    if ((e && ((r = e(r)), (o = e(o))), o !== r)) return !1;
  }
  return !0;
}
function qh(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function Is(t, n) {
  t.forEach((e) => (Array.isArray(e) ? Is(e, n) : n(e)));
}
function uc(t, n, e) {
  n >= t.length ? t.push(e) : t.splice(n, 0, e);
}
function xr(t, n) {
  return n >= t.length - 1 ? t.pop() : t.splice(n, 1)[0];
}
function Yh(t, n) {
  let e = [];
  for (let i = 0; i < t; i++) e.push(n);
  return e;
}
function Zh(t, n, e, i) {
  let r = t.length;
  if (r == n) t.push(e, i);
  else if (r === 1) (t.push(i, t[0]), (t[0] = e));
  else {
    for (r--, t.push(t[r - 1], t[r]); r > n; ) {
      let o = r - 2;
      ((t[r] = t[o]), r--);
    }
    ((t[n] = e), (t[n + 1] = i));
  }
}
function Ss(t, n, e) {
  let i = Ti(t, n);
  return (i >= 0 ? (t[i | 1] = e) : ((i = ~i), Zh(t, i, n, e)), i);
}
function xs(t, n) {
  let e = Ti(t, n);
  if (e >= 0) return t[e | 1];
}
function Ti(t, n) {
  return Rb(t, n, 1);
}
function Rb(t, n, e) {
  let i = 0,
    r = t.length >> e;
  for (; r !== i; ) {
    let o = i + ((r - i) >> 1),
      s = t[o << e];
    if (n === s) return o << e;
    s > n ? (r = o) : (i = o + 1);
  }
  return ~(r << e);
}
var cn = {},
  Le = [],
  dn = new g(''),
  fc = new g('', -1),
  hc = new g(''),
  Ir = class {
    get(n, e = Hn) {
      if (e === Hn) {
        let r = $h('', -201);
        throw ((r.name = '\u0275NotFound'), r);
      }
      return e;
    }
  };
function un(t) {
  return t[sc] || null;
}
function pc(t) {
  return t[ac] || null;
}
function Kh(t) {
  return t[lc] || null;
}
function Mr(t) {
  return { ɵproviders: t };
}
function Qh(t) {
  return Mr([{ provide: dn, multi: !0, useValue: t }]);
}
function Xh(...t) {
  return { ɵproviders: mc(!0, t), ɵfromNgModule: !0 };
}
function mc(t, ...n) {
  let e = [],
    i = new Set(),
    r,
    o = (s) => {
      e.push(s);
    };
  return (
    Is(n, (s) => {
      let a = s;
      ys(a, o, [], i) && ((r ||= []), r.push(a));
    }),
    r !== void 0 && Jh(r, o),
    e
  );
}
function Jh(t, n) {
  for (let e = 0; e < t.length; e++) {
    let { ngModule: i, providers: r } = t[e];
    gc(r, (o) => {
      n(o, i);
    });
  }
}
function ys(t, n, e, i) {
  if (((t = Ae(t)), !t)) return !1;
  let r = null,
    o = Yl(t),
    s = !o && un(t);
  if (!o && !s) {
    let l = t.ngModule;
    if (((o = Yl(l)), o)) r = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    r = t;
  }
  let a = i.has(r);
  if (s) {
    if (a) return !1;
    if ((i.add(r), s.dependencies)) {
      let l = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let c of l) ys(c, n, e, i);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      i.add(r);
      let c;
      try {
        Is(o.imports, (d) => {
          ys(d, n, e, i) && ((c ||= []), c.push(d));
        });
      } finally {
      }
      c !== void 0 && Jh(c, n);
    }
    if (!a) {
      let c = sn(r) || (() => new r());
      (n({ provide: r, useFactory: c, deps: Le }, r),
        n({ provide: hc, useValue: r, multi: !0 }, r),
        n({ provide: dn, useValue: () => $(r), multi: !0 }, r));
    }
    let l = o.providers;
    if (l != null && !a) {
      let c = t;
      gc(l, (d) => {
        n(d, c);
      });
    }
  } else return !1;
  return r !== t && t.providers !== void 0;
}
function gc(t, n) {
  for (let e of t) (oc(e) && (e = e.ɵproviders), Array.isArray(e) ? gc(e, n) : n(e));
}
var Ab = te({ provide: String, useValue: te });
function ep(t) {
  return t !== null && typeof t == 'object' && Ab in t;
}
function Nb(t) {
  return !!(t && t.useExisting);
}
function Ob(t) {
  return !!(t && t.useFactory);
}
function zn(t) {
  return typeof t == 'function';
}
function tp(t) {
  return !!t.useClass;
}
var Tr = new g(''),
  gs = {},
  Bh = {},
  ql;
function Ri() {
  return (ql === void 0 && (ql = new Ir()), ql);
}
var Me = class {},
  $n = class extends Me {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(n, e, i, r) {
      (super(),
        (this.parent = e),
        (this.source = i),
        (this.scopes = r),
        Jl(n, (s) => this.processProvider(s)),
        this.records.set(fc, Mi(void 0, this)),
        r.has('environment') && this.records.set(Me, Mi(void 0, this)));
      let o = this.records.get(Tr);
      (o != null && typeof o.value == 'string' && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(hc, Le, { self: !0 }))));
    }
    retrieve(n, e) {
      let i = Un(e) || 0;
      try {
        return this.get(n, Hn, i);
      } catch (r) {
        if (bi(r)) return r;
        throw r;
      }
    }
    destroy() {
      (Er(this), (this._destroyed = !0));
      let n = T(null);
      try {
        for (let i of this._ngOnDestroyHooks) i.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let i of e) i();
      } finally {
        (this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), T(n));
      }
    }
    onDestroy(n) {
      return (Er(this), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n));
    }
    runInContext(n) {
      Er(this);
      let e = Et(this),
        i = Ue(void 0),
        r;
      try {
        return n();
      } finally {
        (Et(e), Ue(i));
      }
    }
    get(n, e = Hn, i) {
      if ((Er(this), n.hasOwnProperty(jh))) return n[jh](this);
      let r = Un(i),
        o,
        s = Et(this),
        a = Ue(void 0);
      try {
        if (!(r & 4)) {
          let c = this.records.get(n);
          if (c === void 0) {
            let d = Vb(n) && Ds(n);
            (d && this.injectableDefInScope(d) ? (c = Mi(Xl(n), gs)) : (c = null),
              this.records.set(n, c));
          }
          if (c != null) return this.hydrate(n, c, r);
        }
        let l = r & 2 ? Ri() : this.parent;
        return ((e = r & 8 && e === Hn ? null : e), l.get(n, e));
      } catch (l) {
        let c = wb(l);
        throw c === -200 || c === -201 ? new A(c, null) : l;
      } finally {
        (Ue(a), Et(s));
      }
    }
    resolveInjectorInitializers() {
      let n = T(null),
        e = Et(this),
        i = Ue(void 0),
        r;
      try {
        let o = this.get(dn, Le, { self: !0 });
        for (let s of o) s();
      } finally {
        (Et(e), Ue(i), T(n));
      }
    }
    toString() {
      let n = [],
        e = this.records;
      for (let i of e.keys()) n.push(on(i));
      return `R3Injector[${n.join(', ')}]`;
    }
    processProvider(n) {
      n = Ae(n);
      let e = zn(n) ? n : Ae(n && n.provide),
        i = Fb(n);
      if (!zn(n) && n.multi === !0) {
        let r = this.records.get(e);
        (r || ((r = Mi(void 0, gs, !0)), (r.factory = () => Ql(r.multi)), this.records.set(e, r)),
          (e = n),
          r.multi.push(n));
      }
      this.records.set(e, i);
    }
    hydrate(n, e, i) {
      let r = T(null);
      try {
        if (e.value === Bh) throw cc(on(n));
        return (
          e.value === gs && ((e.value = Bh), (e.value = e.factory(void 0, i))),
          typeof e.value == 'object' &&
            e.value &&
            Lb(e.value) &&
            this._ngOnDestroyHooks.add(e.value),
          e.value
        );
      } finally {
        T(r);
      }
    }
    injectableDefInScope(n) {
      if (!n.providedIn) return !1;
      let e = Ae(n.providedIn);
      return typeof e == 'string'
        ? e === 'any' || this.scopes.has(e)
        : this.injectorDefTypes.has(e);
    }
    removeOnDestroy(n) {
      let e = this._onDestroyHooks.indexOf(n);
      e !== -1 && this._onDestroyHooks.splice(e, 1);
    }
  };
function Xl(t) {
  let n = Ds(t),
    e = n !== null ? n.factory : sn(t);
  if (e !== null) return e;
  if (t instanceof g) throw new A(204, !1);
  if (t instanceof Function) return kb(t);
  throw new A(204, !1);
}
function kb(t) {
  if (t.length > 0) throw new A(204, !1);
  let e = Db(t);
  return e !== null ? () => e.factory(t) : () => new t();
}
function Fb(t) {
  if (ep(t)) return Mi(void 0, t.useValue);
  {
    let n = _c(t);
    return Mi(n, gs);
  }
}
function _c(t, n, e) {
  let i;
  if (zn(t)) {
    let r = Ae(t);
    return sn(r) || Xl(r);
  } else if (ep(t)) i = () => Ae(t.useValue);
  else if (Ob(t)) i = () => t.useFactory(...Ql(t.deps || []));
  else if (Nb(t)) i = (r, o) => $(Ae(t.useExisting), o !== void 0 && o & 8 ? 8 : void 0);
  else {
    let r = Ae(t && (t.useClass || t.provide));
    if (Pb(t)) i = () => new r(...Ql(t.deps));
    else return sn(r) || Xl(r);
  }
  return i;
}
function Er(t) {
  if (t.destroyed) throw new A(205, !1);
}
function Mi(t, n, e = !1) {
  return { factory: t, value: n, multi: e ? [] : void 0 };
}
function Pb(t) {
  return !!t.deps;
}
function Lb(t) {
  return t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function';
}
function Vb(t) {
  return typeof t == 'function' || (typeof t == 'object' && t.ngMetadataName === 'InjectionToken');
}
function Jl(t, n) {
  for (let e of t) Array.isArray(e) ? Jl(e, n) : e && oc(e) ? Jl(e.ɵproviders, n) : n(e);
}
function Ms(t, n) {
  let e;
  t instanceof $n ? (Er(t), (e = t)) : (e = new Kl(t));
  let i,
    r = Et(e),
    o = Ue(void 0);
  try {
    return n();
  } finally {
    (Et(r), Ue(o));
  }
}
function np() {
  return Gh() !== void 0 || Mo() != null;
}
var ft = 0,
  C = 1,
  M = 2,
  Ee = 3,
  et = 4,
  ze = 5,
  Wn = 6,
  Ai = 7,
  ve = 8,
  Ut = 9,
  zt = 10,
  se = 11,
  Ni = 12,
  yc = 13,
  qn = 14,
  $e = 15,
  fn = 16,
  Yn = 17,
  St = 18,
  Rr = 19,
  vc = 20,
  Ht = 21,
  Ts = 22,
  $t = 23,
  Ye = 24,
  Zn = 25,
  Kn = 26,
  le = 27,
  ip = 1,
  bc = 6,
  hn = 7,
  Ar = 8,
  Qn = 9,
  he = 10;
function xt(t) {
  return Array.isArray(t) && typeof t[ip] == 'object';
}
function ht(t) {
  return Array.isArray(t) && t[ip] === !0;
}
function Dc(t) {
  return (t.flags & 4) !== 0;
}
function pn(t) {
  return t.componentOffset > -1;
}
function Oi(t) {
  return (t.flags & 1) === 1;
}
function Mt(t) {
  return !!t.template;
}
function ki(t) {
  return (t[M] & 512) !== 0;
}
function Xn(t) {
  return (t[M] & 256) === 256;
}
var Cc = 'svg',
  rp = 'math';
function tt(t) {
  for (; Array.isArray(t); ) t = t[ft];
  return t;
}
function Ec(t, n) {
  return tt(n[t]);
}
function pt(t, n) {
  return tt(n[t.index]);
}
function Nr(t, n) {
  return t.data[n];
}
function wc(t, n) {
  return t[n];
}
function Ic(t, n, e, i) {
  (e >= t.data.length && ((t.data[e] = null), (t.blueprint[e] = null)), (n[e] = i));
}
function nt(t, n) {
  let e = n[t];
  return xt(e) ? e : e[ft];
}
function op(t) {
  return (t[M] & 4) === 4;
}
function Rs(t) {
  return (t[M] & 128) === 128;
}
function sp(t) {
  return ht(t[Ee]);
}
function it(t, n) {
  return n == null ? null : t[n];
}
function Sc(t) {
  t[Yn] = 0;
}
function xc(t) {
  t[M] & 1024 || ((t[M] |= 1024), Rs(t) && mn(t));
}
function ap(t, n) {
  for (; t > 0; ) ((n = n[qn]), t--);
  return n;
}
function Or(t) {
  return !!(t[M] & 9216 || t[Ye]?.dirty);
}
function As(t) {
  (t[zt].changeDetectionScheduler?.notify(8), t[M] & 64 && (t[M] |= 1024), Or(t) && mn(t));
}
function mn(t) {
  t[zt].changeDetectionScheduler?.notify(0);
  let n = an(t);
  for (; n !== null && !(n[M] & 8192 || ((n[M] |= 8192), !Rs(n))); ) n = an(n);
}
function Mc(t, n) {
  if (Xn(t)) throw new A(911, !1);
  (t[Ht] === null && (t[Ht] = []), t[Ht].push(n));
}
function lp(t, n) {
  if (t[Ht] === null) return;
  let e = t[Ht].indexOf(n);
  e !== -1 && t[Ht].splice(e, 1);
}
function an(t) {
  let n = t[Ee];
  return ht(n) ? n[Ee] : n;
}
function Tc(t) {
  return (t[Ai] ??= []);
}
function Rc(t) {
  return (t.cleanup ??= []);
}
function cp(t, n, e, i) {
  let r = Tc(n);
  (r.push(e), t.firstCreatePass && Rc(t).push(i, r.length - 1));
}
var k = { lFrame: Dp(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var ec = !1;
function dp() {
  return k.lFrame.elementDepthCount;
}
function up() {
  k.lFrame.elementDepthCount++;
}
function Ac() {
  k.lFrame.elementDepthCount--;
}
function Ns() {
  return k.bindingsEnabled;
}
function Nc() {
  return k.skipHydrationRootTNode !== null;
}
function Oc(t) {
  return k.skipHydrationRootTNode === t;
}
function kc() {
  k.skipHydrationRootTNode = null;
}
function N() {
  return k.lFrame.lView;
}
function pe() {
  return k.lFrame.tView;
}
function rt(t) {
  return ((k.lFrame.contextLView = t), t[ve]);
}
function ot(t) {
  return ((k.lFrame.contextLView = null), t);
}
function Te() {
  let t = Fc();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function Fc() {
  return k.lFrame.currentTNode;
}
function fp() {
  let t = k.lFrame,
    n = t.currentTNode;
  return t.isParent ? n : n.parent;
}
function Fi(t, n) {
  let e = k.lFrame;
  ((e.currentTNode = t), (e.isParent = n));
}
function Pc() {
  return k.lFrame.isParent;
}
function Lc() {
  k.lFrame.isParent = !1;
}
function hp() {
  return k.lFrame.contextLView;
}
function Vc() {
  return ec;
}
function Pi(t) {
  let n = ec;
  return ((ec = t), n);
}
function pp() {
  let t = k.lFrame,
    n = t.bindingRootIndex;
  return (n === -1 && (n = t.bindingRootIndex = t.tView.bindingStartIndex), n);
}
function mp(t) {
  return (k.lFrame.bindingIndex = t);
}
function Jn() {
  return k.lFrame.bindingIndex++;
}
function jc(t) {
  let n = k.lFrame,
    e = n.bindingIndex;
  return ((n.bindingIndex = n.bindingIndex + t), e);
}
function gp() {
  return k.lFrame.inI18n;
}
function _p(t, n) {
  let e = k.lFrame;
  ((e.bindingIndex = e.bindingRootIndex = t), Os(n));
}
function yp() {
  return k.lFrame.currentDirectiveIndex;
}
function Os(t) {
  k.lFrame.currentDirectiveIndex = t;
}
function vp(t) {
  let n = k.lFrame.currentDirectiveIndex;
  return n === -1 ? null : t[n];
}
function ks() {
  return k.lFrame.currentQueryIndex;
}
function kr(t) {
  k.lFrame.currentQueryIndex = t;
}
function jb(t) {
  let n = t[C];
  return n.type === 2 ? n.declTNode : n.type === 1 ? t[ze] : null;
}
function Bc(t, n, e) {
  if (e & 4) {
    let r = n,
      o = t;
    for (; (r = r.parent), r === null && !(e & 1); )
      if (((r = jb(o)), r === null || ((o = o[qn]), r.type & 10))) break;
    if (r === null) return !1;
    ((n = r), (t = o));
  }
  let i = (k.lFrame = bp());
  return ((i.currentTNode = n), (i.lView = t), !0);
}
function Fs(t) {
  let n = bp(),
    e = t[C];
  ((k.lFrame = n),
    (n.currentTNode = e.firstChild),
    (n.lView = t),
    (n.tView = e),
    (n.contextLView = t),
    (n.bindingIndex = e.bindingStartIndex),
    (n.inI18n = !1));
}
function bp() {
  let t = k.lFrame,
    n = t === null ? null : t.child;
  return n === null ? Dp(t) : n;
}
function Dp(t) {
  let n = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return (t !== null && (t.child = n), n);
}
function Cp() {
  let t = k.lFrame;
  return ((k.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t);
}
var Hc = Cp;
function Ps() {
  let t = Cp();
  ((t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0));
}
function Ep(t) {
  return (k.lFrame.contextLView = ap(t, k.lFrame.contextLView))[ve];
}
function Gt() {
  return k.lFrame.selectedIndex;
}
function gn(t) {
  k.lFrame.selectedIndex = t;
}
function Ls() {
  let t = k.lFrame;
  return Nr(t.tView, t.selectedIndex);
}
function Vs() {
  k.lFrame.currentNamespace = Cc;
}
function wp() {
  return k.lFrame.currentNamespace;
}
var Ip = !0;
function js() {
  return Ip;
}
function Fr(t) {
  Ip = t;
}
function tc(t, n = null, e = null, i) {
  let r = Sp(t, n, e, i);
  return (r.resolveInjectorInitializers(), r);
}
function Sp(t, n = null, e = null, i, r = new Set()) {
  let o = [e || Le, Xh(t)];
  return ((i = i || (typeof t == 'object' ? void 0 : on(t))), new $n(o, n || Ri(), i || null, r));
}
var Y = class t {
    static THROW_IF_NOT_FOUND = Hn;
    static NULL = new Ir();
    static create(n, e) {
      if (Array.isArray(n)) return tc({ name: '' }, e, n, '');
      {
        let i = n.name ?? '';
        return tc({ name: i }, n.parent, n.providers, i);
      }
    }
    static ɵprov = y({ token: t, providedIn: 'any', factory: () => $(fc) });
    static __NG_ELEMENT_ID__ = -1;
  },
  Z = new g(''),
  mt = (() => {
    class t {
      static __NG_ELEMENT_ID__ = Bb;
      static __NG_ENV_ID__ = (e) => e;
    }
    return t;
  })(),
  Sr = class extends mt {
    _lView;
    constructor(n) {
      (super(), (this._lView = n));
    }
    get destroyed() {
      return Xn(this._lView);
    }
    onDestroy(n) {
      let e = this._lView;
      return (Mc(e, n), () => lp(e, n));
    }
  };
function Bb() {
  return new Sr(N());
}
var Xe = class {
    _console = console;
    handleError(n) {
      this._console.error('ERROR', n);
    }
  },
  Wt = new g('', {
    providedIn: 'root',
    factory: () => {
      let t = u(Me),
        n;
      return (e) => {
        t.destroyed && !n
          ? setTimeout(() => {
              throw e;
            })
          : ((n ??= t.get(Xe)), n.handleError(e));
      };
    },
  }),
  xp = { provide: dn, useValue: () => void u(Xe), multi: !0 },
  Hb = new g('', {
    providedIn: 'root',
    factory: () => {
      let t = u(Z).defaultView;
      if (!t) return;
      let n = u(Wt),
        e = (o) => {
          (n(o.reason), o.preventDefault());
        },
        i = (o) => {
          (o.error ? n(o.error) : n(new Error(o.message, { cause: o })), o.preventDefault());
        },
        r = () => {
          (t.addEventListener('unhandledrejection', e), t.addEventListener('error', i));
        };
      (typeof Zone < 'u' ? Zone.root.run(r) : r(),
        u(mt).onDestroy(() => {
          (t.removeEventListener('error', i), t.removeEventListener('unhandledrejection', e));
        }));
    },
  });
function Uc() {
  return Mr([Qh(() => void u(Hb))]);
}
function qt(t) {
  return typeof t == 'function' && t[Se] !== void 0;
}
function ae(t, n) {
  let [e, i, r] = Rl(t, n?.equal),
    o = e,
    s = o[Se];
  return ((o.set = i), (o.update = r), (o.asReadonly = zc.bind(o)), o);
}
function zc() {
  let t = this[Se];
  if (t.readonlyFn === void 0) {
    let n = () => this();
    ((n[Se] = t), (t.readonlyFn = n));
  }
  return t.readonlyFn;
}
var ei = (() => {
  class t {
    view;
    node;
    constructor(e, i) {
      ((this.view = e), (this.node = i));
    }
    static __NG_ELEMENT_ID__ = Ub;
  }
  return t;
})();
function Ub() {
  return new ei(N(), Te());
}
var Je = class {},
  Pr = new g('', { providedIn: 'root', factory: () => !1 });
var $c = new g(''),
  Bs = new g(''),
  ti = (() => {
    class t {
      taskId = 0;
      pendingTasks = new Set();
      destroyed = !1;
      pendingTask = new ut(!1);
      get hasPendingTasks() {
        return this.destroyed ? !1 : this.pendingTask.value;
      }
      get hasPendingTasksObservable() {
        return this.destroyed
          ? new L((e) => {
              (e.next(!1), e.complete());
            })
          : this.pendingTask;
      }
      add() {
        !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
        let e = this.taskId++;
        return (this.pendingTasks.add(e), e);
      }
      has(e) {
        return this.pendingTasks.has(e);
      }
      remove(e) {
        (this.pendingTasks.delete(e),
          this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1));
      }
      ngOnDestroy() {
        (this.pendingTasks.clear(),
          this.hasPendingTasks && this.pendingTask.next(!1),
          (this.destroyed = !0),
          this.pendingTask.unsubscribe());
      }
      static ɵprov = y({ token: t, providedIn: 'root', factory: () => new t() });
    }
    return t;
  })();
function ni(...t) {}
var Lr = (() => {
    class t {
      static ɵprov = y({ token: t, providedIn: 'root', factory: () => new nc() });
    }
    return t;
  })(),
  nc = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(n) {
      (this.enqueue(n), this.schedule(n));
    }
    schedule(n) {
      n.dirty && this.dirtyEffectCount++;
    }
    remove(n) {
      let e = n.zone,
        i = this.queues.get(e);
      i.has(n) && (i.delete(n), n.dirty && this.dirtyEffectCount--);
    }
    enqueue(n) {
      let e = n.zone;
      this.queues.has(e) || this.queues.set(e, new Set());
      let i = this.queues.get(e);
      i.has(n) || i.add(n);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let n = !1;
        for (let [e, i] of this.queues)
          e === null ? (n ||= this.flushQueue(i)) : (n ||= e.run(() => this.flushQueue(i)));
        n || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(n) {
      let e = !1;
      for (let i of n) i.dirty && (this.dirtyEffectCount--, (e = !0), i.run());
      return e;
    }
  };
function Yr(t) {
  return { toString: t }.toString();
}
function Qb(t) {
  return typeof t == 'function';
}
var Ws = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(n, e, i) {
    ((this.previousValue = n), (this.currentValue = e), (this.firstChange = i));
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function im(t, n, e, i) {
  n !== null ? n.applyValueToInputSignal(n, i) : (t[e] = i);
}
var Ne = (() => {
  let t = () => rm;
  return ((t.ngInherit = !0), t);
})();
function rm(t) {
  return (t.type.prototype.ngOnChanges && (t.setInput = Jb), Xb);
}
function Xb() {
  let t = sm(this),
    n = t?.current;
  if (n) {
    let e = t.previous;
    if (e === cn) t.previous = n;
    else for (let i in n) e[i] = n[i];
    ((t.current = null), this.ngOnChanges(n));
  }
}
function Jb(t, n, e, i, r) {
  let o = this.declaredInputs[i],
    s = sm(t) || eD(t, { previous: cn, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[o];
  ((a[o] = new Ws(c && c.currentValue, e, l === cn)), im(t, n, r, e));
}
var om = '__ngSimpleChanges__';
function sm(t) {
  return t[om] || null;
}
function eD(t, n) {
  return (t[om] = n);
}
var Mp = [];
var ee = function (t, n = null, e) {
  for (let i = 0; i < Mp.length; i++) {
    let r = Mp[i];
    r(t, n, e);
  }
};
function tD(t, n, e) {
  let { ngOnChanges: i, ngOnInit: r, ngDoCheck: o } = n.type.prototype;
  if (i) {
    let s = rm(n);
    ((e.preOrderHooks ??= []).push(t, s), (e.preOrderCheckHooks ??= []).push(t, s));
  }
  (r && (e.preOrderHooks ??= []).push(0 - t, r),
    o && ((e.preOrderHooks ??= []).push(t, o), (e.preOrderCheckHooks ??= []).push(t, o)));
}
function am(t, n) {
  for (let e = n.directiveStart, i = n.directiveEnd; e < i; e++) {
    let o = t.data[e].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: d,
      } = o;
    (s && (t.contentHooks ??= []).push(-e, s),
      a && ((t.contentHooks ??= []).push(e, a), (t.contentCheckHooks ??= []).push(e, a)),
      l && (t.viewHooks ??= []).push(-e, l),
      c && ((t.viewHooks ??= []).push(e, c), (t.viewCheckHooks ??= []).push(e, c)),
      d != null && (t.destroyHooks ??= []).push(e, d));
  }
}
function Us(t, n, e) {
  lm(t, n, 3, e);
}
function zs(t, n, e, i) {
  (t[M] & 3) === e && lm(t, n, e, i);
}
function Gc(t, n) {
  let e = t[M];
  (e & 3) === n && ((e &= 16383), (e += 1), (t[M] = e));
}
function lm(t, n, e, i) {
  let r = i !== void 0 ? t[Yn] & 65535 : 0,
    o = i ?? -1,
    s = n.length - 1,
    a = 0;
  for (let l = r; l < s; l++)
    if (typeof n[l + 1] == 'number') {
      if (((a = n[l]), i != null && a >= i)) break;
    } else
      (n[l] < 0 && (t[Yn] += 65536),
        (a < o || o == -1) && (nD(t, e, n, l), (t[Yn] = (t[Yn] & 4294901760) + l + 2)),
        l++);
}
function Tp(t, n) {
  ee(4, t, n);
  let e = T(null);
  try {
    n.call(t);
  } finally {
    (T(e), ee(5, t, n));
  }
}
function nD(t, n, e, i) {
  let r = e[i] < 0,
    o = e[i + 1],
    s = r ? -e[i] : e[i],
    a = t[s];
  r ? t[M] >> 14 < t[Yn] >> 16 && (t[M] & 3) === n && ((t[M] += 16384), Tp(a, o)) : Tp(a, o);
}
var Vi = -1,
  ri = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(n, e, i, r) {
      ((this.factory = n), (this.name = r), (this.canSeeViewProviders = e), (this.injectImpl = i));
    }
  };
function iD(t) {
  return (t.flags & 8) !== 0;
}
function rD(t) {
  return (t.flags & 16) !== 0;
}
function oD(t, n, e) {
  let i = 0;
  for (; i < e.length; ) {
    let r = e[i];
    if (typeof r == 'number') {
      if (r !== 0) break;
      i++;
      let o = e[i++],
        s = e[i++],
        a = e[i++];
      t.setAttribute(n, s, a, o);
    } else {
      let o = r,
        s = e[++i];
      (sD(o) ? t.setProperty(n, o, s) : t.setAttribute(n, o, s), i++);
    }
  }
  return i;
}
function cm(t) {
  return t === 3 || t === 4 || t === 6;
}
function sD(t) {
  return t.charCodeAt(0) === 64;
}
function ji(t, n) {
  if (!(n === null || n.length === 0))
    if (t === null || t.length === 0) t = n.slice();
    else {
      let e = -1;
      for (let i = 0; i < n.length; i++) {
        let r = n[i];
        typeof r == 'number'
          ? (e = r)
          : e === 0 || (e === -1 || e === 2 ? Rp(t, e, r, null, n[++i]) : Rp(t, e, r, null, null));
      }
    }
  return t;
}
function Rp(t, n, e, i, r) {
  let o = 0,
    s = t.length;
  if (n === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == 'number') {
        if (a === n) {
          s = -1;
          break;
        } else if (a > n) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == 'number') break;
    if (a === e) {
      r !== null && (t[o + 1] = r);
      return;
    }
    (o++, r !== null && o++);
  }
  (s !== -1 && (t.splice(s, 0, n), (o = s + 1)),
    t.splice(o++, 0, e),
    r !== null && t.splice(o++, 0, r));
}
function dm(t) {
  return t !== Vi;
}
function qs(t) {
  return t & 32767;
}
function aD(t) {
  return t >> 16;
}
function Ys(t, n) {
  let e = aD(t),
    i = n;
  for (; e > 0; ) ((i = i[qn]), e--);
  return i;
}
var nd = !0;
function Zs(t) {
  let n = nd;
  return ((nd = t), n);
}
var lD = 256,
  um = lD - 1,
  fm = 5,
  cD = 0,
  Tt = {};
function dD(t, n, e) {
  let i;
  (typeof e == 'string' ? (i = e.charCodeAt(0) || 0) : e.hasOwnProperty(Gn) && (i = e[Gn]),
    i == null && (i = e[Gn] = cD++));
  let r = i & um,
    o = 1 << r;
  n.data[t + (r >> fm)] |= o;
}
function Ks(t, n) {
  let e = hm(t, n);
  if (e !== -1) return e;
  let i = n[C];
  i.firstCreatePass &&
    ((t.injectorIndex = n.length), Wc(i.data, t), Wc(n, null), Wc(i.blueprint, null));
  let r = kd(t, n),
    o = t.injectorIndex;
  if (dm(r)) {
    let s = qs(r),
      a = Ys(r, n),
      l = a[C].data;
    for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
  }
  return ((n[o + 8] = r), o);
}
function Wc(t, n) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, n);
}
function hm(t, n) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    n[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function kd(t, n) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let e = 0,
    i = null,
    r = n;
  for (; r !== null; ) {
    if (((i = ym(r)), i === null)) return Vi;
    if ((e++, (r = r[qn]), i.injectorIndex !== -1)) return i.injectorIndex | (e << 16);
  }
  return Vi;
}
function id(t, n, e) {
  dD(t, n, e);
}
function uD(t, n) {
  if (n === 'class') return t.classes;
  if (n === 'style') return t.styles;
  let e = t.attrs;
  if (e) {
    let i = e.length,
      r = 0;
    for (; r < i; ) {
      let o = e[r];
      if (cm(o)) break;
      if (o === 0) r = r + 2;
      else if (typeof o == 'number') for (r++; r < i && typeof e[r] == 'string'; ) r++;
      else {
        if (o === n) return e[r + 1];
        r = r + 2;
      }
    }
  }
  return null;
}
function pm(t, n, e) {
  if (e & 8 || t !== void 0) return t;
  ws(n, 'NodeInjector');
}
function mm(t, n, e, i) {
  if ((e & 8 && i === void 0 && (i = null), (e & 3) === 0)) {
    let r = t[Ut],
      o = Ue(void 0);
    try {
      return r ? r.get(n, i, e & 8) : dc(n, i, e & 8);
    } finally {
      Ue(o);
    }
  }
  return pm(i, n, e);
}
function gm(t, n, e, i = 0, r) {
  if (t !== null) {
    if (n[M] & 2048 && !(i & 2)) {
      let s = mD(t, n, e, i, Tt);
      if (s !== Tt) return s;
    }
    let o = _m(t, n, e, i, Tt);
    if (o !== Tt) return o;
  }
  return mm(n, e, i, r);
}
function _m(t, n, e, i, r) {
  let o = hD(e);
  if (typeof o == 'function') {
    if (!Bc(n, t, i)) return i & 1 ? pm(r, e, i) : mm(n, e, i, r);
    try {
      let s;
      if (((s = o(i)), s == null && !(i & 8))) ws(e);
      else return s;
    } finally {
      Hc();
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = hm(t, n),
      l = Vi,
      c = i & 1 ? n[$e][ze] : null;
    for (
      (a === -1 || i & 4) &&
      ((l = a === -1 ? kd(t, n) : n[a + 8]),
      l === Vi || !Np(i, !1) ? (a = -1) : ((s = n[C]), (a = qs(l)), (n = Ys(l, n))));
      a !== -1;

    ) {
      let d = n[C];
      if (Ap(o, a, d.data)) {
        let f = fD(a, n, e, s, i, c);
        if (f !== Tt) return f;
      }
      ((l = n[a + 8]),
        l !== Vi && Np(i, n[C].data[a + 8] === c) && Ap(o, a, n)
          ? ((s = d), (a = qs(l)), (n = Ys(l, n)))
          : (a = -1));
    }
  }
  return r;
}
function fD(t, n, e, i, r, o) {
  let s = n[C],
    a = s.data[t + 8],
    l = i == null ? pn(a) && nd : i != s && (a.type & 3) !== 0,
    c = r & 1 && o === a,
    d = $s(a, s, e, l, c);
  return d !== null ? Br(n, s, d, a, r) : Tt;
}
function $s(t, n, e, i, r) {
  let o = t.providerIndexes,
    s = n.data,
    a = o & 1048575,
    l = t.directiveStart,
    c = t.directiveEnd,
    d = o >> 20,
    f = i ? a : a + d,
    p = r ? a + d : c;
  for (let h = f; h < p; h++) {
    let m = s[h];
    if ((h < l && e === m) || (h >= l && m.type === e)) return h;
  }
  if (r) {
    let h = s[l];
    if (h && Mt(h) && h.type === e) return l;
  }
  return null;
}
function Br(t, n, e, i, r) {
  let o = t[e],
    s = n.data;
  if (o instanceof ri) {
    let a = o;
    if (a.resolving) {
      let h = Uh(s[e]);
      throw cc(h);
    }
    let l = Zs(a.canSeeViewProviders);
    a.resolving = !0;
    let c = s[e].type || s[e],
      d,
      f = a.injectImpl ? Ue(a.injectImpl) : null,
      p = Bc(t, i, 0);
    try {
      ((o = t[e] = a.factory(void 0, r, s, t, i)),
        n.firstCreatePass && e >= i.directiveStart && tD(e, s[e], n));
    } finally {
      (f !== null && Ue(f), Zs(l), (a.resolving = !1), Hc());
    }
  }
  return o;
}
function hD(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0;
  let n = t.hasOwnProperty(Gn) ? t[Gn] : void 0;
  return typeof n == 'number' ? (n >= 0 ? n & um : pD) : n;
}
function Ap(t, n, e) {
  let i = 1 << t;
  return !!(e[n + (t >> fm)] & i);
}
function Np(t, n) {
  return !(t & 2) && !(t & 1 && n);
}
var ii = class {
  _tNode;
  _lView;
  constructor(n, e) {
    ((this._tNode = n), (this._lView = e));
  }
  get(n, e, i) {
    return gm(this._tNode, this._lView, n, Un(i), e);
  }
};
function pD() {
  return new ii(Te(), N());
}
function Oe(t) {
  return Yr(() => {
    let n = t.prototype.constructor,
      e = n[wr] || rd(n),
      i = Object.prototype,
      r = Object.getPrototypeOf(t.prototype).constructor;
    for (; r && r !== i; ) {
      let o = r[wr] || rd(r);
      if (o && o !== e) return o;
      r = Object.getPrototypeOf(r);
    }
    return (o) => new o();
  });
}
function rd(t) {
  return rc(t)
    ? () => {
        let n = rd(Ae(t));
        return n && n();
      }
    : sn(t);
}
function mD(t, n, e, i, r) {
  let o = t,
    s = n;
  for (; o !== null && s !== null && s[M] & 2048 && !ki(s); ) {
    let a = _m(o, s, e, i | 2, Tt);
    if (a !== Tt) return a;
    let l = o.parent;
    if (!l) {
      let c = s[vc];
      if (c) {
        let d = c.get(e, Tt, i);
        if (d !== Tt) return d;
      }
      ((l = ym(s)), (s = s[qn]));
    }
    o = l;
  }
  return r;
}
function ym(t) {
  let n = t[C],
    e = n.type;
  return e === 2 ? n.declTNode : e === 1 ? t[ze] : null;
}
function Fd(t) {
  return uD(Te(), t);
}
function gD() {
  return Gi(Te(), N());
}
function Gi(t, n) {
  return new F(pt(t, n));
}
var F = (() => {
  class t {
    nativeElement;
    constructor(e) {
      this.nativeElement = e;
    }
    static __NG_ELEMENT_ID__ = gD;
  }
  return t;
})();
function vm(t) {
  return t instanceof F ? t.nativeElement : t;
}
function _D() {
  return this._results[Symbol.iterator]();
}
var oi = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new D());
  }
  constructor(n = !1) {
    this._emitDistinctChangesOnly = n;
  }
  get(n) {
    return this._results[n];
  }
  map(n) {
    return this._results.map(n);
  }
  filter(n) {
    return this._results.filter(n);
  }
  find(n) {
    return this._results.find(n);
  }
  reduce(n, e) {
    return this._results.reduce(n, e);
  }
  forEach(n) {
    this._results.forEach(n);
  }
  some(n) {
    return this._results.some(n);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(n, e) {
    this.dirty = !1;
    let i = qh(n);
    (this._changesDetected = !Wh(this._results, i, e)) &&
      ((this._results = i),
      (this.length = i.length),
      (this.last = i[this.length - 1]),
      (this.first = i[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(n) {
    this._onDirty = n;
  }
  setDirty() {
    ((this.dirty = !0), this._onDirty?.());
  }
  destroy() {
    this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = _D;
};
function bm(t) {
  return (t.flags & 128) === 128;
}
var Pd = (function (t) {
    return ((t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t);
  })(Pd || {}),
  Dm = new Map(),
  yD = 0;
function vD() {
  return yD++;
}
function bD(t) {
  Dm.set(t[Rr], t);
}
function od(t) {
  Dm.delete(t[Rr]);
}
var Op = '__ngContext__';
function Bi(t, n) {
  xt(n) ? ((t[Op] = n[Rr]), bD(n)) : (t[Op] = n);
}
function Cm(t) {
  return wm(t[Ni]);
}
function Em(t) {
  return wm(t[et]);
}
function wm(t) {
  for (; t !== null && !ht(t); ) t = t[et];
  return t;
}
var sd;
function Ld(t) {
  sd = t;
}
function Im() {
  if (sd !== void 0) return sd;
  if (typeof document < 'u') return document;
  throw new A(210, !1);
}
var Wi = new g('', { providedIn: 'root', factory: () => DD }),
  DD = 'ng',
  sa = new g(''),
  li = new g('', { providedIn: 'platform', factory: () => 'unknown' });
var Zr = new g(''),
  qi = new g('', {
    providedIn: 'root',
    factory: () => Im().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
  });
var CD = 'h',
  ED = 'b';
var Sm = 'r';
var xm = 'di';
var Mm = !1,
  Tm = new g('', { providedIn: 'root', factory: () => Mm });
var wD = (t, n, e, i) => {};
function ID(t, n, e, i) {
  wD(t, n, e, i);
}
function aa(t) {
  return (t.flags & 32) === 32;
}
var SD = () => null;
function Rm(t, n, e = !1) {
  return SD(t, n, e);
}
function Am(t, n) {
  let e = t.contentQueries;
  if (e !== null) {
    let i = T(null);
    try {
      for (let r = 0; r < e.length; r += 2) {
        let o = e[r],
          s = e[r + 1];
        if (s !== -1) {
          let a = t.data[s];
          (kr(o), a.contentQueries(2, n[s], s));
        }
      }
    } finally {
      T(i);
    }
  }
}
function ad(t, n, e) {
  kr(0);
  let i = T(null);
  try {
    n(t, e);
  } finally {
    T(i);
  }
}
function Vd(t, n, e) {
  if (Dc(n)) {
    let i = T(null);
    try {
      let r = n.directiveStart,
        o = n.directiveEnd;
      for (let s = r; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let l = e[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      T(i);
    }
  }
}
var Yt = (function (t) {
  return (
    (t[(t.Emulated = 0)] = 'Emulated'),
    (t[(t.None = 2)] = 'None'),
    (t[(t.ShadowDom = 3)] = 'ShadowDom'),
    t
  );
})(Yt || {});
var ld = class {
  changingThisBreaksApplicationSecurity;
  constructor(n) {
    this.changingThisBreaksApplicationSecurity = n;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ic})`;
  }
};
function jd(t) {
  return t instanceof ld ? t.changingThisBreaksApplicationSecurity : t;
}
var xD = /^>|^->|<!--|-->|--!>|<!-$/g,
  MD = /(<|>)/g,
  TD = '\u200B$1\u200B';
function RD(t) {
  return t.replace(xD, (n) => n.replace(MD, TD));
}
function AD(t, n, e) {
  let i = t.length;
  for (;;) {
    let r = t.indexOf(n, e);
    if (r === -1) return r;
    if (r === 0 || t.charCodeAt(r - 1) <= 32) {
      let o = n.length;
      if (r + o === i || t.charCodeAt(r + o) <= 32) return r;
    }
    e = r + 1;
  }
}
var Nm = 'ng-template';
function ND(t, n, e, i) {
  let r = 0;
  if (i) {
    for (; r < n.length && typeof n[r] == 'string'; r += 2)
      if (n[r] === 'class' && AD(n[r + 1].toLowerCase(), e, 0) !== -1) return !0;
  } else if (Bd(t)) return !1;
  if (((r = n.indexOf(1, r)), r > -1)) {
    let o;
    for (; ++r < n.length && typeof (o = n[r]) == 'string'; ) if (o.toLowerCase() === e) return !0;
  }
  return !1;
}
function Bd(t) {
  return t.type === 4 && t.value !== Nm;
}
function OD(t, n, e) {
  let i = t.type === 4 && !e ? Nm : t.value;
  return n === i;
}
function kD(t, n, e) {
  let i = 4,
    r = t.attrs,
    o = r !== null ? LD(r) : 0,
    s = !1;
  for (let a = 0; a < n.length; a++) {
    let l = n[a];
    if (typeof l == 'number') {
      if (!s && !gt(i) && !gt(l)) return !1;
      if (s && gt(l)) continue;
      ((s = !1), (i = l | (i & 1)));
      continue;
    }
    if (!s)
      if (i & 4) {
        if (((i = 2 | (i & 1)), (l !== '' && !OD(t, l, e)) || (l === '' && n.length === 1))) {
          if (gt(i)) return !1;
          s = !0;
        }
      } else if (i & 8) {
        if (r === null || !ND(t, r, l, e)) {
          if (gt(i)) return !1;
          s = !0;
        }
      } else {
        let c = n[++a],
          d = FD(l, r, Bd(t), e);
        if (d === -1) {
          if (gt(i)) return !1;
          s = !0;
          continue;
        }
        if (c !== '') {
          let f;
          if ((d > o ? (f = '') : (f = r[d + 1].toLowerCase()), i & 2 && c !== f)) {
            if (gt(i)) return !1;
            s = !0;
          }
        }
      }
  }
  return gt(i) || s;
}
function gt(t) {
  return (t & 1) === 0;
}
function FD(t, n, e, i) {
  if (n === null) return -1;
  let r = 0;
  if (i || !e) {
    let o = !1;
    for (; r < n.length; ) {
      let s = n[r];
      if (s === t) return r;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = n[++r];
        for (; typeof a == 'string'; ) a = n[++r];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          r += 4;
          continue;
        }
      }
      r += o ? 1 : 2;
    }
    return -1;
  } else return VD(n, t);
}
function Om(t, n, e = !1) {
  for (let i = 0; i < n.length; i++) if (kD(t, n[i], e)) return !0;
  return !1;
}
function PD(t) {
  let n = t.attrs;
  if (n != null) {
    let e = n.indexOf(5);
    if ((e & 1) === 0) return n[e + 1];
  }
  return null;
}
function LD(t) {
  for (let n = 0; n < t.length; n++) {
    let e = t[n];
    if (cm(e)) return n;
  }
  return t.length;
}
function VD(t, n) {
  let e = t.indexOf(4);
  if (e > -1)
    for (e++; e < t.length; ) {
      let i = t[e];
      if (typeof i == 'number') return -1;
      if (i === n) return e;
      e++;
    }
  return -1;
}
function jD(t, n) {
  e: for (let e = 0; e < n.length; e++) {
    let i = n[e];
    if (t.length === i.length) {
      for (let r = 0; r < t.length; r++) if (t[r] !== i[r]) continue e;
      return !0;
    }
  }
  return !1;
}
function kp(t, n) {
  return t ? ':not(' + n.trim() + ')' : n;
}
function BD(t) {
  let n = t[0],
    e = 1,
    i = 2,
    r = '',
    o = !1;
  for (; e < t.length; ) {
    let s = t[e];
    if (typeof s == 'string')
      if (i & 2) {
        let a = t[++e];
        r += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else i & 8 ? (r += '.' + s) : i & 4 && (r += ' ' + s);
    else (r !== '' && !gt(s) && ((n += kp(o, r)), (r = '')), (i = s), (o = o || !gt(i)));
    e++;
  }
  return (r !== '' && (n += kp(o, r)), n);
}
function HD(t) {
  return t.map(BD).join(',');
}
function UD(t) {
  let n = [],
    e = [],
    i = 1,
    r = 2;
  for (; i < t.length; ) {
    let o = t[i];
    if (typeof o == 'string') r === 2 ? o !== '' && n.push(o, t[++i]) : r === 8 && e.push(o);
    else {
      if (!gt(r)) break;
      r = o;
    }
    i++;
  }
  return (e.length && n.push(1, ...e), n);
}
var st = {};
function zD(t, n) {
  return t.createText(n);
}
function $D(t, n, e) {
  t.setValue(n, e);
}
function GD(t, n) {
  return t.createComment(RD(n));
}
function km(t, n, e) {
  return t.createElement(n, e);
}
function Qs(t, n, e, i, r) {
  t.insertBefore(n, e, i, r);
}
function Fm(t, n, e) {
  t.appendChild(n, e);
}
function Fp(t, n, e, i, r) {
  i !== null ? Qs(t, n, e, i, r) : Fm(t, n, e);
}
function Pm(t, n, e, i) {
  t.removeChild(null, n, e, i);
}
function WD(t, n, e) {
  t.setAttribute(n, 'style', e);
}
function qD(t, n, e) {
  e === '' ? t.removeAttribute(n, 'class') : t.setAttribute(n, 'class', e);
}
function Lm(t, n, e) {
  let { mergedAttrs: i, classes: r, styles: o } = e;
  (i !== null && oD(t, n, i), r !== null && qD(t, n, r), o !== null && WD(t, n, o));
}
function Hd(t, n, e, i, r, o, s, a, l, c, d) {
  let f = le + i,
    p = f + r,
    h = YD(f, p),
    m = typeof c == 'function' ? c() : c;
  return (h[C] = {
    type: t,
    blueprint: h,
    template: e,
    queries: null,
    viewQuery: a,
    declTNode: n,
    data: h.slice().fill(null, f),
    bindingStartIndex: f,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == 'function' ? o() : o,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: l,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: d,
  });
}
function YD(t, n) {
  let e = [];
  for (let i = 0; i < n; i++) e.push(i < t ? null : st);
  return e;
}
function ZD(t) {
  let n = t.tView;
  return n === null || n.incompleteFirstPass
    ? (t.tView = Hd(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id,
      ))
    : n;
}
function Ud(t, n, e, i, r, o, s, a, l, c, d) {
  let f = n.blueprint.slice();
  return (
    (f[ft] = r),
    (f[M] = i | 4 | 128 | 8 | 64 | 1024),
    (c !== null || (t && t[M] & 2048)) && (f[M] |= 2048),
    Sc(f),
    (f[Ee] = f[qn] = t),
    (f[ve] = e),
    (f[zt] = s || (t && t[zt])),
    (f[se] = a || (t && t[se])),
    (f[Ut] = l || (t && t[Ut]) || null),
    (f[ze] = o),
    (f[Rr] = vD()),
    (f[Wn] = d),
    (f[vc] = c),
    (f[$e] = n.type == 2 ? t[$e] : f),
    f
  );
}
function KD(t, n, e) {
  let i = pt(n, t),
    r = ZD(e),
    o = t[zt].rendererFactory,
    s = zd(t, Ud(t, r, null, Vm(e), i, n, null, o.createRenderer(i, e), null, null, null));
  return (t[n.index] = s);
}
function Vm(t) {
  let n = 16;
  return (t.signals ? (n = 4096) : t.onPush && (n = 64), n);
}
function jm(t, n, e, i) {
  if (e === 0) return -1;
  let r = n.length;
  for (let o = 0; o < e; o++) (n.push(i), t.blueprint.push(i), t.data.push(null));
  return r;
}
function zd(t, n) {
  return (t[Ni] ? (t[yc][et] = n) : (t[Ni] = n), (t[yc] = n), n);
}
function I(t = 1) {
  Bm(pe(), N(), Gt() + t, !1);
}
function Bm(t, n, e, i) {
  if (!i)
    if ((n[M] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && Us(n, o, e);
    } else {
      let o = t.preOrderHooks;
      o !== null && zs(n, o, 0, e);
    }
  gn(e);
}
var la = (function (t) {
  return (
    (t[(t.None = 0)] = 'None'),
    (t[(t.SignalBased = 1)] = 'SignalBased'),
    (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
    t
  );
})(la || {});
function cd(t, n, e, i) {
  let r = T(null);
  try {
    let [o, s, a] = t.inputs[e],
      l = null;
    ((s & la.SignalBased) !== 0 && (l = n[o][Se]),
      l !== null && l.transformFn !== void 0
        ? (i = l.transformFn(i))
        : a !== null && (i = a.call(n, i)),
      t.setInput !== null ? t.setInput(n, l, i, e, o) : im(n, l, o, i));
  } finally {
    T(r);
  }
}
var Zt = (function (t) {
    return ((t[(t.Important = 1)] = 'Important'), (t[(t.DashCase = 2)] = 'DashCase'), t);
  })(Zt || {}),
  QD;
function $d(t, n) {
  return QD(t, n);
}
var si = new Set(),
  ca = (function (t) {
    return (
      (t[(t.CHANGE_DETECTION = 0)] = 'CHANGE_DETECTION'),
      (t[(t.AFTER_NEXT_RENDER = 1)] = 'AFTER_NEXT_RENDER'),
      t
    );
  })(ca || {}),
  yn = new g(''),
  Pp = new Set();
function vn(t) {
  Pp.has(t) || (Pp.add(t), performance?.mark?.('mark_feature_usage', { detail: { feature: t } }));
}
var Hm = !1,
  dd = class extends D {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(n = !1) {
      (super(),
        (this.__isAsync = n),
        np() &&
          ((this.destroyRef = u(mt, { optional: !0 }) ?? void 0),
          (this.pendingTasks = u(ti, { optional: !0 }) ?? void 0)));
    }
    emit(n) {
      let e = T(null);
      try {
        super.next(n);
      } finally {
        T(e);
      }
    }
    subscribe(n, e, i) {
      let r = n,
        o = e || (() => null),
        s = i;
      if (n && typeof n == 'object') {
        let l = n;
        ((r = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l)));
      }
      this.__isAsync &&
        ((o = this.wrapInTimeout(o)),
        r && (r = this.wrapInTimeout(r)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: r, error: o, complete: s });
      return (n instanceof W && n.add(a), a);
    }
    wrapInTimeout(n) {
      return (e) => {
        let i = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            n(e);
          } finally {
            i !== void 0 && this.pendingTasks?.remove(i);
          }
        });
      };
    }
  },
  G = dd;
function Um(t) {
  let n, e;
  function i() {
    t = ni;
    try {
      (e !== void 0 && typeof cancelAnimationFrame == 'function' && cancelAnimationFrame(e),
        n !== void 0 && clearTimeout(n));
    } catch {}
  }
  return (
    (n = setTimeout(() => {
      (t(), i());
    })),
    typeof requestAnimationFrame == 'function' &&
      (e = requestAnimationFrame(() => {
        (t(), i());
      })),
    () => i()
  );
}
function Lp(t) {
  return (
    queueMicrotask(() => t()),
    () => {
      t = ni;
    }
  );
}
var Gd = 'isAngularZone',
  Xs = Gd + '_ID',
  XD = 0,
  R = class t {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new G(!1);
    onMicrotaskEmpty = new G(!1);
    onStable = new G(!1);
    onError = new G(!1);
    constructor(n) {
      let {
        enableLongStackTrace: e = !1,
        shouldCoalesceEventChangeDetection: i = !1,
        shouldCoalesceRunChangeDetection: r = !1,
        scheduleInRootZone: o = Hm,
      } = n;
      if (typeof Zone > 'u') throw new A(908, !1);
      Zone.assertZonePatched();
      let s = this;
      ((s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !r && i),
        (s.shouldCoalesceRunChangeDetection = r),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = o),
        tC(s));
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(Gd) === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new A(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new A(909, !1);
    }
    run(n, e, i) {
      return this._inner.run(n, e, i);
    }
    runTask(n, e, i, r) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + r, n, JD, ni, ni);
      try {
        return o.runTask(s, e, i);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(n, e, i) {
      return this._inner.runGuarded(n, e, i);
    }
    runOutsideAngular(n) {
      return this._outer.run(n);
    }
  },
  JD = {};
function Wd(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      (t._nesting++, t.onMicrotaskEmpty.emit(null));
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function eC(t) {
  if (t.isCheckStableRunning || t.callbackScheduled) return;
  t.callbackScheduled = !0;
  function n() {
    Um(() => {
      ((t.callbackScheduled = !1),
        ud(t),
        (t.isCheckStableRunning = !0),
        Wd(t),
        (t.isCheckStableRunning = !1));
    });
  }
  (t.scheduleInRootZone
    ? Zone.root.run(() => {
        n();
      })
    : t._outer.run(() => {
        n();
      }),
    ud(t));
}
function tC(t) {
  let n = () => {
      eC(t);
    },
    e = XD++;
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { [Gd]: !0, [Xs]: e, [Xs + e]: !0 },
    onInvokeTask: (i, r, o, s, a, l) => {
      if (nC(l)) return i.invokeTask(o, s, a, l);
      try {
        return (Vp(t), i.invokeTask(o, s, a, l));
      } finally {
        (((t.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          n(),
          jp(t));
      }
    },
    onInvoke: (i, r, o, s, a, l, c) => {
      try {
        return (Vp(t), i.invoke(o, s, a, l, c));
      } finally {
        (t.shouldCoalesceRunChangeDetection && !t.callbackScheduled && !iC(l) && n(), jp(t));
      }
    },
    onHasTask: (i, r, o, s) => {
      (i.hasTask(o, s),
        r === o &&
          (s.change == 'microTask'
            ? ((t._hasPendingMicrotasks = s.microTask), ud(t), Wd(t))
            : s.change == 'macroTask' && (t.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (i, r, o, s) => (
      i.handleError(o, s),
      t.runOutsideAngular(() => t.onError.emit(s)),
      !1
    ),
  });
}
function ud(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection || t.shouldCoalesceRunChangeDetection) &&
    t.callbackScheduled === !0)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function Vp(t) {
  (t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null)));
}
function jp(t) {
  (t._nesting--, Wd(t));
}
var Hr = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new G();
  onMicrotaskEmpty = new G();
  onStable = new G();
  onError = new G();
  run(n, e, i) {
    return n.apply(e, i);
  }
  runGuarded(n, e, i) {
    return n.apply(e, i);
  }
  runOutsideAngular(n) {
    return n();
  }
  runTask(n, e, i, r) {
    return n.apply(e, i);
  }
};
function nC(t) {
  return zm(t, '__ignore_ng_zone__');
}
function iC(t) {
  return zm(t, '__scheduler_tick__');
}
function zm(t, n) {
  return !Array.isArray(t) || t.length !== 1 ? !1 : t[0]?.data?.[n] === !0;
}
var da = (() => {
    class t {
      impl = null;
      execute() {
        this.impl?.execute();
      }
      static ɵprov = y({ token: t, providedIn: 'root', factory: () => new t() });
    }
    return t;
  })(),
  qd = [0, 1, 2, 3],
  Yd = (() => {
    class t {
      ngZone = u(R);
      scheduler = u(Je);
      errorHandler = u(Xe, { optional: !0 });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = !1;
      constructor() {
        u(yn, { optional: !0 });
      }
      execute() {
        let e = this.sequences.size > 0;
        (e && ee(16), (this.executing = !0));
        for (let i of qd)
          for (let r of this.sequences)
            if (!(r.erroredOrDestroyed || !r.hooks[i]))
              try {
                r.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                  this.maybeTrace(() => {
                    let o = r.hooks[i];
                    return o(r.pipelinedValue);
                  }, r.snapshot),
                );
              } catch (o) {
                ((r.erroredOrDestroyed = !0), this.errorHandler?.handleError(o));
              }
        this.executing = !1;
        for (let i of this.sequences)
          (i.afterRun(), i.once && (this.sequences.delete(i), i.destroy()));
        for (let i of this.deferredRegistrations) this.sequences.add(i);
        (this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
          this.deferredRegistrations.clear(),
          e && ee(17));
      }
      register(e) {
        let { view: i } = e;
        i !== void 0
          ? ((i[Zn] ??= []).push(e), mn(i), (i[M] |= 8192))
          : this.executing
            ? this.deferredRegistrations.add(e)
            : this.addSequence(e);
      }
      addSequence(e) {
        (this.sequences.add(e), this.scheduler.notify(7));
      }
      unregister(e) {
        this.executing && this.sequences.has(e)
          ? ((e.erroredOrDestroyed = !0), (e.pipelinedValue = void 0), (e.once = !0))
          : (this.sequences.delete(e), this.deferredRegistrations.delete(e));
      }
      maybeTrace(e, i) {
        return i ? i.run(ca.AFTER_NEXT_RENDER, e) : e();
      }
      static ɵprov = y({ token: t, providedIn: 'root', factory: () => new t() });
    }
    return t;
  })(),
  Ur = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(n, e, i, r, o, s = null) {
      ((this.impl = n),
        (this.hooks = e),
        (this.view = i),
        (this.once = r),
        (this.snapshot = s),
        (this.unregisterOnDestroy = o?.onDestroy(() => this.destroy())));
    }
    afterRun() {
      ((this.erroredOrDestroyed = !1),
        (this.pipelinedValue = void 0),
        this.snapshot?.dispose(),
        (this.snapshot = null));
    }
    destroy() {
      (this.impl.unregister(this), this.unregisterOnDestroy?.());
      let n = this.view?.[Zn];
      n && (this.view[Zn] = n.filter((e) => e !== this));
    }
  };
function at(t, n) {
  let e = n?.injector ?? u(Y);
  return (vn('NgAfterNextRender'), oC(t, e, n, !0));
}
function rC(t) {
  return t instanceof Function
    ? [void 0, void 0, t, void 0]
    : [t.earlyRead, t.write, t.mixedReadWrite, t.read];
}
function oC(t, n, e, i) {
  let r = n.get(da);
  r.impl ??= n.get(Yd);
  let o = n.get(yn, null, { optional: !0 }),
    s = e?.manualCleanup !== !0 ? n.get(mt) : null,
    a = n.get(ei, null, { optional: !0 }),
    l = new Ur(r.impl, rC(t), a?.view, i, s, o?.snapshot(null));
  return (r.impl.register(l), l);
}
var $m = new g('', {
  providedIn: 'root',
  factory: () => ({ queue: new Set(), isScheduled: !1, scheduler: null }),
});
function Gm(t, n, e) {
  let i = t.get($m);
  if (Array.isArray(n)) for (let r of n) (i.queue.add(r), e?.detachedLeaveAnimationFns?.push(r));
  else (i.queue.add(n), e?.detachedLeaveAnimationFns?.push(n));
  i.scheduler && i.scheduler(t);
}
function sC(t, n) {
  let e = t.get($m);
  if (n.detachedLeaveAnimationFns) {
    for (let i of n.detachedLeaveAnimationFns) e.queue.delete(i);
    n.detachedLeaveAnimationFns = void 0;
  }
}
function aC(t, n) {
  for (let [e, i] of n) Gm(t, i.animateFns);
}
function Bp(t, n, e, i) {
  let r = t?.[Kn]?.enter;
  n !== null && r && r.has(e.index) && aC(i, r);
}
function Li(t, n, e, i, r, o, s, a) {
  if (r != null) {
    let l,
      c = !1;
    ht(r) ? (l = r) : xt(r) && ((c = !0), (r = r[ft]));
    let d = tt(r);
    (t === 0 && i !== null
      ? (Bp(a, i, o, e), s == null ? Fm(n, i, d) : Qs(n, i, d, s || null, !0))
      : t === 1 && i !== null
        ? (Bp(a, i, o, e), Qs(n, i, d, s || null, !0))
        : t === 2
          ? Hp(a, o, e, (f) => {
              Pm(n, d, c, f);
            })
          : t === 3 &&
            Hp(a, o, e, () => {
              n.destroyNode(d);
            }),
      l != null && yC(n, t, e, l, o, i, s));
  }
}
function lC(t, n) {
  (Wm(t, n), (n[ft] = null), (n[ze] = null));
}
function cC(t, n, e, i, r, o) {
  ((i[ft] = r), (i[ze] = n), fa(t, i, e, 1, r, o));
}
function Wm(t, n) {
  (n[zt].changeDetectionScheduler?.notify(9), fa(t, n, n[se], 2, null, null));
}
function dC(t) {
  let n = t[Ni];
  if (!n) return qc(t[C], t);
  for (; n; ) {
    let e = null;
    if (xt(n)) e = n[Ni];
    else {
      let i = n[he];
      i && (e = i);
    }
    if (!e) {
      for (; n && !n[et] && n !== t; ) (xt(n) && qc(n[C], n), (n = n[Ee]));
      (n === null && (n = t), xt(n) && qc(n[C], n), (e = n && n[et]));
    }
    n = e;
  }
}
function Zd(t, n) {
  let e = t[Qn],
    i = e.indexOf(n);
  e.splice(i, 1);
}
function ua(t, n) {
  if (Xn(n)) return;
  let e = n[se];
  (e.destroyNode && fa(t, n, e, 3, null, null), dC(n));
}
function qc(t, n) {
  if (Xn(n)) return;
  let e = T(null);
  try {
    ((n[M] &= -129),
      (n[M] |= 256),
      n[Ye] && rn(n[Ye]),
      hC(t, n),
      fC(t, n),
      n[C].type === 1 && n[se].destroy());
    let i = n[fn];
    if (i !== null && ht(n[Ee])) {
      i !== n[Ee] && Zd(i, n);
      let r = n[St];
      r !== null && r.detachView(t);
    }
    od(n);
  } finally {
    T(e);
  }
}
function Hp(t, n, e, i) {
  let r = t?.[Kn];
  if (r == null || r.leave == null || !r.leave.has(n.index)) return i(!1);
  (t && si.add(t),
    Gm(
      e,
      () => {
        if (r.leave && r.leave.has(n.index)) {
          let s = r.leave.get(n.index),
            a = [];
          if (s) {
            for (let l = 0; l < s.animateFns.length; l++) {
              let c = s.animateFns[l],
                { promise: d } = c();
              a.push(d);
            }
            r.detachedLeaveAnimationFns = void 0;
          }
          ((r.running = Promise.allSettled(a)), uC(t, i));
        } else (t && si.delete(t), i(!1));
      },
      r,
    ));
}
function uC(t, n) {
  let e = t[Kn]?.running;
  if (e) {
    e.then(() => {
      ((t[Kn].running = void 0), si.delete(t), n(!0));
    });
    return;
  }
  n(!1);
}
function fC(t, n) {
  let e = t.cleanup,
    i = n[Ai];
  if (e !== null)
    for (let s = 0; s < e.length - 1; s += 2)
      if (typeof e[s] == 'string') {
        let a = e[s + 3];
        (a >= 0 ? i[a]() : i[-a].unsubscribe(), (s += 2));
      } else {
        let a = i[e[s + 1]];
        e[s].call(a);
      }
  i !== null && (n[Ai] = null);
  let r = n[Ht];
  if (r !== null) {
    n[Ht] = null;
    for (let s = 0; s < r.length; s++) {
      let a = r[s];
      a();
    }
  }
  let o = n[$t];
  if (o !== null) {
    n[$t] = null;
    for (let s of o) s.destroy();
  }
}
function hC(t, n) {
  let e;
  if (t != null && (e = t.destroyHooks) != null)
    for (let i = 0; i < e.length; i += 2) {
      let r = n[e[i]];
      if (!(r instanceof ri)) {
        let o = e[i + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = r[o[s]],
              l = o[s + 1];
            ee(4, a, l);
            try {
              l.call(a);
            } finally {
              ee(5, a, l);
            }
          }
        else {
          ee(4, r, o);
          try {
            o.call(r);
          } finally {
            ee(5, r, o);
          }
        }
      }
    }
}
function qm(t, n, e) {
  return pC(t, n.parent, e);
}
function pC(t, n, e) {
  let i = n;
  for (; i !== null && i.type & 168; ) ((n = i), (i = n.parent));
  if (i === null) return e[ft];
  if (pn(i)) {
    let { encapsulation: r } = t.data[i.directiveStart + i.componentOffset];
    if (r === Yt.None || r === Yt.Emulated) return null;
  }
  return pt(i, e);
}
function Ym(t, n, e) {
  return gC(t, n, e);
}
function mC(t, n, e) {
  return t.type & 40 ? pt(t, e) : null;
}
var gC = mC,
  Up;
function Kd(t, n, e, i) {
  let r = qm(t, i, n),
    o = n[se],
    s = i.parent || n[ze],
    a = Ym(s, i, n);
  if (r != null)
    if (Array.isArray(e)) for (let l = 0; l < e.length; l++) Fp(o, r, e[l], a, !1);
    else Fp(o, r, e, a, !1);
  Up !== void 0 && Up(o, i, n, e, r);
}
function Vr(t, n) {
  if (n !== null) {
    let e = n.type;
    if (e & 3) return pt(n, t);
    if (e & 4) return fd(-1, t[n.index]);
    if (e & 8) {
      let i = n.child;
      if (i !== null) return Vr(t, i);
      {
        let r = t[n.index];
        return ht(r) ? fd(-1, r) : tt(r);
      }
    } else {
      if (e & 128) return Vr(t, n.next);
      if (e & 32) return $d(n, t)() || tt(t[n.index]);
      {
        let i = Zm(t, n);
        if (i !== null) {
          if (Array.isArray(i)) return i[0];
          let r = an(t[$e]);
          return Vr(r, i);
        } else return Vr(t, n.next);
      }
    }
  }
  return null;
}
function Zm(t, n) {
  if (n !== null) {
    let i = t[$e][ze],
      r = n.projection;
    return i.projection[r];
  }
  return null;
}
function fd(t, n) {
  let e = he + t + 1;
  if (e < n.length) {
    let i = n[e],
      r = i[C].firstChild;
    if (r !== null) return Vr(i, r);
  }
  return n[hn];
}
function Qd(t, n, e, i, r, o, s) {
  for (; e != null; ) {
    let a = i[Ut];
    if (e.type === 128) {
      e = e.next;
      continue;
    }
    let l = i[e.index],
      c = e.type;
    if ((s && n === 0 && (l && Bi(tt(l), i), (e.flags |= 2)), !aa(e)))
      if (c & 8) (Qd(t, n, e.child, i, r, o, !1), Li(n, t, a, r, l, e, o, i));
      else if (c & 32) {
        let d = $d(e, i),
          f;
        for (; (f = d()); ) Li(n, t, a, r, f, e, o, i);
        Li(n, t, a, r, l, e, o, i);
      } else c & 16 ? Km(t, n, i, e, r, o) : Li(n, t, a, r, l, e, o, i);
    e = s ? e.projectionNext : e.next;
  }
}
function fa(t, n, e, i, r, o) {
  Qd(e, i, t.firstChild, n, r, o, !1);
}
function _C(t, n, e) {
  let i = n[se],
    r = qm(t, e, n),
    o = e.parent || n[ze],
    s = Ym(o, e, n);
  Km(i, 0, n, e, r, s);
}
function Km(t, n, e, i, r, o) {
  let s = e[$e],
    l = s[ze].projection[i.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let d = l[c];
      Li(n, t, e[Ut], r, d, i, o, e);
    }
  else {
    let c = l,
      d = s[Ee];
    (bm(i) && (c.flags |= 128), Qd(t, n, c, d, r, o, !0));
  }
}
function yC(t, n, e, i, r, o, s) {
  let a = i[hn],
    l = tt(i);
  a !== l && Li(n, t, e, o, a, r, s);
  for (let c = he; c < i.length; c++) {
    let d = i[c];
    fa(d[C], d, t, n, o, a);
  }
}
function vC(t, n, e, i, r) {
  if (n) r ? t.addClass(e, i) : t.removeClass(e, i);
  else {
    let o = i.indexOf('-') === -1 ? void 0 : Zt.DashCase;
    r == null
      ? t.removeStyle(e, i, o)
      : (typeof r == 'string' &&
          r.endsWith('!important') &&
          ((r = r.slice(0, -10)), (o |= Zt.Important)),
        t.setStyle(e, i, r, o));
  }
}
function Qm(t, n, e, i, r) {
  let o = Gt(),
    s = i & 2;
  try {
    (gn(-1), s && n.length > le && Bm(t, n, le, !1), ee(s ? 2 : 0, r, e), e(i, r));
  } finally {
    (gn(o), ee(s ? 3 : 1, r, e));
  }
}
function ha(t, n, e) {
  (SC(t, n, e), (e.flags & 64) === 64 && xC(t, n, e));
}
function Kr(t, n, e = pt) {
  let i = n.localNames;
  if (i !== null) {
    let r = n.index + 1;
    for (let o = 0; o < i.length; o += 2) {
      let s = i[o + 1],
        a = s === -1 ? e(n, t) : t[s];
      t[r++] = a;
    }
  }
}
function bC(t, n, e, i) {
  let o = i.get(Tm, Mm) || e === Yt.ShadowDom,
    s = t.selectRootElement(n, o);
  return (DC(s), s);
}
function DC(t) {
  CC(t);
}
var CC = () => null;
function EC(t) {
  return t === 'class'
    ? 'className'
    : t === 'for'
      ? 'htmlFor'
      : t === 'formaction'
        ? 'formAction'
        : t === 'innerHtml'
          ? 'innerHTML'
          : t === 'readonly'
            ? 'readOnly'
            : t === 'tabindex'
              ? 'tabIndex'
              : t;
}
function wC(t, n, e, i, r, o) {
  let s = n[C];
  if (tu(t, s, n, e, i)) {
    pn(t) && IC(n, t.index);
    return;
  }
  (t.type & 3 && (e = EC(e)), Xm(t, n, e, i, r, o));
}
function Xm(t, n, e, i, r, o) {
  if (t.type & 3) {
    let s = pt(t, n);
    ((i = o != null ? o(i, t.value || '', e) : i), r.setProperty(s, e, i));
  } else t.type & 12;
}
function IC(t, n) {
  let e = nt(n, t);
  e[M] & 16 || (e[M] |= 64);
}
function SC(t, n, e) {
  let i = e.directiveStart,
    r = e.directiveEnd;
  (pn(e) && KD(n, e, t.data[i + e.componentOffset]), t.firstCreatePass || Ks(e, n));
  let o = e.initialInputs;
  for (let s = i; s < r; s++) {
    let a = t.data[s],
      l = Br(n, t, s, e);
    if ((Bi(l, n), o !== null && AC(n, s - i, l, a, e, o), Mt(a))) {
      let c = nt(e.index, n);
      c[ve] = Br(n, t, s, e);
    }
  }
}
function xC(t, n, e) {
  let i = e.directiveStart,
    r = e.directiveEnd,
    o = e.index,
    s = yp();
  try {
    gn(o);
    for (let a = i; a < r; a++) {
      let l = t.data[a],
        c = n[a];
      (Os(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && MC(l, c));
    }
  } finally {
    (gn(-1), Os(s));
  }
}
function MC(t, n) {
  t.hostBindings !== null && t.hostBindings(1, n);
}
function Xd(t, n) {
  let e = t.directiveRegistry,
    i = null;
  if (e)
    for (let r = 0; r < e.length; r++) {
      let o = e[r];
      Om(n, o.selectors, !1) && ((i ??= []), Mt(o) ? i.unshift(o) : i.push(o));
    }
  return i;
}
function TC(t, n, e, i, r, o) {
  let s = pt(t, n);
  RC(n[se], s, o, t.value, e, i, r);
}
function RC(t, n, e, i, r, o, s) {
  if (o == null) t.removeAttribute(n, r, e);
  else {
    let a = s == null ? Es(o) : s(o, i || '', r);
    t.setAttribute(n, r, a, e);
  }
}
function AC(t, n, e, i, r, o) {
  let s = o[n];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let l = s[a],
        c = s[a + 1];
      cd(i, e, l, c);
    }
}
function Jd(t, n, e, i, r) {
  let o = le + e,
    s = n[C],
    a = r(s, n, t, i, e);
  ((n[o] = a), Fi(t, !0));
  let l = t.type === 2;
  return (
    l ? (Lm(n[se], a, t), (dp() === 0 || Oi(t)) && Bi(a, n), up()) : Bi(a, n),
    js() && (!l || !aa(t)) && Kd(s, n, a, t),
    t
  );
}
function eu(t) {
  let n = t;
  return (Pc() ? Lc() : ((n = n.parent), Fi(n, !1)), n);
}
function NC(t, n) {
  let e = t[Ut];
  if (!e) return;
  let i;
  try {
    i = e.get(Wt, null);
  } catch {
    i = null;
  }
  i?.(n);
}
function tu(t, n, e, i, r) {
  let o = t.inputs?.[i],
    s = t.hostDirectiveInputs?.[i],
    a = !1;
  if (s)
    for (let l = 0; l < s.length; l += 2) {
      let c = s[l],
        d = s[l + 1],
        f = n.data[c];
      (cd(f, e[c], d, r), (a = !0));
    }
  if (o)
    for (let l of o) {
      let c = e[l],
        d = n.data[l];
      (cd(d, c, i, r), (a = !0));
    }
  return a;
}
function OC(t, n) {
  let e = nt(n, t),
    i = e[C];
  kC(i, e);
  let r = e[ft];
  (r !== null && e[Wn] === null && (e[Wn] = Rm(r, e[Ut])), ee(18), nu(i, e, e[ve]), ee(19, e[ve]));
}
function kC(t, n) {
  for (let e = n.length; e < t.blueprint.length; e++) n.push(t.blueprint[e]);
}
function nu(t, n, e) {
  Fs(n);
  try {
    let i = t.viewQuery;
    i !== null && ad(1, i, e);
    let r = t.template;
    (r !== null && Qm(t, n, r, 1, e),
      t.firstCreatePass && (t.firstCreatePass = !1),
      n[St]?.finishViewCreation(t),
      t.staticContentQueries && Am(t, n),
      t.staticViewQueries && ad(2, t.viewQuery, e));
    let o = t.components;
    o !== null && FC(n, o);
  } catch (i) {
    throw (t.firstCreatePass && ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)), i);
  } finally {
    ((n[M] &= -5), Ps());
  }
}
function FC(t, n) {
  for (let e = 0; e < n.length; e++) OC(t, n[e]);
}
function Qr(t, n, e, i) {
  let r = T(null);
  try {
    let o = n.tView,
      a = t[M] & 4096 ? 4096 : 16,
      l = Ud(
        t,
        o,
        e,
        a,
        null,
        n,
        null,
        null,
        i?.injector ?? null,
        i?.embeddedViewInjector ?? null,
        i?.dehydratedView ?? null,
      ),
      c = t[n.index];
    l[fn] = c;
    let d = t[St];
    return (d !== null && (l[St] = d.createEmbeddedView(o)), nu(o, l, e), l);
  } finally {
    T(r);
  }
}
function Hi(t, n) {
  return !n || n.firstChild === null || bm(t);
}
function zr(t, n, e, i, r = !1) {
  for (; e !== null; ) {
    if (e.type === 128) {
      e = r ? e.projectionNext : e.next;
      continue;
    }
    let o = n[e.index];
    (o !== null && i.push(tt(o)), ht(o) && Jm(o, i));
    let s = e.type;
    if (s & 8) zr(t, n, e.child, i);
    else if (s & 32) {
      let a = $d(e, n),
        l;
      for (; (l = a()); ) i.push(l);
    } else if (s & 16) {
      let a = Zm(n, e);
      if (Array.isArray(a)) i.push(...a);
      else {
        let l = an(n[$e]);
        zr(l[C], l, a, i, !0);
      }
    }
    e = r ? e.projectionNext : e.next;
  }
  return i;
}
function Jm(t, n) {
  for (let e = he; e < t.length; e++) {
    let i = t[e],
      r = i[C].firstChild;
    r !== null && zr(i[C], i, r, n);
  }
  t[hn] !== t[ft] && n.push(t[hn]);
}
function eg(t) {
  if (t[Zn] !== null) {
    for (let n of t[Zn]) n.impl.addSequence(n);
    t[Zn].length = 0;
  }
}
var tg = [];
function PC(t) {
  return t[Ye] ?? LC(t);
}
function LC(t) {
  let n = tg.pop() ?? Object.create(jC);
  return ((n.lView = t), n);
}
function VC(t) {
  t.lView[Ye] !== t && ((t.lView = null), tg.push(t));
}
var jC = Q(x({}, Nn), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (t) => {
    mn(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[Ye] = this;
  },
});
function BC(t) {
  let n = t[Ye] ?? Object.create(HC);
  return ((n.lView = t), n);
}
var HC = Q(x({}, Nn), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (t) => {
    let n = an(t.lView);
    for (; n && !ng(n[C]); ) n = an(n);
    n && xc(n);
  },
  consumerOnSignalRead() {
    this.lView[Ye] = this;
  },
});
function ng(t) {
  return t.type !== 2;
}
function ig(t) {
  if (t[$t] === null) return;
  let n = !0;
  for (; n; ) {
    let e = !1;
    for (let i of t[$t])
      i.dirty &&
        ((e = !0),
        i.zone === null || Zone.current === i.zone ? i.run() : i.zone.run(() => i.run()));
    n = e && !!(t[M] & 8192);
  }
}
var UC = 100;
function rg(t, n = 0) {
  let i = t[zt].rendererFactory,
    r = !1;
  r || i.begin?.();
  try {
    zC(t, n);
  } finally {
    r || i.end?.();
  }
}
function zC(t, n) {
  let e = Vc();
  try {
    (Pi(!0), hd(t, n));
    let i = 0;
    for (; Or(t); ) {
      if (i === UC) throw new A(103, !1);
      (i++, hd(t, 1));
    }
  } finally {
    Pi(e);
  }
}
function $C(t, n, e, i) {
  if (Xn(n)) return;
  let r = n[M],
    o = !1,
    s = !1;
  Fs(n);
  let a = !0,
    l = null,
    c = null;
  o ||
    (ng(t)
      ? ((c = PC(n)), (l = nn(c)))
      : Oo() === null
        ? ((a = !1), (c = BC(n)), (l = nn(c)))
        : n[Ye] && (rn(n[Ye]), (n[Ye] = null)));
  try {
    (Sc(n), mp(t.bindingStartIndex), e !== null && Qm(t, n, e, 2, i));
    let d = (r & 3) === 3;
    if (!o)
      if (d) {
        let h = t.preOrderCheckHooks;
        h !== null && Us(n, h, null);
      } else {
        let h = t.preOrderHooks;
        (h !== null && zs(n, h, 0, null), Gc(n, 0));
      }
    if ((s || GC(n), ig(n), og(n, 0), t.contentQueries !== null && Am(t, n), !o))
      if (d) {
        let h = t.contentCheckHooks;
        h !== null && Us(n, h);
      } else {
        let h = t.contentHooks;
        (h !== null && zs(n, h, 1), Gc(n, 1));
      }
    qC(t, n);
    let f = t.components;
    f !== null && ag(n, f, 0);
    let p = t.viewQuery;
    if ((p !== null && ad(2, p, i), !o))
      if (d) {
        let h = t.viewCheckHooks;
        h !== null && Us(n, h);
      } else {
        let h = t.viewHooks;
        (h !== null && zs(n, h, 2), Gc(n, 2));
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), n[Ts])) {
      for (let h of n[Ts]) h();
      n[Ts] = null;
    }
    o || (eg(n), (n[M] &= -73));
  } catch (d) {
    throw (o || mn(n), d);
  } finally {
    (c !== null && (On(c, l), a && VC(c)), Ps());
  }
}
function og(t, n) {
  for (let e = Cm(t); e !== null; e = Em(e))
    for (let i = he; i < e.length; i++) {
      let r = e[i];
      sg(r, n);
    }
}
function GC(t) {
  for (let n = Cm(t); n !== null; n = Em(n)) {
    if (!(n[M] & 2)) continue;
    let e = n[Qn];
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      xc(r);
    }
  }
}
function WC(t, n, e) {
  ee(18);
  let i = nt(n, t);
  (sg(i, e), ee(19, i[ve]));
}
function sg(t, n) {
  Rs(t) && hd(t, n);
}
function hd(t, n) {
  let i = t[C],
    r = t[M],
    o = t[Ye],
    s = !!(n === 0 && r & 16);
  if (
    ((s ||= !!(r & 64 && n === 0)),
    (s ||= !!(r & 1024)),
    (s ||= !!(o?.dirty && kn(o))),
    (s ||= !1),
    o && (o.dirty = !1),
    (t[M] &= -9217),
    s)
  )
    $C(i, t, i.template, t[ve]);
  else if (r & 8192) {
    let a = T(null);
    try {
      (ig(t), og(t, 1));
      let l = i.components;
      (l !== null && ag(t, l, 1), eg(t));
    } finally {
      T(a);
    }
  }
}
function ag(t, n, e) {
  for (let i = 0; i < n.length; i++) WC(t, n[i], e);
}
function qC(t, n) {
  let e = t.hostBindingOpCodes;
  if (e !== null)
    try {
      for (let i = 0; i < e.length; i++) {
        let r = e[i];
        if (r < 0) gn(~r);
        else {
          let o = r,
            s = e[++i],
            a = e[++i];
          _p(s, o);
          let l = n[o];
          (ee(24, l), a(2, l), ee(25, l));
        }
      }
    } finally {
      gn(-1);
    }
}
function iu(t, n) {
  let e = Vc() ? 64 : 1088;
  for (t[zt].changeDetectionScheduler?.notify(n); t; ) {
    t[M] |= e;
    let i = an(t);
    if (ki(t) && !i) return t;
    t = i;
  }
  return null;
}
function lg(t, n, e, i) {
  return [t, !0, 0, n, null, i, null, e, null, null];
}
function cg(t, n) {
  let e = he + n;
  if (e < t.length) return t[e];
}
function Xr(t, n, e, i = !0) {
  let r = n[C];
  if ((YC(r, n, t, e), i)) {
    let s = fd(e, t),
      a = n[se],
      l = a.parentNode(t[hn]);
    l !== null && cC(r, t[ze], a, n, l, s);
  }
  let o = n[Wn];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function dg(t, n) {
  let e = $r(t, n);
  return (e !== void 0 && ua(e[C], e), e);
}
function $r(t, n) {
  if (t.length <= he) return;
  let e = he + n,
    i = t[e];
  if (i) {
    let r = i[fn];
    (r !== null && r !== t && Zd(r, i), n > 0 && (t[e - 1][et] = i[et]));
    let o = xr(t, he + n);
    lC(i[C], i);
    let s = o[St];
    (s !== null && s.detachView(o[C]), (i[Ee] = null), (i[et] = null), (i[M] &= -129));
  }
  return i;
}
function YC(t, n, e, i) {
  let r = he + i,
    o = e.length;
  (i > 0 && (e[r - 1][et] = n),
    i < o - he ? ((n[et] = e[r]), uc(e, he + i, n)) : (e.push(n), (n[et] = null)),
    (n[Ee] = e));
  let s = n[fn];
  s !== null && e !== s && ug(s, n);
  let a = n[St];
  (a !== null && a.insertView(t), As(n), (n[M] |= 128));
}
function ug(t, n) {
  let e = t[Qn],
    i = n[Ee];
  if (xt(i)) t[M] |= 2;
  else {
    let r = i[Ee][$e];
    n[$e] !== r && (t[M] |= 2);
  }
  e === null ? (t[Qn] = [n]) : e.push(n);
}
var _n = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let n = this._lView,
      e = n[C];
    return zr(e, n, e.firstChild, []);
  }
  constructor(n, e) {
    ((this._lView = n), (this._cdRefInjectingView = e));
  }
  get context() {
    return this._lView[ve];
  }
  set context(n) {
    this._lView[ve] = n;
  }
  get destroyed() {
    return Xn(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let n = this._lView[Ee];
      if (ht(n)) {
        let e = n[Ar],
          i = e ? e.indexOf(this) : -1;
        i > -1 && ($r(n, i), xr(e, i));
      }
      this._attachedToViewContainer = !1;
    }
    ua(this._lView[C], this._lView);
  }
  onDestroy(n) {
    Mc(this._lView, n);
  }
  markForCheck() {
    iu(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[M] &= -129;
  }
  reattach() {
    (As(this._lView), (this._lView[M] |= 128));
  }
  detectChanges() {
    ((this._lView[M] |= 1024), rg(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new A(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let n = ki(this._lView),
      e = this._lView[fn];
    (e !== null && !n && Zd(e, this._lView), Wm(this._lView[C], this._lView));
  }
  attachToAppRef(n) {
    if (this._attachedToViewContainer) throw new A(902, !1);
    this._appRef = n;
    let e = ki(this._lView),
      i = this._lView[fn];
    (i !== null && !e && ug(i, this._lView), As(this._lView));
  }
};
var we = (() => {
  class t {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = ZC;
    constructor(e, i, r) {
      ((this._declarationLView = e), (this._declarationTContainer = i), (this.elementRef = r));
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, i) {
      return this.createEmbeddedViewImpl(e, i);
    }
    createEmbeddedViewImpl(e, i, r) {
      let o = Qr(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: i,
        dehydratedView: r,
      });
      return new _n(o);
    }
  }
  return t;
})();
function ZC() {
  return pa(Te(), N());
}
function pa(t, n) {
  return t.type & 4 ? new we(n, t, Gi(t, n)) : null;
}
function Yi(t, n, e, i, r) {
  let o = t.data[n];
  if (o === null) ((o = KC(t, n, e, i, r)), gp() && (o.flags |= 32));
  else if (o.type & 64) {
    ((o.type = e), (o.value = i), (o.attrs = r));
    let s = fp();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (Fi(o, !0), o);
}
function KC(t, n, e, i, r) {
  let o = Fc(),
    s = Pc(),
    a = s ? o : o && o.parent,
    l = (t.data[n] = XC(t, a, e, n, i, r));
  return (QC(t, l, o, s), l);
}
function QC(t, n, e, i) {
  (t.firstChild === null && (t.firstChild = n),
    e !== null &&
      (i
        ? e.child == null && n.parent !== null && (e.child = n)
        : e.next === null && ((e.next = n), (n.prev = e))));
}
function XC(t, n, e, i, r, o) {
  let s = n ? n.injectorIndex : -1,
    a = 0;
  return (
    Nc() && (a |= 128),
    {
      type: e,
      index: i,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: r,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: n,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var Ck = new RegExp(`^(\\d+)*(${ED}|${CD})*(.*)`);
function JC(t) {
  let n = t[bc] ?? [],
    i = t[Ee][se],
    r = [];
  for (let o of n) o.data[xm] !== void 0 ? r.push(o) : eE(o, i);
  t[bc] = r;
}
function eE(t, n) {
  let e = 0,
    i = t.firstChild;
  if (i) {
    let r = t.data[Sm];
    for (; e < r; ) {
      let o = i.nextSibling;
      (Pm(n, i, !1), (i = o), e++);
    }
  }
}
var tE = () => null,
  nE = () => null;
function Js(t, n) {
  return tE(t, n);
}
function fg(t, n, e) {
  return nE(t, n, e);
}
var hg = class {},
  ma = class {},
  pd = class {
    resolveComponentFactory(n) {
      throw new A(917, !1);
    }
  },
  ga = class {
    static NULL = new pd();
  },
  Ve = class {},
  We = (() => {
    class t {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => iE();
    }
    return t;
  })();
function iE() {
  let t = N(),
    n = Te(),
    e = nt(n.index, t);
  return (xt(e) ? e : t)[se];
}
var pg = (() => {
  class t {
    static ɵprov = y({ token: t, providedIn: 'root', factory: () => null });
  }
  return t;
})();
var Gs = {},
  md = class {
    injector;
    parentInjector;
    constructor(n, e) {
      ((this.injector = n), (this.parentInjector = e));
    }
    get(n, e, i) {
      let r = this.injector.get(n, Gs, i);
      return r !== Gs || e === Gs ? r : this.parentInjector.get(n, e, i);
    }
  };
function ea(t, n, e) {
  let i = e ? t.styles : null,
    r = e ? t.classes : null,
    o = 0;
  if (n !== null)
    for (let s = 0; s < n.length; s++) {
      let a = n[s];
      if (typeof a == 'number') o = a;
      else if (o == 1) r = bs(r, a);
      else if (o == 2) {
        let l = a,
          c = n[++s];
        i = bs(i, l + ': ' + c + ';');
      }
    }
  (e ? (t.styles = i) : (t.stylesWithoutHost = i),
    e ? (t.classes = r) : (t.classesWithoutHost = r));
}
function je(t, n = 0) {
  let e = N();
  if (e === null) return $(t, n);
  let i = Te();
  return gm(i, e, Ae(t), n);
}
function mg(t, n, e, i, r) {
  let o = i === null ? null : { '': -1 },
    s = r(t, e);
  if (s !== null) {
    let a = s,
      l = null,
      c = null;
    for (let d of s)
      if (d.resolveHostDirectives !== null) {
        [a, l, c] = d.resolveHostDirectives(s);
        break;
      }
    sE(t, n, e, a, o, l, c);
  }
  o !== null && i !== null && rE(e, i, o);
}
function rE(t, n, e) {
  let i = (t.localNames = []);
  for (let r = 0; r < n.length; r += 2) {
    let o = e[n[r + 1]];
    if (o == null) throw new A(-301, !1);
    i.push(n[r], o);
  }
}
function oE(t, n, e) {
  ((n.componentOffset = e), (t.components ??= []).push(n.index));
}
function sE(t, n, e, i, r, o, s) {
  let a = i.length,
    l = !1;
  for (let p = 0; p < a; p++) {
    let h = i[p];
    (!l && Mt(h) && ((l = !0), oE(t, e, p)), id(Ks(e, n), t, h.type));
  }
  fE(e, t.data.length, a);
  for (let p = 0; p < a; p++) {
    let h = i[p];
    h.providersResolver && h.providersResolver(h);
  }
  let c = !1,
    d = !1,
    f = jm(t, n, a, null);
  a > 0 && (e.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let h = i[p];
    if (
      ((e.mergedAttrs = ji(e.mergedAttrs, h.hostAttrs)),
      lE(t, e, n, f, h),
      uE(f, h, r),
      s !== null && s.has(h))
    ) {
      let [_, w] = s.get(h);
      e.directiveToIndex.set(h.type, [f, _ + e.directiveStart, w + e.directiveStart]);
    } else (o === null || !o.has(h)) && e.directiveToIndex.set(h.type, f);
    (h.contentQueries !== null && (e.flags |= 4),
      (h.hostBindings !== null || h.hostAttrs !== null || h.hostVars !== 0) && (e.flags |= 64));
    let m = h.type.prototype;
    (!c &&
      (m.ngOnChanges || m.ngOnInit || m.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(e.index), (c = !0)),
      !d &&
        (m.ngOnChanges || m.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(e.index), (d = !0)),
      f++);
  }
  aE(t, e, o);
}
function aE(t, n, e) {
  for (let i = n.directiveStart; i < n.directiveEnd; i++) {
    let r = t.data[i];
    if (e === null || !e.has(r)) (zp(0, n, r, i), zp(1, n, r, i), Gp(n, i, !1));
    else {
      let o = e.get(r);
      ($p(0, n, o, i), $p(1, n, o, i), Gp(n, i, !0));
    }
  }
}
function zp(t, n, e, i) {
  let r = t === 0 ? e.inputs : e.outputs;
  for (let o in r)
    if (r.hasOwnProperty(o)) {
      let s;
      (t === 0 ? (s = n.inputs ??= {}) : (s = n.outputs ??= {}),
        (s[o] ??= []),
        s[o].push(i),
        gg(n, o));
    }
}
function $p(t, n, e, i) {
  let r = t === 0 ? e.inputs : e.outputs;
  for (let o in r)
    if (r.hasOwnProperty(o)) {
      let s = r[o],
        a;
      (t === 0 ? (a = n.hostDirectiveInputs ??= {}) : (a = n.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(i, o),
        gg(n, s));
    }
}
function gg(t, n) {
  n === 'class' ? (t.flags |= 8) : n === 'style' && (t.flags |= 16);
}
function Gp(t, n, e) {
  let { attrs: i, inputs: r, hostDirectiveInputs: o } = t;
  if (i === null || (!e && r === null) || (e && o === null) || Bd(t)) {
    ((t.initialInputs ??= []), t.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < i.length; ) {
    let l = i[a];
    if (l === 0) {
      a += 4;
      continue;
    } else if (l === 5) {
      a += 2;
      continue;
    } else if (typeof l == 'number') break;
    if (!e && r.hasOwnProperty(l)) {
      let c = r[l];
      for (let d of c)
        if (d === n) {
          ((s ??= []), s.push(l, i[a + 1]));
          break;
        }
    } else if (e && o.hasOwnProperty(l)) {
      let c = o[l];
      for (let d = 0; d < c.length; d += 2)
        if (c[d] === n) {
          ((s ??= []), s.push(c[d + 1], i[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((t.initialInputs ??= []), t.initialInputs.push(s));
}
function lE(t, n, e, i, r) {
  t.data[i] = r;
  let o = r.factory || (r.factory = sn(r.type, !0)),
    s = new ri(o, Mt(r), je, null);
  ((t.blueprint[i] = s), (e[i] = s), cE(t, n, i, jm(t, e, r.hostVars, st), r));
}
function cE(t, n, e, i, r) {
  let o = r.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~n.index;
    (dE(s) != a && s.push(a), s.push(e, i, o));
  }
}
function dE(t) {
  let n = t.length;
  for (; n > 0; ) {
    let e = t[--n];
    if (typeof e == 'number' && e < 0) return e;
  }
  return 0;
}
function uE(t, n, e) {
  if (e) {
    if (n.exportAs) for (let i = 0; i < n.exportAs.length; i++) e[n.exportAs[i]] = t;
    Mt(n) && (e[''] = t);
  }
}
function fE(t, n, e) {
  ((t.flags |= 1), (t.directiveStart = n), (t.directiveEnd = n + e), (t.providerIndexes = n));
}
function ru(t, n, e, i, r, o, s, a) {
  let l = n[C],
    c = l.consts,
    d = it(c, s),
    f = Yi(l, t, e, i, d);
  return (
    o && mg(l, n, f, it(c, a), r),
    (f.mergedAttrs = ji(f.mergedAttrs, f.attrs)),
    f.attrs !== null && ea(f, f.attrs, !1),
    f.mergedAttrs !== null && ea(f, f.mergedAttrs, !0),
    l.queries !== null && l.queries.elementStart(l, f),
    f
  );
}
function ou(t, n) {
  (am(t, n), Dc(n) && t.queries.elementEnd(n));
}
function hE(t, n, e, i, r, o) {
  let s = n.consts,
    a = it(s, r),
    l = Yi(n, t, e, i, a);
  if (((l.mergedAttrs = ji(l.mergedAttrs, l.attrs)), o != null)) {
    let c = it(s, o);
    l.localNames = [];
    for (let d = 0; d < c.length; d += 2) l.localNames.push(c[d], -1);
  }
  return (
    l.attrs !== null && ea(l, l.attrs, !1),
    l.mergedAttrs !== null && ea(l, l.mergedAttrs, !0),
    n.queries !== null && n.queries.elementStart(n, l),
    l
  );
}
function su(t) {
  return yg(t) ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t) : !1;
}
function _g(t, n) {
  if (Array.isArray(t)) for (let e = 0; e < t.length; e++) n(t[e]);
  else {
    let e = t[Symbol.iterator](),
      i;
    for (; !(i = e.next()).done; ) n(i.value);
  }
}
function yg(t) {
  return t !== null && (typeof t == 'function' || typeof t == 'object');
}
function pE(t, n, e) {
  return (t[n] = e);
}
function Kt(t, n, e) {
  if (e === st) return !1;
  let i = t[n];
  return Object.is(i, e) ? !1 : ((t[n] = e), !0);
}
function Yc(t, n, e) {
  return function i(r) {
    let o = pn(t) ? nt(t.index, n) : n;
    iu(o, 5);
    let s = n[ve],
      a = Wp(n, s, e, r),
      l = i.__ngNextListenerFn__;
    for (; l; ) ((a = Wp(n, s, l, r) && a), (l = l.__ngNextListenerFn__));
    return a;
  };
}
function Wp(t, n, e, i) {
  let r = T(null);
  try {
    return (ee(6, n, e), e(i) !== !1);
  } catch (o) {
    return (NC(t, o), !1);
  } finally {
    (ee(7, n, e), T(r));
  }
}
function mE(t, n, e, i, r, o, s, a) {
  let l = Oi(t),
    c = !1,
    d = null;
  if ((!i && l && (d = _E(n, e, o, t.index)), d !== null)) {
    let f = d.__ngLastListenerFn__ || d;
    ((f.__ngNextListenerFn__ = s), (d.__ngLastListenerFn__ = s), (c = !0));
  } else {
    let f = pt(t, e),
      p = i ? i(f) : f;
    ID(e, p, o, a);
    let h = r.listen(p, o, a);
    if (!gE(o)) {
      let m = i ? (_) => i(tt(_[t.index])) : t.index;
      vg(m, n, e, o, a, h, !1);
    }
  }
  return c;
}
function gE(t) {
  return t.startsWith('animation') || t.startsWith('transition');
}
function _E(t, n, e, i) {
  let r = t.cleanup;
  if (r != null)
    for (let o = 0; o < r.length - 1; o += 2) {
      let s = r[o];
      if (s === e && r[o + 1] === i) {
        let a = n[Ai],
          l = r[o + 2];
        return a && a.length > l ? a[l] : null;
      }
      typeof s == 'string' && (o += 2);
    }
  return null;
}
function vg(t, n, e, i, r, o, s) {
  let a = n.firstCreatePass ? Rc(n) : null,
    l = Tc(e),
    c = l.length;
  (l.push(r, o), a && a.push(i, t, c, (c + 1) * (s ? -1 : 1)));
}
function qp(t, n, e, i, r, o) {
  let s = n[e],
    a = n[C],
    c = a.data[e].outputs[i],
    f = s[c].subscribe(o);
  vg(t.index, a, n, r, o, f, !0);
}
var gd = Symbol('BINDING');
var _d = class extends ga {
  ngModule;
  constructor(n) {
    (super(), (this.ngModule = n));
  }
  resolveComponentFactory(n) {
    let e = un(n);
    return new Ui(e, this.ngModule);
  }
};
function yE(t) {
  return Object.keys(t).map((n) => {
    let [e, i, r] = t[n],
      o = { propName: e, templateName: n, isSignal: (i & la.SignalBased) !== 0 };
    return (r && (o.transform = r), o);
  });
}
function vE(t) {
  return Object.keys(t).map((n) => ({ propName: t[n], templateName: n }));
}
function bE(t, n, e) {
  let i = n instanceof Me ? n : n?.injector;
  return (
    i && t.getStandaloneInjector !== null && (i = t.getStandaloneInjector(i) || i),
    i ? new md(e, i) : e
  );
}
function DE(t) {
  let n = t.get(Ve, null);
  if (n === null) throw new A(407, !1);
  let e = t.get(pg, null),
    i = t.get(Je, null);
  return { rendererFactory: n, sanitizer: e, changeDetectionScheduler: i, ngReflect: !1 };
}
function CE(t, n) {
  let e = bg(t);
  return km(n, e, e === 'svg' ? Cc : e === 'math' ? rp : null);
}
function bg(t) {
  return (t.selectors[0][0] || 'div').toLowerCase();
}
var Ui = class extends ma {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return ((this.cachedInputs ??= yE(this.componentDef.inputs)), this.cachedInputs);
  }
  get outputs() {
    return ((this.cachedOutputs ??= vE(this.componentDef.outputs)), this.cachedOutputs);
  }
  constructor(n, e) {
    (super(),
      (this.componentDef = n),
      (this.ngModule = e),
      (this.componentType = n.type),
      (this.selector = HD(n.selectors)),
      (this.ngContentSelectors = n.ngContentSelectors ?? []),
      (this.isBoundToModule = !!e));
  }
  create(n, e, i, r, o, s) {
    ee(22);
    let a = T(null);
    try {
      let l = this.componentDef,
        c = EE(i, l, s, o),
        d = bE(l, r || this.ngModule, n),
        f = DE(d),
        p = f.rendererFactory.createRenderer(null, l),
        h = i ? bC(p, i, l.encapsulation, d) : CE(l, p),
        m = s?.some(Yp) || o?.some((v) => typeof v != 'function' && v.bindings.some(Yp)),
        _ = Ud(null, c, null, 512 | Vm(l), null, null, f, p, d, null, Rm(h, d, !0));
      ((_[le] = h), Fs(_));
      let w = null;
      try {
        let v = ru(le, _, 2, '#host', () => c.directiveRegistry, !0, 0);
        (Lm(p, h, v),
          Bi(h, _),
          ha(c, _, v),
          Vd(c, v, _),
          ou(c, v),
          e !== void 0 && IE(v, this.ngContentSelectors, e),
          (w = nt(v.index, _)),
          (_[ve] = w[ve]),
          nu(c, _, null));
      } catch (v) {
        throw (w !== null && od(w), od(_), v);
      } finally {
        (ee(23), Ps());
      }
      return new ta(this.componentType, _, !!m);
    } finally {
      T(a);
    }
  }
};
function EE(t, n, e, i) {
  let r = t ? ['ng-version', '20.3.11'] : UD(n.selectors[0]),
    o = null,
    s = null,
    a = 0;
  if (e)
    for (let d of e)
      ((a += d[gd].requiredVars),
        d.create && ((d.targetIdx = 0), (o ??= []).push(d)),
        d.update && ((d.targetIdx = 0), (s ??= []).push(d)));
  if (i)
    for (let d = 0; d < i.length; d++) {
      let f = i[d];
      if (typeof f != 'function')
        for (let p of f.bindings) {
          a += p[gd].requiredVars;
          let h = d + 1;
          (p.create && ((p.targetIdx = h), (o ??= []).push(p)),
            p.update && ((p.targetIdx = h), (s ??= []).push(p)));
        }
    }
  let l = [n];
  if (i)
    for (let d of i) {
      let f = typeof d == 'function' ? d : d.type,
        p = pc(f);
      l.push(p);
    }
  return Hd(0, null, wE(o, s), 1, a, l, null, null, null, [r], null);
}
function wE(t, n) {
  return !t && !n
    ? null
    : (e) => {
        if (e & 1 && t) for (let i of t) i.create();
        if (e & 2 && n) for (let i of n) i.update();
      };
}
function Yp(t) {
  let n = t[gd].kind;
  return n === 'input' || n === 'twoWay';
}
var ta = class extends hg {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(n, e, i) {
    (super(),
      (this._rootLView = e),
      (this._hasInputBindings = i),
      (this._tNode = Nr(e[C], le)),
      (this.location = Gi(this._tNode, e)),
      (this.instance = nt(this._tNode.index, e)[ve]),
      (this.hostView = this.changeDetectorRef = new _n(e, void 0)),
      (this.componentType = n));
  }
  setInput(n, e) {
    this._hasInputBindings;
    let i = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(n) && Object.is(this.previousInputValues.get(n), e))
    )
      return;
    let r = this._rootLView,
      o = tu(i, r[C], r, n, e);
    this.previousInputValues.set(n, e);
    let s = nt(i.index, r);
    iu(s, 1);
  }
  get injector() {
    return new ii(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(n) {
    this.hostView.onDestroy(n);
  }
};
function IE(t, n, e) {
  let i = (t.projection = []);
  for (let r = 0; r < n.length; r++) {
    let o = e[r];
    i.push(o != null && o.length ? Array.from(o) : null);
  }
}
var Be = (() => {
  class t {
    static __NG_ELEMENT_ID__ = SE;
  }
  return t;
})();
function SE() {
  let t = Te();
  return Cg(t, N());
}
var xE = Be,
  Dg = class extends xE {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(n, e, i) {
      (super(), (this._lContainer = n), (this._hostTNode = e), (this._hostLView = i));
    }
    get element() {
      return Gi(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new ii(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let n = kd(this._hostTNode, this._hostLView);
      if (dm(n)) {
        let e = Ys(n, this._hostLView),
          i = qs(n),
          r = e[C].data[i + 8];
        return new ii(r, e);
      } else return new ii(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(n) {
      let e = Zp(this._lContainer);
      return (e !== null && e[n]) || null;
    }
    get length() {
      return this._lContainer.length - he;
    }
    createEmbeddedView(n, e, i) {
      let r, o;
      typeof i == 'number' ? (r = i) : i != null && ((r = i.index), (o = i.injector));
      let s = Js(this._lContainer, n.ssrId),
        a = n.createEmbeddedViewImpl(e || {}, o, s);
      return (this.insertImpl(a, r, Hi(this._hostTNode, s)), a);
    }
    createComponent(n, e, i, r, o, s, a) {
      let l = n && !Qb(n),
        c;
      if (l) c = e;
      else {
        let w = e || {};
        ((c = w.index),
          (i = w.injector),
          (r = w.projectableNodes),
          (o = w.environmentInjector || w.ngModuleRef),
          (s = w.directives),
          (a = w.bindings));
      }
      let d = l ? n : new Ui(un(n)),
        f = i || this.parentInjector;
      if (!o && d.ngModule == null) {
        let v = (l ? f : this.parentInjector).get(Me, null);
        v && (o = v);
      }
      let p = un(d.componentType ?? {}),
        h = Js(this._lContainer, p?.id ?? null),
        m = h?.firstChild ?? null,
        _ = d.create(f, r, m, o, s, a);
      return (this.insertImpl(_.hostView, c, Hi(this._hostTNode, h)), _);
    }
    insert(n, e) {
      return this.insertImpl(n, e, !0);
    }
    insertImpl(n, e, i) {
      let r = n._lView;
      if (sp(r)) {
        let a = this.indexOf(n);
        if (a !== -1) this.detach(a);
        else {
          let l = r[Ee],
            c = new Dg(l, l[ze], l[Ee]);
          c.detach(c.indexOf(n));
        }
      }
      let o = this._adjustIndex(e),
        s = this._lContainer;
      return (Xr(s, r, o, i), n.attachToViewContainerRef(), uc(Zc(s), o, n), n);
    }
    move(n, e) {
      return this.insert(n, e);
    }
    indexOf(n) {
      let e = Zp(this._lContainer);
      return e !== null ? e.indexOf(n) : -1;
    }
    remove(n) {
      let e = this._adjustIndex(n, -1),
        i = $r(this._lContainer, e);
      i && (xr(Zc(this._lContainer), e), ua(i[C], i));
    }
    detach(n) {
      let e = this._adjustIndex(n, -1),
        i = $r(this._lContainer, e);
      return i && xr(Zc(this._lContainer), e) != null ? new _n(i) : null;
    }
    _adjustIndex(n, e = 0) {
      return n ?? this.length + e;
    }
  };
function Zp(t) {
  return t[Ar];
}
function Zc(t) {
  return t[Ar] || (t[Ar] = []);
}
function Cg(t, n) {
  let e,
    i = n[t.index];
  return (
    ht(i) ? (e = i) : ((e = lg(i, n, null, t)), (n[t.index] = e), zd(n, e)),
    TE(e, n, t, i),
    new Dg(e, t, n)
  );
}
function ME(t, n) {
  let e = t[se],
    i = e.createComment(''),
    r = pt(n, t),
    o = e.parentNode(r);
  return (Qs(e, o, i, e.nextSibling(r), !1), i);
}
var TE = NE,
  RE = () => !1;
function AE(t, n, e) {
  return RE(t, n, e);
}
function NE(t, n, e, i) {
  if (t[hn]) return;
  let r;
  (e.type & 8 ? (r = tt(i)) : (r = ME(n, e)), (t[hn] = r));
}
var yd = class t {
    queryList;
    matches = null;
    constructor(n) {
      this.queryList = n;
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  vd = class t {
    queries;
    constructor(n = []) {
      this.queries = n;
    }
    createEmbeddedView(n) {
      let e = n.queries;
      if (e !== null) {
        let i = n.contentQueries !== null ? n.contentQueries[0] : e.length,
          r = [];
        for (let o = 0; o < i; o++) {
          let s = e.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          r.push(a.clone());
        }
        return new t(r);
      }
      return null;
    }
    insertView(n) {
      this.dirtyQueriesWithMatches(n);
    }
    detachView(n) {
      this.dirtyQueriesWithMatches(n);
    }
    finishViewCreation(n) {
      this.dirtyQueriesWithMatches(n);
    }
    dirtyQueriesWithMatches(n) {
      for (let e = 0; e < this.queries.length; e++)
        lu(n, e).matches !== null && this.queries[e].setDirty();
    }
  },
  na = class {
    flags;
    read;
    predicate;
    constructor(n, e, i = null) {
      ((this.flags = e),
        (this.read = i),
        typeof n == 'string' ? (this.predicate = LE(n)) : (this.predicate = n));
    }
  },
  bd = class t {
    queries;
    constructor(n = []) {
      this.queries = n;
    }
    elementStart(n, e) {
      for (let i = 0; i < this.queries.length; i++) this.queries[i].elementStart(n, e);
    }
    elementEnd(n) {
      for (let e = 0; e < this.queries.length; e++) this.queries[e].elementEnd(n);
    }
    embeddedTView(n) {
      let e = null;
      for (let i = 0; i < this.length; i++) {
        let r = e !== null ? e.length : 0,
          o = this.getByIndex(i).embeddedTView(n, r);
        o && ((o.indexInDeclarationView = i), e !== null ? e.push(o) : (e = [o]));
      }
      return e !== null ? new t(e) : null;
    }
    template(n, e) {
      for (let i = 0; i < this.queries.length; i++) this.queries[i].template(n, e);
    }
    getByIndex(n) {
      return this.queries[n];
    }
    get length() {
      return this.queries.length;
    }
    track(n) {
      this.queries.push(n);
    }
  },
  Dd = class t {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(n, e = -1) {
      ((this.metadata = n), (this._declarationNodeIndex = e));
    }
    elementStart(n, e) {
      this.isApplyingToNode(e) && this.matchTNode(n, e);
    }
    elementEnd(n) {
      this._declarationNodeIndex === n.index && (this._appliesToNextNode = !1);
    }
    template(n, e) {
      this.elementStart(n, e);
    }
    embeddedTView(n, e) {
      return this.isApplyingToNode(n)
        ? ((this.crossesNgTemplate = !0), this.addMatch(-n.index, e), new t(this.metadata))
        : null;
    }
    isApplyingToNode(n) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let e = this._declarationNodeIndex,
          i = n.parent;
        for (; i !== null && i.type & 8 && i.index !== e; ) i = i.parent;
        return e === (i !== null ? i.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(n, e) {
      let i = this.metadata.predicate;
      if (Array.isArray(i))
        for (let r = 0; r < i.length; r++) {
          let o = i[r];
          (this.matchTNodeWithReadOption(n, e, OE(e, o)),
            this.matchTNodeWithReadOption(n, e, $s(e, n, o, !1, !1)));
        }
      else
        i === we
          ? e.type & 4 && this.matchTNodeWithReadOption(n, e, -1)
          : this.matchTNodeWithReadOption(n, e, $s(e, n, i, !1, !1));
    }
    matchTNodeWithReadOption(n, e, i) {
      if (i !== null) {
        let r = this.metadata.read;
        if (r !== null)
          if (r === F || r === Be || (r === we && e.type & 4)) this.addMatch(e.index, -2);
          else {
            let o = $s(e, n, r, !1, !1);
            o !== null && this.addMatch(e.index, o);
          }
        else this.addMatch(e.index, i);
      }
    }
    addMatch(n, e) {
      this.matches === null ? (this.matches = [n, e]) : this.matches.push(n, e);
    }
  };
function OE(t, n) {
  let e = t.localNames;
  if (e !== null) {
    for (let i = 0; i < e.length; i += 2) if (e[i] === n) return e[i + 1];
  }
  return null;
}
function kE(t, n) {
  return t.type & 11 ? Gi(t, n) : t.type & 4 ? pa(t, n) : null;
}
function FE(t, n, e, i) {
  return e === -1 ? kE(n, t) : e === -2 ? PE(t, n, i) : Br(t, t[C], e, n);
}
function PE(t, n, e) {
  if (e === F) return Gi(n, t);
  if (e === we) return pa(n, t);
  if (e === Be) return Cg(n, t);
}
function Eg(t, n, e, i) {
  let r = n[St].queries[i];
  if (r.matches === null) {
    let o = t.data,
      s = e.matches,
      a = [];
    for (let l = 0; s !== null && l < s.length; l += 2) {
      let c = s[l];
      if (c < 0) a.push(null);
      else {
        let d = o[c];
        a.push(FE(n, d, s[l + 1], e.metadata.read));
      }
    }
    r.matches = a;
  }
  return r.matches;
}
function Cd(t, n, e, i) {
  let r = t.queries.getByIndex(e),
    o = r.matches;
  if (o !== null) {
    let s = Eg(t, n, r, e);
    for (let a = 0; a < o.length; a += 2) {
      let l = o[a];
      if (l > 0) i.push(s[a / 2]);
      else {
        let c = o[a + 1],
          d = n[-l];
        for (let f = he; f < d.length; f++) {
          let p = d[f];
          p[fn] === p[Ee] && Cd(p[C], p, c, i);
        }
        if (d[Qn] !== null) {
          let f = d[Qn];
          for (let p = 0; p < f.length; p++) {
            let h = f[p];
            Cd(h[C], h, c, i);
          }
        }
      }
    }
  }
  return i;
}
function au(t, n) {
  return t[St].queries[n].queryList;
}
function wg(t, n, e) {
  let i = new oi((e & 4) === 4);
  return (cp(t, n, i, i.destroy), (n[St] ??= new vd()).queries.push(new yd(i)) - 1);
}
function Ig(t, n, e) {
  let i = pe();
  return (
    i.firstCreatePass && (xg(i, new na(t, n, e), -1), (n & 2) === 2 && (i.staticViewQueries = !0)),
    wg(i, N(), n)
  );
}
function Sg(t, n, e, i) {
  let r = pe();
  if (r.firstCreatePass) {
    let o = Te();
    (xg(r, new na(n, e, i), o.index), VE(r, t), (e & 2) === 2 && (r.staticContentQueries = !0));
  }
  return wg(r, N(), e);
}
function LE(t) {
  return t.split(',').map((n) => n.trim());
}
function xg(t, n, e) {
  (t.queries === null && (t.queries = new bd()), t.queries.track(new Dd(n, e)));
}
function VE(t, n) {
  let e = t.contentQueries || (t.contentQueries = []),
    i = e.length ? e[e.length - 1] : -1;
  n !== i && e.push(t.queries.length - 1, n);
}
function lu(t, n) {
  return t.queries.getByIndex(n);
}
function Mg(t, n) {
  let e = t[C],
    i = lu(e, n);
  return i.crossesNgTemplate ? Cd(e, t, n, []) : Eg(e, t, i, n);
}
function Tg(t, n, e) {
  let i,
    r = hr(() => {
      i._dirtyCounter();
      let o = jE(i, t);
      if (n && o === void 0) throw new A(-951, !1);
      return o;
    });
  return ((i = r[Se]), (i._dirtyCounter = ae(0)), (i._flatValue = void 0), r);
}
function cu(t) {
  return Tg(!0, !1, t);
}
function du(t) {
  return Tg(!0, !0, t);
}
function Rg(t, n) {
  let e = t[Se];
  ((e._lView = N()),
    (e._queryIndex = n),
    (e._queryList = au(e._lView, n)),
    e._queryList.onDirty(() => e._dirtyCounter.update((i) => i + 1)));
}
function jE(t, n) {
  let e = t._lView,
    i = t._queryIndex;
  if (e === void 0 || i === void 0 || e[M] & 4) return n ? void 0 : Le;
  let r = au(e, i),
    o = Mg(e, i);
  return (
    r.reset(o, vm),
    n
      ? r.first
      : r._changesDetected || t._flatValue === void 0
        ? (t._flatValue = r.toArray())
        : t._flatValue
  );
}
var zi = class {};
var Gr = class extends zi {
  injector;
  componentFactoryResolver = new _d(this);
  instance = null;
  constructor(n) {
    super();
    let e = new $n(
      [
        ...n.providers,
        { provide: zi, useValue: this },
        { provide: ga, useValue: this.componentFactoryResolver },
      ],
      n.parent || Ri(),
      n.debugName,
      new Set(['environment']),
    );
    ((this.injector = e), n.runEnvironmentInitializers && e.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(n) {
    this.injector.onDestroy(n);
  }
};
function Ag(t, n, e = null) {
  return new Gr({ providers: t, parent: n, debugName: e, runEnvironmentInitializers: !0 }).injector;
}
var BE = (() => {
  class t {
    _injector;
    cachedInjectors = new Map();
    constructor(e) {
      this._injector = e;
    }
    getOrCreateStandaloneInjector(e) {
      if (!e.standalone) return null;
      if (!this.cachedInjectors.has(e)) {
        let i = mc(!1, e.type),
          r = i.length > 0 ? Ag([i], this._injector, `Standalone[${e.type.name}]`) : null;
        this.cachedInjectors.set(e, r);
      }
      return this.cachedInjectors.get(e);
    }
    ngOnDestroy() {
      try {
        for (let e of this.cachedInjectors.values()) e !== null && e.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = y({ token: t, providedIn: 'environment', factory: () => new t($(Me)) });
  }
  return t;
})();
function B(t) {
  return Yr(() => {
    let n = Ng(t),
      e = Q(x({}, n), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Pd.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (n.standalone && t.dependencies) || null,
        getStandaloneInjector: n.standalone
          ? (r) => r.get(BE).getOrCreateStandaloneInjector(e)
          : null,
        getExternalStyles: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Yt.Emulated,
        styles: t.styles || Le,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      });
    (n.standalone && vn('NgStandalone'), Og(e));
    let i = t.dependencies;
    return ((e.directiveDefs = Kp(i, HE)), (e.pipeDefs = Kp(i, Kh)), (e.id = $E(e)), e);
  });
}
function HE(t) {
  return un(t) || pc(t);
}
function j(t) {
  return Yr(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Le,
    declarations: t.declarations || Le,
    imports: t.imports || Le,
    exports: t.exports || Le,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function UE(t, n) {
  if (t == null) return cn;
  let e = {};
  for (let i in t)
    if (t.hasOwnProperty(i)) {
      let r = t[i],
        o,
        s,
        a,
        l;
      (Array.isArray(r)
        ? ((a = r[0]), (o = r[1]), (s = r[2] ?? o), (l = r[3] || null))
        : ((o = r), (s = r), (a = la.None), (l = null)),
        (e[o] = [i, a, l]),
        (n[o] = s));
    }
  return e;
}
function zE(t) {
  if (t == null) return cn;
  let n = {};
  for (let e in t) t.hasOwnProperty(e) && (n[t[e]] = e);
  return n;
}
function b(t) {
  return Yr(() => {
    let n = Ng(t);
    return (Og(n), n);
  });
}
function _a(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone ?? !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  };
}
function Ng(t) {
  let n = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: n,
    inputConfig: t.inputs || cn,
    exportAs: t.exportAs || null,
    standalone: t.standalone ?? !0,
    signals: t.signals === !0,
    selectors: t.selectors || Le,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: UE(t.inputs, n),
    outputs: zE(t.outputs),
    debugInfo: null,
  };
}
function Og(t) {
  t.features?.forEach((n) => n(t));
}
function Kp(t, n) {
  return t
    ? () => {
        let e = typeof t == 'function' ? t() : t,
          i = [];
        for (let r of e) {
          let o = n(r);
          o !== null && i.push(o);
        }
        return i;
      }
    : null;
}
function $E(t) {
  let n = 0,
    e = typeof t.consts == 'function' ? '' : t.consts,
    i = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      e,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ];
  for (let o of i.join('|')) n = (Math.imul(31, n) + o.charCodeAt(0)) << 0;
  return ((n += 2147483648), 'c' + n);
}
function GE(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function ce(t) {
  let n = GE(t.type),
    e = !0,
    i = [t];
  for (; n; ) {
    let r;
    if (Mt(t)) r = n.ɵcmp || n.ɵdir;
    else {
      if (n.ɵcmp) throw new A(903, !1);
      r = n.ɵdir;
    }
    if (r) {
      if (e) {
        i.push(r);
        let s = t;
        ((s.inputs = Kc(t.inputs)),
          (s.declaredInputs = Kc(t.declaredInputs)),
          (s.outputs = Kc(t.outputs)));
        let a = r.hostBindings;
        a && KE(t, a);
        let l = r.viewQuery,
          c = r.contentQueries;
        if (
          (l && YE(t, l),
          c && ZE(t, c),
          WE(t, r),
          Hh(t.outputs, r.outputs),
          Mt(r) && r.data.animation)
        ) {
          let d = t.data;
          d.animation = (d.animation || []).concat(r.data.animation);
        }
      }
      let o = r.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          (a && a.ngInherit && a(t), a === ce && (e = !1));
        }
    }
    n = Object.getPrototypeOf(n);
  }
  qE(i);
}
function WE(t, n) {
  for (let e in n.inputs) {
    if (!n.inputs.hasOwnProperty(e) || t.inputs.hasOwnProperty(e)) continue;
    let i = n.inputs[e];
    i !== void 0 && ((t.inputs[e] = i), (t.declaredInputs[e] = n.declaredInputs[e]));
  }
}
function qE(t) {
  let n = 0,
    e = null;
  for (let i = t.length - 1; i >= 0; i--) {
    let r = t[i];
    ((r.hostVars = n += r.hostVars), (r.hostAttrs = ji(r.hostAttrs, (e = ji(e, r.hostAttrs)))));
  }
}
function Kc(t) {
  return t === cn ? {} : t === Le ? [] : t;
}
function YE(t, n) {
  let e = t.viewQuery;
  e
    ? (t.viewQuery = (i, r) => {
        (n(i, r), e(i, r));
      })
    : (t.viewQuery = n);
}
function ZE(t, n) {
  let e = t.contentQueries;
  e
    ? (t.contentQueries = (i, r, o) => {
        (n(i, r, o), e(i, r, o));
      })
    : (t.contentQueries = n);
}
function KE(t, n) {
  let e = t.hostBindings;
  e
    ? (t.hostBindings = (i, r) => {
        (n(i, r), e(i, r));
      })
    : (t.hostBindings = n);
}
function kg(t, n, e, i, r, o, s, a) {
  if (e.firstCreatePass) {
    t.mergedAttrs = ji(t.mergedAttrs, t.attrs);
    let d = (t.tView = Hd(
      2,
      t,
      r,
      o,
      s,
      e.directiveRegistry,
      e.pipeRegistry,
      null,
      e.schemas,
      e.consts,
      null,
    ));
    e.queries !== null && (e.queries.template(e, t), (d.queries = e.queries.embeddedTView(t)));
  }
  (a && (t.flags |= a), Fi(t, !1));
  let l = XE(e, n, t, i);
  (js() && Kd(e, n, l, t), Bi(l, n));
  let c = lg(l, n, l, t);
  ((n[i + le] = c), zd(n, c), AE(c, t, n));
}
function QE(t, n, e, i, r, o, s, a, l, c, d) {
  let f = e + le,
    p;
  return (
    n.firstCreatePass
      ? ((p = Yi(n, f, 4, s || null, a || null)),
        Ns() && mg(n, t, p, it(n.consts, c), Xd),
        am(n, p))
      : (p = n.data[f]),
    kg(p, t, n, e, i, r, o, l),
    Oi(p) && ha(n, t, p),
    c != null && Kr(t, p, d),
    p
  );
}
function Wr(t, n, e, i, r, o, s, a, l, c, d) {
  let f = e + le,
    p;
  if (n.firstCreatePass) {
    if (((p = Yi(n, f, 4, s || null, a || null)), c != null)) {
      let h = it(n.consts, c);
      p.localNames = [];
      for (let m = 0; m < h.length; m += 2) p.localNames.push(h[m], -1);
    }
  } else p = n.data[f];
  return (kg(p, t, n, e, i, r, o, l), c != null && Kr(t, p, d), p);
}
function qe(t, n, e, i, r, o, s, a) {
  let l = N(),
    c = pe(),
    d = it(c.consts, o);
  return (QE(l, c, t, n, e, i, r, d, void 0, s, a), qe);
}
var XE = JE;
function JE(t, n, e, i) {
  return (Fr(!0), n[se].createComment(''));
}
var uu = new g('');
function Jr(t) {
  return !!t && typeof t.then == 'function';
}
function Fg(t) {
  return !!t && typeof t.subscribe == 'function';
}
var Pg = new g('');
var fu = (() => {
    class t {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((e, i) => {
        ((this.resolve = e), (this.reject = i));
      });
      appInits = u(Pg, { optional: !0 }) ?? [];
      injector = u(Y);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let e = [];
        for (let r of this.appInits) {
          let o = Ms(this.injector, r);
          if (Jr(o)) e.push(o);
          else if (Fg(o)) {
            let s = new Promise((a, l) => {
              o.subscribe({ complete: a, error: l });
            });
            e.push(s);
          }
        }
        let i = () => {
          ((this.done = !0), this.resolve());
        };
        (Promise.all(e)
          .then(() => {
            i();
          })
          .catch((r) => {
            this.reject(r);
          }),
          e.length === 0 && i(),
          (this.initialized = !0));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Lg = new g('');
function Vg() {
  Tl(() => {
    let t = '';
    throw new A(600, t);
  });
}
function jg(t) {
  return t.isBoundToModule;
}
var ew = 10;
var yt = (() => {
  class t {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = u(Wt);
    afterRenderManager = u(da);
    zonelessEnabled = u(Pr);
    rootEffectScheduler = u(Lr);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new D();
    get allViews() {
      return [
        ...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = u(ti);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(ue((e) => !e));
    }
    constructor() {
      u(yn, { optional: !0 });
    }
    whenStable() {
      let e;
      return new Promise((i) => {
        e = this.isStable.subscribe({
          next: (r) => {
            r && i();
          },
        });
      }).finally(() => {
        e.unsubscribe();
      });
    }
    _injector = u(Me);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(e, i) {
      return this.bootstrapImpl(e, i);
    }
    bootstrapImpl(e, i, r = Y.NULL) {
      return this._injector.get(R).run(() => {
        ee(10);
        let s = e instanceof ma;
        if (!this._injector.get(fu).done) {
          let m = '';
          throw new A(405, m);
        }
        let l;
        (s ? (l = e) : (l = this._injector.get(ga).resolveComponentFactory(e)),
          this.componentTypes.push(l.componentType));
        let c = jg(l) ? void 0 : this._injector.get(zi),
          d = i || l.selector,
          f = l.create(r, [], d, c),
          p = f.location.nativeElement,
          h = f.injector.get(uu, null);
        return (
          h?.registerApplication(p),
          f.onDestroy(() => {
            (this.detachView(f.hostView), jr(this.components, f), h?.unregisterApplication(p));
          }),
          this._loadComponent(f),
          ee(11, f),
          f
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (ee(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(ca.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw new A(101, !1);
      let e = T(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          T(e),
          this.afterTick.next(),
          ee(13));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Ve, null, { optional: !0 }));
      let e = 0;
      for (; this.dirtyFlags !== 0 && e++ < ew; ) (ee(14), this.synchronizeOnce(), ee(15));
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 && ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let e = !1;
      if (this.dirtyFlags & 7) {
        let i = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: r } of this.allViews) {
          if (!i && !Or(r)) continue;
          let o = i && !this.zonelessEnabled ? 0 : 1;
          (rg(r, o), (e = !0));
        }
        if (((this.dirtyFlags &= -5), this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)) return;
      }
      (e || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 && ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: e }) => Or(e))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(e) {
      let i = e;
      (this._views.push(i), i.attachToAppRef(this));
    }
    detachView(e) {
      let i = e;
      (jr(this._views, i), i.detachFromAppRef());
    }
    _loadComponent(e) {
      this.attachView(e.hostView);
      try {
        this.tick();
      } catch (r) {
        this.internalErrorHandler(r);
      }
      (this.components.push(e), this._injector.get(Lg, []).forEach((r) => r(e)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((e) => e()),
            this._views.slice().forEach((e) => e.destroy()));
        } finally {
          ((this._destroyed = !0), (this._views = []), (this._destroyListeners = []));
        }
    }
    onDestroy(e) {
      return (this._destroyListeners.push(e), () => jr(this._destroyListeners, e));
    }
    destroy() {
      if (this._destroyed) throw new A(406, !1);
      let e = this._injector;
      e.destroy && !e.destroyed && e.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
function jr(t, n) {
  let e = t.indexOf(n);
  e > -1 && t.splice(e, 1);
}
function ke(t, n, e, i) {
  let r = N(),
    o = Jn();
  if (Kt(r, o, n)) {
    let s = pe(),
      a = Ls();
    TC(a, r, t, n, e, i);
  }
  return ke;
}
var Mk = typeof document < 'u' && typeof document?.documentElement?.getAnimations == 'function';
var Ed = class {
  destroy(n) {}
  updateValue(n, e) {}
  swap(n, e) {
    let i = Math.min(n, e),
      r = Math.max(n, e),
      o = this.detach(r);
    if (r - i > 1) {
      let s = this.detach(i);
      (this.attach(i, o), this.attach(r, s));
    } else this.attach(i, o);
  }
  move(n, e) {
    this.attach(e, this.detach(n));
  }
};
function Qc(t, n, e, i, r) {
  return t === e && Object.is(n, i) ? 1 : Object.is(r(t, n), r(e, i)) ? -1 : 0;
}
function tw(t, n, e) {
  let i,
    r,
    o = 0,
    s = t.length - 1,
    a = void 0;
  if (Array.isArray(n)) {
    let l = n.length - 1;
    for (; o <= s && o <= l; ) {
      let c = t.at(o),
        d = n[o],
        f = Qc(o, c, o, d, e);
      if (f !== 0) {
        (f < 0 && t.updateValue(o, d), o++);
        continue;
      }
      let p = t.at(s),
        h = n[l],
        m = Qc(s, p, l, h, e);
      if (m !== 0) {
        (m < 0 && t.updateValue(s, h), s--, l--);
        continue;
      }
      let _ = e(o, c),
        w = e(s, p),
        v = e(o, d);
      if (Object.is(v, w)) {
        let Re = e(l, h);
        (Object.is(Re, _) ? (t.swap(o, s), t.updateValue(s, h), l--, s--) : t.move(s, o),
          t.updateValue(o, d),
          o++);
        continue;
      }
      if (((i ??= new ia()), (r ??= Xp(t, o, s, e)), wd(t, i, o, v)))
        (t.updateValue(o, d), o++, s++);
      else if (r.has(v)) (i.set(_, t.detach(o)), s--);
      else {
        let Re = t.create(o, n[o]);
        (t.attach(o, Re), o++, s++);
      }
    }
    for (; o <= l; ) (Qp(t, i, e, o, n[o]), o++);
  } else if (n != null) {
    let l = n[Symbol.iterator](),
      c = l.next();
    for (; !c.done && o <= s; ) {
      let d = t.at(o),
        f = c.value,
        p = Qc(o, d, o, f, e);
      if (p !== 0) (p < 0 && t.updateValue(o, f), o++, (c = l.next()));
      else {
        ((i ??= new ia()), (r ??= Xp(t, o, s, e)));
        let h = e(o, f);
        if (wd(t, i, o, h)) (t.updateValue(o, f), o++, s++, (c = l.next()));
        else if (!r.has(h)) (t.attach(o, t.create(o, f)), o++, s++, (c = l.next()));
        else {
          let m = e(o, d);
          (i.set(m, t.detach(o)), s--);
        }
      }
    }
    for (; !c.done; ) (Qp(t, i, e, t.length, c.value), (c = l.next()));
  }
  for (; o <= s; ) t.destroy(t.detach(s--));
  i?.forEach((l) => {
    t.destroy(l);
  });
}
function wd(t, n, e, i) {
  return n !== void 0 && n.has(i) ? (t.attach(e, n.get(i)), n.delete(i), !0) : !1;
}
function Qp(t, n, e, i, r) {
  if (wd(t, n, i, e(i, r))) t.updateValue(i, r);
  else {
    let o = t.create(i, r);
    t.attach(i, o);
  }
}
function Xp(t, n, e, i) {
  let r = new Set();
  for (let o = n; o <= e; o++) r.add(i(o, t.at(o)));
  return r;
}
var ia = class {
  kvMap = new Map();
  _vMap = void 0;
  has(n) {
    return this.kvMap.has(n);
  }
  delete(n) {
    if (!this.has(n)) return !1;
    let e = this.kvMap.get(n);
    return (
      this._vMap !== void 0 && this._vMap.has(e)
        ? (this.kvMap.set(n, this._vMap.get(e)), this._vMap.delete(e))
        : this.kvMap.delete(n),
      !0
    );
  }
  get(n) {
    return this.kvMap.get(n);
  }
  set(n, e) {
    if (this.kvMap.has(n)) {
      let i = this.kvMap.get(n);
      this._vMap === void 0 && (this._vMap = new Map());
      let r = this._vMap;
      for (; r.has(i); ) i = r.get(i);
      r.set(i, e);
    } else this.kvMap.set(n, e);
  }
  forEach(n) {
    for (let [e, i] of this.kvMap)
      if ((n(i, e), this._vMap !== void 0)) {
        let r = this._vMap;
        for (; r.has(i); ) ((i = r.get(i)), n(i, e));
      }
  }
};
function X(t, n, e, i, r, o, s, a) {
  vn('NgControlFlow');
  let l = N(),
    c = pe(),
    d = it(c.consts, o);
  return (Wr(l, c, t, n, e, i, r, d, 256, s, a), hu);
}
function hu(t, n, e, i, r, o, s, a) {
  vn('NgControlFlow');
  let l = N(),
    c = pe(),
    d = it(c.consts, o);
  return (Wr(l, c, t, n, e, i, r, d, 512, s, a), hu);
}
function J(t, n) {
  vn('NgControlFlow');
  let e = N(),
    i = Jn(),
    r = e[i] !== st ? e[i] : -1,
    o = r !== -1 ? ra(e, le + r) : void 0,
    s = 0;
  if (Kt(e, i, t)) {
    let a = T(null);
    try {
      if ((o !== void 0 && dg(o, s), t !== -1)) {
        let l = le + t,
          c = ra(e, l),
          d = Md(e[C], l),
          f = fg(c, d, e),
          p = Qr(e, d, n, { dehydratedView: f });
        Xr(c, p, s, Hi(d, f));
      }
    } finally {
      T(a);
    }
  } else if (o !== void 0) {
    let a = cg(o, s);
    a !== void 0 && (a[ve] = n);
  }
}
var Id = class {
  lContainer;
  $implicit;
  $index;
  constructor(n, e, i) {
    ((this.lContainer = n), (this.$implicit = e), (this.$index = i));
  }
  get $count() {
    return this.lContainer.length - he;
  }
};
function ya(t, n) {
  return n;
}
var Sd = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(n, e, i) {
    ((this.hasEmptyBlock = n), (this.trackByFn = e), (this.liveCollection = i));
  }
};
function va(t, n, e, i, r, o, s, a, l, c, d, f, p) {
  vn('NgControlFlow');
  let h = N(),
    m = pe(),
    _ = l !== void 0,
    w = N(),
    v = a ? s.bind(w[$e][ve]) : s,
    Re = new Sd(_, v);
  ((w[le + t] = Re),
    Wr(h, m, t + 1, n, e, i, r, it(m.consts, o), 256),
    _ && Wr(h, m, t + 2, l, c, d, f, it(m.consts, p), 512));
}
var xd = class extends Ed {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(n, e, i) {
    (super(), (this.lContainer = n), (this.hostLView = e), (this.templateTNode = i));
  }
  get length() {
    return this.lContainer.length - he;
  }
  at(n) {
    return this.getLView(n)[ve].$implicit;
  }
  attach(n, e) {
    let i = e[Wn];
    ((this.needsIndexUpdate ||= n !== this.length),
      Xr(this.lContainer, e, n, Hi(this.templateTNode, i)),
      nw(this.lContainer, n));
  }
  detach(n) {
    return (
      (this.needsIndexUpdate ||= n !== this.length - 1),
      iw(this.lContainer, n),
      rw(this.lContainer, n)
    );
  }
  create(n, e) {
    let i = Js(this.lContainer, this.templateTNode.tView.ssrId),
      r = Qr(this.hostLView, this.templateTNode, new Id(this.lContainer, e, n), {
        dehydratedView: i,
      });
    return (this.operationsCounter?.recordCreate(), r);
  }
  destroy(n) {
    (ua(n[C], n), this.operationsCounter?.recordDestroy());
  }
  updateValue(n, e) {
    this.getLView(n)[ve].$implicit = e;
  }
  reset() {
    ((this.needsIndexUpdate = !1), this.operationsCounter?.reset());
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let n = 0; n < this.length; n++) this.getLView(n)[ve].$index = n;
  }
  getLView(n) {
    return ow(this.lContainer, n);
  }
};
function ba(t) {
  let n = T(null),
    e = Gt();
  try {
    let i = N(),
      r = i[C],
      o = i[e],
      s = e + 1,
      a = ra(i, s);
    if (o.liveCollection === void 0) {
      let c = Md(r, s);
      o.liveCollection = new xd(a, i, c);
    } else o.liveCollection.reset();
    let l = o.liveCollection;
    if ((tw(l, t, o.trackByFn), l.updateIndexes(), o.hasEmptyBlock)) {
      let c = Jn(),
        d = l.length === 0;
      if (Kt(i, c, d)) {
        let f = e + 2,
          p = ra(i, f);
        if (d) {
          let h = Md(r, f),
            m = fg(p, h, i),
            _ = Qr(i, h, void 0, { dehydratedView: m });
          Xr(p, _, 0, Hi(h, m));
        } else (r.firstUpdatePass && JC(p), dg(p, 0));
      }
    }
  } finally {
    T(n);
  }
}
function ra(t, n) {
  return t[n];
}
function nw(t, n) {
  if (t.length <= he) return;
  let e = he + n,
    i = t[e],
    r = i ? i[Kn] : void 0;
  if (i && r && r.detachedLeaveAnimationFns && r.detachedLeaveAnimationFns.length > 0) {
    let o = i[Ut];
    (sC(o, r), si.delete(i), (r.detachedLeaveAnimationFns = void 0));
  }
}
function iw(t, n) {
  if (t.length <= he) return;
  let e = he + n,
    i = t[e],
    r = i ? i[Kn] : void 0;
  r && r.leave && r.leave.size > 0 && (r.detachedLeaveAnimationFns = []);
}
function rw(t, n) {
  return $r(t, n);
}
function ow(t, n) {
  return cg(t, n);
}
function Md(t, n) {
  return Nr(t, n);
}
function de(t, n, e) {
  let i = N(),
    r = Jn();
  if (Kt(i, r, n)) {
    let o = pe(),
      s = Ls();
    wC(s, i, t, n, i[se], e);
  }
  return de;
}
function Td(t, n, e, i, r) {
  tu(n, t, e, r ? 'class' : 'style', i);
}
function E(t, n, e, i) {
  let r = N(),
    o = r[C],
    s = t + le,
    a = o.firstCreatePass ? ru(s, r, 2, n, Xd, Ns(), e, i) : o.data[s];
  if ((Jd(a, r, t, n, Bg), Oi(a))) {
    let l = r[C];
    (ha(l, r, a), Vd(l, a, r));
  }
  return (i != null && Kr(r, a), E);
}
function S() {
  let t = pe(),
    n = Te(),
    e = eu(n);
  return (
    t.firstCreatePass && ou(t, e),
    Oc(e) && kc(),
    Ac(),
    e.classesWithoutHost != null && iD(e) && Td(t, e, N(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null && rD(e) && Td(t, e, N(), e.stylesWithoutHost, !1),
    S
  );
}
function Ie(t, n, e, i) {
  return (E(t, n, e, i), S(), Ie);
}
function ci(t, n, e, i) {
  let r = N(),
    o = r[C],
    s = t + le,
    a = o.firstCreatePass ? hE(s, o, 2, n, e, i) : o.data[s];
  return (Jd(a, r, t, n, Bg), i != null && Kr(r, a), ci);
}
function di() {
  let t = Te(),
    n = eu(t);
  return (Oc(n) && kc(), Ac(), di);
}
function Zi(t, n, e, i) {
  return (ci(t, n, e, i), di(), Zi);
}
var Bg = (t, n, e, i, r) => (Fr(!0), km(n[se], i, wp()));
function bn(t, n, e) {
  let i = N(),
    r = i[C],
    o = t + le,
    s = r.firstCreatePass ? ru(o, i, 8, 'ng-container', Xd, Ns(), n, e) : r.data[o];
  if ((Jd(s, i, t, 'ng-container', sw), Oi(s))) {
    let a = i[C];
    (ha(a, i, s), Vd(a, s, i));
  }
  return (e != null && Kr(i, s), bn);
}
function Dn() {
  let t = pe(),
    n = Te(),
    e = eu(n);
  return (t.firstCreatePass && ou(t, e), Dn);
}
function He(t, n, e) {
  return (bn(t, n, e), Dn(), He);
}
var sw = (t, n, e, i, r) => (Fr(!0), GD(n[se], ''));
function Cn() {
  return N();
}
function En(t, n, e) {
  let i = N(),
    r = Jn();
  if (Kt(i, r, n)) {
    let o = pe(),
      s = Ls();
    Xm(s, i, t, n, i[se], e);
  }
  return En;
}
var eo = 'en-US';
var aw = eo;
function Hg(t) {
  typeof t == 'string' && (aw = t.toLowerCase().replace(/_/g, '-'));
}
function me(t, n, e) {
  let i = N(),
    r = pe(),
    o = Te();
  return (lw(r, i, i[se], o, t, n, e), me);
}
function lw(t, n, e, i, r, o, s) {
  let a = !0,
    l = null;
  if (((i.type & 3 || s) && ((l ??= Yc(i, n, o)), mE(i, t, n, s, e, r, o, l) && (a = !1)), a)) {
    let c = i.outputs?.[r],
      d = i.hostDirectiveOutputs?.[r];
    if (d && d.length)
      for (let f = 0; f < d.length; f += 2) {
        let p = d[f],
          h = d[f + 1];
        ((l ??= Yc(i, n, o)), qp(i, n, p, h, r, l));
      }
    if (c && c.length) for (let f of c) ((l ??= Yc(i, n, o)), qp(i, n, f, r, r, l));
  }
}
function fe(t = 1) {
  return Ep(t);
}
function cw(t, n) {
  let e = null,
    i = PD(t);
  for (let r = 0; r < n.length; r++) {
    let o = n[r];
    if (o === '*') {
      e = r;
      continue;
    }
    if (i === null ? Om(t, o, !0) : jD(i, o)) return r;
  }
  return e;
}
function Ze(t) {
  let n = N()[$e][ze];
  if (!n.projection) {
    let e = t ? t.length : 1,
      i = (n.projection = Yh(e, null)),
      r = i.slice(),
      o = n.child;
    for (; o !== null; ) {
      if (o.type !== 128) {
        let s = t ? cw(o, t) : 0;
        s !== null && (r[s] ? (r[s].projectionNext = o) : (i[s] = o), (r[s] = o));
      }
      o = o.next;
    }
  }
}
function re(t, n = 0, e, i, r, o) {
  let s = N(),
    a = pe(),
    l = i ? t + 1 : null;
  l !== null && Wr(s, a, l, i, r, o, null, e);
  let c = Yi(a, le + t, 16, null, e || null);
  (c.projection === null && (c.projection = n), Lc());
  let f = !s[Wn] || Nc();
  s[$e][ze].projection[c.projection] === null && l !== null
    ? dw(s, a, l)
    : f && !aa(c) && _C(a, s, c);
}
function dw(t, n, e) {
  let i = le + e,
    r = n.data[i],
    o = t[i],
    s = Js(o, r.tView.ssrId),
    a = Qr(t, r, void 0, { dehydratedView: s });
  Xr(o, a, 0, Hi(r, s));
}
function Ce(t, n, e, i) {
  Sg(t, n, e, i);
}
function be(t, n, e) {
  Ig(t, n, e);
}
function H(t) {
  let n = N(),
    e = pe(),
    i = ks();
  kr(i + 1);
  let r = lu(e, i);
  if (t.dirty && op(n) === ((r.metadata.flags & 2) === 2)) {
    if (r.matches === null) t.reset([]);
    else {
      let o = Mg(n, i);
      (t.reset(o, vm), t.notifyOnChanges());
    }
    return !0;
  }
  return !1;
}
function U() {
  return au(N(), ks());
}
function pu(t, n, e, i, r) {
  Rg(n, Sg(t, e, i, r));
}
function Ki(t, n, e, i) {
  Rg(t, Ig(n, e, i));
}
function Da(t = 1) {
  kr(ks() + t);
}
function Qi(t) {
  let n = hp();
  return wc(n, le + t);
}
function Hs(t, n) {
  return (t << 17) | (n << 2);
}
function ai(t) {
  return (t >> 17) & 32767;
}
function uw(t) {
  return (t & 2) == 2;
}
function fw(t, n) {
  return (t & 131071) | (n << 17);
}
function Rd(t) {
  return t | 2;
}
function $i(t) {
  return (t & 131068) >> 2;
}
function Xc(t, n) {
  return (t & -131069) | (n << 2);
}
function hw(t) {
  return (t & 1) === 1;
}
function Ad(t) {
  return t | 1;
}
function pw(t, n, e, i, r, o) {
  let s = o ? n.classBindings : n.styleBindings,
    a = ai(s),
    l = $i(s);
  t[i] = e;
  let c = !1,
    d;
  if (Array.isArray(e)) {
    let f = e;
    ((d = f[1]), (d === null || Ti(f, d) > 0) && (c = !0));
  } else d = e;
  if (r)
    if (l !== 0) {
      let p = ai(t[a + 1]);
      ((t[i + 1] = Hs(p, a)),
        p !== 0 && (t[p + 1] = Xc(t[p + 1], i)),
        (t[a + 1] = fw(t[a + 1], i)));
    } else ((t[i + 1] = Hs(a, 0)), a !== 0 && (t[a + 1] = Xc(t[a + 1], i)), (a = i));
  else ((t[i + 1] = Hs(l, 0)), a === 0 ? (a = i) : (t[l + 1] = Xc(t[l + 1], i)), (l = i));
  (c && (t[i + 1] = Rd(t[i + 1])),
    Jp(t, d, i, !0),
    Jp(t, d, i, !1),
    mw(n, d, t, i, o),
    (s = Hs(a, l)),
    o ? (n.classBindings = s) : (n.styleBindings = s));
}
function mw(t, n, e, i, r) {
  let o = r ? t.residualClasses : t.residualStyles;
  o != null && typeof n == 'string' && Ti(o, n) >= 0 && (e[i + 1] = Ad(e[i + 1]));
}
function Jp(t, n, e, i) {
  let r = t[e + 1],
    o = n === null,
    s = i ? ai(r) : $i(r),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let l = t[s],
      c = t[s + 1];
    (gw(l, n) && ((a = !0), (t[s + 1] = i ? Ad(c) : Rd(c))), (s = i ? ai(c) : $i(c)));
  }
  a && (t[e + 1] = i ? Rd(r) : Ad(r));
}
function gw(t, n) {
  return t === null || n == null || (Array.isArray(t) ? t[1] : t) === n
    ? !0
    : Array.isArray(t) && typeof n == 'string'
      ? Ti(t, n) >= 0
      : !1;
}
var _t = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function _w(t) {
  return t.substring(_t.key, _t.keyEnd);
}
function yw(t) {
  return (vw(t), Ug(t, zg(t, 0, _t.textEnd)));
}
function Ug(t, n) {
  let e = _t.textEnd;
  return e === n ? -1 : ((n = _t.keyEnd = bw(t, (_t.key = n), e)), zg(t, n, e));
}
function vw(t) {
  ((_t.key = 0), (_t.keyEnd = 0), (_t.value = 0), (_t.valueEnd = 0), (_t.textEnd = t.length));
}
function zg(t, n, e) {
  for (; n < e && t.charCodeAt(n) <= 32; ) n++;
  return n;
}
function bw(t, n, e) {
  for (; n < e && t.charCodeAt(n) > 32; ) n++;
  return n;
}
function ne(t, n) {
  return (Cw(t, n, null, !0), ne);
}
function mu(t) {
  Ew(Tw, Dw, t, !0);
}
function Dw(t, n) {
  for (let e = yw(n); e >= 0; e = Ug(n, e)) Ss(t, _w(n), !0);
}
function Cw(t, n, e, i) {
  let r = N(),
    o = pe(),
    s = jc(2);
  if ((o.firstUpdatePass && Gg(o, t, s, i), n !== st && Kt(r, s, n))) {
    let a = o.data[Gt()];
    Wg(o, a, r, r[se], t, (r[s + 1] = Aw(n, e)), i, s);
  }
}
function Ew(t, n, e, i) {
  let r = pe(),
    o = jc(2);
  r.firstUpdatePass && Gg(r, null, o, i);
  let s = N();
  if (e !== st && Kt(s, o, e)) {
    let a = r.data[Gt()];
    if (qg(a, i) && !$g(r, o)) {
      let l = i ? a.classesWithoutHost : a.stylesWithoutHost;
      (l !== null && (e = bs(l, e || '')), Td(r, a, s, e, i));
    } else Rw(r, a, s, s[se], s[o + 1], (s[o + 1] = Mw(t, n, e)), i, o);
  }
}
function $g(t, n) {
  return n >= t.expandoStartIndex;
}
function Gg(t, n, e, i) {
  let r = t.data;
  if (r[e + 1] === null) {
    let o = r[Gt()],
      s = $g(t, e);
    (qg(o, i) && n === null && !s && (n = !1), (n = ww(r, o, n, i)), pw(r, o, n, e, s, i));
  }
}
function ww(t, n, e, i) {
  let r = vp(t),
    o = i ? n.residualClasses : n.residualStyles;
  if (r === null)
    (i ? n.classBindings : n.styleBindings) === 0 &&
      ((e = Jc(null, t, n, e, i)), (e = qr(e, n.attrs, i)), (o = null));
  else {
    let s = n.directiveStylingLast;
    if (s === -1 || t[s] !== r)
      if (((e = Jc(r, t, n, e, i)), o === null)) {
        let l = Iw(t, n, i);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = Jc(null, t, n, l[1], i)), (l = qr(l, n.attrs, i)), Sw(t, n, i, l));
      } else o = xw(t, n, i);
  }
  return (o !== void 0 && (i ? (n.residualClasses = o) : (n.residualStyles = o)), e);
}
function Iw(t, n, e) {
  let i = e ? n.classBindings : n.styleBindings;
  if ($i(i) !== 0) return t[ai(i)];
}
function Sw(t, n, e, i) {
  let r = e ? n.classBindings : n.styleBindings;
  t[ai(r)] = i;
}
function xw(t, n, e) {
  let i,
    r = n.directiveEnd;
  for (let o = 1 + n.directiveStylingLast; o < r; o++) {
    let s = t[o].hostAttrs;
    i = qr(i, s, e);
  }
  return qr(i, n.attrs, e);
}
function Jc(t, n, e, i, r) {
  let o = null,
    s = e.directiveEnd,
    a = e.directiveStylingLast;
  for (
    a === -1 ? (a = e.directiveStart) : a++;
    a < s && ((o = n[a]), (i = qr(i, o.hostAttrs, r)), o !== t);

  )
    a++;
  return (t !== null && (e.directiveStylingLast = a), i);
}
function qr(t, n, e) {
  let i = e ? 1 : 2,
    r = -1;
  if (n !== null)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      typeof s == 'number'
        ? (r = s)
        : r === i &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]), Ss(t, s, e ? !0 : n[++o]));
    }
  return t === void 0 ? null : t;
}
function Mw(t, n, e) {
  if (e == null || e === '') return Le;
  let i = [],
    r = jd(e);
  if (Array.isArray(r)) for (let o = 0; o < r.length; o++) t(i, r[o], !0);
  else if (typeof r == 'object') for (let o in r) r.hasOwnProperty(o) && t(i, o, r[o]);
  else typeof r == 'string' && n(i, r);
  return i;
}
function Tw(t, n, e) {
  let i = String(n);
  i !== '' && !i.includes(' ') && Ss(t, i, e);
}
function Rw(t, n, e, i, r, o, s, a) {
  r === st && (r = Le);
  let l = 0,
    c = 0,
    d = 0 < r.length ? r[0] : null,
    f = 0 < o.length ? o[0] : null;
  for (; d !== null || f !== null; ) {
    let p = l < r.length ? r[l + 1] : void 0,
      h = c < o.length ? o[c + 1] : void 0,
      m = null,
      _;
    (d === f
      ? ((l += 2), (c += 2), p !== h && ((m = f), (_ = h)))
      : f === null || (d !== null && d < f)
        ? ((l += 2), (m = d))
        : ((c += 2), (m = f), (_ = h)),
      m !== null && Wg(t, n, e, i, m, _, s, a),
      (d = l < r.length ? r[l] : null),
      (f = c < o.length ? o[c] : null));
  }
}
function Wg(t, n, e, i, r, o, s, a) {
  if (!(n.type & 3)) return;
  let l = t.data,
    c = l[a + 1],
    d = hw(c) ? em(l, n, e, r, $i(c), s) : void 0;
  if (!oa(d)) {
    oa(o) || (uw(c) && (o = em(l, null, e, r, a, s)));
    let f = Ec(Gt(), e);
    vC(i, s, f, r, o);
  }
}
function em(t, n, e, i, r, o) {
  let s = n === null,
    a;
  for (; r > 0; ) {
    let l = t[r],
      c = Array.isArray(l),
      d = c ? l[1] : l,
      f = d === null,
      p = e[r + 1];
    p === st && (p = f ? Le : void 0);
    let h = f ? xs(p, i) : d === i ? p : void 0;
    if ((c && !oa(h) && (h = xs(l, i)), oa(h) && ((a = h), s))) return a;
    let m = t[r + 1];
    r = s ? ai(m) : $i(m);
  }
  if (n !== null) {
    let l = o ? n.residualClasses : n.residualStyles;
    l != null && (a = xs(l, i));
  }
  return a;
}
function oa(t) {
  return t !== void 0;
}
function Aw(t, n) {
  return (
    t == null ||
      t === '' ||
      (typeof n == 'string' ? (t = t + n) : typeof t == 'object' && (t = on(jd(t)))),
    t
  );
}
function qg(t, n) {
  return (t.flags & (n ? 8 : 16)) !== 0;
}
function ge(t, n = '') {
  let e = N(),
    i = pe(),
    r = t + le,
    o = i.firstCreatePass ? Yi(i, r, 1, n, null) : i.data[r],
    s = Nw(i, e, o, n, t);
  ((e[r] = s), js() && Kd(i, e, s, o), Fi(o, !1));
}
var Nw = (t, n, e, i, r) => (Fr(!0), zD(n[se], i));
function Yg(t, n, e, i = '') {
  return Kt(t, Jn(), e) ? n + Es(e) + i : st;
}
function Ke(t) {
  return (Qt('', t), Ke);
}
function Qt(t, n, e) {
  let i = N(),
    r = Yg(i, t, n, e);
  return (r !== st && Ow(i, Gt(), r), Qt);
}
function Ow(t, n, e) {
  let i = Ec(n, t);
  $D(t[se], i, e);
}
function gu(t, n, e = '') {
  return Yg(N(), t, n, e);
}
function kw(t, n, e) {
  let i = pe();
  if (i.firstCreatePass) {
    let r = Mt(t);
    (Nd(e, i.data, i.blueprint, r, !0), Nd(n, i.data, i.blueprint, r, !1));
  }
}
function Nd(t, n, e, i, r) {
  if (((t = Ae(t)), Array.isArray(t))) for (let o = 0; o < t.length; o++) Nd(t[o], n, e, i, r);
  else {
    let o = pe(),
      s = N(),
      a = Te(),
      l = zn(t) ? t : Ae(t.provide),
      c = _c(t),
      d = a.providerIndexes & 1048575,
      f = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (zn(t) || !t.multi) {
      let h = new ri(c, r, je, null),
        m = td(l, n, r ? d : d + p, f);
      m === -1
        ? (id(Ks(a, s), o, l),
          ed(o, t, n.length),
          n.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          e.push(h),
          s.push(h))
        : ((e[m] = h), (s[m] = h));
    } else {
      let h = td(l, n, d + p, f),
        m = td(l, n, d, d + p),
        _ = h >= 0 && e[h],
        w = m >= 0 && e[m];
      if ((r && !w) || (!r && !_)) {
        id(Ks(a, s), o, l);
        let v = Lw(r ? Pw : Fw, e.length, r, i, c, t);
        (!r && w && (e[m].providerFactory = v),
          ed(o, t, n.length, 0),
          n.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          r && (a.providerIndexes += 1048576),
          e.push(v),
          s.push(v));
      } else {
        let v = Zg(e[r ? m : h], c, !r && i);
        ed(o, t, h > -1 ? h : m, v);
      }
      !r && i && w && e[m].componentProviders++;
    }
  }
}
function ed(t, n, e, i) {
  let r = zn(n),
    o = tp(n);
  if (r || o) {
    let l = (o ? Ae(n.useClass) : n).prototype.ngOnDestroy;
    if (l) {
      let c = t.destroyHooks || (t.destroyHooks = []);
      if (!r && n.multi) {
        let d = c.indexOf(e);
        d === -1 ? c.push(e, [i, l]) : c[d + 1].push(i, l);
      } else c.push(e, l);
    }
  }
}
function Zg(t, n, e) {
  return (e && t.componentProviders++, t.multi.push(n) - 1);
}
function td(t, n, e, i) {
  for (let r = e; r < i; r++) if (n[r] === t) return r;
  return -1;
}
function Fw(t, n, e, i, r) {
  return Od(this.multi, []);
}
function Pw(t, n, e, i, r) {
  let o = this.multi,
    s;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      l = Br(i, i[C], this.providerFactory.index, r);
    ((s = l.slice(0, a)), Od(o, s));
    for (let c = a; c < l.length; c++) s.push(l[c]);
  } else ((s = []), Od(o, s));
  return s;
}
function Od(t, n) {
  for (let e = 0; e < t.length; e++) {
    let i = t[e];
    n.push(i());
  }
  return n;
}
function Lw(t, n, e, i, r, o) {
  let s = new ri(t, e, je, null);
  return ((s.multi = []), (s.index = n), (s.componentProviders = 0), Zg(s, r, i && !e), s);
}
function ie(t, n = []) {
  return (e) => {
    e.providersResolver = (i, r) => kw(i, r ? r(t) : t, n);
  };
}
function Vw(t, n) {
  let e = t[n];
  return e === st ? void 0 : e;
}
function jw(t, n, e, i, r, o) {
  let s = n + e;
  return Kt(t, s, r) ? pE(t, s + 1, o ? i.call(o, r) : i(r)) : Vw(t, s + 1);
}
function _u(t, n) {
  let e = pe(),
    i,
    r = t + le;
  e.firstCreatePass
    ? ((i = Bw(n, e.pipeRegistry)),
      (e.data[r] = i),
      i.onDestroy && (e.destroyHooks ??= []).push(r, i.onDestroy))
    : (i = e.data[r]);
  let o = i.factory || (i.factory = sn(i.type, !0)),
    s,
    a = Ue(je);
  try {
    let l = Zs(!1),
      c = o();
    return (Zs(l), Ic(e, N(), r, c), c);
  } finally {
    Ue(a);
  }
}
function Bw(t, n) {
  if (n)
    for (let e = n.length - 1; e >= 0; e--) {
      let i = n[e];
      if (t === i.name) return i;
    }
}
function yu(t, n, e) {
  let i = t + le,
    r = N(),
    o = wc(r, i);
  return Hw(r, i) ? jw(r, pp(), n, o.transform, e, o) : o.transform(e);
}
function Hw(t, n) {
  return t[C].data[n].pure;
}
function vu(t, n) {
  return pa(t, n);
}
var Uw = (() => {
  class t {
    zone = u(R);
    changeDetectionScheduler = u(Je);
    applicationRef = u(yt);
    applicationErrorHandler = u(Wt);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
          next: () => {
            this.changeDetectionScheduler.runningTick ||
              this.zone.run(() => {
                try {
                  ((this.applicationRef.dirtyFlags |= 1), this.applicationRef._tick());
                } catch (e) {
                  this.applicationErrorHandler(e);
                }
              });
          },
        }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
function Kg({ ngZoneFactory: t, ignoreChangesOutsideZone: n, scheduleInRootZone: e }) {
  return (
    (t ??= () => new R(Q(x({}, Qg()), { scheduleInRootZone: e }))),
    [
      { provide: R, useFactory: t },
      {
        provide: dn,
        multi: !0,
        useFactory: () => {
          let i = u(Uw, { optional: !0 });
          return () => i.initialize();
        },
      },
      {
        provide: dn,
        multi: !0,
        useFactory: () => {
          let i = u(zw);
          return () => {
            i.initialize();
          };
        },
      },
      n === !0 ? { provide: $c, useValue: !0 } : [],
      { provide: Bs, useValue: e ?? Hm },
      {
        provide: Wt,
        useFactory: () => {
          let i = u(R),
            r = u(Me),
            o;
          return (s) => {
            i.runOutsideAngular(() => {
              r.destroyed && !o
                ? setTimeout(() => {
                    throw s;
                  })
                : ((o ??= r.get(Xe)), o.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function Qg(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var zw = (() => {
  class t {
    subscription = new W();
    initialized = !1;
    zone = u(R);
    pendingTasks = u(ti);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let e = null;
      (!this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (e = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              (R.assertNotInAngularZone(),
                queueMicrotask(() => {
                  e !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(e), (e = null));
                }));
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            (R.assertInAngularZone(), (e ??= this.pendingTasks.add()));
          }),
        ));
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
var bu = (() => {
  class t {
    applicationErrorHandler = u(Wt);
    appRef = u(yt);
    taskService = u(ti);
    ngZone = u(R);
    zonelessEnabled = u(Pr);
    tracing = u(yn, { optional: !0 });
    disableScheduling = u($c, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new W();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(Xs) : null;
    scheduleInRootZone =
      !this.zonelessEnabled && this.zoneIsDefined && (u(Bs, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled && (this.ngZone instanceof Hr || !this.zoneIsDefined)));
    }
    notify(e) {
      if (!this.zonelessEnabled && e === 5) return;
      let i = !1;
      switch (e) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          ((this.appRef.dirtyFlags |= 2), (i = !0));
          break;
        }
        case 12: {
          ((this.appRef.dirtyFlags |= 16), (i = !0));
          break;
        }
        case 13: {
          ((this.appRef.dirtyFlags |= 2), (i = !0));
          break;
        }
        case 11: {
          i = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(i))
      )
        return;
      let r = this.useMicrotaskScheduler ? Lp : Um;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() => r(() => this.tick())))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick()),
            )));
    }
    shouldScheduleTick(e) {
      return !(
        (this.disableScheduling && !e) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(Xs + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
      let e = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (i) {
        (this.taskService.remove(e), this.applicationErrorHandler(i));
      } finally {
        this.cleanup();
      }
      ((this.useMicrotaskScheduler = !0),
        Lp(() => {
          ((this.useMicrotaskScheduler = !1), this.taskService.remove(e));
        }));
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let e = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(e));
      }
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
function Du() {
  return (
    vn('NgZoneless'),
    Mr([
      { provide: Je, useExisting: bu },
      { provide: R, useClass: Hr },
      { provide: Pr, useValue: !0 },
      { provide: Bs, useValue: !1 },
      [],
    ])
  );
}
function $w() {
  return (typeof $localize < 'u' && $localize.locale) || eo;
}
var Cu = new g('', {
  providedIn: 'root',
  factory: () => u(Cu, { optional: !0, skipSelf: !0 }) || $w(),
});
function vt(t) {
  return Ph(t);
}
function bt(t, n) {
  return hr(t, n?.equal);
}
var Eu = class {
  [Se];
  constructor(n) {
    this[Se] = n;
  }
  destroy() {
    this[Se].destroy();
  }
};
function Rt(t, n) {
  let e = n?.injector ?? u(Y),
    i = n?.manualCleanup !== !0 ? e.get(mt) : null,
    r,
    o = e.get(ei, null, { optional: !0 }),
    s = e.get(Je);
  return (
    o !== null
      ? ((r = qw(o.view, s, t)), i instanceof Sr && i._lView === o.view && (i = null))
      : (r = Yw(t, e.get(Lr), s)),
    (r.injector = e),
    i !== null && (r.onDestroyFn = i.onDestroy(() => r.destroy())),
    new Eu(r)
  );
}
var Xg = Q(x({}, Lh), {
    cleanupFns: void 0,
    zone: null,
    onDestroyFn: ni,
    run() {
      let t = Pi(!1);
      try {
        Vh(this);
      } finally {
        Pi(t);
      }
    },
    cleanup() {
      if (!this.cleanupFns?.length) return;
      let t = T(null);
      try {
        for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
      } finally {
        ((this.cleanupFns = []), T(t));
      }
    },
  }),
  Gw = Q(x({}, Xg), {
    consumerMarkedDirty() {
      (this.scheduler.schedule(this), this.notifier.notify(12));
    },
    destroy() {
      (rn(this), this.onDestroyFn(), this.cleanup(), this.scheduler.remove(this));
    },
  }),
  Ww = Q(x({}, Xg), {
    consumerMarkedDirty() {
      ((this.view[M] |= 8192), mn(this.view), this.notifier.notify(13));
    },
    destroy() {
      (rn(this), this.onDestroyFn(), this.cleanup(), this.view[$t]?.delete(this));
    },
  });
function qw(t, n, e) {
  let i = Object.create(Ww);
  return (
    (i.view = t),
    (i.zone = typeof Zone < 'u' ? Zone.current : null),
    (i.notifier = n),
    (i.fn = Jg(i, e)),
    (t[$t] ??= new Set()),
    t[$t].add(i),
    i.consumerMarkedDirty(i),
    i
  );
}
function Yw(t, n, e) {
  let i = Object.create(Gw);
  return (
    (i.fn = Jg(i, t)),
    (i.scheduler = n),
    (i.notifier = e),
    (i.zone = typeof Zone < 'u' ? Zone.current : null),
    i.scheduler.add(i),
    i.notifier.notify(12),
    i
  );
}
function Jg(t, n) {
  return () => {
    n((e) => (t.cleanupFns ??= []).push(e));
  };
}
var Xi = class {
    attributeName;
    constructor(n) {
      this.attributeName = n;
    }
    __NG_ELEMENT_ID__ = () => Fd(this.attributeName);
    toString() {
      return `HostAttributeToken ${this.attributeName}`;
    }
  },
  i0 = new g('');
i0.__NG_ELEMENT_ID__ = (t) => {
  let n = Te();
  if (n === null) throw new A(204, !1);
  if (n.type & 2) return n.value;
  if (t & 8) return null;
  throw new A(204, !1);
};
function e_(t, n) {
  return cu(n);
}
function r0(t, n) {
  return du(n);
}
var no = ((e_.required = r0), e_);
function t_(t, n) {
  return cu(n);
}
function o0(t, n) {
  return du(n);
}
var r_ = ((t_.required = o0), t_);
var Iu = new g(''),
  s0 = new g('');
function to(t) {
  return !t.moduleRef;
}
function a0(t) {
  let n = to(t) ? t.r3Injector : t.moduleRef.injector,
    e = n.get(R);
  return e.run(() => {
    to(t) ? t.r3Injector.resolveInjectorInitializers() : t.moduleRef.resolveInjectorInitializers();
    let i = n.get(Wt),
      r;
    if (
      (e.runOutsideAngular(() => {
        r = e.onError.subscribe({ next: i });
      }),
      to(t))
    ) {
      let o = () => n.destroy(),
        s = t.platformInjector.get(Iu);
      (s.add(o),
        n.onDestroy(() => {
          (r.unsubscribe(), s.delete(o));
        }));
    } else {
      let o = () => t.moduleRef.destroy(),
        s = t.platformInjector.get(Iu);
      (s.add(o),
        t.moduleRef.onDestroy(() => {
          (jr(t.allPlatformModules, t.moduleRef), r.unsubscribe(), s.delete(o));
        }));
    }
    return c0(i, e, () => {
      let o = n.get(ti),
        s = o.add(),
        a = n.get(fu);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let l = n.get(Cu, eo);
            if ((Hg(l || eo), !n.get(s0, !0)))
              return to(t) ? n.get(yt) : (t.allPlatformModules.push(t.moduleRef), t.moduleRef);
            if (to(t)) {
              let d = n.get(yt);
              return (t.rootComponent !== void 0 && d.bootstrap(t.rootComponent), d);
            } else return (l0?.(t.moduleRef, t.allPlatformModules), t.moduleRef);
          })
          .finally(() => void o.remove(s))
      );
    });
  });
}
var l0;
function c0(t, n, e) {
  try {
    let i = e();
    return Jr(i)
      ? i.catch((r) => {
          throw (n.runOutsideAngular(() => t(r)), r);
        })
      : i;
  } catch (i) {
    throw (n.runOutsideAngular(() => t(i)), i);
  }
}
var Ca = null;
function d0(t = [], n) {
  return Y.create({
    name: n,
    providers: [
      { provide: Tr, useValue: 'platform' },
      { provide: Iu, useValue: new Set([() => (Ca = null)]) },
      ...t,
    ],
  });
}
function u0(t = []) {
  if (Ca) return Ca;
  let n = d0(t);
  return ((Ca = n), Vg(), f0(n), n);
}
function f0(t) {
  let n = t.get(sa, null);
  Ms(t, () => {
    n?.forEach((e) => e());
  });
}
var Dt = (() => {
  class t {
    static __NG_ELEMENT_ID__ = h0;
  }
  return t;
})();
function h0(t) {
  return p0(Te(), N(), (t & 16) === 16);
}
function p0(t, n, e) {
  if (pn(t) && !e) {
    let i = nt(t.index, n);
    return new _n(i, i);
  } else if (t.type & 175) {
    let i = n[$e];
    return new _n(i, n);
  }
  return null;
}
var Su = class {
    constructor() {}
    supports(n) {
      return su(n);
    }
    create(n) {
      return new xu(n);
    }
  },
  m0 = (t, n) => n,
  xu = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(n) {
      this._trackByFn = n || m0;
    }
    forEachItem(n) {
      let e;
      for (e = this._itHead; e !== null; e = e._next) n(e);
    }
    forEachOperation(n) {
      let e = this._itHead,
        i = this._removalsHead,
        r = 0,
        o = null;
      for (; e || i; ) {
        let s = !i || (e && e.currentIndex < n_(i, r, o)) ? e : i,
          a = n_(s, r, o),
          l = s.currentIndex;
        if (s === i) (r--, (i = i._nextRemoved));
        else if (((e = e._next), s.previousIndex == null)) r++;
        else {
          o || (o = []);
          let c = a - r,
            d = l - r;
          if (c != d) {
            for (let p = 0; p < c; p++) {
              let h = p < o.length ? o[p] : (o[p] = 0),
                m = h + p;
              d <= m && m < c && (o[p] = h + 1);
            }
            let f = s.previousIndex;
            o[f] = d - c;
          }
        }
        a !== l && n(s, a, l);
      }
    }
    forEachPreviousItem(n) {
      let e;
      for (e = this._previousItHead; e !== null; e = e._nextPrevious) n(e);
    }
    forEachAddedItem(n) {
      let e;
      for (e = this._additionsHead; e !== null; e = e._nextAdded) n(e);
    }
    forEachMovedItem(n) {
      let e;
      for (e = this._movesHead; e !== null; e = e._nextMoved) n(e);
    }
    forEachRemovedItem(n) {
      let e;
      for (e = this._removalsHead; e !== null; e = e._nextRemoved) n(e);
    }
    forEachIdentityChange(n) {
      let e;
      for (e = this._identityChangesHead; e !== null; e = e._nextIdentityChange) n(e);
    }
    diff(n) {
      if ((n == null && (n = []), !su(n))) throw new A(900, !1);
      return this.check(n) ? this : null;
    }
    onDestroy() {}
    check(n) {
      this._reset();
      let e = this._itHead,
        i = !1,
        r,
        o,
        s;
      if (Array.isArray(n)) {
        this.length = n.length;
        for (let a = 0; a < this.length; a++)
          ((o = n[a]),
            (s = this._trackByFn(a, o)),
            e === null || !Object.is(e.trackById, s)
              ? ((e = this._mismatch(e, o, s, a)), (i = !0))
              : (i && (e = this._verifyReinsertion(e, o, s, a)),
                Object.is(e.item, o) || this._addIdentityChange(e, o)),
            (e = e._next));
      } else
        ((r = 0),
          _g(n, (a) => {
            ((s = this._trackByFn(r, a)),
              e === null || !Object.is(e.trackById, s)
                ? ((e = this._mismatch(e, a, s, r)), (i = !0))
                : (i && (e = this._verifyReinsertion(e, a, s, r)),
                  Object.is(e.item, a) || this._addIdentityChange(e, a)),
              (e = e._next),
              r++);
          }),
          (this.length = r));
      return (this._truncate(e), (this.collection = n), this.isDirty);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let n;
        for (n = this._previousItHead = this._itHead; n !== null; n = n._next)
          n._nextPrevious = n._next;
        for (n = this._additionsHead; n !== null; n = n._nextAdded)
          n.previousIndex = n.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, n = this._movesHead;
          n !== null;
          n = n._nextMoved
        )
          n.previousIndex = n.currentIndex;
        ((this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null));
      }
    }
    _mismatch(n, e, i, r) {
      let o;
      return (
        n === null ? (o = this._itTail) : ((o = n._prev), this._remove(n)),
        (n = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(i, null)),
        n !== null
          ? (Object.is(n.item, e) || this._addIdentityChange(n, e), this._reinsertAfter(n, o, r))
          : ((n = this._linkedRecords === null ? null : this._linkedRecords.get(i, r)),
            n !== null
              ? (Object.is(n.item, e) || this._addIdentityChange(n, e), this._moveAfter(n, o, r))
              : (n = this._addAfter(new Mu(e, i), o, r))),
        n
      );
    }
    _verifyReinsertion(n, e, i, r) {
      let o = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(i, null);
      return (
        o !== null
          ? (n = this._reinsertAfter(o, n._prev, r))
          : n.currentIndex != r && ((n.currentIndex = r), this._addToMoves(n, r)),
        n
      );
    }
    _truncate(n) {
      for (; n !== null; ) {
        let e = n._next;
        (this._addToRemovals(this._unlink(n)), (n = e));
      }
      (this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null));
    }
    _reinsertAfter(n, e, i) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(n);
      let r = n._prevRemoved,
        o = n._nextRemoved;
      return (
        r === null ? (this._removalsHead = o) : (r._nextRemoved = o),
        o === null ? (this._removalsTail = r) : (o._prevRemoved = r),
        this._insertAfter(n, e, i),
        this._addToMoves(n, i),
        n
      );
    }
    _moveAfter(n, e, i) {
      return (this._unlink(n), this._insertAfter(n, e, i), this._addToMoves(n, i), n);
    }
    _addAfter(n, e, i) {
      return (
        this._insertAfter(n, e, i),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = n)
          : (this._additionsTail = this._additionsTail._nextAdded = n),
        n
      );
    }
    _insertAfter(n, e, i) {
      let r = e === null ? this._itHead : e._next;
      return (
        (n._next = r),
        (n._prev = e),
        r === null ? (this._itTail = n) : (r._prev = n),
        e === null ? (this._itHead = n) : (e._next = n),
        this._linkedRecords === null && (this._linkedRecords = new Ea()),
        this._linkedRecords.put(n),
        (n.currentIndex = i),
        n
      );
    }
    _remove(n) {
      return this._addToRemovals(this._unlink(n));
    }
    _unlink(n) {
      this._linkedRecords !== null && this._linkedRecords.remove(n);
      let e = n._prev,
        i = n._next;
      return (
        e === null ? (this._itHead = i) : (e._next = i),
        i === null ? (this._itTail = e) : (i._prev = e),
        n
      );
    }
    _addToMoves(n, e) {
      return (
        n.previousIndex === e ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = n)
            : (this._movesTail = this._movesTail._nextMoved = n)),
        n
      );
    }
    _addToRemovals(n) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Ea()),
        this._unlinkedRecords.put(n),
        (n.currentIndex = null),
        (n._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = n), (n._prevRemoved = null))
          : ((n._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = n)),
        n
      );
    }
    _addIdentityChange(n, e) {
      return (
        (n.item = e),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = n)
          : (this._identityChangesTail = this._identityChangesTail._nextIdentityChange = n),
        n
      );
    }
  },
  Mu = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(n, e) {
      ((this.item = n), (this.trackById = e));
    }
  },
  Tu = class {
    _head = null;
    _tail = null;
    add(n) {
      this._head === null
        ? ((this._head = this._tail = n), (n._nextDup = null), (n._prevDup = null))
        : ((this._tail._nextDup = n),
          (n._prevDup = this._tail),
          (n._nextDup = null),
          (this._tail = n));
    }
    get(n, e) {
      let i;
      for (i = this._head; i !== null; i = i._nextDup)
        if ((e === null || e <= i.currentIndex) && Object.is(i.trackById, n)) return i;
      return null;
    }
    remove(n) {
      let e = n._prevDup,
        i = n._nextDup;
      return (
        e === null ? (this._head = i) : (e._nextDup = i),
        i === null ? (this._tail = e) : (i._prevDup = e),
        this._head === null
      );
    }
  },
  Ea = class {
    map = new Map();
    put(n) {
      let e = n.trackById,
        i = this.map.get(e);
      (i || ((i = new Tu()), this.map.set(e, i)), i.add(n));
    }
    get(n, e) {
      let i = n,
        r = this.map.get(i);
      return r ? r.get(n, e) : null;
    }
    remove(n) {
      let e = n.trackById;
      return (this.map.get(e).remove(n) && this.map.delete(e), n);
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function n_(t, n, e) {
  let i = t.previousIndex;
  if (i === null) return i;
  let r = 0;
  return (e && i < e.length && (r = e[i]), i + n + r);
}
function i_() {
  return new Xt([new Su()]);
}
var Xt = (() => {
  class t {
    factories;
    static ɵprov = y({ token: t, providedIn: 'root', factory: i_ });
    constructor(e) {
      this.factories = e;
    }
    static create(e, i) {
      if (i != null) {
        let r = i.factories.slice();
        e = e.concat(r);
      }
      return new t(e);
    }
    static extend(e) {
      return {
        provide: t,
        useFactory: () => {
          let i = u(t, { optional: !0, skipSelf: !0 });
          return t.create(e, i || i_());
        },
      };
    }
    find(e) {
      let i = this.factories.find((r) => r.supports(e));
      if (i != null) return i;
      throw new A(901, !1);
    }
  }
  return t;
})();
function o_(t) {
  let { rootComponent: n, appProviders: e, platformProviders: i, platformRef: r } = t;
  ee(8);
  try {
    let o = r?.injector ?? u0(i),
      s = [Kg({}), { provide: Je, useExisting: bu }, xp, ...(e || [])],
      a = new Gr({ providers: s, parent: o, debugName: '', runEnvironmentInitializers: !1 });
    return a0({ r3Injector: a.injector, platformInjector: o, rootComponent: n });
  } catch (o) {
    return Promise.reject(o);
  } finally {
    ee(9);
  }
}
function K(t) {
  return typeof t == 'boolean' ? t : t != null && t !== 'false';
}
function Ou(t, n = NaN) {
  return !isNaN(parseFloat(t)) && !isNaN(Number(t)) ? Number(t) : n;
}
var wu = Symbol('NOT_SET'),
  s_ = new Set(),
  g0 = Q(x({}, Lo), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    value: wu,
    cleanup: null,
    consumerMarkedDirty() {
      if (this.sequence.impl.executing) {
        if (this.sequence.lastPhase === null || this.sequence.lastPhase < this.phase) return;
        this.sequence.erroredOrDestroyed = !0;
      }
      this.sequence.scheduler.notify(7);
    },
    phaseFn(t) {
      if (((this.sequence.lastPhase = this.phase), !this.dirty)) return this.signal;
      if (((this.dirty = !1), this.value !== wu && !kn(this))) return this.signal;
      try {
        for (let r of this.cleanup ?? s_) r();
      } finally {
        this.cleanup?.clear();
      }
      let n = [];
      (t !== void 0 && n.push(t), n.push(this.registerCleanupFn));
      let e = nn(this),
        i;
      try {
        i = this.userFn.apply(null, n);
      } finally {
        On(this, e);
      }
      return (
        (this.value === wu || !this.equal(this.value, i)) && ((this.value = i), this.version++),
        this.signal
      );
    },
  }),
  Ru = class extends Ur {
    scheduler;
    lastPhase = null;
    nodes = [void 0, void 0, void 0, void 0];
    constructor(n, e, i, r, o, s = null) {
      (super(n, [void 0, void 0, void 0, void 0], i, !1, o.get(mt), s), (this.scheduler = r));
      for (let a of qd) {
        let l = e[a];
        if (l === void 0) continue;
        let c = Object.create(g0);
        ((c.sequence = this),
          (c.phase = a),
          (c.userFn = l),
          (c.dirty = !0),
          (c.signal = () => (Di(c), c.value)),
          (c.signal[Se] = c),
          (c.registerCleanupFn = (d) => (c.cleanup ??= new Set()).add(d)),
          (this.nodes[a] = c),
          (this.hooks[a] = (d) => c.phaseFn(d)));
      }
    }
    afterRun() {
      (super.afterRun(), (this.lastPhase = null));
    }
    destroy() {
      super.destroy();
      for (let n of this.nodes)
        if (n)
          try {
            for (let e of n.cleanup ?? s_) e();
          } finally {
            rn(n);
          }
    }
  };
function a_(t, n) {
  let e = n?.injector ?? u(Y),
    i = e.get(Je),
    r = e.get(da),
    o = e.get(yn, null, { optional: !0 });
  r.impl ??= e.get(Yd);
  let s = t;
  typeof s == 'function' && (s = { mixedReadWrite: t });
  let a = e.get(ei, null, { optional: !0 }),
    l = new Ru(
      r.impl,
      [s.earlyRead, s.write, s.mixedReadWrite, s.read],
      a?.view,
      i,
      e,
      o?.snapshot(null),
    );
  return (r.impl.register(l), l);
}
function wa(t, n) {
  let e = un(t),
    i = n.elementInjector || Ri();
  return new Ui(e).create(
    i,
    n.projectableNodes,
    n.hostElement,
    n.environmentInjector,
    n.directives,
    n.bindings,
  );
}
var d_ = null;
function In() {
  return d_;
}
function ku(t) {
  d_ ??= t;
}
var io = class {},
  Fu = (() => {
    class t {
      historyGo(e) {
        throw new Error('');
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: () => u(u_), providedIn: 'platform' });
    }
    return t;
  })();
var u_ = (() => {
  class t extends Fu {
    _location;
    _history;
    _doc = u(Z);
    constructor() {
      (super(), (this._location = window.location), (this._history = window.history));
    }
    getBaseHrefFromDOM() {
      return In().getBaseHref(this._doc);
    }
    onPopState(e) {
      let i = In().getGlobalEventTarget(this._doc, 'window');
      return (i.addEventListener('popstate', e, !1), () => i.removeEventListener('popstate', e));
    }
    onHashChange(e) {
      let i = In().getGlobalEventTarget(this._doc, 'window');
      return (
        i.addEventListener('hashchange', e, !1),
        () => i.removeEventListener('hashchange', e)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(e) {
      this._location.pathname = e;
    }
    pushState(e, i, r) {
      this._history.pushState(e, i, r);
    }
    replaceState(e, i, r) {
      this._history.replaceState(e, i, r);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(e = 0) {
      this._history.go(e);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: () => new t(), providedIn: 'platform' });
  }
  return t;
})();
function f_(t, n) {
  return t
    ? n
      ? t.endsWith('/')
        ? n.startsWith('/')
          ? t + n.slice(1)
          : t + n
        : n.startsWith('/')
          ? t + n
          : `${t}/${n}`
      : t
    : n;
}
function l_(t) {
  let n = t.search(/#|\?|$/);
  return t[n - 1] === '/' ? t.slice(0, n - 1) + t.slice(n) : t;
}
function wn(t) {
  return t && t[0] !== '?' ? `?${t}` : t;
}
var Ia = (() => {
    class t {
      historyGo(e) {
        throw new Error('');
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: () => u(p_), providedIn: 'root' });
    }
    return t;
  })(),
  h_ = new g(''),
  p_ = (() => {
    class t extends Ia {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(e, i) {
        (super(),
          (this._platformLocation = e),
          (this._baseHref =
            i ?? this._platformLocation.getBaseHrefFromDOM() ?? u(Z).location?.origin ?? ''));
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
      }
      onPopState(e) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(e),
          this._platformLocation.onHashChange(e),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(e) {
        return f_(this._baseHref, e);
      }
      path(e = !1) {
        let i = this._platformLocation.pathname + wn(this._platformLocation.search),
          r = this._platformLocation.hash;
        return r && e ? `${i}${r}` : i;
      }
      pushState(e, i, r, o) {
        let s = this.prepareExternalUrl(r + wn(o));
        this._platformLocation.pushState(e, i, s);
      }
      replaceState(e, i, r, o) {
        let s = this.prepareExternalUrl(r + wn(o));
        this._platformLocation.replaceState(e, i, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(e = 0) {
        this._platformLocation.historyGo?.(e);
      }
      static ɵfac = function (i) {
        return new (i || t)($(Fu), $(h_, 8));
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Sa = (() => {
    class t {
      _subject = new D();
      _basePath;
      _locationStrategy;
      _urlChangeListeners = [];
      _urlChangeSubscription = null;
      constructor(e) {
        this._locationStrategy = e;
        let i = this._locationStrategy.getBaseHref();
        ((this._basePath = v0(l_(c_(i)))),
          this._locationStrategy.onPopState((r) => {
            this._subject.next({ url: this.path(!0), pop: !0, state: r.state, type: r.type });
          }));
      }
      ngOnDestroy() {
        (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []));
      }
      path(e = !1) {
        return this.normalize(this._locationStrategy.path(e));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(e, i = '') {
        return this.path() == this.normalize(e + wn(i));
      }
      normalize(e) {
        return t.stripTrailingSlash(y0(this._basePath, c_(e)));
      }
      prepareExternalUrl(e) {
        return (e && e[0] !== '/' && (e = '/' + e), this._locationStrategy.prepareExternalUrl(e));
      }
      go(e, i = '', r = null) {
        (this._locationStrategy.pushState(r, '', e, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(e + wn(i)), r));
      }
      replaceState(e, i = '', r = null) {
        (this._locationStrategy.replaceState(r, '', e, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(e + wn(i)), r));
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(e = 0) {
        this._locationStrategy.historyGo?.(e);
      }
      onUrlChange(e) {
        return (
          this._urlChangeListeners.push(e),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(e);
            (this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null)));
          }
        );
      }
      _notifyUrlChangeListeners(e = '', i) {
        this._urlChangeListeners.forEach((r) => r(e, i));
      }
      subscribe(e, i, r) {
        return this._subject.subscribe({ next: e, error: i ?? void 0, complete: r ?? void 0 });
      }
      static normalizeQueryParams = wn;
      static joinWithSlash = f_;
      static stripTrailingSlash = l_;
      static ɵfac = function (i) {
        return new (i || t)($(Ia));
      };
      static ɵprov = y({ token: t, factory: () => _0(), providedIn: 'root' });
    }
    return t;
  })();
function _0() {
  return new Sa($(Ia));
}
function y0(t, n) {
  if (!t || !n.startsWith(t)) return n;
  let e = n.substring(t.length);
  return e === '' || ['/', ';', '?', '#'].includes(e[0]) ? e : n;
}
function c_(t) {
  return t.replace(/\/index.html$/, '');
}
function v0(t) {
  if (new RegExp('^(https?:)?//').test(t)) {
    let [, e] = t.split(/\/\/[^\/]+/);
    return e;
  }
  return t;
}
var Pu = /\s+/,
  m_ = [],
  Lu = (() => {
    class t {
      _ngEl;
      _renderer;
      initialClasses = m_;
      rawClass;
      stateMap = new Map();
      constructor(e, i) {
        ((this._ngEl = e), (this._renderer = i));
      }
      set klass(e) {
        this.initialClasses = e != null ? e.trim().split(Pu) : m_;
      }
      set ngClass(e) {
        this.rawClass = typeof e == 'string' ? e.trim().split(Pu) : e;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let e = this.rawClass;
        if (Array.isArray(e) || e instanceof Set) for (let i of e) this._updateState(i, !0);
        else if (e != null) for (let i of Object.keys(e)) this._updateState(i, !!e[i]);
        this._applyStateDiff();
      }
      _updateState(e, i) {
        let r = this.stateMap.get(e);
        r !== void 0
          ? (r.enabled !== i && ((r.changed = !0), (r.enabled = i)), (r.touched = !0))
          : this.stateMap.set(e, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let e of this.stateMap) {
          let i = e[0],
            r = e[1];
          (r.changed
            ? (this._toggleClass(i, r.enabled), (r.changed = !1))
            : r.touched || (r.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (r.touched = !1));
        }
      }
      _toggleClass(e, i) {
        ((e = e.trim()),
          e.length > 0 &&
            e.split(Pu).forEach((r) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, r)
                : this._renderer.removeClass(this._ngEl.nativeElement, r);
            }));
      }
      static ɵfac = function (i) {
        return new (i || t)(je(F), je(We));
      };
      static ɵdir = b({
        type: t,
        selectors: [['', 'ngClass', '']],
        inputs: { klass: [0, 'class', 'klass'], ngClass: 'ngClass' },
      });
    }
    return t;
  })();
var Vu = (() => {
  class t {
    _viewContainerRef;
    _viewRef = null;
    ngTemplateOutletContext = null;
    ngTemplateOutlet = null;
    ngTemplateOutletInjector = null;
    constructor(e) {
      this._viewContainerRef = e;
    }
    ngOnChanges(e) {
      if (this._shouldRecreateView(e)) {
        let i = this._viewContainerRef;
        if ((this._viewRef && i.remove(i.indexOf(this._viewRef)), !this.ngTemplateOutlet)) {
          this._viewRef = null;
          return;
        }
        let r = this._createContextForwardProxy();
        this._viewRef = i.createEmbeddedView(this.ngTemplateOutlet, r, {
          injector: this.ngTemplateOutletInjector ?? void 0,
        });
      }
    }
    _shouldRecreateView(e) {
      return !!e.ngTemplateOutlet || !!e.ngTemplateOutletInjector;
    }
    _createContextForwardProxy() {
      return new Proxy(
        {},
        {
          set: (e, i, r) =>
            this.ngTemplateOutletContext ? Reflect.set(this.ngTemplateOutletContext, i, r) : !1,
          get: (e, i, r) => {
            if (this.ngTemplateOutletContext)
              return Reflect.get(this.ngTemplateOutletContext, i, r);
          },
        },
      );
    }
    static ɵfac = function (i) {
      return new (i || t)(je(Be));
    };
    static ɵdir = b({
      type: t,
      selectors: [['', 'ngTemplateOutlet', '']],
      inputs: {
        ngTemplateOutletContext: 'ngTemplateOutletContext',
        ngTemplateOutlet: 'ngTemplateOutlet',
        ngTemplateOutletInjector: 'ngTemplateOutletInjector',
      },
      features: [Ne],
    });
  }
  return t;
})();
function ju(t, n) {
  n = encodeURIComponent(n);
  for (let e of t.split(';')) {
    let i = e.indexOf('='),
      [r, o] = i == -1 ? [e, ''] : [e.slice(0, i), e.slice(i + 1)];
    if (r.trim() === n) return decodeURIComponent(o);
  }
  return null;
}
var ro = class {};
var Bu = 'browser';
function g_(t) {
  return t === Bu;
}
var oo = class {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    manager;
  },
  xa = (() => {
    class t extends oo {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return !0;
      }
      addEventListener(e, i, r, o) {
        return (e.addEventListener(i, r, o), () => this.removeEventListener(e, i, r, o));
      }
      removeEventListener(e, i, r, o) {
        return e.removeEventListener(i, r, o);
      }
      static ɵfac = function (i) {
        return new (i || t)($(Z));
      };
      static ɵprov = y({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  Ta = new g(''),
  Gu = (() => {
    class t {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(e, i) {
        ((this._zone = i),
          e.forEach((s) => {
            s.manager = this;
          }));
        let r = e.filter((s) => !(s instanceof xa));
        this._plugins = r.slice().reverse();
        let o = e.find((s) => s instanceof xa);
        o && this._plugins.push(o);
      }
      addEventListener(e, i, r, o) {
        return this._findPluginFor(i).addEventListener(e, i, r, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(e) {
        let i = this._eventNameToPlugin.get(e);
        if (i) return i;
        if (((i = this._plugins.find((o) => o.supports(e))), !i)) throw new A(5101, !1);
        return (this._eventNameToPlugin.set(e, i), i);
      }
      static ɵfac = function (i) {
        return new (i || t)($(Ta), $(R));
      };
      static ɵprov = y({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  Hu = 'ng-app-id';
function __(t) {
  for (let n of t) n.remove();
}
function y_(t, n) {
  let e = n.createElement('style');
  return ((e.textContent = t), e);
}
function C0(t, n, e, i) {
  let r = t.head?.querySelectorAll(`style[${Hu}="${n}"],link[${Hu}="${n}"]`);
  if (r)
    for (let o of r)
      (o.removeAttribute(Hu),
        o instanceof HTMLLinkElement
          ? i.set(o.href.slice(o.href.lastIndexOf('/') + 1), { usage: 0, elements: [o] })
          : o.textContent && e.set(o.textContent, { usage: 0, elements: [o] }));
}
function zu(t, n) {
  let e = n.createElement('link');
  return (e.setAttribute('rel', 'stylesheet'), e.setAttribute('href', t), e);
}
var Wu = (() => {
    class t {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(e, i, r, o = {}) {
        ((this.doc = e),
          (this.appId = i),
          (this.nonce = r),
          C0(e, i, this.inline, this.external),
          this.hosts.add(e.head));
      }
      addStyles(e, i) {
        for (let r of e) this.addUsage(r, this.inline, y_);
        i?.forEach((r) => this.addUsage(r, this.external, zu));
      }
      removeStyles(e, i) {
        for (let r of e) this.removeUsage(r, this.inline);
        i?.forEach((r) => this.removeUsage(r, this.external));
      }
      addUsage(e, i, r) {
        let o = i.get(e);
        o
          ? o.usage++
          : i.set(e, {
              usage: 1,
              elements: [...this.hosts].map((s) => this.addElement(s, r(e, this.doc))),
            });
      }
      removeUsage(e, i) {
        let r = i.get(e);
        r && (r.usage--, r.usage <= 0 && (__(r.elements), i.delete(e)));
      }
      ngOnDestroy() {
        for (let [, { elements: e }] of [...this.inline, ...this.external]) __(e);
        this.hosts.clear();
      }
      addHost(e) {
        this.hosts.add(e);
        for (let [i, { elements: r }] of this.inline) r.push(this.addElement(e, y_(i, this.doc)));
        for (let [i, { elements: r }] of this.external) r.push(this.addElement(e, zu(i, this.doc)));
      }
      removeHost(e) {
        this.hosts.delete(e);
      }
      addElement(e, i) {
        return (this.nonce && i.setAttribute('nonce', this.nonce), e.appendChild(i));
      }
      static ɵfac = function (i) {
        return new (i || t)($(Z), $(Wi), $(qi, 8), $(li));
      };
      static ɵprov = y({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  Uu = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  qu = /%COMP%/g;
var b_ = '%COMP%',
  E0 = `_nghost-${b_}`,
  w0 = `_ngcontent-${b_}`,
  I0 = !0,
  S0 = new g('', { providedIn: 'root', factory: () => I0 });
function x0(t) {
  return w0.replace(qu, t);
}
function M0(t) {
  return E0.replace(qu, t);
}
function D_(t, n) {
  return n.map((e) => e.replace(qu, t));
}
var Yu = (() => {
    class t {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      ngZone;
      nonce;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      constructor(e, i, r, o, s, a, l = null, c = null) {
        ((this.eventManager = e),
          (this.sharedStylesHost = i),
          (this.appId = r),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = s),
          (this.ngZone = a),
          (this.nonce = l),
          (this.tracingService = c),
          (this.platformIsServer = !1),
          (this.defaultRenderer = new so(e, s, a, this.platformIsServer, this.tracingService)));
      }
      createRenderer(e, i) {
        if (!e || !i) return this.defaultRenderer;
        let r = this.getOrCreateRenderer(e, i);
        return (r instanceof Ma ? r.applyToHost(e) : r instanceof ao && r.applyStyles(), r);
      }
      getOrCreateRenderer(e, i) {
        let r = this.rendererByCompId,
          o = r.get(i.id);
        if (!o) {
          let s = this.doc,
            a = this.ngZone,
            l = this.eventManager,
            c = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer,
            p = this.tracingService;
          switch (i.encapsulation) {
            case Yt.Emulated:
              o = new Ma(l, c, i, this.appId, d, s, a, f, p);
              break;
            case Yt.ShadowDom:
              return new $u(l, c, e, i, s, a, this.nonce, f, p);
            default:
              o = new ao(l, c, i, d, s, a, f, p);
              break;
          }
          r.set(i.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(e) {
        this.rendererByCompId.delete(e);
      }
      static ɵfac = function (i) {
        return new (i || t)($(Gu), $(Wu), $(Wi), $(S0), $(Z), $(R), $(qi), $(yn, 8));
      };
      static ɵprov = y({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  so = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(n, e, i, r, o) {
      ((this.eventManager = n),
        (this.doc = e),
        (this.ngZone = i),
        (this.platformIsServer = r),
        (this.tracingService = o));
    }
    destroy() {}
    destroyNode = null;
    createElement(n, e) {
      return e ? this.doc.createElementNS(Uu[e] || e, n) : this.doc.createElement(n);
    }
    createComment(n) {
      return this.doc.createComment(n);
    }
    createText(n) {
      return this.doc.createTextNode(n);
    }
    appendChild(n, e) {
      (v_(n) ? n.content : n).appendChild(e);
    }
    insertBefore(n, e, i) {
      n && (v_(n) ? n.content : n).insertBefore(e, i);
    }
    removeChild(n, e) {
      e.remove();
    }
    selectRootElement(n, e) {
      let i = typeof n == 'string' ? this.doc.querySelector(n) : n;
      if (!i) throw new A(-5104, !1);
      return (e || (i.textContent = ''), i);
    }
    parentNode(n) {
      return n.parentNode;
    }
    nextSibling(n) {
      return n.nextSibling;
    }
    setAttribute(n, e, i, r) {
      if (r) {
        e = r + ':' + e;
        let o = Uu[r];
        o ? n.setAttributeNS(o, e, i) : n.setAttribute(e, i);
      } else n.setAttribute(e, i);
    }
    removeAttribute(n, e, i) {
      if (i) {
        let r = Uu[i];
        r ? n.removeAttributeNS(r, e) : n.removeAttribute(`${i}:${e}`);
      } else n.removeAttribute(e);
    }
    addClass(n, e) {
      n.classList.add(e);
    }
    removeClass(n, e) {
      n.classList.remove(e);
    }
    setStyle(n, e, i, r) {
      r & (Zt.DashCase | Zt.Important)
        ? n.style.setProperty(e, i, r & Zt.Important ? 'important' : '')
        : (n.style[e] = i);
    }
    removeStyle(n, e, i) {
      i & Zt.DashCase ? n.style.removeProperty(e) : (n.style[e] = '');
    }
    setProperty(n, e, i) {
      n != null && (n[e] = i);
    }
    setValue(n, e) {
      n.nodeValue = e;
    }
    listen(n, e, i, r) {
      if (typeof n == 'string' && ((n = In().getGlobalEventTarget(this.doc, n)), !n))
        throw new A(5102, !1);
      let o = this.decoratePreventDefault(i);
      return (
        this.tracingService?.wrapEventListener &&
          (o = this.tracingService.wrapEventListener(n, e, o)),
        this.eventManager.addEventListener(n, e, o, r)
      );
    }
    decoratePreventDefault(n) {
      return (e) => {
        if (e === '__ngUnwrap__') return n;
        n(e) === !1 && e.preventDefault();
      };
    }
  };
function v_(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0;
}
var $u = class extends so {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(n, e, i, r, o, s, a, l, c) {
      (super(n, o, s, l, c),
        (this.sharedStylesHost = e),
        (this.hostEl = i),
        (this.shadowRoot = i.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot));
      let d = r.styles;
      d = D_(r.id, d);
      for (let p of d) {
        let h = document.createElement('style');
        (a && h.setAttribute('nonce', a), (h.textContent = p), this.shadowRoot.appendChild(h));
      }
      let f = r.getExternalStyles?.();
      if (f)
        for (let p of f) {
          let h = zu(p, o);
          (a && h.setAttribute('nonce', a), this.shadowRoot.appendChild(h));
        }
    }
    nodeOrShadowRoot(n) {
      return n === this.hostEl ? this.shadowRoot : n;
    }
    appendChild(n, e) {
      return super.appendChild(this.nodeOrShadowRoot(n), e);
    }
    insertBefore(n, e, i) {
      return super.insertBefore(this.nodeOrShadowRoot(n), e, i);
    }
    removeChild(n, e) {
      return super.removeChild(null, e);
    }
    parentNode(n) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  ao = class extends so {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(n, e, i, r, o, s, a, l, c) {
      (super(n, o, s, a, l), (this.sharedStylesHost = e), (this.removeStylesOnCompDestroy = r));
      let d = i.styles;
      ((this.styles = c ? D_(c, d) : d), (this.styleUrls = i.getExternalStyles?.(c)));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        si.size === 0 &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  Ma = class extends ao {
    contentAttr;
    hostAttr;
    constructor(n, e, i, r, o, s, a, l, c) {
      let d = r + '-' + i.id;
      (super(n, e, i, o, s, a, l, c, d), (this.contentAttr = x0(d)), (this.hostAttr = M0(d)));
    }
    applyToHost(n) {
      (this.applyStyles(), this.setAttribute(n, this.hostAttr, ''));
    }
    createElement(n, e) {
      let i = super.createElement(n, e);
      return (super.setAttribute(i, this.contentAttr, ''), i);
    }
  };
var Ra = class t extends io {
    supportsDOMEvents = !0;
    static makeCurrent() {
      ku(new t());
    }
    onAndCancel(n, e, i, r) {
      return (
        n.addEventListener(e, i, r),
        () => {
          n.removeEventListener(e, i, r);
        }
      );
    }
    dispatchEvent(n, e) {
      n.dispatchEvent(e);
    }
    remove(n) {
      n.remove();
    }
    createElement(n, e) {
      return ((e = e || this.getDefaultDocument()), e.createElement(n));
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(n) {
      return n instanceof DocumentFragment;
    }
    getGlobalEventTarget(n, e) {
      return e === 'window' ? window : e === 'document' ? n : e === 'body' ? n.body : null;
    }
    getBaseHref(n) {
      let e = T0();
      return e == null ? null : R0(e);
    }
    resetBaseElement() {
      lo = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(n) {
      return ju(document.cookie, n);
    }
  },
  lo = null;
function T0() {
  return ((lo = lo || document.head.querySelector('base')), lo ? lo.getAttribute('href') : null);
}
function R0(t) {
  return new URL(t, document.baseURI).pathname;
}
var A0 = (() => {
    class t {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  C_ = ['alt', 'control', 'meta', 'shift'],
  N0 = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  O0 = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  E_ = (() => {
    class t extends oo {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return t.parseEventName(e) != null;
      }
      addEventListener(e, i, r, o) {
        let s = t.parseEventName(i),
          a = t.eventCallback(s.fullKey, r, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => In().onAndCancel(e, s.domEventName, a, o));
      }
      static parseEventName(e) {
        let i = e.toLowerCase().split('.'),
          r = i.shift();
        if (i.length === 0 || !(r === 'keydown' || r === 'keyup')) return null;
        let o = t._normalizeKey(i.pop()),
          s = '',
          a = i.indexOf('code');
        if (
          (a > -1 && (i.splice(a, 1), (s = 'code.')),
          C_.forEach((c) => {
            let d = i.indexOf(c);
            d > -1 && (i.splice(d, 1), (s += c + '.'));
          }),
          (s += o),
          i.length != 0 || o.length === 0)
        )
          return null;
        let l = {};
        return ((l.domEventName = r), (l.fullKey = s), l);
      }
      static matchEventFullKeyCode(e, i) {
        let r = N0[e.key] || e.key,
          o = '';
        return (
          i.indexOf('code.') > -1 && ((r = e.code), (o = 'code.')),
          r == null || !r
            ? !1
            : ((r = r.toLowerCase()),
              r === ' ' ? (r = 'space') : r === '.' && (r = 'dot'),
              C_.forEach((s) => {
                if (s !== r) {
                  let a = O0[s];
                  a(e) && (o += s + '.');
                }
              }),
              (o += r),
              o === i)
        );
      }
      static eventCallback(e, i, r) {
        return (o) => {
          t.matchEventFullKeyCode(o, e) && r.runGuarded(() => i(o));
        };
      }
      static _normalizeKey(e) {
        return e === 'esc' ? 'escape' : e;
      }
      static ɵfac = function (i) {
        return new (i || t)($(Z));
      };
      static ɵprov = y({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
function Zu(t, n, e) {
  let i = x({ rootComponent: t, platformRef: e?.platformRef }, k0(n));
  return o_(i);
}
function k0(t) {
  return { appProviders: [...j0, ...(t?.providers ?? [])], platformProviders: V0 };
}
function F0() {
  Ra.makeCurrent();
}
function P0() {
  return new Xe();
}
function L0() {
  return (Ld(document), document);
}
var V0 = [
  { provide: li, useValue: Bu },
  { provide: sa, useValue: F0, multi: !0 },
  { provide: Z, useFactory: L0 },
];
var j0 = [
  { provide: Tr, useValue: 'root' },
  { provide: Xe, useFactory: P0 },
  { provide: Ta, useClass: xa, multi: !0, deps: [Z] },
  { provide: Ta, useClass: E_, multi: !0, deps: [Z] },
  Yu,
  Wu,
  Gu,
  { provide: Ve, useExisting: Yu },
  { provide: ro, useClass: A0 },
  [],
];
var w_ = { providers: [Uc(), Du()] };
var At = class t {
  _locale = ae('en-US');
  locale = this._locale.asReadonly();
  setLocale = this._locale.set.bind(this._locale);
  _currency = ae('USD');
  currency = this._currency.asReadonly();
  setCurrency = this._currency.set.bind(this._currency);
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
};
function Ku(t) {
  return t.buttons === 0 || t.detail === 0;
}
function Qu(t) {
  let n = (t.touches && t.touches[0]) || (t.changedTouches && t.changedTouches[0]);
  return (
    !!n &&
    n.identifier === -1 &&
    (n.radiusX == null || n.radiusX === 1) &&
    (n.radiusY == null || n.radiusY === 1)
  );
}
function ui(t) {
  return t.composedPath ? t.composedPath()[0] : t.target;
}
var Xu;
try {
  Xu = typeof Intl < 'u' && Intl.v8BreakIterator;
} catch {
  Xu = !1;
}
var _e = (() => {
  class t {
    _platformId = u(li);
    isBrowser = this._platformId ? g_(this._platformId) : typeof document == 'object' && !!document;
    EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
    TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
    BLINK =
      this.isBrowser && !!(window.chrome || Xu) && typeof CSS < 'u' && !this.EDGE && !this.TRIDENT;
    WEBKIT =
      this.isBrowser &&
      /AppleWebKit/i.test(navigator.userAgent) &&
      !this.BLINK &&
      !this.EDGE &&
      !this.TRIDENT;
    IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
    ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
    SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
    constructor() {}
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
var co;
function I_() {
  if (co == null && typeof window < 'u')
    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', { get: () => (co = !0) }),
      );
    } finally {
      co = co || !1;
    }
  return co;
}
function Aa(t) {
  return I_() ? t : !!t.capture;
}
function Ju(t) {
  return !isNaN(parseFloat(t)) && !isNaN(Number(t));
}
function Jt(t) {
  return t instanceof F ? t.nativeElement : t;
}
var Na = new WeakMap(),
  Nt = (() => {
    class t {
      _appRef;
      _injector = u(Y);
      _environmentInjector = u(Me);
      load(e) {
        let i = (this._appRef = this._appRef || this._injector.get(yt)),
          r = Na.get(i);
        (r ||
          ((r = { loaders: new Set(), refs: [] }),
          Na.set(i, r),
          i.onDestroy(() => {
            (Na.get(i)?.refs.forEach((o) => o.destroy()), Na.delete(i));
          })),
          r.loaders.has(e) ||
            (r.loaders.add(e),
            r.refs.push(wa(e, { environmentInjector: this._environmentInjector }))));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var S_ = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵcmp = B({
      type: t,
      selectors: [['ng-component']],
      exportAs: ['cdkVisuallyHidden'],
      decls: 0,
      vars: 0,
      template: function (i, r) {},
      styles: [
        `.cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}
`,
      ],
      encapsulation: 2,
      changeDetection: 0,
    });
  }
  return t;
})();
function Ji(t) {
  return Array.isArray(t) ? t : [t];
}
var x_ = new Set(),
  fi,
  Oa = (() => {
    class t {
      _platform = u(_e);
      _nonce = u(qi, { optional: !0 });
      _matchMedia;
      constructor() {
        this._matchMedia =
          this._platform.isBrowser && window.matchMedia ? window.matchMedia.bind(window) : H0;
      }
      matchMedia(e) {
        return (
          (this._platform.WEBKIT || this._platform.BLINK) && B0(e, this._nonce),
          this._matchMedia(e)
        );
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
function B0(t, n) {
  if (!x_.has(t))
    try {
      (fi ||
        ((fi = document.createElement('style')),
        n && fi.setAttribute('nonce', n),
        fi.setAttribute('type', 'text/css'),
        document.head.appendChild(fi)),
        fi.sheet && (fi.sheet.insertRule(`@media ${t} {body{ }}`, 0), x_.add(t)));
    } catch (e) {
      console.error(e);
    }
}
function H0(t) {
  return {
    matches: t === 'all' || t === '',
    media: t,
    addListener: () => {},
    removeListener: () => {},
  };
}
var ef = (() => {
  class t {
    _mediaMatcher = u(Oa);
    _zone = u(R);
    _queries = new Map();
    _destroySubject = new D();
    constructor() {}
    ngOnDestroy() {
      (this._destroySubject.next(), this._destroySubject.complete());
    }
    isMatched(e) {
      return M_(Ji(e)).some((r) => this._registerQuery(r).mql.matches);
    }
    observe(e) {
      let r = M_(Ji(e)).map((s) => this._registerQuery(s).observable),
        o = Bn(r);
      return (
        (o = xi(o.pipe(Dr(1)), o.pipe($l(1), br(0)))),
        o.pipe(
          ue((s) => {
            let a = { matches: !1, breakpoints: {} };
            return (
              s.forEach(({ matches: l, query: c }) => {
                ((a.matches = a.matches || l), (a.breakpoints[c] = l));
              }),
              a
            );
          }),
        )
      );
    }
    _registerQuery(e) {
      if (this._queries.has(e)) return this._queries.get(e);
      let i = this._mediaMatcher.matchMedia(e),
        o = {
          observable: new L((s) => {
            let a = (l) => this._zone.run(() => s.next(l));
            return (
              i.addListener(a),
              () => {
                i.removeListener(a);
              }
            );
          }).pipe(
            Bt(i),
            ue(({ matches: s }) => ({ query: e, matches: s })),
            xe(this._destroySubject),
          ),
          mql: i,
        };
      return (this._queries.set(e, o), o);
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
function M_(t) {
  return t
    .map((n) => n.split(','))
    .reduce((n, e) => n.concat(e))
    .map((n) => n.trim());
}
var U0 = (() => {
  class t {
    create(e) {
      return typeof MutationObserver > 'u' ? null : new MutationObserver(e);
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
var T_ = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ providers: [U0] });
  }
  return t;
})();
var N_ = new g('liveAnnouncerElement', { providedIn: 'root', factory: O_ });
function O_() {
  return null;
}
var k_ = new g('LIVE_ANNOUNCER_DEFAULT_OPTIONS'),
  z0 = 0,
  nf = (() => {
    class t {
      _ngZone = u(R);
      _defaultOptions = u(k_, { optional: !0 });
      _liveElement;
      _document = u(Z);
      _previousTimeout;
      _currentPromise;
      _currentResolve;
      constructor() {
        let e = u(N_, { optional: !0 });
        this._liveElement = e || this._createLiveElement();
      }
      announce(e, ...i) {
        let r = this._defaultOptions,
          o,
          s;
        return (
          i.length === 1 && typeof i[0] == 'number' ? (s = i[0]) : ([o, s] = i),
          this.clear(),
          clearTimeout(this._previousTimeout),
          o || (o = r && r.politeness ? r.politeness : 'polite'),
          s == null && r && (s = r.duration),
          this._liveElement.setAttribute('aria-live', o),
          this._liveElement.id && this._exposeAnnouncerToModals(this._liveElement.id),
          this._ngZone.runOutsideAngular(
            () => (
              this._currentPromise ||
                (this._currentPromise = new Promise((a) => (this._currentResolve = a))),
              clearTimeout(this._previousTimeout),
              (this._previousTimeout = setTimeout(() => {
                ((this._liveElement.textContent = e),
                  typeof s == 'number' &&
                    (this._previousTimeout = setTimeout(() => this.clear(), s)),
                  this._currentResolve?.(),
                  (this._currentPromise = this._currentResolve = void 0));
              }, 100)),
              this._currentPromise
            ),
          )
        );
      }
      clear() {
        this._liveElement && (this._liveElement.textContent = '');
      }
      ngOnDestroy() {
        (clearTimeout(this._previousTimeout),
          this._liveElement?.remove(),
          (this._liveElement = null),
          this._currentResolve?.(),
          (this._currentPromise = this._currentResolve = void 0));
      }
      _createLiveElement() {
        let e = 'cdk-live-announcer-element',
          i = this._document.getElementsByClassName(e),
          r = this._document.createElement('div');
        for (let o = 0; o < i.length; o++) i[o].remove();
        return (
          r.classList.add(e),
          r.classList.add('cdk-visually-hidden'),
          r.setAttribute('aria-atomic', 'true'),
          r.setAttribute('aria-live', 'polite'),
          (r.id = `cdk-live-announcer-${z0++}`),
          this._document.body.appendChild(r),
          r
        );
      }
      _exposeAnnouncerToModals(e) {
        let i = this._document.querySelectorAll(
          'body > .cdk-overlay-container [aria-modal="true"]',
        );
        for (let r = 0; r < i.length; r++) {
          let o = i[r],
            s = o.getAttribute('aria-owns');
          s
            ? s.indexOf(e) === -1 && o.setAttribute('aria-owns', s + ' ' + e)
            : o.setAttribute('aria-owns', e);
        }
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var Sn = (function (t) {
    return (
      (t[(t.NONE = 0)] = 'NONE'),
      (t[(t.BLACK_ON_WHITE = 1)] = 'BLACK_ON_WHITE'),
      (t[(t.WHITE_ON_BLACK = 2)] = 'WHITE_ON_BLACK'),
      t
    );
  })(Sn || {}),
  R_ = 'cdk-high-contrast-black-on-white',
  A_ = 'cdk-high-contrast-white-on-black',
  tf = 'cdk-high-contrast-active',
  rf = (() => {
    class t {
      _platform = u(_e);
      _hasCheckedHighContrastMode;
      _document = u(Z);
      _breakpointSubscription;
      constructor() {
        this._breakpointSubscription = u(ef)
          .observe('(forced-colors: active)')
          .subscribe(() => {
            this._hasCheckedHighContrastMode &&
              ((this._hasCheckedHighContrastMode = !1),
              this._applyBodyHighContrastModeCssClasses());
          });
      }
      getHighContrastMode() {
        if (!this._platform.isBrowser) return Sn.NONE;
        let e = this._document.createElement('div');
        ((e.style.backgroundColor = 'rgb(1,2,3)'),
          (e.style.position = 'absolute'),
          this._document.body.appendChild(e));
        let i = this._document.defaultView || window,
          r = i && i.getComputedStyle ? i.getComputedStyle(e) : null,
          o = ((r && r.backgroundColor) || '').replace(/ /g, '');
        switch ((e.remove(), o)) {
          case 'rgb(0,0,0)':
          case 'rgb(45,50,54)':
          case 'rgb(32,32,32)':
            return Sn.WHITE_ON_BLACK;
          case 'rgb(255,255,255)':
          case 'rgb(255,250,239)':
            return Sn.BLACK_ON_WHITE;
        }
        return Sn.NONE;
      }
      ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
      }
      _applyBodyHighContrastModeCssClasses() {
        if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
          let e = this._document.body.classList;
          (e.remove(tf, R_, A_), (this._hasCheckedHighContrastMode = !0));
          let i = this.getHighContrastMode();
          i === Sn.BLACK_ON_WHITE ? e.add(tf, R_) : i === Sn.WHITE_ON_BLACK && e.add(tf, A_);
        }
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var of = {},
  lt = (() => {
    class t {
      _appId = u(Wi);
      getId(e) {
        return (
          this._appId !== 'ng' && (e += this._appId),
          of.hasOwnProperty(e) || (of[e] = 0),
          `${e}${of[e]++}`
        );
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var $0 = 200,
  ka = class {
    _letterKeyStream = new D();
    _items = [];
    _selectedItemIndex = -1;
    _pressedLetters = [];
    _skipPredicateFn;
    _selectedItem = new D();
    selectedItem = this._selectedItem;
    constructor(n, e) {
      let i = typeof e?.debounceInterval == 'number' ? e.debounceInterval : $0;
      (e?.skipPredicate && (this._skipPredicateFn = e.skipPredicate),
        this.setItems(n),
        this._setupKeyHandler(i));
    }
    destroy() {
      ((this._pressedLetters = []),
        this._letterKeyStream.complete(),
        this._selectedItem.complete());
    }
    setCurrentSelectedItemIndex(n) {
      this._selectedItemIndex = n;
    }
    setItems(n) {
      this._items = n;
    }
    handleKey(n) {
      let e = n.keyCode;
      n.key && n.key.length === 1
        ? this._letterKeyStream.next(n.key.toLocaleUpperCase())
        : ((e >= 65 && e <= 90) || (e >= 48 && e <= 57)) &&
          this._letterKeyStream.next(String.fromCharCode(e));
    }
    isTyping() {
      return this._pressedLetters.length > 0;
    }
    reset() {
      this._pressedLetters = [];
    }
    _setupKeyHandler(n) {
      this._letterKeyStream
        .pipe(
          Wl((e) => this._pressedLetters.push(e)),
          br(n),
          Pe(() => this._pressedLetters.length > 0),
          ue(() => this._pressedLetters.join('').toLocaleUpperCase()),
        )
        .subscribe((e) => {
          for (let i = 1; i < this._items.length + 1; i++) {
            let r = (this._selectedItemIndex + i) % this._items.length,
              o = this._items[r];
            if (
              !this._skipPredicateFn?.(o) &&
              o.getLabel?.().toLocaleUpperCase().trim().indexOf(e) === 0
            ) {
              this._selectedItem.next(o);
              break;
            }
          }
          this._pressedLetters = [];
        });
    }
  };
function Ot(t, ...n) {
  return n.length ? n.some((e) => t[e]) : t.altKey || t.shiftKey || t.ctrlKey || t.metaKey;
}
var Fa = class {
  _items;
  _activeItemIndex = ae(-1);
  _activeItem = ae(null);
  _wrap = !1;
  _typeaheadSubscription = W.EMPTY;
  _itemChangesSubscription;
  _vertical = !0;
  _horizontal;
  _allowedModifierKeys = [];
  _homeAndEnd = !1;
  _pageUpAndDown = { enabled: !1, delta: 10 };
  _effectRef;
  _typeahead;
  _skipPredicateFn = (n) => n.disabled;
  constructor(n, e) {
    ((this._items = n),
      n instanceof oi
        ? (this._itemChangesSubscription = n.changes.subscribe((i) =>
            this._itemsChanged(i.toArray()),
          ))
        : qt(n) && (this._effectRef = Rt(() => this._itemsChanged(n()), { injector: e })));
  }
  tabOut = new D();
  change = new D();
  skipPredicate(n) {
    return ((this._skipPredicateFn = n), this);
  }
  withWrap(n = !0) {
    return ((this._wrap = n), this);
  }
  withVerticalOrientation(n = !0) {
    return ((this._vertical = n), this);
  }
  withHorizontalOrientation(n) {
    return ((this._horizontal = n), this);
  }
  withAllowedModifierKeys(n) {
    return ((this._allowedModifierKeys = n), this);
  }
  withTypeAhead(n = 200) {
    this._typeaheadSubscription.unsubscribe();
    let e = this._getItemsArray();
    return (
      (this._typeahead = new ka(e, {
        debounceInterval: typeof n == 'number' ? n : void 0,
        skipPredicate: (i) => this._skipPredicateFn(i),
      })),
      (this._typeaheadSubscription = this._typeahead.selectedItem.subscribe((i) => {
        this.setActiveItem(i);
      })),
      this
    );
  }
  cancelTypeahead() {
    return (this._typeahead?.reset(), this);
  }
  withHomeAndEnd(n = !0) {
    return ((this._homeAndEnd = n), this);
  }
  withPageUpDown(n = !0, e = 10) {
    return ((this._pageUpAndDown = { enabled: n, delta: e }), this);
  }
  setActiveItem(n) {
    let e = this._activeItem();
    (this.updateActiveItem(n),
      this._activeItem() !== e && this.change.next(this._activeItemIndex()));
  }
  onKeydown(n) {
    let e = n.keyCode,
      r = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].every(
        (o) => !n[o] || this._allowedModifierKeys.indexOf(o) > -1,
      );
    switch (e) {
      case 9:
        this.tabOut.next();
        return;
      case 40:
        if (this._vertical && r) {
          this.setNextItemActive();
          break;
        } else return;
      case 38:
        if (this._vertical && r) {
          this.setPreviousItemActive();
          break;
        } else return;
      case 39:
        if (this._horizontal && r) {
          this._horizontal === 'rtl' ? this.setPreviousItemActive() : this.setNextItemActive();
          break;
        } else return;
      case 37:
        if (this._horizontal && r) {
          this._horizontal === 'rtl' ? this.setNextItemActive() : this.setPreviousItemActive();
          break;
        } else return;
      case 36:
        if (this._homeAndEnd && r) {
          this.setFirstItemActive();
          break;
        } else return;
      case 35:
        if (this._homeAndEnd && r) {
          this.setLastItemActive();
          break;
        } else return;
      case 33:
        if (this._pageUpAndDown.enabled && r) {
          let o = this._activeItemIndex() - this._pageUpAndDown.delta;
          this._setActiveItemByIndex(o > 0 ? o : 0, 1);
          break;
        } else return;
      case 34:
        if (this._pageUpAndDown.enabled && r) {
          let o = this._activeItemIndex() + this._pageUpAndDown.delta,
            s = this._getItemsArray().length;
          this._setActiveItemByIndex(o < s ? o : s - 1, -1);
          break;
        } else return;
      default:
        (r || Ot(n, 'shiftKey')) && this._typeahead?.handleKey(n);
        return;
    }
    (this._typeahead?.reset(), n.preventDefault());
  }
  get activeItemIndex() {
    return this._activeItemIndex();
  }
  get activeItem() {
    return this._activeItem();
  }
  isTyping() {
    return !!this._typeahead && this._typeahead.isTyping();
  }
  setFirstItemActive() {
    this._setActiveItemByIndex(0, 1);
  }
  setLastItemActive() {
    this._setActiveItemByIndex(this._getItemsArray().length - 1, -1);
  }
  setNextItemActive() {
    this._activeItemIndex() < 0 ? this.setFirstItemActive() : this._setActiveItemByDelta(1);
  }
  setPreviousItemActive() {
    this._activeItemIndex() < 0 && this._wrap
      ? this.setLastItemActive()
      : this._setActiveItemByDelta(-1);
  }
  updateActiveItem(n) {
    let e = this._getItemsArray(),
      i = typeof n == 'number' ? n : e.indexOf(n),
      r = e[i];
    (this._activeItem.set(r ?? null),
      this._activeItemIndex.set(i),
      this._typeahead?.setCurrentSelectedItemIndex(i));
  }
  destroy() {
    (this._typeaheadSubscription.unsubscribe(),
      this._itemChangesSubscription?.unsubscribe(),
      this._effectRef?.destroy(),
      this._typeahead?.destroy(),
      this.tabOut.complete(),
      this.change.complete());
  }
  _setActiveItemByDelta(n) {
    this._wrap ? this._setActiveInWrapMode(n) : this._setActiveInDefaultMode(n);
  }
  _setActiveInWrapMode(n) {
    let e = this._getItemsArray();
    for (let i = 1; i <= e.length; i++) {
      let r = (this._activeItemIndex() + n * i + e.length) % e.length,
        o = e[r];
      if (!this._skipPredicateFn(o)) {
        this.setActiveItem(r);
        return;
      }
    }
  }
  _setActiveInDefaultMode(n) {
    this._setActiveItemByIndex(this._activeItemIndex() + n, n);
  }
  _setActiveItemByIndex(n, e) {
    let i = this._getItemsArray();
    if (i[n]) {
      for (; this._skipPredicateFn(i[n]); ) if (((n += e), !i[n])) return;
      this.setActiveItem(n);
    }
  }
  _getItemsArray() {
    return qt(this._items)
      ? this._items()
      : this._items instanceof oi
        ? this._items.toArray()
        : this._items;
  }
  _itemsChanged(n) {
    this._typeahead?.setItems(n);
    let e = this._activeItem();
    if (e) {
      let i = n.indexOf(e);
      i > -1 &&
        i !== this._activeItemIndex() &&
        (this._activeItemIndex.set(i), this._typeahead?.setCurrentSelectedItemIndex(i));
    }
  }
};
var uo = class extends Fa {
  setActiveItem(n) {
    (this.activeItem && this.activeItem.setInactiveStyles(),
      super.setActiveItem(n),
      this.activeItem && this.activeItem.setActiveStyles());
  }
};
var V_ = ' ';
function j_(t, n, e) {
  let i = B_(t, n);
  ((e = e.trim()), !i.some((r) => r.trim() === e) && (i.push(e), t.setAttribute(n, i.join(V_))));
}
function lf(t, n, e) {
  let i = B_(t, n);
  e = e.trim();
  let r = i.filter((o) => o !== e);
  r.length ? t.setAttribute(n, r.join(V_)) : t.removeAttribute(n);
}
function B_(t, n) {
  return t.getAttribute(n)?.match(/\S+/g) ?? [];
}
var G0 = new g('cdk-dir-doc', { providedIn: 'root', factory: W0 });
function W0() {
  return u(Z);
}
var q0 =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function H_(t) {
  let n = t?.toLowerCase() || '';
  return n === 'auto' && typeof navigator < 'u' && navigator?.language
    ? q0.test(navigator.language)
      ? 'rtl'
      : 'ltr'
    : n === 'rtl'
      ? 'rtl'
      : 'ltr';
}
var kt = (() => {
  class t {
    get value() {
      return this.valueSignal();
    }
    valueSignal = ae('ltr');
    change = new G();
    constructor() {
      let e = u(G0, { optional: !0 });
      if (e) {
        let i = e.body ? e.body.dir : null,
          r = e.documentElement ? e.documentElement.dir : null;
        this.valueSignal.set(H_(i || r || 'ltr'));
      }
    }
    ngOnDestroy() {
      this.change.complete();
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
var xn = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({});
  }
  return t;
})();
function De(t) {
  return t == null ? '' : typeof t == 'string' ? t : `${t}px`;
}
function en(t) {
  return t != null && `${t}` != 'false';
}
var hi;
function z_() {
  if (hi == null) {
    if (typeof document != 'object' || !document || typeof Element != 'function' || !Element)
      return ((hi = !1), hi);
    if (document.documentElement?.style && 'scrollBehavior' in document.documentElement.style)
      hi = !0;
    else {
      let t = Element.prototype.scrollTo;
      t ? (hi = !/\{\s*\[native code\]\s*\}/.test(t.toString())) : (hi = !1);
    }
  }
  return hi;
}
function cf() {
  return (
    (typeof __karma__ < 'u' && !!__karma__) ||
    (typeof jasmine < 'u' && !!jasmine) ||
    (typeof jest < 'u' && !!jest) ||
    (typeof Mocha < 'u' && !!Mocha)
  );
}
var er,
  $_ = [
    'color',
    'button',
    'checkbox',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week',
  ];
function df() {
  if (er) return er;
  if (typeof document != 'object' || !document) return ((er = new Set($_)), er);
  let t = document.createElement('input');
  return ((er = new Set($_.filter((n) => (t.setAttribute('type', n), t.type === n)))), er);
}
var uf = class {
    _box;
    _destroyed = new D();
    _resizeSubject = new D();
    _resizeObserver;
    _elementObservables = new Map();
    constructor(n) {
      ((this._box = n),
        typeof ResizeObserver < 'u' &&
          (this._resizeObserver = new ResizeObserver((e) => this._resizeSubject.next(e))));
    }
    observe(n) {
      return (
        this._elementObservables.has(n) ||
          this._elementObservables.set(
            n,
            new L((e) => {
              let i = this._resizeSubject.subscribe(e);
              return (
                this._resizeObserver?.observe(n, { box: this._box }),
                () => {
                  (this._resizeObserver?.unobserve(n),
                    i.unsubscribe(),
                    this._elementObservables.delete(n));
                }
              );
            }).pipe(
              Pe((e) => e.some((i) => i.target === n)),
              ms({ bufferSize: 1, refCount: !0 }),
              xe(this._destroyed),
            ),
          ),
        this._elementObservables.get(n)
      );
    }
    destroy() {
      (this._destroyed.next(),
        this._destroyed.complete(),
        this._resizeSubject.complete(),
        this._elementObservables.clear());
    }
  },
  G_ = (() => {
    class t {
      _cleanupErrorListener;
      _observers = new Map();
      _ngZone = u(R);
      constructor() {
        typeof ResizeObserver < 'u';
      }
      ngOnDestroy() {
        for (let [, e] of this._observers) e.destroy();
        (this._observers.clear(), this._cleanupErrorListener?.());
      }
      observe(e, i) {
        let r = i?.box || 'content-box';
        return (
          this._observers.has(r) || this._observers.set(r, new uf(r)),
          this._observers.get(r).observe(e)
        );
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var Y0 = new g('MATERIAL_ANIMATIONS');
var W_ = null;
function Z0() {
  return u(Y0, { optional: !0 })?.animationsDisabled || u(Zr, { optional: !0 }) === 'NoopAnimations'
    ? 'di-disabled'
    : ((W_ ??= u(Oa).matchMedia('(prefers-reduced-motion)').matches),
      W_ ? 'reduced-motion' : 'enabled');
}
function Mn() {
  return Z0() !== 'enabled';
}
var K0 = ['notch'],
  Q0 = ['matFormFieldNotchedOutline', ''],
  X0 = ['*'],
  q_ = ['iconPrefixContainer'],
  Y_ = ['textPrefixContainer'],
  Z_ = ['iconSuffixContainer'],
  K_ = ['textSuffixContainer'],
  J0 = ['textField'],
  eI = [
    '*',
    [['mat-label']],
    [
      ['', 'matPrefix', ''],
      ['', 'matIconPrefix', ''],
    ],
    [['', 'matTextPrefix', '']],
    [['', 'matTextSuffix', '']],
    [
      ['', 'matSuffix', ''],
      ['', 'matIconSuffix', ''],
    ],
    [['mat-error'], ['', 'matError', '']],
    [['mat-hint', 3, 'align', 'end']],
    [['mat-hint', 'align', 'end']],
  ],
  tI = [
    '*',
    'mat-label',
    '[matPrefix], [matIconPrefix]',
    '[matTextPrefix]',
    '[matTextSuffix]',
    '[matSuffix], [matIconSuffix]',
    'mat-error, [matError]',
    "mat-hint:not([align='end'])",
    "mat-hint[align='end']",
  ];
function nI(t, n) {
  t & 1 && Ie(0, 'span', 21);
}
function iI(t, n) {
  if ((t & 1 && (E(0, 'label', 20), re(1, 1), X(2, nI, 1, 0, 'span', 21), S()), t & 2)) {
    let e = fe(2);
    (de('floating', e._shouldLabelFloat())('monitorResize', e._hasOutline())('id', e._labelId),
      ke('for', e._control.disableAutomaticLabeling ? null : e._control.id),
      I(2),
      J(!e.hideRequiredMarker && e._control.required ? 2 : -1));
  }
}
function rI(t, n) {
  if ((t & 1 && X(0, iI, 3, 5, 'label', 20), t & 2)) {
    let e = fe();
    J(e._hasFloatingLabel() ? 0 : -1);
  }
}
function oI(t, n) {
  t & 1 && Ie(0, 'div', 7);
}
function sI(t, n) {}
function aI(t, n) {
  if ((t & 1 && qe(0, sI, 0, 0, 'ng-template', 13), t & 2)) {
    fe(2);
    let e = Qi(1);
    de('ngTemplateOutlet', e);
  }
}
function lI(t, n) {
  if ((t & 1 && (E(0, 'div', 9), X(1, aI, 1, 1, null, 13), S()), t & 2)) {
    let e = fe();
    (de('matFormFieldNotchedOutlineOpen', e._shouldLabelFloat()),
      I(),
      J(e._forceDisplayInfixLabel() ? -1 : 1));
  }
}
function cI(t, n) {
  t & 1 && (E(0, 'div', 10, 2), re(2, 2), S());
}
function dI(t, n) {
  t & 1 && (E(0, 'div', 11, 3), re(2, 3), S());
}
function uI(t, n) {}
function fI(t, n) {
  if ((t & 1 && qe(0, uI, 0, 0, 'ng-template', 13), t & 2)) {
    fe();
    let e = Qi(1);
    de('ngTemplateOutlet', e);
  }
}
function hI(t, n) {
  t & 1 && (E(0, 'div', 14, 4), re(2, 4), S());
}
function pI(t, n) {
  t & 1 && (E(0, 'div', 15, 5), re(2, 5), S());
}
function mI(t, n) {
  t & 1 && Ie(0, 'div', 16);
}
function gI(t, n) {
  t & 1 && (E(0, 'div', 18), re(1, 6), S());
}
function _I(t, n) {
  if ((t & 1 && (E(0, 'mat-hint', 22), ge(1), S()), t & 2)) {
    let e = fe(2);
    (de('id', e._hintLabelId), I(), Ke(e.hintLabel));
  }
}
function yI(t, n) {
  if (
    (t & 1 &&
      (E(0, 'div', 19), X(1, _I, 2, 2, 'mat-hint', 22), re(2, 7), Ie(3, 'div', 23), re(4, 8), S()),
    t & 2)
  ) {
    let e = fe();
    (I(), J(e.hintLabel ? 1 : -1));
  }
}
var Tn = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['mat-label']] });
    }
    return t;
  })(),
  iy = new g('MatError');
var La = (() => {
    class t {
      align = 'start';
      id = u(lt).getId('mat-mdc-hint-');
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['mat-hint']],
        hostAttrs: [1, 'mat-mdc-form-field-hint', 'mat-mdc-form-field-bottom-align'],
        hostVars: 4,
        hostBindings: function (i, r) {
          i & 2 &&
            (En('id', r.id),
            ke('align', null),
            ne('mat-mdc-form-field-hint-end', r.align === 'end'));
        },
        inputs: { align: 'align', id: 'id' },
      });
    }
    return t;
  })(),
  ff = new g('MatPrefix'),
  Va = (() => {
    class t {
      set _isTextSelector(e) {
        this._isText = !0;
      }
      _isText = !1;
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [
          ['', 'matPrefix', ''],
          ['', 'matIconPrefix', ''],
          ['', 'matTextPrefix', ''],
        ],
        inputs: { _isTextSelector: [0, 'matTextPrefix', '_isTextSelector'] },
        features: [ie([{ provide: ff, useExisting: t }])],
      });
    }
    return t;
  })(),
  hf = new g('MatSuffix'),
  ja = (() => {
    class t {
      set _isTextSelector(e) {
        this._isText = !0;
      }
      _isText = !1;
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [
          ['', 'matSuffix', ''],
          ['', 'matIconSuffix', ''],
          ['', 'matTextSuffix', ''],
        ],
        inputs: { _isTextSelector: [0, 'matTextSuffix', '_isTextSelector'] },
        features: [ie([{ provide: hf, useExisting: t }])],
      });
    }
    return t;
  })(),
  ry = new g('FloatingLabelParent'),
  Q_ = (() => {
    class t {
      _elementRef = u(F);
      get floating() {
        return this._floating;
      }
      set floating(e) {
        ((this._floating = e), this.monitorResize && this._handleResize());
      }
      _floating = !1;
      get monitorResize() {
        return this._monitorResize;
      }
      set monitorResize(e) {
        ((this._monitorResize = e),
          this._monitorResize ? this._subscribeToResize() : this._resizeSubscription.unsubscribe());
      }
      _monitorResize = !1;
      _resizeObserver = u(G_);
      _ngZone = u(R);
      _parent = u(ry);
      _resizeSubscription = new W();
      constructor() {}
      ngOnDestroy() {
        this._resizeSubscription.unsubscribe();
      }
      getWidth() {
        return vI(this._elementRef.nativeElement);
      }
      get element() {
        return this._elementRef.nativeElement;
      }
      _handleResize() {
        setTimeout(() => this._parent._handleLabelResized());
      }
      _subscribeToResize() {
        (this._resizeSubscription.unsubscribe(),
          this._ngZone.runOutsideAngular(() => {
            this._resizeSubscription = this._resizeObserver
              .observe(this._elementRef.nativeElement, { box: 'border-box' })
              .subscribe(() => this._handleResize());
          }));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['label', 'matFormFieldFloatingLabel', '']],
        hostAttrs: [1, 'mdc-floating-label', 'mat-mdc-floating-label'],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && ne('mdc-floating-label--float-above', r.floating);
        },
        inputs: { floating: 'floating', monitorResize: 'monitorResize' },
      });
    }
    return t;
  })();
function vI(t) {
  let n = t;
  if (n.offsetParent !== null) return n.scrollWidth;
  let e = n.cloneNode(!0);
  (e.style.setProperty('position', 'absolute'),
    e.style.setProperty('transform', 'translate(-9999px, -9999px)'),
    document.documentElement.appendChild(e));
  let i = e.scrollWidth;
  return (e.remove(), i);
}
var X_ = 'mdc-line-ripple--active',
  Pa = 'mdc-line-ripple--deactivating',
  J_ = (() => {
    class t {
      _elementRef = u(F);
      _cleanupTransitionEnd;
      constructor() {
        let e = u(R),
          i = u(We);
        e.runOutsideAngular(() => {
          this._cleanupTransitionEnd = i.listen(
            this._elementRef.nativeElement,
            'transitionend',
            this._handleTransitionEnd,
          );
        });
      }
      activate() {
        let e = this._elementRef.nativeElement.classList;
        (e.remove(Pa), e.add(X_));
      }
      deactivate() {
        this._elementRef.nativeElement.classList.add(Pa);
      }
      _handleTransitionEnd = (e) => {
        let i = this._elementRef.nativeElement.classList,
          r = i.contains(Pa);
        e.propertyName === 'opacity' && r && i.remove(X_, Pa);
      };
      ngOnDestroy() {
        this._cleanupTransitionEnd();
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['div', 'matFormFieldLineRipple', '']],
        hostAttrs: [1, 'mdc-line-ripple'],
      });
    }
    return t;
  })(),
  ey = (() => {
    class t {
      _elementRef = u(F);
      _ngZone = u(R);
      open = !1;
      _notch;
      ngAfterViewInit() {
        let e = this._elementRef.nativeElement,
          i = e.querySelector('.mdc-floating-label');
        i
          ? (e.classList.add('mdc-notched-outline--upgraded'),
            typeof requestAnimationFrame == 'function' &&
              ((i.style.transitionDuration = '0s'),
              this._ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => (i.style.transitionDuration = ''));
              })))
          : e.classList.add('mdc-notched-outline--no-label');
      }
      _setNotchWidth(e) {
        let i = this._notch.nativeElement;
        !this.open || !e
          ? (i.style.width = '')
          : (i.style.width = `calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`);
      }
      _setMaxWidth(e) {
        this._notch.nativeElement.style.setProperty(
          '--mat-form-field-notch-max-width',
          `calc(100% - ${e}px)`,
        );
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['div', 'matFormFieldNotchedOutline', '']],
        viewQuery: function (i, r) {
          if ((i & 1 && be(K0, 5), i & 2)) {
            let o;
            H((o = U())) && (r._notch = o.first);
          }
        },
        hostAttrs: [1, 'mdc-notched-outline'],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && ne('mdc-notched-outline--notched', r.open);
        },
        inputs: { open: [0, 'matFormFieldNotchedOutlineOpen', 'open'] },
        attrs: Q0,
        ngContentSelectors: X0,
        decls: 5,
        vars: 0,
        consts: [
          ['notch', ''],
          [1, 'mat-mdc-notch-piece', 'mdc-notched-outline__leading'],
          [1, 'mat-mdc-notch-piece', 'mdc-notched-outline__notch'],
          [1, 'mat-mdc-notch-piece', 'mdc-notched-outline__trailing'],
        ],
        template: function (i, r) {
          i & 1 && (Ze(), Zi(0, 'div', 1), ci(1, 'div', 2, 0), re(3), di(), Zi(4, 'div', 3));
        },
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  tr = (() => {
    class t {
      value;
      stateChanges;
      id;
      placeholder;
      ngControl;
      focused;
      empty;
      shouldLabelFloat;
      required;
      disabled;
      errorState;
      controlType;
      autofilled;
      userAriaDescribedBy;
      disableAutomaticLabeling;
      describedByIds;
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t });
    }
    return t;
  })();
var nr = new g('MatFormField'),
  oy = new g('MAT_FORM_FIELD_DEFAULT_OPTIONS'),
  ty = 'fill',
  bI = 'auto',
  ny = 'fixed',
  DI = 'translateY(-50%)',
  Ft = (() => {
    class t {
      _elementRef = u(F);
      _changeDetectorRef = u(Dt);
      _platform = u(_e);
      _idGenerator = u(lt);
      _ngZone = u(R);
      _defaults = u(oy, { optional: !0 });
      _currentDirection;
      _textField;
      _iconPrefixContainer;
      _textPrefixContainer;
      _iconSuffixContainer;
      _textSuffixContainer;
      _floatingLabel;
      _notchedOutline;
      _lineRipple;
      _iconPrefixContainerSignal = no('iconPrefixContainer');
      _textPrefixContainerSignal = no('textPrefixContainer');
      _iconSuffixContainerSignal = no('iconSuffixContainer');
      _textSuffixContainerSignal = no('textSuffixContainer');
      _prefixSuffixContainers = bt(() =>
        [
          this._iconPrefixContainerSignal(),
          this._textPrefixContainerSignal(),
          this._iconSuffixContainerSignal(),
          this._textSuffixContainerSignal(),
        ]
          .map((e) => e?.nativeElement)
          .filter((e) => e !== void 0),
      );
      _formFieldControl;
      _prefixChildren;
      _suffixChildren;
      _errorChildren;
      _hintChildren;
      _labelChild = r_(Tn);
      get hideRequiredMarker() {
        return this._hideRequiredMarker;
      }
      set hideRequiredMarker(e) {
        this._hideRequiredMarker = en(e);
      }
      _hideRequiredMarker = !1;
      color = 'primary';
      get floatLabel() {
        return this._floatLabel || this._defaults?.floatLabel || bI;
      }
      set floatLabel(e) {
        e !== this._floatLabel && ((this._floatLabel = e), this._changeDetectorRef.markForCheck());
      }
      _floatLabel;
      get appearance() {
        return this._appearanceSignal();
      }
      set appearance(e) {
        let i = e || this._defaults?.appearance || ty;
        this._appearanceSignal.set(i);
      }
      _appearanceSignal = ae(ty);
      get subscriptSizing() {
        return this._subscriptSizing || this._defaults?.subscriptSizing || ny;
      }
      set subscriptSizing(e) {
        this._subscriptSizing = e || this._defaults?.subscriptSizing || ny;
      }
      _subscriptSizing = null;
      get hintLabel() {
        return this._hintLabel;
      }
      set hintLabel(e) {
        ((this._hintLabel = e), this._processHints());
      }
      _hintLabel = '';
      _hasIconPrefix = !1;
      _hasTextPrefix = !1;
      _hasIconSuffix = !1;
      _hasTextSuffix = !1;
      _labelId = this._idGenerator.getId('mat-mdc-form-field-label-');
      _hintLabelId = this._idGenerator.getId('mat-mdc-hint-');
      _describedByIds;
      get _control() {
        return this._explicitFormFieldControl || this._formFieldControl;
      }
      set _control(e) {
        this._explicitFormFieldControl = e;
      }
      _destroyed = new D();
      _isFocused = null;
      _explicitFormFieldControl;
      _previousControl = null;
      _previousControlValidatorFn = null;
      _stateChanges;
      _valueChanges;
      _describedByChanges;
      _outlineLabelOffsetResizeObserver = null;
      _animationsDisabled = Mn();
      constructor() {
        let e = this._defaults,
          i = u(kt);
        (e &&
          (e.appearance && (this.appearance = e.appearance),
          (this._hideRequiredMarker = !!e?.hideRequiredMarker),
          e.color && (this.color = e.color)),
          Rt(() => (this._currentDirection = i.valueSignal())),
          this._syncOutlineLabelOffset());
      }
      ngAfterViewInit() {
        (this._updateFocusState(),
          this._animationsDisabled ||
            this._ngZone.runOutsideAngular(() => {
              setTimeout(() => {
                this._elementRef.nativeElement.classList.add('mat-form-field-animations-enabled');
              }, 300);
            }),
          this._changeDetectorRef.detectChanges());
      }
      ngAfterContentInit() {
        (this._assertFormFieldControl(),
          this._initializeSubscript(),
          this._initializePrefixAndSuffix());
      }
      ngAfterContentChecked() {
        (this._assertFormFieldControl(),
          this._control !== this._previousControl &&
            (this._initializeControl(this._previousControl),
            this._control.ngControl &&
              this._control.ngControl.control &&
              (this._previousControlValidatorFn = this._control.ngControl.control.validator),
            (this._previousControl = this._control)),
          this._control.ngControl &&
            this._control.ngControl.control &&
            this._control.ngControl.control.validator !== this._previousControlValidatorFn &&
            this._changeDetectorRef.markForCheck());
      }
      ngOnDestroy() {
        (this._outlineLabelOffsetResizeObserver?.disconnect(),
          this._stateChanges?.unsubscribe(),
          this._valueChanges?.unsubscribe(),
          this._describedByChanges?.unsubscribe(),
          this._destroyed.next(),
          this._destroyed.complete());
      }
      getLabelId = bt(() => (this._hasFloatingLabel() ? this._labelId : null));
      getConnectedOverlayOrigin() {
        return this._textField || this._elementRef;
      }
      _animateAndLockLabel() {
        this._hasFloatingLabel() && (this.floatLabel = 'always');
      }
      _initializeControl(e) {
        let i = this._control,
          r = 'mat-mdc-form-field-type-';
        (e && this._elementRef.nativeElement.classList.remove(r + e.controlType),
          i.controlType && this._elementRef.nativeElement.classList.add(r + i.controlType),
          this._stateChanges?.unsubscribe(),
          (this._stateChanges = i.stateChanges.subscribe(() => {
            (this._updateFocusState(), this._changeDetectorRef.markForCheck());
          })),
          this._describedByChanges?.unsubscribe(),
          (this._describedByChanges = i.stateChanges
            .pipe(
              Bt([void 0, void 0]),
              ue(() => [i.errorState, i.userAriaDescribedBy]),
              ps(),
              Pe(([[o, s], [a, l]]) => o !== a || s !== l),
            )
            .subscribe(() => this._syncDescribedByIds())),
          this._valueChanges?.unsubscribe(),
          i.ngControl &&
            i.ngControl.valueChanges &&
            (this._valueChanges = i.ngControl.valueChanges
              .pipe(xe(this._destroyed))
              .subscribe(() => this._changeDetectorRef.markForCheck())));
      }
      _checkPrefixAndSuffixTypes() {
        ((this._hasIconPrefix = !!this._prefixChildren.find((e) => !e._isText)),
          (this._hasTextPrefix = !!this._prefixChildren.find((e) => e._isText)),
          (this._hasIconSuffix = !!this._suffixChildren.find((e) => !e._isText)),
          (this._hasTextSuffix = !!this._suffixChildren.find((e) => e._isText)));
      }
      _initializePrefixAndSuffix() {
        (this._checkPrefixAndSuffixTypes(),
          It(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(() => {
            (this._checkPrefixAndSuffixTypes(), this._changeDetectorRef.markForCheck());
          }));
      }
      _initializeSubscript() {
        (this._hintChildren.changes.subscribe(() => {
          (this._processHints(), this._changeDetectorRef.markForCheck());
        }),
          this._errorChildren.changes.subscribe(() => {
            (this._syncDescribedByIds(), this._changeDetectorRef.markForCheck());
          }),
          this._validateHints(),
          this._syncDescribedByIds());
      }
      _assertFormFieldControl() {
        this._control;
      }
      _updateFocusState() {
        let e = this._control.focused;
        (e && !this._isFocused
          ? ((this._isFocused = !0), this._lineRipple?.activate())
          : !e &&
            (this._isFocused || this._isFocused === null) &&
            ((this._isFocused = !1), this._lineRipple?.deactivate()),
          this._elementRef.nativeElement.classList.toggle('mat-focused', e),
          this._textField?.nativeElement.classList.toggle('mdc-text-field--focused', e));
      }
      _syncOutlineLabelOffset() {
        a_({
          earlyRead: () => {
            if (this._appearanceSignal() !== 'outline')
              return (this._outlineLabelOffsetResizeObserver?.disconnect(), null);
            if (globalThis.ResizeObserver) {
              this._outlineLabelOffsetResizeObserver ||= new globalThis.ResizeObserver(() => {
                this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset());
              });
              for (let e of this._prefixSuffixContainers())
                this._outlineLabelOffsetResizeObserver.observe(e, { box: 'border-box' });
            }
            return this._getOutlinedLabelOffset();
          },
          write: (e) => this._writeOutlinedLabelStyles(e()),
        });
      }
      _shouldAlwaysFloat() {
        return this.floatLabel === 'always';
      }
      _hasOutline() {
        return this.appearance === 'outline';
      }
      _forceDisplayInfixLabel() {
        return (
          !this._platform.isBrowser && this._prefixChildren.length && !this._shouldLabelFloat()
        );
      }
      _hasFloatingLabel = bt(() => !!this._labelChild());
      _shouldLabelFloat() {
        return this._hasFloatingLabel()
          ? this._control.shouldLabelFloat || this._shouldAlwaysFloat()
          : !1;
      }
      _shouldForward(e) {
        let i = this._control ? this._control.ngControl : null;
        return i && i[e];
      }
      _getSubscriptMessageType() {
        return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState
          ? 'error'
          : 'hint';
      }
      _handleLabelResized() {
        this._refreshOutlineNotchWidth();
      }
      _refreshOutlineNotchWidth() {
        !this._hasOutline() || !this._floatingLabel || !this._shouldLabelFloat()
          ? this._notchedOutline?._setNotchWidth(0)
          : this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth());
      }
      _processHints() {
        (this._validateHints(), this._syncDescribedByIds());
      }
      _validateHints() {
        this._hintChildren;
      }
      _syncDescribedByIds() {
        if (this._control) {
          let e = [];
          if (
            (this._control.userAriaDescribedBy &&
              typeof this._control.userAriaDescribedBy == 'string' &&
              e.push(...this._control.userAriaDescribedBy.split(' ')),
            this._getSubscriptMessageType() === 'hint')
          ) {
            let o = this._hintChildren ? this._hintChildren.find((a) => a.align === 'start') : null,
              s = this._hintChildren ? this._hintChildren.find((a) => a.align === 'end') : null;
            (o ? e.push(o.id) : this._hintLabel && e.push(this._hintLabelId), s && e.push(s.id));
          } else this._errorChildren && e.push(...this._errorChildren.map((o) => o.id));
          let i = this._control.describedByIds,
            r;
          if (i) {
            let o = this._describedByIds || e;
            r = e.concat(i.filter((s) => s && !o.includes(s)));
          } else r = e;
          (this._control.setDescribedByIds(r), (this._describedByIds = e));
        }
      }
      _getOutlinedLabelOffset() {
        if (!this._hasOutline() || !this._floatingLabel) return null;
        if (!this._iconPrefixContainer && !this._textPrefixContainer) return ['', null];
        if (!this._isAttachedToDom()) return null;
        let e = this._iconPrefixContainer?.nativeElement,
          i = this._textPrefixContainer?.nativeElement,
          r = this._iconSuffixContainer?.nativeElement,
          o = this._textSuffixContainer?.nativeElement,
          s = e?.getBoundingClientRect().width ?? 0,
          a = i?.getBoundingClientRect().width ?? 0,
          l = r?.getBoundingClientRect().width ?? 0,
          c = o?.getBoundingClientRect().width ?? 0,
          d = this._currentDirection === 'rtl' ? '-1' : '1',
          f = `${s + a}px`,
          h = `calc(${d} * (${f} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,
          m = `var(--mat-mdc-form-field-label-transform, ${DI} translateX(${h}))`,
          _ = s + a + l + c;
        return [m, _];
      }
      _writeOutlinedLabelStyles(e) {
        if (e !== null) {
          let [i, r] = e;
          (this._floatingLabel && (this._floatingLabel.element.style.transform = i),
            r !== null && this._notchedOutline?._setMaxWidth(r));
        }
      }
      _isAttachedToDom() {
        let e = this._elementRef.nativeElement;
        if (e.getRootNode) {
          let i = e.getRootNode();
          return i && i !== e;
        }
        return document.documentElement.contains(e);
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['mat-form-field']],
        contentQueries: function (i, r, o) {
          if (
            (i & 1 &&
              (pu(o, r._labelChild, Tn, 5),
              Ce(o, tr, 5),
              Ce(o, ff, 5),
              Ce(o, hf, 5),
              Ce(o, iy, 5),
              Ce(o, La, 5)),
            i & 2)
          ) {
            Da();
            let s;
            (H((s = U())) && (r._formFieldControl = s.first),
              H((s = U())) && (r._prefixChildren = s),
              H((s = U())) && (r._suffixChildren = s),
              H((s = U())) && (r._errorChildren = s),
              H((s = U())) && (r._hintChildren = s));
          }
        },
        viewQuery: function (i, r) {
          if (
            (i & 1 &&
              (Ki(r._iconPrefixContainerSignal, q_, 5),
              Ki(r._textPrefixContainerSignal, Y_, 5),
              Ki(r._iconSuffixContainerSignal, Z_, 5),
              Ki(r._textSuffixContainerSignal, K_, 5),
              be(J0, 5),
              be(q_, 5),
              be(Y_, 5),
              be(Z_, 5),
              be(K_, 5),
              be(Q_, 5),
              be(ey, 5),
              be(J_, 5)),
            i & 2)
          ) {
            Da(4);
            let o;
            (H((o = U())) && (r._textField = o.first),
              H((o = U())) && (r._iconPrefixContainer = o.first),
              H((o = U())) && (r._textPrefixContainer = o.first),
              H((o = U())) && (r._iconSuffixContainer = o.first),
              H((o = U())) && (r._textSuffixContainer = o.first),
              H((o = U())) && (r._floatingLabel = o.first),
              H((o = U())) && (r._notchedOutline = o.first),
              H((o = U())) && (r._lineRipple = o.first));
          }
        },
        hostAttrs: [1, 'mat-mdc-form-field'],
        hostVars: 38,
        hostBindings: function (i, r) {
          i & 2 &&
            ne('mat-mdc-form-field-label-always-float', r._shouldAlwaysFloat())(
              'mat-mdc-form-field-has-icon-prefix',
              r._hasIconPrefix,
            )('mat-mdc-form-field-has-icon-suffix', r._hasIconSuffix)(
              'mat-form-field-invalid',
              r._control.errorState,
            )('mat-form-field-disabled', r._control.disabled)(
              'mat-form-field-autofilled',
              r._control.autofilled,
            )('mat-form-field-appearance-fill', r.appearance == 'fill')(
              'mat-form-field-appearance-outline',
              r.appearance == 'outline',
            )('mat-form-field-hide-placeholder', r._hasFloatingLabel() && !r._shouldLabelFloat())(
              'mat-primary',
              r.color !== 'accent' && r.color !== 'warn',
            )('mat-accent', r.color === 'accent')('mat-warn', r.color === 'warn')(
              'ng-untouched',
              r._shouldForward('untouched'),
            )('ng-touched', r._shouldForward('touched'))(
              'ng-pristine',
              r._shouldForward('pristine'),
            )('ng-dirty', r._shouldForward('dirty'))('ng-valid', r._shouldForward('valid'))(
              'ng-invalid',
              r._shouldForward('invalid'),
            )('ng-pending', r._shouldForward('pending'));
        },
        inputs: {
          hideRequiredMarker: 'hideRequiredMarker',
          color: 'color',
          floatLabel: 'floatLabel',
          appearance: 'appearance',
          subscriptSizing: 'subscriptSizing',
          hintLabel: 'hintLabel',
        },
        exportAs: ['matFormField'],
        features: [
          ie([
            { provide: nr, useExisting: t },
            { provide: ry, useExisting: t },
          ]),
        ],
        ngContentSelectors: tI,
        decls: 18,
        vars: 21,
        consts: [
          ['labelTemplate', ''],
          ['textField', ''],
          ['iconPrefixContainer', ''],
          ['textPrefixContainer', ''],
          ['textSuffixContainer', ''],
          ['iconSuffixContainer', ''],
          [1, 'mat-mdc-text-field-wrapper', 'mdc-text-field', 3, 'click'],
          [1, 'mat-mdc-form-field-focus-overlay'],
          [1, 'mat-mdc-form-field-flex'],
          ['matFormFieldNotchedOutline', '', 3, 'matFormFieldNotchedOutlineOpen'],
          [1, 'mat-mdc-form-field-icon-prefix'],
          [1, 'mat-mdc-form-field-text-prefix'],
          [1, 'mat-mdc-form-field-infix'],
          [3, 'ngTemplateOutlet'],
          [1, 'mat-mdc-form-field-text-suffix'],
          [1, 'mat-mdc-form-field-icon-suffix'],
          ['matFormFieldLineRipple', ''],
          [
            'aria-atomic',
            'true',
            'aria-live',
            'polite',
            1,
            'mat-mdc-form-field-subscript-wrapper',
            'mat-mdc-form-field-bottom-align',
          ],
          [1, 'mat-mdc-form-field-error-wrapper'],
          [1, 'mat-mdc-form-field-hint-wrapper'],
          ['matFormFieldFloatingLabel', '', 3, 'floating', 'monitorResize', 'id'],
          [
            'aria-hidden',
            'true',
            1,
            'mat-mdc-form-field-required-marker',
            'mdc-floating-label--required',
          ],
          [3, 'id'],
          [1, 'mat-mdc-form-field-hint-spacer'],
        ],
        template: function (i, r) {
          if (i & 1) {
            let o = Cn();
            (Ze(eI),
              qe(0, rI, 1, 1, 'ng-template', null, 0, vu),
              E(2, 'div', 6, 1),
              me('click', function (a) {
                return (rt(o), ot(r._control.onContainerClick(a)));
              }),
              X(4, oI, 1, 0, 'div', 7),
              E(5, 'div', 8),
              X(6, lI, 2, 2, 'div', 9),
              X(7, cI, 3, 0, 'div', 10),
              X(8, dI, 3, 0, 'div', 11),
              E(9, 'div', 12),
              X(10, fI, 1, 1, null, 13),
              re(11),
              S(),
              X(12, hI, 3, 0, 'div', 14),
              X(13, pI, 3, 0, 'div', 15),
              S(),
              X(14, mI, 1, 0, 'div', 16),
              S(),
              E(15, 'div', 17),
              X(16, gI, 2, 0, 'div', 18)(17, yI, 5, 1, 'div', 19),
              S());
          }
          if (i & 2) {
            let o;
            (I(2),
              ne('mdc-text-field--filled', !r._hasOutline())(
                'mdc-text-field--outlined',
                r._hasOutline(),
              )('mdc-text-field--no-label', !r._hasFloatingLabel())(
                'mdc-text-field--disabled',
                r._control.disabled,
              )('mdc-text-field--invalid', r._control.errorState),
              I(2),
              J(!r._hasOutline() && !r._control.disabled ? 4 : -1),
              I(2),
              J(r._hasOutline() ? 6 : -1),
              I(),
              J(r._hasIconPrefix ? 7 : -1),
              I(),
              J(r._hasTextPrefix ? 8 : -1),
              I(2),
              J(!r._hasOutline() || r._forceDisplayInfixLabel() ? 10 : -1),
              I(2),
              J(r._hasTextSuffix ? 12 : -1),
              I(),
              J(r._hasIconSuffix ? 13 : -1),
              I(),
              J(r._hasOutline() ? -1 : 14),
              I(),
              ne('mat-mdc-form-field-subscript-dynamic-size', r.subscriptSizing === 'dynamic'));
            let s = r._getSubscriptMessageType();
            (I(), J((o = s) === 'error' ? 16 : o === 'hint' ? 17 : -1));
          }
        },
        dependencies: [Q_, ey, Vu, J_, La],
        styles: [
          `.mdc-text-field{display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-text-field__input{width:100%;min-width:0;border:none;border-radius:0;background:none;padding:0;-moz-appearance:none;-webkit-appearance:none;height:28px}.mdc-text-field__input::-webkit-calendar-picker-indicator,.mdc-text-field__input::-webkit-search-cancel-button{display:none}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}.mdc-text-field__input::placeholder{opacity:0}.mdc-text-field__input::-moz-placeholder{opacity:0}.mdc-text-field__input::-webkit-input-placeholder{opacity:0}.mdc-text-field__input:-ms-input-placeholder{opacity:0}.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{opacity:1}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder{opacity:0}.mdc-text-field--outlined .mdc-text-field__input,.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:rgba(0,0,0,0)}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-filled-caret-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error))}.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}@media(forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}}.mdc-text-field--filled{height:56px;border-bottom-right-radius:0;border-bottom-left-radius:0;border-top-left-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));border-top-right-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled{background-color:var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent))}.mdc-text-field--outlined{height:56px;overflow:visible;padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px)}[dir=rtl] .mdc-text-field--outlined{padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}.mdc-floating-label{position:absolute;left:0;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform}[dir=rtl] .mdc-floating-label{right:0;left:auto;transform-origin:right top;text-align:right}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:auto}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label{left:auto;right:4px}.mdc-text-field--filled .mdc-floating-label{left:16px;right:auto}[dir=rtl] .mdc-text-field--filled .mdc-floating-label{left:auto;right:16px}.mdc-text-field--disabled .mdc-floating-label{cursor:default}@media(forced-colors: active){.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--filled .mdc-floating-label{font-family:var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined .mdc-floating-label{font-family:var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-floating-label--float-above{cursor:auto;transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1);font-size:.75rem}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:133.3333333333%}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:1px;margin-right:0;content:"*"}[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:0;margin-right:1px}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mat-mdc-notch-piece{box-sizing:border-box;height:100%;pointer-events:none;border-top:1px solid;border-bottom:1px solid}.mdc-text-field--focused .mat-mdc-notch-piece{border-width:2px}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));border-width:var(--mat-form-field-outlined-outline-width, 1px)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary))}.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece{border-width:var(--mat-form-field-outlined-focus-outline-width, 2px)}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid;border-bottom-left-radius:0;border-top-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__trailing{flex-grow:1;border-left:none;border-right:1px solid;border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__notch{flex:0 0 auto;width:auto}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:min(var(--mat-form-field-notch-max-width, 100%),calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{max-width:min(100%,calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{z-index:1;border-bottom-width:var(--mat-form-field-filled-active-indicator-height, 1px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container))}.mdc-line-ripple::after{transform:scaleX(0);opacity:0;z-index:2}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-width:var(--mat-form-field-filled-focus-active-indicator-height, 2px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error))}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-text-field--disabled{pointer-events:none}.mat-mdc-form-field-textarea-control{vertical-align:middle;resize:vertical;box-sizing:border-box;height:auto;margin:0;padding:0;border:none;overflow:auto}.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font:inherit;letter-spacing:inherit;text-decoration:inherit;text-transform:inherit;border:none}.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;line-height:normal;pointer-events:all;will-change:auto}.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label{cursor:inherit}.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control{height:auto}.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color]{height:23px}.mat-mdc-text-field-wrapper{height:auto;flex:auto;will-change:auto}.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-left:0;--mat-mdc-form-field-label-offset-x: -16px}.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-right:0}[dir=rtl] .mat-mdc-text-field-wrapper{padding-left:16px;padding-right:16px}[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-left:0}[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-right:0}.mat-form-field-disabled .mdc-text-field__input::placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label{left:auto;right:auto}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input{display:inline-block}.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch{padding-top:0}.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:1px solid rgba(0,0,0,0)}[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:none;border-right:1px solid rgba(0,0,0,0)}.mat-mdc-form-field-infix{min-height:var(--mat-form-field-container-height, 56px);padding-top:var(--mat-form-field-filled-with-label-container-padding-top, 24px);padding-bottom:var(--mat-form-field-filled-with-label-container-padding-bottom, 8px)}.mdc-text-field--outlined .mat-mdc-form-field-infix,.mdc-text-field--no-label .mat-mdc-form-field-infix{padding-top:var(--mat-form-field-container-vertical-padding, 16px);padding-bottom:var(--mat-form-field-container-vertical-padding, 16px)}.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label{top:calc(var(--mat-form-field-container-height, 56px)/2)}.mdc-text-field--filled .mat-mdc-floating-label{display:var(--mat-form-field-filled-label-display, block)}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{--mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1)) scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));transform:var(--mat-mdc-form-field-label-transform)}@keyframes _mat-form-field-subscript-animation{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.mat-mdc-form-field-subscript-wrapper{box-sizing:border-box;width:100%;position:relative}.mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-error-wrapper{position:absolute;top:0;left:0;right:0;padding:0 16px;opacity:1;transform:translateY(0);animation:_mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper{position:static}.mat-mdc-form-field-bottom-align::before{content:"";display:inline-block;height:16px}.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before{content:unset}.mat-mdc-form-field-hint-end{order:1}.mat-mdc-form-field-hint-wrapper{display:flex}.mat-mdc-form-field-hint-spacer{flex:1 0 1em}.mat-mdc-form-field-error{display:block;color:var(--mat-form-field-error-text-color, var(--mat-sys-error))}.mat-mdc-form-field-subscript-wrapper,.mat-mdc-form-field-bottom-align::before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));line-height:var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));font-size:var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));letter-spacing:var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));font-weight:var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight))}.mat-mdc-form-field-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;opacity:0;pointer-events:none;background-color:var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface))}.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-focus-state-layer-opacity, 0)}select.mat-mdc-form-field-input-control{-moz-appearance:none;-webkit-appearance:none;background-color:rgba(0,0,0,0);display:inline-flex;box-sizing:border-box}select.mat-mdc-form-field-input-control:not(:disabled){cursor:pointer}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option{color:var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10))}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled{color:var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;position:absolute;right:0;top:50%;margin-top:-2.5px;pointer-events:none;color:var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant))}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{right:auto;left:0}.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after{color:var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary))}.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after{color:var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:15px}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:0;padding-left:15px}@media(forced-colors: active){.mat-form-field-appearance-fill .mat-mdc-text-field-wrapper{outline:solid 1px}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper{outline-color:GrayText}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper{outline:dashed 3px}}@media(forced-colors: active){.mat-mdc-form-field.mat-focused .mdc-notched-outline{border:dashed 3px}}.mat-mdc-form-field-input-control[type=date],.mat-mdc-form-field-input-control[type=datetime],.mat-mdc-form-field-input-control[type=datetime-local],.mat-mdc-form-field-input-control[type=month],.mat-mdc-form-field-input-control[type=week],.mat-mdc-form-field-input-control[type=time]{line-height:1}.mat-mdc-form-field-input-control::-webkit-datetime-edit{line-height:1;padding:0;margin-bottom:-2px}.mat-mdc-form-field{--mat-mdc-form-field-floating-label-scale: 0.75;display:inline-flex;flex-direction:column;min-width:0;text-align:left;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));line-height:var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));font-size:var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));letter-spacing:var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));font-weight:var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above{font-size:calc(var(--mat-form-field-outlined-label-text-populated-size)*var(--mat-mdc-form-field-floating-label-scale))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:var(--mat-form-field-outlined-label-text-populated-size)}[dir=rtl] .mat-mdc-form-field{text-align:right}.mat-mdc-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-mdc-text-field-wrapper{width:100%;z-index:0}.mat-mdc-form-field-icon-prefix,.mat-mdc-form-field-icon-suffix{align-self:center;line-height:0;pointer-events:auto;position:relative;z-index:1}.mat-mdc-form-field-icon-prefix>.mat-icon,.mat-mdc-form-field-icon-suffix>.mat-icon{padding:0 12px;box-sizing:content-box}.mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-invalid .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error))}.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container))}.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error))}.mat-mdc-form-field-icon-prefix,[dir=rtl] .mat-mdc-form-field-icon-suffix{padding:0 4px 0 0}.mat-mdc-form-field-icon-suffix,[dir=rtl] .mat-mdc-form-field-icon-prefix{padding:0 0 0 4px}.mat-mdc-form-field-subscript-wrapper .mat-icon,.mat-mdc-form-field label .mat-icon{width:1em;height:1em;font-size:inherit}.mat-mdc-form-field-infix{flex:auto;min-width:0;width:180px;position:relative;box-sizing:border-box}.mat-mdc-form-field-infix:has(textarea[cols]){width:auto}.mat-mdc-form-field .mdc-notched-outline__notch{margin-left:-1px;-webkit-clip-path:inset(-9em -999em -9em 1px);clip-path:inset(-9em -999em -9em 1px)}[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch{margin-left:0;margin-right:-1px;-webkit-clip-path:inset(-9em 1px -9em -999em);clip-path:inset(-9em 1px -9em -999em)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label{transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input{transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper{animation-duration:300ms}.mdc-notched-outline .mdc-floating-label{max-width:calc(100% + 1px)}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(133.3333333333% + 1px)}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })();
var ye = (() => {
  class t {
    constructor() {
      u(rf)._applyBodyHighContrastModeCssClasses();
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ imports: [xn, xn] });
  }
  return t;
})();
var Pt = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ imports: [ye, T_, Ft, ye] });
  }
  return t;
})();
var ct = (function (t) {
    return (
      (t[(t.FADING_IN = 0)] = 'FADING_IN'),
      (t[(t.VISIBLE = 1)] = 'VISIBLE'),
      (t[(t.FADING_OUT = 2)] = 'FADING_OUT'),
      (t[(t.HIDDEN = 3)] = 'HIDDEN'),
      t
    );
  })(ct || {}),
  pf = class {
    _renderer;
    element;
    config;
    _animationForciblyDisabledThroughCss;
    state = ct.HIDDEN;
    constructor(n, e, i, r = !1) {
      ((this._renderer = n),
        (this.element = e),
        (this.config = i),
        (this._animationForciblyDisabledThroughCss = r));
    }
    fadeOut() {
      this._renderer.fadeOutRipple(this);
    }
  },
  ay = Aa({ passive: !0, capture: !0 }),
  mf = class {
    _events = new Map();
    addHandler(n, e, i, r) {
      let o = this._events.get(e);
      if (o) {
        let s = o.get(i);
        s ? s.add(r) : o.set(i, new Set([r]));
      } else
        (this._events.set(e, new Map([[i, new Set([r])]])),
          n.runOutsideAngular(() => {
            document.addEventListener(e, this._delegateEventHandler, ay);
          }));
    }
    removeHandler(n, e, i) {
      let r = this._events.get(n);
      if (!r) return;
      let o = r.get(e);
      o &&
        (o.delete(i),
        o.size === 0 && r.delete(e),
        r.size === 0 &&
          (this._events.delete(n),
          document.removeEventListener(n, this._delegateEventHandler, ay)));
    }
    _delegateEventHandler = (n) => {
      let e = ui(n);
      e &&
        this._events.get(n.type)?.forEach((i, r) => {
          (r === e || r.contains(e)) && i.forEach((o) => o.handleEvent(n));
        });
    };
  },
  ly = { enterDuration: 225, exitDuration: 150 },
  EI = 800,
  cy = Aa({ passive: !0, capture: !0 }),
  dy = ['mousedown', 'touchstart'],
  uy = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'],
  wI = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['ng-component']],
        hostAttrs: ['mat-ripple-style-loader', ''],
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `.mat-ripple{overflow:hidden;position:relative}.mat-ripple:not(:empty){transform:translateZ(0)}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0ms cubic-bezier(0, 0, 0.2, 1);transform:scale3d(0, 0, 0);background-color:var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent))}@media(forced-colors: active){.mat-ripple-element{display:none}}.cdk-drag-preview .mat-ripple-element,.cdk-drag-placeholder .mat-ripple-element{display:none}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  gf = class t {
    _target;
    _ngZone;
    _platform;
    _containerElement;
    _triggerElement;
    _isPointerDown = !1;
    _activeRipples = new Map();
    _mostRecentTransientRipple;
    _lastTouchStartEvent;
    _pointerUpEventsRegistered = !1;
    _containerRect;
    static _eventManager = new mf();
    constructor(n, e, i, r, o) {
      ((this._target = n),
        (this._ngZone = e),
        (this._platform = r),
        r.isBrowser && (this._containerElement = Jt(i)),
        o && o.get(Nt).load(wI));
    }
    fadeInRipple(n, e, i = {}) {
      let r = (this._containerRect =
          this._containerRect || this._containerElement.getBoundingClientRect()),
        o = x(x({}, ly), i.animation);
      i.centered && ((n = r.left + r.width / 2), (e = r.top + r.height / 2));
      let s = i.radius || II(n, e, r),
        a = n - r.left,
        l = e - r.top,
        c = o.enterDuration,
        d = document.createElement('div');
      (d.classList.add('mat-ripple-element'),
        (d.style.left = `${a - s}px`),
        (d.style.top = `${l - s}px`),
        (d.style.height = `${s * 2}px`),
        (d.style.width = `${s * 2}px`),
        i.color != null && (d.style.backgroundColor = i.color),
        (d.style.transitionDuration = `${c}ms`),
        this._containerElement.appendChild(d));
      let f = window.getComputedStyle(d),
        p = f.transitionProperty,
        h = f.transitionDuration,
        m = p === 'none' || h === '0s' || h === '0s, 0s' || (r.width === 0 && r.height === 0),
        _ = new pf(this, d, i, m);
      ((d.style.transform = 'scale3d(1, 1, 1)'),
        (_.state = ct.FADING_IN),
        i.persistent || (this._mostRecentTransientRipple = _));
      let w = null;
      return (
        !m &&
          (c || o.exitDuration) &&
          this._ngZone.runOutsideAngular(() => {
            let v = () => {
                (w && (w.fallbackTimer = null), clearTimeout(Kf), this._finishRippleTransition(_));
              },
              Re = () => this._destroyRipple(_),
              Kf = setTimeout(Re, c + 100);
            (d.addEventListener('transitionend', v),
              d.addEventListener('transitioncancel', Re),
              (w = { onTransitionEnd: v, onTransitionCancel: Re, fallbackTimer: Kf }));
          }),
        this._activeRipples.set(_, w),
        (m || !c) && this._finishRippleTransition(_),
        _
      );
    }
    fadeOutRipple(n) {
      if (n.state === ct.FADING_OUT || n.state === ct.HIDDEN) return;
      let e = n.element,
        i = x(x({}, ly), n.config.animation);
      ((e.style.transitionDuration = `${i.exitDuration}ms`),
        (e.style.opacity = '0'),
        (n.state = ct.FADING_OUT),
        (n._animationForciblyDisabledThroughCss || !i.exitDuration) &&
          this._finishRippleTransition(n));
    }
    fadeOutAll() {
      this._getActiveRipples().forEach((n) => n.fadeOut());
    }
    fadeOutAllNonPersistent() {
      this._getActiveRipples().forEach((n) => {
        n.config.persistent || n.fadeOut();
      });
    }
    setupTriggerEvents(n) {
      let e = Jt(n);
      !this._platform.isBrowser ||
        !e ||
        e === this._triggerElement ||
        (this._removeTriggerEvents(),
        (this._triggerElement = e),
        dy.forEach((i) => {
          t._eventManager.addHandler(this._ngZone, i, e, this);
        }));
    }
    handleEvent(n) {
      (n.type === 'mousedown'
        ? this._onMousedown(n)
        : n.type === 'touchstart'
          ? this._onTouchStart(n)
          : this._onPointerUp(),
        this._pointerUpEventsRegistered ||
          (this._ngZone.runOutsideAngular(() => {
            uy.forEach((e) => {
              this._triggerElement.addEventListener(e, this, cy);
            });
          }),
          (this._pointerUpEventsRegistered = !0)));
    }
    _finishRippleTransition(n) {
      n.state === ct.FADING_IN
        ? this._startFadeOutTransition(n)
        : n.state === ct.FADING_OUT && this._destroyRipple(n);
    }
    _startFadeOutTransition(n) {
      let e = n === this._mostRecentTransientRipple,
        { persistent: i } = n.config;
      ((n.state = ct.VISIBLE), !i && (!e || !this._isPointerDown) && n.fadeOut());
    }
    _destroyRipple(n) {
      let e = this._activeRipples.get(n) ?? null;
      (this._activeRipples.delete(n),
        this._activeRipples.size || (this._containerRect = null),
        n === this._mostRecentTransientRipple && (this._mostRecentTransientRipple = null),
        (n.state = ct.HIDDEN),
        e !== null &&
          (n.element.removeEventListener('transitionend', e.onTransitionEnd),
          n.element.removeEventListener('transitioncancel', e.onTransitionCancel),
          e.fallbackTimer !== null && clearTimeout(e.fallbackTimer)),
        n.element.remove());
    }
    _onMousedown(n) {
      let e = Ku(n),
        i = this._lastTouchStartEvent && Date.now() < this._lastTouchStartEvent + EI;
      !this._target.rippleDisabled &&
        !e &&
        !i &&
        ((this._isPointerDown = !0),
        this.fadeInRipple(n.clientX, n.clientY, this._target.rippleConfig));
    }
    _onTouchStart(n) {
      if (!this._target.rippleDisabled && !Qu(n)) {
        ((this._lastTouchStartEvent = Date.now()), (this._isPointerDown = !0));
        let e = n.changedTouches;
        if (e)
          for (let i = 0; i < e.length; i++)
            this.fadeInRipple(e[i].clientX, e[i].clientY, this._target.rippleConfig);
      }
    }
    _onPointerUp() {
      this._isPointerDown &&
        ((this._isPointerDown = !1),
        this._getActiveRipples().forEach((n) => {
          let e =
            n.state === ct.VISIBLE || (n.config.terminateOnPointerUp && n.state === ct.FADING_IN);
          !n.config.persistent && e && n.fadeOut();
        }));
    }
    _getActiveRipples() {
      return Array.from(this._activeRipples.keys());
    }
    _removeTriggerEvents() {
      let n = this._triggerElement;
      n &&
        (dy.forEach((e) => t._eventManager.removeHandler(e, n, this)),
        this._pointerUpEventsRegistered &&
          (uy.forEach((e) => n.removeEventListener(e, this, cy)),
          (this._pointerUpEventsRegistered = !1)));
    }
  };
function II(t, n, e) {
  let i = Math.max(Math.abs(t - e.left), Math.abs(t - e.right)),
    r = Math.max(Math.abs(n - e.top), Math.abs(n - e.bottom));
  return Math.sqrt(i * i + r * r);
}
var SI = new g('mat-ripple-global-options'),
  fy = (() => {
    class t {
      _elementRef = u(F);
      _animationsDisabled = Mn();
      color;
      unbounded;
      centered;
      radius = 0;
      animation;
      get disabled() {
        return this._disabled;
      }
      set disabled(e) {
        (e && this.fadeOutAllNonPersistent(),
          (this._disabled = e),
          this._setupTriggerEventsIfEnabled());
      }
      _disabled = !1;
      get trigger() {
        return this._trigger || this._elementRef.nativeElement;
      }
      set trigger(e) {
        ((this._trigger = e), this._setupTriggerEventsIfEnabled());
      }
      _trigger;
      _rippleRenderer;
      _globalOptions;
      _isInitialized = !1;
      constructor() {
        let e = u(R),
          i = u(_e),
          r = u(SI, { optional: !0 }),
          o = u(Y);
        ((this._globalOptions = r || {}),
          (this._rippleRenderer = new gf(this, e, this._elementRef, i, o)));
      }
      ngOnInit() {
        ((this._isInitialized = !0), this._setupTriggerEventsIfEnabled());
      }
      ngOnDestroy() {
        this._rippleRenderer._removeTriggerEvents();
      }
      fadeOutAll() {
        this._rippleRenderer.fadeOutAll();
      }
      fadeOutAllNonPersistent() {
        this._rippleRenderer.fadeOutAllNonPersistent();
      }
      get rippleConfig() {
        return {
          centered: this.centered,
          radius: this.radius,
          color: this.color,
          animation: x(
            x(
              x({}, this._globalOptions.animation),
              this._animationsDisabled ? { enterDuration: 0, exitDuration: 0 } : {},
            ),
            this.animation,
          ),
          terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
        };
      }
      get rippleDisabled() {
        return this.disabled || !!this._globalOptions.disabled;
      }
      _setupTriggerEventsIfEnabled() {
        !this.disabled &&
          this._isInitialized &&
          this._rippleRenderer.setupTriggerEvents(this.trigger);
      }
      launch(e, i = 0, r) {
        return typeof e == 'number'
          ? this._rippleRenderer.fadeInRipple(e, i, x(x({}, this.rippleConfig), r))
          : this._rippleRenderer.fadeInRipple(0, 0, x(x({}, this.rippleConfig), e));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [
          ['', 'mat-ripple', ''],
          ['', 'matRipple', ''],
        ],
        hostAttrs: [1, 'mat-ripple'],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && ne('mat-ripple-unbounded', r.unbounded);
        },
        inputs: {
          color: [0, 'matRippleColor', 'color'],
          unbounded: [0, 'matRippleUnbounded', 'unbounded'],
          centered: [0, 'matRippleCentered', 'centered'],
          radius: [0, 'matRippleRadius', 'radius'],
          animation: [0, 'matRippleAnimation', 'animation'],
          disabled: [0, 'matRippleDisabled', 'disabled'],
          trigger: [0, 'matRippleTrigger', 'trigger'],
        },
        exportAs: ['matRipple'],
      });
    }
    return t;
  })();
var hy = (() => {
  class t {
    _animationsDisabled = Mn();
    state = 'unchecked';
    disabled = !1;
    appearance = 'full';
    constructor() {}
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵcmp = B({
      type: t,
      selectors: [['mat-pseudo-checkbox']],
      hostAttrs: [1, 'mat-pseudo-checkbox'],
      hostVars: 12,
      hostBindings: function (i, r) {
        i & 2 &&
          ne('mat-pseudo-checkbox-indeterminate', r.state === 'indeterminate')(
            'mat-pseudo-checkbox-checked',
            r.state === 'checked',
          )('mat-pseudo-checkbox-disabled', r.disabled)(
            'mat-pseudo-checkbox-minimal',
            r.appearance === 'minimal',
          )('mat-pseudo-checkbox-full', r.appearance === 'full')(
            '_mat-animation-noopable',
            r._animationsDisabled,
          );
      },
      inputs: { state: 'state', disabled: 'disabled', appearance: 'appearance' },
      decls: 0,
      vars: 0,
      template: function (i, r) {},
      styles: [
        `.mat-pseudo-checkbox{border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1),background-color 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox::after{position:absolute;opacity:0;content:"";border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox._mat-animation-noopable{transition:none !important;animation:none !important}.mat-pseudo-checkbox._mat-animation-noopable::after{transition:none}.mat-pseudo-checkbox-disabled{cursor:default}.mat-pseudo-checkbox-indeterminate::after{left:1px;opacity:1;border-radius:2px}.mat-pseudo-checkbox-checked::after{left:1px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1;box-sizing:content-box}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after,.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after{color:var(--mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--mat-sys-primary))}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after,.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after{color:var(--mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-pseudo-checkbox-full{border-color:var(--mat-pseudo-checkbox-full-unselected-icon-color, var(--mat-sys-on-surface-variant));border-width:2px;border-style:solid}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled{border-color:var(--mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked,.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate{background-color:var(--mat-pseudo-checkbox-full-selected-icon-color, var(--mat-sys-primary));border-color:rgba(0,0,0,0)}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after,.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after{color:var(--mat-pseudo-checkbox-full-selected-checkmark-color, var(--mat-sys-on-primary))}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled,.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled{background-color:var(--mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after,.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after{color:var(--mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--mat-sys-surface))}.mat-pseudo-checkbox{width:18px;height:18px}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after{width:14px;height:6px;transform-origin:center;top:-4.2426406871px;left:0;bottom:0;right:0;margin:auto}.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after{top:8px;width:16px}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after{width:10px;height:4px;transform-origin:center;top:-2.8284271247px;left:0;bottom:0;right:0;margin:auto}.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after{top:6px;width:12px}
`,
      ],
      encapsulation: 2,
      changeDetection: 0,
    });
  }
  return t;
})();
var py = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵcmp = B({
      type: t,
      selectors: [['structural-styles']],
      decls: 0,
      vars: 0,
      template: function (i, r) {},
      styles: [
        `.mat-focus-indicator{position:relative}.mat-focus-indicator::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;display:var(--mat-focus-indicator-display, none);border-width:var(--mat-focus-indicator-border-width, 3px);border-style:var(--mat-focus-indicator-border-style, solid);border-color:var(--mat-focus-indicator-border-color, transparent);border-radius:var(--mat-focus-indicator-border-radius, 4px)}.mat-focus-indicator:focus::before{content:""}@media(forced-colors: active){html{--mat-focus-indicator-display: block}}
`,
      ],
      encapsulation: 2,
      changeDetection: 0,
    });
  }
  return t;
})();
var xI = ['text'],
  MI = [[['mat-icon']], '*'],
  TI = ['mat-icon', '*'];
function RI(t, n) {
  if ((t & 1 && Ie(0, 'mat-pseudo-checkbox', 1), t & 2)) {
    let e = fe();
    de('disabled', e.disabled)('state', e.selected ? 'checked' : 'unchecked');
  }
}
function AI(t, n) {
  if ((t & 1 && Ie(0, 'mat-pseudo-checkbox', 3), t & 2)) {
    let e = fe();
    de('disabled', e.disabled);
  }
}
function NI(t, n) {
  if ((t & 1 && (E(0, 'span', 4), ge(1), S()), t & 2)) {
    let e = fe();
    (I(), Qt('(', e.group.label, ')'));
  }
}
var yf = new g('MAT_OPTION_PARENT_COMPONENT'),
  vf = new g('MatOptgroup');
var _f = class {
    source;
    isUserInput;
    constructor(n, e = !1) {
      ((this.source = n), (this.isUserInput = e));
    }
  },
  pi = (() => {
    class t {
      _element = u(F);
      _changeDetectorRef = u(Dt);
      _parent = u(yf, { optional: !0 });
      group = u(vf, { optional: !0 });
      _signalDisableRipple = !1;
      _selected = !1;
      _active = !1;
      _mostRecentViewValue = '';
      get multiple() {
        return this._parent && this._parent.multiple;
      }
      get selected() {
        return this._selected;
      }
      value;
      id = u(lt).getId('mat-option-');
      get disabled() {
        return (this.group && this.group.disabled) || this._disabled();
      }
      set disabled(e) {
        this._disabled.set(e);
      }
      _disabled = ae(!1);
      get disableRipple() {
        return this._signalDisableRipple
          ? this._parent.disableRipple()
          : !!this._parent?.disableRipple;
      }
      get hideSingleSelectionIndicator() {
        return !!(this._parent && this._parent.hideSingleSelectionIndicator);
      }
      onSelectionChange = new G();
      _text;
      _stateChanges = new D();
      constructor() {
        let e = u(Nt);
        (e.load(py),
          e.load(S_),
          (this._signalDisableRipple = !!this._parent && qt(this._parent.disableRipple)));
      }
      get active() {
        return this._active;
      }
      get viewValue() {
        return (this._text?.nativeElement.textContent || '').trim();
      }
      select(e = !0) {
        this._selected ||
          ((this._selected = !0),
          this._changeDetectorRef.markForCheck(),
          e && this._emitSelectionChangeEvent());
      }
      deselect(e = !0) {
        this._selected &&
          ((this._selected = !1),
          this._changeDetectorRef.markForCheck(),
          e && this._emitSelectionChangeEvent());
      }
      focus(e, i) {
        let r = this._getHostElement();
        typeof r.focus == 'function' && r.focus(i);
      }
      setActiveStyles() {
        this._active || ((this._active = !0), this._changeDetectorRef.markForCheck());
      }
      setInactiveStyles() {
        this._active && ((this._active = !1), this._changeDetectorRef.markForCheck());
      }
      getLabel() {
        return this.viewValue;
      }
      _handleKeydown(e) {
        (e.keyCode === 13 || e.keyCode === 32) &&
          !Ot(e) &&
          (this._selectViaInteraction(), e.preventDefault());
      }
      _selectViaInteraction() {
        this.disabled ||
          ((this._selected = this.multiple ? !this._selected : !0),
          this._changeDetectorRef.markForCheck(),
          this._emitSelectionChangeEvent(!0));
      }
      _getTabIndex() {
        return this.disabled ? '-1' : '0';
      }
      _getHostElement() {
        return this._element.nativeElement;
      }
      ngAfterViewChecked() {
        if (this._selected) {
          let e = this.viewValue;
          e !== this._mostRecentViewValue &&
            (this._mostRecentViewValue && this._stateChanges.next(),
            (this._mostRecentViewValue = e));
        }
      }
      ngOnDestroy() {
        this._stateChanges.complete();
      }
      _emitSelectionChangeEvent(e = !1) {
        this.onSelectionChange.emit(new _f(this, e));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['mat-option']],
        viewQuery: function (i, r) {
          if ((i & 1 && be(xI, 7), i & 2)) {
            let o;
            H((o = U())) && (r._text = o.first);
          }
        },
        hostAttrs: ['role', 'option', 1, 'mat-mdc-option', 'mdc-list-item'],
        hostVars: 11,
        hostBindings: function (i, r) {
          (i & 1 &&
            me('click', function () {
              return r._selectViaInteraction();
            })('keydown', function (s) {
              return r._handleKeydown(s);
            }),
            i & 2 &&
              (En('id', r.id),
              ke('aria-selected', r.selected)('aria-disabled', r.disabled.toString()),
              ne('mdc-list-item--selected', r.selected)('mat-mdc-option-multiple', r.multiple)(
                'mat-mdc-option-active',
                r.active,
              )('mdc-list-item--disabled', r.disabled)));
        },
        inputs: { value: 'value', id: 'id', disabled: [2, 'disabled', 'disabled', K] },
        outputs: { onSelectionChange: 'onSelectionChange' },
        exportAs: ['matOption'],
        ngContentSelectors: TI,
        decls: 8,
        vars: 5,
        consts: [
          ['text', ''],
          ['aria-hidden', 'true', 1, 'mat-mdc-option-pseudo-checkbox', 3, 'disabled', 'state'],
          [1, 'mdc-list-item__primary-text'],
          [
            'state',
            'checked',
            'aria-hidden',
            'true',
            'appearance',
            'minimal',
            1,
            'mat-mdc-option-pseudo-checkbox',
            3,
            'disabled',
          ],
          [1, 'cdk-visually-hidden'],
          [
            'aria-hidden',
            'true',
            'mat-ripple',
            '',
            1,
            'mat-mdc-option-ripple',
            'mat-focus-indicator',
            3,
            'matRippleTrigger',
            'matRippleDisabled',
          ],
        ],
        template: function (i, r) {
          (i & 1 &&
            (Ze(MI),
            X(0, RI, 1, 2, 'mat-pseudo-checkbox', 1),
            re(1),
            E(2, 'span', 2, 0),
            re(4, 1),
            S(),
            X(5, AI, 1, 1, 'mat-pseudo-checkbox', 3),
            X(6, NI, 2, 1, 'span', 4),
            Ie(7, 'div', 5)),
            i & 2 &&
              (J(r.multiple ? 0 : -1),
              I(5),
              J(!r.multiple && r.selected && !r.hideSingleSelectionIndicator ? 5 : -1),
              I(),
              J(r.group && r.group._inert ? 6 : -1),
              I(),
              de('matRippleTrigger', r._getHostElement())(
                'matRippleDisabled',
                r.disabled || r.disableRipple,
              )));
        },
        dependencies: [hy, fy],
        styles: [
          `.mat-mdc-option{-webkit-user-select:none;user-select:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;min-height:48px;padding:0 16px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);color:var(--mat-option-label-text-color, var(--mat-sys-on-surface));font-family:var(--mat-option-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-option-label-text-size, var(--mat-sys-body-large-size));letter-spacing:var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));font-weight:var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight))}.mat-mdc-option:hover:not(.mdc-list-item--disabled){background-color:var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent))}.mat-mdc-option:focus.mdc-list-item,.mat-mdc-option.mat-mdc-option-active.mdc-list-item{background-color:var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));outline:0}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-multiple){background-color:var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container))}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-multiple) .mdc-list-item__primary-text{color:var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-option .mat-pseudo-checkbox{--mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-option.mdc-list-item{align-items:center;background:rgba(0,0,0,0)}.mat-mdc-option.mdc-list-item--disabled{cursor:default;pointer-events:none}.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox,.mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text,.mat-mdc-option.mdc-list-item--disabled>mat-icon{opacity:.38}.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:32px}[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:16px;padding-right:32px}.mat-mdc-option .mat-icon,.mat-mdc-option .mat-pseudo-checkbox-full{margin-right:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-icon,[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full{margin-right:0;margin-left:16px}.mat-mdc-option .mat-pseudo-checkbox-minimal{margin-left:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal{margin-right:16px;margin-left:0}.mat-mdc-option .mat-mdc-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-mdc-option .mdc-list-item__primary-text{white-space:normal;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;font-family:inherit;text-decoration:inherit;text-transform:inherit;margin-right:auto}[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text{margin-right:0;margin-left:auto}@media(forced-colors: active){.mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after{content:"";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}[dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after{right:auto;left:16px}}.mat-mdc-option-multiple{--mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent)}.mat-mdc-option-active .mat-focus-indicator::before{content:""}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })();
function my(t, n, e) {
  if (e.length) {
    let i = n.toArray(),
      r = e.toArray(),
      o = 0;
    for (let s = 0; s < t + 1; s++) i[s].group && i[s].group === r[o] && o++;
    return o;
  }
  return 0;
}
function gy(t, n, e, i) {
  return t < e ? t : t + n > e + i ? Math.max(0, t - i + n) : e;
}
var fo = class {};
function ho(t) {
  return t && typeof t.connect == 'function' && !(t instanceof gr);
}
var Rn = (function (t) {
    return (
      (t[(t.REPLACED = 0)] = 'REPLACED'),
      (t[(t.INSERTED = 1)] = 'INSERTED'),
      (t[(t.MOVED = 2)] = 'MOVED'),
      (t[(t.REMOVED = 3)] = 'REMOVED'),
      t
    );
  })(Rn || {}),
  ir = new g('_ViewRepeater');
var OI = 20,
  bf = (() => {
    class t {
      _ngZone = u(R);
      _platform = u(_e);
      _renderer = u(Ve).createRenderer(null, null);
      _cleanupGlobalListener;
      constructor() {}
      _scrolled = new D();
      _scrolledCount = 0;
      scrollContainers = new Map();
      register(e) {
        this.scrollContainers.has(e) ||
          this.scrollContainers.set(
            e,
            e.elementScrolled().subscribe(() => this._scrolled.next(e)),
          );
      }
      deregister(e) {
        let i = this.scrollContainers.get(e);
        i && (i.unsubscribe(), this.scrollContainers.delete(e));
      }
      scrolled(e = OI) {
        return this._platform.isBrowser
          ? new L((i) => {
              this._cleanupGlobalListener ||
                (this._cleanupGlobalListener = this._ngZone.runOutsideAngular(() =>
                  this._renderer.listen('document', 'scroll', () => this._scrolled.next()),
                ));
              let r = e > 0 ? this._scrolled.pipe(hs(e)).subscribe(i) : this._scrolled.subscribe(i);
              return (
                this._scrolledCount++,
                () => {
                  (r.unsubscribe(),
                    this._scrolledCount--,
                    this._scrolledCount ||
                      (this._cleanupGlobalListener?.(), (this._cleanupGlobalListener = void 0)));
                }
              );
            })
          : jt();
      }
      ngOnDestroy() {
        (this._cleanupGlobalListener?.(),
          (this._cleanupGlobalListener = void 0),
          this.scrollContainers.forEach((e, i) => this.deregister(i)),
          this._scrolled.complete());
      }
      ancestorScrolled(e, i) {
        let r = this.getAncestorScrollContainers(e);
        return this.scrolled(i).pipe(Pe((o) => !o || r.indexOf(o) > -1));
      }
      getAncestorScrollContainers(e) {
        let i = [];
        return (
          this.scrollContainers.forEach((r, o) => {
            this._scrollableContainsElement(o, e) && i.push(o);
          }),
          i
        );
      }
      _scrollableContainsElement(e, i) {
        let r = Jt(i),
          o = e.getElementRef().nativeElement;
        do if (r == o) return !0;
        while ((r = r.parentElement));
        return !1;
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var kI = 20,
  tn = (() => {
    class t {
      _platform = u(_e);
      _listeners;
      _viewportSize;
      _change = new D();
      _document = u(Z);
      constructor() {
        let e = u(R),
          i = u(Ve).createRenderer(null, null);
        e.runOutsideAngular(() => {
          if (this._platform.isBrowser) {
            let r = (o) => this._change.next(o);
            this._listeners = [
              i.listen('window', 'resize', r),
              i.listen('window', 'orientationchange', r),
            ];
          }
          this.change().subscribe(() => (this._viewportSize = null));
        });
      }
      ngOnDestroy() {
        (this._listeners?.forEach((e) => e()), this._change.complete());
      }
      getViewportSize() {
        this._viewportSize || this._updateViewportSize();
        let e = { width: this._viewportSize.width, height: this._viewportSize.height };
        return (this._platform.isBrowser || (this._viewportSize = null), e);
      }
      getViewportRect() {
        let e = this.getViewportScrollPosition(),
          { width: i, height: r } = this.getViewportSize();
        return {
          top: e.top,
          left: e.left,
          bottom: e.top + r,
          right: e.left + i,
          height: r,
          width: i,
        };
      }
      getViewportScrollPosition() {
        if (!this._platform.isBrowser) return { top: 0, left: 0 };
        let e = this._document,
          i = this._getWindow(),
          r = e.documentElement,
          o = r.getBoundingClientRect(),
          s = -o.top || e.body.scrollTop || i.scrollY || r.scrollTop || 0,
          a = -o.left || e.body.scrollLeft || i.scrollX || r.scrollLeft || 0;
        return { top: s, left: a };
      }
      change(e = kI) {
        return e > 0 ? this._change.pipe(hs(e)) : this._change;
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _updateViewportSize() {
        let e = this._getWindow();
        this._viewportSize = this._platform.isBrowser
          ? { width: e.innerWidth, height: e.innerHeight }
          : { width: 0, height: 0 };
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var Ua = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵmod = j({ type: t });
      static ɵinj = V({});
    }
    return t;
  })(),
  po = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵmod = j({ type: t });
      static ɵinj = V({ imports: [xn, Ua, xn, Ua] });
    }
    return t;
  })();
var mo = class {
    _attachedHost;
    attach(n) {
      return ((this._attachedHost = n), n.attach(this));
    }
    detach() {
      let n = this._attachedHost;
      n != null && ((this._attachedHost = null), n.detach());
    }
    get isAttached() {
      return this._attachedHost != null;
    }
    setAttachedHost(n) {
      this._attachedHost = n;
    }
  },
  Df = class extends mo {
    component;
    viewContainerRef;
    injector;
    projectableNodes;
    constructor(n, e, i, r) {
      (super(),
        (this.component = n),
        (this.viewContainerRef = e),
        (this.injector = i),
        (this.projectableNodes = r));
    }
  },
  go = class extends mo {
    templateRef;
    viewContainerRef;
    context;
    injector;
    constructor(n, e, i, r) {
      (super(),
        (this.templateRef = n),
        (this.viewContainerRef = e),
        (this.context = i),
        (this.injector = r));
    }
    get origin() {
      return this.templateRef.elementRef;
    }
    attach(n, e = this.context) {
      return ((this.context = e), super.attach(n));
    }
    detach() {
      return ((this.context = void 0), super.detach());
    }
  },
  Cf = class extends mo {
    element;
    constructor(n) {
      (super(), (this.element = n instanceof F ? n.nativeElement : n));
    }
  },
  Ef = class {
    _attachedPortal;
    _disposeFn;
    _isDisposed = !1;
    hasAttached() {
      return !!this._attachedPortal;
    }
    attach(n) {
      if (n instanceof Df) return ((this._attachedPortal = n), this.attachComponentPortal(n));
      if (n instanceof go) return ((this._attachedPortal = n), this.attachTemplatePortal(n));
      if (this.attachDomPortal && n instanceof Cf)
        return ((this._attachedPortal = n), this.attachDomPortal(n));
    }
    attachDomPortal = null;
    detach() {
      (this._attachedPortal &&
        (this._attachedPortal.setAttachedHost(null), (this._attachedPortal = null)),
        this._invokeDisposeFn());
    }
    dispose() {
      (this.hasAttached() && this.detach(), this._invokeDisposeFn(), (this._isDisposed = !0));
    }
    setDisposeFn(n) {
      this._disposeFn = n;
    }
    _invokeDisposeFn() {
      this._disposeFn && (this._disposeFn(), (this._disposeFn = null));
    }
  },
  za = class extends Ef {
    outletElement;
    _appRef;
    _defaultInjector;
    constructor(n, e, i) {
      (super(), (this.outletElement = n), (this._appRef = e), (this._defaultInjector = i));
    }
    attachComponentPortal(n) {
      let e;
      if (n.viewContainerRef) {
        let i = n.injector || n.viewContainerRef.injector,
          r = i.get(zi, null, { optional: !0 }) || void 0;
        ((e = n.viewContainerRef.createComponent(n.component, {
          index: n.viewContainerRef.length,
          injector: i,
          ngModuleRef: r,
          projectableNodes: n.projectableNodes || void 0,
        })),
          this.setDisposeFn(() => e.destroy()));
      } else {
        let i = this._appRef,
          r = n.injector || this._defaultInjector || Y.NULL,
          o = r.get(Me, i.injector);
        ((e = wa(n.component, {
          elementInjector: r,
          environmentInjector: o,
          projectableNodes: n.projectableNodes || void 0,
        })),
          i.attachView(e.hostView),
          this.setDisposeFn(() => {
            (i.viewCount > 0 && i.detachView(e.hostView), e.destroy());
          }));
      }
      return (
        this.outletElement.appendChild(this._getComponentRootNode(e)),
        (this._attachedPortal = n),
        e
      );
    }
    attachTemplatePortal(n) {
      let e = n.viewContainerRef,
        i = e.createEmbeddedView(n.templateRef, n.context, { injector: n.injector });
      return (
        i.rootNodes.forEach((r) => this.outletElement.appendChild(r)),
        i.detectChanges(),
        this.setDisposeFn(() => {
          let r = e.indexOf(i);
          r !== -1 && e.remove(r);
        }),
        (this._attachedPortal = n),
        i
      );
    }
    attachDomPortal = (n) => {
      let e = n.element;
      e.parentNode;
      let i = this.outletElement.ownerDocument.createComment('dom-portal');
      (e.parentNode.insertBefore(i, e),
        this.outletElement.appendChild(e),
        (this._attachedPortal = n),
        super.setDisposeFn(() => {
          i.parentNode && i.parentNode.replaceChild(e, i);
        }));
    };
    dispose() {
      (super.dispose(), this.outletElement.remove());
    }
    _getComponentRootNode(n) {
      return n.hostView.rootNodes[0];
    }
  };
var _y = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({});
  }
  return t;
})();
var yy = z_();
function Sy(t) {
  return new $a(t.get(tn), t.get(Z));
}
var $a = class {
  _viewportRuler;
  _previousHTMLStyles = { top: '', left: '' };
  _previousScrollPosition;
  _isEnabled = !1;
  _document;
  constructor(n, e) {
    ((this._viewportRuler = n), (this._document = e));
  }
  attach() {}
  enable() {
    if (this._canBeEnabled()) {
      let n = this._document.documentElement;
      ((this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition()),
        (this._previousHTMLStyles.left = n.style.left || ''),
        (this._previousHTMLStyles.top = n.style.top || ''),
        (n.style.left = De(-this._previousScrollPosition.left)),
        (n.style.top = De(-this._previousScrollPosition.top)),
        n.classList.add('cdk-global-scrollblock'),
        (this._isEnabled = !0));
    }
  }
  disable() {
    if (this._isEnabled) {
      let n = this._document.documentElement,
        e = this._document.body,
        i = n.style,
        r = e.style,
        o = i.scrollBehavior || '',
        s = r.scrollBehavior || '';
      ((this._isEnabled = !1),
        (i.left = this._previousHTMLStyles.left),
        (i.top = this._previousHTMLStyles.top),
        n.classList.remove('cdk-global-scrollblock'),
        yy && (i.scrollBehavior = r.scrollBehavior = 'auto'),
        window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top),
        yy && ((i.scrollBehavior = o), (r.scrollBehavior = s)));
    }
  }
  _canBeEnabled() {
    if (
      this._document.documentElement.classList.contains('cdk-global-scrollblock') ||
      this._isEnabled
    )
      return !1;
    let e = this._document.documentElement,
      i = this._viewportRuler.getViewportSize();
    return e.scrollHeight > i.height || e.scrollWidth > i.width;
  }
};
function xy(t, n) {
  return new Ga(t.get(bf), t.get(R), t.get(tn), n);
}
var Ga = class {
  _scrollDispatcher;
  _ngZone;
  _viewportRuler;
  _config;
  _scrollSubscription = null;
  _overlayRef;
  _initialScrollPosition;
  constructor(n, e, i, r) {
    ((this._scrollDispatcher = n),
      (this._ngZone = e),
      (this._viewportRuler = i),
      (this._config = r));
  }
  attach(n) {
    (this._overlayRef, (this._overlayRef = n));
  }
  enable() {
    if (this._scrollSubscription) return;
    let n = this._scrollDispatcher
      .scrolled(0)
      .pipe(
        Pe((e) => !e || !this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)),
      );
    this._config && this._config.threshold && this._config.threshold > 1
      ? ((this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top),
        (this._scrollSubscription = n.subscribe(() => {
          let e = this._viewportRuler.getViewportScrollPosition().top;
          Math.abs(e - this._initialScrollPosition) > this._config.threshold
            ? this._detach()
            : this._overlayRef.updatePosition();
        })))
      : (this._scrollSubscription = n.subscribe(this._detach));
  }
  disable() {
    this._scrollSubscription &&
      (this._scrollSubscription.unsubscribe(), (this._scrollSubscription = null));
  }
  detach() {
    (this.disable(), (this._overlayRef = null));
  }
  _detach = () => {
    (this.disable(),
      this._overlayRef.hasAttached() && this._ngZone.run(() => this._overlayRef.detach()));
  };
};
var _o = class {
  enable() {}
  disable() {}
  attach() {}
};
function wf(t, n) {
  return n.some((e) => {
    let i = t.bottom < e.top,
      r = t.top > e.bottom,
      o = t.right < e.left,
      s = t.left > e.right;
    return i || r || o || s;
  });
}
function vy(t, n) {
  return n.some((e) => {
    let i = t.top < e.top,
      r = t.bottom > e.bottom,
      o = t.left < e.left,
      s = t.right > e.right;
    return i || r || o || s;
  });
}
function gi(t, n) {
  return new Wa(t.get(bf), t.get(tn), t.get(R), n);
}
var Wa = class {
    _scrollDispatcher;
    _viewportRuler;
    _ngZone;
    _config;
    _scrollSubscription = null;
    _overlayRef;
    constructor(n, e, i, r) {
      ((this._scrollDispatcher = n),
        (this._viewportRuler = e),
        (this._ngZone = i),
        (this._config = r));
    }
    attach(n) {
      (this._overlayRef, (this._overlayRef = n));
    }
    enable() {
      if (!this._scrollSubscription) {
        let n = this._config ? this._config.scrollThrottle : 0;
        this._scrollSubscription = this._scrollDispatcher.scrolled(n).subscribe(() => {
          if ((this._overlayRef.updatePosition(), this._config && this._config.autoClose)) {
            let e = this._overlayRef.overlayElement.getBoundingClientRect(),
              { width: i, height: r } = this._viewportRuler.getViewportSize();
            wf(e, [{ width: i, height: r, bottom: r, right: i, top: 0, left: 0 }]) &&
              (this.disable(), this._ngZone.run(() => this._overlayRef.detach()));
          }
        });
      }
    }
    disable() {
      this._scrollSubscription &&
        (this._scrollSubscription.unsubscribe(), (this._scrollSubscription = null));
    }
    detach() {
      (this.disable(), (this._overlayRef = null));
    }
  },
  My = (() => {
    class t {
      _injector = u(Y);
      constructor() {}
      noop = () => new _o();
      close = (e) => xy(this._injector, e);
      block = () => Sy(this._injector);
      reposition = (e) => gi(this._injector, e);
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  yo = class {
    positionStrategy;
    scrollStrategy = new _o();
    panelClass = '';
    hasBackdrop = !1;
    backdropClass = 'cdk-overlay-dark-backdrop';
    disableAnimations;
    width;
    height;
    minWidth;
    minHeight;
    maxWidth;
    maxHeight;
    direction;
    disposeOnNavigation = !1;
    constructor(n) {
      if (n) {
        let e = Object.keys(n);
        for (let i of e) n[i] !== void 0 && (this[i] = n[i]);
      }
    }
  };
var qa = class {
  connectionPair;
  scrollableViewProperties;
  constructor(n, e) {
    ((this.connectionPair = n), (this.scrollableViewProperties = e));
  }
};
var Ty = (() => {
    class t {
      _attachedOverlays = [];
      _document = u(Z);
      _isAttached;
      constructor() {}
      ngOnDestroy() {
        this.detach();
      }
      add(e) {
        (this.remove(e), this._attachedOverlays.push(e));
      }
      remove(e) {
        let i = this._attachedOverlays.indexOf(e);
        (i > -1 && this._attachedOverlays.splice(i, 1),
          this._attachedOverlays.length === 0 && this.detach());
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Ry = (() => {
    class t extends Ty {
      _ngZone = u(R);
      _renderer = u(Ve).createRenderer(null, null);
      _cleanupKeydown;
      add(e) {
        (super.add(e),
          this._isAttached ||
            (this._ngZone.runOutsideAngular(() => {
              this._cleanupKeydown = this._renderer.listen(
                'body',
                'keydown',
                this._keydownListener,
              );
            }),
            (this._isAttached = !0)));
      }
      detach() {
        this._isAttached && (this._cleanupKeydown?.(), (this._isAttached = !1));
      }
      _keydownListener = (e) => {
        let i = this._attachedOverlays;
        for (let r = i.length - 1; r > -1; r--)
          if (i[r]._keydownEvents.observers.length > 0) {
            this._ngZone.run(() => i[r]._keydownEvents.next(e));
            break;
          }
      };
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Ay = (() => {
    class t extends Ty {
      _platform = u(_e);
      _ngZone = u(R);
      _renderer = u(Ve).createRenderer(null, null);
      _cursorOriginalValue;
      _cursorStyleIsSet = !1;
      _pointerDownEventTarget;
      _cleanups;
      add(e) {
        if ((super.add(e), !this._isAttached)) {
          let i = this._document.body,
            r = { capture: !0 },
            o = this._renderer;
          ((this._cleanups = this._ngZone.runOutsideAngular(() => [
            o.listen(i, 'pointerdown', this._pointerDownListener, r),
            o.listen(i, 'click', this._clickListener, r),
            o.listen(i, 'auxclick', this._clickListener, r),
            o.listen(i, 'contextmenu', this._clickListener, r),
          ])),
            this._platform.IOS &&
              !this._cursorStyleIsSet &&
              ((this._cursorOriginalValue = i.style.cursor),
              (i.style.cursor = 'pointer'),
              (this._cursorStyleIsSet = !0)),
            (this._isAttached = !0));
        }
      }
      detach() {
        this._isAttached &&
          (this._cleanups?.forEach((e) => e()),
          (this._cleanups = void 0),
          this._platform.IOS &&
            this._cursorStyleIsSet &&
            ((this._document.body.style.cursor = this._cursorOriginalValue),
            (this._cursorStyleIsSet = !1)),
          (this._isAttached = !1));
      }
      _pointerDownListener = (e) => {
        this._pointerDownEventTarget = ui(e);
      };
      _clickListener = (e) => {
        let i = ui(e),
          r = e.type === 'click' && this._pointerDownEventTarget ? this._pointerDownEventTarget : i;
        this._pointerDownEventTarget = null;
        let o = this._attachedOverlays.slice();
        for (let s = o.length - 1; s > -1; s--) {
          let a = o[s];
          if (a._outsidePointerEvents.observers.length < 1 || !a.hasAttached()) continue;
          if (by(a.overlayElement, i) || by(a.overlayElement, r)) break;
          let l = a._outsidePointerEvents;
          this._ngZone ? this._ngZone.run(() => l.next(e)) : l.next(e);
        }
      };
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
function by(t, n) {
  let e = typeof ShadowRoot < 'u' && ShadowRoot,
    i = n;
  for (; i; ) {
    if (i === t) return !0;
    i = e && i instanceof ShadowRoot ? i.host : i.parentNode;
  }
  return !1;
}
var Ny = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['ng-component']],
        hostAttrs: ['cdk-overlay-style-loader', ''],
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `.cdk-overlay-container,.cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed}@layer cdk-overlay{.cdk-overlay-container{z-index:1000}}.cdk-overlay-container:empty{display:none}.cdk-global-overlay-wrapper{display:flex;position:absolute}@layer cdk-overlay{.cdk-global-overlay-wrapper{z-index:1000}}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;display:flex;max-width:100%;max-height:100%}@layer cdk-overlay{.cdk-overlay-pane{z-index:1000}}.cdk-overlay-backdrop{position:absolute;top:0;bottom:0;left:0;right:0;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);opacity:0;touch-action:manipulation}@layer cdk-overlay{.cdk-overlay-backdrop{z-index:1000;transition:opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}}@media(prefers-reduced-motion){.cdk-overlay-backdrop{transition-duration:1ms}}.cdk-overlay-backdrop-showing{opacity:1}@media(forced-colors: active){.cdk-overlay-backdrop-showing{opacity:.6}}@layer cdk-overlay{.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.32)}}.cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing,.cdk-high-contrast-active .cdk-overlay-transparent-backdrop{opacity:0;visibility:visible}.cdk-overlay-backdrop-noop-animation{transition:none}.cdk-overlay-connected-position-bounding-box{position:absolute;display:flex;flex-direction:column;min-width:1px;min-height:1px}@layer cdk-overlay{.cdk-overlay-connected-position-bounding-box{z-index:1000}}.cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  Oy = (() => {
    class t {
      _platform = u(_e);
      _containerElement;
      _document = u(Z);
      _styleLoader = u(Nt);
      constructor() {}
      ngOnDestroy() {
        this._containerElement?.remove();
      }
      getContainerElement() {
        return (
          this._loadStyles(),
          this._containerElement || this._createContainer(),
          this._containerElement
        );
      }
      _createContainer() {
        let e = 'cdk-overlay-container';
        if (this._platform.isBrowser || cf()) {
          let r = this._document.querySelectorAll(
            `.${e}[platform="server"], .${e}[platform="test"]`,
          );
          for (let o = 0; o < r.length; o++) r[o].remove();
        }
        let i = this._document.createElement('div');
        (i.classList.add(e),
          cf()
            ? i.setAttribute('platform', 'test')
            : this._platform.isBrowser || i.setAttribute('platform', 'server'),
          this._document.body.appendChild(i),
          (this._containerElement = i));
      }
      _loadStyles() {
        this._styleLoader.load(Ny);
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  If = class {
    _renderer;
    _ngZone;
    element;
    _cleanupClick;
    _cleanupTransitionEnd;
    _fallbackTimeout;
    constructor(n, e, i, r) {
      ((this._renderer = e),
        (this._ngZone = i),
        (this.element = n.createElement('div')),
        this.element.classList.add('cdk-overlay-backdrop'),
        (this._cleanupClick = e.listen(this.element, 'click', r)));
    }
    detach() {
      this._ngZone.runOutsideAngular(() => {
        let n = this.element;
        (clearTimeout(this._fallbackTimeout),
          this._cleanupTransitionEnd?.(),
          (this._cleanupTransitionEnd = this._renderer.listen(n, 'transitionend', this.dispose)),
          (this._fallbackTimeout = setTimeout(this.dispose, 500)),
          (n.style.pointerEvents = 'none'),
          n.classList.remove('cdk-overlay-backdrop-showing'));
      });
    }
    dispose = () => {
      (clearTimeout(this._fallbackTimeout),
        this._cleanupClick?.(),
        this._cleanupTransitionEnd?.(),
        (this._cleanupClick = this._cleanupTransitionEnd = this._fallbackTimeout = void 0),
        this.element.remove());
    };
  },
  Ya = class {
    _portalOutlet;
    _host;
    _pane;
    _config;
    _ngZone;
    _keyboardDispatcher;
    _document;
    _location;
    _outsideClickDispatcher;
    _animationsDisabled;
    _injector;
    _renderer;
    _backdropClick = new D();
    _attachments = new D();
    _detachments = new D();
    _positionStrategy;
    _scrollStrategy;
    _locationChanges = W.EMPTY;
    _backdropRef = null;
    _detachContentMutationObserver;
    _detachContentAfterRenderRef;
    _previousHostParent;
    _keydownEvents = new D();
    _outsidePointerEvents = new D();
    _afterNextRenderRef;
    constructor(n, e, i, r, o, s, a, l, c, d = !1, f, p) {
      ((this._portalOutlet = n),
        (this._host = e),
        (this._pane = i),
        (this._config = r),
        (this._ngZone = o),
        (this._keyboardDispatcher = s),
        (this._document = a),
        (this._location = l),
        (this._outsideClickDispatcher = c),
        (this._animationsDisabled = d),
        (this._injector = f),
        (this._renderer = p),
        r.scrollStrategy &&
          ((this._scrollStrategy = r.scrollStrategy), this._scrollStrategy.attach(this)),
        (this._positionStrategy = r.positionStrategy));
    }
    get overlayElement() {
      return this._pane;
    }
    get backdropElement() {
      return this._backdropRef?.element || null;
    }
    get hostElement() {
      return this._host;
    }
    attach(n) {
      !this._host.parentElement &&
        this._previousHostParent &&
        this._previousHostParent.appendChild(this._host);
      let e = this._portalOutlet.attach(n);
      return (
        this._positionStrategy && this._positionStrategy.attach(this),
        this._updateStackingOrder(),
        this._updateElementSize(),
        this._updateElementDirection(),
        this._scrollStrategy && this._scrollStrategy.enable(),
        this._afterNextRenderRef?.destroy(),
        (this._afterNextRenderRef = at(
          () => {
            this.hasAttached() && this.updatePosition();
          },
          { injector: this._injector },
        )),
        this._togglePointerEvents(!0),
        this._config.hasBackdrop && this._attachBackdrop(),
        this._config.panelClass && this._toggleClasses(this._pane, this._config.panelClass, !0),
        this._attachments.next(),
        this._completeDetachContent(),
        this._keyboardDispatcher.add(this),
        this._config.disposeOnNavigation &&
          (this._locationChanges = this._location.subscribe(() => this.dispose())),
        this._outsideClickDispatcher.add(this),
        typeof e?.onDestroy == 'function' &&
          e.onDestroy(() => {
            this.hasAttached() &&
              this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this.detach()));
          }),
        e
      );
    }
    detach() {
      if (!this.hasAttached()) return;
      (this.detachBackdrop(),
        this._togglePointerEvents(!1),
        this._positionStrategy && this._positionStrategy.detach && this._positionStrategy.detach(),
        this._scrollStrategy && this._scrollStrategy.disable());
      let n = this._portalOutlet.detach();
      return (
        this._detachments.next(),
        this._completeDetachContent(),
        this._keyboardDispatcher.remove(this),
        this._detachContentWhenEmpty(),
        this._locationChanges.unsubscribe(),
        this._outsideClickDispatcher.remove(this),
        n
      );
    }
    dispose() {
      let n = this.hasAttached();
      (this._positionStrategy && this._positionStrategy.dispose(),
        this._disposeScrollStrategy(),
        this._backdropRef?.dispose(),
        this._locationChanges.unsubscribe(),
        this._keyboardDispatcher.remove(this),
        this._portalOutlet.dispose(),
        this._attachments.complete(),
        this._backdropClick.complete(),
        this._keydownEvents.complete(),
        this._outsidePointerEvents.complete(),
        this._outsideClickDispatcher.remove(this),
        this._host?.remove(),
        this._afterNextRenderRef?.destroy(),
        (this._previousHostParent = this._pane = this._host = this._backdropRef = null),
        n && this._detachments.next(),
        this._detachments.complete(),
        this._completeDetachContent());
    }
    hasAttached() {
      return this._portalOutlet.hasAttached();
    }
    backdropClick() {
      return this._backdropClick;
    }
    attachments() {
      return this._attachments;
    }
    detachments() {
      return this._detachments;
    }
    keydownEvents() {
      return this._keydownEvents;
    }
    outsidePointerEvents() {
      return this._outsidePointerEvents;
    }
    getConfig() {
      return this._config;
    }
    updatePosition() {
      this._positionStrategy && this._positionStrategy.apply();
    }
    updatePositionStrategy(n) {
      n !== this._positionStrategy &&
        (this._positionStrategy && this._positionStrategy.dispose(),
        (this._positionStrategy = n),
        this.hasAttached() && (n.attach(this), this.updatePosition()));
    }
    updateSize(n) {
      ((this._config = x(x({}, this._config), n)), this._updateElementSize());
    }
    setDirection(n) {
      ((this._config = Q(x({}, this._config), { direction: n })), this._updateElementDirection());
    }
    addPanelClass(n) {
      this._pane && this._toggleClasses(this._pane, n, !0);
    }
    removePanelClass(n) {
      this._pane && this._toggleClasses(this._pane, n, !1);
    }
    getDirection() {
      let n = this._config.direction;
      return n ? (typeof n == 'string' ? n : n.value) : 'ltr';
    }
    updateScrollStrategy(n) {
      n !== this._scrollStrategy &&
        (this._disposeScrollStrategy(),
        (this._scrollStrategy = n),
        this.hasAttached() && (n.attach(this), n.enable()));
    }
    _updateElementDirection() {
      this._host.setAttribute('dir', this.getDirection());
    }
    _updateElementSize() {
      if (!this._pane) return;
      let n = this._pane.style;
      ((n.width = De(this._config.width)),
        (n.height = De(this._config.height)),
        (n.minWidth = De(this._config.minWidth)),
        (n.minHeight = De(this._config.minHeight)),
        (n.maxWidth = De(this._config.maxWidth)),
        (n.maxHeight = De(this._config.maxHeight)));
    }
    _togglePointerEvents(n) {
      this._pane.style.pointerEvents = n ? '' : 'none';
    }
    _attachBackdrop() {
      let n = 'cdk-overlay-backdrop-showing';
      (this._backdropRef?.dispose(),
        (this._backdropRef = new If(this._document, this._renderer, this._ngZone, (e) => {
          this._backdropClick.next(e);
        })),
        this._animationsDisabled &&
          this._backdropRef.element.classList.add('cdk-overlay-backdrop-noop-animation'),
        this._config.backdropClass &&
          this._toggleClasses(this._backdropRef.element, this._config.backdropClass, !0),
        this._host.parentElement.insertBefore(this._backdropRef.element, this._host),
        !this._animationsDisabled && typeof requestAnimationFrame < 'u'
          ? this._ngZone.runOutsideAngular(() => {
              requestAnimationFrame(() => this._backdropRef?.element.classList.add(n));
            })
          : this._backdropRef.element.classList.add(n));
    }
    _updateStackingOrder() {
      this._host.nextSibling && this._host.parentNode.appendChild(this._host);
    }
    detachBackdrop() {
      this._animationsDisabled
        ? (this._backdropRef?.dispose(), (this._backdropRef = null))
        : this._backdropRef?.detach();
    }
    _toggleClasses(n, e, i) {
      let r = Ji(e || []).filter((o) => !!o);
      r.length && (i ? n.classList.add(...r) : n.classList.remove(...r));
    }
    _detachContentWhenEmpty() {
      let n = !1;
      try {
        this._detachContentAfterRenderRef = at(
          () => {
            ((n = !0), this._detachContent());
          },
          { injector: this._injector },
        );
      } catch (e) {
        if (n) throw e;
        this._detachContent();
      }
      globalThis.MutationObserver &&
        this._pane &&
        ((this._detachContentMutationObserver ||= new globalThis.MutationObserver(() => {
          this._detachContent();
        })),
        this._detachContentMutationObserver.observe(this._pane, { childList: !0 }));
    }
    _detachContent() {
      (!this._pane || !this._host || this._pane.children.length === 0) &&
        (this._pane &&
          this._config.panelClass &&
          this._toggleClasses(this._pane, this._config.panelClass, !1),
        this._host &&
          this._host.parentElement &&
          ((this._previousHostParent = this._host.parentElement), this._host.remove()),
        this._completeDetachContent());
    }
    _completeDetachContent() {
      (this._detachContentAfterRenderRef?.destroy(),
        (this._detachContentAfterRenderRef = void 0),
        this._detachContentMutationObserver?.disconnect());
    }
    _disposeScrollStrategy() {
      let n = this._scrollStrategy;
      (n?.disable(), n?.detach?.());
    }
  },
  Dy = 'cdk-overlay-connected-position-bounding-box',
  FI = /([A-Za-z%]+)$/;
function Sf(t, n) {
  return new Za(n, t.get(tn), t.get(Z), t.get(_e), t.get(Oy));
}
var Za = class {
  _viewportRuler;
  _document;
  _platform;
  _overlayContainer;
  _overlayRef;
  _isInitialRender;
  _lastBoundingBoxSize = { width: 0, height: 0 };
  _isPushed = !1;
  _canPush = !0;
  _growAfterOpen = !1;
  _hasFlexibleDimensions = !0;
  _positionLocked = !1;
  _originRect;
  _overlayRect;
  _viewportRect;
  _containerRect;
  _viewportMargin = 0;
  _scrollables = [];
  _preferredPositions = [];
  _origin;
  _pane;
  _isDisposed;
  _boundingBox;
  _lastPosition;
  _lastScrollVisibility;
  _positionChanges = new D();
  _resizeSubscription = W.EMPTY;
  _offsetX = 0;
  _offsetY = 0;
  _transformOriginSelector;
  _appliedPanelClasses = [];
  _previousPushAmount;
  positionChanges = this._positionChanges;
  get positions() {
    return this._preferredPositions;
  }
  constructor(n, e, i, r, o) {
    ((this._viewportRuler = e),
      (this._document = i),
      (this._platform = r),
      (this._overlayContainer = o),
      this.setOrigin(n));
  }
  attach(n) {
    (this._overlayRef && this._overlayRef,
      this._validatePositions(),
      n.hostElement.classList.add(Dy),
      (this._overlayRef = n),
      (this._boundingBox = n.hostElement),
      (this._pane = n.overlayElement),
      (this._isDisposed = !1),
      (this._isInitialRender = !0),
      (this._lastPosition = null),
      this._resizeSubscription.unsubscribe(),
      (this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
        ((this._isInitialRender = !0), this.apply());
      })));
  }
  apply() {
    if (this._isDisposed || !this._platform.isBrowser) return;
    if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
      this.reapplyLastPosition();
      return;
    }
    (this._clearPanelClasses(),
      this._resetOverlayElementStyles(),
      this._resetBoundingBoxStyles(),
      (this._viewportRect = this._getNarrowedViewportRect()),
      (this._originRect = this._getOriginRect()),
      (this._overlayRect = this._pane.getBoundingClientRect()),
      (this._containerRect = this._overlayContainer.getContainerElement().getBoundingClientRect()));
    let n = this._originRect,
      e = this._overlayRect,
      i = this._viewportRect,
      r = this._containerRect,
      o = [],
      s;
    for (let a of this._preferredPositions) {
      let l = this._getOriginPoint(n, r, a),
        c = this._getOverlayPoint(l, e, a),
        d = this._getOverlayFit(c, e, i, a);
      if (d.isCompletelyWithinViewport) {
        ((this._isPushed = !1), this._applyPosition(a, l));
        return;
      }
      if (this._canFitWithFlexibleDimensions(d, c, i)) {
        o.push({
          position: a,
          origin: l,
          overlayRect: e,
          boundingBoxRect: this._calculateBoundingBoxRect(l, a),
        });
        continue;
      }
      (!s || s.overlayFit.visibleArea < d.visibleArea) &&
        (s = { overlayFit: d, overlayPoint: c, originPoint: l, position: a, overlayRect: e });
    }
    if (o.length) {
      let a = null,
        l = -1;
      for (let c of o) {
        let d = c.boundingBoxRect.width * c.boundingBoxRect.height * (c.position.weight || 1);
        d > l && ((l = d), (a = c));
      }
      ((this._isPushed = !1), this._applyPosition(a.position, a.origin));
      return;
    }
    if (this._canPush) {
      ((this._isPushed = !0), this._applyPosition(s.position, s.originPoint));
      return;
    }
    this._applyPosition(s.position, s.originPoint);
  }
  detach() {
    (this._clearPanelClasses(),
      (this._lastPosition = null),
      (this._previousPushAmount = null),
      this._resizeSubscription.unsubscribe());
  }
  dispose() {
    this._isDisposed ||
      (this._boundingBox &&
        mi(this._boundingBox.style, {
          top: '',
          left: '',
          right: '',
          bottom: '',
          height: '',
          width: '',
          alignItems: '',
          justifyContent: '',
        }),
      this._pane && this._resetOverlayElementStyles(),
      this._overlayRef && this._overlayRef.hostElement.classList.remove(Dy),
      this.detach(),
      this._positionChanges.complete(),
      (this._overlayRef = this._boundingBox = null),
      (this._isDisposed = !0));
  }
  reapplyLastPosition() {
    if (this._isDisposed || !this._platform.isBrowser) return;
    let n = this._lastPosition;
    if (n) {
      ((this._originRect = this._getOriginRect()),
        (this._overlayRect = this._pane.getBoundingClientRect()),
        (this._viewportRect = this._getNarrowedViewportRect()),
        (this._containerRect = this._overlayContainer
          .getContainerElement()
          .getBoundingClientRect()));
      let e = this._getOriginPoint(this._originRect, this._containerRect, n);
      this._applyPosition(n, e);
    } else this.apply();
  }
  withScrollableContainers(n) {
    return ((this._scrollables = n), this);
  }
  withPositions(n) {
    return (
      (this._preferredPositions = n),
      n.indexOf(this._lastPosition) === -1 && (this._lastPosition = null),
      this._validatePositions(),
      this
    );
  }
  withViewportMargin(n) {
    return ((this._viewportMargin = n), this);
  }
  withFlexibleDimensions(n = !0) {
    return ((this._hasFlexibleDimensions = n), this);
  }
  withGrowAfterOpen(n = !0) {
    return ((this._growAfterOpen = n), this);
  }
  withPush(n = !0) {
    return ((this._canPush = n), this);
  }
  withLockedPosition(n = !0) {
    return ((this._positionLocked = n), this);
  }
  setOrigin(n) {
    return ((this._origin = n), this);
  }
  withDefaultOffsetX(n) {
    return ((this._offsetX = n), this);
  }
  withDefaultOffsetY(n) {
    return ((this._offsetY = n), this);
  }
  withTransformOriginOn(n) {
    return ((this._transformOriginSelector = n), this);
  }
  _getOriginPoint(n, e, i) {
    let r;
    if (i.originX == 'center') r = n.left + n.width / 2;
    else {
      let s = this._isRtl() ? n.right : n.left,
        a = this._isRtl() ? n.left : n.right;
      r = i.originX == 'start' ? s : a;
    }
    e.left < 0 && (r -= e.left);
    let o;
    return (
      i.originY == 'center'
        ? (o = n.top + n.height / 2)
        : (o = i.originY == 'top' ? n.top : n.bottom),
      e.top < 0 && (o -= e.top),
      { x: r, y: o }
    );
  }
  _getOverlayPoint(n, e, i) {
    let r;
    i.overlayX == 'center'
      ? (r = -e.width / 2)
      : i.overlayX === 'start'
        ? (r = this._isRtl() ? -e.width : 0)
        : (r = this._isRtl() ? 0 : -e.width);
    let o;
    return (
      i.overlayY == 'center' ? (o = -e.height / 2) : (o = i.overlayY == 'top' ? 0 : -e.height),
      { x: n.x + r, y: n.y + o }
    );
  }
  _getOverlayFit(n, e, i, r) {
    let o = Ey(e),
      { x: s, y: a } = n,
      l = this._getOffset(r, 'x'),
      c = this._getOffset(r, 'y');
    (l && (s += l), c && (a += c));
    let d = 0 - s,
      f = s + o.width - i.width,
      p = 0 - a,
      h = a + o.height - i.height,
      m = this._subtractOverflows(o.width, d, f),
      _ = this._subtractOverflows(o.height, p, h),
      w = m * _;
    return {
      visibleArea: w,
      isCompletelyWithinViewport: o.width * o.height === w,
      fitsInViewportVertically: _ === o.height,
      fitsInViewportHorizontally: m == o.width,
    };
  }
  _canFitWithFlexibleDimensions(n, e, i) {
    if (this._hasFlexibleDimensions) {
      let r = i.bottom - e.y,
        o = i.right - e.x,
        s = Cy(this._overlayRef.getConfig().minHeight),
        a = Cy(this._overlayRef.getConfig().minWidth),
        l = n.fitsInViewportVertically || (s != null && s <= r),
        c = n.fitsInViewportHorizontally || (a != null && a <= o);
      return l && c;
    }
    return !1;
  }
  _pushOverlayOnScreen(n, e, i) {
    if (this._previousPushAmount && this._positionLocked)
      return { x: n.x + this._previousPushAmount.x, y: n.y + this._previousPushAmount.y };
    let r = Ey(e),
      o = this._viewportRect,
      s = Math.max(n.x + r.width - o.width, 0),
      a = Math.max(n.y + r.height - o.height, 0),
      l = Math.max(o.top - i.top - n.y, 0),
      c = Math.max(o.left - i.left - n.x, 0),
      d = 0,
      f = 0;
    return (
      r.width <= o.width
        ? (d = c || -s)
        : (d = n.x < this._viewportMargin ? o.left - i.left - n.x : 0),
      r.height <= o.height
        ? (f = l || -a)
        : (f = n.y < this._viewportMargin ? o.top - i.top - n.y : 0),
      (this._previousPushAmount = { x: d, y: f }),
      { x: n.x + d, y: n.y + f }
    );
  }
  _applyPosition(n, e) {
    if (
      (this._setTransformOrigin(n),
      this._setOverlayElementStyles(e, n),
      this._setBoundingBoxStyles(e, n),
      n.panelClass && this._addPanelClasses(n.panelClass),
      this._positionChanges.observers.length)
    ) {
      let i = this._getScrollVisibility();
      if (
        n !== this._lastPosition ||
        !this._lastScrollVisibility ||
        !PI(this._lastScrollVisibility, i)
      ) {
        let r = new qa(n, i);
        this._positionChanges.next(r);
      }
      this._lastScrollVisibility = i;
    }
    ((this._lastPosition = n), (this._isInitialRender = !1));
  }
  _setTransformOrigin(n) {
    if (!this._transformOriginSelector) return;
    let e = this._boundingBox.querySelectorAll(this._transformOriginSelector),
      i,
      r = n.overlayY;
    n.overlayX === 'center'
      ? (i = 'center')
      : this._isRtl()
        ? (i = n.overlayX === 'start' ? 'right' : 'left')
        : (i = n.overlayX === 'start' ? 'left' : 'right');
    for (let o = 0; o < e.length; o++) e[o].style.transformOrigin = `${i} ${r}`;
  }
  _calculateBoundingBoxRect(n, e) {
    let i = this._viewportRect,
      r = this._isRtl(),
      o,
      s,
      a;
    if (e.overlayY === 'top') ((s = n.y), (o = i.height - s + this._viewportMargin));
    else if (e.overlayY === 'bottom')
      ((a = i.height - n.y + this._viewportMargin * 2), (o = i.height - a + this._viewportMargin));
    else {
      let h = Math.min(i.bottom - n.y + i.top, n.y),
        m = this._lastBoundingBoxSize.height;
      ((o = h * 2),
        (s = n.y - h),
        o > m && !this._isInitialRender && !this._growAfterOpen && (s = n.y - m / 2));
    }
    let l = (e.overlayX === 'start' && !r) || (e.overlayX === 'end' && r),
      c = (e.overlayX === 'end' && !r) || (e.overlayX === 'start' && r),
      d,
      f,
      p;
    if (c) ((p = i.width - n.x + this._viewportMargin * 2), (d = n.x - this._viewportMargin));
    else if (l) ((f = n.x), (d = i.right - n.x));
    else {
      let h = Math.min(i.right - n.x + i.left, n.x),
        m = this._lastBoundingBoxSize.width;
      ((d = h * 2),
        (f = n.x - h),
        d > m && !this._isInitialRender && !this._growAfterOpen && (f = n.x - m / 2));
    }
    return { top: s, left: f, bottom: a, right: p, width: d, height: o };
  }
  _setBoundingBoxStyles(n, e) {
    let i = this._calculateBoundingBoxRect(n, e);
    !this._isInitialRender &&
      !this._growAfterOpen &&
      ((i.height = Math.min(i.height, this._lastBoundingBoxSize.height)),
      (i.width = Math.min(i.width, this._lastBoundingBoxSize.width)));
    let r = {};
    if (this._hasExactPosition())
      ((r.top = r.left = '0'),
        (r.bottom = r.right = r.maxHeight = r.maxWidth = ''),
        (r.width = r.height = '100%'));
    else {
      let o = this._overlayRef.getConfig().maxHeight,
        s = this._overlayRef.getConfig().maxWidth;
      ((r.height = De(i.height)),
        (r.top = De(i.top)),
        (r.bottom = De(i.bottom)),
        (r.width = De(i.width)),
        (r.left = De(i.left)),
        (r.right = De(i.right)),
        e.overlayX === 'center'
          ? (r.alignItems = 'center')
          : (r.alignItems = e.overlayX === 'end' ? 'flex-end' : 'flex-start'),
        e.overlayY === 'center'
          ? (r.justifyContent = 'center')
          : (r.justifyContent = e.overlayY === 'bottom' ? 'flex-end' : 'flex-start'),
        o && (r.maxHeight = De(o)),
        s && (r.maxWidth = De(s)));
    }
    ((this._lastBoundingBoxSize = i), mi(this._boundingBox.style, r));
  }
  _resetBoundingBoxStyles() {
    mi(this._boundingBox.style, {
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      height: '',
      width: '',
      alignItems: '',
      justifyContent: '',
    });
  }
  _resetOverlayElementStyles() {
    mi(this._pane.style, { top: '', left: '', bottom: '', right: '', position: '', transform: '' });
  }
  _setOverlayElementStyles(n, e) {
    let i = {},
      r = this._hasExactPosition(),
      o = this._hasFlexibleDimensions,
      s = this._overlayRef.getConfig();
    if (r) {
      let d = this._viewportRuler.getViewportScrollPosition();
      (mi(i, this._getExactOverlayY(e, n, d)), mi(i, this._getExactOverlayX(e, n, d)));
    } else i.position = 'static';
    let a = '',
      l = this._getOffset(e, 'x'),
      c = this._getOffset(e, 'y');
    (l && (a += `translateX(${l}px) `),
      c && (a += `translateY(${c}px)`),
      (i.transform = a.trim()),
      s.maxHeight && (r ? (i.maxHeight = De(s.maxHeight)) : o && (i.maxHeight = '')),
      s.maxWidth && (r ? (i.maxWidth = De(s.maxWidth)) : o && (i.maxWidth = '')),
      mi(this._pane.style, i));
  }
  _getExactOverlayY(n, e, i) {
    let r = { top: '', bottom: '' },
      o = this._getOverlayPoint(e, this._overlayRect, n);
    if (
      (this._isPushed && (o = this._pushOverlayOnScreen(o, this._overlayRect, i)),
      n.overlayY === 'bottom')
    ) {
      let s = this._document.documentElement.clientHeight;
      r.bottom = `${s - (o.y + this._overlayRect.height)}px`;
    } else r.top = De(o.y);
    return r;
  }
  _getExactOverlayX(n, e, i) {
    let r = { left: '', right: '' },
      o = this._getOverlayPoint(e, this._overlayRect, n);
    this._isPushed && (o = this._pushOverlayOnScreen(o, this._overlayRect, i));
    let s;
    if (
      (this._isRtl()
        ? (s = n.overlayX === 'end' ? 'left' : 'right')
        : (s = n.overlayX === 'end' ? 'right' : 'left'),
      s === 'right')
    ) {
      let a = this._document.documentElement.clientWidth;
      r.right = `${a - (o.x + this._overlayRect.width)}px`;
    } else r.left = De(o.x);
    return r;
  }
  _getScrollVisibility() {
    let n = this._getOriginRect(),
      e = this._pane.getBoundingClientRect(),
      i = this._scrollables.map((r) => r.getElementRef().nativeElement.getBoundingClientRect());
    return {
      isOriginClipped: vy(n, i),
      isOriginOutsideView: wf(n, i),
      isOverlayClipped: vy(e, i),
      isOverlayOutsideView: wf(e, i),
    };
  }
  _subtractOverflows(n, ...e) {
    return e.reduce((i, r) => i - Math.max(r, 0), n);
  }
  _getNarrowedViewportRect() {
    let n = this._document.documentElement.clientWidth,
      e = this._document.documentElement.clientHeight,
      i = this._viewportRuler.getViewportScrollPosition();
    return {
      top: i.top + this._viewportMargin,
      left: i.left + this._viewportMargin,
      right: i.left + n - this._viewportMargin,
      bottom: i.top + e - this._viewportMargin,
      width: n - 2 * this._viewportMargin,
      height: e - 2 * this._viewportMargin,
    };
  }
  _isRtl() {
    return this._overlayRef.getDirection() === 'rtl';
  }
  _hasExactPosition() {
    return !this._hasFlexibleDimensions || this._isPushed;
  }
  _getOffset(n, e) {
    return e === 'x'
      ? n.offsetX == null
        ? this._offsetX
        : n.offsetX
      : n.offsetY == null
        ? this._offsetY
        : n.offsetY;
  }
  _validatePositions() {}
  _addPanelClasses(n) {
    this._pane &&
      Ji(n).forEach((e) => {
        e !== '' &&
          this._appliedPanelClasses.indexOf(e) === -1 &&
          (this._appliedPanelClasses.push(e), this._pane.classList.add(e));
      });
  }
  _clearPanelClasses() {
    this._pane &&
      (this._appliedPanelClasses.forEach((n) => {
        this._pane.classList.remove(n);
      }),
      (this._appliedPanelClasses = []));
  }
  _getOriginRect() {
    let n = this._origin;
    if (n instanceof F) return n.nativeElement.getBoundingClientRect();
    if (n instanceof Element) return n.getBoundingClientRect();
    let e = n.width || 0,
      i = n.height || 0;
    return { top: n.y, bottom: n.y + i, left: n.x, right: n.x + e, height: i, width: e };
  }
};
function mi(t, n) {
  for (let e in n) n.hasOwnProperty(e) && (t[e] = n[e]);
  return t;
}
function Cy(t) {
  if (typeof t != 'number' && t != null) {
    let [n, e] = t.split(FI);
    return !e || e === 'px' ? parseFloat(n) : null;
  }
  return t || null;
}
function Ey(t) {
  return {
    top: Math.floor(t.top),
    right: Math.floor(t.right),
    bottom: Math.floor(t.bottom),
    left: Math.floor(t.left),
    width: Math.floor(t.width),
    height: Math.floor(t.height),
  };
}
function PI(t, n) {
  return t === n
    ? !0
    : t.isOriginClipped === n.isOriginClipped &&
        t.isOriginOutsideView === n.isOriginOutsideView &&
        t.isOverlayClipped === n.isOverlayClipped &&
        t.isOverlayOutsideView === n.isOverlayOutsideView;
}
var wy = 'cdk-global-overlay-wrapper';
function ky(t) {
  return new Ka();
}
var Ka = class {
    _overlayRef;
    _cssPosition = 'static';
    _topOffset = '';
    _bottomOffset = '';
    _alignItems = '';
    _xPosition = '';
    _xOffset = '';
    _width = '';
    _height = '';
    _isDisposed = !1;
    attach(n) {
      let e = n.getConfig();
      ((this._overlayRef = n),
        this._width && !e.width && n.updateSize({ width: this._width }),
        this._height && !e.height && n.updateSize({ height: this._height }),
        n.hostElement.classList.add(wy),
        (this._isDisposed = !1));
    }
    top(n = '') {
      return (
        (this._bottomOffset = ''),
        (this._topOffset = n),
        (this._alignItems = 'flex-start'),
        this
      );
    }
    left(n = '') {
      return ((this._xOffset = n), (this._xPosition = 'left'), this);
    }
    bottom(n = '') {
      return (
        (this._topOffset = ''),
        (this._bottomOffset = n),
        (this._alignItems = 'flex-end'),
        this
      );
    }
    right(n = '') {
      return ((this._xOffset = n), (this._xPosition = 'right'), this);
    }
    start(n = '') {
      return ((this._xOffset = n), (this._xPosition = 'start'), this);
    }
    end(n = '') {
      return ((this._xOffset = n), (this._xPosition = 'end'), this);
    }
    width(n = '') {
      return (
        this._overlayRef ? this._overlayRef.updateSize({ width: n }) : (this._width = n),
        this
      );
    }
    height(n = '') {
      return (
        this._overlayRef ? this._overlayRef.updateSize({ height: n }) : (this._height = n),
        this
      );
    }
    centerHorizontally(n = '') {
      return (this.left(n), (this._xPosition = 'center'), this);
    }
    centerVertically(n = '') {
      return (this.top(n), (this._alignItems = 'center'), this);
    }
    apply() {
      if (!this._overlayRef || !this._overlayRef.hasAttached()) return;
      let n = this._overlayRef.overlayElement.style,
        e = this._overlayRef.hostElement.style,
        i = this._overlayRef.getConfig(),
        { width: r, height: o, maxWidth: s, maxHeight: a } = i,
        l = (r === '100%' || r === '100vw') && (!s || s === '100%' || s === '100vw'),
        c = (o === '100%' || o === '100vh') && (!a || a === '100%' || a === '100vh'),
        d = this._xPosition,
        f = this._xOffset,
        p = this._overlayRef.getConfig().direction === 'rtl',
        h = '',
        m = '',
        _ = '';
      (l
        ? (_ = 'flex-start')
        : d === 'center'
          ? ((_ = 'center'), p ? (m = f) : (h = f))
          : p
            ? d === 'left' || d === 'end'
              ? ((_ = 'flex-end'), (h = f))
              : (d === 'right' || d === 'start') && ((_ = 'flex-start'), (m = f))
            : d === 'left' || d === 'start'
              ? ((_ = 'flex-start'), (h = f))
              : (d === 'right' || d === 'end') && ((_ = 'flex-end'), (m = f)),
        (n.position = this._cssPosition),
        (n.marginLeft = l ? '0' : h),
        (n.marginTop = c ? '0' : this._topOffset),
        (n.marginBottom = this._bottomOffset),
        (n.marginRight = l ? '0' : m),
        (e.justifyContent = _),
        (e.alignItems = c ? 'flex-start' : this._alignItems));
    }
    dispose() {
      if (this._isDisposed || !this._overlayRef) return;
      let n = this._overlayRef.overlayElement.style,
        e = this._overlayRef.hostElement,
        i = e.style;
      (e.classList.remove(wy),
        (i.justifyContent =
          i.alignItems =
          n.marginTop =
          n.marginBottom =
          n.marginLeft =
          n.marginRight =
          n.position =
            ''),
        (this._overlayRef = null),
        (this._isDisposed = !0));
    }
  },
  Fy = (() => {
    class t {
      _injector = u(Y);
      constructor() {}
      global() {
        return ky();
      }
      flexibleConnectedTo(e) {
        return Sf(this._injector, e);
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
function xf(t, n) {
  t.get(Nt).load(Ny);
  let e = t.get(Oy),
    i = t.get(Z),
    r = t.get(lt),
    o = t.get(yt),
    s = t.get(kt),
    a = i.createElement('div'),
    l = i.createElement('div');
  ((l.id = r.getId('cdk-overlay-')),
    l.classList.add('cdk-overlay-pane'),
    a.appendChild(l),
    e.getContainerElement().appendChild(a));
  let c = new za(l, o, t),
    d = new yo(n),
    f = t.get(We, null, { optional: !0 }) || t.get(Ve).createRenderer(null, null);
  return (
    (d.direction = d.direction || s.value),
    new Ya(
      c,
      a,
      l,
      d,
      t.get(R),
      t.get(Ry),
      i,
      t.get(Sa),
      t.get(Ay),
      n?.disableAnimations ?? t.get(Zr, null, { optional: !0 }) === 'NoopAnimations',
      t.get(Me),
      f,
    )
  );
}
var Py = (() => {
    class t {
      scrollStrategies = u(My);
      _positionBuilder = u(Fy);
      _injector = u(Y);
      constructor() {}
      create(e) {
        return xf(this._injector, e);
      }
      position() {
        return this._positionBuilder;
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  LI = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  ],
  Ly = new g('cdk-connected-overlay-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
      let t = u(Y);
      return () => gi(t);
    },
  }),
  rr = (() => {
    class t {
      elementRef = u(F);
      constructor() {}
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [
          ['', 'cdk-overlay-origin', ''],
          ['', 'overlay-origin', ''],
          ['', 'cdkOverlayOrigin', ''],
        ],
        exportAs: ['cdkOverlayOrigin'],
      });
    }
    return t;
  })(),
  Qa = (() => {
    class t {
      _dir = u(kt, { optional: !0 });
      _injector = u(Y);
      _overlayRef;
      _templatePortal;
      _backdropSubscription = W.EMPTY;
      _attachSubscription = W.EMPTY;
      _detachSubscription = W.EMPTY;
      _positionSubscription = W.EMPTY;
      _offsetX;
      _offsetY;
      _position;
      _scrollStrategyFactory = u(Ly);
      _disposeOnNavigation = !1;
      _ngZone = u(R);
      origin;
      positions;
      positionStrategy;
      get offsetX() {
        return this._offsetX;
      }
      set offsetX(e) {
        ((this._offsetX = e), this._position && this._updatePositionStrategy(this._position));
      }
      get offsetY() {
        return this._offsetY;
      }
      set offsetY(e) {
        ((this._offsetY = e), this._position && this._updatePositionStrategy(this._position));
      }
      width;
      height;
      minWidth;
      minHeight;
      backdropClass;
      panelClass;
      viewportMargin = 0;
      scrollStrategy;
      open = !1;
      disableClose = !1;
      transformOriginSelector;
      hasBackdrop = !1;
      lockPosition = !1;
      flexibleDimensions = !1;
      growAfterOpen = !1;
      push = !1;
      get disposeOnNavigation() {
        return this._disposeOnNavigation;
      }
      set disposeOnNavigation(e) {
        this._disposeOnNavigation = e;
      }
      backdropClick = new G();
      positionChange = new G();
      attach = new G();
      detach = new G();
      overlayKeydown = new G();
      overlayOutsideClick = new G();
      constructor() {
        let e = u(we),
          i = u(Be);
        ((this._templatePortal = new go(e, i)),
          (this.scrollStrategy = this._scrollStrategyFactory()));
      }
      get overlayRef() {
        return this._overlayRef;
      }
      get dir() {
        return this._dir ? this._dir.value : 'ltr';
      }
      ngOnDestroy() {
        (this._attachSubscription.unsubscribe(),
          this._detachSubscription.unsubscribe(),
          this._backdropSubscription.unsubscribe(),
          this._positionSubscription.unsubscribe(),
          this._overlayRef?.dispose());
      }
      ngOnChanges(e) {
        (this._position &&
          (this._updatePositionStrategy(this._position),
          this._overlayRef?.updateSize({
            width: this.width,
            minWidth: this.minWidth,
            height: this.height,
            minHeight: this.minHeight,
          }),
          e.origin && this.open && this._position.apply()),
          e.open && (this.open ? this.attachOverlay() : this.detachOverlay()));
      }
      _createOverlay() {
        (!this.positions || !this.positions.length) && (this.positions = LI);
        let e = (this._overlayRef = xf(this._injector, this._buildConfig()));
        ((this._attachSubscription = e.attachments().subscribe(() => this.attach.emit())),
          (this._detachSubscription = e.detachments().subscribe(() => this.detach.emit())),
          e.keydownEvents().subscribe((i) => {
            (this.overlayKeydown.next(i),
              i.keyCode === 27 &&
                !this.disableClose &&
                !Ot(i) &&
                (i.preventDefault(), this.detachOverlay()));
          }),
          this._overlayRef.outsidePointerEvents().subscribe((i) => {
            let r = this._getOriginElement(),
              o = ui(i);
            (!r || (r !== o && !r.contains(o))) && this.overlayOutsideClick.next(i);
          }));
      }
      _buildConfig() {
        let e = (this._position = this.positionStrategy || this._createPositionStrategy()),
          i = new yo({
            direction: this._dir || 'ltr',
            positionStrategy: e,
            scrollStrategy: this.scrollStrategy,
            hasBackdrop: this.hasBackdrop,
            disposeOnNavigation: this.disposeOnNavigation,
          });
        return (
          (this.width || this.width === 0) && (i.width = this.width),
          (this.height || this.height === 0) && (i.height = this.height),
          (this.minWidth || this.minWidth === 0) && (i.minWidth = this.minWidth),
          (this.minHeight || this.minHeight === 0) && (i.minHeight = this.minHeight),
          this.backdropClass && (i.backdropClass = this.backdropClass),
          this.panelClass && (i.panelClass = this.panelClass),
          i
        );
      }
      _updatePositionStrategy(e) {
        let i = this.positions.map((r) => ({
          originX: r.originX,
          originY: r.originY,
          overlayX: r.overlayX,
          overlayY: r.overlayY,
          offsetX: r.offsetX || this.offsetX,
          offsetY: r.offsetY || this.offsetY,
          panelClass: r.panelClass || void 0,
        }));
        return e
          .setOrigin(this._getOrigin())
          .withPositions(i)
          .withFlexibleDimensions(this.flexibleDimensions)
          .withPush(this.push)
          .withGrowAfterOpen(this.growAfterOpen)
          .withViewportMargin(this.viewportMargin)
          .withLockedPosition(this.lockPosition)
          .withTransformOriginOn(this.transformOriginSelector);
      }
      _createPositionStrategy() {
        let e = Sf(this._injector, this._getOrigin());
        return (this._updatePositionStrategy(e), e);
      }
      _getOrigin() {
        return this.origin instanceof rr ? this.origin.elementRef : this.origin;
      }
      _getOriginElement() {
        return this.origin instanceof rr
          ? this.origin.elementRef.nativeElement
          : this.origin instanceof F
            ? this.origin.nativeElement
            : typeof Element < 'u' && this.origin instanceof Element
              ? this.origin
              : null;
      }
      attachOverlay() {
        (this._overlayRef
          ? (this._overlayRef.getConfig().hasBackdrop = this.hasBackdrop)
          : this._createOverlay(),
          this._overlayRef.hasAttached() || this._overlayRef.attach(this._templatePortal),
          this.hasBackdrop
            ? (this._backdropSubscription = this._overlayRef.backdropClick().subscribe((e) => {
                this.backdropClick.emit(e);
              }))
            : this._backdropSubscription.unsubscribe(),
          this._positionSubscription.unsubscribe(),
          this.positionChange.observers.length > 0 &&
            (this._positionSubscription = this._position.positionChanges
              .pipe(Gl(() => this.positionChange.observers.length > 0))
              .subscribe((e) => {
                (this._ngZone.run(() => this.positionChange.emit(e)),
                  this.positionChange.observers.length === 0 &&
                    this._positionSubscription.unsubscribe());
              })),
          (this.open = !0));
      }
      detachOverlay() {
        (this._overlayRef?.detach(),
          this._backdropSubscription.unsubscribe(),
          this._positionSubscription.unsubscribe(),
          (this.open = !1));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [
          ['', 'cdk-connected-overlay', ''],
          ['', 'connected-overlay', ''],
          ['', 'cdkConnectedOverlay', ''],
        ],
        inputs: {
          origin: [0, 'cdkConnectedOverlayOrigin', 'origin'],
          positions: [0, 'cdkConnectedOverlayPositions', 'positions'],
          positionStrategy: [0, 'cdkConnectedOverlayPositionStrategy', 'positionStrategy'],
          offsetX: [0, 'cdkConnectedOverlayOffsetX', 'offsetX'],
          offsetY: [0, 'cdkConnectedOverlayOffsetY', 'offsetY'],
          width: [0, 'cdkConnectedOverlayWidth', 'width'],
          height: [0, 'cdkConnectedOverlayHeight', 'height'],
          minWidth: [0, 'cdkConnectedOverlayMinWidth', 'minWidth'],
          minHeight: [0, 'cdkConnectedOverlayMinHeight', 'minHeight'],
          backdropClass: [0, 'cdkConnectedOverlayBackdropClass', 'backdropClass'],
          panelClass: [0, 'cdkConnectedOverlayPanelClass', 'panelClass'],
          viewportMargin: [0, 'cdkConnectedOverlayViewportMargin', 'viewportMargin'],
          scrollStrategy: [0, 'cdkConnectedOverlayScrollStrategy', 'scrollStrategy'],
          open: [0, 'cdkConnectedOverlayOpen', 'open'],
          disableClose: [0, 'cdkConnectedOverlayDisableClose', 'disableClose'],
          transformOriginSelector: [
            0,
            'cdkConnectedOverlayTransformOriginOn',
            'transformOriginSelector',
          ],
          hasBackdrop: [2, 'cdkConnectedOverlayHasBackdrop', 'hasBackdrop', K],
          lockPosition: [2, 'cdkConnectedOverlayLockPosition', 'lockPosition', K],
          flexibleDimensions: [2, 'cdkConnectedOverlayFlexibleDimensions', 'flexibleDimensions', K],
          growAfterOpen: [2, 'cdkConnectedOverlayGrowAfterOpen', 'growAfterOpen', K],
          push: [2, 'cdkConnectedOverlayPush', 'push', K],
          disposeOnNavigation: [
            2,
            'cdkConnectedOverlayDisposeOnNavigation',
            'disposeOnNavigation',
            K,
          ],
        },
        outputs: {
          backdropClick: 'backdropClick',
          positionChange: 'positionChange',
          attach: 'attach',
          detach: 'detach',
          overlayKeydown: 'overlayKeydown',
          overlayOutsideClick: 'overlayOutsideClick',
        },
        exportAs: ['cdkConnectedOverlay'],
        features: [Ne],
      });
    }
    return t;
  })();
function VI(t) {
  let n = u(Y);
  return () => gi(n);
}
var jI = { provide: Ly, useFactory: VI },
  Mf = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵmod = j({ type: t });
      static ɵinj = V({ providers: [Py, jI], imports: [xn, _y, po, po] });
    }
    return t;
  })();
var _i = class {
  applyChanges(n, e, i, r, o) {
    n.forEachOperation((s, a, l) => {
      let c, d;
      if (s.previousIndex == null) {
        let f = i(s, a, l);
        ((c = e.createEmbeddedView(f.templateRef, f.context, f.index)), (d = Rn.INSERTED));
      } else
        l == null
          ? (e.remove(a), (d = Rn.REMOVED))
          : ((c = e.get(a)), e.move(c, l), (d = Rn.MOVED));
      o && o({ context: c?.context, operation: d, record: s });
    });
  }
  detach() {}
};
var vo = class {
  _multiple;
  _emitChanges;
  compareWith;
  _selection = new Set();
  _deselectedToEmit = [];
  _selectedToEmit = [];
  _selected;
  get selected() {
    return (
      this._selected || (this._selected = Array.from(this._selection.values())),
      this._selected
    );
  }
  changed = new D();
  constructor(n = !1, e, i = !0, r) {
    ((this._multiple = n),
      (this._emitChanges = i),
      (this.compareWith = r),
      e &&
        e.length &&
        (n ? e.forEach((o) => this._markSelected(o)) : this._markSelected(e[0]),
        (this._selectedToEmit.length = 0)));
  }
  select(...n) {
    (this._verifyValueAssignment(n), n.forEach((i) => this._markSelected(i)));
    let e = this._hasQueuedChanges();
    return (this._emitChangeEvent(), e);
  }
  deselect(...n) {
    (this._verifyValueAssignment(n), n.forEach((i) => this._unmarkSelected(i)));
    let e = this._hasQueuedChanges();
    return (this._emitChangeEvent(), e);
  }
  setSelection(...n) {
    this._verifyValueAssignment(n);
    let e = this.selected,
      i = new Set(n.map((o) => this._getConcreteValue(o)));
    (n.forEach((o) => this._markSelected(o)),
      e
        .filter((o) => !i.has(this._getConcreteValue(o, i)))
        .forEach((o) => this._unmarkSelected(o)));
    let r = this._hasQueuedChanges();
    return (this._emitChangeEvent(), r);
  }
  toggle(n) {
    return this.isSelected(n) ? this.deselect(n) : this.select(n);
  }
  clear(n = !0) {
    this._unmarkAll();
    let e = this._hasQueuedChanges();
    return (n && this._emitChangeEvent(), e);
  }
  isSelected(n) {
    return this._selection.has(this._getConcreteValue(n));
  }
  isEmpty() {
    return this._selection.size === 0;
  }
  hasValue() {
    return !this.isEmpty();
  }
  sort(n) {
    this._multiple && this.selected && this._selected.sort(n);
  }
  isMultipleSelection() {
    return this._multiple;
  }
  _emitChangeEvent() {
    ((this._selected = null),
      (this._selectedToEmit.length || this._deselectedToEmit.length) &&
        (this.changed.next({
          source: this,
          added: this._selectedToEmit,
          removed: this._deselectedToEmit,
        }),
        (this._deselectedToEmit = []),
        (this._selectedToEmit = [])));
  }
  _markSelected(n) {
    ((n = this._getConcreteValue(n)),
      this.isSelected(n) ||
        (this._multiple || this._unmarkAll(),
        this.isSelected(n) || this._selection.add(n),
        this._emitChanges && this._selectedToEmit.push(n)));
  }
  _unmarkSelected(n) {
    ((n = this._getConcreteValue(n)),
      this.isSelected(n) &&
        (this._selection.delete(n), this._emitChanges && this._deselectedToEmit.push(n)));
  }
  _unmarkAll() {
    this.isEmpty() || this._selection.forEach((n) => this._unmarkSelected(n));
  }
  _verifyValueAssignment(n) {
    n.length > 1 && this._multiple;
  }
  _hasQueuedChanges() {
    return !!(this._deselectedToEmit.length || this._selectedToEmit.length);
  }
  _getConcreteValue(n, e) {
    if (this.compareWith) {
      e = e ?? this._selection;
      for (let i of e) if (this.compareWith(n, i)) return i;
      return n;
    } else return n;
  }
};
function Af(t) {
  return t == null || Nf(t) === 0;
}
function Nf(t) {
  return t == null
    ? null
    : Array.isArray(t) || typeof t == 'string'
      ? t.length
      : t instanceof Set
        ? t.size
        : null;
}
var Gy = new g(''),
  Wy = new g(''),
  BI =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  ar = class {
    static min(n) {
      return HI(n);
    }
    static max(n) {
      return UI(n);
    }
    static required(n) {
      return zI(n);
    }
    static requiredTrue(n) {
      return $I(n);
    }
    static email(n) {
      return GI(n);
    }
    static minLength(n) {
      return WI(n);
    }
    static maxLength(n) {
      return qI(n);
    }
    static pattern(n) {
      return YI(n);
    }
    static nullValidator(n) {
      return qy();
    }
    static compose(n) {
      return Jy(n);
    }
    static composeAsync(n) {
      return ev(n);
    }
  };
function HI(t) {
  return (n) => {
    if (n.value == null || t == null) return null;
    let e = parseFloat(n.value);
    return !isNaN(e) && e < t ? { min: { min: t, actual: n.value } } : null;
  };
}
function UI(t) {
  return (n) => {
    if (n.value == null || t == null) return null;
    let e = parseFloat(n.value);
    return !isNaN(e) && e > t ? { max: { max: t, actual: n.value } } : null;
  };
}
function zI(t) {
  return Af(t.value) ? { required: !0 } : null;
}
function $I(t) {
  return t.value === !0 ? null : { required: !0 };
}
function GI(t) {
  return Af(t.value) || BI.test(t.value) ? null : { email: !0 };
}
function WI(t) {
  return (n) => {
    let e = n.value?.length ?? Nf(n.value);
    return e === null || e === 0
      ? null
      : e < t
        ? { minlength: { requiredLength: t, actualLength: e } }
        : null;
  };
}
function qI(t) {
  return (n) => {
    let e = n.value?.length ?? Nf(n.value);
    return e !== null && e > t ? { maxlength: { requiredLength: t, actualLength: e } } : null;
  };
}
function YI(t) {
  if (!t) return qy;
  let n, e;
  return (
    typeof t == 'string'
      ? ((e = ''),
        t.charAt(0) !== '^' && (e += '^'),
        (e += t),
        t.charAt(t.length - 1) !== '$' && (e += '$'),
        (n = new RegExp(e)))
      : ((e = t.toString()), (n = t)),
    (i) => {
      if (Af(i.value)) return null;
      let r = i.value;
      return n.test(r) ? null : { pattern: { requiredPattern: e, actualValue: r } };
    }
  );
}
function qy(t) {
  return null;
}
function Yy(t) {
  return t != null;
}
function Zy(t) {
  return Jr(t) ? Qe(t) : t;
}
function Ky(t) {
  let n = {};
  return (
    t.forEach((e) => {
      n = e != null ? x(x({}, n), e) : n;
    }),
    Object.keys(n).length === 0 ? null : n
  );
}
function Qy(t, n) {
  return n.map((e) => e(t));
}
function ZI(t) {
  return !t.validate;
}
function Xy(t) {
  return t.map((n) => (ZI(n) ? n : (e) => n.validate(e)));
}
function Jy(t) {
  if (!t) return null;
  let n = t.filter(Yy);
  return n.length == 0
    ? null
    : function (e) {
        return Ky(Qy(e, n));
      };
}
function Of(t) {
  return t != null ? Jy(Xy(t)) : null;
}
function ev(t) {
  if (!t) return null;
  let n = t.filter(Yy);
  return n.length == 0
    ? null
    : function (e) {
        let i = Qy(e, n).map(Zy);
        return Ul(i).pipe(ue(Ky));
      };
}
function kf(t) {
  return t != null ? ev(Xy(t)) : null;
}
function jy(t, n) {
  return t === null ? [n] : Array.isArray(t) ? [...t, n] : [t, n];
}
function tv(t) {
  return t._rawValidators;
}
function nv(t) {
  return t._rawAsyncValidators;
}
function Tf(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Ja(t, n) {
  return Array.isArray(t) ? t.includes(n) : t === n;
}
function By(t, n) {
  let e = Tf(n);
  return (
    Tf(t).forEach((r) => {
      Ja(e, r) || e.push(r);
    }),
    e
  );
}
function Hy(t, n) {
  return Tf(n).filter((e) => !Ja(t, e));
}
var el = class {
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(n) {
      ((this._rawValidators = n || []), (this._composedValidatorFn = Of(this._rawValidators)));
    }
    _setAsyncValidators(n) {
      ((this._rawAsyncValidators = n || []),
        (this._composedAsyncValidatorFn = kf(this._rawAsyncValidators)));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(n) {
      this._onDestroyCallbacks.push(n);
    }
    _invokeOnDestroyCallbacks() {
      (this._onDestroyCallbacks.forEach((n) => n()), (this._onDestroyCallbacks = []));
    }
    reset(n = void 0) {
      this.control && this.control.reset(n);
    }
    hasError(n, e) {
      return this.control ? this.control.hasError(n, e) : !1;
    }
    getError(n, e) {
      return this.control ? this.control.getError(n, e) : null;
    }
  },
  lr = class extends el {
    name;
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  cr = class extends el {
    _parent = null;
    name = null;
    valueAccessor = null;
  };
var KI = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  HG = Q(x({}, KI), { '[class.ng-submitted]': 'isSubmitted' });
var bo = 'VALID',
  Xa = 'INVALID',
  or = 'PENDING',
  Do = 'DISABLED',
  An = class {},
  tl = class extends An {
    value;
    source;
    constructor(n, e) {
      (super(), (this.value = n), (this.source = e));
    }
  },
  Eo = class extends An {
    pristine;
    source;
    constructor(n, e) {
      (super(), (this.pristine = n), (this.source = e));
    }
  },
  wo = class extends An {
    touched;
    source;
    constructor(n, e) {
      (super(), (this.touched = n), (this.source = e));
    }
  },
  sr = class extends An {
    status;
    source;
    constructor(n, e) {
      (super(), (this.status = n), (this.source = e));
    }
  },
  nl = class extends An {
    source;
    constructor(n) {
      (super(), (this.source = n));
    }
  },
  il = class extends An {
    source;
    constructor(n) {
      (super(), (this.source = n));
    }
  };
function iv(t) {
  return (ll(t) ? t.validators : t) || null;
}
function QI(t) {
  return Array.isArray(t) ? Of(t) : t || null;
}
function rv(t, n) {
  return (ll(n) ? n.asyncValidators : t) || null;
}
function XI(t) {
  return Array.isArray(t) ? kf(t) : t || null;
}
function ll(t) {
  return t != null && !Array.isArray(t) && typeof t == 'object';
}
function JI(t, n, e) {
  let i = t.controls;
  if (!(n ? Object.keys(i) : i).length) throw new A(1e3, '');
  if (!i[e]) throw new A(1001, '');
}
function eS(t, n, e) {
  t._forEachChild((i, r) => {
    if (e[r] === void 0) throw new A(1002, '');
  });
}
var rl = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {};
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(n, e) {
      (this._assignValidators(n), this._assignAsyncValidators(e));
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(n) {
      this._rawValidators = this._composedValidatorFn = n;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(n) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = n;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return vt(this.statusReactive);
    }
    set status(n) {
      vt(() => this.statusReactive.set(n));
    }
    _status = bt(() => this.statusReactive());
    statusReactive = ae(void 0);
    get valid() {
      return this.status === bo;
    }
    get invalid() {
      return this.status === Xa;
    }
    get pending() {
      return this.status == or;
    }
    get disabled() {
      return this.status === Do;
    }
    get enabled() {
      return this.status !== Do;
    }
    errors;
    get pristine() {
      return vt(this.pristineReactive);
    }
    set pristine(n) {
      vt(() => this.pristineReactive.set(n));
    }
    _pristine = bt(() => this.pristineReactive());
    pristineReactive = ae(!0);
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return vt(this.touchedReactive);
    }
    set touched(n) {
      vt(() => this.touchedReactive.set(n));
    }
    _touched = bt(() => this.touchedReactive());
    touchedReactive = ae(!1);
    get untouched() {
      return !this.touched;
    }
    _events = new D();
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
      return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
    }
    setValidators(n) {
      this._assignValidators(n);
    }
    setAsyncValidators(n) {
      this._assignAsyncValidators(n);
    }
    addValidators(n) {
      this.setValidators(By(n, this._rawValidators));
    }
    addAsyncValidators(n) {
      this.setAsyncValidators(By(n, this._rawAsyncValidators));
    }
    removeValidators(n) {
      this.setValidators(Hy(n, this._rawValidators));
    }
    removeAsyncValidators(n) {
      this.setAsyncValidators(Hy(n, this._rawAsyncValidators));
    }
    hasValidator(n) {
      return Ja(this._rawValidators, n);
    }
    hasAsyncValidator(n) {
      return Ja(this._rawAsyncValidators, n);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(n = {}) {
      let e = this.touched === !1;
      this.touched = !0;
      let i = n.sourceControl ?? this;
      (this._parent && !n.onlySelf && this._parent.markAsTouched(Q(x({}, n), { sourceControl: i })),
        e && n.emitEvent !== !1 && this._events.next(new wo(!0, i)));
    }
    markAllAsDirty(n = {}) {
      (this.markAsDirty({ onlySelf: !0, emitEvent: n.emitEvent, sourceControl: this }),
        this._forEachChild((e) => e.markAllAsDirty(n)));
    }
    markAllAsTouched(n = {}) {
      (this.markAsTouched({ onlySelf: !0, emitEvent: n.emitEvent, sourceControl: this }),
        this._forEachChild((e) => e.markAllAsTouched(n)));
    }
    markAsUntouched(n = {}) {
      let e = this.touched === !0;
      ((this.touched = !1), (this._pendingTouched = !1));
      let i = n.sourceControl ?? this;
      (this._forEachChild((r) => {
        r.markAsUntouched({ onlySelf: !0, emitEvent: n.emitEvent, sourceControl: i });
      }),
        this._parent && !n.onlySelf && this._parent._updateTouched(n, i),
        e && n.emitEvent !== !1 && this._events.next(new wo(!1, i)));
    }
    markAsDirty(n = {}) {
      let e = this.pristine === !0;
      this.pristine = !1;
      let i = n.sourceControl ?? this;
      (this._parent && !n.onlySelf && this._parent.markAsDirty(Q(x({}, n), { sourceControl: i })),
        e && n.emitEvent !== !1 && this._events.next(new Eo(!1, i)));
    }
    markAsPristine(n = {}) {
      let e = this.pristine === !1;
      ((this.pristine = !0), (this._pendingDirty = !1));
      let i = n.sourceControl ?? this;
      (this._forEachChild((r) => {
        r.markAsPristine({ onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._parent && !n.onlySelf && this._parent._updatePristine(n, i),
        e && n.emitEvent !== !1 && this._events.next(new Eo(!0, i)));
    }
    markAsPending(n = {}) {
      this.status = or;
      let e = n.sourceControl ?? this;
      (n.emitEvent !== !1 &&
        (this._events.next(new sr(this.status, e)), this.statusChanges.emit(this.status)),
        this._parent &&
          !n.onlySelf &&
          this._parent.markAsPending(Q(x({}, n), { sourceControl: e })));
    }
    disable(n = {}) {
      let e = this._parentMarkedDirty(n.onlySelf);
      ((this.status = Do),
        (this.errors = null),
        this._forEachChild((r) => {
          r.disable(Q(x({}, n), { onlySelf: !0 }));
        }),
        this._updateValue());
      let i = n.sourceControl ?? this;
      (n.emitEvent !== !1 &&
        (this._events.next(new tl(this.value, i)),
        this._events.next(new sr(this.status, i)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(Q(x({}, n), { skipPristineCheck: e }), this),
        this._onDisabledChange.forEach((r) => r(!0)));
    }
    enable(n = {}) {
      let e = this._parentMarkedDirty(n.onlySelf);
      ((this.status = bo),
        this._forEachChild((i) => {
          i.enable(Q(x({}, n), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }),
        this._updateAncestors(Q(x({}, n), { skipPristineCheck: e }), this),
        this._onDisabledChange.forEach((i) => i(!1)));
    }
    _updateAncestors(n, e) {
      this._parent &&
        !n.onlySelf &&
        (this._parent.updateValueAndValidity(n),
        n.skipPristineCheck || this._parent._updatePristine({}, e),
        this._parent._updateTouched({}, e));
    }
    setParent(n) {
      this._parent = n;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(n = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let i = this._cancelExistingSubscription();
        ((this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === bo || this.status === or) && this._runAsyncValidator(i, n.emitEvent));
      }
      let e = n.sourceControl ?? this;
      (n.emitEvent !== !1 &&
        (this._events.next(new tl(this.value, e)),
        this._events.next(new sr(this.status, e)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !n.onlySelf &&
          this._parent.updateValueAndValidity(Q(x({}, n), { sourceControl: e })));
    }
    _updateTreeValidity(n = { emitEvent: !0 }) {
      (this._forEachChild((e) => e._updateTreeValidity(n)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }));
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? Do : bo;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(n, e) {
      if (this.asyncValidator) {
        ((this.status = or),
          (this._hasOwnPendingAsyncValidator = {
            emitEvent: e !== !1,
            shouldHaveEmitted: n !== !1,
          }));
        let i = Zy(this.asyncValidator(this));
        this._asyncValidationSubscription = i.subscribe((r) => {
          ((this._hasOwnPendingAsyncValidator = null),
            this.setErrors(r, { emitEvent: e, shouldHaveEmitted: n }));
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let n =
          (this._hasOwnPendingAsyncValidator?.emitEvent ||
            this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ??
          !1;
        return ((this._hasOwnPendingAsyncValidator = null), n);
      }
      return !1;
    }
    setErrors(n, e = {}) {
      ((this.errors = n),
        this._updateControlsErrors(e.emitEvent !== !1, this, e.shouldHaveEmitted));
    }
    get(n) {
      let e = n;
      return e == null || (Array.isArray(e) || (e = e.split('.')), e.length === 0)
        ? null
        : e.reduce((i, r) => i && i._find(r), this);
    }
    getError(n, e) {
      let i = e ? this.get(e) : this;
      return i && i.errors ? i.errors[n] : null;
    }
    hasError(n, e) {
      return !!this.getError(n, e);
    }
    get root() {
      let n = this;
      for (; n._parent; ) n = n._parent;
      return n;
    }
    _updateControlsErrors(n, e, i) {
      ((this.status = this._calculateStatus()),
        n && this.statusChanges.emit(this.status),
        (n || i) && this._events.next(new sr(this.status, e)),
        this._parent && this._parent._updateControlsErrors(n, e, i));
    }
    _initObservables() {
      ((this.valueChanges = new G()), (this.statusChanges = new G()));
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? Do
        : this.errors
          ? Xa
          : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(or)
            ? or
            : this._anyControlsHaveStatus(Xa)
              ? Xa
              : bo;
    }
    _anyControlsHaveStatus(n) {
      return this._anyControls((e) => e.status === n);
    }
    _anyControlsDirty() {
      return this._anyControls((n) => n.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((n) => n.touched);
    }
    _updatePristine(n, e) {
      let i = !this._anyControlsDirty(),
        r = this.pristine !== i;
      ((this.pristine = i),
        this._parent && !n.onlySelf && this._parent._updatePristine(n, e),
        r && this._events.next(new Eo(this.pristine, e)));
    }
    _updateTouched(n = {}, e) {
      ((this.touched = this._anyControlsTouched()),
        this._events.next(new wo(this.touched, e)),
        this._parent && !n.onlySelf && this._parent._updateTouched(n, e));
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(n) {
      this._onCollectionChange = n;
    }
    _setUpdateStrategy(n) {
      ll(n) && n.updateOn != null && (this._updateOn = n.updateOn);
    }
    _parentMarkedDirty(n) {
      let e = this._parent && this._parent.dirty;
      return !n && !!e && !this._parent._anyControlsDirty();
    }
    _find(n) {
      return null;
    }
    _assignValidators(n) {
      ((this._rawValidators = Array.isArray(n) ? n.slice() : n),
        (this._composedValidatorFn = QI(this._rawValidators)));
    }
    _assignAsyncValidators(n) {
      ((this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n),
        (this._composedAsyncValidatorFn = XI(this._rawAsyncValidators)));
    }
  },
  ol = class extends rl {
    constructor(n, e, i) {
      (super(iv(e), rv(i, e)),
        (this.controls = n),
        this._initObservables(),
        this._setUpdateStrategy(e),
        this._setUpControls(),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }));
    }
    controls;
    registerControl(n, e) {
      return this.controls[n]
        ? this.controls[n]
        : ((this.controls[n] = e),
          e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange),
          e);
    }
    addControl(n, e, i = {}) {
      (this.registerControl(n, e),
        this.updateValueAndValidity({ emitEvent: i.emitEvent }),
        this._onCollectionChange());
    }
    removeControl(n, e = {}) {
      (this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
        delete this.controls[n],
        this.updateValueAndValidity({ emitEvent: e.emitEvent }),
        this._onCollectionChange());
    }
    setControl(n, e, i = {}) {
      (this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
        delete this.controls[n],
        e && this.registerControl(n, e),
        this.updateValueAndValidity({ emitEvent: i.emitEvent }),
        this._onCollectionChange());
    }
    contains(n) {
      return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
    }
    setValue(n, e = {}) {
      (eS(this, !0, n),
        Object.keys(n).forEach((i) => {
          (JI(this, !0, i),
            this.controls[i].setValue(n[i], { onlySelf: !0, emitEvent: e.emitEvent }));
        }),
        this.updateValueAndValidity(e));
    }
    patchValue(n, e = {}) {
      n != null &&
        (Object.keys(n).forEach((i) => {
          let r = this.controls[i];
          r && r.patchValue(n[i], { onlySelf: !0, emitEvent: e.emitEvent });
        }),
        this.updateValueAndValidity(e));
    }
    reset(n = {}, e = {}) {
      (this._forEachChild((i, r) => {
        i.reset(n ? n[r] : null, { onlySelf: !0, emitEvent: e.emitEvent });
      }),
        this._updatePristine(e, this),
        this._updateTouched(e, this),
        this.updateValueAndValidity(e),
        e?.emitEvent !== !1 && this._events.next(new il(this)));
    }
    getRawValue() {
      return this._reduceChildren({}, (n, e, i) => ((n[i] = e.getRawValue()), n));
    }
    _syncPendingControls() {
      let n = this._reduceChildren(!1, (e, i) => (i._syncPendingControls() ? !0 : e));
      return (n && this.updateValueAndValidity({ onlySelf: !0 }), n);
    }
    _forEachChild(n) {
      Object.keys(this.controls).forEach((e) => {
        let i = this.controls[e];
        i && n(i, e);
      });
    }
    _setUpControls() {
      this._forEachChild((n) => {
        (n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange));
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(n) {
      for (let [e, i] of Object.entries(this.controls)) if (this.contains(e) && n(i)) return !0;
      return !1;
    }
    _reduceValue() {
      let n = {};
      return this._reduceChildren(
        n,
        (e, i, r) => ((i.enabled || this.disabled) && (e[r] = i.value), e),
      );
    }
    _reduceChildren(n, e) {
      let i = n;
      return (
        this._forEachChild((r, o) => {
          i = e(i, r, o);
        }),
        i
      );
    }
    _allControlsDisabled() {
      for (let n of Object.keys(this.controls)) if (this.controls[n].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(n) {
      return this.controls.hasOwnProperty(n) ? this.controls[n] : null;
    }
  };
var ov = new g('', { providedIn: 'root', factory: () => sv }),
  sv = 'always';
function Rf(t, n, e = sv) {
  (Ff(t, n),
    n.valueAccessor.writeValue(t.value),
    (t.disabled || e === 'always') && n.valueAccessor.setDisabledState?.(t.disabled),
    nS(t, n),
    rS(t, n),
    iS(t, n),
    tS(t, n));
}
function Uy(t, n, e = !0) {
  let i = () => {};
  (n.valueAccessor && (n.valueAccessor.registerOnChange(i), n.valueAccessor.registerOnTouched(i)),
    al(t, n),
    t && (n._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {})));
}
function sl(t, n) {
  t.forEach((e) => {
    e.registerOnValidatorChange && e.registerOnValidatorChange(n);
  });
}
function tS(t, n) {
  if (n.valueAccessor.setDisabledState) {
    let e = (i) => {
      n.valueAccessor.setDisabledState(i);
    };
    (t.registerOnDisabledChange(e),
      n._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(e);
      }));
  }
}
function Ff(t, n) {
  let e = tv(t);
  n.validator !== null
    ? t.setValidators(jy(e, n.validator))
    : typeof e == 'function' && t.setValidators([e]);
  let i = nv(t);
  n.asyncValidator !== null
    ? t.setAsyncValidators(jy(i, n.asyncValidator))
    : typeof i == 'function' && t.setAsyncValidators([i]);
  let r = () => t.updateValueAndValidity();
  (sl(n._rawValidators, r), sl(n._rawAsyncValidators, r));
}
function al(t, n) {
  let e = !1;
  if (t !== null) {
    if (n.validator !== null) {
      let r = tv(t);
      if (Array.isArray(r) && r.length > 0) {
        let o = r.filter((s) => s !== n.validator);
        o.length !== r.length && ((e = !0), t.setValidators(o));
      }
    }
    if (n.asyncValidator !== null) {
      let r = nv(t);
      if (Array.isArray(r) && r.length > 0) {
        let o = r.filter((s) => s !== n.asyncValidator);
        o.length !== r.length && ((e = !0), t.setAsyncValidators(o));
      }
    }
  }
  let i = () => {};
  return (sl(n._rawValidators, i), sl(n._rawAsyncValidators, i), e);
}
function nS(t, n) {
  n.valueAccessor.registerOnChange((e) => {
    ((t._pendingValue = e),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === 'change' && av(t, n));
  });
}
function iS(t, n) {
  n.valueAccessor.registerOnTouched(() => {
    ((t._pendingTouched = !0),
      t.updateOn === 'blur' && t._pendingChange && av(t, n),
      t.updateOn !== 'submit' && t.markAsTouched());
  });
}
function av(t, n) {
  (t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    n.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1));
}
function rS(t, n) {
  let e = (i, r) => {
    (n.valueAccessor.writeValue(i), r && n.viewToModelUpdate(i));
  };
  (t.registerOnChange(e),
    n._registerOnDestroy(() => {
      t._unregisterOnChange(e);
    }));
}
function lv(t, n) {
  (t == null, Ff(t, n));
}
function oS(t, n) {
  return al(t, n);
}
function cv(t, n) {
  (t._syncPendingControls(),
    n.forEach((e) => {
      let i = e.control;
      i.updateOn === 'submit' &&
        i._pendingChange &&
        (e.viewToModelUpdate(i._pendingValue), (i._pendingChange = !1));
    }));
}
function sS(t, n) {
  let e = t.indexOf(n);
  e > -1 && t.splice(e, 1);
}
var aS = { provide: lr, useExisting: ln(() => Io) },
  Co = Promise.resolve(),
  Io = (() => {
    class t extends lr {
      callSetDisabledState;
      get submitted() {
        return vt(this.submittedReactive);
      }
      _submitted = bt(() => this.submittedReactive());
      submittedReactive = ae(!1);
      _directives = new Set();
      form;
      ngSubmit = new G();
      options;
      constructor(e, i, r) {
        (super(), (this.callSetDisabledState = r), (this.form = new ol({}, Of(e), kf(i))));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(e) {
        Co.then(() => {
          let i = this._findContainer(e.path);
          ((e.control = i.registerControl(e.name, e.control)),
            Rf(e.control, e, this.callSetDisabledState),
            e.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(e));
        });
      }
      getControl(e) {
        return this.form.get(e.path);
      }
      removeControl(e) {
        Co.then(() => {
          let i = this._findContainer(e.path);
          (i && i.removeControl(e.name), this._directives.delete(e));
        });
      }
      addFormGroup(e) {
        Co.then(() => {
          let i = this._findContainer(e.path),
            r = new ol({});
          (lv(r, e), i.registerControl(e.name, r), r.updateValueAndValidity({ emitEvent: !1 }));
        });
      }
      removeFormGroup(e) {
        Co.then(() => {
          let i = this._findContainer(e.path);
          i && i.removeControl(e.name);
        });
      }
      getFormGroup(e) {
        return this.form.get(e.path);
      }
      updateModel(e, i) {
        Co.then(() => {
          this.form.get(e.path).setValue(i);
        });
      }
      setValue(e) {
        this.control.setValue(e);
      }
      onSubmit(e) {
        return (
          this.submittedReactive.set(!0),
          cv(this.form, this._directives),
          this.ngSubmit.emit(e),
          this.form._events.next(new nl(this.control)),
          e?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(e = void 0) {
        (this.form.reset(e), this.submittedReactive.set(!1));
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(e) {
        return (e.pop(), e.length ? this.form.get(e) : this.form);
      }
      static ɵfac = function (i) {
        return new (i || t)(je(Gy, 10), je(Wy, 10), je(ov, 8));
      };
      static ɵdir = b({
        type: t,
        selectors: [
          ['form', 3, 'ngNoForm', '', 3, 'formGroup', ''],
          ['ng-form'],
          ['', 'ngForm', ''],
        ],
        hostBindings: function (i, r) {
          i & 1 &&
            me('submit', function (s) {
              return r.onSubmit(s);
            })('reset', function () {
              return r.onReset();
            });
        },
        inputs: { options: [0, 'ngFormOptions', 'options'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        standalone: !1,
        features: [ie([aS]), ce],
      });
    }
    return t;
  })();
function zy(t, n) {
  let e = t.indexOf(n);
  e > -1 && t.splice(e, 1);
}
function $y(t) {
  return (
    typeof t == 'object' &&
    t !== null &&
    Object.keys(t).length === 2 &&
    'value' in t &&
    'disabled' in t
  );
}
var lS = class extends rl {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = !1;
  constructor(n = null, e, i) {
    (super(iv(e), rv(i, e)),
      this._applyFormState(n),
      this._setUpdateStrategy(e),
      this._initObservables(),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
      ll(e) &&
        (e.nonNullable || e.initialValueIsDefault) &&
        ($y(n) ? (this.defaultValue = n.value) : (this.defaultValue = n)));
  }
  setValue(n, e = {}) {
    ((this.value = this._pendingValue = n),
      this._onChange.length &&
        e.emitModelToViewChange !== !1 &&
        this._onChange.forEach((i) => i(this.value, e.emitViewToModelChange !== !1)),
      this.updateValueAndValidity(e));
  }
  patchValue(n, e = {}) {
    this.setValue(n, e);
  }
  reset(n = this.defaultValue, e = {}) {
    (this._applyFormState(n),
      this.markAsPristine(e),
      this.markAsUntouched(e),
      this.setValue(this.value, e),
      (this._pendingChange = !1),
      e?.emitEvent !== !1 && this._events.next(new il(this)));
  }
  _updateValue() {}
  _anyControls(n) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(n) {
    this._onChange.push(n);
  }
  _unregisterOnChange(n) {
    zy(this._onChange, n);
  }
  registerOnDisabledChange(n) {
    this._onDisabledChange.push(n);
  }
  _unregisterOnDisabledChange(n) {
    zy(this._onDisabledChange, n);
  }
  _forEachChild(n) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, { onlySelf: !0, emitModelToViewChange: !1 }), !0)
      : !1;
  }
  _applyFormState(n) {
    $y(n)
      ? ((this.value = this._pendingValue = n.value),
        n.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = n);
  }
};
var cS = (t) => t instanceof lS;
var dS = { provide: lr, useExisting: ln(() => So) },
  So = (() => {
    class t extends lr {
      callSetDisabledState;
      get submitted() {
        return vt(this._submittedReactive);
      }
      set submitted(e) {
        this._submittedReactive.set(e);
      }
      _submitted = bt(() => this._submittedReactive());
      _submittedReactive = ae(!1);
      _oldForm;
      _onCollectionChange = () => this._updateDomValue();
      directives = [];
      form = null;
      ngSubmit = new G();
      constructor(e, i, r) {
        (super(),
          (this.callSetDisabledState = r),
          this._setValidators(e),
          this._setAsyncValidators(i));
      }
      ngOnChanges(e) {
        e.hasOwnProperty('form') &&
          (this._updateValidators(),
          this._updateDomValue(),
          this._updateRegistrations(),
          (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (al(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(e) {
        let i = this.form.get(e.path);
        return (
          Rf(i, e, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(e),
          i
        );
      }
      getControl(e) {
        return this.form.get(e.path);
      }
      removeControl(e) {
        (Uy(e.control || null, e, !1), sS(this.directives, e));
      }
      addFormGroup(e) {
        this._setUpFormContainer(e);
      }
      removeFormGroup(e) {
        this._cleanUpFormContainer(e);
      }
      getFormGroup(e) {
        return this.form.get(e.path);
      }
      addFormArray(e) {
        this._setUpFormContainer(e);
      }
      removeFormArray(e) {
        this._cleanUpFormContainer(e);
      }
      getFormArray(e) {
        return this.form.get(e.path);
      }
      updateModel(e, i) {
        this.form.get(e.path).setValue(i);
      }
      onSubmit(e) {
        return (
          this._submittedReactive.set(!0),
          cv(this.form, this.directives),
          this.ngSubmit.emit(e),
          this.form._events.next(new nl(this.control)),
          e?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(e = void 0, i = {}) {
        (this.form.reset(e, i), this._submittedReactive.set(!1));
      }
      _updateDomValue() {
        (this.directives.forEach((e) => {
          let i = e.control,
            r = this.form.get(e.path);
          i !== r &&
            (Uy(i || null, e), cS(r) && (Rf(r, e, this.callSetDisabledState), (e.control = r)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 }));
      }
      _setUpFormContainer(e) {
        let i = this.form.get(e.path);
        (lv(i, e), i.updateValueAndValidity({ emitEvent: !1 }));
      }
      _cleanUpFormContainer(e) {
        if (this.form) {
          let i = this.form.get(e.path);
          i && oS(i, e) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        (this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {}));
      }
      _updateValidators() {
        (Ff(this.form, this), this._oldForm && al(this._oldForm, this));
      }
      static ɵfac = function (i) {
        return new (i || t)(je(Gy, 10), je(Wy, 10), je(ov, 8));
      };
      static ɵdir = b({
        type: t,
        selectors: [['', 'formGroup', '']],
        hostBindings: function (i, r) {
          i & 1 &&
            me('submit', function (s) {
              return r.onSubmit(s);
            })('reset', function () {
              return r.onReset();
            });
        },
        inputs: { form: [0, 'formGroup', 'form'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        standalone: !1,
        features: [ie([dS]), ce, Ne],
      });
    }
    return t;
  })();
var cl = (() => {
  class t {
    isErrorState(e, i) {
      return !!(e && e.invalid && (e.touched || (i && i.submitted)));
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
var dr = class {
  _defaultMatcher;
  ngControl;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  errorState = !1;
  matcher;
  constructor(n, e, i, r, o) {
    ((this._defaultMatcher = n),
      (this.ngControl = e),
      (this._parentFormGroup = i),
      (this._parentForm = r),
      (this._stateChanges = o));
  }
  updateErrorState() {
    let n = this.errorState,
      e = this._parentFormGroup || this._parentForm,
      i = this.matcher || this._defaultMatcher,
      r = this.ngControl ? this.ngControl.control : null,
      o = i?.isErrorState(r, e) ?? !1;
    o !== n && ((this.errorState = o), this._stateChanges.next());
  }
};
var dv = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ imports: [ye, ye] });
  }
  return t;
})();
var uv = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ imports: [ye] });
  }
  return t;
})();
var Pf = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ imports: [dv, ye, uv, pi] });
  }
  return t;
})();
var uS = ['trigger'],
  fS = ['panel'],
  hS = [[['mat-select-trigger']], '*'],
  pS = ['mat-select-trigger', '*'];
function mS(t, n) {
  if ((t & 1 && (E(0, 'span', 4), ge(1), S()), t & 2)) {
    let e = fe();
    (I(), Ke(e.placeholder));
  }
}
function gS(t, n) {
  t & 1 && re(0);
}
function _S(t, n) {
  if ((t & 1 && (E(0, 'span', 11), ge(1), S()), t & 2)) {
    let e = fe(2);
    (I(), Ke(e.triggerValue));
  }
}
function yS(t, n) {
  if ((t & 1 && (E(0, 'span', 5), X(1, gS, 1, 0)(2, _S, 2, 1, 'span', 11), S()), t & 2)) {
    let e = fe();
    (I(), J(e.customTrigger ? 1 : 2));
  }
}
function vS(t, n) {
  if (t & 1) {
    let e = Cn();
    (E(0, 'div', 12, 1),
      me('keydown', function (r) {
        rt(e);
        let o = fe();
        return ot(o._handleKeydown(r));
      }),
      re(2, 1),
      S());
  }
  if (t & 2) {
    let e = fe();
    (mu(gu('mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open ', e._getPanelTheme())),
      ne('mat-select-panel-animations-enabled', !e._animationsDisabled),
      de('ngClass', e.panelClass),
      ke('id', e.id + '-panel')('aria-multiselectable', e.multiple)(
        'aria-label',
        e.ariaLabel || null,
      )('aria-labelledby', e._getPanelAriaLabelledby()));
  }
}
var Lf = new g('mat-select-scroll-strategy', {
  providedIn: 'root',
  factory: () => {
    let t = u(Y);
    return () => gi(t);
  },
});
function fv(t) {
  let n = u(Y);
  return () => gi(n);
}
var hv = new g('MAT_SELECT_CONFIG'),
  pv = { provide: Lf, deps: [], useFactory: fv },
  mv = new g('MatSelectTrigger'),
  dl = class {
    source;
    value;
    constructor(n, e) {
      ((this.source = n), (this.value = e));
    }
  },
  Vf = (() => {
    class t {
      _viewportRuler = u(tn);
      _changeDetectorRef = u(Dt);
      _elementRef = u(F);
      _dir = u(kt, { optional: !0 });
      _idGenerator = u(lt);
      _renderer = u(We);
      _parentFormField = u(nr, { optional: !0 });
      ngControl = u(cr, { self: !0, optional: !0 });
      _liveAnnouncer = u(nf);
      _defaultOptions = u(hv, { optional: !0 });
      _animationsDisabled = Mn();
      _initialized = new D();
      _cleanupDetach;
      options;
      optionGroups;
      customTrigger;
      _positions = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          panelClass: 'mat-mdc-select-panel-above',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          panelClass: 'mat-mdc-select-panel-above',
        },
      ];
      _scrollOptionIntoView(e) {
        let i = this.options.toArray()[e];
        if (i) {
          let r = this.panel.nativeElement,
            o = my(e, this.options, this.optionGroups),
            s = i._getHostElement();
          e === 0 && o === 1
            ? (r.scrollTop = 0)
            : (r.scrollTop = gy(s.offsetTop, s.offsetHeight, r.scrollTop, r.offsetHeight));
        }
      }
      _positioningSettled() {
        this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
      }
      _getChangeEvent(e) {
        return new dl(this, e);
      }
      _scrollStrategyFactory = u(Lf);
      _panelOpen = !1;
      _compareWith = (e, i) => e === i;
      _uid = this._idGenerator.getId('mat-select-');
      _triggerAriaLabelledBy = null;
      _previousControl;
      _destroy = new D();
      _errorStateTracker;
      stateChanges = new D();
      disableAutomaticLabeling = !0;
      userAriaDescribedBy;
      _selectionModel;
      _keyManager;
      _preferredOverlayOrigin;
      _overlayWidth;
      _onChange = () => {};
      _onTouched = () => {};
      _valueId = this._idGenerator.getId('mat-select-value-');
      _scrollStrategy;
      _overlayPanelClass = this._defaultOptions?.overlayPanelClass || '';
      get focused() {
        return this._focused || this._panelOpen;
      }
      _focused = !1;
      controlType = 'mat-select';
      trigger;
      panel;
      _overlayDir;
      panelClass;
      disabled = !1;
      get disableRipple() {
        return this._disableRipple();
      }
      set disableRipple(e) {
        this._disableRipple.set(e);
      }
      _disableRipple = ae(!1);
      tabIndex = 0;
      get hideSingleSelectionIndicator() {
        return this._hideSingleSelectionIndicator;
      }
      set hideSingleSelectionIndicator(e) {
        ((this._hideSingleSelectionIndicator = e), this._syncParentProperties());
      }
      _hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? !1;
      get placeholder() {
        return this._placeholder;
      }
      set placeholder(e) {
        ((this._placeholder = e), this.stateChanges.next());
      }
      _placeholder;
      get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(ar.required) ?? !1;
      }
      set required(e) {
        ((this._required = e), this.stateChanges.next());
      }
      _required;
      get multiple() {
        return this._multiple;
      }
      set multiple(e) {
        (this._selectionModel, (this._multiple = e));
      }
      _multiple = !1;
      disableOptionCentering = this._defaultOptions?.disableOptionCentering ?? !1;
      get compareWith() {
        return this._compareWith;
      }
      set compareWith(e) {
        ((this._compareWith = e), this._selectionModel && this._initializeSelection());
      }
      get value() {
        return this._value;
      }
      set value(e) {
        this._assignValue(e) && this._onChange(e);
      }
      _value;
      ariaLabel = '';
      ariaLabelledby;
      get errorStateMatcher() {
        return this._errorStateTracker.matcher;
      }
      set errorStateMatcher(e) {
        this._errorStateTracker.matcher = e;
      }
      typeaheadDebounceInterval;
      sortComparator;
      get id() {
        return this._id;
      }
      set id(e) {
        ((this._id = e || this._uid), this.stateChanges.next());
      }
      _id;
      get errorState() {
        return this._errorStateTracker.errorState;
      }
      set errorState(e) {
        this._errorStateTracker.errorState = e;
      }
      panelWidth =
        this._defaultOptions && typeof this._defaultOptions.panelWidth < 'u'
          ? this._defaultOptions.panelWidth
          : 'auto';
      canSelectNullableOptions = this._defaultOptions?.canSelectNullableOptions ?? !1;
      optionSelectionChanges = Hl(() => {
        let e = this.options;
        return e
          ? e.changes.pipe(
              Bt(e),
              Cr(() => It(...e.map((i) => i.onSelectionChange))),
            )
          : this._initialized.pipe(Cr(() => this.optionSelectionChanges));
      });
      openedChange = new G();
      _openedStream = this.openedChange.pipe(
        Pe((e) => e),
        ue(() => {}),
      );
      _closedStream = this.openedChange.pipe(
        Pe((e) => !e),
        ue(() => {}),
      );
      selectionChange = new G();
      valueChange = new G();
      constructor() {
        let e = u(cl),
          i = u(Io, { optional: !0 }),
          r = u(So, { optional: !0 }),
          o = u(new Xi('tabindex'), { optional: !0 });
        (this.ngControl && (this.ngControl.valueAccessor = this),
          this._defaultOptions?.typeaheadDebounceInterval != null &&
            (this.typeaheadDebounceInterval = this._defaultOptions.typeaheadDebounceInterval),
          (this._errorStateTracker = new dr(e, this.ngControl, r, i, this.stateChanges)),
          (this._scrollStrategy = this._scrollStrategyFactory()),
          (this.tabIndex = o == null ? 0 : parseInt(o) || 0),
          (this.id = this.id));
      }
      ngOnInit() {
        ((this._selectionModel = new vo(this.multiple)),
          this.stateChanges.next(),
          this._viewportRuler
            .change()
            .pipe(xe(this._destroy))
            .subscribe(() => {
              this.panelOpen &&
                ((this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin)),
                this._changeDetectorRef.detectChanges());
            }));
      }
      ngAfterContentInit() {
        (this._initialized.next(),
          this._initialized.complete(),
          this._initKeyManager(),
          this._selectionModel.changed.pipe(xe(this._destroy)).subscribe((e) => {
            (e.added.forEach((i) => i.select()), e.removed.forEach((i) => i.deselect()));
          }),
          this.options.changes.pipe(Bt(null), xe(this._destroy)).subscribe(() => {
            (this._resetOptions(), this._initializeSelection());
          }));
      }
      ngDoCheck() {
        let e = this._getTriggerAriaLabelledby(),
          i = this.ngControl;
        if (e !== this._triggerAriaLabelledBy) {
          let r = this._elementRef.nativeElement;
          ((this._triggerAriaLabelledBy = e),
            e ? r.setAttribute('aria-labelledby', e) : r.removeAttribute('aria-labelledby'));
        }
        i &&
          (this._previousControl !== i.control &&
            (this._previousControl !== void 0 &&
              i.disabled !== null &&
              i.disabled !== this.disabled &&
              (this.disabled = i.disabled),
            (this._previousControl = i.control)),
          this.updateErrorState());
      }
      ngOnChanges(e) {
        ((e.disabled || e.userAriaDescribedBy) && this.stateChanges.next(),
          e.typeaheadDebounceInterval &&
            this._keyManager &&
            this._keyManager.withTypeAhead(this.typeaheadDebounceInterval));
      }
      ngOnDestroy() {
        (this._cleanupDetach?.(),
          this._keyManager?.destroy(),
          this._destroy.next(),
          this._destroy.complete(),
          this.stateChanges.complete(),
          this._clearFromModal());
      }
      toggle() {
        this.panelOpen ? this.close() : this.open();
      }
      open() {
        this._canOpen() &&
          (this._parentFormField &&
            (this._preferredOverlayOrigin = this._parentFormField.getConnectedOverlayOrigin()),
          this._cleanupDetach?.(),
          (this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin)),
          this._applyModalPanelOwnership(),
          (this._panelOpen = !0),
          this._overlayDir.positionChange.pipe(Dr(1)).subscribe(() => {
            (this._changeDetectorRef.detectChanges(), this._positioningSettled());
          }),
          this._overlayDir.attachOverlay(),
          this._keyManager.withHorizontalOrientation(null),
          this._highlightCorrectOption(),
          this._changeDetectorRef.markForCheck(),
          this.stateChanges.next(),
          Promise.resolve().then(() => this.openedChange.emit(!0)));
      }
      _trackedModal = null;
      _applyModalPanelOwnership() {
        let e = this._elementRef.nativeElement.closest(
          'body > .cdk-overlay-container [aria-modal="true"]',
        );
        if (!e) return;
        let i = `${this.id}-panel`;
        (this._trackedModal && lf(this._trackedModal, 'aria-owns', i),
          j_(e, 'aria-owns', i),
          (this._trackedModal = e));
      }
      _clearFromModal() {
        if (!this._trackedModal) return;
        let e = `${this.id}-panel`;
        (lf(this._trackedModal, 'aria-owns', e), (this._trackedModal = null));
      }
      close() {
        this._panelOpen &&
          ((this._panelOpen = !1),
          this._exitAndDetach(),
          this._keyManager.withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr'),
          this._changeDetectorRef.markForCheck(),
          this._onTouched(),
          this.stateChanges.next(),
          Promise.resolve().then(() => this.openedChange.emit(!1)));
      }
      _exitAndDetach() {
        if (this._animationsDisabled || !this.panel) {
          this._detachOverlay();
          return;
        }
        (this._cleanupDetach?.(),
          (this._cleanupDetach = () => {
            (i(), clearTimeout(r), (this._cleanupDetach = void 0));
          }));
        let e = this.panel.nativeElement,
          i = this._renderer.listen(e, 'animationend', (o) => {
            o.animationName === '_mat-select-exit' &&
              (this._cleanupDetach?.(), this._detachOverlay());
          }),
          r = setTimeout(() => {
            (this._cleanupDetach?.(), this._detachOverlay());
          }, 200);
        e.classList.add('mat-select-panel-exit');
      }
      _detachOverlay() {
        (this._overlayDir.detachOverlay(), this._changeDetectorRef.markForCheck());
      }
      writeValue(e) {
        this._assignValue(e);
      }
      registerOnChange(e) {
        this._onChange = e;
      }
      registerOnTouched(e) {
        this._onTouched = e;
      }
      setDisabledState(e) {
        ((this.disabled = e), this._changeDetectorRef.markForCheck(), this.stateChanges.next());
      }
      get panelOpen() {
        return this._panelOpen;
      }
      get selected() {
        return this.multiple
          ? this._selectionModel?.selected || []
          : this._selectionModel?.selected[0];
      }
      get triggerValue() {
        if (this.empty) return '';
        if (this._multiple) {
          let e = this._selectionModel.selected.map((i) => i.viewValue);
          return (this._isRtl() && e.reverse(), e.join(', '));
        }
        return this._selectionModel.selected[0].viewValue;
      }
      updateErrorState() {
        this._errorStateTracker.updateErrorState();
      }
      _isRtl() {
        return this._dir ? this._dir.value === 'rtl' : !1;
      }
      _handleKeydown(e) {
        this.disabled ||
          (this.panelOpen ? this._handleOpenKeydown(e) : this._handleClosedKeydown(e));
      }
      _handleClosedKeydown(e) {
        let i = e.keyCode,
          r = i === 40 || i === 38 || i === 37 || i === 39,
          o = i === 13 || i === 32,
          s = this._keyManager;
        if ((!s.isTyping() && o && !Ot(e)) || ((this.multiple || e.altKey) && r))
          (e.preventDefault(), this.open());
        else if (!this.multiple) {
          let a = this.selected;
          s.onKeydown(e);
          let l = this.selected;
          l && a !== l && this._liveAnnouncer.announce(l.viewValue, 1e4);
        }
      }
      _handleOpenKeydown(e) {
        let i = this._keyManager,
          r = e.keyCode,
          o = r === 40 || r === 38,
          s = i.isTyping();
        if (o && e.altKey) (e.preventDefault(), this.close());
        else if (!s && (r === 13 || r === 32) && i.activeItem && !Ot(e))
          (e.preventDefault(), i.activeItem._selectViaInteraction());
        else if (!s && this._multiple && r === 65 && e.ctrlKey) {
          e.preventDefault();
          let a = this.options.some((l) => !l.disabled && !l.selected);
          this.options.forEach((l) => {
            l.disabled || (a ? l.select() : l.deselect());
          });
        } else {
          let a = i.activeItemIndex;
          (i.onKeydown(e),
            this._multiple &&
              o &&
              e.shiftKey &&
              i.activeItem &&
              i.activeItemIndex !== a &&
              i.activeItem._selectViaInteraction());
        }
      }
      _handleOverlayKeydown(e) {
        e.keyCode === 27 && !Ot(e) && (e.preventDefault(), this.close());
      }
      _onFocus() {
        this.disabled || ((this._focused = !0), this.stateChanges.next());
      }
      _onBlur() {
        ((this._focused = !1),
          this._keyManager?.cancelTypeahead(),
          !this.disabled &&
            !this.panelOpen &&
            (this._onTouched(), this._changeDetectorRef.markForCheck(), this.stateChanges.next()));
      }
      _getPanelTheme() {
        return this._parentFormField ? `mat-${this._parentFormField.color}` : '';
      }
      get empty() {
        return !this._selectionModel || this._selectionModel.isEmpty();
      }
      _initializeSelection() {
        Promise.resolve().then(() => {
          (this.ngControl && (this._value = this.ngControl.value),
            this._setSelectionByValue(this._value),
            this.stateChanges.next());
        });
      }
      _setSelectionByValue(e) {
        if (
          (this.options.forEach((i) => i.setInactiveStyles()),
          this._selectionModel.clear(),
          this.multiple && e)
        )
          (Array.isArray(e), e.forEach((i) => this._selectOptionByValue(i)), this._sortValues());
        else {
          let i = this._selectOptionByValue(e);
          i
            ? this._keyManager.updateActiveItem(i)
            : this.panelOpen || this._keyManager.updateActiveItem(-1);
        }
        this._changeDetectorRef.markForCheck();
      }
      _selectOptionByValue(e) {
        let i = this.options.find((r) => {
          if (this._selectionModel.isSelected(r)) return !1;
          try {
            return (
              (r.value != null || this.canSelectNullableOptions) && this._compareWith(r.value, e)
            );
          } catch {
            return !1;
          }
        });
        return (i && this._selectionModel.select(i), i);
      }
      _assignValue(e) {
        return e !== this._value || (this._multiple && Array.isArray(e))
          ? (this.options && this._setSelectionByValue(e), (this._value = e), !0)
          : !1;
      }
      _skipPredicate = (e) => (this.panelOpen ? !1 : e.disabled);
      _getOverlayWidth(e) {
        return this.panelWidth === 'auto'
          ? (e instanceof rr
              ? e.elementRef
              : e || this._elementRef
            ).nativeElement.getBoundingClientRect().width
          : this.panelWidth === null
            ? ''
            : this.panelWidth;
      }
      _syncParentProperties() {
        if (this.options) for (let e of this.options) e._changeDetectorRef.markForCheck();
      }
      _initKeyManager() {
        ((this._keyManager = new uo(this.options)
          .withTypeAhead(this.typeaheadDebounceInterval)
          .withVerticalOrientation()
          .withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr')
          .withHomeAndEnd()
          .withPageUpDown()
          .withAllowedModifierKeys(['shiftKey'])
          .skipPredicate(this._skipPredicate)),
          this._keyManager.tabOut.subscribe(() => {
            this.panelOpen &&
              (!this.multiple &&
                this._keyManager.activeItem &&
                this._keyManager.activeItem._selectViaInteraction(),
              this.focus(),
              this.close());
          }),
          this._keyManager.change.subscribe(() => {
            this._panelOpen && this.panel
              ? this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0)
              : !this._panelOpen &&
                !this.multiple &&
                this._keyManager.activeItem &&
                this._keyManager.activeItem._selectViaInteraction();
          }));
      }
      _resetOptions() {
        let e = It(this.options.changes, this._destroy);
        (this.optionSelectionChanges.pipe(xe(e)).subscribe((i) => {
          (this._onSelect(i.source, i.isUserInput),
            i.isUserInput && !this.multiple && this._panelOpen && (this.close(), this.focus()));
        }),
          It(...this.options.map((i) => i._stateChanges))
            .pipe(xe(e))
            .subscribe(() => {
              (this._changeDetectorRef.detectChanges(), this.stateChanges.next());
            }));
      }
      _onSelect(e, i) {
        let r = this._selectionModel.isSelected(e);
        (!this.canSelectNullableOptions && e.value == null && !this._multiple
          ? (e.deselect(),
            this._selectionModel.clear(),
            this.value != null && this._propagateChanges(e.value))
          : (r !== e.selected &&
              (e.selected ? this._selectionModel.select(e) : this._selectionModel.deselect(e)),
            i && this._keyManager.setActiveItem(e),
            this.multiple && (this._sortValues(), i && this.focus())),
          r !== this._selectionModel.isSelected(e) && this._propagateChanges(),
          this.stateChanges.next());
      }
      _sortValues() {
        if (this.multiple) {
          let e = this.options.toArray();
          (this._selectionModel.sort((i, r) =>
            this.sortComparator ? this.sortComparator(i, r, e) : e.indexOf(i) - e.indexOf(r),
          ),
            this.stateChanges.next());
        }
      }
      _propagateChanges(e) {
        let i;
        (this.multiple
          ? (i = this.selected.map((r) => r.value))
          : (i = this.selected ? this.selected.value : e),
          (this._value = i),
          this.valueChange.emit(i),
          this._onChange(i),
          this.selectionChange.emit(this._getChangeEvent(i)),
          this._changeDetectorRef.markForCheck());
      }
      _highlightCorrectOption() {
        if (this._keyManager)
          if (this.empty) {
            let e = -1;
            for (let i = 0; i < this.options.length; i++)
              if (!this.options.get(i).disabled) {
                e = i;
                break;
              }
            this._keyManager.setActiveItem(e);
          } else this._keyManager.setActiveItem(this._selectionModel.selected[0]);
      }
      _canOpen() {
        return !this._panelOpen && !this.disabled && this.options?.length > 0 && !!this._overlayDir;
      }
      focus(e) {
        this._elementRef.nativeElement.focus(e);
      }
      _getPanelAriaLabelledby() {
        if (this.ariaLabel) return null;
        let e = this._parentFormField?.getLabelId() || null,
          i = e ? e + ' ' : '';
        return this.ariaLabelledby ? i + this.ariaLabelledby : e;
      }
      _getAriaActiveDescendant() {
        return this.panelOpen && this._keyManager && this._keyManager.activeItem
          ? this._keyManager.activeItem.id
          : null;
      }
      _getTriggerAriaLabelledby() {
        if (this.ariaLabel) return null;
        let e = this._parentFormField?.getLabelId() || '';
        return (
          this.ariaLabelledby && (e += ' ' + this.ariaLabelledby),
          e || (e = this._valueId),
          e
        );
      }
      get describedByIds() {
        return this._elementRef.nativeElement.getAttribute('aria-describedby')?.split(' ') || [];
      }
      setDescribedByIds(e) {
        e.length
          ? this._elementRef.nativeElement.setAttribute('aria-describedby', e.join(' '))
          : this._elementRef.nativeElement.removeAttribute('aria-describedby');
      }
      onContainerClick() {
        (this.focus(), this.open());
      }
      get shouldLabelFloat() {
        return this.panelOpen || !this.empty || (this.focused && !!this.placeholder);
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['mat-select']],
        contentQueries: function (i, r, o) {
          if ((i & 1 && (Ce(o, mv, 5), Ce(o, pi, 5), Ce(o, vf, 5)), i & 2)) {
            let s;
            (H((s = U())) && (r.customTrigger = s.first),
              H((s = U())) && (r.options = s),
              H((s = U())) && (r.optionGroups = s));
          }
        },
        viewQuery: function (i, r) {
          if ((i & 1 && (be(uS, 5), be(fS, 5), be(Qa, 5)), i & 2)) {
            let o;
            (H((o = U())) && (r.trigger = o.first),
              H((o = U())) && (r.panel = o.first),
              H((o = U())) && (r._overlayDir = o.first));
          }
        },
        hostAttrs: ['role', 'combobox', 'aria-haspopup', 'listbox', 1, 'mat-mdc-select'],
        hostVars: 21,
        hostBindings: function (i, r) {
          (i & 1 &&
            me('keydown', function (s) {
              return r._handleKeydown(s);
            })('focus', function () {
              return r._onFocus();
            })('blur', function () {
              return r._onBlur();
            }),
            i & 2 &&
              (ke('id', r.id)('tabindex', r.disabled ? -1 : r.tabIndex)(
                'aria-controls',
                r.panelOpen ? r.id + '-panel' : null,
              )('aria-expanded', r.panelOpen)('aria-label', r.ariaLabel || null)(
                'aria-required',
                r.required.toString(),
              )('aria-disabled', r.disabled.toString())('aria-invalid', r.errorState)(
                'aria-activedescendant',
                r._getAriaActiveDescendant(),
              ),
              ne('mat-mdc-select-disabled', r.disabled)('mat-mdc-select-invalid', r.errorState)(
                'mat-mdc-select-required',
                r.required,
              )('mat-mdc-select-empty', r.empty)('mat-mdc-select-multiple', r.multiple)(
                'mat-select-open',
                r.panelOpen,
              )));
        },
        inputs: {
          userAriaDescribedBy: [0, 'aria-describedby', 'userAriaDescribedBy'],
          panelClass: 'panelClass',
          disabled: [2, 'disabled', 'disabled', K],
          disableRipple: [2, 'disableRipple', 'disableRipple', K],
          tabIndex: [2, 'tabIndex', 'tabIndex', (e) => (e == null ? 0 : Ou(e))],
          hideSingleSelectionIndicator: [
            2,
            'hideSingleSelectionIndicator',
            'hideSingleSelectionIndicator',
            K,
          ],
          placeholder: 'placeholder',
          required: [2, 'required', 'required', K],
          multiple: [2, 'multiple', 'multiple', K],
          disableOptionCentering: [2, 'disableOptionCentering', 'disableOptionCentering', K],
          compareWith: 'compareWith',
          value: 'value',
          ariaLabel: [0, 'aria-label', 'ariaLabel'],
          ariaLabelledby: [0, 'aria-labelledby', 'ariaLabelledby'],
          errorStateMatcher: 'errorStateMatcher',
          typeaheadDebounceInterval: [
            2,
            'typeaheadDebounceInterval',
            'typeaheadDebounceInterval',
            Ou,
          ],
          sortComparator: 'sortComparator',
          id: 'id',
          panelWidth: 'panelWidth',
          canSelectNullableOptions: [2, 'canSelectNullableOptions', 'canSelectNullableOptions', K],
        },
        outputs: {
          openedChange: 'openedChange',
          _openedStream: 'opened',
          _closedStream: 'closed',
          selectionChange: 'selectionChange',
          valueChange: 'valueChange',
        },
        exportAs: ['matSelect'],
        features: [
          ie([
            { provide: tr, useExisting: t },
            { provide: yf, useExisting: t },
          ]),
          Ne,
        ],
        ngContentSelectors: pS,
        decls: 11,
        vars: 9,
        consts: [
          ['fallbackOverlayOrigin', 'cdkOverlayOrigin', 'trigger', ''],
          ['panel', ''],
          ['cdk-overlay-origin', '', 1, 'mat-mdc-select-trigger', 3, 'click'],
          [1, 'mat-mdc-select-value'],
          [1, 'mat-mdc-select-placeholder', 'mat-mdc-select-min-line'],
          [1, 'mat-mdc-select-value-text'],
          [1, 'mat-mdc-select-arrow-wrapper'],
          [1, 'mat-mdc-select-arrow'],
          [
            'viewBox',
            '0 0 24 24',
            'width',
            '24px',
            'height',
            '24px',
            'focusable',
            'false',
            'aria-hidden',
            'true',
          ],
          ['d', 'M7 10l5 5 5-5z'],
          [
            'cdk-connected-overlay',
            '',
            'cdkConnectedOverlayLockPosition',
            '',
            'cdkConnectedOverlayHasBackdrop',
            '',
            'cdkConnectedOverlayBackdropClass',
            'cdk-overlay-transparent-backdrop',
            3,
            'detach',
            'backdropClick',
            'overlayKeydown',
            'cdkConnectedOverlayDisableClose',
            'cdkConnectedOverlayPanelClass',
            'cdkConnectedOverlayScrollStrategy',
            'cdkConnectedOverlayOrigin',
            'cdkConnectedOverlayPositions',
            'cdkConnectedOverlayWidth',
            'cdkConnectedOverlayFlexibleDimensions',
          ],
          [1, 'mat-mdc-select-min-line'],
          ['role', 'listbox', 'tabindex', '-1', 3, 'keydown', 'ngClass'],
        ],
        template: function (i, r) {
          if (i & 1) {
            let o = Cn();
            (Ze(hS),
              E(0, 'div', 2, 0),
              me('click', function () {
                return (rt(o), ot(r.open()));
              }),
              E(3, 'div', 3),
              X(4, mS, 2, 1, 'span', 4)(5, yS, 3, 1, 'span', 5),
              S(),
              E(6, 'div', 6)(7, 'div', 7),
              Vs(),
              E(8, 'svg', 8),
              Ie(9, 'path', 9),
              S()()()(),
              qe(10, vS, 3, 10, 'ng-template', 10),
              me('detach', function () {
                return (rt(o), ot(r.close()));
              })('backdropClick', function () {
                return (rt(o), ot(r.close()));
              })('overlayKeydown', function (a) {
                return (rt(o), ot(r._handleOverlayKeydown(a)));
              }));
          }
          if (i & 2) {
            let o = Qi(1);
            (I(3),
              ke('id', r._valueId),
              I(),
              J(r.empty ? 4 : 5),
              I(6),
              de('cdkConnectedOverlayDisableClose', !0)(
                'cdkConnectedOverlayPanelClass',
                r._overlayPanelClass,
              )('cdkConnectedOverlayScrollStrategy', r._scrollStrategy)(
                'cdkConnectedOverlayOrigin',
                r._preferredOverlayOrigin || o,
              )('cdkConnectedOverlayPositions', r._positions)(
                'cdkConnectedOverlayWidth',
                r._overlayWidth,
              )('cdkConnectedOverlayFlexibleDimensions', !0));
          }
        },
        dependencies: [rr, Qa, Lu],
        styles: [
          `@keyframes _mat-select-enter{from{opacity:0;transform:scaleY(0.8)}to{opacity:1;transform:none}}@keyframes _mat-select-exit{from{opacity:1}to{opacity:0}}.mat-mdc-select{display:inline-block;width:100%;outline:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));font-family:var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));line-height:var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));font-size:var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking))}div.mat-mdc-select-panel{box-shadow:var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-select-disabled{color:var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-select-disabled .mat-mdc-select-placeholder{color:var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-mdc-select-disabled .mat-mdc-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-mdc-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-mdc-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-mdc-select-arrow-wrapper{height:24px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper{transform:none}.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after{color:var(--mat-select-invalid-arrow-color, var(--mat-sys-error))}.mat-mdc-select-arrow{width:10px;height:5px;position:relative;color:var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant))}.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow{color:var(--mat-select-focused-arrow-color, var(--mat-sys-primary))}.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow{color:var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-select-open .mat-mdc-select-arrow{transform:rotate(180deg)}.mat-form-field-animations-enabled .mat-mdc-select-arrow{transition:transform 80ms linear}.mat-mdc-select-arrow svg{fill:currentColor;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}@media(forced-colors: active){.mat-mdc-select-arrow svg{fill:CanvasText}.mat-mdc-select-disabled .mat-mdc-select-arrow svg{fill:GrayText}}div.mat-mdc-select-panel{width:100%;max-height:275px;outline:0;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:relative;background-color:var(--mat-select-panel-background-color, var(--mat-sys-surface-container))}@media(forced-colors: active){div.mat-mdc-select-panel{outline:solid 1px}}.cdk-overlay-pane:not(.mat-mdc-select-panel-above) div.mat-mdc-select-panel{border-top-left-radius:0;border-top-right-radius:0;transform-origin:top center}.mat-mdc-select-panel-above div.mat-mdc-select-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:bottom center}.mat-select-panel-animations-enabled{animation:_mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1)}.mat-select-panel-animations-enabled.mat-select-panel-exit{animation:_mat-select-exit 100ms linear}.mat-mdc-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);color:var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant))}.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder,._mat-animation-noopable .mat-mdc-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-mdc-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper{cursor:pointer}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label{max-width:calc(100% - 18px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above{max-width:calc(100%/0.75 - 24px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch{max-width:calc(100% - 24px)}.mat-mdc-select-min-line:empty::before{content:" ";white-space:pre;width:1px;display:inline-block;visibility:hidden}.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper{transform:var(--mat-select-arrow-transform, translateY(-8px))}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })();
var jf = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ providers: [pv], imports: [Mf, Pf, ye, Ua, Pt, Pf, ye] });
  }
  return t;
})();
function DS(t, n) {
  if ((t & 1 && (E(0, 'mat-option', 1), ge(1), S()), t & 2)) {
    let e = n.$implicit;
    (de('value', e), I(), Ke(e));
  }
}
function CS(t, n) {
  if ((t & 1 && (E(0, 'mat-option', 1), ge(1), S()), t & 2)) {
    let e = n.$implicit;
    (de('value', e), I(), Ke(e));
  }
}
var ul = class t {
  intlService = u(At);
  locales = [
    'af-ZA',
    'am-ET',
    'ar-AE',
    'ar-BH',
    'ar-DZ',
    'ar-EG',
    'ar-IQ',
    'ar-JO',
    'ar-KW',
    'ar-LB',
    'ar-LY',
    'ar-MA',
    'ar-OM',
    'ar-QA',
    'ar-SA',
    'ar-SD',
    'ar-SY',
    'ar-TN',
    'ar-YE',
    'arn-CL',
    'as-IN',
    'az-az',
    'ba-RU',
    'be-BY',
    'bg-BG',
    'bn-BD',
    'bn-IN',
    'bo-CN',
    'br-FR',
    'ca-ES',
    'co-FR',
    'cs-CZ',
    'cy-GB',
    'da-DK',
    'de-AT',
    'de-CH',
    'de-DE',
    'de-LI',
    'de-LU',
    'dsb-DE',
    'dv-MV',
    'el-CY',
    'el-GR',
    'en-029',
    'en-AU',
    'en-BZ',
    'en-CA',
    'en-GB',
    'en-IE',
    'en-IN',
    'en-JM',
    'en-MT',
    'en-MY',
    'en-NZ',
    'en-PH',
    'en-SG',
    'en-TT',
    'en-US',
    'en-ZA',
    'en-ZW',
    'en-cb',
    'es-AR',
    'es-BO',
    'es-CL',
    'es-CO',
    'es-CR',
    'es-DO',
    'es-EC',
    'es-ES',
    'es-GT',
    'es-HN',
    'es-MX',
    'es-NI',
    'es-PA',
    'es-PE',
    'es-PR',
    'es-PY',
    'es-SV',
    'es-US',
    'es-UY',
    'es-VE',
    'et-EE',
    'eu-ES',
    'fa-IR',
    'fi-FI',
    'fil-PH',
    'fo-FO',
    'fr-BE',
    'fr-CA',
    'fr-CH',
    'fr-FR',
    'fr-LU',
    'fr-MC',
    'fy-NL',
    'ga-IE',
    'gd-GB',
    'gd-ie',
    'gl-ES',
    'gsw-FR',
    'gu-IN',
    'he-IL',
    'hi-IN',
    'hr-BA',
    'hr-HR',
    'hsb-DE',
    'hu-HU',
    'hy-AM',
    'id-ID',
    'ig-NG',
    'ii-CN',
    'in-ID',
    'is-IS',
    'it-CH',
    'it-IT',
    'iw-IL',
    'ja-JP',
    'ka-GE',
    'kk-KZ',
    'kl-GL',
    'km-KH',
    'kn-IN',
    'ko-KR',
    'kok-IN',
    'ky-KG',
    'lb-LU',
    'lo-LA',
    'lt-LT',
    'lv-LV',
    'mi-NZ',
    'mk-MK',
    'ml-IN',
    'mn-MN',
    'moh-CA',
    'mr-IN',
    'ms-BN',
    'ms-MY',
    'mt-MT',
    'nb-NO',
    'ne-NP',
    'nl-BE',
    'nl-NL',
    'nn-NO',
    'no-no',
    'nso-ZA',
    'oc-FR',
    'or-IN',
    'pa-IN',
    'pl-PL',
    'prs-AF',
    'ps-AF',
    'pt-BR',
    'pt-PT',
    'qut-GT',
    'quz-BO',
    'quz-EC',
    'quz-PE',
    'rm-CH',
    'ro-RO',
    'ro-mo',
    'ru-RU',
    'ru-mo',
    'rw-RW',
    'sa-IN',
    'sah-RU',
    'se-FI',
    'se-NO',
    'se-SE',
    'si-LK',
    'sk-SK',
    'sl-SI',
    'sma-NO',
    'sma-SE',
    'smj-NO',
    'smj-SE',
    'smn-FI',
    'sms-FI',
    'sq-AL',
    'sr-BA',
    'sr-CS',
    'sr-ME',
    'sr-RS',
    'sr-sp',
    'sv-FI',
    'sv-SE',
    'sw-KE',
    'syr-SY',
    'ta-IN',
    'te-IN',
    'th-TH',
    'tk-TM',
    'tlh-QS',
    'tn-ZA',
    'tr-TR',
    'tt-RU',
    'ug-CN',
    'uk-UA',
    'ur-PK',
    'uz-uz',
    'vi-VN',
    'wo-SN',
    'xh-ZA',
    'yo-NG',
    'zh-CN',
    'zh-HK',
    'zh-MO',
    'zh-SG',
    'zh-TW',
    'zu-ZA',
  ];
  currencies = [
    'AED',
    'AFN',
    'ALL',
    'AMD',
    'ARS',
    'AUD',
    'AZN',
    'BAM',
    'BDT',
    'BGN',
    'BHD',
    'BIF',
    'BND',
    'BOB',
    'BRL',
    'BWP',
    'BYN',
    'BZD',
    'CAD',
    'CDF',
    'CHF',
    'CLP',
    'CNY',
    'COP',
    'CRC',
    'CVE',
    'CZK',
    'DJF',
    'DKK',
    'DOP',
    'DZD',
    'EEK',
    'EGP',
    'ERN',
    'ETB',
    'EUR',
    'GBP',
    'GEL',
    'GHS',
    'GNF',
    'GTQ',
    'HKD',
    'HNL',
    'HRK',
    'HUF',
    'IDR',
    'ILS',
    'INR',
    'IQD',
    'IRR',
    'ISK',
    'JMD',
    'JOD',
    'JPY',
    'KES',
    'KHR',
    'KMF',
    'KRW',
    'KWD',
    'KZT',
    'LBP',
    'LKR',
    'LTL',
    'LVL',
    'LYD',
    'MAD',
    'MDL',
    'MGA',
    'MKD',
    'MMK',
    'MOP',
    'MUR',
    'MXN',
    'MYR',
    'MZN',
    'NAD',
    'NGN',
    'NIO',
    'NOK',
    'NPR',
    'NZD',
    'OMR',
    'PAB',
    'PEN',
    'PHP',
    'PKR',
    'PLN',
    'PYG',
    'QAR',
    'RON',
    'RSD',
    'RUB',
    'RWF',
    'SAR',
    'SDG',
    'SEK',
    'SGD',
    'SOS',
    'SYP',
    'THB',
    'TND',
    'TOP',
    'TRY',
    'TTD',
    'TWD',
    'TZS',
    'UAH',
    'UGX',
    'USD',
    'UYU',
    'UZS',
    'VEF',
    'VND',
    'XAF',
    'XOF',
    'YER',
    'ZAR',
    'ZMK',
    'ZWL',
  ];
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = B({
    type: t,
    selectors: [['app-intl']],
    decls: 12,
    vars: 2,
    consts: [
      [3, 'valueChange', 'value'],
      [3, 'value'],
    ],
    template: function (e, i) {
      (e & 1 &&
        (E(0, 'mat-form-field')(1, 'mat-label'),
        ge(2, 'Locale'),
        S(),
        E(3, 'mat-select', 0),
        me('valueChange', function (o) {
          return i.intlService.setLocale(o);
        }),
        va(4, DS, 2, 2, 'mat-option', 1, ya),
        S()(),
        E(6, 'mat-form-field')(7, 'mat-label'),
        ge(8, 'Currency'),
        S(),
        E(9, 'mat-select', 0),
        me('valueChange', function (o) {
          return i.intlService.setCurrency(o);
        }),
        va(10, CS, 2, 2, 'mat-option', 1, ya),
        S()()),
        e & 2 &&
          (I(3),
          de('value', i.intlService.locale()),
          I(),
          ba(i.locales),
          I(5),
          de('value', i.intlService.currency()),
          I(),
          ba(i.currencies)));
    },
    dependencies: [Pt, Ft, Tn, jf, Vf, pi],
    encapsulation: 2,
  });
};
var yi = (t, n, e) => Intl.NumberFormat(n, { style: 'currency', currency: e }).formatToParts(t);
var fl = class t {
  intlService = u(At);
  params = [NaN, '', ''];
  cache = '';
  transform(n) {
    let e = [n, this.intlService.locale(), this.intlService.currency()];
    return (
      JSON.stringify(e) !== JSON.stringify(this.params) &&
        ((this.params = e),
        (this.cache = yi(...this.params)
          .map(({ value: r }) => r)
          .join(''))),
      this.cache
    );
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵpipe = _a({ name: 'currency', type: t, pure: !1 });
};
var ES = [[['caption']], [['colgroup'], ['col']], '*'],
  wS = ['caption', 'colgroup, col', '*'];
function IS(t, n) {
  t & 1 && re(0, 2);
}
function SS(t, n) {
  t & 1 &&
    (E(0, 'thead', 0),
    He(1, 1),
    S(),
    E(2, 'tbody', 0),
    He(3, 2)(4, 3),
    S(),
    E(5, 'tfoot', 0),
    He(6, 4),
    S());
}
function xS(t, n) {
  t & 1 && He(0, 1)(1, 2)(2, 3)(3, 4);
}
var Ct = new g('CDK_TABLE');
var gl = (() => {
    class t {
      template = u(we);
      constructor() {}
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'cdkCellDef', '']] });
    }
    return t;
  })(),
  _l = (() => {
    class t {
      template = u(we);
      constructor() {}
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'cdkHeaderCellDef', '']] });
    }
    return t;
  })(),
  yv = (() => {
    class t {
      template = u(we);
      constructor() {}
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'cdkFooterCellDef', '']] });
    }
    return t;
  })(),
  ur = (() => {
    class t {
      _table = u(Ct, { optional: !0 });
      _hasStickyChanged = !1;
      get name() {
        return this._name;
      }
      set name(e) {
        this._setNameInput(e);
      }
      _name;
      get sticky() {
        return this._sticky;
      }
      set sticky(e) {
        e !== this._sticky && ((this._sticky = e), (this._hasStickyChanged = !0));
      }
      _sticky = !1;
      get stickyEnd() {
        return this._stickyEnd;
      }
      set stickyEnd(e) {
        e !== this._stickyEnd && ((this._stickyEnd = e), (this._hasStickyChanged = !0));
      }
      _stickyEnd = !1;
      cell;
      headerCell;
      footerCell;
      cssClassFriendlyName;
      _columnCssClassName;
      constructor() {}
      hasStickyChanged() {
        let e = this._hasStickyChanged;
        return (this.resetStickyChanged(), e);
      }
      resetStickyChanged() {
        this._hasStickyChanged = !1;
      }
      _updateColumnCssClassName() {
        this._columnCssClassName = [`cdk-column-${this.cssClassFriendlyName}`];
      }
      _setNameInput(e) {
        e &&
          ((this._name = e),
          (this.cssClassFriendlyName = e.replace(/[^a-z0-9_-]/gi, '-')),
          this._updateColumnCssClassName());
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['', 'cdkColumnDef', '']],
        contentQueries: function (i, r, o) {
          if ((i & 1 && (Ce(o, gl, 5), Ce(o, _l, 5), Ce(o, yv, 5)), i & 2)) {
            let s;
            (H((s = U())) && (r.cell = s.first),
              H((s = U())) && (r.headerCell = s.first),
              H((s = U())) && (r.footerCell = s.first));
          }
        },
        inputs: {
          name: [0, 'cdkColumnDef', 'name'],
          sticky: [2, 'sticky', 'sticky', K],
          stickyEnd: [2, 'stickyEnd', 'stickyEnd', K],
        },
        features: [ie([{ provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: t }])],
      });
    }
    return t;
  })(),
  pl = class {
    constructor(n, e) {
      e.nativeElement.classList.add(...n._columnCssClassName);
    }
  },
  vv = (() => {
    class t extends pl {
      constructor() {
        super(u(ur), u(F));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['cdk-header-cell'], ['th', 'cdk-header-cell', '']],
        hostAttrs: ['role', 'columnheader', 1, 'cdk-header-cell'],
        features: [ce],
      });
    }
    return t;
  })();
var bv = (() => {
  class t extends pl {
    constructor() {
      let e = u(ur),
        i = u(F);
      super(e, i);
      let r = e._table?._getCellRole();
      r && i.nativeElement.setAttribute('role', r);
    }
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵdir = b({
      type: t,
      selectors: [['cdk-cell'], ['td', 'cdk-cell', '']],
      hostAttrs: [1, 'cdk-cell'],
      features: [ce],
    });
  }
  return t;
})();
var Hf = (() => {
    class t {
      template = u(we);
      _differs = u(Xt);
      columns;
      _columnsDiffer;
      constructor() {}
      ngOnChanges(e) {
        if (!this._columnsDiffer) {
          let i = (e.columns && e.columns.currentValue) || [];
          ((this._columnsDiffer = this._differs.find(i).create()), this._columnsDiffer.diff(i));
        }
      }
      getColumnsDiff() {
        return this._columnsDiffer.diff(this.columns);
      }
      extractCellTemplate(e) {
        return this instanceof xo
          ? e.headerCell.template
          : this instanceof Uf
            ? e.footerCell.template
            : e.cell.template;
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, features: [Ne] });
    }
    return t;
  })(),
  xo = (() => {
    class t extends Hf {
      _table = u(Ct, { optional: !0 });
      _hasStickyChanged = !1;
      get sticky() {
        return this._sticky;
      }
      set sticky(e) {
        e !== this._sticky && ((this._sticky = e), (this._hasStickyChanged = !0));
      }
      _sticky = !1;
      constructor() {
        super(u(we), u(Xt));
      }
      ngOnChanges(e) {
        super.ngOnChanges(e);
      }
      hasStickyChanged() {
        let e = this._hasStickyChanged;
        return (this.resetStickyChanged(), e);
      }
      resetStickyChanged() {
        this._hasStickyChanged = !1;
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['', 'cdkHeaderRowDef', '']],
        inputs: {
          columns: [0, 'cdkHeaderRowDef', 'columns'],
          sticky: [2, 'cdkHeaderRowDefSticky', 'sticky', K],
        },
        features: [ce, Ne],
      });
    }
    return t;
  })(),
  Uf = (() => {
    class t extends Hf {
      _table = u(Ct, { optional: !0 });
      _hasStickyChanged = !1;
      get sticky() {
        return this._sticky;
      }
      set sticky(e) {
        e !== this._sticky && ((this._sticky = e), (this._hasStickyChanged = !0));
      }
      _sticky = !1;
      constructor() {
        super(u(we), u(Xt));
      }
      ngOnChanges(e) {
        super.ngOnChanges(e);
      }
      hasStickyChanged() {
        let e = this._hasStickyChanged;
        return (this.resetStickyChanged(), e);
      }
      resetStickyChanged() {
        this._hasStickyChanged = !1;
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['', 'cdkFooterRowDef', '']],
        inputs: {
          columns: [0, 'cdkFooterRowDef', 'columns'],
          sticky: [2, 'cdkFooterRowDefSticky', 'sticky', K],
        },
        features: [ce, Ne],
      });
    }
    return t;
  })(),
  yl = (() => {
    class t extends Hf {
      _table = u(Ct, { optional: !0 });
      when;
      constructor() {
        super(u(we), u(Xt));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [['', 'cdkRowDef', '']],
        inputs: { columns: [0, 'cdkRowDefColumns', 'columns'], when: [0, 'cdkRowDefWhen', 'when'] },
        features: [ce],
      });
    }
    return t;
  })(),
  vi = (() => {
    class t {
      _viewContainer = u(Be);
      cells;
      context;
      static mostRecentCellOutlet = null;
      constructor() {
        t.mostRecentCellOutlet = this;
      }
      ngOnDestroy() {
        t.mostRecentCellOutlet === this && (t.mostRecentCellOutlet = null);
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'cdkCellOutlet', '']] });
    }
    return t;
  })(),
  zf = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['cdk-header-row'], ['tr', 'cdk-header-row', '']],
        hostAttrs: ['role', 'row', 1, 'cdk-header-row'],
        decls: 1,
        vars: 0,
        consts: [['cdkCellOutlet', '']],
        template: function (i, r) {
          i & 1 && He(0, 0);
        },
        dependencies: [vi],
        encapsulation: 2,
      });
    }
    return t;
  })();
var $f = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['cdk-row'], ['tr', 'cdk-row', '']],
        hostAttrs: ['role', 'row', 1, 'cdk-row'],
        decls: 1,
        vars: 0,
        consts: [['cdkCellOutlet', '']],
        template: function (i, r) {
          i & 1 && He(0, 0);
        },
        dependencies: [vi],
        encapsulation: 2,
      });
    }
    return t;
  })(),
  Dv = (() => {
    class t {
      templateRef = u(we);
      _contentClassNames = ['cdk-no-data-row', 'cdk-row'];
      _cellClassNames = ['cdk-cell', 'cdk-no-data-cell'];
      _cellSelector = 'td, cdk-cell, [cdk-cell], .cdk-cell';
      constructor() {}
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['ng-template', 'cdkNoDataRow', '']] });
    }
    return t;
  })(),
  gv = ['top', 'bottom', 'left', 'right'],
  Bf = class {
    _isNativeHtmlTable;
    _stickCellCss;
    _isBrowser;
    _needsPositionStickyOnElement;
    direction;
    _positionListener;
    _tableInjector;
    _elemSizeCache = new WeakMap();
    _resizeObserver = globalThis?.ResizeObserver
      ? new globalThis.ResizeObserver((n) => this._updateCachedSizes(n))
      : null;
    _updatedStickyColumnsParamsToReplay = [];
    _stickyColumnsReplayTimeout = null;
    _cachedCellWidths = [];
    _borderCellCss;
    _destroyed = !1;
    constructor(n, e, i = !0, r = !0, o, s, a) {
      ((this._isNativeHtmlTable = n),
        (this._stickCellCss = e),
        (this._isBrowser = i),
        (this._needsPositionStickyOnElement = r),
        (this.direction = o),
        (this._positionListener = s),
        (this._tableInjector = a),
        (this._borderCellCss = {
          top: `${e}-border-elem-top`,
          bottom: `${e}-border-elem-bottom`,
          left: `${e}-border-elem-left`,
          right: `${e}-border-elem-right`,
        }));
    }
    clearStickyPositioning(n, e) {
      (e.includes('left') || e.includes('right')) && this._removeFromStickyColumnReplayQueue(n);
      let i = [];
      for (let r of n) r.nodeType === r.ELEMENT_NODE && i.push(r, ...Array.from(r.children));
      at(
        {
          write: () => {
            for (let r of i) this._removeStickyStyle(r, e);
          },
        },
        { injector: this._tableInjector },
      );
    }
    updateStickyColumns(n, e, i, r = !0, o = !0) {
      if (!n.length || !this._isBrowser || !(e.some((w) => w) || i.some((w) => w))) {
        (this._positionListener?.stickyColumnsUpdated({ sizes: [] }),
          this._positionListener?.stickyEndColumnsUpdated({ sizes: [] }));
        return;
      }
      let s = n[0],
        a = s.children.length,
        l = this.direction === 'rtl',
        c = l ? 'right' : 'left',
        d = l ? 'left' : 'right',
        f = e.lastIndexOf(!0),
        p = i.indexOf(!0),
        h,
        m,
        _;
      (o &&
        this._updateStickyColumnReplayQueue({
          rows: [...n],
          stickyStartStates: [...e],
          stickyEndStates: [...i],
        }),
        at(
          {
            earlyRead: () => {
              ((h = this._getCellWidths(s, r)),
                (m = this._getStickyStartColumnPositions(h, e)),
                (_ = this._getStickyEndColumnPositions(h, i)));
            },
            write: () => {
              for (let w of n)
                for (let v = 0; v < a; v++) {
                  let Re = w.children[v];
                  (e[v] && this._addStickyStyle(Re, c, m[v], v === f),
                    i[v] && this._addStickyStyle(Re, d, _[v], v === p));
                }
              this._positionListener &&
                h.some((w) => !!w) &&
                (this._positionListener.stickyColumnsUpdated({
                  sizes: f === -1 ? [] : h.slice(0, f + 1).map((w, v) => (e[v] ? w : null)),
                }),
                this._positionListener.stickyEndColumnsUpdated({
                  sizes:
                    p === -1
                      ? []
                      : h
                          .slice(p)
                          .map((w, v) => (i[v + p] ? w : null))
                          .reverse(),
                }));
            },
          },
          { injector: this._tableInjector },
        ));
    }
    stickRows(n, e, i) {
      if (!this._isBrowser) return;
      let r = i === 'bottom' ? n.slice().reverse() : n,
        o = i === 'bottom' ? e.slice().reverse() : e,
        s = [],
        a = [],
        l = [];
      at(
        {
          earlyRead: () => {
            for (let c = 0, d = 0; c < r.length; c++) {
              if (!o[c]) continue;
              s[c] = d;
              let f = r[c];
              l[c] = this._isNativeHtmlTable ? Array.from(f.children) : [f];
              let p = this._retrieveElementSize(f).height;
              ((d += p), (a[c] = p));
            }
          },
          write: () => {
            let c = o.lastIndexOf(!0);
            for (let d = 0; d < r.length; d++) {
              if (!o[d]) continue;
              let f = s[d],
                p = d === c;
              for (let h of l[d]) this._addStickyStyle(h, i, f, p);
            }
            i === 'top'
              ? this._positionListener?.stickyHeaderRowsUpdated({
                  sizes: a,
                  offsets: s,
                  elements: l,
                })
              : this._positionListener?.stickyFooterRowsUpdated({
                  sizes: a,
                  offsets: s,
                  elements: l,
                });
          },
        },
        { injector: this._tableInjector },
      );
    }
    updateStickyFooterContainer(n, e) {
      this._isNativeHtmlTable &&
        at(
          {
            write: () => {
              let i = n.querySelector('tfoot');
              i &&
                (e.some((r) => !r)
                  ? this._removeStickyStyle(i, ['bottom'])
                  : this._addStickyStyle(i, 'bottom', 0, !1));
            },
          },
          { injector: this._tableInjector },
        );
    }
    destroy() {
      (this._stickyColumnsReplayTimeout && clearTimeout(this._stickyColumnsReplayTimeout),
        this._resizeObserver?.disconnect(),
        (this._destroyed = !0));
    }
    _removeStickyStyle(n, e) {
      if (!n.classList.contains(this._stickCellCss)) return;
      for (let r of e) ((n.style[r] = ''), n.classList.remove(this._borderCellCss[r]));
      gv.some((r) => e.indexOf(r) === -1 && n.style[r])
        ? (n.style.zIndex = this._getCalculatedZIndex(n))
        : ((n.style.zIndex = ''),
          this._needsPositionStickyOnElement && (n.style.position = ''),
          n.classList.remove(this._stickCellCss));
    }
    _addStickyStyle(n, e, i, r) {
      (n.classList.add(this._stickCellCss),
        r && n.classList.add(this._borderCellCss[e]),
        (n.style[e] = `${i}px`),
        (n.style.zIndex = this._getCalculatedZIndex(n)),
        this._needsPositionStickyOnElement &&
          (n.style.cssText += 'position: -webkit-sticky; position: sticky; '));
    }
    _getCalculatedZIndex(n) {
      let e = { top: 100, bottom: 10, left: 1, right: 1 },
        i = 0;
      for (let r of gv) n.style[r] && (i += e[r]);
      return i ? `${i}` : '';
    }
    _getCellWidths(n, e = !0) {
      if (!e && this._cachedCellWidths.length) return this._cachedCellWidths;
      let i = [],
        r = n.children;
      for (let o = 0; o < r.length; o++) {
        let s = r[o];
        i.push(this._retrieveElementSize(s).width);
      }
      return ((this._cachedCellWidths = i), i);
    }
    _getStickyStartColumnPositions(n, e) {
      let i = [],
        r = 0;
      for (let o = 0; o < n.length; o++) e[o] && ((i[o] = r), (r += n[o]));
      return i;
    }
    _getStickyEndColumnPositions(n, e) {
      let i = [],
        r = 0;
      for (let o = n.length; o > 0; o--) e[o] && ((i[o] = r), (r += n[o]));
      return i;
    }
    _retrieveElementSize(n) {
      let e = this._elemSizeCache.get(n);
      if (e) return e;
      let i = n.getBoundingClientRect(),
        r = { width: i.width, height: i.height };
      return (
        this._resizeObserver &&
          (this._elemSizeCache.set(n, r), this._resizeObserver.observe(n, { box: 'border-box' })),
        r
      );
    }
    _updateStickyColumnReplayQueue(n) {
      (this._removeFromStickyColumnReplayQueue(n.rows),
        this._stickyColumnsReplayTimeout || this._updatedStickyColumnsParamsToReplay.push(n));
    }
    _removeFromStickyColumnReplayQueue(n) {
      let e = new Set(n);
      for (let i of this._updatedStickyColumnsParamsToReplay)
        i.rows = i.rows.filter((r) => !e.has(r));
      this._updatedStickyColumnsParamsToReplay = this._updatedStickyColumnsParamsToReplay.filter(
        (i) => !!i.rows.length,
      );
    }
    _updateCachedSizes(n) {
      let e = !1;
      for (let i of n) {
        let r = i.borderBoxSize?.length
          ? { width: i.borderBoxSize[0].inlineSize, height: i.borderBoxSize[0].blockSize }
          : { width: i.contentRect.width, height: i.contentRect.height };
        (r.width !== this._elemSizeCache.get(i.target)?.width && MS(i.target) && (e = !0),
          this._elemSizeCache.set(i.target, r));
      }
      e &&
        this._updatedStickyColumnsParamsToReplay.length &&
        (this._stickyColumnsReplayTimeout && clearTimeout(this._stickyColumnsReplayTimeout),
        (this._stickyColumnsReplayTimeout = setTimeout(() => {
          if (!this._destroyed) {
            for (let i of this._updatedStickyColumnsParamsToReplay)
              this.updateStickyColumns(i.rows, i.stickyStartStates, i.stickyEndStates, !0, !1);
            ((this._updatedStickyColumnsParamsToReplay = []),
              (this._stickyColumnsReplayTimeout = null));
          }
        }, 0)));
    }
  };
function MS(t) {
  return ['cdk-cell', 'cdk-header-cell', 'cdk-footer-cell'].some((n) => t.classList.contains(n));
}
var ml = new g('CDK_SPL');
var Gf = (() => {
    class t {
      viewContainer = u(Be);
      elementRef = u(F);
      constructor() {
        let e = u(Ct);
        ((e._rowOutlet = this), e._outletAssigned());
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'rowOutlet', '']] });
    }
    return t;
  })(),
  Wf = (() => {
    class t {
      viewContainer = u(Be);
      elementRef = u(F);
      constructor() {
        let e = u(Ct);
        ((e._headerRowOutlet = this), e._outletAssigned());
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'headerRowOutlet', '']] });
    }
    return t;
  })(),
  qf = (() => {
    class t {
      viewContainer = u(Be);
      elementRef = u(F);
      constructor() {
        let e = u(Ct);
        ((e._footerRowOutlet = this), e._outletAssigned());
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'footerRowOutlet', '']] });
    }
    return t;
  })(),
  Yf = (() => {
    class t {
      viewContainer = u(Be);
      elementRef = u(F);
      constructor() {
        let e = u(Ct);
        ((e._noDataRowOutlet = this), e._outletAssigned());
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({ type: t, selectors: [['', 'noDataRowOutlet', '']] });
    }
    return t;
  })(),
  Zf = (() => {
    class t {
      _differs = u(Xt);
      _changeDetectorRef = u(Dt);
      _elementRef = u(F);
      _dir = u(kt, { optional: !0 });
      _platform = u(_e);
      _viewRepeater = u(ir);
      _viewportRuler = u(tn);
      _stickyPositioningListener = u(ml, { optional: !0, skipSelf: !0 });
      _document = u(Z);
      _data;
      _onDestroy = new D();
      _renderRows;
      _renderChangeSubscription;
      _columnDefsByName = new Map();
      _rowDefs;
      _headerRowDefs;
      _footerRowDefs;
      _dataDiffer;
      _defaultRowDef;
      _customColumnDefs = new Set();
      _customRowDefs = new Set();
      _customHeaderRowDefs = new Set();
      _customFooterRowDefs = new Set();
      _customNoDataRow;
      _headerRowDefChanged = !0;
      _footerRowDefChanged = !0;
      _stickyColumnStylesNeedReset = !0;
      _forceRecalculateCellWidths = !0;
      _cachedRenderRowsMap = new Map();
      _isNativeHtmlTable;
      _stickyStyler;
      stickyCssClass = 'cdk-table-sticky';
      needsPositionStickyOnElement = !0;
      _isServer;
      _isShowingNoDataRow = !1;
      _hasAllOutlets = !1;
      _hasInitialized = !1;
      _getCellRole() {
        if (this._cellRoleInternal === void 0) {
          let e = this._elementRef.nativeElement.getAttribute('role');
          return e === 'grid' || e === 'treegrid' ? 'gridcell' : 'cell';
        }
        return this._cellRoleInternal;
      }
      _cellRoleInternal = void 0;
      get trackBy() {
        return this._trackByFn;
      }
      set trackBy(e) {
        this._trackByFn = e;
      }
      _trackByFn;
      get dataSource() {
        return this._dataSource;
      }
      set dataSource(e) {
        this._dataSource !== e && this._switchDataSource(e);
      }
      _dataSource;
      get multiTemplateDataRows() {
        return this._multiTemplateDataRows;
      }
      set multiTemplateDataRows(e) {
        ((this._multiTemplateDataRows = e),
          this._rowOutlet &&
            this._rowOutlet.viewContainer.length &&
            (this._forceRenderDataRows(), this.updateStickyColumnStyles()));
      }
      _multiTemplateDataRows = !1;
      get fixedLayout() {
        return this._fixedLayout;
      }
      set fixedLayout(e) {
        ((this._fixedLayout = e),
          (this._forceRecalculateCellWidths = !0),
          (this._stickyColumnStylesNeedReset = !0));
      }
      _fixedLayout = !1;
      contentChanged = new G();
      viewChange = new ut({ start: 0, end: Number.MAX_VALUE });
      _rowOutlet;
      _headerRowOutlet;
      _footerRowOutlet;
      _noDataRowOutlet;
      _contentColumnDefs;
      _contentRowDefs;
      _contentHeaderRowDefs;
      _contentFooterRowDefs;
      _noDataRow;
      _injector = u(Y);
      constructor() {
        (u(new Xi('role'), { optional: !0 }) ||
          this._elementRef.nativeElement.setAttribute('role', 'table'),
          (this._isServer = !this._platform.isBrowser),
          (this._isNativeHtmlTable = this._elementRef.nativeElement.nodeName === 'TABLE'),
          (this._dataDiffer = this._differs
            .find([])
            .create((i, r) => (this.trackBy ? this.trackBy(r.dataIndex, r.data) : r))));
      }
      ngOnInit() {
        (this._setupStickyStyler(),
          this._viewportRuler
            .change()
            .pipe(xe(this._onDestroy))
            .subscribe(() => {
              this._forceRecalculateCellWidths = !0;
            }));
      }
      ngAfterContentInit() {
        this._hasInitialized = !0;
      }
      ngAfterContentChecked() {
        this._canRender() && this._render();
      }
      ngOnDestroy() {
        (this._stickyStyler?.destroy(),
          [
            this._rowOutlet?.viewContainer,
            this._headerRowOutlet?.viewContainer,
            this._footerRowOutlet?.viewContainer,
            this._cachedRenderRowsMap,
            this._customColumnDefs,
            this._customRowDefs,
            this._customHeaderRowDefs,
            this._customFooterRowDefs,
            this._columnDefsByName,
          ].forEach((e) => {
            e?.clear();
          }),
          (this._headerRowDefs = []),
          (this._footerRowDefs = []),
          (this._defaultRowDef = null),
          this._onDestroy.next(),
          this._onDestroy.complete(),
          ho(this.dataSource) && this.dataSource.disconnect(this));
      }
      renderRows() {
        this._renderRows = this._getAllRenderRows();
        let e = this._dataDiffer.diff(this._renderRows);
        if (!e) {
          (this._updateNoDataRow(), this.contentChanged.next());
          return;
        }
        let i = this._rowOutlet.viewContainer;
        (this._viewRepeater.applyChanges(
          e,
          i,
          (r, o, s) => this._getEmbeddedViewArgs(r.item, s),
          (r) => r.item.data,
          (r) => {
            r.operation === Rn.INSERTED &&
              r.context &&
              this._renderCellTemplateForItem(r.record.item.rowDef, r.context);
          },
        ),
          this._updateRowIndexContext(),
          e.forEachIdentityChange((r) => {
            let o = i.get(r.currentIndex);
            o.context.$implicit = r.item.data;
          }),
          this._updateNoDataRow(),
          this.contentChanged.next(),
          this.updateStickyColumnStyles());
      }
      addColumnDef(e) {
        this._customColumnDefs.add(e);
      }
      removeColumnDef(e) {
        this._customColumnDefs.delete(e);
      }
      addRowDef(e) {
        this._customRowDefs.add(e);
      }
      removeRowDef(e) {
        this._customRowDefs.delete(e);
      }
      addHeaderRowDef(e) {
        (this._customHeaderRowDefs.add(e), (this._headerRowDefChanged = !0));
      }
      removeHeaderRowDef(e) {
        (this._customHeaderRowDefs.delete(e), (this._headerRowDefChanged = !0));
      }
      addFooterRowDef(e) {
        (this._customFooterRowDefs.add(e), (this._footerRowDefChanged = !0));
      }
      removeFooterRowDef(e) {
        (this._customFooterRowDefs.delete(e), (this._footerRowDefChanged = !0));
      }
      setNoDataRow(e) {
        this._customNoDataRow = e;
      }
      updateStickyHeaderRowStyles() {
        let e = this._getRenderedRows(this._headerRowOutlet);
        if (this._isNativeHtmlTable) {
          let r = _v(this._headerRowOutlet, 'thead');
          r && (r.style.display = e.length ? '' : 'none');
        }
        let i = this._headerRowDefs.map((r) => r.sticky);
        (this._stickyStyler.clearStickyPositioning(e, ['top']),
          this._stickyStyler.stickRows(e, i, 'top'),
          this._headerRowDefs.forEach((r) => r.resetStickyChanged()));
      }
      updateStickyFooterRowStyles() {
        let e = this._getRenderedRows(this._footerRowOutlet);
        if (this._isNativeHtmlTable) {
          let r = _v(this._footerRowOutlet, 'tfoot');
          r && (r.style.display = e.length ? '' : 'none');
        }
        let i = this._footerRowDefs.map((r) => r.sticky);
        (this._stickyStyler.clearStickyPositioning(e, ['bottom']),
          this._stickyStyler.stickRows(e, i, 'bottom'),
          this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement, i),
          this._footerRowDefs.forEach((r) => r.resetStickyChanged()));
      }
      updateStickyColumnStyles() {
        let e = this._getRenderedRows(this._headerRowOutlet),
          i = this._getRenderedRows(this._rowOutlet),
          r = this._getRenderedRows(this._footerRowOutlet);
        (((this._isNativeHtmlTable && !this._fixedLayout) || this._stickyColumnStylesNeedReset) &&
          (this._stickyStyler.clearStickyPositioning([...e, ...i, ...r], ['left', 'right']),
          (this._stickyColumnStylesNeedReset = !1)),
          e.forEach((o, s) => {
            this._addStickyColumnStyles([o], this._headerRowDefs[s]);
          }),
          this._rowDefs.forEach((o) => {
            let s = [];
            for (let a = 0; a < i.length; a++) this._renderRows[a].rowDef === o && s.push(i[a]);
            this._addStickyColumnStyles(s, o);
          }),
          r.forEach((o, s) => {
            this._addStickyColumnStyles([o], this._footerRowDefs[s]);
          }),
          Array.from(this._columnDefsByName.values()).forEach((o) => o.resetStickyChanged()));
      }
      _outletAssigned() {
        !this._hasAllOutlets &&
          this._rowOutlet &&
          this._headerRowOutlet &&
          this._footerRowOutlet &&
          this._noDataRowOutlet &&
          ((this._hasAllOutlets = !0), this._canRender() && this._render());
      }
      _canRender() {
        return this._hasAllOutlets && this._hasInitialized;
      }
      _render() {
        (this._cacheRowDefs(),
          this._cacheColumnDefs(),
          !this._headerRowDefs.length && !this._footerRowDefs.length && this._rowDefs.length);
        let i =
          this._renderUpdatedColumns() || this._headerRowDefChanged || this._footerRowDefChanged;
        ((this._stickyColumnStylesNeedReset = this._stickyColumnStylesNeedReset || i),
          (this._forceRecalculateCellWidths = i),
          this._headerRowDefChanged &&
            (this._forceRenderHeaderRows(), (this._headerRowDefChanged = !1)),
          this._footerRowDefChanged &&
            (this._forceRenderFooterRows(), (this._footerRowDefChanged = !1)),
          this.dataSource && this._rowDefs.length > 0 && !this._renderChangeSubscription
            ? this._observeRenderChanges()
            : this._stickyColumnStylesNeedReset && this.updateStickyColumnStyles(),
          this._checkStickyStates());
      }
      _getAllRenderRows() {
        let e = [],
          i = this._cachedRenderRowsMap;
        if (((this._cachedRenderRowsMap = new Map()), !this._data)) return e;
        for (let r = 0; r < this._data.length; r++) {
          let o = this._data[r],
            s = this._getRenderRowsForData(o, r, i.get(o));
          this._cachedRenderRowsMap.has(o) || this._cachedRenderRowsMap.set(o, new WeakMap());
          for (let a = 0; a < s.length; a++) {
            let l = s[a],
              c = this._cachedRenderRowsMap.get(l.data);
            (c.has(l.rowDef) ? c.get(l.rowDef).push(l) : c.set(l.rowDef, [l]), e.push(l));
          }
        }
        return e;
      }
      _getRenderRowsForData(e, i, r) {
        return this._getRowDefs(e, i).map((s) => {
          let a = r && r.has(s) ? r.get(s) : [];
          if (a.length) {
            let l = a.shift();
            return ((l.dataIndex = i), l);
          } else return { data: e, rowDef: s, dataIndex: i };
        });
      }
      _cacheColumnDefs() {
        (this._columnDefsByName.clear(),
          hl(this._getOwnDefs(this._contentColumnDefs), this._customColumnDefs).forEach((i) => {
            (this._columnDefsByName.has(i.name), this._columnDefsByName.set(i.name, i));
          }));
      }
      _cacheRowDefs() {
        ((this._headerRowDefs = hl(
          this._getOwnDefs(this._contentHeaderRowDefs),
          this._customHeaderRowDefs,
        )),
          (this._footerRowDefs = hl(
            this._getOwnDefs(this._contentFooterRowDefs),
            this._customFooterRowDefs,
          )),
          (this._rowDefs = hl(this._getOwnDefs(this._contentRowDefs), this._customRowDefs)));
        let e = this._rowDefs.filter((i) => !i.when);
        (!this.multiTemplateDataRows && e.length > 1, (this._defaultRowDef = e[0]));
      }
      _renderUpdatedColumns() {
        let e = (s, a) => {
            let l = !!a.getColumnsDiff();
            return s || l;
          },
          i = this._rowDefs.reduce(e, !1);
        i && this._forceRenderDataRows();
        let r = this._headerRowDefs.reduce(e, !1);
        r && this._forceRenderHeaderRows();
        let o = this._footerRowDefs.reduce(e, !1);
        return (o && this._forceRenderFooterRows(), i || r || o);
      }
      _switchDataSource(e) {
        ((this._data = []),
          ho(this.dataSource) && this.dataSource.disconnect(this),
          this._renderChangeSubscription &&
            (this._renderChangeSubscription.unsubscribe(), (this._renderChangeSubscription = null)),
          e ||
            (this._dataDiffer && this._dataDiffer.diff([]),
            this._rowOutlet && this._rowOutlet.viewContainer.clear()),
          (this._dataSource = e));
      }
      _observeRenderChanges() {
        if (!this.dataSource) return;
        let e;
        (ho(this.dataSource)
          ? (e = this.dataSource.connect(this))
          : ls(this.dataSource)
            ? (e = this.dataSource)
            : Array.isArray(this.dataSource) && (e = jt(this.dataSource)),
          (this._renderChangeSubscription = e.pipe(xe(this._onDestroy)).subscribe((i) => {
            ((this._data = i || []), this.renderRows());
          })));
      }
      _forceRenderHeaderRows() {
        (this._headerRowOutlet.viewContainer.length > 0 &&
          this._headerRowOutlet.viewContainer.clear(),
          this._headerRowDefs.forEach((e, i) => this._renderRow(this._headerRowOutlet, e, i)),
          this.updateStickyHeaderRowStyles());
      }
      _forceRenderFooterRows() {
        (this._footerRowOutlet.viewContainer.length > 0 &&
          this._footerRowOutlet.viewContainer.clear(),
          this._footerRowDefs.forEach((e, i) => this._renderRow(this._footerRowOutlet, e, i)),
          this.updateStickyFooterRowStyles());
      }
      _addStickyColumnStyles(e, i) {
        let r = Array.from(i?.columns || []).map((a) => {
            let l = this._columnDefsByName.get(a);
            return l;
          }),
          o = r.map((a) => a.sticky),
          s = r.map((a) => a.stickyEnd);
        this._stickyStyler.updateStickyColumns(
          e,
          o,
          s,
          !this._fixedLayout || this._forceRecalculateCellWidths,
        );
      }
      _getRenderedRows(e) {
        let i = [];
        for (let r = 0; r < e.viewContainer.length; r++) {
          let o = e.viewContainer.get(r);
          i.push(o.rootNodes[0]);
        }
        return i;
      }
      _getRowDefs(e, i) {
        if (this._rowDefs.length == 1) return [this._rowDefs[0]];
        let r = [];
        if (this.multiTemplateDataRows) r = this._rowDefs.filter((o) => !o.when || o.when(i, e));
        else {
          let o = this._rowDefs.find((s) => s.when && s.when(i, e)) || this._defaultRowDef;
          o && r.push(o);
        }
        return (r.length, r);
      }
      _getEmbeddedViewArgs(e, i) {
        let r = e.rowDef,
          o = { $implicit: e.data };
        return { templateRef: r.template, context: o, index: i };
      }
      _renderRow(e, i, r, o = {}) {
        let s = e.viewContainer.createEmbeddedView(i.template, o, r);
        return (this._renderCellTemplateForItem(i, o), s);
      }
      _renderCellTemplateForItem(e, i) {
        for (let r of this._getCellTemplates(e))
          vi.mostRecentCellOutlet &&
            vi.mostRecentCellOutlet._viewContainer.createEmbeddedView(r, i);
        this._changeDetectorRef.markForCheck();
      }
      _updateRowIndexContext() {
        let e = this._rowOutlet.viewContainer;
        for (let i = 0, r = e.length; i < r; i++) {
          let s = e.get(i).context;
          ((s.count = r),
            (s.first = i === 0),
            (s.last = i === r - 1),
            (s.even = i % 2 === 0),
            (s.odd = !s.even),
            this.multiTemplateDataRows
              ? ((s.dataIndex = this._renderRows[i].dataIndex), (s.renderIndex = i))
              : (s.index = this._renderRows[i].dataIndex));
        }
      }
      _getCellTemplates(e) {
        return !e || !e.columns
          ? []
          : Array.from(e.columns, (i) => {
              let r = this._columnDefsByName.get(i);
              return e.extractCellTemplate(r);
            });
      }
      _forceRenderDataRows() {
        (this._dataDiffer.diff([]), this._rowOutlet.viewContainer.clear(), this.renderRows());
      }
      _checkStickyStates() {
        let e = (i, r) => i || r.hasStickyChanged();
        (this._headerRowDefs.reduce(e, !1) && this.updateStickyHeaderRowStyles(),
          this._footerRowDefs.reduce(e, !1) && this.updateStickyFooterRowStyles(),
          Array.from(this._columnDefsByName.values()).reduce(e, !1) &&
            ((this._stickyColumnStylesNeedReset = !0), this.updateStickyColumnStyles()));
      }
      _setupStickyStyler() {
        let e = this._dir ? this._dir.value : 'ltr';
        ((this._stickyStyler = new Bf(
          this._isNativeHtmlTable,
          this.stickyCssClass,
          this._platform.isBrowser,
          this.needsPositionStickyOnElement,
          e,
          this._stickyPositioningListener,
          this._injector,
        )),
          (this._dir ? this._dir.change : jt()).pipe(xe(this._onDestroy)).subscribe((i) => {
            ((this._stickyStyler.direction = i), this.updateStickyColumnStyles());
          }));
      }
      _getOwnDefs(e) {
        return e.filter((i) => !i._table || i._table === this);
      }
      _updateNoDataRow() {
        let e = this._customNoDataRow || this._noDataRow;
        if (!e) return;
        let i = this._rowOutlet.viewContainer.length === 0;
        if (i === this._isShowingNoDataRow) return;
        let r = this._noDataRowOutlet.viewContainer;
        if (i) {
          let o = r.createEmbeddedView(e.templateRef),
            s = o.rootNodes[0];
          if (o.rootNodes.length === 1 && s?.nodeType === this._document.ELEMENT_NODE) {
            (s.setAttribute('role', 'row'), s.classList.add(...e._contentClassNames));
            let a = s.querySelectorAll(e._cellSelector);
            for (let l = 0; l < a.length; l++) a[l].classList.add(...e._cellClassNames);
          }
        } else r.clear();
        ((this._isShowingNoDataRow = i), this._changeDetectorRef.markForCheck());
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['cdk-table'], ['table', 'cdk-table', '']],
        contentQueries: function (i, r, o) {
          if (
            (i & 1 && (Ce(o, Dv, 5), Ce(o, ur, 5), Ce(o, yl, 5), Ce(o, xo, 5), Ce(o, Uf, 5)), i & 2)
          ) {
            let s;
            (H((s = U())) && (r._noDataRow = s.first),
              H((s = U())) && (r._contentColumnDefs = s),
              H((s = U())) && (r._contentRowDefs = s),
              H((s = U())) && (r._contentHeaderRowDefs = s),
              H((s = U())) && (r._contentFooterRowDefs = s));
          }
        },
        hostAttrs: [1, 'cdk-table'],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && ne('cdk-table-fixed-layout', r.fixedLayout);
        },
        inputs: {
          trackBy: 'trackBy',
          dataSource: 'dataSource',
          multiTemplateDataRows: [2, 'multiTemplateDataRows', 'multiTemplateDataRows', K],
          fixedLayout: [2, 'fixedLayout', 'fixedLayout', K],
        },
        outputs: { contentChanged: 'contentChanged' },
        exportAs: ['cdkTable'],
        features: [
          ie([
            { provide: Ct, useExisting: t },
            { provide: ir, useClass: _i },
            { provide: ml, useValue: null },
          ]),
        ],
        ngContentSelectors: wS,
        decls: 5,
        vars: 2,
        consts: [
          ['role', 'rowgroup'],
          ['headerRowOutlet', ''],
          ['rowOutlet', ''],
          ['noDataRowOutlet', ''],
          ['footerRowOutlet', ''],
        ],
        template: function (i, r) {
          (i & 1 && (Ze(ES), re(0), re(1, 1), X(2, IS, 1, 0), X(3, SS, 7, 0)(4, xS, 4, 0)),
            i & 2 && (I(2), J(r._isServer ? 2 : -1), I(), J(r._isNativeHtmlTable ? 3 : 4)));
        },
        dependencies: [Wf, Gf, Yf, qf],
        styles: [
          `.cdk-table-fixed-layout{table-layout:fixed}
`,
        ],
        encapsulation: 2,
      });
    }
    return t;
  })();
function hl(t, n) {
  return t.concat(Array.from(n));
}
function _v(t, n) {
  let e = n.toUpperCase(),
    i = t.viewContainer.element.nativeElement;
  for (; i; ) {
    let r = i.nodeType === 1 ? i.nodeName : null;
    if (r === e) return i;
    if (r === 'TABLE') break;
    i = i.parentNode;
  }
  return null;
}
var Cv = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({ imports: [po] });
  }
  return t;
})();
var TS = [[['caption']], [['colgroup'], ['col']], '*'],
  RS = ['caption', 'colgroup, col', '*'];
function AS(t, n) {
  t & 1 && re(0, 2);
}
function NS(t, n) {
  t & 1 &&
    (E(0, 'thead', 0),
    He(1, 1),
    S(),
    E(2, 'tbody', 2),
    He(3, 3)(4, 4),
    S(),
    E(5, 'tfoot', 0),
    He(6, 5),
    S());
}
function OS(t, n) {
  t & 1 && He(0, 1)(1, 3)(2, 4)(3, 5);
}
var Ev = (() => {
    class t extends Zf {
      stickyCssClass = 'mat-mdc-table-sticky';
      needsPositionStickyOnElement = !1;
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵcmp = B({
        type: t,
        selectors: [['mat-table'], ['table', 'mat-table', '']],
        hostAttrs: [1, 'mat-mdc-table', 'mdc-data-table__table'],
        hostVars: 2,
        hostBindings: function (i, r) {
          i & 2 && ne('mdc-table-fixed-layout', r.fixedLayout);
        },
        exportAs: ['matTable'],
        features: [
          ie([
            { provide: Zf, useExisting: t },
            { provide: Ct, useExisting: t },
            { provide: ir, useClass: _i },
            { provide: ml, useValue: null },
          ]),
          ce,
        ],
        ngContentSelectors: RS,
        decls: 5,
        vars: 2,
        consts: [
          ['role', 'rowgroup'],
          ['headerRowOutlet', ''],
          ['role', 'rowgroup', 1, 'mdc-data-table__content'],
          ['rowOutlet', ''],
          ['noDataRowOutlet', ''],
          ['footerRowOutlet', ''],
        ],
        template: function (i, r) {
          (i & 1 && (Ze(TS), re(0), re(1, 1), X(2, AS, 1, 0), X(3, NS, 7, 0)(4, OS, 4, 0)),
            i & 2 && (I(2), J(r._isServer ? 2 : -1), I(), J(r._isNativeHtmlTable ? 3 : 4)));
        },
        dependencies: [Wf, Gf, Yf, qf],
        styles: [
          `.mat-mdc-table-sticky{position:sticky !important}mat-table{display:block}mat-header-row{min-height:var(--mat-table-header-container-height, 56px)}mat-row{min-height:var(--mat-table-row-item-container-height, 52px)}mat-footer-row{min-height:var(--mat-table-footer-container-height, 52px)}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{min-width:100%;border:0;border-spacing:0;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color, var(--mat-sys-surface))}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell{text-align:right}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-header-headline-font, var(--mat-sys-title-small-font, Roboto, sans-serif));line-height:var(--mat-table-header-headline-line-height, var(--mat-sys-title-small-line-height));font-size:var(--mat-table-header-headline-size, var(--mat-sys-title-small-size, 14px));font-weight:var(--mat-table-header-headline-weight, var(--mat-sys-title-small-weight, 500))}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-row-item-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-row-item-label-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-row-item-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-footer-supporting-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-footer-supporting-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-footer-supporting-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-footer-supporting-text-weight, var(--mat-sys-body-medium-weight));letter-spacing:var(--mat-table-footer-supporting-text-tracking, var(--mat-sys-body-medium-tracking))}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking, var(--mat-sys-title-small-tracking));font-weight:inherit;line-height:inherit;box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mat-mdc-header-cell{text-align:right}.mdc-data-table__row:last-child>.mat-mdc-header-cell{border-bottom:none}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking));line-height:inherit}.mdc-data-table__row:last-child>.mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking))}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}
`,
        ],
        encapsulation: 2,
      });
    }
    return t;
  })(),
  wv = (() => {
    class t extends gl {
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵdir = b({
        type: t,
        selectors: [['', 'matCellDef', '']],
        features: [ie([{ provide: gl, useExisting: t }]), ce],
      });
    }
    return t;
  })(),
  Iv = (() => {
    class t extends _l {
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵdir = b({
        type: t,
        selectors: [['', 'matHeaderCellDef', '']],
        features: [ie([{ provide: _l, useExisting: t }]), ce],
      });
    }
    return t;
  })();
var Sv = (() => {
    class t extends ur {
      get name() {
        return this._name;
      }
      set name(e) {
        this._setNameInput(e);
      }
      _updateColumnCssClassName() {
        (super._updateColumnCssClassName(),
          this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`));
      }
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵdir = b({
        type: t,
        selectors: [['', 'matColumnDef', '']],
        inputs: { name: [0, 'matColumnDef', 'name'] },
        features: [
          ie([
            { provide: ur, useExisting: t },
            { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: t },
          ]),
          ce,
        ],
      });
    }
    return t;
  })(),
  xv = (() => {
    class t extends vv {
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵdir = b({
        type: t,
        selectors: [['mat-header-cell'], ['th', 'mat-header-cell', '']],
        hostAttrs: [
          'role',
          'columnheader',
          1,
          'mat-mdc-header-cell',
          'mdc-data-table__header-cell',
        ],
        features: [ce],
      });
    }
    return t;
  })();
var Mv = (() => {
  class t extends bv {
    static ɵfac = (() => {
      let e;
      return function (r) {
        return (e || (e = Oe(t)))(r || t);
      };
    })();
    static ɵdir = b({
      type: t,
      selectors: [['mat-cell'], ['td', 'mat-cell', '']],
      hostAttrs: [1, 'mat-mdc-cell', 'mdc-data-table__cell'],
      features: [ce],
    });
  }
  return t;
})();
var Tv = (() => {
  class t extends xo {
    static ɵfac = (() => {
      let e;
      return function (r) {
        return (e || (e = Oe(t)))(r || t);
      };
    })();
    static ɵdir = b({
      type: t,
      selectors: [['', 'matHeaderRowDef', '']],
      inputs: {
        columns: [0, 'matHeaderRowDef', 'columns'],
        sticky: [2, 'matHeaderRowDefSticky', 'sticky', K],
      },
      features: [ie([{ provide: xo, useExisting: t }]), ce],
    });
  }
  return t;
})();
var Rv = (() => {
    class t extends yl {
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵdir = b({
        type: t,
        selectors: [['', 'matRowDef', '']],
        inputs: { columns: [0, 'matRowDefColumns', 'columns'], when: [0, 'matRowDefWhen', 'when'] },
        features: [ie([{ provide: yl, useExisting: t }]), ce],
      });
    }
    return t;
  })(),
  Av = (() => {
    class t extends zf {
      static ɵfac = (() => {
        let e;
        return function (r) {
          return (e || (e = Oe(t)))(r || t);
        };
      })();
      static ɵcmp = B({
        type: t,
        selectors: [['mat-header-row'], ['tr', 'mat-header-row', '']],
        hostAttrs: ['role', 'row', 1, 'mat-mdc-header-row', 'mdc-data-table__header-row'],
        exportAs: ['matHeaderRow'],
        features: [ie([{ provide: zf, useExisting: t }]), ce],
        decls: 1,
        vars: 0,
        consts: [['cdkCellOutlet', '']],
        template: function (i, r) {
          i & 1 && He(0, 0);
        },
        dependencies: [vi],
        encapsulation: 2,
      });
    }
    return t;
  })();
var Nv = (() => {
  class t extends $f {
    static ɵfac = (() => {
      let e;
      return function (r) {
        return (e || (e = Oe(t)))(r || t);
      };
    })();
    static ɵcmp = B({
      type: t,
      selectors: [['mat-row'], ['tr', 'mat-row', '']],
      hostAttrs: ['role', 'row', 1, 'mat-mdc-row', 'mdc-data-table__row'],
      exportAs: ['matRow'],
      features: [ie([{ provide: $f, useExisting: t }]), ce],
      decls: 1,
      vars: 0,
      consts: [['cdkCellOutlet', '']],
      template: function (i, r) {
        i & 1 && He(0, 0);
      },
      dependencies: [vi],
      encapsulation: 2,
    });
  }
  return t;
})();
var Ov = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵmod = j({ type: t });
      static ɵinj = V({ imports: [ye, Cv, ye] });
    }
    return t;
  })(),
  kS = 9007199254740991,
  vl = class extends fo {
    _data;
    _renderData = new ut([]);
    _filter = new ut('');
    _internalPageChanges = new D();
    _renderChangesSubscription = null;
    filteredData;
    get data() {
      return this._data.value;
    }
    set data(n) {
      ((n = Array.isArray(n) ? n : []),
        this._data.next(n),
        this._renderChangesSubscription || this._filterData(n));
    }
    get filter() {
      return this._filter.value;
    }
    set filter(n) {
      (this._filter.next(n), this._renderChangesSubscription || this._filterData(this.data));
    }
    get sort() {
      return this._sort;
    }
    set sort(n) {
      ((this._sort = n), this._updateChangeSubscription());
    }
    _sort;
    get paginator() {
      return this._paginator;
    }
    set paginator(n) {
      ((this._paginator = n), this._updateChangeSubscription());
    }
    _paginator;
    sortingDataAccessor = (n, e) => {
      let i = n[e];
      if (Ju(i)) {
        let r = Number(i);
        return r < kS ? r : i;
      }
      return i;
    };
    sortData = (n, e) => {
      let i = e.active,
        r = e.direction;
      return !i || r == ''
        ? n
        : n.sort((o, s) => {
            let a = this.sortingDataAccessor(o, i),
              l = this.sortingDataAccessor(s, i),
              c = typeof a,
              d = typeof l;
            c !== d && (c === 'number' && (a += ''), d === 'number' && (l += ''));
            let f = 0;
            return (
              a != null && l != null
                ? a > l
                  ? (f = 1)
                  : a < l && (f = -1)
                : a != null
                  ? (f = 1)
                  : l != null && (f = -1),
              f * (r == 'asc' ? 1 : -1)
            );
          });
    };
    filterPredicate = (n, e) => {
      let i = e.trim().toLowerCase();
      return Object.values(n).some((r) => `${r}`.toLowerCase().includes(i));
    };
    constructor(n = []) {
      (super(), (this._data = new ut(n)), this._updateChangeSubscription());
    }
    _updateChangeSubscription() {
      let n = this._sort ? It(this._sort.sortChange, this._sort.initialized) : jt(null),
        e = this._paginator
          ? It(this._paginator.page, this._internalPageChanges, this._paginator.initialized)
          : jt(null),
        i = this._data,
        r = Bn([i, this._filter]).pipe(ue(([a]) => this._filterData(a))),
        o = Bn([r, n]).pipe(ue(([a]) => this._orderData(a))),
        s = Bn([o, e]).pipe(ue(([a]) => this._pageData(a)));
      (this._renderChangesSubscription?.unsubscribe(),
        (this._renderChangesSubscription = s.subscribe((a) => this._renderData.next(a))));
    }
    _filterData(n) {
      return (
        (this.filteredData =
          this.filter == null || this.filter === ''
            ? n
            : n.filter((e) => this.filterPredicate(e, this.filter))),
        this.paginator && this._updatePaginator(this.filteredData.length),
        this.filteredData
      );
    }
    _orderData(n) {
      return this.sort ? this.sortData(n.slice(), this.sort) : n;
    }
    _pageData(n) {
      if (!this.paginator) return n;
      let e = this.paginator.pageIndex * this.paginator.pageSize;
      return n.slice(e, e + this.paginator.pageSize);
    }
    _updatePaginator(n) {
      Promise.resolve().then(() => {
        let e = this.paginator;
        if (e && ((e.length = n), e.pageIndex > 0)) {
          let i = Math.ceil(e.length / e.pageSize) - 1 || 0,
            r = Math.min(e.pageIndex, i);
          r !== e.pageIndex && ((e.pageIndex = r), this._internalPageChanges.next());
        }
      });
    }
    connect() {
      return (
        this._renderChangesSubscription || this._updateChangeSubscription(),
        this._renderData
      );
    }
    disconnect() {
      (this._renderChangesSubscription?.unsubscribe(), (this._renderChangesSubscription = null));
    }
  };
var PS = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['ng-component']],
        hostAttrs: ['cdk-text-field-style-loader', ''],
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `textarea.cdk-textarea-autosize{resize:none}textarea.cdk-textarea-autosize-measuring{padding:2px 0 !important;box-sizing:content-box !important;height:auto !important;overflow:hidden !important}textarea.cdk-textarea-autosize-measuring-firefox{padding:2px 0 !important;box-sizing:content-box !important;height:0 !important}@keyframes cdk-text-field-autofill-start{/*!*/}@keyframes cdk-text-field-autofill-end{/*!*/}.cdk-text-field-autofill-monitored:-webkit-autofill{animation:cdk-text-field-autofill-start 0s 1ms}.cdk-text-field-autofill-monitored:not(:-webkit-autofill){animation:cdk-text-field-autofill-end 0s 1ms}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  LS = { passive: !0 },
  kv = (() => {
    class t {
      _platform = u(_e);
      _ngZone = u(R);
      _renderer = u(Ve).createRenderer(null, null);
      _styleLoader = u(Nt);
      _monitoredElements = new Map();
      constructor() {}
      monitor(e) {
        if (!this._platform.isBrowser) return Vn;
        this._styleLoader.load(PS);
        let i = Jt(e),
          r = this._monitoredElements.get(i);
        if (r) return r.subject;
        let o = new D(),
          s = 'cdk-text-field-autofilled',
          a = (c) => {
            c.animationName === 'cdk-text-field-autofill-start' && !i.classList.contains(s)
              ? (i.classList.add(s),
                this._ngZone.run(() => o.next({ target: c.target, isAutofilled: !0 })))
              : c.animationName === 'cdk-text-field-autofill-end' &&
                i.classList.contains(s) &&
                (i.classList.remove(s),
                this._ngZone.run(() => o.next({ target: c.target, isAutofilled: !1 })));
          },
          l = this._ngZone.runOutsideAngular(
            () => (
              i.classList.add('cdk-text-field-autofill-monitored'),
              this._renderer.listen(i, 'animationstart', a, LS)
            ),
          );
        return (this._monitoredElements.set(i, { subject: o, unlisten: l }), o);
      }
      stopMonitoring(e) {
        let i = Jt(e),
          r = this._monitoredElements.get(i);
        r &&
          (r.unlisten(),
          r.subject.complete(),
          i.classList.remove('cdk-text-field-autofill-monitored'),
          i.classList.remove('cdk-text-field-autofilled'),
          this._monitoredElements.delete(i));
      }
      ngOnDestroy() {
        this._monitoredElements.forEach((e, i) => this.stopMonitoring(i));
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵprov = y({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })();
var Fv = (() => {
  class t {
    static ɵfac = function (i) {
      return new (i || t)();
    };
    static ɵmod = j({ type: t });
    static ɵinj = V({});
  }
  return t;
})();
var Pv = new g('MAT_INPUT_VALUE_ACCESSOR');
var VS = ['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'],
  jS = new g('MAT_INPUT_CONFIG'),
  Lv = (() => {
    class t {
      _elementRef = u(F);
      _platform = u(_e);
      ngControl = u(cr, { optional: !0, self: !0 });
      _autofillMonitor = u(kv);
      _ngZone = u(R);
      _formField = u(nr, { optional: !0 });
      _renderer = u(We);
      _uid = u(lt).getId('mat-input-');
      _previousNativeValue;
      _inputValueAccessor;
      _signalBasedValueAccessor;
      _previousPlaceholder;
      _errorStateTracker;
      _config = u(jS, { optional: !0 });
      _cleanupIosKeyup;
      _cleanupWebkitWheel;
      _isServer;
      _isNativeSelect;
      _isTextarea;
      _isInFormField;
      focused = !1;
      stateChanges = new D();
      controlType = 'mat-input';
      autofilled = !1;
      get disabled() {
        return this._disabled;
      }
      set disabled(e) {
        ((this._disabled = en(e)), this.focused && ((this.focused = !1), this.stateChanges.next()));
      }
      _disabled = !1;
      get id() {
        return this._id;
      }
      set id(e) {
        this._id = e || this._uid;
      }
      _id;
      placeholder;
      name;
      get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(ar.required) ?? !1;
      }
      set required(e) {
        this._required = en(e);
      }
      _required;
      get type() {
        return this._type;
      }
      set type(e) {
        ((this._type = e || 'text'),
          this._validateType(),
          !this._isTextarea &&
            df().has(this._type) &&
            (this._elementRef.nativeElement.type = this._type));
      }
      _type = 'text';
      get errorStateMatcher() {
        return this._errorStateTracker.matcher;
      }
      set errorStateMatcher(e) {
        this._errorStateTracker.matcher = e;
      }
      userAriaDescribedBy;
      get value() {
        return this._signalBasedValueAccessor
          ? this._signalBasedValueAccessor.value()
          : this._inputValueAccessor.value;
      }
      set value(e) {
        e !== this.value &&
          (this._signalBasedValueAccessor
            ? this._signalBasedValueAccessor.value.set(e)
            : (this._inputValueAccessor.value = e),
          this.stateChanges.next());
      }
      get readonly() {
        return this._readonly;
      }
      set readonly(e) {
        this._readonly = en(e);
      }
      _readonly = !1;
      disabledInteractive;
      get errorState() {
        return this._errorStateTracker.errorState;
      }
      set errorState(e) {
        this._errorStateTracker.errorState = e;
      }
      _neverEmptyInputTypes = [
        'date',
        'datetime',
        'datetime-local',
        'month',
        'time',
        'week',
      ].filter((e) => df().has(e));
      constructor() {
        let e = u(Io, { optional: !0 }),
          i = u(So, { optional: !0 }),
          r = u(cl),
          o = u(Pv, { optional: !0, self: !0 }),
          s = this._elementRef.nativeElement,
          a = s.nodeName.toLowerCase();
        (o
          ? qt(o.value)
            ? (this._signalBasedValueAccessor = o)
            : (this._inputValueAccessor = o)
          : (this._inputValueAccessor = s),
          (this._previousNativeValue = this.value),
          (this.id = this.id),
          this._platform.IOS &&
            this._ngZone.runOutsideAngular(() => {
              this._cleanupIosKeyup = this._renderer.listen(s, 'keyup', this._iOSKeyupListener);
            }),
          (this._errorStateTracker = new dr(r, this.ngControl, i, e, this.stateChanges)),
          (this._isServer = !this._platform.isBrowser),
          (this._isNativeSelect = a === 'select'),
          (this._isTextarea = a === 'textarea'),
          (this._isInFormField = !!this._formField),
          (this.disabledInteractive = this._config?.disabledInteractive || !1),
          this._isNativeSelect &&
            (this.controlType = s.multiple ? 'mat-native-select-multiple' : 'mat-native-select'),
          this._signalBasedValueAccessor &&
            Rt(() => {
              (this._signalBasedValueAccessor.value(), this.stateChanges.next());
            }));
      }
      ngAfterViewInit() {
        this._platform.isBrowser &&
          this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((e) => {
            ((this.autofilled = e.isAutofilled), this.stateChanges.next());
          });
      }
      ngOnChanges() {
        this.stateChanges.next();
      }
      ngOnDestroy() {
        (this.stateChanges.complete(),
          this._platform.isBrowser &&
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),
          this._cleanupIosKeyup?.(),
          this._cleanupWebkitWheel?.());
      }
      ngDoCheck() {
        (this.ngControl &&
          (this.updateErrorState(),
          this.ngControl.disabled !== null &&
            this.ngControl.disabled !== this.disabled &&
            ((this.disabled = this.ngControl.disabled), this.stateChanges.next())),
          this._dirtyCheckNativeValue(),
          this._dirtyCheckPlaceholder());
      }
      focus(e) {
        this._elementRef.nativeElement.focus(e);
      }
      updateErrorState() {
        this._errorStateTracker.updateErrorState();
      }
      _focusChanged(e) {
        if (e !== this.focused) {
          if (!this._isNativeSelect && e && this.disabled && this.disabledInteractive) {
            let i = this._elementRef.nativeElement;
            i.type === 'number'
              ? ((i.type = 'text'), i.setSelectionRange(0, 0), (i.type = 'number'))
              : i.setSelectionRange(0, 0);
          }
          ((this.focused = e), this.stateChanges.next());
        }
      }
      _onInput() {}
      _dirtyCheckNativeValue() {
        let e = this._elementRef.nativeElement.value;
        this._previousNativeValue !== e &&
          ((this._previousNativeValue = e), this.stateChanges.next());
      }
      _dirtyCheckPlaceholder() {
        let e = this._getPlaceholder();
        if (e !== this._previousPlaceholder) {
          let i = this._elementRef.nativeElement;
          ((this._previousPlaceholder = e),
            e ? i.setAttribute('placeholder', e) : i.removeAttribute('placeholder'));
        }
      }
      _getPlaceholder() {
        return this.placeholder || null;
      }
      _validateType() {
        VS.indexOf(this._type) > -1;
      }
      _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
      }
      _isBadInput() {
        let e = this._elementRef.nativeElement.validity;
        return e && e.badInput;
      }
      get empty() {
        return (
          !this._isNeverEmpty() &&
          !this._elementRef.nativeElement.value &&
          !this._isBadInput() &&
          !this.autofilled
        );
      }
      get shouldLabelFloat() {
        if (this._isNativeSelect) {
          let e = this._elementRef.nativeElement,
            i = e.options[0];
          return (
            this.focused || e.multiple || !this.empty || !!(e.selectedIndex > -1 && i && i.label)
          );
        } else return (this.focused && !this.disabled) || !this.empty;
      }
      get describedByIds() {
        return this._elementRef.nativeElement.getAttribute('aria-describedby')?.split(' ') || [];
      }
      setDescribedByIds(e) {
        let i = this._elementRef.nativeElement;
        e.length
          ? i.setAttribute('aria-describedby', e.join(' '))
          : i.removeAttribute('aria-describedby');
      }
      onContainerClick() {
        this.focused || this.focus();
      }
      _isInlineSelect() {
        let e = this._elementRef.nativeElement;
        return this._isNativeSelect && (e.multiple || e.size > 1);
      }
      _iOSKeyupListener = (e) => {
        let i = e.target;
        !i.value &&
          i.selectionStart === 0 &&
          i.selectionEnd === 0 &&
          (i.setSelectionRange(1, 1), i.setSelectionRange(0, 0));
      };
      _getReadonlyAttribute() {
        return this._isNativeSelect
          ? null
          : this.readonly || (this.disabled && this.disabledInteractive)
            ? 'true'
            : null;
      }
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵdir = b({
        type: t,
        selectors: [
          ['input', 'matInput', ''],
          ['textarea', 'matInput', ''],
          ['select', 'matNativeControl', ''],
          ['input', 'matNativeControl', ''],
          ['textarea', 'matNativeControl', ''],
        ],
        hostAttrs: [1, 'mat-mdc-input-element'],
        hostVars: 21,
        hostBindings: function (i, r) {
          (i & 1 &&
            me('focus', function () {
              return r._focusChanged(!0);
            })('blur', function () {
              return r._focusChanged(!1);
            })('input', function () {
              return r._onInput();
            }),
            i & 2 &&
              (En('id', r.id)('disabled', r.disabled && !r.disabledInteractive)(
                'required',
                r.required,
              ),
              ke('name', r.name || null)('readonly', r._getReadonlyAttribute())(
                'aria-disabled',
                r.disabled && r.disabledInteractive ? 'true' : null,
              )('aria-invalid', r.empty && r.required ? null : r.errorState)(
                'aria-required',
                r.required,
              )('id', r.id),
              ne('mat-input-server', r._isServer)(
                'mat-mdc-form-field-textarea-control',
                r._isInFormField && r._isTextarea,
              )('mat-mdc-form-field-input-control', r._isInFormField)(
                'mat-mdc-input-disabled-interactive',
                r.disabledInteractive,
              )('mdc-text-field__input', r._isInFormField)(
                'mat-mdc-native-select-inline',
                r._isInlineSelect(),
              )));
        },
        inputs: {
          disabled: 'disabled',
          id: 'id',
          placeholder: 'placeholder',
          name: 'name',
          required: 'required',
          type: 'type',
          errorStateMatcher: 'errorStateMatcher',
          userAriaDescribedBy: [0, 'aria-describedby', 'userAriaDescribedBy'],
          value: 'value',
          readonly: 'readonly',
          disabledInteractive: [2, 'disabledInteractive', 'disabledInteractive', K],
        },
        exportAs: ['matInput'],
        features: [ie([{ provide: tr, useExisting: t }]), Ne],
      });
    }
    return t;
  })(),
  Vv = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵmod = j({ type: t });
      static ɵinj = V({ imports: [ye, Pt, Pt, Fv, ye] });
    }
    return t;
  })();
var bl = class t {
  intlService = u(At);
  matFormField = u(Ft);
  constructor() {
    Rt(() => {
      (this.updatePrefix(), this.updateSuffix());
    });
  }
  ngAfterContentInit() {
    let n = new Va();
    ((n._isText = !0), this.matFormField._prefixChildren.reset([n]));
    let e = new ja();
    ((e._isText = !0),
      this.matFormField._suffixChildren.reset([e]),
      this.matFormField._initializePrefixAndSuffix(),
      Promise.resolve().then(() => {
        (this.updatePrefix(), this.updateSuffix());
      }));
  }
  updatePrefix() {
    let { currencyIndex: n, integerIndex: e, parts: i } = this.getParts();
    this.matFormField._textPrefixContainer !== void 0 &&
      (this.matFormField._textPrefixContainer.nativeElement.innerText =
        0 <= n && n < e ? i[n].value : '');
  }
  updateSuffix() {
    let { currencyIndex: n, integerIndex: e, parts: i } = this.getParts();
    this.matFormField._textSuffixContainer !== void 0 &&
      (this.matFormField._textSuffixContainer.nativeElement.innerText =
        0 <= e && e < n ? i[n].value : '');
  }
  getParts() {
    let n = yi(0, this.intlService.locale(), this.intlService.currency()),
      e = n.findIndex((r) => r.type === 'currency'),
      i = n.findIndex((r) => r.type === 'integer');
    return { currencyIndex: e, integerIndex: i, parts: n };
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵdir = b({ type: t, selectors: [['mat-form-field', 'currency', '']] });
};
var Dl = (() => {
    class t {
      get vertical() {
        return this._vertical;
      }
      set vertical(e) {
        this._vertical = en(e);
      }
      _vertical = !1;
      get inset() {
        return this._inset;
      }
      set inset(e) {
        this._inset = en(e);
      }
      _inset = !1;
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵcmp = B({
        type: t,
        selectors: [['mat-divider']],
        hostAttrs: ['role', 'separator', 1, 'mat-divider'],
        hostVars: 7,
        hostBindings: function (i, r) {
          i & 2 &&
            (ke('aria-orientation', r.vertical ? 'vertical' : 'horizontal'),
            ne('mat-divider-vertical', r.vertical)('mat-divider-horizontal', !r.vertical)(
              'mat-divider-inset',
              r.inset,
            ));
        },
        inputs: { vertical: 'vertical', inset: 'inset' },
        decls: 0,
        vars: 0,
        template: function (i, r) {},
        styles: [
          `.mat-divider{display:block;margin:0;border-top-style:solid;border-top-color:var(--mat-divider-color, var(--mat-sys-outline-variant));border-top-width:var(--mat-divider-width, 1px)}.mat-divider.mat-divider-vertical{border-top:0;border-right-style:solid;border-right-color:var(--mat-divider-color, var(--mat-sys-outline-variant));border-right-width:var(--mat-divider-width, 1px)}.mat-divider.mat-divider-inset{margin-left:80px}[dir=rtl] .mat-divider.mat-divider-inset{margin-left:auto;margin-right:80px}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return t;
  })(),
  jv = (() => {
    class t {
      static ɵfac = function (i) {
        return new (i || t)();
      };
      static ɵmod = j({ type: t });
      static ɵinj = V({ imports: [ye, ye] });
    }
    return t;
  })();
var US = ['input'];
function zS(t, n) {
  t & 1 && (E(0, 'th', 11), ge(1, 'Item'), S());
}
function $S(t, n) {
  if ((t & 1 && (E(0, 'td', 12), ge(1), S()), t & 2)) {
    let e = n.$implicit;
    (I(), Ke(e.item));
  }
}
function GS(t, n) {
  t & 1 && (E(0, 'th', 11), ge(1, 'Cost'), S());
}
function WS(t, n) {
  if ((t & 1 && (E(0, 'td', 12), ge(1), _u(2, 'currency'), S()), t & 2)) {
    let e = n.$implicit;
    (I(), Ke(yu(2, 1, e.cost)));
  }
}
function qS(t, n) {
  t & 1 && Ie(0, 'tr', 13);
}
function YS(t, n) {
  t & 1 && Ie(0, 'tr', 14);
}
function ZS(t, n) {
  if ((t & 1 && (E(0, 'div', 10)(1, 'b'), ge(2), S()()), t & 2)) {
    let e = fe();
    (I(2), Qt('Total: ', e.getTotalCost()));
  }
}
var KS = [
    { item: 'Beach ball', cost: 4 },
    { item: 'Towel', cost: 5 },
    { item: 'Frisbee', cost: 2 },
    { item: 'Sunscreen', cost: 4 },
    { item: 'Cooler', cost: 25 },
    { item: 'Swim suit', cost: 15 },
  ],
  Cl = class t {
    displayedColumns = ['item', 'cost'];
    dataSource;
    inputElement;
    intlService = u(At);
    constructor() {
      ((this.dataSource = new vl(KS)),
        (this.dataSource.filterPredicate = (n, e) => n.cost >= parseInt(e, 10)));
    }
    getTotalCost() {
      return yi(
        this.dataSource.filteredData.map((n) => n.cost).reduce((n, e) => n + e, 0),
        this.intlService.locale(),
        this.intlService.currency(),
      )
        .map((n) => n.value)
        .join('');
    }
    isTotalCostNotZero() {
      return (
        yi(0, this.intlService.locale(), this.intlService.currency())
          .map((n) => n.value)
          .join('') !== this.getTotalCost()
      );
    }
    applyFilter() {
      this.dataSource.filter = this.inputElement.nativeElement.value;
    }
    static ɵfac = function (e) {
      return new (e || t)();
    };
    static ɵcmp = B({
      type: t,
      selectors: [['app-transactions']],
      viewQuery: function (e, i) {
        if ((e & 1 && be(US, 5), e & 2)) {
          let r;
          H((r = U())) && (i.inputElement = r.first);
        }
      },
      decls: 16,
      vars: 4,
      consts: [
        ['input', ''],
        ['currency', '', 'floatLabel', 'always'],
        ['matInput', '', 3, 'keyup'],
        ['mat-table', '', 1, 'mat-elevation-z8', 3, 'dataSource'],
        ['matColumnDef', 'item'],
        ['mat-header-cell', '', 4, 'matHeaderCellDef'],
        ['mat-cell', '', 4, 'matCellDef'],
        ['matColumnDef', 'cost'],
        ['mat-header-row', '', 4, 'matHeaderRowDef'],
        ['mat-row', '', 4, 'matRowDef', 'matRowDefColumns'],
        [2, 'margin', '16px'],
        ['mat-header-cell', ''],
        ['mat-cell', ''],
        ['mat-header-row', ''],
        ['mat-row', ''],
      ],
      template: function (e, i) {
        if (e & 1) {
          let r = Cn();
          (E(0, 'mat-form-field', 1)(1, 'mat-label'),
            ge(2, 'Minimum cost'),
            S(),
            E(3, 'input', 2, 0),
            me('keyup', function () {
              return (rt(r), ot(i.applyFilter()));
            }),
            S()(),
            E(5, 'table', 3),
            bn(6, 4),
            qe(7, zS, 2, 0, 'th', 5)(8, $S, 2, 1, 'td', 6),
            Dn(),
            bn(9, 7),
            qe(10, GS, 2, 0, 'th', 5)(11, WS, 3, 3, 'td', 6),
            Dn(),
            qe(12, qS, 1, 0, 'tr', 8)(13, YS, 1, 0, 'tr', 9),
            S(),
            Ie(14, 'mat-divider'),
            X(15, ZS, 3, 1, 'div', 10));
        }
        e & 2 &&
          (I(5),
          de('dataSource', i.dataSource.filteredData),
          I(7),
          de('matHeaderRowDef', i.displayedColumns),
          I(),
          de('matRowDefColumns', i.displayedColumns),
          I(2),
          J(i.isTotalCostNotZero() ? 15 : -1));
      },
      dependencies: [
        Ov,
        Ev,
        Iv,
        Tv,
        Sv,
        wv,
        Rv,
        xv,
        Mv,
        Av,
        Nv,
        Pt,
        Ft,
        Tn,
        Vv,
        Lv,
        jv,
        Dl,
        bl,
        fl,
      ],
      styles: [
        'table[_ngcontent-%COMP%]{width:100%}tr.mat-mdc-footer-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{font-weight:700}',
      ],
    });
  };
var El = class t {
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = B({
    type: t,
    selectors: [['app-root']],
    decls: 3,
    vars: 0,
    template: function (e, i) {
      e & 1 && Ie(0, 'app-intl')(1, 'mat-divider')(2, 'app-transactions');
    },
    dependencies: [Dl, ul, Cl],
    encapsulation: 2,
  });
};
Zu(El, w_).catch((t) => console.error(t));
