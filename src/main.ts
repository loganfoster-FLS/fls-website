declare global {
  interface Window {
    navigate: (page: string) => void
    goHome: () => void
    togglePhase: (el: HTMLElement) => void
    toggleRail: () => void
    collapseRail: () => void
    activatePrinciple: (card: HTMLElement) => void
    selectTier: (el: HTMLElement) => void
    submitForm: () => void
    toggleSideNav: () => void
  }
}

let currentPage: string = 'home'

function togglePhase(el: HTMLElement): void {
  const isOpen = el.classList.contains('open')
  document.querySelectorAll<HTMLElement>('.phase-item.open').forEach(i => i.classList.remove('open'))
  if (!isOpen) el.classList.add('open')
}

function toggleRail(): void {
  const rail = document.getElementById('icon-rail') as HTMLElement
  const overlay = document.getElementById('rail-overlay') as HTMLElement
  const expanded = rail.classList.toggle('expanded')
  overlay.classList.toggle('visible', expanded)
}

function collapseRail(): void {
  const rail = document.getElementById('icon-rail') as HTMLElement
  const overlay = document.getElementById('rail-overlay') as HTMLElement
  rail.classList.remove('expanded')
  overlay.classList.remove('visible')
}

function navigate(page: string): void {
  collapseRail()

  document.querySelectorAll<HTMLElement>('.page').forEach(p => {
    p.classList.remove('active')
    p.style.display = 'none'
  })

  const el = document.getElementById('page-' + page)
  if (el) {
    el.classList.add('active')
    el.style.display = page === 'home' ? 'flex' : 'block'
    currentPage = page
  }

  const isHome = page === 'home'

  document.getElementById('top-nav')?.classList.toggle('hidden', !isHome)

  const rail = document.getElementById('icon-rail') as HTMLElement
  const app = document.getElementById('app') as HTMLElement

  if (!isHome) {
    rail.classList.add('visible')
    app.classList.add('rail-shifted')
  } else {
    rail.classList.remove('visible')
    app.classList.remove('rail-shifted')
  }

  ;['about', 'portfolio', 'services'].forEach(p => {
    document.getElementById('rail-' + p)?.classList.toggle('active', p === page)
  })

  document.getElementById('rail-home')?.classList.toggle('active', isHome)
  document.getElementById('top-home')?.classList.toggle('active', isHome)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleSideNav(): void {
  // Legacy stub — retained for backward compatibility
}

function activatePrinciple(card: HTMLElement): void {
  if (card.classList.contains('active')) return
  document.querySelectorAll<HTMLElement>('.ps-card').forEach(c => c.classList.remove('active'))
  card.classList.add('active')
}

function goHome(): void {
  navigate('home')
}

function selectTier(el: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('.tier-option').forEach(t => t.classList.remove('selected'))
  el.classList.add('selected')
}

function submitForm(): void {
  const wrap = document.getElementById('contact-form-wrap') as HTMLElement | null
  const success = document.getElementById('form-success') as HTMLElement | null
  if (wrap) wrap.style.display = 'none'
  if (success) success.classList.add('show')
}

function staggerReveal(pageId: string): void {
  const page = document.getElementById(pageId)
  if (!page) return
  const selector =
    '.portfolio-card, .tier-card, .value-card, .phase-item, .tech-item, .project-info-block'
  const items = page.querySelectorAll<HTMLElement>(selector)
  items.forEach((item, i) => {
    item.style.opacity = '0'
    item.style.transform = 'translateY(20px)'
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    item.style.transitionDelay = `${i * 0.07}s`
    setTimeout(() => {
      item.style.opacity = '1'
      item.style.transform = 'translateY(0)'
    }, 50)
  })
}

const _nav = navigate
const navigateWithStagger = (page: string): void => {
  _nav(page)
  setTimeout(() => staggerReveal('page-' + page), 80)
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && currentPage !== 'home') goHome()
})

const FORM_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyH5CsJaxr4fUrdUXUgI3hWtbxoRO-JcQ56FP4gk3REnSxnFwi360yNodWTuC7ecJarVg/exec'

function showSuccessMessage(container: HTMLElement): void {
  const success = document.createElement('div')
  success.className = 'form-success show'
  success.innerHTML = `
    <div class="form-success-icon">✦</div>
    <div class="form-success-title">Transmission Received.</div>
    <div class="form-success-body">Your inquiry has been logged. We will reach out within one business day.</div>
  `
  container.appendChild(success)
}

document.addEventListener('DOMContentLoaded', () => {
  const form = (
    document.getElementById('project-form') ?? document.getElementById('contact-form')
  ) as HTMLFormElement | null
  if (!form) return

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault()

    const nameField = form.querySelector<HTMLInputElement>('#field-name')
    const emailField = form.querySelector<HTMLInputElement>('#field-email')
    const legalCheck = form.querySelector<HTMLInputElement>('#legal-acknowledge')
    let valid = true

    for (const field of [nameField, emailField]) {
      if (!field) continue
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(255,80,80,0.6)'
        valid = false
      } else {
        field.style.borderColor = ''
      }
    }

    if (legalCheck && !legalCheck.checked) {
      if (legalCheck.parentElement) legalCheck.parentElement.style.color = '#ff5050'
      valid = false
    } else if (legalCheck?.parentElement) {
      legalCheck.parentElement.style.color = ''
    }

    if (!valid) {
      alert('Please fill in all required fields and acknowledge the legal notice.')
      return
    }

    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!btn) return
    const originalText = btn.innerText
    btn.innerText = 'Sending...'
    btn.disabled = true

    fetch(FORM_SCRIPT_URL, { method: 'POST', body: new FormData(form) })
      .then(() => {
        form.style.display = 'none'
        if (form.parentElement) showSuccessMessage(form.parentElement)
      })
      .catch((error: Error) => {
        console.error('Submission error:', error.message)
        btn.innerText = originalText
        btn.disabled = false
        alert('Submission failed. Please check your connection and try again.')
      })
  })

  form.querySelectorAll<HTMLInputElement>('.field-input, .field-textarea').forEach(field => {
    field.addEventListener('input', function (this: HTMLInputElement) {
      this.style.borderColor = ''
    })
  })
})

// Expose to global scope for inline HTML event handlers
window.navigate = navigateWithStagger
window.goHome = goHome
window.togglePhase = togglePhase
window.toggleRail = toggleRail
window.collapseRail = collapseRail
window.activatePrinciple = activatePrinciple
window.selectTier = selectTier
window.submitForm = submitForm
window.toggleSideNav = toggleSideNav

export {}
