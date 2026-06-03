/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck  — WebGL fluid sim; TS strict mode conflicts with raw GL types
"use client";
import { useEffect, useRef } from "react";

interface Props {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
}

export default function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.25,
  SPLAT_FORCE = 6000,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 },
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── WebGL context ──────────────────────────────────────────────────
    let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;
    // eslint-disable-next-line prefer-const
    let ext: {
      formatRGBA: { internalFormat: number; format: number } | null;
      formatRG: { internalFormat: number; format: number } | null;
      formatR: { internalFormat: number; format: number } | null;
      halfFloatTexType: number;
      supportLinearFiltering: boolean;
    } = null!;

    function getWebGLContext(c: HTMLCanvasElement) {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
      let ctx = c.getContext("webgl2", params) as WebGL2RenderingContext | null;
      const isWebGL2 = !!ctx;
      if (!ctx) ctx = (c.getContext("webgl", params) || c.getContext("experimental-webgl", params)) as WebGL2RenderingContext | null;
      if (!ctx) return null;
      gl = ctx;

      let halfFloat: OES_texture_half_float | null = null;
      let supportLinearFiltering = false;

      if (isWebGL2) {
        (ctx as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!(ctx as WebGL2RenderingContext).getExtension("OES_texture_float_linear");
      } else {
        halfFloat = ctx.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!ctx.getExtension("OES_texture_half_float_linear");
      }

      ctx.clearColor(0.0, 0.0, 0.0, 1.0);
      const halfFloatTexType = isWebGL2
        ? (ctx as WebGL2RenderingContext).HALF_FLOAT
        : halfFloat ? halfFloat.HALF_FLOAT_OES : ctx.UNSIGNED_BYTE;

      let formatRGBA, formatRG, formatR;
      if (isWebGL2) {
        const gl2 = ctx as WebGL2RenderingContext;
        formatRGBA = getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
        formatRG   = getSupportedFormat(gl2, gl2.RG16F,   gl2.RG,   halfFloatTexType);
        formatR    = getSupportedFormat(gl2, gl2.R16F,    gl2.RED,  halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(ctx, ctx.RGBA, ctx.RGBA, halfFloatTexType);
        formatRG   = formatRGBA;
        formatR    = formatRGBA;
      }
      ext = { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering };
      return ctx;
    }

    function getSupportedFormat(g: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
      if (!supportRenderTextureFormat(g, internalFormat, format, type)) {
        switch (internalFormat) {
          case (g as WebGL2RenderingContext).R16F:    return getSupportedFormat(g, (g as WebGL2RenderingContext).RG16F,   (g as WebGL2RenderingContext).RG,   type);
          case (g as WebGL2RenderingContext).RG16F:   return getSupportedFormat(g, (g as WebGL2RenderingContext).RGBA16F,  g.RGBA, type);
          default: return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(g: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
      const tex = g.createTexture();
      g.bindTexture(g.TEXTURE_2D, tex);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fb = g.createFramebuffer();
      g.bindFramebuffer(g.FRAMEBUFFER, fb);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0);
      return g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE;
    }

    const ctx = getWebGLContext(canvas);
    if (!ctx) return;
    const g = ctx;

    // ── Shader source strings ──────────────────────────────────────────
    const baseVert = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main(){
        vUv = aPosition*0.5+0.5;
        vL = vUv - vec2(texelSize.x,0.0);
        vR = vUv + vec2(texelSize.x,0.0);
        vT = vUv + vec2(0.0,texelSize.y);
        vB = vUv - vec2(0.0,texelSize.y);
        gl_Position = vec4(aPosition,0.0,1.0);
      }`;

    const copyFrag = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main(){ gl_FragColor = texture2D(uTexture, vUv); }`;

    const clearFrag = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`;

    const displayFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main(){ vec3 c = texture2D(uTexture, vUv).rgb; gl_FragColor = vec4(c, 1.0); }`;

    const splatFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main(){
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p,p)/radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`;

    const advectFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp(sampler2D sam, vec2 uv, vec2 tSize){
        vec2 st = uv/tSize - 0.5;
        vec2 iuv = floor(st); vec2 fuv = fract(st);
        vec4 a = texture2D(sam,(iuv+vec2(0.5,0.5))*tSize);
        vec4 b = texture2D(sam,(iuv+vec2(1.5,0.5))*tSize);
        vec4 c = texture2D(sam,(iuv+vec2(0.5,1.5))*tSize);
        vec4 d = texture2D(sam,(iuv+vec2(1.5,1.5))*tSize);
        return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);
      }
      void main(){
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
        gl_FragColor.a = 1.0;
      }`;

    const advectFrag2 = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main(){
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
      }`;

    const divFrag = `
      precision mediump float;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }`;

    const curlFrag = `
      precision mediump float;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5*(R-L-(T-B)), 0.0, 0.0, 1.0);
      }`;

    const vorticityFrag = `
      precision highp float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl;
      uniform float curl; uniform float dt;
      void main(){
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T)-abs(B), abs(R)-abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 v = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(v + force * dt, 0.0, 1.0);
      }`;

    const pressureFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4((L+R+B+T-C)*0.25, 0.0, 0.0, 1.0);
      }`;

    const gradSubFrag = `
      precision mediump float;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main(){
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 v = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(v - vec2(R-L, T-B)*0.5, 0.0, 1.0);
      }`;

    // ── Compile helpers ────────────────────────────────────────────────
    function compileShader(type: number, source: string) {
      const s = g.createShader(type)!;
      g.shaderSource(s, source);
      g.compileShader(s);
      return s;
    }
    function createProgram(vertSrc: string, fragSrc: string) {
      const p = g.createProgram()!;
      g.attachShader(p, compileShader(g.VERTEX_SHADER, vertSrc));
      g.attachShader(p, compileShader(g.FRAGMENT_SHADER, fragSrc));
      g.linkProgram(p);
      return p;
    }
    function getUniforms(program: WebGLProgram) {
      const u: Record<string, WebGLUniformLocation> = {};
      const n = g.getProgramParameter(program, g.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = g.getActiveUniform(program, i)!;
        u[info.name] = g.getUniformLocation(program, info.name)!;
      }
      return u;
    }

    // ── Programs ───────────────────────────────────────────────────────
    const copyProg     = createProgram(baseVert, copyFrag);
    const clearProg    = createProgram(baseVert, clearFrag);
    const displayProg  = createProgram(baseVert, displayFrag);
    const splatProg    = createProgram(baseVert, splatFrag);
    const advectProg   = createProgram(baseVert, advectFrag);
    const advect2Prog  = createProgram(baseVert, advectFrag2);
    const divProg      = createProgram(baseVert, divFrag);
    const curlProg     = createProgram(baseVert, curlFrag);
    const vortProg     = createProgram(baseVert, vorticityFrag);
    const pressureProg = createProgram(baseVert, pressureFrag);
    const gradProg     = createProgram(baseVert, gradSubFrag);

    const uniforms = {
      copy:     getUniforms(copyProg),
      clear:    getUniforms(clearProg),
      display:  getUniforms(displayProg),
      splat:    getUniforms(splatProg),
      advect:   getUniforms(advectProg),
      advect2:  getUniforms(advect2Prog),
      div:      getUniforms(divProg),
      curl:     getUniforms(curlProg),
      vort:     getUniforms(vortProg),
      pressure: getUniforms(pressureProg),
      grad:     getUniforms(gradProg),
    };

    // ── Quad geometry ──────────────────────────────────────────────────
    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), g.STATIC_DRAW);
    const idxBuf = g.createBuffer();
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, idxBuf);
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), g.STATIC_DRAW);

    function bindQuad(program: WebGLProgram) {
      g.bindBuffer(g.ARRAY_BUFFER, buf);
      const loc = g.getAttribLocation(program, "aPosition");
      g.enableVertexAttribArray(loc);
      g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    }

    // ── FBO helpers ────────────────────────────────────────────────────
    const isWebGL2 = !!canvas.getContext("webgl2");

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      g.activeTexture(g.TEXTURE0);
      const tex = g.createTexture()!;
      g.bindTexture(g.TEXTURE_2D, tex);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, param);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, param);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = g.createFramebuffer()!;
      g.bindFramebuffer(g.FRAMEBUFFER, fbo);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0);
      g.viewport(0, 0, w, h);
      g.clear(g.COLOR_BUFFER_BIT);
      return {
        texture: tex, fbo,
        width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id: number) { g.activeTexture(g.TEXTURE0 + id); g.bindTexture(g.TEXTURE_2D, tex); return id; },
      };
    }

    function createDoubleFBO(w: number, h: number, iF: number, fmt: number, type: number, param: number) {
      let r = createFBO(w, h, iF, fmt, type, param);
      let wr = createFBO(w, h, iF, fmt, type, param);
      return {
        width: w, height: h, texelSizeX: r.texelSizeX, texelSizeY: r.texelSizeY,
        get read() { return r; }, get write() { return wr; },
        swap() { [r, wr] = [wr, r]; },
      };
    }

    function resizeFBO(fbo: ReturnType<typeof createFBO>, w: number, h: number, iF: number, fmt: number, type: number, param: number) {
      const n = createFBO(w, h, iF, fmt, type, param);
      g.useProgram(copyProg);
      bindQuad(copyProg);
      g.uniform1i(uniforms.copy.uTexture, fbo.attach(0));
      blit(n.fbo);
      return n;
    }

    function resizeDoubleFBO(dfbo: ReturnType<typeof createDoubleFBO>, w: number, h: number, iF: number, fmt: number, type: number, param: number) {
      if (dfbo.width === w && dfbo.height === h) return dfbo;
      // cast to any to bypass readonly accessors during resize
      const d = dfbo as unknown as Record<string,unknown>;
      d["_read"]  = resizeFBO(dfbo.read,  w, h, iF, fmt, type, param);
      d["_write"] = resizeFBO(dfbo.write, w, h, iF, fmt, type, param);
      d["width"]  = w; d["height"] = h;
      d["texelSizeX"] = 1/w; d["texelSizeY"] = 1/h;
      return dfbo;
    }

    function blit(target: WebGLFramebuffer | null) {
      g.bindFramebuffer(g.FRAMEBUFFER, target);
      g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0);
    }

    // ── Compute resolution ─────────────────────────────────────────────
    function getResolution(res: number) {
      const ar = canvas.width / canvas.height;
      return ar > 1 ? { w: Math.round(res * ar), h: res } : { w: res, h: Math.round(res / ar) };
    }

    const fmt = ext.formatRGBA ?? { internalFormat: g.RGBA, format: g.RGBA };
    const fmtRG = ext.formatRG ?? fmt;
    const fmtR  = ext.formatR  ?? fmt;
    const half  = ext.halfFloatTexType;
    const filter = ext.supportLinearFiltering ? g.LINEAR : g.NEAREST;

    const simRes = getResolution(SIM_RESOLUTION);
    const dyeRes = getResolution(DYE_RESOLUTION);

    let velocity = createDoubleFBO(simRes.w, simRes.h, fmtRG.internalFormat, fmtRG.format, half, filter);
    let dye      = createDoubleFBO(dyeRes.w, dyeRes.h, fmt.internalFormat,   fmt.format,   half, filter);
    let pressure = createDoubleFBO(simRes.w, simRes.h, fmtR.internalFormat,  fmtR.format,  half, g.NEAREST);
    let divergence = createFBO(simRes.w, simRes.h, fmtR.internalFormat, fmtR.format, half, g.NEAREST);
    let curl       = createFBO(simRes.w, simRes.h, fmtR.internalFormat, fmtR.format, half, g.NEAREST);

    // ── Resize canvas & FBOs on window resize ──────────────────────────
    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const sr = getResolution(SIM_RESOLUTION);
      const dr = getResolution(DYE_RESOLUTION);
      velocity  = resizeDoubleFBO(velocity,  sr.w, sr.h, fmtRG.internalFormat, fmtRG.format, half, filter);
      dye       = resizeDoubleFBO(dye,       dr.w, dr.h, fmt.internalFormat,   fmt.format,   half, filter);
      pressure  = resizeDoubleFBO(pressure,  sr.w, sr.h, fmtR.internalFormat,  fmtR.format,  half, g.NEAREST);
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Color helpers ──────────────────────────────────────────────────
    function HSVtoRGB(h: number, s: number, v: number) {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: return { r: v, g: t, b: p };
        case 1: return { r: q, g: v, b: p };
        case 2: return { r: p, g: v, b: t };
        case 3: return { r: p, g: q, b: v };
        case 4: return { r: t, g: p, b: v };
        default: return { r: v, g: p, b: q };
      }
    }
    function generateColor() {
      return HSVtoRGB(Math.random(), 1, 1);
    }

    // ── Splat ──────────────────────────────────────────────────────────
    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      const ar = canvas.width / canvas.height;
      g.useProgram(splatProg);
      bindQuad(splatProg);
      g.uniform1i(uniforms.splat.uTarget, velocity.read.attach(0));
      g.uniform1f(uniforms.splat.aspectRatio, ar);
      g.uniform2f(uniforms.splat.point, x / canvas.width, 1 - y / canvas.height);
      g.uniform3f(uniforms.splat.color, dx, -dy, 0);
      g.uniform1f(uniforms.splat.radius, correctRadius(SPLAT_RADIUS / 100));
      g.viewport(0, 0, velocity.width, velocity.height);
      blit(velocity.write.fbo);
      velocity.swap();

      g.uniform1i(uniforms.splat.uTarget, dye.read.attach(0));
      g.uniform3f(uniforms.splat.color, color.r, color.g, color.b);
      g.viewport(0, 0, dye.width, dye.height);
      blit(dye.write.fbo);
      dye.swap();
    }

    function correctRadius(r: number) {
      const ar = canvas.width / canvas.height;
      return ar > 1 ? r * ar : r;
    }

    // ── Pointer tracking ───────────────────────────────────────────────
    const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, color: generateColor() };
    let colorTimer = 0;

    const onMouseMove = (e: MouseEvent) => {
      pointer.dx    = (e.clientX - pointer.x) * SPLAT_FORCE;
      pointer.dy    = (e.clientY - pointer.y) * SPLAT_FORCE;
      pointer.x     = e.clientX;
      pointer.y     = e.clientY;
      pointer.moved = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.targetTouches[0];
      pointer.dx    = (t.clientX - pointer.x) * SPLAT_FORCE;
      pointer.dy    = (t.clientY - pointer.y) * SPLAT_FORCE;
      pointer.x     = t.clientX;
      pointer.y     = t.clientY;
      pointer.moved = true;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    // ── Main simulation step ───────────────────────────────────────────
    let lastTime = Date.now();
    let raf = 0;

    function step(dt: number) {
      g.disable(g.BLEND);

      // curl
      g.useProgram(curlProg);
      bindQuad(curlProg);
      g.uniform2f(uniforms.curl.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(uniforms.curl.uVelocity, velocity.read.attach(0));
      g.viewport(0, 0, velocity.width, velocity.height);
      blit(curl.fbo);

      // vorticity
      g.useProgram(vortProg);
      bindQuad(vortProg);
      g.uniform2f(uniforms.vort.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(uniforms.vort.uVelocity, velocity.read.attach(0));
      g.uniform1i(uniforms.vort.uCurl, curl.attach(1));
      g.uniform1f(uniforms.vort.curl, CURL);
      g.uniform1f(uniforms.vort.dt, dt);
      g.viewport(0, 0, velocity.width, velocity.height);
      blit(velocity.write.fbo);
      velocity.swap();

      // divergence
      g.useProgram(divProg);
      bindQuad(divProg);
      g.uniform2f(uniforms.div.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(uniforms.div.uVelocity, velocity.read.attach(0));
      g.viewport(0, 0, velocity.width, velocity.height);
      blit(divergence.fbo);

      // clear pressure
      g.useProgram(clearProg);
      bindQuad(clearProg);
      g.uniform1i(uniforms.clear.uTexture, pressure.read.attach(0));
      g.uniform1f(uniforms.clear.value, PRESSURE);
      g.viewport(0, 0, pressure.width, pressure.height);
      blit(pressure.write.fbo);
      pressure.swap();

      // pressure iterations
      g.useProgram(pressureProg);
      bindQuad(pressureProg);
      g.uniform2f(uniforms.pressure.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(uniforms.pressure.uDivergence, divergence.attach(0));
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        g.uniform1i(uniforms.pressure.uPressure, pressure.read.attach(1));
        g.viewport(0, 0, pressure.width, pressure.height);
        blit(pressure.write.fbo);
        pressure.swap();
      }

      // gradient subtract
      g.useProgram(gradProg);
      bindQuad(gradProg);
      g.uniform2f(uniforms.grad.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(uniforms.grad.uPressure, pressure.read.attach(0));
      g.uniform1i(uniforms.grad.uVelocity, velocity.read.attach(1));
      g.viewport(0, 0, velocity.width, velocity.height);
      blit(velocity.write.fbo);
      velocity.swap();

      // advect velocity
      g.useProgram(advect2Prog);
      bindQuad(advect2Prog);
      g.uniform2f(uniforms.advect2.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform1i(uniforms.advect2.uVelocity, velocity.read.attach(0));
      g.uniform1i(uniforms.advect2.uSource,   velocity.read.attach(0));
      g.uniform1f(uniforms.advect2.dt, dt);
      g.uniform1f(uniforms.advect2.dissipation, VELOCITY_DISSIPATION);
      g.viewport(0, 0, velocity.width, velocity.height);
      blit(velocity.write.fbo);
      velocity.swap();

      // advect dye
      g.useProgram(advectProg);
      bindQuad(advectProg);
      g.uniform2f(uniforms.advect.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      g.uniform2f(uniforms.advect.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      g.uniform1i(uniforms.advect.uVelocity, velocity.read.attach(0));
      g.uniform1i(uniforms.advect.uSource,   dye.read.attach(1));
      g.uniform1f(uniforms.advect.dt, dt);
      g.uniform1f(uniforms.advect.dissipation, DENSITY_DISSIPATION);
      g.viewport(0, 0, dye.width, dye.height);
      blit(dye.write.fbo);
      dye.swap();
    }

    function render() {
      g.useProgram(displayProg);
      bindQuad(displayProg);
      g.uniform1i(uniforms.display.uTexture, dye.read.attach(0));
      g.viewport(0, 0, canvas.width, canvas.height);
      blit(null);
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016667);
      lastTime = now;

      // update pointer color periodically
      colorTimer += dt * COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) { colorTimer = 0; pointer.color = generateColor(); }

      if (pointer.moved) {
        splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
        pointer.moved = false;
      }

      step(dt);
      render();
    }

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",      resize);
      window.removeEventListener("mousemove",   onMouseMove);
      window.removeEventListener("touchmove",   onTouchMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
