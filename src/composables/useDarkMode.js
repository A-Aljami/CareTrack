import { ref, watch, onMounted } from 'vue'

const isDarkMode = ref(false)

export function useDarkMode() {
  const toggleDarkMode = (event) => {
    isDarkMode.value = !isDarkMode.value

    // Get button position for circular reveal animation
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2

    // Calculate the distance to the farthest corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      updateTheme()
      return
    }

    // Start the view transition with circular reveal
    const transition = document.startViewTransition(() => {
      updateTheme()
    })

    transition.ready.then(() => {
      // Create circular clip-path animation
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 800,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  const updateTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const initializeDarkMode = () => {
    // Check localStorage or system preference
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      isDarkMode.value = savedMode === 'true'
    } else {
      // Check system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateTheme()
  }

  onMounted(() => {
    initializeDarkMode()
  })

  return {
    isDarkMode,
    toggleDarkMode
  }
}
