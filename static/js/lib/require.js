/*
 RequireJS 2.1.9 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
let requirejs; let require; let define;
(function (Z) {
  function H(b) { return L.call(b) === '[object Function]'; } function I(b) { return L.call(b) === '[object Array]'; } function y(b, c) { if (b) { let e; for (e = 0; e < b.length && (!b[e] || !c(b[e], e, b)); e += 1); } } function M(b, c) { if (b) { let e; for (e = b.length - 1; e > -1 && (!b[e] || !c(b[e], e, b)); e -= 1); } } function t(b, c) { return ga.call(b, c); } function l(b, c) { return t(b, c) && b[c]; } function F(b, c) { for (const e in b) if (t(b, e) && c(b[e], e)) break; } function Q(b, c, e, h) {
    c && F(c, (c, j) => {
      if (e || !t(b, j)) {
        h && typeof c !== 'string' ? (b[j] || (b[j] = {}), Q(b[j],
          c, e, h)) : b[j] = c;
      }
    }); return b;
  } function u(b, c) { return function () { return c.apply(b, arguments); }; } function aa(b) { throw b; } function ba(b) { if (!b) return b; let c = Z; y(b.split('.'), (b) => { c = c[b]; }); return c; } function A(b, c, e, h) { c = Error(`${c}\nhttp://requirejs.org/docs/errors.html#${b}`); c.requireType = b; c.requireModules = h; e && (c.originalError = e); return c; } function ha(b) {
    function c(a, f, b) {
      let d; let m; let c; let g; let e; let h; let j; let i = f && f.split('/'); d = i; const n = k.map; const p = n && n['*']; if (a && a.charAt(0) === '.') {
        if (f) {
          d = l(k.pkgs, f) ? i = [f] : i.slice(0, i.length
- 1); f = a = d.concat(a.split('/')); for (d = 0; f[d]; d += 1) if (m = f[d], m === '.')f.splice(d, 1), d -= 1; else if (m === '..') if (d === 1 && (f[2] === '..' || f[0] === '..')) break; else d > 0 && (f.splice(d - 1, 2), d -= 2); d = l(k.pkgs, f = a[0]); a = a.join('/'); d && a === `${f}/${d.main}` && (a = f);
        } else a.indexOf('./') === 0 && (a = a.substring(2));
      } if (b && n && (i || p)) {
        f = a.split('/'); for (d = f.length; d > 0; d -= 1) { c = f.slice(0, d).join('/'); if (i) for (m = i.length; m > 0; m -= 1) if (b = l(n, i.slice(0, m).join('/'))) if (b = l(b, c)) { g = b; e = d; break; } if (g) break; !h && (p && l(p, c)) && (h = l(p, c), j = d); }!g
&& h && (g = h, e = j); g && (f.splice(0, e, g), a = f.join('/'));
      } return a;
    } function e(a) { z && y(document.getElementsByTagName('script'), (f) => { if (f.getAttribute('data-requiremodule') === a && f.getAttribute('data-requirecontext') === i.contextName) return f.parentNode.removeChild(f), !0; }); } function h(a) { const f = l(k.paths, a); if (f && I(f) && f.length > 1) return f.shift(), i.require.undef(a), i.require([a]), !0; } function $(a) { let f; const b = a ? a.indexOf('!') : -1; b > -1 && (f = a.substring(0, b), a = a.substring(b + 1, a.length)); return [f, a]; } function n(a, f,
      b, d) {
      let m; let B; let g = null; const e = f ? f.name : null; const h = a; let j = !0; let k = ''; a || (j = !1, a = `_@r${L += 1}`); a = $(a); g = a[0]; a = a[1]; g && (g = c(g, e, d), B = l(r, g)); a && (g ? k = B && B.normalize ? B.normalize(a, a => c(a, e, d)) : c(a, e, d) : (k = c(a, e, d), a = $(k), g = a[0], k = a[1], b = !0, m = i.nameToUrl(k))); b = g && !B && !b ? `_unnormalized${M += 1}` : ''; return {
        prefix: g, name: k, parentMap: f, unnormalized: !!b, url: m, originalName: h, isDefine: j, id: (g ? `${g}!${k}` : k) + b,
      };
    } function q(a) { const f = a.id; let b = l(p, f); b || (b = p[f] = new i.Module(a)); return b; } function s(a, f, b) {
      const d = a.id; let m = l(p,
        d); if (t(r, d) && (!m || m.defineEmitComplete))f === 'defined' && b(r[d]); else if (m = q(a), m.error && f === 'error')b(m.error); else m.on(f, b);
    } function v(a, f) { const b = a.requireModules; let d = !1; if (f)f(a); else if (y(b, (f) => { if (f = l(p, f))f.error = a, f.events.error && (d = !0, f.emit('error', a)); }), !d)j.onError(a); } function w() { R.length && (ia.apply(G, [G.length - 1, 0].concat(R)), R = []); } function x(a) { delete p[a]; delete T[a]; } function E(a, f, b) {
      const d = a.map.id; a.error ? a.emit('error', a.error) : (f[d] = !0, y(a.depMaps, (d, c) => {
        const g = d.id;


        const e = l(p, g); e && (!a.depMatched[c] && !b[g]) && (l(f, g) ? (a.defineDep(c, r[g]), a.check()) : E(e, f, b));
      }), b[d] = !0);
    } function C() {
      let a; let f; let b; let d; const m = (b = 1E3 * k.waitSeconds) && i.startTime + b < (new Date()).getTime(); const c = []; const g = []; let j = !1; let l = !0; if (!U) {
        U = !0; F(T, (b) => { a = b.map; f = a.id; if (b.enabled && (a.isDefine || g.push(b), !b.error)) if (!b.inited && m)h(f) ? j = d = !0 : (c.push(f), e(f)); else if (!b.inited && (b.fetched && a.isDefine) && (j = !0, !a.prefix)) return l = !1; }); if (m && c.length) {
          return b = A('timeout', `Load timeout for modules: ${c}`, null, c), b.contextName = i.contextName, v(b);
        } l && y(g, (a) => { E(a, {}, {}); }); if ((!m || d) && j) if ((z || da) && !V)V = setTimeout(() => { V = 0; C(); }, 50); U = !1;
      }
    } function D(a) { t(r, a[0]) || q(n(a[0], null, !0)).init(a[1], a[2]); } function J(a) { var a = a.currentTarget || a.srcElement; let b = i.onScriptLoad; a.detachEvent && !W ? a.detachEvent('onreadystatechange', b) : a.removeEventListener('load', b, !1); b = i.onScriptError; (!a.detachEvent || W) && a.removeEventListener('error', b, !1); return { node: a, id: a && a.getAttribute('data-requiremodule') }; } function K() {
      let a; for (w(); G.length;) {
        a = G.shift(); if (a[0] === null) return v(A('mismatch', `Mismatched anonymous define() module: ${a[a.length - 1]}`)); D(a);
      }
    } let U; let X; let i; let N; let V; var k = {
      waitSeconds: 7, baseUrl: './', paths: {}, pkgs: {}, shim: {}, config: {},
    }; var p = {}; var T = {}; const Y = {}; var G = []; var r = {}; const S = {}; var L = 1; var M = 1; N = {
      require(a) { return a.require ? a.require : a.require = i.makeRequire(a.map); },
      exports(a) { a.usingExports = !0; if (a.map.isDefine) return a.exports ? a.exports : a.exports = r[a.map.id] = {}; },
      module(a) {
        return a.module ? a.module : a.module = {
          id: a.map.id,
          uri: a.map.url,
          config() {
            const b = l(k.pkgs, a.map.id); return (b ? l(k.config, `${a.map.id}/${b.main}`) : l(k.config, a.map.id)) || {};
          },
          exports: r[a.map.id],
        };
      },
    }; X = function (a) { this.events = l(Y, a.id) || {}; this.map = a; this.shim = l(k.shim, a.id); this.depExports = []; this.depMaps = []; this.depMatched = []; this.pluginMaps = {}; this.depCount = 0; }; X.prototype = {
      init(a, b, c, d) {
        d = d || {}; if (!this.inited) {
          this.factory = b; if (c) this.on('error', c); else this.events.error && (c = u(this, function (a) { this.emit('error', a); })); this.depMaps = a && a.slice(0); this.errback = c; this.inited = !0;
          this.ignore = d.ignore; d.enabled || this.enabled ? this.enable() : this.check();
        }
      },
      defineDep(a, b) { this.depMatched[a] || (this.depMatched[a] = !0, this.depCount -= 1, this.depExports[a] = b); },
      fetch() { if (!this.fetched) { this.fetched = !0; i.startTime = (new Date()).getTime(); const a = this.map; if (this.shim)i.makeRequire(this.map, { enableBuildCallback: !0 })(this.shim.deps || [], u(this, function () { return a.prefix ? this.callPlugin() : this.load(); })); else return a.prefix ? this.callPlugin() : this.load(); } },
      load() {
        const a = this.map.url; S[a] || (S[a] = !0, i.load(this.map.id, a));
      },
      check() {
        if (this.enabled && !this.enabling) {
          let a; let b; const c = this.map.id; b = this.depExports; let d = this.exports; const m = this.factory; if (this.inited) {
            if (this.error) this.emit('error', this.error); else if (!this.defining) {
              this.defining = !0; if (this.depCount < 1 && !this.defined) {
                if (H(m)) {
                  if (this.events.error && this.map.isDefine || j.onError !== aa) try { d = i.execCb(c, m, b, d); } catch (e) { a = e; } else d = i.execCb(c, m, b, d); this.map.isDefine && ((b = this.module) && void 0 !== b.exports && b.exports
!== this.exports ? d = b.exports : void 0 === d && this.usingExports && (d = this.exports)); if (a) return a.requireMap = this.map, a.requireModules = this.map.isDefine ? [this.map.id] : null, a.requireType = this.map.isDefine ? 'define' : 'require', v(this.error = a);
                } else d = m; this.exports = d; if (this.map.isDefine && !this.ignore && (r[c] = d, j.onResourceLoad))j.onResourceLoad(i, this.map, this.depMaps); x(c); this.defined = !0;
              } this.defining = !1; this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit('defined', this.exports), this.defineEmitComplete = !0);
            }
          } else this.fetch();
        }
      },
      callPlugin() {
        const a = this.map; const b = a.id; const e = n(a.prefix); this.depMaps.push(e); s(e, 'defined', u(this, function (d) {
          let m; let e; e = this.map.name; const g = this.map.parentMap ? this.map.parentMap.name : null; const h = i.makeRequire(a.parentMap, { enableBuildCallback: !0 }); if (this.map.unnormalized) {
            if (d.normalize && (e = d.normalize(e, a => c(a, g, !0)) || ''), d = n(`${a.prefix}!${e}`, this.map.parentMap), s(d, 'defined', u(this, function (a) { this.init([], () => a, null, { enabled: !0, ignore: !0 }); })),
            e = l(p, d.id)) { this.depMaps.push(d); if (this.events.error)e.on('error', u(this, function (a) { this.emit('error', a); })); e.enable(); }
          } else {
            m = u(this, function (a) { this.init([], () => a, null, { enabled: !0 }); }), m.error = u(this, function (a) { this.inited = !0; this.error = a; a.requireModules = [b]; F(p, (a) => { a.map.id.indexOf(`${b}_unnormalized`) === 0 && x(a.map.id); }); v(a); }), m.fromText = u(this, function (d, c) {
              const e = a.name; const g = n(e); const B = O; c && (d = c); B && (O = !1); q(g); t(k.config, b) && (k.config[e] = k.config[b]); try { j.exec(d); } catch (ca) {
                return v(A('fromtexteval',
                  `fromText eval for ${b} failed: ${ca}`, ca, [b]));
              }B && (O = !0); this.depMaps.push(g); i.completeLoad(e); h([e], m);
            }), d.load(a.name, h, m, k);
          }
        })); i.enable(e, this); this.pluginMaps[e.id] = e;
      },
      enable() {
        T[this.map.id] = this; this.enabling = this.enabled = !0; y(this.depMaps, u(this, function (a, b) {
          let c; let d; if (typeof a === 'string') {
            a = n(a, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap); this.depMaps[b] = a; if (c = l(N, a.id)) { this.depExports[b] = c(this); return; } this.depCount += 1; s(a, 'defined', u(this, function (a) {
              this.defineDep(b,
                a); this.check();
            })); this.errback && s(a, 'error', u(this, this.errback));
          }c = a.id; d = p[c]; !t(N, c) && (d && !d.enabled) && i.enable(a, this);
        })); F(this.pluginMaps, u(this, function (a) { const b = l(p, a.id); b && !b.enabled && i.enable(a, this); })); this.enabling = !1; this.check();
      },
      on(a, b) { let c = this.events[a]; c || (c = this.events[a] = []); c.push(b); },
      emit(a, b) { y(this.events[a], (a) => { a(b); }); a === 'error' && delete this.events[a]; },
    }; i = {
      config: k,
      contextName: b,
      registry: p,
      defined: r,
      urlFetched: S,
      defQueue: G,
      Module: X,
      makeModuleMap: n,
      nextTick: j.nextTick,
      onError: v,
      configure(a) {
        a.baseUrl && a.baseUrl.charAt(a.baseUrl.length - 1) !== '/' && (a.baseUrl += '/'); const b = k.pkgs; const c = k.shim; const d = { paths: !0, config: !0, map: !0 }; F(a, (a, b) => { d[b] ? b === 'map' ? (k.map || (k.map = {}), Q(k[b], a, !0, !0)) : Q(k[b], a, !0) : k[b] = a; }); a.shim && (F(a.shim, (a, b) => { I(a) && (a = { deps: a }); if ((a.exports || a.init) && !a.exportsFn)a.exportsFn = i.makeShimExports(a); c[b] = a; }), k.shim = c); a.packages && (y(a.packages, (a) => {
          a = typeof a === 'string' ? { name: a } : a; b[a.name] = {
            name: a.name,
            location: a.location || a.name,
            main: (a.main || 'main').replace(ja, '').replace(ea, ''),
          };
        }), k.pkgs = b); F(p, (a, b) => { !a.inited && !a.map.unnormalized && (a.map = n(b)); }); if (a.deps || a.callback)i.require(a.deps || [], a.callback);
      },
      makeShimExports(a) { return function () { let b; a.init && (b = a.init.apply(Z, arguments)); return b || a.exports && ba(a.exports); }; },
      makeRequire(a, f) {
        function h(d, c, e) {
          let g; let k; f.enableBuildCallback && (c && H(c)) && (c.__requireJsBuild = !0); if (typeof d === 'string') {
            if (H(c)) {
              return v(A('requireargs',
                'Invalid require call'), e);
            } if (a && t(N, d)) return N[d](p[a.id]); if (j.get) return j.get(i, d, a, h); g = n(d, a, !1, !0); g = g.id; return !t(r, g) ? v(A('notloaded', `Module name "${g}" has not been loaded yet for context: ${b}${a ? '' : '. Use require([])'}`)) : r[g];
          }K(); i.nextTick(() => { K(); k = q(n(null, a)); k.skipMap = f.skipMap; k.init(d, c, e, { enabled: !0 }); C(); }); return h;
        }f = f || {}; Q(h, {
          isBrowser: z,
          toUrl(b) {
            let f; const e = b.lastIndexOf('.'); const g = b.split('/')[0]; if (e !== -1 && (!(g === '.' || g === '..') || e > 1)) {
              f = b.substring(e, b.length), b = b.substring(0, e);
            } return i.nameToUrl(c(b, a && a.id, !0), f, !0);
          },
          defined(b) { return t(r, n(b, a, !1, !0).id); },
          specified(b) { b = n(b, a, !1, !0).id; return t(r, b) || t(p, b); },
        }); a || (h.undef = function (b) { w(); const c = n(b, a, !0); const f = l(p, b); e(b); delete r[b]; delete S[c.url]; delete Y[b]; f && (f.events.defined && (Y[b] = f.events), x(b)); }); return h;
      },
      enable(a) { l(p, a.id) && q(a).enable(); },
      completeLoad(a) {
        let b; let c; const d = l(k.shim, a) || {}; const e = d.exports; for (w(); G.length;) {
          c = G.shift(); if (c[0] === null) {
            c[0] = a; if (b) break; b = !0;
          } else c[0] === a && (b = !0); D(c);
        }c = l(p, a); if (!b && !t(r, a) && c && !c.inited) { if (k.enforceDefine && (!e || !ba(e))) return h(a) ? void 0 : v(A('nodefine', `No define call for ${a}`, null, [a])); D([a, d.deps || [], d.exportsFn]); }C();
      },
      nameToUrl(a, b, c) {
        let d; let e; let h; let g; let i; let n; if (j.jsExtRegExp.test(a))g = a + (b || ''); else {
          d = k.paths; e = k.pkgs; g = a.split('/'); for (i = g.length; i > 0; i -= 1) {
            if (n = g.slice(0, i).join('/'), h = l(e, n), n = l(d, n)) { I(n) && (n = n[0]); g.splice(0, i, n); break; } else if (h) {
              a = a === h.name ? `${h.location}/${h.main}` : h.location; g.splice(0, i,
                a); break;
            }
          }g = g.join('/'); g += b || (/^data\:|\?/.test(g) || c ? '' : '.js'); g = (g.charAt(0) === '/' || g.match(/^[\w\+\.\-]+:/) ? '' : k.baseUrl) + g;
        } return k.urlArgs ? g + ((g.indexOf('?') === -1 ? '?' : '&') + k.urlArgs) : g;
      },
      load(a, b) { j.load(i, a, b); },
      execCb(a, b, c, d) { return b.apply(d, c); },
      onScriptLoad(a) { if (a.type === 'load' || ka.test((a.currentTarget || a.srcElement).readyState))P = null, a = J(a), i.completeLoad(a.id); },
      onScriptError(a) {
        const b = J(a); if (!h(b.id)) {
          return v(A('scripterror', `Script error for: ${b.id}`,
            a, [b.id]));
        }
      },
    }; i.require = i.makeRequire(); return i;
  } let j; let w; let x; let C; let J; let D; let P; let K; let q; let fa; const la = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg; const ma = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g; var ea = /\.js$/; var ja = /^\.\//; w = Object.prototype; var L = w.toString; var ga = w.hasOwnProperty; var ia = Array.prototype.splice; var z = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document); var da = !z && typeof importScripts !== 'undefined'; var ka = z && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/; var W = typeof opera !== 'undefined'
&& opera.toString() === '[object Opera]'; const E = {}; let s = {}; var R = []; var O = !1; if (typeof define === 'undefined') {
    if (typeof requirejs !== 'undefined') { if (H(requirejs)) return; s = requirejs; requirejs = void 0; } typeof require !== 'undefined' && !H(require) && (s = require, require = void 0); j = requirejs = function (b, c, e, h) { let q; let n = '_'; !I(b) && typeof b !== 'string' && (q = b, I(c) ? (b = c, c = e, e = h) : b = []); q && q.context && (n = q.context); (h = l(E, n)) || (h = E[n] = j.s.newContext(n)); q && h.configure(q); return h.require(b, c, e); }; j.config = function (b) { return j(b); }; j.nextTick = typeof setTimeout
!== 'undefined' ? function (b) { setTimeout(b, 4); } : function (b) { b(); }; require || (require = j); j.version = '2.1.9'; j.jsExtRegExp = /^\/|:|\?|\.js$/; j.isBrowser = z; w = j.s = { contexts: E, newContext: ha }; j({}); y(['toUrl', 'undef', 'defined', 'specified'], (b) => { j[b] = function () { const c = E._; return c.require[b].apply(c, arguments); }; }); if (z && (x = w.head = document.getElementsByTagName('head')[0], C = document.getElementsByTagName('base')[0]))x = w.head = C.parentNode; j.onError = aa; j.createNode = function (b) {
      const c = b.xhtml ? document.createElementNS('http://www.w3.org/1999/xhtml',
        'html:script') : document.createElement('script'); c.type = b.scriptType || 'text/javascript'; c.charset = 'utf-8'; c.async = !0; return c;
    }; j.load = function (b, c, e) {
      let h = b && b.config || {}; if (z) {
        return h = j.createNode(h, c, e), h.setAttribute('data-requirecontext', b.contextName), h.setAttribute('data-requiremodule', c), h.attachEvent && !(h.attachEvent.toString && h.attachEvent.toString().indexOf('[native code') < 0) && !W ? (O = !0, h.attachEvent('onreadystatechange', b.onScriptLoad)) : (h.addEventListener('load', b.onScriptLoad, !1), h.addEventListener('error',
          b.onScriptError, !1)), h.src = e, K = h, C ? x.insertBefore(h, C) : x.appendChild(h), K = null, h;
      } if (da) try { importScripts(e), b.completeLoad(c); } catch (l) { b.onError(A('importscripts', `importScripts failed for ${c} at ${e}`, l, [c])); }
    }; z && !s.skipDataMain && M(document.getElementsByTagName('script'), (b) => {
      x || (x = b.parentNode); if (J = b.getAttribute('data-main')) {
        return q = J, s.baseUrl || (D = q.split('/'), q = D.pop(), fa = D.length ? `${D.join('/')}/` : './', s.baseUrl = fa), q = q.replace(ea, ''), j.jsExtRegExp.test(q) && (q = J), s.deps = s.deps ? s.deps.concat(q)
          : [q], !0;
      }
    }); define = function (b, c, e) {
      let h; let j; typeof b !== 'string' && (e = c, c = b, b = null); I(c) || (e = c, c = null); !c && H(e) && (c = [], e.length && (e.toString().replace(la, '').replace(ma, (b, e) => { c.push(e); }), c = (e.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(c))); if (O) { if (!(h = K))P && P.readyState === 'interactive' || M(document.getElementsByTagName('script'), (b) => { if (b.readyState === 'interactive') return P = b; }), h = P; h && (b || (b = h.getAttribute('data-requiremodule')), j = E[h.getAttribute('data-requirecontext')]); }(j
        ? j.defQueue : R).push([b, c, e]);
    }; define.amd = { jQuery: !0 }; j.exec = function (b) { return eval(b); }; j(s);
  }
}(this));