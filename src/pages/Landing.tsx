import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Zap, Shield, Code2, BarChart3, Globe, ChevronRight, Sparkles,
  ArrowRight, Lock, Cpu, Users, Star, CheckCircle2, Play,
  MousePointer2, Layers, Rocket
} from 'lucide-react';
import { PLANS } from '../lib/types';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Sub-200ms inference with globally distributed GPU clusters and intelligent caching.', tag: 'Performance' },
  { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 Type II, end-to-end encryption, RBAC, and advanced prompt injection protection.', tag: 'Security' },
  { icon: Code2, title: 'Developer First', desc: 'OpenAI-compatible API, SDKs in 8 languages, and comprehensive documentation.', tag: 'DX' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live dashboards with token tracking, cost analysis, latency monitoring, and custom alerts.', tag: 'Analytics' },
  { icon: Globe, title: 'Global Scale', desc: 'Multi-region deployment across 12 data centers with automatic failover and load balancing.', tag: 'Infrastructure' },
  { icon: Lock, title: 'Model Safety', desc: 'Built-in content filtering, PII redaction, and configurable safety guardrails for every request.', tag: 'Compliance' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'CTO, NeuralStack', text: 'Dupido cut our inference costs by 60% while improving latency. The API is drop-in compatible with our existing stack.', avatar: 'SC' },
  { name: 'Marcus Rivera', role: 'Lead Engineer, FlowAI', text: 'The analytics dashboard alone is worth the price. We finally have visibility into every token and every dollar.', avatar: 'MR' },
  { name: 'Elena Kowalski', role: 'VP Engineering, DataPulse', text: 'We migrated 2M daily requests from self-hosted infrastructure to Dupido in one weekend. Zero downtime.', avatar: 'EK' },
];

const trustLogos = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Cohere'];

const stats = [
  { value: '99.99%', label: 'Uptime SLA', icon: Shield },
  { value: '<200ms', label: 'P99 Latency', icon: Zap },
  { value: '50M+', label: 'API Calls/Day', icon: Cpu },
  { value: '10K+', label: 'Developers', icon: Users },
];

const codeLines = [
  { prefix: 'const', name: 'response', op: '=', suffix: 'await', fn: 'dupido', method: '.chat', args: '({' },
  { prefix: '', name: '  model', op: ':', suffix: "'gpt-4o'", args: '', fn: '', method: '' },
  { prefix: '', name: '  messages', op: ':', suffix: '[{', args: '', fn: '', method: '' },
  { prefix: '', name: '    role', op: ':', suffix: "'user'", args: ',', fn: '', method: '' },
  { prefix: '', name: '    content', op: ':', suffix: "'Explain quantum computing'", args: '', fn: '', method: '' },
  { prefix: '', name: '', op: '', suffix: '}]', args: '', fn: '', method: '' },
  { prefix: '', name: '', op: '', suffix: '});', args: '', fn: '', method: '' },
];

// Particle field background
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.o})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export default function Landing() {
  const [email, setEmail] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -100]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Dupido</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Log in</Link>
            <Link to="/signup" className="btn-primary text-sm !px-4 !py-2">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section style={{ opacity: heroOpacity, y: heroY }} className="relative pt-32 pb-20 px-6">
        <ParticleField />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.07] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.07] rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.03] rounded-full blur-[200px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cyan-400 mb-8 border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
              <span>Now supporting 50+ AI models across 6 providers</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]">
              <span className="text-white">The AI Platform</span>
              <br />
              <span className="gradient-text">Built for Scale</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              One API for every model. Enterprise-grade security. Real-time analytics.
              Ship production AI in minutes, not months.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/signup" className="btn-primary flex items-center gap-2 text-lg !px-8 !py-4 rounded-2xl">
                Start building free <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#demo" className="btn-secondary flex items-center gap-2 text-lg !px-8 !py-4 rounded-2xl">
                <Play className="w-5 h-5" /> Watch demo
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> No credit card required</span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> 100 free requests/month</span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Cancel anytime</span>
            </div>
          </motion.div>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="card !p-0 overflow-hidden shadow-2xl shadow-cyan-500/5 border-white/[0.08]">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-slate-600 font-mono">api-example.ts</span>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-600">
                  <MousePointer2 className="w-3 h-3" /> Copy
                </div>
              </div>
              <div className="p-5 font-mono text-sm leading-7 overflow-x-auto">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 text-slate-700 select-none text-right mr-4">{i + 1}</span>
                    <span>
                      {line.prefix && <span className="text-cyan-400">{line.prefix} </span>}
                      {line.name && <span className="text-slate-300">{line.name}</span>}
                      {line.op && <span className="text-blue-400"> {line.op} </span>}
                      {line.suffix && <span className={line.suffix.startsWith("'") ? 'text-emerald-300' : 'text-cyan-400'}>{line.suffix}</span>}
                      {line.fn && <span className="text-emerald-400">{line.fn}</span>}
                      {line.method && <span className="text-yellow-300">{line.method}</span>}
                      {line.args && <span className="text-slate-400">{line.args}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Trust logos */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs text-slate-600 uppercase tracking-wider mb-6">Trusted models and providers</p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {trustLogos.map((logo) => (
              <span key={logo} className="text-lg font-bold text-slate-700 hover:text-slate-500 transition-colors">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <s.icon className="w-5 h-5 text-cyan-500/50 mx-auto mb-2" />
              <div className="text-3xl md:text-4xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-info mb-4">Platform</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Everything you need to ship AI products
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              From prototype to production — one platform handles auth, billing, rate limits, and model routing.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setActiveFeature(i)}
                className={`card group transition-all duration-500 cursor-pointer ${
                  activeFeature === i
                    ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/10 bg-white/[0.05]'
                    : 'glass-hover'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    activeFeature === i
                      ? 'bg-gradient-to-br from-cyan-500/25 to-blue-500/25'
                      : 'bg-white/5'
                  }`}>
                    <f.icon className={`w-5 h-5 transition-colors duration-500 ${
                      activeFeature === i ? 'text-cyan-400' : 'text-slate-500'
                    }`} />
                  </div>
                  <span className="badge-neutral">{f.tag}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-info mb-4">Architecture</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">How it works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: MousePointer2, title: '1. Request', desc: 'Your app sends a request through our SDK or REST API' },
              { icon: Shield, title: '2. Safety Check', desc: 'Content filtering, PII redaction, and prompt injection detection' },
              { icon: Layers, title: '3. Model Router', desc: 'Intelligent routing to the optimal model based on cost and latency' },
              { icon: Rocket, title: '4. Response', desc: 'Streamed response with usage tracking and cost attribution' },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-info mb-4">Customers</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Trusted by leading teams</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-info mb-4">Pricing</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg">Start free. Scale as you grow. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {(Object.entries(PLANS) as [string, typeof PLANS.free][]).map(([key, plan]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`card relative ${plan.popular ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-cyan-500/30">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.priceCents > 0 && <span className="text-slate-500 text-sm">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block text-center py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20'
                      : 'glass text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {key === 'enterprise' ? 'Contact sales' : 'Get started'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/[0.05] rounded-full blur-[200px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to build the future?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join thousands of developers already shipping AI products with Dupido.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) window.location.href = `/signup?email=${encodeURIComponent(email)}`;
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Get started
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Dupido</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">The AI platform built for scale. One API, every model.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Product</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Features</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Pricing</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">API Reference</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Changelog</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Company</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="hover:text-slate-400 cursor-pointer transition-colors">About</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Blog</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Careers</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Contact</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Terms</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Security</div>
                <div className="hover:text-slate-400 cursor-pointer transition-colors">Status</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <div className="text-xs text-slate-700">&copy; 2026 Dupido. All rights reserved.</div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
