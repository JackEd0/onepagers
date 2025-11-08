import { Client } from '@notionhq/client'

const notion = new Client({
  auth: import.meta.env.VITE_NOTION_API_KEY
})

const DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID

export const fetchPrompts = async () => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'Created',
          direction: 'descending'
        }
      ]
    })

    return response.results.map(page => {
      const properties = page.properties

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        instructions: properties.Instructions?.rich_text?.[0]?.plain_text || '',
        content: properties.Content?.rich_text?.[0]?.plain_text || '',
        tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
        favorite: properties.Favorite?.checkbox || false,
        created: properties.Created?.created_time || page.created_time
      }
    })
  } catch (error) {
    console.error('Error fetching prompts from Notion:', error)
    throw error
  }
}

export const getAllTags = (prompts) => {
  const tagCount = {}

  prompts.forEach(prompt => {
    prompt.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export default {
  fetchPrompts,
  getAllTags
}