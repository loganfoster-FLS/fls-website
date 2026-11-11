// Interactive system map / user map (Services page, #map).
// One scenario per sector. "System map" shows how the solution is wired;
// "User map" shows the same solution as the journey a real person takes.
// Journey steps link to the system parts behind them, and vice versa.
// Deep link: services.html?map=trade#map

type View = 'system' | 'user'

interface MapNode {
  id: string
  c: number // column 0–3
  r: number // row 0–2
  t: string // label (keep ≤ 18 chars)
  d: string // description
  tools?: string[]
  feel?: string // user map only
  behind?: string[] // user map only: system node ids
}
type Edge = [string, string] | [string, string, 'loop']
interface Graph { nodes: MapNode[]; edges: Edge[] }
interface Scenario { id: string; label: string; color: string; brief: string; system: Graph; user: Graph }

const COLORS = ['#e8c34a', '#8b63e8', '#38d6f5', '#6a82ff']
const HEADS: Record<View, string[]> = {
  system: ['Inputs', 'Pipeline', 'Engine', 'Outcomes'],
  user: ['Discover', 'Engage', 'Act', 'Grow'],
}
const W = 1000
const H = 440
const COLX = [120, 373, 627, 880]
const ROWY = [112, 238, 364]
const NW = 186
const NH = 56

