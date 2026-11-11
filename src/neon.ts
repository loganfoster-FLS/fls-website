// Shared behavior for the neon pages: scroll reveals.
// The `js` class is added here, not inline, so .nx-reveal content is only ever
// hidden when this module actually runs. If it fails to load, everything shows.
document.documentElement.classList.add('js')

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const items = document.querySelectorAll<HTMLElement>('.nx-reveal')

if (reduce || !('IntersectionObserver' in window)) {
  items.forEach(el => el.classList.add('is-in'))
} else {
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  )
  items.forEach(el => io.observe(el))
}

export {}
