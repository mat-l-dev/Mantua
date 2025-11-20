'use client'

import { useEffect, useState } from 'react'

/**
 * Apple Design System - Animation Hooks
 * Provides reusable animation utilities for component interactions
 */

/**
 * Hook for staggered animation of list items
 * @param itemsCount - Number of items to stagger
 * @param delayMs - Delay between items in milliseconds
 */
export function useStaggeredItems(itemsCount: number, delayMs: number = 50) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  useEffect(() => {
    // Stagger visibility of items
    const timers = Array.from({ length: itemsCount }, (_, i) =>
      setTimeout(() => {
        setVisibleItems(prev => [...prev, i])
      }, i * delayMs)
    )

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [itemsCount, delayMs])

  return visibleItems
}

/**
 * Hook for intersection observer (animate on scroll into view)
 */
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, {
      threshold: 0.1,
      ...options,
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref, options])

  return isVisible
}

/**
 * Hook for ripple effect on click
 */
export function useRippleEffect(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleClick = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const size = Math.max(rect.width, rect.height)

      const ripple = document.createElement('span')
      ripple.style.position = 'absolute'
      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x - size / 2 + 'px'
      ripple.style.top = y - size / 2 + 'px'
      ripple.style.borderRadius = '50%'
      ripple.style.background = 'rgba(0, 122, 255, 0.3)'
      ripple.style.pointerEvents = 'none'
      ripple.style.animation = 'ripple 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'

      element.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())
    }

    element.addEventListener('click', handleClick)
    return () => element.removeEventListener('click', handleClick)
  }, [ref])
}