const SCENARIOS: Scenario[] = [
  {
    id: 'ministry',
    label: 'Church & ministry',
    color: '#e8c34a',
    brief: 'A church that wants to hear every person who walks through the door.',
    system: {
      nodes: [
        { id: 'cards', c: 0, r: 0, t: 'Prayer cards', d: 'Handwritten and digital cards from services and events — the raw signal of who needs care.', tools: ['Paper cards', 'Web forms'] },
        { id: 'sermons', c: 0, r: 1, t: 'Sermon archive', d: 'Years of messages sitting in audio, video and notes that nobody can search.', tools: ['Audio', 'Transcripts'] },
        { id: 'people', c: 0, r: 2, t: 'Member profiles', d: 'Interests, stage of life and serving history, gathered with consent.', tools: ['ChMS export', 'Google Sheets'] },
        { id: 'intake', c: 1, r: 0, t: 'Intake pipeline', d: 'Scans, transcribes and tags every card so nothing sits in a pile on a desk.', tools: ['Python', 'OCR', 'n8n', 'AI agents'] },
        { id: 'embed', c: 1, r: 1, t: 'Meaning index', d: 'Sermons split into passages and embedded, so they can be searched by meaning instead of keywords.', tools: ['Embeddings', 'Vector DB'] },
        { id: 'queue', c: 2, r: 0, t: 'Care queue', d: 'Follow-ups prioritized and routed to the right pastor or volunteer, with context attached.', tools: ['n8n', 'Google Sheets'] },
        { id: 'search', c: 2, r: 1, t: 'Sermon search', d: 'Ask a real question, get the messages that answer it — with timestamps.', tools: ['RAG', 'Claude API', 'OpenRouter'] },
        { id: 'match', c: 2, r: 2, t: 'Mentor matching', d: 'A model suggests mentor pairings; staff review and make the call.', tools: ['Python', 'Neural nets'] },
        { id: 'o1', c: 3, r: 0, t: 'Timely follow-up', d: 'Every person who shares a need hears back from a real human.' },
        { id: 'o2', c: 3, r: 1, t: 'Answers on demand', d: 'Staff and members find the right teaching in seconds, not hours.' },
        { id: 'o3', c: 3, r: 2, t: 'Mentoring by design', d: 'Discipleship happens on purpose, not only when someone happens to notice.' },
      ],
      edges: [['cards', 'intake'], ['intake', 'queue'], ['queue', 'o1'], ['sermons', 'embed'], ['embed', 'search'], ['search', 'o2'], ['people', 'match'], ['match', 'o3'], ['people', 'queue']],
    },
    user: {
      nodes: [
        { id: 'u1', c: 0, r: 1, t: 'Visits on Sunday', d: 'A first-time guest fills out a prayer card on the way out.', feel: 'Curious, a little guarded.', behind: ['cards'] },
        { id: 'u2', c: 1, r: 0, t: 'Shares a need', d: 'Writes down something real — and drops it in the box.', feel: 'Hoping someone actually reads it.', behind: ['intake'] },
        { id: 'u3', c: 1, r: 2, t: 'Asks a question', d: 'Later that week, searches “what does the Bible say about anxiety?”', feel: 'Wants a real answer, not a sales pitch.', behind: ['sermons', 'embed'] },
        { id: 'u4', c: 2, r: 0, t: 'Gets a call', d: 'A pastor reaches out within days, already knowing what was shared.', feel: 'Seen.', behind: ['queue'] },
        { id: 'u5', c: 2, r: 2, t: 'Finds the message', d: 'Lands on the exact sermon and the minute it speaks to the question.', feel: 'Helped.', behind: ['search'] },
        { id: 'u6', c: 3, r: 1, t: 'Meets a mentor', d: 'Introduced to someone a few steps further down the same road.', feel: 'Belonging.', behind: ['people', 'match'] },
      ],
      edges: [['u1', 'u2'], ['u1', 'u3'], ['u2', 'u4'], ['u3', 'u5'], ['u4', 'u6'], ['u5', 'u6']],
    },
  },
  {
    id: 'trade',
    label: 'Trade & local business',
    color: '#6a82ff',
    brief: 'A trusted trade business with a great reputation offline — and almost none online.',
    system: {
      nodes: [
        { id: 'gbp', c: 0, r: 0, t: 'Business profile', d: 'Your Google Business Profile — recovered, verified and locked down.', tools: ['Google Business Profile'] },
        { id: 'photos', c: 0, r: 1, t: 'Field photos', d: 'Crews snap job photos from the truck. That’s the whole ask.', tools: ['Phone camera', 'Shared drive'] },
        { id: 'reviews', c: 0, r: 2, t: 'Customer reviews', d: 'Every review answered; new ones requested after each job.', tools: ['Google reviews'] },
        { id: 'schema', c: 1, r: 0, t: 'Structured data', d: 'Markup that tells search engines and AI assistants exactly what you do and where.', tools: ['Schema.org', 'AEO'] },
        { id: 'pipe', c: 1, r: 1, t: 'Content pipeline', d: 'Turns photos, job notes and reviews into posts, pages and replies — drafted automatically, approved by you.', tools: ['n8n', 'Claude API'] },
        { id: 'analytics', c: 1, r: 2, t: 'Analytics', d: 'Calls, clicks and form fills counted, so you know what’s working.', tools: ['GA4', 'Search Console'] },
        { id: 'social', c: 2, r: 1, t: 'Auto publishing', d: 'Posts go out on schedule without anyone needing to remember.', tools: ['n8n'] },
        { id: 'report', c: 2, r: 2, t: 'Monthly report', d: 'A plain-language summary of what moved and what to do next.', tools: ['GA4', 'Claude API'] },
        { id: 'o1', c: 3, r: 0, t: 'Found locally', d: 'Show up in the map pack — and in AI answers — for the jobs you want.' },
        { id: 'o2', c: 3, r: 1, t: 'Trusted first look', d: 'Recent work and real reviews do the selling before the phone rings.' },
        { id: 'o3', c: 3, r: 2, t: 'Decisions with data', d: 'Spend where it pays, stop where it doesn’t.' },
      ],
      edges: [['gbp', 'schema'], ['schema', 'o1'], ['photos', 'pipe'], ['reviews', 'pipe'], ['pipe', 'social'], ['social', 'o2'], ['gbp', 'analytics'], ['analytics', 'report'], ['report', 'o3']],
    },
    user: {
      nodes: [
        { id: 'u1', c: 0, r: 1, t: 'Searches nearby', d: 'Types “irrigation repair near me” — or asks an AI assistant.', feel: 'Needs it fixed this week.', behind: ['gbp', 'schema'] },
        { id: 'u2', c: 1, r: 0, t: 'Sees you first', d: 'You’re in the map pack, with photos from last Tuesday’s job.', feel: 'Interested.', behind: ['schema', 'social'] },
        { id: 'u3', c: 1, r: 2, t: 'Reads reviews', d: 'Recent reviews — and thoughtful replies to every one.', feel: 'Reassured.', behind: ['reviews', 'pipe'] },
        { id: 'u4', c: 2, r: 1, t: 'Requests a quote', d: 'Calls or fills out the form. You know exactly where they came from.', feel: 'Confident.', behind: ['analytics'] },
        { id: 'u5', c: 3, r: 0, t: 'Job done right', d: 'Gets a thank-you and a simple review request afterward.', feel: 'Valued.', behind: ['reviews'] },
        { id: 'u6', c: 3, r: 2, t: 'Refers a neighbor', d: 'Their review becomes the next customer’s reason to call.', feel: 'Proud to recommend you.', behind: ['reviews', 'report'] },
      ],
      edges: [['u1', 'u2'], ['u1', 'u3'], ['u2', 'u4'], ['u3', 'u4'], ['u4', 'u5'], ['u5', 'u6']],
    },
  },
  {
    id: 'agency',
    label: 'Agencies',
    color: '#8b63e8',
    brief: 'An agency where every staffer and contractor invented their own AI habits.',
    system: {
      nodes: [
        { id: 'tools', c: 0, r: 0, t: 'Current tools', d: 'Every AI tool staff and contractors already use — paid, free and forgotten.', tools: ['Inventory'] },
        { id: 'work', c: 0, r: 1, t: 'Client work', d: 'The deliverables, deadlines and promises that matter most.', tools: ['Briefs', 'SOWs'] },
        { id: 'know', c: 0, r: 2, t: 'Team know-how', d: 'What your best people already do well, written down for the first time.', tools: ['Interviews'] },
        { id: 'audit', c: 1, r: 0, t: 'Stack audit', d: 'What to keep, cut and consolidate — with the reasoning on paper.', tools: ['Stack review'] },
        { id: 'library', c: 1, r: 2, t: 'Use-case library', d: 'Proven prompts and workflows, captured once and reused by everyone.', tools: ['Skills', 'Prompt templates'] },
        { id: 'standard', c: 2, r: 1, t: 'AI standard', d: 'One documented practice for quality, privacy and review.', tools: ['Claude Projects', 'Privacy config'] },
        { id: 'training', c: 2, r: 2, t: 'Team training', d: 'Hands-on sessions on the use cases that hold up under client deadlines.', tools: ['Workshops', 'Plan Mode'] },
        { id: 'o1', c: 3, r: 0, t: 'Consistent craft', d: 'Every client gets the same quality, no matter who’s on the account.' },
        { id: 'o2', c: 3, r: 1, t: 'Defensible stack', d: 'A recommendation you can explain to your own clients.' },
        { id: 'o3', c: 3, r: 2, t: 'Self-sufficient team', d: 'Your people run it. No queue, no dependency on us.' },
      ],
      edges: [['tools', 'audit'], ['work', 'audit'], ['audit', 'standard'], ['know', 'library'], ['work', 'library'], ['library', 'standard'], ['standard', 'o1'], ['standard', 'o2'], ['library', 'training'], ['training', 'o3']],
    },
    user: {
      nodes: [
        { id: 'u1', c: 0, r: 1, t: 'Joins a project', d: 'A new contractor lands on an account with a tight deadline.', feel: 'Pressure.', behind: ['work'] },
        { id: 'u2', c: 1, r: 0, t: 'Gets the standard', d: 'One page: approved tools, privacy rules, how work gets reviewed.', feel: 'Oriented.', behind: ['standard', 'audit'] },
        { id: 'u3', c: 1, r: 2, t: 'Opens the library', d: 'Starts from proven prompts instead of a blank box.', feel: 'Equipped.', behind: ['library'] },
        { id: 'u4', c: 2, r: 1, t: 'Ships a draft', d: 'On brand and on time, reviewed the same way as everyone else’s.', feel: 'Confident.', behind: ['standard', 'training'] },
        { id: 'u5', c: 3, r: 1, t: 'Client signs off', d: 'The client sees one consistent standard across the whole team.', feel: 'Trusted.', behind: ['standard'] },
      ],
      edges: [['u1', 'u2'], ['u1', 'u3'], ['u2', 'u4'], ['u3', 'u4'], ['u4', 'u5']],
    },
  },
  {
    id: 'studio',
    label: 'Studios & ventures',
    color: '#38d6f5',
    brief: 'A studio shipping new products while staffing lives in someone’s memory.',
    system: {
      nodes: [
        { id: 'idea', c: 0, r: 0, t: 'Product idea', d: 'A sharp problem, and the people who have it.', tools: ['Discovery'] },
        { id: 'team', c: 0, r: 2, t: 'Team & skills', d: 'Who you have, what they’ve shipped and what they love to work on.', tools: ['Interviews'] },
        { id: 'proto', c: 1, r: 0, t: 'Prototype', d: 'Something clickable in weeks, in front of real users.', tools: ['Next.js'] },
        { id: 'inventory', c: 1, r: 2, t: 'Skills inventory', d: 'Your workforce mapped by skill, genre and experience.', tools: ['PostgreSQL', 'Google Sheets'] },
        { id: 'platform', c: 2, r: 0, t: 'Core platform', d: 'Data, accounts and payments on solid ground.', tools: ['PostgreSQL', 'Neon', 'Auth', 'Stripe'] },
        { id: 'loop', c: 2, r: 1, t: 'Usage insight', d: 'Real behavior tells you what to build next.', tools: ['Analytics'] },
        { id: 'staff', c: 2, r: 2, t: 'Smart staffing', d: 'Match the right people to each project in minutes.', tools: ['Search', 'Filters'] },
        { id: 'o1', c: 3, r: 0, t: 'Launched', d: 'Live, documented and monitored.', tools: ['Vercel', 'Render', 'Railway'] },
        { id: 'o2', c: 3, r: 1, t: 'Iterate', d: 'Ship, measure, improve — on repeat.' },
        { id: 'o3', c: 3, r: 2, t: 'Staffed fast', d: 'Staffing stops being a memory exercise.' },
      ],
      edges: [['idea', 'proto'], ['proto', 'platform'], ['platform', 'o1'], ['platform', 'loop'], ['loop', 'o2'], ['o2', 'proto', 'loop'], ['team', 'inventory'], ['inventory', 'staff'], ['staff', 'o3']],
    },
    user: {
      nodes: [
        { id: 'u1', c: 0, r: 1, t: 'Discovers the app', d: 'Hears about it from a creator, a friend or a search.', feel: 'Intrigued.', behind: ['o1'] },
        { id: 'u2', c: 1, r: 0, t: 'Signs up', d: 'Fast, secure onboarding with no dead ends.', feel: 'No friction.', behind: ['platform'] },
        { id: 'u3', c: 2, r: 0, t: 'First win', d: 'Gets to the core value in minutes, not days.', feel: 'Delighted.', behind: ['proto'] },
        { id: 'u4', c: 2, r: 2, t: 'Shapes the roadmap', d: 'How they use the product decides what gets built next.', feel: 'Heard.', behind: ['loop'] },
        { id: 'u5', c: 3, r: 1, t: 'Sticks around', d: 'It gets better every release, so they stay and subscribe.', feel: 'Invested.', behind: ['o2', 'platform'] },
      ],
      edges: [['u1', 'u2'], ['u2', 'u3'], ['u2', 'u4'], ['u3', 'u5'], ['u4', 'u5']],
    },
  },
]

