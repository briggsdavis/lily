"use client"

import { useEffect, useRef } from "react"

type SmokeProps = {
  className?: string
  /** Hex color of the smoke. */
  color?: string
  /** Screen direction the smoke drifts toward, [x, y] with y down. Default: northwest. */
  direction?: readonly [number, number]
  /** Peak opacity of the densest smoke, 0 to 1. */
  intensity?: number
  /** Render resolution relative to CSS pixels. Smoke is soft, so low values are cheap and fine. */
  resolution?: number
  /** Larger values make bigger, slower-looking plumes. */
  scale?: number
  speed?: number
  /** Keep the canvas viewport-sized while scrolling through a tall container. */
  sticky?: boolean
}

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uDirection;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uScale;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = turn * p;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 screen = gl_FragCoord.xy / uResolution;
  vec2 p = gl_FragCoord.xy / (uResolution.y * uScale) * 2.4;
  vec2 drift = uDirection * uTime * 0.05;

  vec2 warpA = vec2(
    fbm(p - drift + vec2(0.0, uTime * 0.012)),
    fbm(p - drift + vec2(5.2, 1.3) - uTime * 0.01)
  );
  vec2 warpB = vec2(
    fbm(p - drift * 1.35 + 3.2 * warpA + vec2(1.7, 9.2)),
    fbm(p - drift * 1.35 + 3.2 * warpA + vec2(8.3, 2.8))
  );
  float density = fbm(p - drift * 0.85 + 2.6 * warpB);
  density = smoothstep(0.38, 0.92, density);

  // Thicker near the corner the smoke comes from, thinner where it drifts to.
  float source = clamp(0.5 - dot(screen - 0.5, uDirection) * 0.85, 0.0, 1.0);
  float alpha = density * uIntensity * mix(0.35, 1.0, source);

  gl_FragColor = vec4(uColor * alpha, alpha);
}
`

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace("#", "")
  const full =
    value.length === 3
      ? value
          .split("")
          .map((part) => part + part)
          .join("")
      : value
  const number = Number.parseInt(full, 16)
  return [((number >> 16) & 255) / 255, ((number >> 8) & 255) / 255, (number & 255) / 255]
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

export function Smoke({
  className = "",
  color = "#fdf2e2",
  direction = [-1, -1],
  intensity = 0.2,
  resolution = 0.5,
  scale = 1,
  speed = 1,
  sticky = false,
}: SmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [directionX, directionY] = direction

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext("webgl", { antialias: false, premultipliedAlpha: true })
    if (!canvas || !gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const uResolution = uniform("uResolution")
    const uTime = uniform("uTime")
    const length = Math.hypot(directionX, directionY) || 1
    // Convert from screen space (y down) to GL space (y up).
    gl.uniform2f(uniform("uDirection"), directionX / length, -directionY / length)
    gl.uniform3f(uniform("uColor"), ...parseHex(color))
    gl.uniform1f(uniform("uIntensity"), intensity)
    gl.uniform1f(uniform("uScale"), scale)

    const resize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth * resolution))
      const height = Math.max(1, Math.round(canvas.clientHeight * resolution))
      if (canvas.width === width && canvas.height === height) return
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      gl.uniform2f(uResolution, width, height)
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const start = performance.now() - 40_000
    let frame = 0
    let visible = false

    const draw = (now: number) => {
      resize()
      gl.uniform1f(uTime, ((now - start) / 1000) * speed)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (visible && !reducedMotion) frame = window.requestAnimationFrame(draw)
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (!visible || reducedMotion) draw(performance.now())
    })
    resizeObserver.observe(canvas)

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      window.cancelAnimationFrame(frame)
      if (visible) frame = window.requestAnimationFrame(draw)
    })
    visibilityObserver.observe(canvas)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [color, directionX, directionY, intensity, resolution, scale, speed])

  const canvas = <canvas className="absolute inset-0 size-full" ref={canvasRef} />

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {sticky ? <div className="sticky top-0 h-svh w-full">{canvas}</div> : canvas}
    </div>
  )
}
