'use client'
import { useEffect, useRef, useState } from 'react'
let soundContext: AudioContext | undefined
let feedbackOn = false
export function playSaved() {
  if (!feedbackOn || !soundContext) return
  const ctx = soundContext
  if (ctx.state !== 'running') return
  for (const [i, frequency] of [523.25, 659.25].entries()) {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    const start = ctx.currentTime + i * 0.085
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.035, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25)
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(start + 0.3)
  }
}
export function SoundSettings() {
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState('')
  useEffect(
    () => () => {
      feedbackOn = false
      void soundContext?.close()
      soundContext = undefined
    },
    [],
  )
  async function toggle() {
    try {
      if (!enabled) {
        soundContext ??= new AudioContext()
        await soundContext.resume()
      }
      feedbackOn = !enabled
      setEnabled(!enabled)
      setError('')
      if (!enabled) playSaved()
    } catch {
      setError('Je browser kan hier geen geluid afspelen.')
    }
  }
  return (
    <div className="sound-setting">
      <button className="quiet-button" aria-pressed={enabled} onClick={toggle}>
        ♪ Bewaargeluid {enabled ? 'aan' : 'uit'}
      </button>
      <span>{error || 'Een zacht signaal als je iets bewaart. Standaard stil.'}</span>
    </div>
  )
}
export function FocusSound() {
  const audio = useRef<{ ctx: AudioContext; source: AudioBufferSourceNode; gain: GainNode } | null>(
    null,
  )
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(15)
  const [error, setError] = useState('')
  useEffect(
    () => () => {
      void audio.current?.ctx.close()
    },
    [],
  )
  async function toggle() {
    if (audio.current) {
      await audio.current.ctx.close()
      audio.current = null
      setPlaying(false)
      return
    }
    try {
      const ctx = new AudioContext()
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 8, ctx.sampleRate)
      const samples = buffer.getChannelData(0)
      // A quiet filtered noise bed is generated locally; no external audio is loaded.
      let last = 0
      for (let i = 0; i < samples.length; i++) {
        last = (last + (Math.random() * 2 - 1) * 0.025) / 1.025
        samples[i] = last * 4
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1000
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(volume / 100, ctx.currentTime + 0.6)
      source.connect(filter).connect(gain).connect(ctx.destination)
      await ctx.resume()
      source.start()
      audio.current = { ctx, source, gain }
      setPlaying(true)
      setError('')
    } catch {
      setError('Afspelen lukt niet in deze browser. Je kan de planner gewoon gebruiken.')
    }
  }
  return (
    <aside className="focus-sound">
      <div>
        <p className="eyebrow">Zet de wereld even zachter</p>
        <h3>Een rustig werkmoment.</h3>
        <p>Zachte ruis, als jij daar prettig bij werkt. Stilte is ook goed.</p>
      </div>
      <div className="sound-controls">
        <button className="button small" aria-pressed={playing} onClick={toggle}>
          {playing ? 'Stop de ruis' : 'Speel zachte ruis'}
        </button>
        <label htmlFor="focus-volume">
          Volume <span>{volume}%</span>
        </label>
        <input
          id="focus-volume"
          type="range"
          min="0"
          max="50"
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value)
            setVolume(v)
            if (audio.current)
              audio.current.gain.gain.setTargetAtTime(v / 100, audio.current.ctx.currentTime, 0.05)
          }}
        />
        <p className="smallprint" role="status">
          {error ||
            (playing
              ? 'Ruis speelt. Stopt als je deze pagina verlaat.'
              : 'Start alleen na jouw klik. Geen externe dienst.')}
        </p>
      </div>
    </aside>
  )
}
export function AudioGuide({
  src,
  title,
  transcript,
}: {
  src: string
  title: string
  transcript: string
}) {
  const [error, setError] = useState(false)
  return (
    <section className="audio-guide">
      <div className="audio-label">
        <span aria-hidden="true">◖))</span>
        <div>
          <p className="eyebrow">Liever even luisteren?</p>
          <h2>{title}</h2>
        </div>
      </div>
      <audio controls preload="none" aria-label={title} onError={() => setError(true)}>
        <source src={src} type="audio/mpeg" />
      </audio>
      {error && <p role="alert">De audio kon niet laden. Lees de tekst hieronder.</p>}
      <details>
        <summary>Lees de gesproken tekst</summary>
        <p>{transcript}</p>
      </details>
      <p className="smallprint">
        Synthetische vertelstem · gemaakt met <a href="https://elevenlabs.io/">ElevenLabs</a>.
      </p>
    </section>
  )
}