const ICON_SYS = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="3.5" cy="4" r="1.8"/><circle cx="12.5" cy="12" r="1.8"/><circle cx="12.5" cy="4" r="1.8"/><path d="M5.3 4h5.4M3.5 5.8c0 4 4 6.2 7.2 6.2"/></svg>'
const ICON_USER = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="4.5" r="2.3"/><path d="M3 14c.4-2.8 2.5-4.4 5-4.4s4.6 1.6 5 4.4"/></svg>'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function edgeGeom(a: MapNode, b: MapNode, loop: boolean) {
  const ax = COLX[a.c], ay = ROWY[a.r], bx = COLX[b.c], by = ROWY[b.r]
  if (loop) {
    const mid = (ROWY[0] + ROWY[1]) / 2 + 2
    const x1 = ax, y1 = ay - NH / 2, x2 = bx, y2 = by + NH / 2
    return { d: `M${x1},${y1} C${x1},${mid - 10} ${x2 + 40},${mid + 6} ${x2},${y2}`, x1, y1, x2, y2 }
  }
  if (a.c === b.c) {
    const s = ay < by ? 1 : -1
    const y1 = ay + (s * NH) / 2, y2 = by - (s * NH) / 2
    return { d: `M${ax},${y1} C${ax},${y1 + s * 30} ${bx},${y2 - s * 30} ${bx},${y2}`, x1: ax, y1, x2: bx, y2 }
  }
  const x1 = ax + NW / 2, x2 = bx - NW / 2, dx = (x2 - x1) * 0.55
  return { d: `M${x1},${ay} C${x1 + dx},${ay} ${x2 - dx},${by} ${x2},${by}`, x1, y1: ay, x2, y2: by }
}

