import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import PromptCard from '../PromptCard.vue'

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve())
  }
})

const vuetify = createVuetify({
  components,
  directives
})

describe('PromptCard', () => {
  const mockPrompt = {
    id: 1,
    title: 'Test Prompt',
    instructions: 'Test instructions',
    content: 'Test content',
    tags: ['Test', 'Example'],
    favorite: false
  }

  const global = {
    plugins: [vuetify]
  }

  it('renders prompt data correctly', () => {
    const wrapper = mount(PromptCard, {
      props: { prompt: mockPrompt },
      global
    })

    expect(wrapper.text()).toContain('Test Prompt')
    expect(wrapper.text()).toContain('Test instructions')
    expect(wrapper.text()).toContain('Test content')
    expect(wrapper.text()).toContain('Test')
    expect(wrapper.text()).toContain('Example')
  })

  it('toggles favorite status', async () => {
    const wrapper = mount(PromptCard, {
      props: { prompt: { ...mockPrompt } },
      global
    })

    const favoriteButton = wrapper.find('.v-btn')
    await favoriteButton.trigger('click')

    expect(mockPrompt.favorite).toBe(true)
  })

  it('copies content to clipboard', async () => {
    const wrapper = mount(PromptCard, {
      props: { prompt: mockPrompt },
      global
    })

    const copyButtons = wrapper.findAll('.v-btn').filter(btn =>
      btn.text().includes('Copy')
    )

    // Copy Content button
    await copyButtons[0].trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test content')

    // Copy All button
    await copyButtons[1].trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Test Prompt\n\nTest instructions\n\nTest content'
    )
  })

  it('shows/hides full content', async () => {
    const longContent = 'A'.repeat(150)
    const wrapper = mount(PromptCard, {
      props: {
        prompt: { ...mockPrompt, content: longContent }
      },
      global
    })

    const showMoreButton = wrapper.find('.v-btn').filter(btn =>
      btn.text().includes('Show more')
    )

    expect(showMoreButton.exists()).toBe(true)

    await showMoreButton.trigger('click')

    expect(wrapper.text()).toContain('Show less')
  })
})