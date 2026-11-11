// Shared behavior for the neon pages (About / Services / Portfolio):
// scroll reveals. Pages add `class="js"` to <html> inline so content is only
// hidden when this script is actually going to reveal it.

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