function init(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>('.nx-map-svg')!
  const panel = root.querySelector<HTMLElement>('.nx-map-panel')!
  const brief = root.querySelector<HTMLElement>('.nx-map-brief')!
  const tabs = root.querySelector<HTMLElement>('.nx-tabs')!
  const sw = root.querySelector<HTMLElement>('.nx-switch')!

  const params = new URLSearchParams(location.search)
  let scenario = SCENARIOS.find(s => s.id === params.get('map')) ?? SCENARIOS[0]
  let view: View = params.get('view') === 'user' ? 'user' : 'system'
  let selected = ''
  let renderId = 0

  // tabs
  tabs.innerHTML = SCENARIOS.map(
    s => `<button type="button" class="nx-tab" style="--c:${s.color}" data-s="${s.id}" aria-pressed="${s === scenario}"><span class="nx-dot" style="--c:${s.color}"></span>${esc(s.label)}</button>`
  ).join('')
  tabs.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-s]')
    if (!b || b.dataset.s === scenario.id) return
    scenario = SCENARIOS.find(s => s.id === b.dataset.s)!
    tabs.querySelectorAll('[data-s]').forEach(t => t.setAttribute('aria-pressed', String(t === b)))
    selected = ''
    swap()
  })

  // view switch
  const setSwitch = () => {
    sw.dataset.view = view
    sw.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.view === view)))
  }
  sw.querySelector<HTMLButtonElement>('[data-view="system"]')!.insertAdjacentHTML('afterbegin', ICON_SYS)
  sw.querySelector<HTMLButtonElement>('[data-view="user"]')!.insertAdjacentHTML('afterbegin', ICON_USER)
  sw.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-view]')
    if (!b || b.dataset.view === view) return
    view = b.dataset.view as View
    selected = ''
    setSwitch()
    swap()
  })
  sw.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    view = view === 'system' ? 'user' : 'system'
    selected = ''
    setSwitch()
    swap()
    sw.querySelector<HTMLButtonElement>(`[data-view="${view}"]`)!.focus()
  })
  setSwitch()

  const graph = () => scenario[view]
  const byId = (id: string, v: View = view) => scenario[v].nodes.find(n => n.id === id)

  function render() {
    const g = graph()
    const rid = ++renderId
    const heads = HEADS[view]
    let defs = `<filter id="nxMapBlur" filterUnits="userSpaceOnUse" x="-50" y="-50" width="${W + 100}" height="${H + 100}"><feGaussianBlur stdDeviation="3.2"/></filter>
      <filter id="nxMapBlurSm" filterUnits="userSpaceOnUse" x="-50" y="-50" width="${W + 100}" height="${H + 100}"><feGaussianBlur stdDeviation="1.1"/></filter>`
    let lanes = ''
    COLX.forEach((x, i) => {
      lanes += `<rect class="nx-lane" x="${x - NW / 2 - 18}" y="18" width="${NW + 36}" height="${H - 30}" rx="22"/>
        <line class="nx-col-line" x1="${x - 12}" y1="40" x2="${x + 12}" y2="40" stroke="${COLORS[i]}" filter="url(#nxMapBlurSm)"/>
        <line class="nx-col-line" x1="${x - 12}" y1="40" x2="${x + 12}" y2="40" stroke="${COLORS[i]}"/>
        <text class="nx-col-h" x="${x}" y="62" text-anchor="middle" fill="${COLORS[i]}">${heads[i]}</text>`
    })
    let edges = ''
    g.edges.forEach((e, i) => {
      const a = g.nodes.find(n => n.id === e[0])!, b = g.nodes.find(n => n.id === e[1])!
      const loop = e[2] === 'loop'
      const geo = edgeGeom(a, b, loop)
      const gid = `nxg${rid}-${i}`
      defs += `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${geo.x1}" y1="${geo.y1}" x2="${geo.x2 + 0.01}" y2="${geo.y2 + 0.01}"><stop offset="0" stop-color="${COLORS[a.c]}"/><stop offset="1" stop-color="${COLORS[b.c]}"/></linearGradient>`
      edges += `<g class="nx-edge${loop ? ' is-loop' : ''}" data-a="${a.id}" data-b="${b.id}" style="--i:${i}">
        <path class="nx-edge-glow" d="${geo.d}" stroke="url(#${gid})" filter="url(#nxMapBlur)"/>
        <path class="nx-edge-core" d="${geo.d}" stroke="url(#${gid})" pathLength="100"/>
        ${loop ? '' : `<path class="nx-edge-pulse" d="${geo.d}" pathLength="100"/>`}
      </g>`
    })
    let nodes = ''
    g.nodes.forEach((n, i) => {
      const x = COLX[n.c] - NW / 2, y = ROWY[n.r] - NH / 2
      nodes += `<g class="nx-node" data-id="${n.id}" tabindex="0" role="button" aria-label="${esc(heads[n.c] + ': ' + n.t)}" transform="translate(${x},${y})" style="--c:${COLORS[n.c]}">
        <g class="nx-node-in" style="--i:${i}">
          <rect class="nx-node-halo" width="${NW}" height="${NH}" rx="20" filter="url(#nxMapBlur)"/>
          <rect class="nx-node-box" width="${NW}" height="${NH}" rx="20"/>
          <circle class="nx-node-dot" cx="24" cy="${NH / 2}" r="7" opacity=".35" filter="url(#nxMapBlurSm)"/>
          <circle class="nx-node-dot" cx="24" cy="${NH / 2}" r="4.5"/>
          <text class="nx-node-t" x="40" y="${NH / 2 + 5}">${esc(n.t)}</text>
        </g>
      </g>`
    })
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    svg.innerHTML = `<defs>${defs}</defs><g>${lanes}</g><g>${edges}</g><g>${nodes}</g>`
    brief.innerHTML = `<strong>${esc(scenario.label)}:</strong> ${esc(scenario.brief)}`
    root.dataset.view = view
    if (!selected || !byId(selected)) selected = g.nodes[0].id
    select(selected, false)
  }

  function swap() {
    svg.classList.add('is-out')
    window.setTimeout(() => {
      render()
      svg.classList.remove('is-out')
    }, 220)
  }

  function related(id: string) {
    const set = new Set([id])
    graph().edges.forEach(e => {
      if (e[0] === id) set.add(e[1])
      if (e[1] === id) set.add(e[0])
    })
    return set
  }

  function focusOn(id: string | null) {
    if (!id) {
      svg.classList.remove('is-focus')
      svg.querySelectorAll('.is-hot').forEach(el => el.classList.remove('is-hot'))
      return
    }
    const rel = related(id)
    svg.classList.add('is-focus')
    svg.querySelectorAll<SVGGElement>('.nx-node').forEach(n => n.classList.toggle('is-hot', rel.has(n.dataset.id!)))
    svg.querySelectorAll<SVGGElement>('.nx-edge').forEach(e => e.classList.toggle('is-hot', e.dataset.a === id || e.dataset.b === id))
  }

  function select(id: string, animate = true) {
    selected = id
    svg.querySelectorAll<SVGGElement>('.nx-node').forEach(n => n.classList.toggle('is-sel', n.dataset.id === id))
    const n = byId(id)!
    const color = COLORS[n.c]
    const head = HEADS[view][n.c]
    let extra = ''
    if (view === 'user') {
      if (n.feel) extra += `<p class="nx-panel-feel"><span>How it feels</span>${esc(n.feel)}</p>`
      const behind = (n.behind ?? []).map(b => byId(b, 'system')).filter(Boolean) as MapNode[]
      if (behind.length)
        extra += `<p class="nx-panel-l">Powered by</p><div class="nx-chips">${behind
          .map(b => `<button type="button" class="nx-chip-btn" style="--c:${COLORS[b.c]}" data-jump="system:${b.id}"><span class="nx-dot" style="--c:${COLORS[b.c]}"></span>${esc(b.t)}</button>`)
          .join('')}</div>`
    } else {
      if (n.tools?.length) extra += `<p class="nx-panel-l">Typical tools</p><div class="nx-chips">${n.tools.map(t => `<span class="nx-chip">${esc(t)}</span>`).join('')}</div>`
      const felt = scenario.user.nodes.filter(u => u.behind?.includes(n.id))
      if (felt.length)
        extra += `<p class="nx-panel-l">Felt in the journey as</p><div class="nx-chips">${felt
          .map(u => `<button type="button" class="nx-chip-btn" style="--c:${COLORS[u.c]}" data-jump="user:${u.id}"><span class="nx-dot" style="--c:${COLORS[u.c]}"></span>${esc(u.t)}</button>`)
          .join('')}</div>`
    }
    const foot =
      view === 'system'
        ? 'Every map like this starts as a conversation. Compass maps it, Expedition builds it in your stack, Atlas runs it for you.'
        : 'We design for the person at the end of the system first, then build backward from what they need.'
    panel.innerHTML = `<div class="${animate ? 'nx-panel-in' : ''}" style="--c:${color}">
        <p class="nx-panel-k"><span class="nx-dot" style="--c:${color}"></span>${esc(head)}</p>
        <h3 class="nx-panel-t">${esc(n.t)}</h3>
        <p class="nx-panel-d">${esc(n.d)}</p>
        ${extra}
      </div>
      <div class="nx-panel-foot"><p>${foot}</p><a class="nx-link" href="start.html" style="--c:var(--nx-cyan)">Map your system with us <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a></div>`
  }

  // node interactions
  svg.addEventListener('pointerover', e => {
    const n = (e.target as Element).closest<SVGGElement>('.nx-node')
    focusOn(n ? n.dataset.id! : null)
  })
  svg.addEventListener('pointerleave', () => focusOn(null))
  svg.addEventListener('focusin', e => {
    const n = (e.target as Element).closest<SVGGElement>('.nx-node')
    if (n) focusOn(n.dataset.id!)
  })
  svg.addEventListener('focusout', () => focusOn(null))
  svg.addEventListener('click', e => {
    const n = (e.target as Element).closest<SVGGElement>('.nx-node')
    if (n) select(n.dataset.id!)
  })
  svg.addEventListener('keydown', e => {
    const n = (e.target as Element).closest<SVGGElement>('.nx-node')
    if (n && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      select(n.dataset.id!)
    }
  })

  // jump between views from the panel
  panel.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-jump]')
    if (!b) return
    const [v, id] = b.dataset.jump!.split(':') as [View, string]
    view = v
    selected = id
    setSwitch()
    swap()
  })

  render()
}

document.querySelectorAll<HTMLElement>('[data-system-map]').forEach(init)

export {}
